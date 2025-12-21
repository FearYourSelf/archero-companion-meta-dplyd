
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Send, BrainCircuit, Loader2, Heart, Calculator, 
  Crown, Ghost, Target, PawPrint as Dog, Book, Egg, Landmark as Tower, Flame,
  Circle, LayoutDashboard, Trophy, AlertTriangle, TrendingUp,
  ScrollText, Gem, LayoutGrid, Award, HelpCircle, ArrowUpRight, X, Sparkles, 
  ChevronRight, ChevronLeft, Info, FlaskConical, Layers, Star,
  Tag, MapPin, Activity, Dna, ClipboardCheck, Terminal, BookOpen, Wrench, Save, Download, Trash2
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA 
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, SavedBuild } from './types';
import { Badge, Card } from './components/UI';

// --- Improved Mouse-Following Tooltip ---
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!visible) return;
    const offset = 12;
    let x = e.clientX + offset;
    let y = e.clientY - offset;
    const margin = 20;
    const estimatedWidth = 160; 
    const estimatedHeight = 32;
    if (x + estimatedWidth > window.innerWidth - margin) x = e.clientX - estimatedWidth - offset;
    if (y - estimatedHeight < margin) y = e.clientY + offset + 20;
    if (y + estimatedHeight > window.innerHeight - margin) y = window.innerHeight - estimatedHeight - margin;
    setCoords({ x, y });
  };

  return (
    <div 
      onMouseEnter={() => setVisible(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setVisible(false)}
      onMouseDown={() => setVisible(false)}
      className="inline-flex items-center justify-center cursor-help"
    >
      {children}
      {visible && (
        <div 
          style={{ 
            position: 'fixed', 
            left: `${coords.x}px`, 
            top: `${coords.y}px`, 
            pointerEvents: 'none',
            zIndex: 10000,
            transform: 'translateY(-100%)',
            minWidth: '160px',
            maxWidth: '240px'
          }}
          className="px-3 py-2 bg-gray-900/95 border border-orange-500/40 text-white text-[10px] font-medium rounded-lg shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-75 ring-1 ring-white/10"
        >
          {text}
        </div>
      )}
    </div>
  );
};

