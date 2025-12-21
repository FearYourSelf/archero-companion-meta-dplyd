
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Send, BrainCircuit, Loader2, Heart, Calculator, 
  Crown, Ghost, Target, PawPrint as Dog, Book, Egg, Landmark as Tower, Flame,
  Circle, LayoutDashboard, Trophy, AlertTriangle, TrendingUp,
  ScrollText, Gem, LayoutGrid, Award, HelpCircle, ArrowUpRight, X, Sparkles, 
  ChevronRight, ChevronLeft, Info, FlaskConical, Layers, Star,
  Tag, MapPin, Activity, Dna, ClipboardCheck, Terminal, BookOpen, Wrench, Save, Download, Trash2,
  CheckCircle2, Swords, Calendar, Construction, ArrowRightLeft, RefreshCw, HelpCircle as HelpIcon,
  Database
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, FARMING_ROUTES 
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, SavedBuild } from './types';
import { Badge, Card } from './components/UI';

// --- Improved Mouse-Following Tooltip ---
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!visible) return;
    const offset = 15;
    let x = e.clientX + offset;
    let y = e.clientY + offset;
    const margin = 20;

    const width = tooltipRef.current?.offsetWidth || 200;
    const height = tooltipRef.current?.offsetHeight || 60;

    if (x + width > window.innerWidth - margin) x = e.clientX - width - offset;
    if (y + height > window.innerHeight - margin) y = e.clientY - height - offset;

    setCoords({ x, y });
  };

  return (
    <div 
      onMouseEnter={() => setVisible(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setVisible(false)}
      className="inline-flex items-center justify-center cursor-help"
    >
      {children}
      {visible && (
        <div 
          ref={tooltipRef}
          style={{ 
            position: 'fixed', 
            left: `${coords.x}px`, 
            top: `${coords.y}px`, 
            pointerEvents: 'none',
            zIndex: 10000,
          }}
          className="px-4 py-3 bg-gray-900/98 border border-orange-500/40 text-white text-[11px] font-medium rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-75 ring-1 ring-white/10"
        >
          {text}
        </div>
      )}
    </div>
  );
};

