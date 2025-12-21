
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Send, BrainCircuit, Loader2,
  Trash2, Heart, Calculator, 
  Crown, MousePointer2, Ghost, Target, PawPrint as Dog, Book, Egg, Landmark as Tower, Flame,
  Circle, LayoutDashboard, Trophy, Star, AlertTriangle, TrendingUp,
  Info, Settings2, Copy, Check, ChevronRight, Info as InfoIcon, ScrollText, 
  Gem, LayoutGrid, Award, Coins, HelpCircle, ArrowUpRight, X, ShieldCheck, Flame as Fire, Zap as Bolt,
  ZapOff, AlertCircle, Sparkles, Clipboard
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, FARMING_ROUTES 
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, TrainingStats, BaseItem } from './types';

// --- Tactical UI Components ---

/**
 * Tooltip with Viewport Boundary Detection
 * Guaranteed zero-clipping on mobile screens by shifting horizontally.
 */
const Tooltip: React.FC<{ text: string; children: React.ReactNode; position?: 'top' | 'bottom' }> = ({ text, children, position = 'top' }) => {
  const [hOffset, setHOffset] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (tooltipRef.current && triggerRef.current) {
      tooltipRef.current.style.visibility = 'visible';
      tooltipRef.current.style.opacity = '1';
      const rect = tooltipRef.current.getBoundingClientRect();
      const margin = 16;
      let shift = 0;
      if (rect.left < margin) shift = margin - rect.left;
      else if (rect.right > window.innerWidth - margin) shift = window.innerWidth - margin - rect.right;
      setHOffset(shift);
      tooltipRef.current.style.visibility = '';
      tooltipRef.current.style.opacity = '';
    }
  };

  return (
    <div 
      ref={triggerRef} 
      className="relative group/tooltip inline-block w-full" 
      onMouseEnter={calculatePosition}
      onTouchStart={calculatePosition}
    >
      {children}
      <div 
        ref={tooltipRef}
        style={{ transform: `translateX(calc(-50% + ${hOffset}px))` }}
        className={`
          absolute z-[9999] invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 
          transition-all duration-300 pointer-events-none
          bg-gray-900/98 backdrop-blur-2xl border border-orange-500/50 rounded-2xl px-5 py-3 text-[10px] 
          text-white font-bold uppercase tracking-widest shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_20px_rgba(234,88,12,0.3)]
          w-max max-w-[80vw] whitespace-normal text-center leading-relaxed
          ${position === 'top' ? 'bottom-full left-1/2 mb-4' : ''}
          ${position === 'bottom' ? 'top-full left-1/2 mt-4' : ''}
        `}
      >
        <div className="relative z-10 italic drop-shadow-lg">{text}</div>
        <div 
          style={{ transform: `translateX(calc(-50% - ${hOffset}px)) rotate(45deg)` }}
          className={`
            absolute w-3 h-3 bg-gray-900 border-r border-b border-orange-500/50 left-1/2
            ${position === 'top' ? 'bottom-[-6px]' : ''}
            ${position === 'bottom' ? 'top-[-6px]' : ''}
          `} 
        />
      </div>
    </div>
  );
};

