
import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Send, BrainCircuit, Loader2, Heart, Calculator, 
  Crown, Ghost, Target, PawPrint as Dog, Book, Egg, Landmark as Tower, Flame,
  Circle, LayoutDashboard, Trophy, AlertTriangle, TrendingUp,
  ScrollText, Gem, LayoutGrid, Award, HelpCircle, ArrowUpRight, X, Sparkles, 
  ChevronRight, ChevronLeft, Info, FlaskConical, Layers, Star,
  Tag, MapPin, Activity, Dna, ClipboardCheck, Terminal, BookOpen, Wrench, Save, Download, Trash2,
  CheckCircle2, Swords, Calendar, Construction, ArrowRightLeft, RefreshCw, HelpCircle as HelpIcon,
  Database, Compass, Box, Disc
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, FARMING_ROUTES 
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic } from './types';
import { Badge, Card } from './components/UI';

// --- Ultra-Precise Portaled Tooltip ---
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number, clientY: number) => {
    const offset = 6;
    const margin = 12;
    
    let x = clientX + offset;
    let y = clientY + offset;

    if (tooltipRef.current) {
      const width = tooltipRef.current.offsetWidth;
      const height = tooltipRef.current.offsetHeight;

      if (x + width > window.innerWidth - margin) {
        x = clientX - width - offset;
      }
      if (y + height > window.innerHeight - margin) {
        y = clientY - height - offset;
      }
      
      if (x < margin) x = margin;
      if (y < margin) y = margin;
    }

    setCoords({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  };

  return (
    <div 
      onMouseEnter={() => setVisible(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setVisible(false)}
      className="inline-flex items-center justify-center cursor-help"
    >
      {children}
      {visible && createPortal(
        <div 
          ref={tooltipRef}
          style={{ 
            position: 'fixed', 
            left: `${coords.x}px`, 
            top: `${coords.y}px`, 
            pointerEvents: 'none',
            zIndex: 99999,
          }}
          className="px-3 py-1.5 bg-gray-900/95 border border-orange-500/40 text-white text-[10px] font-bold rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/10 max-w-[220px]"
        >
          {text}
        </div>,
        document.body
      )}
    </div>
  );
};

// --- Refined Tour Step Data ---
const TOUR_STEPS = [
  { target: 'tour-header', title: 'Grandmaster V4.0', content: 'Welcome to the 2025 tactical hub. We have overhauled every system for maximum efficiency.' },
  { target: 'tour-nav-meta', title: 'Meta Registry', content: 'Browse the current Tier Lists for Heroes and Gear. Use "Deep Dive" for hidden logic and frame data.', tab: 'meta' },
  { target: 'tour-nav-tracker', title: 'Mastery Tracker', content: 'Mark your Level 120 progress here. The system will automatically synthesize your account-wide global bonuses.', tab: 'tracker' },
  { target: 'tour-nav-analyze', title: 'Neural Simulator', content: 'Input your hero and ATK stats. Our AI core will generate Chapter 80+ gear recommendations.', tab: 'analyze' },
  { target: 'tour-nav-dps', title: 'Burst Metric', content: 'Fine-tune your stats to see your True Effective DPS after animation cancellations.', tab: 'dps' },
  { target: 'tour-nav-immunity', title: 'Immunity Engine', content: 'Track your path to 100% Projectile Resistance. Vital for end-game boss survival.', tab: 'immunity' },
  { target: 'tour-nav-jewels', title: 'Jewel Master', content: 'View hidden Level 16 and Level 28 bonuses for every jewel type in the game.', tab: 'jewels' },
  { target: 'tour-nav-relics', title: 'Relic Archive', content: 'Synergize Holy and Radiant relics to unlock permanent global power shifts.', tab: 'relics' },
  { target: 'tour-nav-ai', title: 'The Oracle', content: 'Direct neural uplink to Gemini. Ask for custom builds or stage-specific tactics.', tab: 'ai' },
  { target: 'tour-header-controls', title: 'System Controls', content: 'Access the manual, purge AI history, or switch to the Registry from any terminal.' },
  { target: 'tour-nav-help', title: 'Hub Ready', content: 'Operational status green. You are ready to dominate the 2025 meta. Good luck, Archer.' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'tracker' | 'analyze' | 'dps' | 'vs' | 'immunity' | 'calendar' | 'estate' | 'jewels' | 'relics' | 'data' | 'ai'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('All');
  const [isGodTierOnly, setIsGodTierOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItem | Hero | null>(null);
  
  const scrollContainerRef = useRef<HTMLElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    mode: 'both' | 'horizontal';
    targetRef: React.RefObject<HTMLElement | null> | null;
  }>({
    isDragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    mode: 'both',
    targetRef: null
  });

  const handleDragStart = (e: React.MouseEvent, ref: React.RefObject<HTMLElement | null>, mode: 'both' | 'horizontal' = 'both') => {
    if (!ref.current) return;
    const target = e.target as HTMLElement;
    if (ref === scrollContainerRef && (target.closest('input') || target.closest('select') || target.closest('textarea'))) return;
    
    setDragState({
      isDragging: true,
      moved: false,
      startX: e.pageX,
      startY: e.pageY,
      scrollLeft: ref.current.scrollLeft,
      scrollTop: ref.current.scrollTop,
      mode,
      targetRef: ref
    });
  };

  const handleDragEnd = () => {
    if (dragState.isDragging) {
      setDragState(prev => ({ ...prev, isDragging: false, targetRef: null }));
    }
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.targetRef?.current) return;
    const ref = dragState.targetRef.current;
    const dx = (e.pageX - dragState.startX) * 1.1; 
    const dy = (e.pageY - dragState.startY) * 1.1;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      if (!dragState.moved) setDragState(prev => ({ ...prev, moved: true }));
      e.preventDefault();
      if (dragState.mode === 'horizontal') {
        ref.scrollLeft = dragState.scrollLeft - dx;
      } else {
        ref.scrollLeft = dragState.scrollLeft - dx;
        ref.scrollTop = dragState.scrollTop - dy;
      }
    }
  };

  // Smoother Horizontal Scrolling
  useLayoutEffect(() => {
    const bars = [navScrollRef.current, headerScrollRef.current];
    const cleanupFns: (() => void)[] = [];
    bars.forEach(bar => {
      if (!bar) return;
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > 0) {
          e.preventDefault();
          bar.scrollLeft += e.deltaY;
        }
      };
      bar.addEventListener('wheel', onWheel, { passive: false });
      cleanupFns.push(() => bar.removeEventListener('wheel', onWheel));
    });
    return () => cleanupFns.forEach(fn => fn());
  }, [activeTab]);

  const [unlockedHeroes, setUnlockedHeroes] = useState<Record<string, { lv120: boolean }>>(() => 
    JSON.parse(localStorage.getItem('archero_tracker_v4') || '{}')
  );
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => 
    JSON.parse(localStorage.getItem('archero_chat_v4') || '[]')
  );
  const [calcStats, setCalcStats] = useState<CalcStats>(() => 
    JSON.parse(localStorage.getItem('archero_stats_v4') || '{"baseAtk":50000,"critChance":40,"critDmg":350,"atkSpeed":50,"weaponType":"Celestial Hammer"}')
  );

  const [vsItemA, setVsItemA] = useState<string>(GEAR_DATA[0].id);
  const [vsItemB, setVsItemB] = useState<string>(GEAR_DATA[1].id);
  const [immunitySetup, setImmunitySetup] = useState({ rings: 0, armor: 'none', atreus120: false, onir120: false, locketLowHP: false });
  const [workers, setWorkers] = useState<Record<string, number>>({ iron: 5, scrolls: 5, gold: 5 });
  const [simResult, setSimResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [buildHero, setBuildHero] = useState<string>(HERO_DATA[0].id);

  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- NEW TOUR SYSTEM ---
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  // Robust Spotlight Tracking
  useEffect(() => {
    if (!isTourActive) {
      setSpotlightRect(null);
      return;
    }

    const currentStep = TOUR_STEPS[tourStep];
    
    // Switch tab if step requires it
    if (currentStep.tab && activeTab !== currentStep.tab) {
      setActiveTab(currentStep.tab as any);
      return; // Wait for the next render to find the element
    }

    const updateSpotlight = () => {
      const el = document.getElementById(currentStep.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Only update if the rect has actually changed to avoid jitter
        setSpotlightRect(rect);
      } else {
        // If element isn't found (maybe tab is still loading), retry soon
        requestAnimationFrame(updateSpotlight);
      }
    };

    updateSpotlight();

    // Re-track on window resize or scroll
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [isTourActive, tourStep, activeTab]);

  const handleStartTour = () => {
    setTourStep(0);
    setIsTourActive(true);
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragState.isDragging]);

  useEffect(() => {
    localStorage.setItem('archero_tracker_v4', JSON.stringify(unlockedHeroes));
  }, [unlockedHeroes]);

  useEffect(() => {
    localStorage.setItem('archero_chat_v4', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('archero_stats_v4', JSON.stringify(calcStats));
  }, [calcStats]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('archero_tour_v4_seen');
    if (!hasSeenTour) {
      handleStartTour();
      localStorage.setItem('archero_tour_v4_seen', 'true');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'ai') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiLoading, activeTab]);

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
    if (immunitySetup.atreus120) projResist += 7;
    if (immunitySetup.onir120) projResist += 10;
    if (immunitySetup.locketLowHP) projResist += 30;
    return { projResist };
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const msg = aiInput; setAiInput('');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, timestamp: Date.now() }]);
    setIsAiLoading(true);
    try {
      const response = await chatWithAI(msg, chatHistory.map(h => ({ role: h.role, text: h.text })));
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'Uplink Failed.', timestamp: Date.now() }]);
    } catch (e: any) {
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Archives Offline.', timestamp: Date.now() }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Perform a Deep V4.0 Simulation for ${hero?.name} with ${calcStats.baseAtk} ATK. Suggest Chapter 80+ optimal jewels/relics/gear.`;
    try {
      const response = await chatWithAI(prompt, []);
      setSimResult(response || 'Simulation data corrupted.');
    } catch (e: any) {
      setSimResult('Connection to Sim Core failed.');
    } finally {
      setIsSimulating(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Purge Neural History?")) {
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

  const handleTabChange = (tabId: any) => {
    if (dragState.moved) return;
    setActiveTab(tabId);
  };

  const renderTracker = () => {
    const globalStats = calculateGlobalStats();
    return (
      <div id="tour-nav-tracker" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="p-6 bg-orange-600/10 border border-orange-500/20 rounded-[2rem]">
          <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Tooltip text="Live synthesis of your global power."><Activity size={14}/></Tooltip> 
            Neural Stat Synthesis
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(globalStats).map(([stat, val]) => (
              <div key={stat} className="p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[8px] font-black text-gray-500 uppercase">{stat}</p>
                <p className="text-xl font-black text-white">+{val}{stat.includes('%') || stat.includes('HP') || stat.includes('Atk') ? '%' : ''}</p>
              </div>
            ))}
            {Object.keys(globalStats).length === 0 && <p className="col-span-2 text-center text-[10px] text-gray-500 py-4 font-bold">Archive Empty. Mark Lv120 Heroes below.</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {HERO_DATA.map(h => (
            <div key={h.id} className="p-4 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
              <div className="flex items-center gap-3">
                <Tooltip text={`Tier ${h.tier} Hero - Global Mastery Level 120 gives ${h.globalBonus120}`}>
                  <Badge tier={h.tier} />
                </Tooltip>
                <span className="text-xs font-black text-white uppercase italic">{h.name}</span>
              </div>
              <Tooltip text="Toggle Level 120 status to sync account-wide global bonuses.">
                <button onClick={() => setUnlockedHeroes(prev => ({ ...prev, [h.id]: { ...prev[h.id], lv120: !prev[h.id]?.lv120 } }))} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${unlockedHeroes[h.id]?.lv120 ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-600'}`}>Lv 120</button>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderJewels = () => (
    <div id="tour-nav-jewels" className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-xl font-black italic text-white uppercase text-center mb-6">Jewel Master Archive</h2>
      <div className="grid grid-cols-1 gap-4">
        {JEWEL_DATA.map(j => (
          <div key={j.id} className="p-6 bg-gray-900 border border-white/5 rounded-[2rem] space-y-3 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl pointer-events-none ${j.color === 'Red' ? 'bg-red-500' : j.color === 'Blue' ? 'bg-blue-500' : j.color === 'Green' ? 'bg-green-500' : j.color === 'Purple' ? 'bg-purple-500' : 'bg-yellow-500'}`} />
            <div className="flex justify-between items-center">
               <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{j.name}</h3>
               <Tooltip text={`Every individual level adds ${j.statPerLevel} to your account.`}>
                 <span className="text-[8px] font-black text-gray-500 uppercase px-3 py-1 bg-white/5 rounded-full">{j.statPerLevel} / Level</span>
               </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Tooltip text="Unlocked when total jewel level in slot reaches 16.">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5"><p className="text-[7px] font-black text-orange-500 uppercase mb-1">Level 16 Bonus</p><p className="text-[11px] font-bold text-white">{j.bonus16}</p></div>
              </Tooltip>
              <Tooltip text="The powerful end-game bonus unlocked at Level 28.">
                <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-lg shadow-orange-950/10"><p className="text-[7px] font-black text-orange-500 uppercase mb-1">Level 28 Bonus</p><p className="text-[11px] font-black text-white">{j.bonus28}</p></div>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRelics = () => (
    <div id="tour-nav-relics" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-xl font-black italic text-white uppercase text-center mb-6">Relic Chronicles</h2>
      {RELIC_DATA.reduce((acc: any[], r) => {
        if (!acc.includes(r.tier)) acc.push(r.tier);
        return acc;
      }, []).map(t => (
        <div key={t} className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 border-l-2 border-orange-500/50 ml-2">{t} Grade Relics</h4>
          <div className="grid grid-cols-1 gap-2.5">
            {RELIC_DATA.filter(r => r.tier === t).map(r => (
              <div key={r.id} className="p-5 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
                <div>
                  <h5 className="text-sm font-black text-white uppercase italic">{r.name}</h5>
                  <Tooltip text="Permanent account boost provided by this relic once unlocked.">
                    <p className="text-[10px] text-orange-500 font-bold mt-0.5">{r.effect}</p>
                  </Tooltip>
                </div>
                {r.setBonus && (
                  <Tooltip text="Unlock all relics in this set to activate this bonus.">
                    <div className="text-right"><p className="text-[7px] font-black text-gray-600 uppercase">Set Synergy</p><p className="text-[9px] text-gray-400 font-bold italic">{r.setBonus}</p></div>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen w-full bg-gray-950 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto relative overflow-hidden">
      
      {/* Portaled Tour UI Overlay */}
      {isTourActive && spotlightRect && createPortal(
        <div className="fixed inset-0 z-[10000] pointer-events-none">
          <svg className="absolute inset-0 w-full h-full pointer-events-auto">
            <mask id="tour-mask-v4-refined">
              <rect width="100%" height="100%" fill="white"/>
              <rect 
                x={spotlightRect.left - 8} 
                y={spotlightRect.top - 8} 
                width={spotlightRect.width + 16} 
                height={spotlightRect.height + 16} 
                rx="20" 
                fill="black" 
              />
            </mask>
            <rect width="100%" height="100%" fill="rgba(2, 6, 23, 0.92)" mask="url(#tour-mask-v4-refined)" />
            {/* Spotlight Ring Animation */}
            <rect 
              x={spotlightRect.left - 8} 
              y={spotlightRect.top - 8} 
              width={spotlightRect.width + 16} 
              height={spotlightRect.height + 16} 
              rx="20" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="2" 
              className="animate-pulse" 
            />
          </svg>
          
          <div 
            style={{ 
              position: 'fixed', 
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(90vw, 420px)',
              top: spotlightRect.top < window.innerHeight / 2 
                   ? Math.min(window.innerHeight - 250, spotlightRect.bottom + 24)
                   : Math.max(24, spotlightRect.top - 240),
            }} 
            className="transition-all duration-300 pointer-events-auto z-[10001]"
          >
            <div className="bg-gray-900 border border-orange-500/50 rounded-[2rem] p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/20 rounded-lg"><Sparkles className="text-orange-500 w-4 h-4"/></div>
                  <h4 className="text-white font-black uppercase italic text-sm tracking-tight">{TOUR_STEPS[tourStep].title}</h4>
                </div>
                <button onClick={() => setIsTourActive(false)} className="p-1 text-gray-600 hover:text-white transition-colors"><X size={18}/></button>
              </div>
              <p className="text-gray-300 text-[12px] font-semibold leading-relaxed">{TOUR_STEPS[tourStep].content}</p>
              <div className="flex gap-3 pt-2">
                <button 
                  disabled={tourStep === 0} 
                  onClick={() => setTourStep(tourStep - 1)} 
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${tourStep === 0 ? 'opacity-0' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  Back
                </button>
                <button 
                  onClick={() => tourStep < TOUR_STEPS.length - 1 ? setTourStep(tourStep + 1) : setIsTourActive(false)} 
                  className="flex-[2] py-3 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95 transition-all"
                >
                  {tourStep === TOUR_STEPS.length - 1 ? 'Start Dominating' : 'Next Step'}
                </button>
              </div>
              <div className="flex justify-center gap-1">
                {TOUR_STEPS.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === tourStep ? 'w-4 bg-orange-500' : 'w-1 bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* FIXED HEADER */}
      <header id="tour-header" className="bg-gray-950/90 backdrop-blur-2xl border-b border-white/5 p-5 shrink-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Tooltip text="Grandmaster V4: The ultimate tactical archive."><Trophy className="text-orange-500 w-7 h-7" /></Tooltip>
            <div>
              <h1 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">GRANDMASTER V4</h1>
              <p className="text-[8px] text-orange-500 font-bold tracking-[0.3em] uppercase mt-1">Advanced Tactical Hub</p>
            </div>
          </div>
          <div id="tour-header-controls" className="flex items-center gap-2">
            <Tooltip text="System Manual Walkthrough."><button id="tour-nav-help" onClick={handleStartTour} className="p-3 bg-white/5 text-gray-500 hover:text-orange-500 rounded-xl transition-all"><HelpIcon size={18} /></button></Tooltip>
            <Tooltip text="Clear AI Memory."><button onClick={clearChat} className="p-3 bg-white/5 text-gray-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button></Tooltip>
            <Tooltip text="Meta Registry View."><button id="tour-nav-meta" onClick={() => handleTabChange('meta')} className={`p-3 rounded-xl transition-all ${activeTab === 'meta' ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500'}`}><LayoutGrid size={18} /></button></Tooltip>
          </div>
        </div>
        {activeTab === 'meta' && (
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Tooltip text="Search filter for items and heroes."><Search className="text-gray-600" size={18} /></Tooltip>
              </div>
              <input type="text" placeholder="Scanning archives..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-orange-500/40" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div 
              ref={headerScrollRef}
              onMouseDown={(e) => handleDragStart(e, headerScrollRef, 'horizontal')}
              onMouseMove={handleDragMove}
              className="flex gap-2 overflow-x-auto no-scrollbar pb-1 draggable-content"
            >
              {['All', 'Hero', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book', 'Dragon', 'Pet', 'Spirit', 'Totem'].map(cat => (
                <Tooltip key={cat} text={`Filter database by ${cat} category items.`}>
                  <button onClick={() => setCategoryFilter(cat as any)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all flex-shrink-0 ${categoryFilter === cat ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-600 border border-white/5'}`}>{cat}</button>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* DRAGGABLE MAIN CONTENT */}
      <main 
        ref={scrollContainerRef}
        onMouseDown={(e) => handleDragStart(e, scrollContainerRef, 'both')}
        onMouseMove={handleDragMove}
        className="flex-1 overflow-y-auto px-5 py-6 draggable-content no-scrollbar pb-40"
      >
        {activeTab === 'meta' && (
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map(item => (
              <Card key={item.id} tier={item.tier}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Tooltip text={`Tier ${item.tier} Ranking.`}><Badge tier={item.tier} /></Tooltip>
                    {item.isGodTier && <Tooltip text="GOD TIER ITEM"><Crown size={14} className="text-yellow-500 animate-pulse"/></Tooltip>}
                  </div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-tight mb-1">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-relaxed h-[30px]">{item.desc}</p>
                  <Tooltip text="Open Technical Analysis."><button onClick={() => setSelectedItem(item)} className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all">Deep Dive</button></Tooltip>
                </div>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'tracker' && renderTracker()}
        {activeTab === 'jewels' && renderJewels()}
        {activeTab === 'relics' && renderRelics()}
        {activeTab === 'analyze' && (
          <div id="tour-nav-analyze" className="space-y-6">
            <div className="bg-gray-900 border border-white/5 p-6 rounded-[2.5rem] space-y-5">
              <h4 className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2">
                <Tooltip text="Neural logic core."><BrainCircuit size={14}/></Tooltip> 
                Synergy Simulator 4.0
              </h4>
              <Tooltip text="Select Hero Model."><select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none">{HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}</select></Tooltip>
              <Tooltip text="Initiate AI Logic analysis."><button onClick={runSimulation} disabled={isSimulating} className="w-full py-4 bg-orange-600 rounded-xl text-[9px] font-black uppercase text-white shadow-lg active:scale-95 transition-all">{isSimulating ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Execute Neural Report'}</button></Tooltip>
            </div>
            {simResult && <div className="p-6 bg-gray-900 border border-orange-500/20 rounded-[2rem] text-[10px] text-gray-300 font-mono leading-relaxed select-text">{simResult}</div>}
          </div>
        )}
        {activeTab === 'dps' && (
          <div id="tour-nav-dps" className="space-y-6">
            <div className="p-8 bg-gray-900 rounded-[2.5rem] border border-white/10 text-center">
              <Tooltip text="Calculated true output based on stutter-stepping."><p className="text-[8px] font-black text-gray-500 uppercase mb-2">Effective Burst Metric</p></Tooltip>
              <div className="text-5xl font-black text-white italic tracking-tighter">{calculatedDPS.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[ { k: 'baseAtk', l: 'Base ATK' }, { k: 'critChance', l: 'Crit %' }, { k: 'critDmg', l: 'Crit DMG %' }, { k: 'atkSpeed', l: 'Atk Speed %' } ].map(s => (
                <div key={s.k} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <label className="text-[7px] font-black text-gray-500 uppercase block mb-1">{s.l}</label>
                  <Tooltip text={`Manually adjust ${s.l}.`}>
                    <input type="number" value={calcStats[s.k as keyof CalcStats] as number} onChange={e => setCalcStats(p => ({ ...p, [s.k]: Number(e.target.value) }))} className="bg-transparent text-white text-base font-black outline-none w-full" />
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'immunity' && (
          <div id="tour-nav-immunity" className="space-y-6">
            <div className="p-8 bg-gray-900 border border-white/5 rounded-[3rem] text-center shadow-4xl">
              <Tooltip text="Current resistance cap progress. 100% is the goal."><p className="text-[10px] font-black text-gray-500 uppercase mb-2">Immunity Progress</p></Tooltip>
              <div className="text-6xl font-black text-white italic mb-4">{getImmunityStats().projResist}%</div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-orange-500 transition-all duration-1000 shadow-[0_0_15px_rgba(249,115,22,0.5)]" style={{ width: `${Math.min(getImmunityStats().projResist, 100)}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-between">
                <Tooltip text="Active Dragon Rings count."><span className="text-[10px] font-black text-gray-400 uppercase italic">Dragon Rings</span></Tooltip>
                <div className="flex gap-2">
                  {[0, 1, 2].map(v => <button key={v} onClick={() => setImmunitySetup(s => ({ ...s, rings: v }))} className={`px-4 py-1.5 rounded-lg text-[9px] font-black ${immunitySetup.rings === v ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500'}`}>{v}</button>)}
                </div>
              </div>
              <Tooltip text="Toggle 30% low-HP threshold from Bulletproof locket."><button onClick={() => setImmunitySetup(s => ({ ...s, locketLowHP: !s.locketLowHP }))} className={`p-4 border rounded-2xl text-[9px] font-black uppercase transition-all ${immunitySetup.locketLowHP ? 'bg-red-600 text-white border-red-400' : 'bg-white/5 text-gray-500 border-white/5'}`}>Locket Low HP Condition (+30%)</button></Tooltip>
            </div>
          </div>
        )}
        {activeTab === 'ai' && (
          <div id="tour-nav-ai" className="flex flex-col h-full animate-in fade-in">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 no-scrollbar pr-1 min-h-[400px]">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-semibold select-text ${msg.role === 'user' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300 border border-white/5'}`}>{msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div></div>
              ))}
              {isAiLoading && (
                <div className="text-[8px] font-black text-orange-500 animate-pulse uppercase flex items-center gap-2">
                  <Tooltip text="Uplink sync with neural archive."><Loader2 size={10} className="animate-spin" /></Tooltip> 
                  Neural Sync Active...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2.5 bg-gray-900 border border-white/10 p-2 rounded-2xl shadow-xl sticky bottom-0 z-[100]">
              <input type="text" placeholder="Consult the strategist..." className="flex-1 bg-transparent px-4 text-xs font-bold outline-none text-white h-12" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} />
              <Tooltip text="Transmit query to the Oracle."><button onClick={handleAiSend} className="bg-orange-600 p-3 rounded-xl hover:bg-orange-500 transition-colors"><Send size={18} className="text-white"/></button></Tooltip>
            </div>
          </div>
        )}
        {activeTab === 'vs' && (
          <div id="tour-nav-vs" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Tooltip text="Select Item A."><select value={vsItemA} onChange={e => setVsItemA(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none">{GEAR_DATA.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></Tooltip>
              <Tooltip text="Select Item B."><select value={vsItemB} onChange={e => setVsItemB(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none">{GEAR_DATA.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[GEAR_DATA.find(i => i.id === vsItemA), GEAR_DATA.find(i => i.id === vsItemB)].map((item, idx) => (
                <div key={idx} className="p-6 bg-gray-900 border border-white/5 rounded-[2.5rem] text-center">
                  <Tooltip text={`Ranking: ${item?.tier}`}><Badge tier={item?.tier || 'F'} /></Tooltip>
                  <h5 className="text-sm font-black text-white uppercase italic mt-2">{item?.name}</h5>
                  <p className="text-[9px] text-gray-500 mt-2 leading-relaxed">{item?.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'calendar' && (
           <div id="tour-nav-calendar" className="space-y-4">
             {FARMING_ROUTES.map((r, i) => (
               <div key={i} className="p-5 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-between group">
                 <div>
                   <Tooltip text="Resource Category."><p className="text-[8px] font-black text-gray-500 uppercase italic group-hover:text-orange-500 transition-colors">{r.resource}</p></Tooltip>
                   <h5 className="text-xs font-black text-white italic">{r.chapter}</h5>
                 </div>
                 <Tooltip text="Strategic Farming Note."><p className="text-[10px] text-orange-500 font-bold max-w-[40%] text-right">{r.note}</p></Tooltip>
               </div>
             ))}
           </div>
        )}
        {activeTab === 'estate' && (
          <div id="tour-nav-estate" className="space-y-4">
            {Object.entries(workers).map(([k, v]) => (
              <div key={k} className="p-6 bg-gray-900 border border-white/5 rounded-3xl flex justify-between items-center group">
                <Tooltip text={`${k} generation zone.`}><span className="text-[10px] font-black text-white uppercase italic group-hover:text-orange-500 transition-all">{k} Outpost</span></Tooltip>
                <div className="flex items-center gap-4">
                  <Tooltip text="Reduce Personnel."><button onClick={() => setWorkers(p => ({ ...p, [k]: Math.max(0, p[k]-1) }))} className="p-2 bg-white/5 rounded-lg">-</button></Tooltip>
                  <span className="text-xl font-black text-white w-6 text-center">{v}</span>
                  <Tooltip text="Assign Personnel."><button onClick={() => setWorkers(p => ({ ...p, [k]: p[k]+1 }))} className="p-2 bg-orange-600 rounded-lg text-white">+</button></Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'data' && (
          <div id="tour-nav-data" className="bg-gray-900 border border-white/5 rounded-[2rem] overflow-hidden">
             <table className="w-full text-[10px]">
               <thead className="bg-white/5 text-gray-500 uppercase text-left"><tr><th className="p-4">Item</th><th className="p-4">Global 120</th><th className="p-4 text-right">Tier</th></tr></thead>
               <tbody className="divide-y divide-white/5">
                 {HERO_DATA.map(h => (
                   <tr key={h.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedItem(h)}>
                     <td className="p-4 font-black text-white italic">{h.name}</td>
                     <td className="p-4 text-orange-500 font-bold uppercase">{h.globalBonus120}</td>
                     <td className="p-4 text-right"><Tooltip text={`Rank: ${h.tier}`}><Badge tier={h.tier} /></Tooltip></td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </main>

      {/* HORIZONTAL NAV BAR */}
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-[95%] max-w-xl">
        <div 
          ref={navScrollRef}
          onMouseDown={(e) => handleDragStart(e, navScrollRef, 'horizontal')}
          onMouseMove={handleDragMove}
          className="bg-gray-950/98 backdrop-blur-3xl border border-white/10 p-2 rounded-full flex overflow-x-auto overflow-y-hidden no-scrollbar draggable-content shadow-4xl ring-1 ring-white/10"
        >
          <div className="flex items-center gap-1 flex-nowrap px-4 py-1 min-w-max">
            {[
              { id: 'meta', icon: LayoutGrid, label: 'Meta', tip: 'Meta Registry: Item rankings and details.', tourId: 'tour-nav-meta' },
              { id: 'tracker', icon: Target, label: 'Stats', tip: 'Mastery Tracker: Calculate global bonuses.', tourId: 'tour-nav-tracker' },
              { id: 'analyze', icon: BrainCircuit, label: 'Sim', tip: 'Neural Simulator: Build optimization.', tourId: 'tour-nav-analyze' },
              { id: 'dps', icon: Calculator, label: 'DPS', tip: 'Burst Engine: True output calculation.', tourId: 'tour-nav-dps' },
              { id: 'immunity', icon: Shield, label: 'True', tip: 'Defend Logic: Resistance cap tracking.', tourId: 'tour-nav-immunity' },
              { id: 'jewels', icon: Disc, label: 'Jewel', tip: 'Jewel Archive: Hidden level bonuses.', tourId: 'tour-nav-jewels' },
              { id: 'relics', icon: Box, label: 'Relic', tip: 'Relic Archive: Set synergy guide.', tourId: 'tour-nav-relics' },
              { id: 'ai', icon: MessageSquare, label: 'Oracle', tip: 'Neural Oracle Sync: AI build advice.', tourId: 'tour-nav-ai' },
              { id: 'vs', icon: ArrowRightLeft, label: 'Vs', tip: 'Item Comparison: Side-by-side stats.' },
              { id: 'calendar', icon: Calendar, label: 'Events', tip: 'Farming Schedule: Resource windows.' },
              { id: 'estate', icon: Tower, label: 'Estate', tip: 'Base Management: ROI optimization.' },
              { id: 'data', icon: Database, label: 'Data', tip: 'Raw Database: Global mastery table.' },
            ].map(t => (
              <Tooltip key={t.id} text={t.tip}>
                <button 
                  id={t.tourId}
                  onClick={() => handleTabChange(t.id as any)} 
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-5 py-3 rounded-full transition-all duration-300 ${activeTab === t.id ? 'text-orange-500 bg-white/5' : 'text-gray-500 hover:text-white'}`}
                >
                  <t.icon size={18} />
                  <span className="text-[7px] font-black uppercase tracking-tight">{t.label}</span>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </nav>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full bg-gray-950 border-t border-orange-500/20 rounded-t-[3rem] p-6 sm:p-10 max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-10 shadow-4xl">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Tooltip text={`Ranking: ${selectedItem.tier}`}><Badge tier={selectedItem.tier} /></Tooltip>
                  <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{selectedItem.category} Class</span>
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">{selectedItem.name}</h2>
              </div>
              <Tooltip text="Close Archive and return to hub."><button onClick={() => setSelectedItem(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={24}/></button></Tooltip>
            </div>
            <div className="space-y-8 pb-12">
               <div className="grid grid-cols-2 gap-3">
                 {(selectedItem as Hero).globalBonus120 && (
                   <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-3">
                     <Tooltip text="Account-wide passive unlocked at Lv120."><Award size={16} className="text-orange-400" /></Tooltip>
                     <div><p className="text-[7px] font-black text-orange-500 uppercase">Global Mastery</p><p className="text-[11px] font-bold text-white">{(selectedItem as Hero).globalBonus120}</p></div>
                   </div>
                 )}
                 {selectedItem.bestPairs && selectedItem.bestPairs.length > 0 && (
                   <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-3">
                     <Tooltip text="Items that trigger hidden combat synergies."><Sparkles size={16} className="text-blue-400" /></Tooltip>
                     <div><p className="text-[7px] font-black text-blue-500 uppercase">Synergistic Gear</p><p className="text-[11px] font-bold text-white">{selectedItem.bestPairs[0]}</p></div>
                   </div>
                 )}
               </div>
               {selectedItem.uniqueEffect && (
                 <div className="p-6 bg-cyan-600/5 border-2 border-cyan-500/30 rounded-3xl animate-pulse">
                   <h4 className="text-[10px] font-black text-cyan-400 uppercase mb-3 flex items-center gap-2 tracking-widest">
                     <Tooltip text="The core mechanic that defines this item."><Zap size={16} /></Tooltip> Unique Mechanism
                   </h4>
                   <p className="text-[13px] text-white font-bold italic leading-relaxed">{selectedItem.uniqueEffect}</p>
                 </div>
               )}
               {selectedItem.deepLogic && (
                 <div className="p-6 bg-gray-900 border border-white/10 rounded-3xl relative">
                   <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none"><Terminal size={48}/></div>
                   <h4 className="text-[10px] font-black text-orange-500 uppercase mb-4 flex items-center gap-2">
                     <Tooltip text="Expert-level logic for Ch 80+."><ScrollText size={16}/></Tooltip> Strategist Insights
                   </h4>
                   <div className="text-[11px] text-gray-300 font-medium leading-relaxed italic">{formatStrategy(selectedItem.deepLogic)}</div>
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