const TOUR_STEPS = [
  { target: 'tour-header', title: 'Grandmaster V3.0', content: 'Uplink complete. The full 2025 database and advanced tool suite are now active.' },
  { target: 'tour-nav-meta', title: 'Meta Terminal', content: 'Access the latest Tier Lists for 2025. Use "Deep Dive" for hidden mechanics.', tab: 'meta' },
  { target: 'tour-nav-tracker', title: 'Global Tracker', content: 'Mark your heroes as Level 120 to see cumulative global stat bonuses applied to your account.', tab: 'tracker' },
  { target: 'tour-nav-analyze', title: 'Synergy Simulator', content: 'Runs a high-level AI simulation to find the best gear for high-level Chapters (80+).', tab: 'analyze' },
  { target: 'tour-nav-dps', title: 'Burst Metric', content: 'A raw math calculator to determine your actual effective DPS based on Crit and Speed.', tab: 'dps' },
  { target: 'tour-nav-immunity', title: 'Immunity Engine', content: 'The only tool that calculates the exact Projectile Resistance % needed for the 100% cap.', tab: 'immunity' },
  { target: 'tour-nav-vs', title: 'VS Comparator', content: 'Select two items to compare their tier rankings and strategist notes side-by-side.', tab: 'vs' },
  { target: 'tour-nav-calendar', title: 'Temporal Sync', content: 'Never miss an event. Syncs with server time to show active daily chapters.', tab: 'calendar' },
  { target: 'tour-nav-estate', title: 'Estate ROI', content: 'Optimize your worker assignment for Iron, Scrolls, and Gold yields.', tab: 'estate' },
  { target: 'tour-nav-data', title: 'Mastery Archive', content: 'A spreadsheet view of all hero global bonuses and item tiers.', tab: 'data' },
  { target: 'tour-nav-ai', title: 'Oracle AI Chat', content: 'A persistent, context-aware AI strategist. Ask for specific build advice here.', tab: 'ai' },
  { target: 'tour-nav-help', title: 'Mission Complete', content: 'You can restart this walkthrough anytime by clicking this Help icon in the header.' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'tracker' | 'analyze' | 'dps' | 'vs' | 'immunity' | 'calendar' | 'estate' | 'data' | 'ai'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('All');
  const [isGodTierOnly, setIsGodTierOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItem | Hero | null>(null);
  
  // Persistence states
  const [unlockedHeroes, setUnlockedHeroes] = useState<Record<string, { lv60: boolean, lv120: boolean }>>(() => 
    JSON.parse(localStorage.getItem('archero_tracker') || '{}')
  );
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => 
    JSON.parse(localStorage.getItem('archero_chat_v3') || '[]')
  );
  const [calcStats, setCalcStats] = useState<CalcStats>(() => 
    JSON.parse(localStorage.getItem('archero_stats_v3') || '{"baseAtk":50000,"critChance":40,"critDmg":350,"atkSpeed":50,"weaponType":"Demon Blade"}')
  );

  // Tools states
  const [vsItemA, setVsItemA] = useState<string>(GEAR_DATA[0].id);
  const [vsItemB, setVsItemB] = useState<string>(GEAR_DATA[1].id);
  const [immunitySetup, setImmunitySetup] = useState({ rings: 0, armor: 'none', locket: 'none', atreus120: false, onir7star: false, lowHP: false });
  const [workers, setWorkers] = useState<Record<string, number>>({ iron: 5, scrolls: 5, gold: 5 });
  const [simResult, setSimResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [buildHero, setBuildHero] = useState<string>(HERO_DATA[0].id);

  // UI/AI states
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Onboarding states
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  // Lockdown Effects
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12
      if (e.key === 'F12') e.preventDefault();
      // Disable Ctrl+Shift+I (and J, C)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) e.preventDefault();
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key.toLowerCase() === 'u') e.preventDefault();
      // Disable Ctrl+S (Save)
      if (e.ctrlKey && e.key.toLowerCase() === 's') e.preventDefault();
      
      // Disable Copy/Paste/Cut unless focused on an input
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.ctrlKey && !isInput && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'v' || e.key.toLowerCase() === 'x')) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('archero_tracker', JSON.stringify(unlockedHeroes));
  }, [unlockedHeroes]);

  useEffect(() => {
    localStorage.setItem('archero_chat_v3', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('archero_stats_v3', JSON.stringify(calcStats));
  }, [calcStats]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('archero_tour_seen_v3_final_bubble_clamping');
    if (!hasSeenTour) {
      handleStartTour();
      localStorage.setItem('archero_tour_seen_v3_final_bubble_clamping', 'true');
    }
  }, []);

  useEffect(() => {
    if (isTourActive) {
      const step = TOUR_STEPS[tourStep];
      if (step.tab) setActiveTab(step.tab as any);
      
      const el = document.getElementById(step.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setSpotlightRect(el.getBoundingClientRect()), 400);
      }
    } else {
      setSpotlightRect(null);
    }
  }, [isTourActive, tourStep]);

  useEffect(() => {
    if (activeTab === 'ai') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiLoading, activeTab]);

  const handleStartTour = () => {
    setTourStep(0);
    setIsTourActive(true);
  };

  const filteredData = useMemo(() => {
    const combined = [...HERO_DATA, ...GEAR_DATA];
    return combined.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesGod = !isGodTierOnly || item.tier === 'SSS';
      return matchesSearch && matchesCategory && matchesGod;
    });
  }, [searchQuery, categoryFilter, isGodTierOnly]);

  const calculateGlobalStats = () => {
    const totals: Record<string, number> = {};
    HERO_DATA.forEach(h => {
      if (unlockedHeroes[h.id]?.lv120) {
        const bonus = h.globalBonus120;
        const match = bonus.match(/([+-]?\d+)%?\s*(.*)/);
        if (match) {
          const val = parseInt(match[1]);
          const stat = match[2].trim() || 'General';
          totals[stat] = (totals[stat] || 0) + val;
        }
      }
    });
    return totals;
  };

  const calculatedDPS = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    return Math.round(baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + (atkSpeed / 100)));
  }, [calcStats]);

  const getImmunityStats = () => {
    let projResist = 0;
    projResist += immunitySetup.rings * 12;
    if (immunitySetup.armor === 'c_warplate') projResist += 15;
    if (immunitySetup.armor === 'p_cloak') projResist += 10;
    if (immunitySetup.locket === 'b_locket') projResist += immunitySetup.lowHP ? 30 : 10;
    if (immunitySetup.atreus120) projResist += 7;
    if (immunitySetup.onir7star) projResist += 10;
    return { projResist };
  };

  const getDailyEvents = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const events: Record<string, string> = {
      'Monday': 'Flying Bullets (Gear/Scrolls)',
      'Thursday': 'Flying Bullets (Gear/Scrolls)',
      'Tuesday': 'Ancient Maze (Soulstones)',
      'Friday': 'Ancient Maze (Soulstones)',
      'Wednesday': 'Up-Close Dangers (Gold/XP)',
      'Saturday': 'Up-Close Dangers (Gold/XP)',
      'Sunday': 'All Events Open'
    };
    return { today, event: events[today] || 'Standard rotation active.' };
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const msg = aiInput; setAiInput('');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, timestamp: Date.now() }]);
    setIsAiLoading(true);
    try {
      const response = await chatWithAI(msg, chatHistory.map(h => ({ role: h.role, text: h.text })));
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'Uplink Failed.', timestamp: Date.now() }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Archives Offline.', timestamp: Date.now() }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Perform a Deep Simulation for ${hero?.name} with ${calcStats.baseAtk} ATK. Determine optimal Chapter 80+ loadout.`;
    try {
      const response = await chatWithAI(prompt, []);
      setSimResult(response || 'Simulation data corrupted.');
    } catch (e) {
      setSimResult('Connection to Sim Core failed.');
    } finally {
      setIsSimulating(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Purge Neural History? This will clear all previous conversation context.")) {
      setChatHistory([]);
    }
  };

  const formatStrategy = (text: string) => {
    return text.split('\n').filter(l => l.trim()).map((line, i) => (
      <div key={i} className="flex gap-2 mb-1 last:mb-0">
        <span className="text-orange-500 font-black">•</span>
        <span className="flex-1">{line.replace(/^•\s*/, '')}</span>
      </div>
    ));
  };

  // --- Render Tabs ---
  const renderTracker = () => {
    const globalStats = calculateGlobalStats();
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 bg-orange-600/10 border border-orange-500/20 rounded-[2rem]">
          <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={14}/> Neural Stat Synthesis</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(globalStats).map(([stat, val]) => (
              <div key={stat} className="p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[8px] font-black text-gray-500 uppercase">{stat}</p>
                <p className="text-xl font-black text-white">+{val}{stat.includes('HP') || stat.includes('Atk') || stat.includes('Dmg') ? '%' : ''}</p>
              </div>
            ))}
            {Object.keys(globalStats).length === 0 && <p className="col-span-2 text-center text-[10px] text-gray-500 uppercase py-4 font-bold tracking-widest">Archive Empty. Check Masteries below.</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {HERO_DATA.map(h => (
            <div key={h.id} className="p-4 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
              <div className="flex items-center gap-3">
                <Badge tier={h.tier} /><span className="text-xs font-black text-white uppercase italic">{h.name}</span>
              </div>
              <button onClick={() => setUnlockedHeroes(prev => ({ ...prev, [h.id]: { ...prev[h.id], lv120: !prev[h.id]?.lv120 } }))} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${unlockedHeroes[h.id]?.lv120 ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-600 border border-white/5'}`}>Lv 120</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVs = () => {
    const itemA = [...HERO_DATA, ...GEAR_DATA].find(i => i.id === vsItemA);
    const itemB = [...HERO_DATA, ...GEAR_DATA].find(i => i.id === vsItemB);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <select value={vsItemA} onChange={e => setVsItemA(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none">
            {[...HERO_DATA, ...GEAR_DATA].map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <select value={vsItemB} onChange={e => setVsItemB(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none">
            {[...HERO_DATA, ...GEAR_DATA].map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        <div className="p-8 bg-gray-900/50 border border-white/5 rounded-[3rem] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"><Swords size={180}/></div>
          <div className="grid grid-cols-2 gap-8 text-center relative z-10">
            <div>
              <h5 className="text-lg font-black text-white uppercase italic mb-2">{itemA?.name}</h5>
              <Badge tier={itemA?.tier || 'F'} />
              <p className="mt-4 text-[10px] text-gray-400 italic leading-relaxed">{itemA?.desc}</p>
            </div>
            <div>
              <h5 className="text-lg font-black text-white uppercase italic mb-2">{itemB?.name}</h5>
              <Badge tier={itemB?.tier || 'F'} />
              <p className="mt-4 text-[10px] text-gray-400 italic leading-relaxed">{itemB?.desc}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderImmunity = () => {
    const { projResist } = getImmunityStats();
    return (
      <div className="space-y-6">
        <div className="p-8 bg-gray-900 border-2 border-white/5 rounded-[3rem] text-center shadow-4xl relative overflow-hidden">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Immunity Progress</p>
          <div className="text-6xl font-black text-white italic tracking-tighter mb-4">{projResist}%</div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-orange-500 transition-all duration-1000 shadow-[0_0_15px_rgba(249,115,22,0.5)]" style={{ width: `${Math.min(projResist, 100)}%` }}></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[{ label: 'Dragon Rings', v: immunitySetup.rings, set: (v: number) => setImmunitySetup(s => ({ ...s, rings: v })), opts: [0, 1, 2] }].map(c => (
            <div key={c.label} className="p-4 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase">{c.label}</span>
              <div className="flex gap-2">
                {c.opts.map(o => <button key={o} onClick={() => c.set(o)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${c.v === o ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500'}`}>{o}</button>)}
              </div>
            </div>
          ))}
          <button onClick={() => setImmunitySetup(s => ({ ...s, lowHP: !s.lowHP }))} className={`p-4 border rounded-2xl text-[9px] font-black uppercase transition-all ${immunitySetup.lowHP ? 'bg-red-600 text-white border-red-400' : 'bg-white/5 text-gray-500 border-white/5'}`}>Under 25% HP Boost (+20% Proj Resist)</button>
        </div>
      </div>
    );
  };

  const renderSimulation = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div id="tour-nav-analyze" className="bg-gray-900/50 border border-white/5 p-6 rounded-[2.5rem] space-y-5">
        <h4 className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2 tracking-widest"><BrainCircuit size={14}/> Synergy Simulator</h4>
        <div className="space-y-4">
          <label className="text-[8px] font-black text-gray-600 uppercase">Select Hero Profile</label>
          <select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none">
            {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          <button onClick={runSimulation} disabled={isSimulating} className="w-full py-4 bg-orange-600 rounded-xl text-[9px] font-black uppercase text-white shadow-lg active:scale-95 transition-all">
            {isSimulating ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Execute Neural Report'}
          </button>
          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
            <p className="text-[9px] text-orange-400 font-bold flex items-center gap-2"><Info size={12}/> NOTE: High-fidelity simulation requires 5-15 seconds for complete neural synthesis.</p>
          </div>
        </div>
      </div>
      {simResult && <div className="p-6 bg-gray-900 border border-orange-500/20 rounded-[2rem] text-[10px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap shadow-2xl">{simResult}</div>}
    </div>
  );

  const renderDPS = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div id="tour-nav-dps" className="p-8 bg-gray-900/80 rounded-[2.5rem] border border-white/10 text-center shadow-2xl">
        <p className="text-[8px] font-black text-gray-500 uppercase mb-1.5 tracking-[0.2em]">Burst Metric</p>
        <div className="text-5xl font-black text-white italic tracking-tighter">{calculatedDPS.toLocaleString()}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: 'baseAtk', l: 'Base ATK' }, { k: 'critChance', l: 'Crit %' },
          { k: 'critDmg', l: 'Crit DMG %' }, { k: 'atkSpeed', l: 'Atk Speed %' }
        ].map(s => (
          <div key={s.k} className="p-4 bg-white/5 border border-white/5 rounded-xl">
            <label className="text-[7px] font-black text-gray-500 uppercase block mb-1">{s.l}</label>
            <input type="number" value={calcStats[s.k as keyof CalcStats] as number} onChange={e => setCalcStats(p => ({ ...p, [s.k]: Number(e.target.value) }))} className="bg-transparent text-white text-base font-black outline-none w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => {
    const { today, event } = getDailyEvents();
    return (
      <div id="tour-nav-calendar" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 bg-gray-900 border border-white/5 rounded-[3rem] text-center shadow-4xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center"><Calendar size={180}/></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Temporal Sync: {today}</p>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{event}</h3>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-gray-400 font-medium leading-relaxed">
              Standard server reset occurs at 00:00 UTC.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {FARMING_ROUTES.map((route, idx) => (
            <div key={idx} className="p-4 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">{route.chapter}</p>
                <p className="text-xs font-black text-white italic">{route.resource}</p>
              </div>
              <p className="text-[10px] text-orange-500 font-bold max-w-[50%] text-right">{route.note}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEstate = () => {
    return (
      <div id="tour-nav-estate" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 bg-gray-900 border border-white/5 rounded-[3rem] text-center shadow-4xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center"><Tower size={180}/></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Resource ROI Core</p>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Estate Management</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(workers).map(([key, val]) => (
            <div key={key} className="p-5 bg-gray-900 border border-white/5 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl text-orange-500"><Wrench size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase italic">{key} Exchange</p>
                  <p className="text-[8px] text-gray-500 font-bold uppercase">Operatives</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setWorkers(prev => ({ ...prev, [key]: Math.max(0, (val as number) - 1) }))} className="p-2 bg-white/5 rounded-xl text-gray-400">-</button>
                <span className="text-lg font-black text-white w-8 text-center">{val}</span>
                <button onClick={() => setWorkers(prev => ({ ...prev, [key]: (val as number) + 1 }))} className="p-2 bg-orange-600 rounded-xl text-white">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderData = () => (
    <div id="tour-nav-data" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-black italic text-white uppercase tracking-tighter text-center">Mastery Archive</h2>
      <div className="bg-gray-900 border border-white/5 rounded-[2rem] overflow-hidden">
        <table className="w-full text-[10px]">
          <thead className="bg-white/5 text-gray-500 uppercase text-left">
            <tr><th className="p-4">Item</th><th className="p-4">Category</th><th className="p-4 text-right">Tier</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[...HERO_DATA, ...GEAR_DATA].map(h => (
              <tr key={h.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedItem(h)}>
                <td className="p-4 font-black text-white italic">{h.name}</td>
                <td className="p-4 text-orange-500 font-bold uppercase tracking-widest text-[8px]">{h.category}</td>
                <td className="p-4 text-right"><Badge tier={h.tier} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto relative overflow-x-hidden pb-32">
      
      {/* Smart Walkthrough Tutorial UI with Screen-Clamping fix */}
      {isTourActive && (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
          <svg className="absolute inset-0 w-full h-full pointer-events-auto">
            <mask id="tour-mask-v3">
              <rect width="100%" height="100%" fill="white"/><rect x={(spotlightRect?.left||0)-12} y={(spotlightRect?.top||0)-12} width={(spotlightRect?.width||0)+24} height={(spotlightRect?.height||0)+24} rx="30" fill="black" />
            </mask>
            <rect width="100%" height="100%" fill="rgba(2, 6, 23, 0.94)" mask="url(#tour-mask-v3)" />
            {spotlightRect && <rect x={spotlightRect.left-12} y={spotlightRect.top-12} width={spotlightRect.width+24} height={spotlightRect.height+24} rx="30" fill="none" stroke="#f97316" strokeWidth="3" className="animate-pulse" />}
          </svg>
          
          {spotlightRect && (
            <div 
              style={{ 
                position: 'fixed', 
                left: '16px',
                right: '16px',
                width: 'auto',
                maxWidth: '440px',
                margin: '0 auto', 
                top: spotlightRect.top < window.innerHeight / 2 ? spotlightRect.bottom + 20 : spotlightRect.top - 20,
                transform: spotlightRect.top < window.innerHeight / 2 ? 'none' : 'translateY(-100%)',
              }} 
              className="transition-all duration-500 pointer-events-auto z-[10001]"
            >
              <div className="bg-gray-900 border-2 border-orange-500/50 rounded-[2.5rem] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.7)] space-y-4 relative">
                <div 
                  style={{
                    left: `${Math.min(Math.max(spotlightRect.left + spotlightRect.width / 2 - 16, 20), window.innerWidth - 52)}px`,
                  }}
                  className={`absolute w-4 h-4 bg-gray-900 border-l-2 border-t-2 border-orange-500/50 rotate-45 ${spotlightRect.top < window.innerHeight / 2 ? '-top-2.5' : '-bottom-2.5 border-l-0 border-t-0 border-r-2 border-b-2'}`}
                />
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3"><Sparkles className="text-orange-500 w-5 h-5"/><h4 className="text-white font-black uppercase italic text-base tracking-tight">{TOUR_STEPS[tourStep].title}</h4></div>
                  <button onClick={() => setIsTourActive(false)} className="p-1 text-gray-600 hover:text-white transition-colors"><X size={18}/></button>
                </div>
                <p className="text-gray-300 text-[13px] font-semibold leading-relaxed">{TOUR_STEPS[tourStep].content}</p>
                <div className="flex gap-3 pt-2">
                  <button disabled={tourStep === 0} onClick={() => setTourStep(tourStep-1)} className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase transition-all ${tourStep === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Back</button>
                  <button onClick={() => tourStep < TOUR_STEPS.length - 1 ? setTourStep(tourStep+1) : setIsTourActive(false)} className="flex-[2] py-3 bg-orange-600 text-white rounded-2xl text-[9px] font-black uppercase shadow-lg shadow-orange-900/20 active:scale-95">{tourStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next Step'}</button>
                </div>
                <div className="flex justify-center gap-1">
                  {TOUR_STEPS.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === tourStep ? 'w-4 bg-orange-500' : 'w-1 bg-white/10'}`} />)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <header id="tour-header" className="sticky top-0 z-[100] bg-gray-950/90 backdrop-blur-2xl border-b border-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><Trophy className="text-orange-500 w-7 h-7" /><div><h1 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">ZA ARMORY V3</h1><p className="text-[8px] text-orange-500 font-bold tracking-[0.3em] uppercase mt-1">Global Meta Protocol</p></div></div>
          <div className="flex items-center gap-2">
            <Tooltip text="Restart App Walkthrough"><button id="tour-nav-help" onClick={handleStartTour} className="p-3 bg-white/5 text-gray-500 hover:text-orange-500 rounded-xl transition-all"><HelpIcon size={18} /></button></Tooltip>
            <Tooltip text="Purge AI Conversation Context"><button onClick={clearChat} className="p-3 bg-white/5 text-gray-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button></Tooltip>
            <Tooltip text="Meta Terminal"><button id="tour-nav-meta" onClick={() => setActiveTab('meta')} className={`p-3 rounded-xl transition-all ${activeTab === 'meta' ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500'}`}><LayoutGrid size={18} /></button></Tooltip>
          </div>
        </div>
        {activeTab === 'meta' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="text" placeholder="Decode data stream..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-orange-500/40" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['All', 'Hero', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book', 'Dragon', 'Spirit', 'Pet'].map(cat => <button key={cat} onClick={() => setCategoryFilter(cat as any)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all flex-shrink-0 ${categoryFilter === cat ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-gray-600 border border-white/5 hover:text-white'}`}>{cat}</button>)}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 px-5 py-6">
        {activeTab === 'meta' && (
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map(item => (
              <Card key={item.id} tier={item.tier}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2"><Badge tier={item.tier} />{item.isGodTier && <Crown size={14} className="text-yellow-500 animate-pulse"/>}</div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-tight mb-1">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-relaxed h-[30px]">{item.desc}</p>
                  <button onClick={() => setSelectedItem(item)} className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all">Deep Dive</button>
                </div>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'tracker' && renderTracker()}
        {activeTab === 'analyze' && renderSimulation()}
        {activeTab === 'dps' && renderDPS()}
        {activeTab === 'data' && renderData()}
        {activeTab === 'vs' && renderVs()}
        {activeTab === 'immunity' && renderImmunity()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'estate' && renderEstate()}
        {activeTab === 'ai' && (
          <div id="tour-nav-ai-panel" className="flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 no-scrollbar pr-1">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30">
                  <BrainCircuit size={48} className="text-orange-500" /><p className="text-[10px] font-bold uppercase tracking-widest">Oracle System Standby.</p>
                </div>
              )}
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-semibold leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-800 border border-white/5 text-gray-300 rounded-tl-none'}`}>
                    {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="text-[8px] font-black text-orange-500 animate-pulse uppercase tracking-[0.2em] flex items-center gap-2 px-2"><Loader2 size={10} className="animate-spin" /> Mining archives...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2.5 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-xl">
              <input type="text" placeholder="Query the strategist..." className="flex-1 bg-transparent px-4 text-xs font-bold outline-none text-white placeholder:text-gray-700" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} />
              <button onClick={handleAiSend} className="bg-orange-600 p-3 rounded-xl shadow-lg active:scale-90 transition-transform"><Send size={18} className="text-white"/></button>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] w-[95%] max-w-xl">
        <div className="bg-gray-950/98 backdrop-blur-3xl border border-white/10 p-2 rounded-full flex justify-between items-center shadow-4xl ring-1 ring-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'meta', icon: LayoutGrid, label: 'Meta', tip: 'Archives Terminal' },
            { id: 'tracker', icon: Target, label: 'Stats', tourId: 'tour-nav-tracker', tip: 'Global Buff Synthesis' },
            { id: 'analyze', icon: BrainCircuit, label: 'Sim', tourId: 'tour-nav-analyze', tip: 'Synergy Simulator' },
            { id: 'dps', icon: Calculator, label: 'DPS', tourId: 'tour-nav-dps', tip: 'Burst Calculator' },
            { id: 'immunity', icon: Shield, label: 'True', tourId: 'tour-nav-immunity', tip: 'Immunity Engine' },
            { id: 'vs', icon: ArrowRightLeft, label: 'Vs', tourId: 'tour-nav-vs', tip: 'Operator Comparison' },
            { id: 'calendar', icon: Calendar, label: 'Events', tourId: 'tour-nav-calendar', tip: 'Daily Rotation Sync' },
            { id: 'estate', icon: Tower, label: 'Estate', tourId: 'tour-nav-estate', tip: 'Resource ROI Core' },
            { id: 'data', icon: Database, label: 'Data', tourId: 'tour-nav-data', tip: 'Global Registry Archive' },
            { id: 'ai', icon: MessageSquare, label: 'Ask', tourId: 'tour-nav-ai', tip: 'Oracle AI Strategist' },
          ].map(t => (
            <Tooltip key={t.id} text={t.tip}>
              <button key={t.id} id={t.tourId} onClick={() => setActiveTab(t.id as any)} className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-3 rounded-full transition-all duration-300 ${activeTab === t.id ? 'text-orange-500 bg-white/5' : 'text-gray-500 hover:text-gray-400'}`}>
                <t.icon size={18} />
                <span className="text-[7px] font-black uppercase tracking-tight">{t.label}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </nav>

      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full bg-gray-950 border-t border-orange-500/20 rounded-t-[3rem] p-6 sm:p-10 max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-10 shadow-4xl">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2"><Badge tier={selectedItem.tier} /><span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{selectedItem.category} Class</span></div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">{selectedItem.name}</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={24}/></button>
            </div>

            <div className="space-y-8 pb-12">
               <div className="grid grid-cols-2 gap-3">
                 {(selectedItem as Hero).shardCost && (
                   <Tooltip text="Shards are used to unlock and evolve Heroes. High acquisition priority.">
                     <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-3">
                       <Tag size={16} className="text-blue-400" />
                       <div><p className="text-[7px] font-black text-blue-500 uppercase">Access Cost</p><p className="text-[11px] font-bold text-white">{(selectedItem as Hero).shardCost}</p></div>
                     </div>
                   </Tooltip>
                 )}
                 {(selectedItem as Hero).globalBonus120 && (
                   <Tooltip text="Permanent, passive stat increases that apply to every hero in your inventory.">
                     <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-3">
                       <Award size={16} className="text-orange-400" />
                       <div><p className="text-[7px] font-black text-orange-500 uppercase">Global Bonus</p><p className="text-[11px] font-bold text-white">{(selectedItem as Hero).globalBonus120}</p></div>
                     </div>
                   </Tooltip>
                 )}
                 {(selectedItem as Hero).bestSkin && <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-center gap-3"><Star size={16} className="text-yellow-400" /><div><p className="text-[7px] font-black text-yellow-500 uppercase">Meta Skin</p><p className="text-[11px] font-bold text-white">{(selectedItem as Hero).bestSkin}</p></div></div>}
                 {selectedItem.trivia && <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl flex items-center gap-3 col-span-2"><HelpCircle size={16} className="text-pink-400" /><div><p className="text-[7px] font-black text-pink-500 uppercase">Artifact Trivia</p><p className="text-[11px] font-bold text-white">{selectedItem.trivia}</p></div></div>}
               </div>

               {selectedItem.uniqueEffect && (
                 <div className="p-6 bg-cyan-600/5 border border-cyan-500/30 rounded-3xl group">
                   <Tooltip text="Passive traits unique to this specific item.">
                     <h4 className="text-[10px] font-black text-cyan-400 uppercase mb-3 flex items-center gap-2 tracking-widest"><Zap size={16} /> Unique Mechanism</h4>
                   </Tooltip>
                   <p className="text-[13px] text-white font-bold italic leading-relaxed">{selectedItem.uniqueEffect}</p>
                 </div>
               )}

               <div className="p-6 bg-gray-900 border border-white/10 rounded-3xl relative">
                  <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none"><Terminal size={48}/></div>
                  <h4 className="text-[10px] font-black text-orange-500 uppercase mb-4 flex items-center gap-2"><ScrollText size={16}/> Strategist Insights</h4>
                  <div className="text-[11px] text-gray-300 font-medium leading-relaxed space-y-2 italic">
                    {selectedItem.deepLogic ? formatStrategy(selectedItem.deepLogic) : "Neural analysis pending."}
                  </div>
               </div>

               {selectedItem.mythicPerk && (
                 <div className="p-6 bg-gradient-to-br from-purple-900/40 to-gray-900 border border-purple-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
                   <Tooltip text="Unlocked at Red rarity. Defines the items true power level.">
                     <h4 className="text-[10px] font-black text-purple-300 uppercase mb-3 flex items-center gap-2 tracking-widest"><Gem size={16}/> Mythic Protocol</h4>
                   </Tooltip>
                   <p className="text-lg font-black text-white italic leading-tight">{selectedItem.mythicPerk}</p>
                 </div>
               )}

               {selectedItem.rarityPerks && selectedItem.rarityPerks.length > 0 && (
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-[0.1em]"><Award size={18}/> Evolution Matrix</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedItem.rarityPerks.map((p, i) => (
                        <div key={i} className="p-4 bg-gray-900/60 border border-white/5 rounded-2xl flex items-center gap-4 group">
                          <div className="w-24 border-r border-white/10 pr-4 shrink-0"><span className="text-[8px] font-black text-orange-500 uppercase italic">{p.rarity}</span></div>
                          <div className="flex-1"><span className="text-[11px] text-gray-300 font-bold group-hover:text-white transition-colors leading-snug">{p.effect}</span></div>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {(selectedItem as Hero).bio && (
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={16}/> Chronological Archive</h4>
                    <p className="text-[12px] text-gray-400 leading-relaxed font-medium italic">{(selectedItem as Hero).bio}</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