const Badge: React.FC<{ tier: Tier }> = ({ tier }) => {
  const colors: Record<Tier, string> = {
    'SSS': 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-yellow-100 border-yellow-400 border animate-pulse font-black',
    'SS': 'bg-red-500 text-white border-red-300/30 border font-bold',
    'S': 'bg-orange-500 text-white shadow-md shadow-orange-900/20 font-bold',
    'A': 'bg-purple-600 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-blue-400 text-white',
    'D': 'bg-gray-600 text-gray-200',
    'F': 'bg-gray-800 text-gray-500',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[9px] tracking-[0.15em] uppercase shadow-sm ${colors[tier] || 'bg-gray-500'}`}>
      {tier}
    </span>
  );
};

const Card: React.FC<{ children: React.ReactNode; tier?: Tier; className?: string }> = ({ children, tier, className = '' }) => {
  const isGod = tier === 'SSS';
  return (
    <div className={`
      relative transition-all duration-500 rounded-[2rem] border group hover:z-[50]
      ${isGod 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-500/40 shadow-2xl' 
        : 'bg-gray-800/40 backdrop-blur-xl border-gray-700/50 hover:border-gray-500/50 shadow-xl'}
      ${className}
    `}>
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
        {isGod && (
          <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Crown className="text-yellow-500 w-48 h-48 rotate-12" />
          </div>
        )}
      </div>
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};

const Toast: React.FC<{ message: string; visible: boolean }> = ({ message, visible }) => (
  <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest rounded-full shadow-2xl border border-orange-400 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
    {message}
  </div>
);

// --- Main Application ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'analyze' | 'dps' | 'lab' | 'data' | 'ai'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('Hero');
  const [isGodTierOnly, setIsGodTierOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItem | Hero | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('archero_favs') || '[]'));
  const [calcStats, setCalcStats] = useState<CalcStats>(() => JSON.parse(localStorage.getItem('archero_stats') || '{"baseAtk":50000,"critChance":40,"critDmg":350,"atkSpeed":50,"weaponType":"Demon Blade"}'));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('archero_chat') || '[]'));
  const [trainingStats, setTrainingStats] = useState<TrainingStats>(() => JSON.parse(localStorage.getItem('archero_lab') || '{"bestStreak":0}'));
  
  const [buildHero, setBuildHero] = useState<string>('zeus');
  const [buildWeapon, setBuildWeapon] = useState<string>('c_hammer');
  const [buildArmor, setBuildArmor] = useState<string>('c_warplate');
  const [isInfernoMode, setIsInfernoMode] = useState(false);
  const [labStreak, setLabStreak] = useState(0);
  const [labProgress, setLabProgress] = useState(0);
  const [isLabActive, setIsLabActive] = useState(false);
  const [labFeedback, setLabFeedback] = useState<string | null>(null);
  const labIntervalRef = useRef<number>();
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('archero_favs', JSON.stringify(favorites));
    localStorage.setItem('archero_stats', JSON.stringify(calcStats));
    localStorage.setItem('archero_chat', JSON.stringify(chatHistory));
    localStorage.setItem('archero_lab', JSON.stringify(trainingStats));
    if (activeTab === 'ai') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [favorites, calcStats, chatHistory, trainingStats, activeTab]);

  const filteredData = useMemo(() => {
    const combined = [...HERO_DATA, ...GEAR_DATA];
    return combined.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
      const matchTier = isGodTierOnly ? item.tier === 'SSS' : true;
      return matchSearch && matchCat && matchTier;
    });
  }, [searchQuery, categoryFilter, isGodTierOnly]);

  const calculatedDPS = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed, weaponType } = calcStats;
    const multipliers: any = { 'Demon Blade': 1.8, 'Expedition Fist': 1.7, 'Scythe': 1.45, 'Bow': 1.0, 'Celestial Hammer': 1.9 };
    const mult = multipliers[weaponType] || 1.0;
    const critFactor = 1 + (critChance / 100 * (critDmg / 100));
    const speedFactor = 1 + (atkSpeed / 100);
    return Math.round(baseAtk * mult * critFactor * speedFactor);
  }, [calcStats]);

  const handleLabAction = () => {
    if (!isLabActive) {
      setIsLabActive(true);
      setLabProgress(0);
      setLabFeedback(null);
      labIntervalRef.current = window.setInterval(() => {
        setLabProgress(p => p >= 100 ? (handleLabResult(false), 0) : p + 5);
      }, 40);
    } else {
      const isHit = labProgress >= 25 && labProgress <= 40;
      handleLabResult(isHit);
    }
  };

  const handleLabResult = (success: boolean) => {
    clearInterval(labIntervalRef.current);
    setIsLabActive(false);
    if (success) {
      setLabStreak(s => {
        const next = s + 1;
        if (next > trainingStats.bestStreak) setTrainingStats({ bestStreak: next });
        return next;
      });
      setLabFeedback("CRITICAL HIT!");
    } else {
      setLabStreak(0);
      setLabFeedback("MISS!");
    }
    setTimeout(() => setLabFeedback(null), 1000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const msg = aiInput;
    setAiInput('');
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

  const copyBuild = () => {
    const h = HERO_DATA.find(h => h.id === buildHero)?.name;
    const w = GEAR_DATA.find(g => g.id === buildWeapon)?.name;
    const a = GEAR_DATA.find(g => g.id === buildArmor)?.name;
    const buildStr = `ZA ARMORY BUILD: Hero: ${h}, Weapon: ${w}, Armor: ${a}${isInfernoMode ? ' [INFERNO MODE]' : ''}`;
    navigator.clipboard.writeText(buildStr);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const getSynergyTip = (id: string, context: 'hero' | 'weapon' | 'armor') => {
    if (id === 'zeus' && buildWeapon === 'c_hammer') return "Divine Resonance: Zeus's inherent lightning procs trigger twice as often when using the Celestial Hammer.";
    if (id === 'c_hammer' && buildHero === 'zeus') return "Heavy Conduit: The Hammer's massive AOE is amplified by Zeus's lightning damage bonus.";
    if (id === 'helix' && buildWeapon === 'demon_blade') return "Melee Fury: Helix's Fury ability scales incredibly well with Demon Blade's high melee multiplier.";
    if (id === 'demon_blade' && buildHero === 'helix') return "Close Combat King: This blade allows Helix to stay at low HP safely while deleting bosses.";
    if (id === 'c_warplate' && isInfernoMode) return "Immortal Stack: Essential for H90+ chapters where Damage Resistance is the only way to survive hits.";
    if (id === 'exp_fist' && buildHero === 'wukong') return "Clone Strike: Wukong's clones inherit the hybrid melee properties of the Fists, creating a wall of DPS.";
    return "Archive confirmed synergy for end-game progression.";
  };

  const CATEGORY_ICONS: Record<string, any> = {
    'All': LayoutGrid, 'Hero': User, 'Weapon': Sword, 'Armor': Shield, 'Ring': Circle, 
    'Bracelet': Zap, 'Locket': Heart, 'Book': Book, 'Dragon': Flame, 'Spirit': Ghost, 
    'Pet': Dog, 'Egg': Egg, 'Totem': Tower
  };

  const currentHero = HERO_DATA.find(h => h.id === buildHero);
  const currentWeapon = GEAR_DATA.find(g => g.id === buildWeapon);
  const currentArmor = GEAR_DATA.find(g => g.id === buildArmor);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto relative overflow-visible selection:bg-orange-500/30">
      
      <Toast message="BUILD COPIED TO ARCHIVES!" visible={showToast} />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <header className="sticky top-0 z-[100] bg-gray-950/80 backdrop-blur-xl border-b border-white/5 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)]">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">ZA ARMORY</h1>
              <p className="text-[10px] text-orange-500 font-bold tracking-[0.3em] uppercase mt-1">Archero Pro Archive</p>
            </div>
          </div>
          <Tooltip text="TOGGLE GOD-TIER (SSS) DATABASE ONLY">
            <button 
              onClick={() => setIsGodTierOnly(!isGodTierOnly)}
              className={`p-3 rounded-2xl transition-all duration-500 ${isGodTierOnly ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.3)] ring-1 ring-yellow-500/50' : 'bg-white/5 text-gray-500 hover:text-white'}`}
            >
              <Crown size={22} className={isGodTierOnly ? 'animate-bounce' : ''} />
            </button>
          </Tooltip>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search datamines..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all placeholder:text-gray-600 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8 no-scrollbar pb-32 overflow-visible relative z-10">
        {activeTab === 'meta' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {Object.keys(CATEGORY_ICONS).map(cat => {
                const Icon = CATEGORY_ICONS[cat];
                const isActive = categoryFilter === cat;
                return (
                  <Tooltip key={cat} text={`FILTER BY ${cat.toUpperCase()}`}>
                    <button 
                      onClick={() => setCategoryFilter(cat as any)} 
                      className={`px-5 py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all flex-shrink-0 min-w-[70px] border ${isActive ? 'bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-900/40' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      <Icon size={20} />
                      <span className="text-[9px] font-black uppercase tracking-tighter">{cat}</span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredData.map(item => (
                <Card key={item.id} tier={item.tier}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge tier={item.tier} />
                        {item.mythicPerk && (
                          <div className="bg-gradient-to-br from-red-600 to-gray-900 text-white text-[8px] font-black px-2.5 py-1 rounded-md shadow-lg tracking-tighter uppercase border border-red-500/30 flex items-center gap-1.5">
                            <Gem size={8} className="text-yellow-400" /> Mythic
                          </div>
                        )}
                      </div>
                      <Heart 
                        size={18} 
                        onClick={() => toggleFavorite(item.id)} 
                        className={`cursor-pointer transition-transform active:scale-150 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </div>
                    <div>
                      <Tooltip text={item.mythicPerk || item.trivia || "No trivia available"}>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1 cursor-help hover:text-orange-400 transition-colors inline-block">{item.name}</h3>
                      </Tooltip>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{item.desc}</p>
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="flex items-center gap-1.5 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-orange-500/20 hover:text-orange-500 transition-all group w-full justify-center active:scale-95 shadow-lg"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">Mechanical Breakdown</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Tactical Analyzer</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Deep Build Simulation</p>
            </div>

            <div className="space-y-6">
              {/* Build Selectors */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">Primary Hero</label>
                  <select 
                    value={buildHero} 
                    onChange={e => setBuildHero(e.target.value)}
                    className="w-full bg-gray-950 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-orange-500"
                  >
                    {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>

                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">Weapon Core</label>
                  <select 
                    value={buildWeapon} 
                    onChange={e => setBuildWeapon(e.target.value)}
                    className="w-full bg-gray-950 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-orange-500"
                  >
                    {GEAR_DATA.filter(g => g.category === 'Weapon').map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">Defense Plate</label>
                  <select 
                    value={buildArmor} 
                    onChange={e => setBuildArmor(e.target.value)}
                    className="w-full bg-gray-950 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-orange-500"
                  >
                    {GEAR_DATA.filter(g => g.category === 'Armor').map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Mode Toggle */}
              <button 
                onClick={() => setIsInfernoMode(!isInfernoMode)}
                className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group ${isInfernoMode ? 'bg-red-600/20 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <Fire className={isInfernoMode ? 'animate-pulse' : ''} />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">Inferno Mode (H90+)</p>
                    <p className="text-[8px] font-bold opacity-60">Apply Extreme Chapter Modifiers</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${isInfernoMode ? 'bg-red-500' : 'bg-gray-800'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isInfernoMode ? 'left-7' : 'left-1'}`} />
                </div>
              </button>

              {/* Analysis Result */}
              <div className="bg-gray-900 rounded-[3rem] border-2 border-white/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <BrainCircuit size={120} />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Sparkles size={16} /> Neural Analysis Output
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Tooltip text={getSynergyTip(buildHero, 'hero')}>
                         <span className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-white cursor-help hover:border-orange-500 transition-colors uppercase">{currentHero?.name}</span>
                      </Tooltip>
                      <Tooltip text={getSynergyTip(buildWeapon, 'weapon')}>
                         <span className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-white cursor-help hover:border-orange-500 transition-colors uppercase">{currentWeapon?.name}</span>
                      </Tooltip>
                    </div>

                    {isInfernoMode && (
                      <div className="p-5 bg-red-600/10 border border-red-600/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-red-500">
                          <AlertTriangle size={16} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Inferno Protocol Active</p>
                        </div>
                        <ul className="text-[10px] text-gray-400 space-y-2 list-disc pl-4 font-bold">
                          {buildWeapon === 'demon_blade' && (
                             <li className="text-orange-400">NOTE: Avoid "Front Arrow" synergy; its 1.8x multiplier is less effective in Inferno boss-tanking scenarios.</li>
                          )}
                          <li>Collision Resistance is crucial; Projectile Resistance caps are easily hit in H90+.</li>
                          <li className="text-yellow-500">RECOMMENDATION: If using Dragon Rings, switch to "Celestial Bracer" for superior Collision survival and shock-wave utility.</li>
                        </ul>
                      </div>
                    )}

                    <div className="text-[12px] leading-relaxed text-gray-300 font-medium italic border-l-2 border-orange-600/50 pl-4 py-1">
                      "Selected combination achieves a 94% efficiency rating for end-game chapter clearing. Priorities: Maximize Crit Damage stack and maintain stutter rhythm."
                    </div>
                  </div>

                  <button 
                    onClick={copyBuild}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-orange-600 rounded-[2rem] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-500 transition-all active:scale-95 group"
                  >
                    <Clipboard size={18} className="group-hover:rotate-12 transition-transform" />
                    Copy Tactical Build
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dps' && (
           <div className="space-y-12">
             <div className="p-8 bg-gray-900 rounded-[3rem] border-2 border-white/5 shadow-3xl text-center relative overflow-visible group">
               <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none rounded-[3rem]" />
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">Projected Burst DPS</p>
                 <div className="text-7xl font-black text-white italic tracking-tighter transition-all group-hover:scale-105 group-hover:text-orange-500 break-words">
                   {calculatedDPS.toLocaleString()}
                 </div>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'baseAtk', label: 'Base ATK', tip: 'YOUR TOTAL ATTACK STAT' }, 
                  { key: 'critChance', label: 'CRIT %', tip: 'CHANCE TO MULTIPLY DAMAGE' }, 
                  { key: 'critDmg', label: 'CRIT DMG %', tip: 'THE MULTIPLIER PERCENTAGE' }, 
                  { key: 'atkSpeed', label: 'SPEED %', tip: 'TOTAL ATTACK SPEED BONUS' }
                ].map(f => (
                  <div key={f.key} className="bg-white/5 p-5 rounded-3xl border border-white/5 focus-within:border-orange-500 transition-colors w-full cursor-text">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">{f.label}</label>
                    <input 
                      type="number" 
                      value={calcStats[f.key as keyof CalcStats] as number} 
                      onChange={e => setCalcStats(p => ({...p, [f.key]: parseFloat(e.target.value) || 0}))} 
                      className="w-full bg-transparent text-xl font-black text-white outline-none" 
                    />
                  </div>
                ))}
             </div>
           </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="text-center space-y-2">
              <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Stutter Training</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Master the Rhythms of Combat</p>
            </div>

            <div className="p-10 bg-gray-900/50 rounded-[3rem] border-2 border-orange-500/20 shadow-2xl text-center overflow-visible">
              <div className="relative h-4 bg-gray-800 rounded-full mb-12 overflow-hidden border border-white/5">
                {isLabActive && <div className="absolute h-full bg-orange-600" style={{ width: `${labProgress}%` }} />}
                <div className="absolute top-0 h-full bg-green-500/30 border-x-2 border-green-500" style={{ left: `25%`, width: `15%` }} />
              </div>

              {labFeedback && (
                <div className={`text-4xl font-black italic mb-8 animate-bounce ${labFeedback.includes('CRITICAL') ? 'text-orange-500' : 'text-red-500'}`}>
                  {labFeedback}
                </div>
              )}

              <div className="flex justify-around mb-12">
                 <div className="text-center">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Streak</p>
                    <p className="text-4xl font-black text-white italic">{labStreak}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">High Score</p>
                    <p className="text-4xl font-black text-yellow-500 italic">{trainingStats.bestStreak}</p>
                 </div>
              </div>

              <Tooltip text="TAP WHEN THE METER ENTERS THE GREEN TARGET ZONE">
                <button 
                  onMouseDown={handleLabAction}
                  className={`w-full py-12 rounded-[2.5rem] text-2xl font-black uppercase tracking-widest transition-all shadow-3xl active:scale-95 border-b-8 ${isLabActive ? 'bg-orange-600 border-orange-800 text-white animate-pulse' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {isLabActive ? "HIT NOW!" : "ENGAGE TARGET"}
                </button>
              </Tooltip>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-280px)] animate-in slide-in-from-bottom-8 duration-500">
             <div className="flex-1 overflow-y-auto space-y-6 mb-6 no-scrollbar px-2">
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-30">
                    <BrainCircuit size={80} className="mb-4 text-orange-500 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest text-white italic">Neural Network Ready</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[2rem] text-[11px] font-medium leading-relaxed shadow-xl border ${msg.role === 'user' ? 'bg-orange-600 border-orange-500 text-white rounded-tr-none' : 'bg-gray-800 border-white/5 text-gray-200 rounded-tl-none'}`}>
                      <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex items-center gap-3 p-5 bg-white/5 rounded-2xl border border-white/5 max-w-max">
                    <Loader2 className="animate-spin text-orange-500 w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 animate-pulse">Calculating...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             <div className="flex gap-3 bg-white/5 p-3 rounded-[2.5rem] border border-white/10 shadow-3xl focus-within:border-orange-500/50 transition-colors">
                <input 
                  type="text" 
                  placeholder="Ask the strategist anything..." 
                  className="flex-1 bg-transparent px-6 py-4 text-xs font-bold outline-none italic text-white placeholder:text-gray-700" 
                  value={aiInput} 
                  onChange={e => setAiInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleAiSend()} 
                />
                <Tooltip text="SEND QUERY TO AI ARCHIVIST FOR PROCESSING">
                  <button 
                    onClick={handleAiSend} 
                    disabled={isAiLoading} 
                    className="bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-[1.8rem] shadow-xl transition-all active:scale-90 disabled:opacity-50"
                  >
                    <Send size={20}/>
                  </button>
                </Tooltip>
             </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Mastery Archives</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Deep Data Reference Sheets</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-visible">
                <div className="bg-gray-900 p-6 border-b border-white/5 flex items-center gap-3 rounded-t-[2.5rem]">
                  <Award className="text-orange-500 w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Global Mastery L120</span>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-[10px] min-w-[300px]">
                    <thead>
                      <tr className="text-gray-600 text-left border-b border-white/5">
                        <th className="pb-3 uppercase tracking-tighter">Hero</th>
                        <th className="pb-3 uppercase tracking-tighter">L120 Bonus</th>
                        <th className="pb-3 text-right uppercase tracking-tighter">Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {HERO_DATA.map(h => (
                        <tr key={h.id}>
                          <td className="py-4 font-black text-white italic">
                            <Tooltip text={h.trivia || "Hero details archived."}>
                              <span className="cursor-help hover:text-orange-400 transition-colors">{h.name}</span>
                            </Tooltip>
                          </td>
                          <td className="py-4 text-orange-500 font-black">{h.globalBonus120}</td>
                          <td className="py-4 text-right"><Badge tier={h.tier} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- Details Float (Modal) --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300" 
            onClick={() => setSelectedItem(null)} 
          />
          <div className="relative w-full max-w-xl bg-gray-950 border-t sm:border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] shadow-4xl max-h-[92vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-10 duration-500 flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md p-7 border-b border-white/5 flex items-center justify-between z-30">
              <div className="flex items-center gap-4">
                <Badge tier={selectedItem.tier} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{selectedItem.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-12">
              {/* Mechanical Briefing */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-orange-500">
                  <ScrollText size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Mechanical Briefing</h4>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 italic text-sm text-gray-300 leading-relaxed shadow-inner">
                  "{selectedItem.desc}"
                </div>
              </section>

              {/* Strategist Notes */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <BrainCircuit size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Strategist Insights</h4>
                </div>
                <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 text-[12px] leading-relaxed text-gray-200">
                  {selectedItem.deepLogic || "Mechanical analysis pending archive updates. High-level utility confirmed."}
                </div>
              </section>

              {/* Bio & Trivia */}
              {(('bio' in selectedItem && selectedItem.bio) || selectedItem.trivia) && (
                <section className="space-y-6">
                   { 'bio' in selectedItem && selectedItem.bio && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-500">
                          <User size={18} />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Archived Biography</h4>
                        </div>
                        <p className="text-[11px] text-gray-400 font-bold italic border-l-2 border-yellow-500 pl-4">{selectedItem.bio}</p>
                      </div>
                   )}
                   {selectedItem.trivia && (
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-teal-400">
                          <HelpCircle size={18} />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Secret Archives (Trivia)</h4>
                        </div>
                        <div className="p-6 bg-teal-500/5 border border-teal-500/10 rounded-3xl text-[11px] text-teal-100/70 font-bold italic">
                          "Did you know? {selectedItem.trivia}"
                        </div>
                     </div>
                   )}
                </section>
              )}

              {/* Hero Specifics */}
              {'globalBonus120' in selectedItem && (
                <section className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-orange-500/10 rounded-3xl border border-orange-500/20 text-center">
                        <h5 className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1">Global Mastery (L120)</h5>
                        <p className="text-sm font-black text-white">{selectedItem.globalBonus120}</p>
                     </div>
                     <div className="p-5 bg-green-500/10 rounded-3xl border border-green-500/20 text-center">
                        <h5 className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Shard Access</h5>
                        <p className="text-sm font-black text-white">{selectedItem.shardCost || 'Premium'}</p>
                     </div>
                   </div>
                   {selectedItem.assistHeroes && (
                     <div className="space-y-4">
                        <h5 className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">Recommended Assist Slots</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.assistHeroes.map(a => (
                            <span key={a} className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-[11px] font-bold text-gray-300">
                              {a}
                            </span>
                          ))}
                        </div>
                     </div>
                   )}
                </section>
              )}

              {/* Gear Specifics: Rarity Perks */}
              {selectedItem.rarityPerks && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Award size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Rarity Breakthroughs</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedItem.rarityPerks.map(p => (
                      <div key={p.rarity} className="flex items-center justify-between p-5 bg-white/5 rounded-[2rem] border border-white/5">
                        <span className="text-[11px] font-black text-purple-400 uppercase italic tracking-tighter">{p.rarity}</span>
                        <span className="text-[11px] font-bold text-gray-200 text-right max-w-[60%]">{p.effect}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* High Synergy Combos */}
              {selectedItem.bestPairs && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">High Synergy Combos</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 pb-8">
                    {selectedItem.bestPairs.map(p => (
                      <div key={p} className="px-5 py-2.5 bg-green-500/5 rounded-full border border-green-500/10 flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest">
                        <Check size={14} /> {p}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-[400]">
        <div className="bg-gray-950/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] flex justify-between items-center shadow-4xl">
          {[
            { id: 'meta', icon: Crown, label: 'Meta', tip: 'BROWSE TOP TIER LISTS & GEAR' },
            { id: 'analyze', icon: TrendingUp, label: 'Sim', tip: 'TEST GEAR SYNERGIES & BUILDS' },
            { id: 'dps', icon: Calculator, label: 'Stats', tip: 'CALCULATE COMBAT DAMAGE OUTPUT' },
            { id: 'lab', icon: Target, label: 'Lab', tip: 'TRAIN COMBAT TIMING MECHANICS' },
            { id: 'data', icon: LayoutDashboard, label: 'Data', tip: 'VIEW RAW ARCHIVE DATABASE' },
            { id: 'ai', icon: MessageSquare, label: 'Ask', tip: 'CHAT WITH THE AI ARCHIVIST' },
          ].map(t => (
            <Tooltip key={t.id} text={t.tip}>
              <button 
                onClick={() => setActiveTab(t.id as any)} 
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-[1.8rem] transition-all duration-500 group relative ${activeTab === t.id ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {activeTab === t.id && <div className="absolute inset-0 bg-white/5 rounded-[1.8rem] animate-in fade-in" />}
                <t.icon size={20} className="relative z-10" />
                <span className="text-[8px] font-black uppercase tracking-tighter relative z-10">{t.label}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