const TOUR_STEPS = [
  { target: 'tour-header', title: 'Neural Uplink', content: 'Archero Meta Terminal 2025 initialized. Database updated with live datamines.' },
  { target: 'tour-sss', title: 'God-Tier Archives', content: 'Filter exclusively for SSS items. Essential for surviving Chapters 80+.', tab: 'meta' },
  { target: 'tour-search', title: 'Deep Search', content: 'Query archives by name or hidden attributes (e.g., "DR Cap").', tab: 'meta' },
  { target: 'tour-nav-analyze', title: 'Synergy Core', content: 'Run simulations to see gear pairings for 100% efficiency.', tab: 'analyze' },
  { target: 'tour-nav-ai', title: 'Neural Archivist', content: 'Direct link to the AI strategist for builds and secret mechanics.', tab: 'ai' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'analyze' | 'dps' | 'lab' | 'data' | 'ai'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<Tier | 'All'>('All');
  const [isGodTierOnly, setIsGodTierOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItem | Hero | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('archero_favs') || '[]'));
  const [calcStats, setCalcStats] = useState<CalcStats>(() => JSON.parse(localStorage.getItem('archero_stats') || '{"baseAtk":50000,"critChance":40,"critDmg":350,"atkSpeed":50,"weaponType":"Demon Blade"}'));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('archero_chat') || '[]'));
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [buildHero, setBuildHero] = useState<string>(HERO_DATA[0].id);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => JSON.parse(localStorage.getItem('archero_builds') || '[]'));
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('archero_builds', JSON.stringify(savedBuilds));
  }, [savedBuilds]);

  useEffect(() => {
    const savedId = localStorage.getItem('active_detail_id');
    if (savedId) {
      const all = [...HERO_DATA, ...GEAR_DATA];
      const found = all.find(i => i.id === savedId);
      if (found) setSelectedItem(found);
    }
  }, []);

  useEffect(() => {
    if (selectedItem) localStorage.setItem('active_detail_id', selectedItem.id);
    else localStorage.removeItem('active_detail_id');
  }, [selectedItem]);

  useEffect(() => {
    if (activeTab === 'ai') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiLoading, activeTab]);

  const [tourStep, setTourStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('archero_tour_seen');
    if (!hasSeenTour) {
      setTimeout(() => { setIsTourActive(true); localStorage.setItem('archero_tour_seen', 'true'); }, 1500);
    }
  }, []);

  useEffect(() => {
    if (isTourActive) {
      const el = document.getElementById(TOUR_STEPS[tourStep].target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setSpotlightRect(el.getBoundingClientRect()), 300);
      }
    } else {
      setSpotlightRect(null);
    }
  }, [isTourActive, tourStep, activeTab]);

  const calculatedDPS = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    return Math.round(baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + (atkSpeed / 100)));
  }, [calcStats]);

  const filteredData = useMemo(() => {
    const combined = [...HERO_DATA, ...GEAR_DATA];
    return combined.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesTier = tierFilter === 'All' || item.tier === tierFilter;
      const matchesGod = !isGodTierOnly || item.tier === 'SSS';
      return matchesSearch && matchesCategory && matchesTier && matchesGod;
    });
  }, [searchQuery, categoryFilter, tierFilter, isGodTierOnly]);

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

  const handleSaveBuild = () => {
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const newBuild: SavedBuild = {
      id: Date.now().toString(),
      name: `${hero?.name || 'Hero'} Build`,
      heroId: buildHero,
      stats: { ...calcStats },
      timestamp: Date.now()
    };
    setSavedBuilds(prev => [newBuild, ...prev].slice(0, 10)); // Keep last 10
  };

  const handleLoadBuild = (build: SavedBuild) => {
    setBuildHero(build.heroId);
    setCalcStats(build.stats);
  };

  const handleDeleteBuild = (id: string) => {
    setSavedBuilds(prev => prev.filter(b => b.id !== id));
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Perform a Deep Simulation for ${hero?.name} at ${calcStats.baseAtk} ATK.
    Mission: Chapter 90 (Inferno Mode) Clear.
    Requirements:
    - Optimized SSS Gear synergies.
    - Specific tactical advice for this hero's mechanics.
    - Recommended Dragon and Pet support.`;
    
    try {
      const response = await chatWithAI(prompt, []);
      setSimResult(response || 'Simulation data corrupted.');
    } catch (e) {
      setSimResult('Failed to establish neural link with simulation core. Check your connection.');
    } finally {
      setIsSimulating(false);
    }
  };

  const CATEGORY_ICONS: Record<string, any> = {
    'All': LayoutGrid, 'Hero': User, 'Weapon': Sword, 'Armor': Shield, 'Ring': Circle, 
    'Bracelet': Zap, 'Locket': Heart, 'Book': Book, 'Dragon': Flame, 'Spirit': Ghost, 
    'Pet': Dog, 'Egg': Egg, 'Totem': Tower
  };

  const TIER_OPTIONS: (Tier | 'All')[] = ['All', 'SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];

  const formatStrategy = (text: string) => {
    return text.split('\n').filter(l => l.trim()).map((line, i) => (
      <div key={i} className="flex gap-2 mb-1 last:mb-0">
        <span className="text-orange-500 font-black">•</span>
        <span className="flex-1">{line.replace(/^•\s*/, '')}</span>
      </div>
    ));
  };

  const renderSimReport = (text: string) => {
    const parts = text.split('\n').filter(p => p.trim());
    return parts.map((part, i) => {
      const isHeader = part.startsWith('[') || part.includes('SECTION') || part.includes('OVERVIEW');
      
      // Polish logic: Bold stats and format numbers with commas
      const formattedPart = part
        .replace(/([+-]?\d{1,3}(?:,\d{3})*(?:\.\d+)?%?\s*(?:DR|ATK|HP|Crit|Damage|Resistance))/gi, (match) => `**${match}**`)
        .replace(/(\d{4,})/g, (match) => {
            const num = Number(match);
            return isNaN(num) ? match : num.toLocaleString();
        });

      return (
        <div key={i} className={`mb-3 last:mb-0 ${isHeader ? 'mt-6 first:mt-0' : ''}`}>
          {isHeader ? (
            <h6 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <Terminal size={12} /> {part.replace(/[\[\]]/g, '')}
            </h6>
          ) : (
            <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
              {formattedPart.split('**').map((sub, j) => (
                j % 2 === 1 ? <b key={j} className="text-white font-black">{sub}</b> : sub
              ))}
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto relative overflow-x-hidden">
      
      {/* Onboarding UI */}
      {isTourActive && (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
          <svg className="absolute inset-0 w-full h-full pointer-events-auto">
            <defs>
              <mask id="tour-mask-v2">
                <rect width="100%" height="100%" fill="white"/>
                <rect x={(spotlightRect?.left||0)-12} y={(spotlightRect?.top||0)-12} width={(spotlightRect?.width||0)+24} height={(spotlightRect?.height||0)+24} rx="30" fill="black" className="transition-all duration-500 ease-out" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(2, 6, 23, 0.92)" mask="url(#tour-mask-v2)" />
            {spotlightRect && <rect x={spotlightRect.left-12} y={spotlightRect.top-12} width={spotlightRect.width+24} height={spotlightRect.height+24} rx="30" fill="none" stroke="#f97316" strokeWidth="3" className="transition-all duration-500 ease-out animate-pulse" />}
          </svg>
          <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '440px', bottom: spotlightRect && spotlightRect.top < window.innerHeight/2 ? '12%' : 'auto', top: spotlightRect && spotlightRect.top >= window.innerHeight/2 ? '12%' : 'auto', opacity: spotlightRect ? 1 : 0 }} className="transition-all duration-700 pointer-events-auto">
            <div className="bg-gray-900 border-2 border-orange-500/40 rounded-[3rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] space-y-5 relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3"><Sparkles className="text-orange-500 w-5 h-5"/><h4 className="text-white font-black uppercase italic text-lg tracking-tight">{TOUR_STEPS[tourStep].title}</h4></div>
                </div>
                <button onClick={() => setIsTourActive(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <p className="relative z-10 text-gray-300 text-sm font-semibold leading-relaxed">{TOUR_STEPS[tourStep].content}</p>
              <div className="flex gap-3">
                {tourStep > 0 && <button onClick={() => setTourStep(tourStep-1)} className="flex-1 py-3 bg-white/5 text-gray-400 rounded-2xl text-[10px] font-black uppercase">Back</button>}
                <button onClick={() => tourStep < TOUR_STEPS.length - 1 ? setTourStep(tourStep+1) : setIsTourActive(false)} className="flex-[2] py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-orange-900/20 active:scale-95">{tourStep === TOUR_STEPS.length - 1 ? 'Start' : 'Next'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header id="tour-header" className="sticky top-0 z-[100] bg-gray-950/90 backdrop-blur-2xl border-b border-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="text-orange-500 w-7 h-7" />
            <div>
              <h1 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">ZA ARMORY</h1>
              <p className="text-[8px] text-orange-500 font-bold tracking-[0.3em] uppercase mt-1">Archero Meta Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip text="Reset Briefing"><button onClick={() => { setTourStep(0); setIsTourActive(true); }} className="p-3 bg-white/5 text-gray-500 hover:text-orange-500 rounded-xl transition-all"><HelpCircle size={18} /></button></Tooltip>
            <Tooltip text={isGodTierOnly ? "Archive: All" : "Archive: SSS Only"}><button id="tour-sss" onClick={() => setIsGodTierOnly(!isGodTierOnly)} className={`p-3 rounded-xl transition-all ${isGodTierOnly ? 'bg-yellow-500/20 text-yellow-500 ring-1 ring-yellow-500/50' : 'bg-white/5 text-gray-500'}`}><Crown size={18} /></button></Tooltip>
          </div>
        </div>
        <div className="space-y-3">
          <div id="tour-search" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input type="text" placeholder="Query Archives..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-orange-500/40" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {TIER_OPTIONS.map(tier => (
              <button key={tier} onClick={() => setTierFilter(tier)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all flex-shrink-0 ${tierFilter === tier ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-gray-600 border border-white/5 hover:text-white'}`}>{tier}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-6 pb-64 relative z-10">
        {activeTab === 'meta' && (
          <>
            <div id="tour-categories" className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {Object.keys(CATEGORY_ICONS).map(cat => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <button key={cat} onClick={() => setCategoryFilter(cat as any)} className={`px-4 py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all flex-shrink-0 border min-w-[70px] ${categoryFilter === cat ? 'bg-orange-600 border-orange-400 text-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-400'}`}>
                    <Icon size={18} /><span className="text-[8px] font-black uppercase tracking-tight">{cat}</span>
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredData.map(item => (
                <Card key={item.id} tier={item.tier}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <Badge tier={item.tier} />
                      <Heart size={18} onClick={(e) => { e.stopPropagation(); setFavorites(prev => prev.includes(item.id) ? prev.filter(f => f !== item.id) : [...prev, item.id]) }} className={`cursor-pointer transition-all active:scale-150 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                    </div>
                    <h3 className="text-base font-black text-white uppercase italic tracking-tight mb-1">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-relaxed h-[30px]">{item.desc}</p>
                    <button onClick={() => setSelectedItem(item)} className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all">Deep-Dive</button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'analyze' && (
          <div className="space-y-6">
            <div id="tour-nav-analyze" className="bg-gray-900/50 border border-white/5 p-6 rounded-[2rem] space-y-5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><BrainCircuit size={80}/></div>
              <h4 className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2 tracking-widest relative z-10"><Dna size={14}/> Synergy Simulator Core</h4>
              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-gray-600 uppercase">Primary Operator</label>
                  <select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-orange-500 appearance-none">
                    {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={handleSaveBuild} className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Save size={12}/> Save Configuration
                  </button>
                </div>

                {savedBuilds.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[8px] font-black text-gray-600 uppercase">Recent Archives</label>
                    <div className="space-y-1">
                      {savedBuilds.map(b => (
                        <div key={b.id} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/5 group">
                          <span className="flex-1 text-[9px] font-bold text-gray-300 truncate">{b.name} ({b.stats.baseAtk.toLocaleString()} ATK)</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleLoadBuild(b)} className="p-1 text-gray-600 hover:text-orange-500 transition-colors"><Download size={12}/></button>
                            <button onClick={() => handleDeleteBuild(b.id)} className="p-1 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-start gap-2">
                  <AlertTriangle size={14} className="text-orange-500/60 shrink-0 mt-0.5" />
                  <p className="text-[8px] font-bold text-orange-500/60 uppercase leading-normal tracking-wide">Note: Generating a deep neural report requires intensive calculations and may take 5-10 seconds to compile.</p>
                </div>
              </div>
              <button onClick={runSimulation} disabled={isSimulating} className="w-full py-4 bg-orange-600 rounded-xl text-[9px] font-black uppercase text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 relative z-10 overflow-hidden">
                {isSimulating ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={14} /> 
                    <span>Establishing Neural Link...</span>
                  </div>
                ) : 'Execute Deep Simulation'}
              </button>
            </div>
            {simResult && (
              <div className="bg-gray-900 border border-orange-500/30 p-8 rounded-[2.5rem] animate-in slide-in-from-bottom-5 duration-700 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><ClipboardCheck size={100} /></div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
                      <Trophy size={16} className="text-white" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-white uppercase tracking-[0.1em]">Neural Simulation Report</h5>
                      <p className="text-[7px] font-bold text-orange-500/60 uppercase tracking-widest">Archive ID: 2025-META-V4</p>
                    </div>
                  </div>
                  <button onClick={() => setSimResult(null)} className="p-2 text-gray-600 hover:text-white transition-colors"><X size={16}/></button>
                </div>
                <div className="relative z-10">
                  {renderSimReport(simResult)}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dps' && (
          <div className="space-y-5 animate-in fade-in duration-500">
             <div id="tour-nav-dps" className="p-8 bg-gray-900/80 rounded-[2.5rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1.5 tracking-[0.2em]">Burst Metric</p>
                <div className="text-5xl font-black text-white italic tracking-tighter">{calculatedDPS.toLocaleString()}</div>
             </div>
             <div className="grid grid-cols-2 gap-3">
               {[
                 { key: 'baseAtk', label: 'Base ATK' }, { key: 'critChance', label: 'Crit Chance %' },
                 { key: 'critDmg', label: 'Crit DMG %' }, { key: 'atkSpeed', label: 'Speed Multi' }
               ].map(stat => (
                 <div key={stat.key} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-orange-500/20 transition-all">
                    <label className="text-[7px] font-black text-gray-500 uppercase mb-1.5 block">{stat.label}</label>
                    <input type="number" value={calcStats[stat.key as keyof CalcStats] as number} onChange={e => setCalcStats(prev => ({ ...prev, [stat.key]: Number(e.target.value) }))} className="bg-transparent text-white text-base font-black outline-none w-full" />
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="text-xl font-black italic text-white uppercase tracking-tighter text-center">Mastery Archives</h2>
             <div className="bg-gray-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                   <table className="w-full text-[10px]">
                      <thead className="bg-white/5">
                         <tr className="text-gray-500 uppercase tracking-widest text-left">
                            <th className="p-4">Hero</th>
                            <th className="p-4">L120 Global</th>
                            <th className="p-4 text-right">Tier</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {HERO_DATA.map(h => (
                            <tr key={h.id} className="hover:bg-white/5 transition-colors">
                               <td className="p-4 font-black text-white italic">{h.name}</td>
                               <td className="p-4 text-orange-500 font-bold">{h.globalBonus120}</td>
                               <td className="p-4 text-right"><Badge tier={h.tier} /></td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[450px]">
             <div className="flex-1 overflow-y-auto space-y-3 mb-4 no-scrollbar pr-1">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 opacity-30">
                    <BrainCircuit size={40} className="text-orange-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Neural Strategist Idle.</p>
                  </div>
                )}
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-semibold leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-800 border border-white/5 text-gray-300 rounded-tl-none'}`}>{msg.text}</div>
                  </div>
                ))}
                {isAiLoading && <div className="text-[8px] font-black text-orange-500 animate-pulse uppercase tracking-[0.2em] flex items-center gap-2 px-2"><Loader2 size={10} className="animate-spin" /> Datamining...</div>}
                <div ref={chatEndRef} />
             </div>
             <div className="flex gap-2.5 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-xl">
                <input type="text" placeholder="Consult the Oracle..." className="flex-1 bg-transparent px-4 text-xs font-bold outline-none text-white placeholder:text-gray-700" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} />
                <button onClick={handleAiSend} className="bg-orange-600 p-3 rounded-xl shadow-lg active:scale-90 transition-transform"><Send size={16} className="text-white"/></button>
             </div>
          </div>
        )}
      </main>

      <nav id="tour-nav" className="fixed bottom-4 left-4 right-4 z-[400] max-w-xl mx-auto">
        <div className="bg-gray-950/95 backdrop-blur-3xl border border-white/10 p-1 rounded-[2.5rem] flex justify-between items-center shadow-4xl ring-1 ring-white/10 overflow-hidden">
          {[
            { id: 'meta', icon: Crown, label: 'Meta', tip: "Unit Archives" },
            { id: 'analyze', icon: TrendingUp, label: 'Sim', tourId: 'tour-nav-analyze', tip: "Synergy Simulation" },
            { id: 'dps', icon: Calculator, label: 'DPS', tourId: 'tour-nav-dps', tip: "Burst Calculator" },
            { id: 'data', icon: LayoutDashboard, label: 'Data', tip: "Global Buffs" },
            { id: 'ai', icon: MessageSquare, label: 'Ask', tourId: 'tour-nav-ai', tip: "AI Strategist" },
          ].map(t => (
            <Tooltip key={t.id} text={t.tip}>
              <button id={t.tourId} onClick={() => setActiveTab(t.id as any)} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-3xl transition-all duration-300 ${activeTab === t.id ? 'text-orange-500 bg-white/5' : 'text-gray-500 hover:text-gray-400'}`}>
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
          <div className="relative w-full bg-gray-950 border-t border-orange-500/20 rounded-t-[3rem] p-6 sm:p-8 max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-10 shadow-4xl">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2"><Badge tier={selectedItem.tier} /><span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">{selectedItem.category} Unit</span></div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">{selectedItem.name}</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10"><X size={20}/></button>
            </div>
            <div className="space-y-6 pb-20">
               <div className="grid grid-cols-2 gap-2.5">
                 {(selectedItem as Hero).bestSkin && <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-center gap-2.5"><Star size={14} className="text-yellow-500" /><div><p className="text-[7px] font-black text-yellow-600 uppercase">Best Skin</p><p className="text-[9px] font-bold text-white">{(selectedItem as Hero).bestSkin}</p></div></div>}
                 {(selectedItem as Hero).shardCost && <div className="p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center gap-2.5"><Tag size={14} className="text-blue-500" /><div><p className="text-[7px] font-black text-blue-600 uppercase">Access Cost</p><p className="text-[9px] font-bold text-white">{(selectedItem as Hero).shardCost}</p></div></div>}
                 {(selectedItem as Hero).globalBonus120 && (
                   <div className="p-3.5 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center gap-2.5 col-span-2">
                     <Award size={14} className="text-orange-500" />
                     <div>
                       <Tooltip text={`Passive bonus granted to ALL heroes once this hero reaches Level 120: ${(selectedItem as Hero).globalBonus120}`}>
                        <p className="text-[7px] font-black text-orange-600 uppercase">Global Level 120 Bonus</p>
                       </Tooltip>
                       <p className="text-[10px] font-black text-white">{(selectedItem as Hero).globalBonus120}</p>
                     </div>
                   </div>
                 )}
               </div>

               {/* Unique Mechanism Section */}
               {selectedItem.uniqueEffect && (
                 <div className="p-5 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-600/10 rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)] group">
                   <h4 className="text-[9px] font-black text-blue-400 uppercase mb-2.5 flex items-center gap-2"><Zap size={14} className="group-hover:animate-pulse" /> Unique Mechanism</h4>
                   <p className="text-[11px] text-white font-bold italic leading-relaxed">{selectedItem.uniqueEffect}</p>
                 </div>
               )}

               {/* Strategist Insights */}
               <div className="p-5 bg-orange-600/5 rounded-2xl border border-orange-500/10">
                 <h4 className="text-[9px] font-black text-orange-500 uppercase mb-2.5 flex items-center gap-2"><ScrollText size={14}/> Strategist Insights</h4>
                 <div className="text-[11px] text-gray-300 font-mono italic leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">{selectedItem.deepLogic ? formatStrategy(selectedItem.deepLogic) : "Neural analysis pending."}</div>
               </div>

               {/* Hero's Chronicle */}
               {(selectedItem as Hero).bio && (
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/5 max-h-[160px] overflow-y-auto no-scrollbar scroll-smooth shadow-inner">
                   <h4 className="text-[9px] font-black text-gray-400 uppercase mb-2.5 flex items-center gap-2"><BookOpen size={14}/> Hero's Chronicle</h4>
                   <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">{(selectedItem as Hero).bio}</p>
                 </div>
               )}

               {/* Did You Know? */}
               {selectedItem.trivia && (
                 <div className="p-5 bg-gray-800/30 rounded-2xl border border-white/5">
                   <h4 className="text-[9px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2"><Info size={14}/> Did You Know?</h4>
                   <p className="text-[10px] text-gray-400 font-medium italic leading-relaxed">{selectedItem.trivia}</p>
                 </div>
               )}

               {/* Mythic Protocol */}
               {selectedItem.mythicPerk && (
                 <div className="p-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl relative overflow-hidden group">
                   <Tooltip text={`Mythic Activation Detail: ${selectedItem.mythicPerk}. Requires Mythic rarity (or higher) to bypass core power restrictions.`}>
                    <h4 className="text-[9px] font-black text-purple-300 uppercase mb-2 flex items-center gap-2 cursor-help"><Gem size={14}/> Mythic Protocol <Info size={10} className="opacity-50" /></h4>
                   </Tooltip>
                   <p className="text-base font-black text-white italic leading-tight">{selectedItem.mythicPerk}</p>
                 </div>
               )}
               
               {/* Synergistic Gear */}
               {selectedItem.bestPairs && (
                 <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-[0.1em]"><Layers size={16}/> Synergistic Gear</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.bestPairs.map(p => {
                        const itemInfo = [...HERO_DATA, ...GEAR_DATA].find(i => i.name === p || i.id === p);
                        return (
                          <Tooltip key={p} text={itemInfo ? `${itemInfo.desc} [Tier: ${itemInfo.tier}]` : "Synergy signature detected but database link is weak."}>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 border border-green-500/10 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-500/10 transition-colors">
                              <FlaskConical size={10}/> {p}
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                 </div>
               )}

               {/* Evolution Perks */}
               {selectedItem.rarityPerks && selectedItem.rarityPerks.length > 0 && (
                 <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-[0.1em]"><Award size={16}/> Evolution Perks</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedItem.rarityPerks.map((p, i) => (
                        <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:border-orange-500/30 transition-all">
                          <div className="w-24 border-r border-white/5 pr-2">
                            <span className="text-[8px] font-black text-orange-500 uppercase italic tracking-widest">{p.rarity}</span>
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] text-gray-300 font-bold leading-tight">{p.effect}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
