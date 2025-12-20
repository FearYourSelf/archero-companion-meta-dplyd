
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Sparkles, Send, BrainCircuit, Loader2,
  X, Layers, Info, Trash2, Heart, Calculator, RefreshCw,
  Crown, MousePointer2, Ghost, Target, PawPrint as Dog, Book, BookOpen, Egg, Landmark as Tower, Flame,
  Circle, ChevronRight, ExternalLink, Bell, LayoutDashboard, Trophy
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, HERO_EFFICIENCY_DATA, 
  SKIN_VALUE_DATA, EQUIPMENT_META_DATA 
} from './constants';
import { Badge, Card } from './components/UI';
import { chatWithAI } from './services/geminiService';
import { ChatMessage, Tier, BaseItem, Hero, GearCategory, CalcStats, TrainingStats } from './types';

type Tab = 'tierlist' | 'builds' | 'calc' | 'lab' | 'resources' | 'ai';

interface Toast {
  id: number;
  message: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tierlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'All' | 'Low'>('All');
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [gearCategory, setGearCategory] = useState<GearCategory | 'Hero'>('Hero');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // State Persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('archero_favs');
    return saved ? JSON.parse(saved) : [];
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('archero_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [calcStats, setCalcStats] = useState<CalcStats>(() => {
    const saved = localStorage.getItem('archero_calc_stats');
    return saved ? JSON.parse(saved) : { baseAtk: 10000, critChance: 30, critDmg: 200, atkSpeed: 50 };
  });
  const [trainingStats, setTrainingStats] = useState<TrainingStats>(() => {
    const saved = localStorage.getItem('archero_training_stats');
    return saved ? JSON.parse(saved) : { currentStreak: 0, bestStreak: 0 };
  });

  // UI / Comparison State
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isInferno, setIsInferno] = useState(false);
  
  // Build Selection
  const [buildHero, setBuildHero] = useState(HERO_DATA[0].id);
  const [buildWeapon, setBuildWeapon] = useState(GEAR_DATA.filter(g => g.category === 'Weapon')[0].id);
  const [buildDragon, setBuildDragon] = useState(GEAR_DATA.filter(g => g.category === 'Dragon')[0].id);

  // Lab Mini-Game State
  const [trainerProgress, setTrainerProgress] = useState(0);
  const [labState, setLabState] = useState<'IDLE' | 'ATTACKING'>('IDLE');
  const [targetZone, setTargetZone] = useState({ start: 25, end: 35 });
  const [trainerFeedback, setTrainerFeedback] = useState<{ text: string, type: 'perfect' | 'miss' | 'none' }>({ text: 'Ready', type: 'none' });
  const trainerInterval = useRef<number | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('archero_favs', JSON.stringify(favorites));
    localStorage.setItem('archero_chat_history', JSON.stringify(chatMessages));
    localStorage.setItem('archero_calc_stats', JSON.stringify(calcStats));
    localStorage.setItem('archero_training_stats', JSON.stringify(trainingStats));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [favorites, chatMessages, calcStats, trainingStats]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Lab Action: Randomized Zone & Streak Mastery
  const handleLabAction = () => {
    if (labState === 'IDLE') {
      const start = Math.floor(Math.random() * 60) + 20;
      setTargetZone({ start, end: start + 10 });
      setLabState('ATTACKING');
      setTrainerProgress(0);
      setTrainerFeedback({ text: 'Attacking...', type: 'none' });
      
      trainerInterval.current = window.setInterval(() => {
        setTrainerProgress(prev => {
          if (prev >= 100) {
            clearInterval(trainerInterval.current!);
            setLabState('IDLE');
            setTrainerFeedback({ text: 'TOO SLOW', type: 'miss' });
            setTrainingStats(s => ({ ...s, currentStreak: 0 }));
            return 100;
          }
          return prev + 4;
        });
      }, 50);
    } else {
      clearInterval(trainerInterval.current!);
      setLabState('IDLE');
      if (trainerProgress >= targetZone.start && trainerProgress <= targetZone.end) {
        const nextStreak = trainingStats.currentStreak + 1;
        const newBest = Math.max(nextStreak, trainingStats.bestStreak);
        
        if (nextStreak > trainingStats.bestStreak && trainingStats.bestStreak > 0) {
          addToast("NEW RECORD! Streak: " + nextStreak);
        } else {
          addToast("Perfect Timing!");
        }

        setTrainingStats({ currentStreak: nextStreak, bestStreak: newBest });
        setTrainerFeedback({ text: 'PERFECT! (+40% Speed)', type: 'perfect' });
      } else {
        setTrainerFeedback({ text: 'MISSED TIMING', type: 'miss' });
        setTrainingStats(s => ({ ...s, currentStreak: 0 }));
      }
    }
  };

  const dpsResult = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    // Official Formula: Base Atk * (1 + (CritChance * (CritDmg-1))) * (1 + AtkSpeed)
    // Simplified for UI: baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + atkSpeed / 100)
    const result = baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + atkSpeed / 100);
    return Math.round(result);
  }, [calcStats]);

  const buildResult = useMemo(() => {
    if (buildHero === 'zeus') return "GOD META: Zeus requires Celestial Hammer and Band. Prioritize Lightning skills.";
    if (buildHero === 'helix') return "AGGRESSIVE F2P: Helix excels with Demon Blade heals. Strategy: Stay low HP to maximize Rage.";
    if (buildHero === 'melinda') return "SSS DPS: Melinda is best with Expedition Fist. Barrage master, focus on raw ATK.";
    if (buildDragon === 'magmar') return "MANA: Best for active ability builds. Magmar provides top-tier Mana Regen.";
    if (buildDragon === 'necro') return "INFERNO: Mandatory for H90+. Passive PR is key for survival.";
    return "Balanced meta setup. Upgrade Attack Totems in your Estate first for highest DPS scaling.";
  }, [buildHero, buildDragon]);

  const toggleFavorite = (id: string) => {
    const isFav = favorites.includes(id);
    setFavorites(prev => isFav ? prev.filter(f => f !== id) : [...prev, id]);
    addToast(isFav ? "Removed from Favorites" : "Saved to Favorites");
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const filteredItems = useMemo(() => {
    let items: BaseItem[] = gearCategory === 'Hero' ? HERO_DATA : GEAR_DATA.filter(g => g.category === gearCategory);

    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = tierFilter === 'All' 
        ? true 
        : tierFilter === 'Low' 
          ? ['B', 'C', 'D', 'F'].includes(item.tier)
          : item.tier === tierFilter;
      const matchFav = showFavsOnly ? favorites.includes(item.id) : true;
      return matchSearch && matchTier && matchFav;
    });
  }, [gearCategory, searchQuery, tierFilter, showFavsOnly, favorites]);

  const categoryIcons: Record<string, any> = {
    Hero: User,
    Weapon: Sword,
    Armor: Shield,
    Ring: Circle,
    Locket: Heart,
    Spirit: Ghost,
    Pet: Dog,
    Dragon: Flame,
    Book: Book,
    Egg: Egg,
    Totem: Tower
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: Date.now() }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const res = await chatWithAI(chatMessages, userMsg);
      setChatMessages(prev => [...prev, { 
        role: 'model', 
        text: res.text, 
        timestamp: Date.now(),
        sources: res.sources
      }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Wiki link failed. Check local grounding records.", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto border-x border-gray-800 pb-24 shadow-2xl relative">
      
      {/* HEADER: Title & Search */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-[100]">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center transform -rotate-3 shadow-lg shadow-orange-600/20">
                <Sword className="text-white w-5 h-5" />
              </div>
              <h1 className="text-lg font-black tracking-tighter text-white italic uppercase">ARCHERO<span className="text-orange-500">PRO</span></h1>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest bg-gray-800 px-1.5 py-0.5 rounded">v2025.META</span>
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search gear, heroes, strategy..." 
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-2 pl-9 pr-9 text-xs focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* CONTEXT CHIPS: Tier List Filters */}
        {activeTab === 'tierlist' && (
          <div className="px-4 pb-3 flex flex-col gap-3 border-t border-gray-800/50 pt-3 bg-gray-900/40">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              <button 
                onClick={() => setShowFavsOnly(!showFavsOnly)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap border flex items-center gap-1.5 ${showFavsOnly ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
              >
                <Heart size={10} className={showFavsOnly ? 'fill-white' : ''} /> Favs
              </button>
              <div className="w-px h-3.5 bg-gray-800 my-auto" />
              {['All', 'SSS', 'SS', 'S', 'A', 'Low'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setTierFilter(f as any)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap border ${tierFilter === f ? 'bg-orange-600 border-orange-400 text-white shadow-md' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {Object.keys(categoryIcons).map(cat => {
                const Icon = categoryIcons[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setGearCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap transition-all border flex items-center gap-1.5 ${gearCategory === cat ? 'bg-orange-600 border-orange-500 text-white shadow-md' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                  >
                    <Icon size={12} /> {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* TOAST SYSTEM */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] pointer-events-none flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-orange-600 text-white px-4 py-1.5 rounded-full shadow-2xl text-[10px] font-black uppercase animate-in slide-in-from-top-4 fade-in duration-300 border border-orange-400/50">
            {toast.message}
          </div>
        ))}
      </div>

      {/* COMPARISON MODAL */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-lg rounded-3xl border border-gray-800 overflow-hidden flex flex-col shadow-3xl">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h3 className="font-black text-xs uppercase tracking-widest text-orange-500 italic flex items-center gap-2">
                <Layers size={14} /> Compare Meta
              </h3>
              <button onClick={() => setIsCompareModalOpen(false)} className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"><X size={16}/></button>
            </div>
            <div className="flex-1 overflow-x-auto p-5 flex gap-4 no-scrollbar">
              {compareList.map(id => {
                const item = HERO_DATA.find(h => h.id === id) || GEAR_DATA.find(g => g.id === id);
                if (!item) return null;
                return (
                  <div key={id} className={`min-w-[180px] flex-shrink-0 bg-gray-800/50 p-4 rounded-2xl border flex flex-col ${item.tier === 'SSS' ? 'border-red-500/50' : 'border-gray-700'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <Badge tier={item.tier} />
                      <button onClick={() => toggleCompare(id)} className="text-red-500"><Trash2 size={14}/></button>
                    </div>
                    <h4 className="font-black text-white uppercase italic text-[11px] mb-1 leading-tight">{item.name}</h4>
                    <span className="text-[9px] font-bold text-orange-500 mb-3 uppercase tracking-tighter">{item.category}</span>
                    <p className="text-[10px] text-gray-400 flex-1 leading-relaxed italic">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      {compareList.length > 0 && !isCompareModalOpen && (
        <button 
          onClick={() => setIsCompareModalOpen(true)}
          className="fixed bottom-28 right-6 z-[120] bg-orange-600 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-black uppercase text-[10px] animate-bounce border border-orange-400"
        >
          <Layers size={14} /> Compare ({compareList.length})
        </button>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-5 overflow-y-auto no-scrollbar">
        
        {activeTab === 'tierlist' && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {filteredItems.map(item => (
              <Card 
                key={item.id} 
                tier={item.tier} 
                className={`group relative transition-all active:scale-[0.98] ${item.tier === 'SSS' ? 'ring-2 ring-red-600/20 shadow-red-900/20' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleFavorite(item.id)}>
                      <Heart size={18} className={favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
                    </button>
                    <h3 className="font-black text-sm text-white uppercase italic tracking-tight group-hover:text-orange-500 transition-colors">{item.name}</h3>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => toggleCompare(item.id)} 
                      className={`p-1 ${compareList.includes(item.id) ? 'text-orange-500' : 'text-gray-600'}`}
                    >
                      <Layers size={14} />
                    </button>
                    <Badge tier={item.tier} />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mb-2 font-medium leading-relaxed italic">{item.desc}</p>
                {item.details && <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tight border-t border-gray-700/30 pt-2">{item.details}</p>}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'builds' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-black italic text-orange-500 flex items-center justify-center gap-2 uppercase tracking-tight">
              <BrainCircuit size={24} /> AI Builder Strategy
            </h2>
            <div className="space-y-4 bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase px-1 tracking-widest">Selected Hero</label>
                <select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs font-black appearance-none outline-none focus:border-orange-500">
                  {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase px-1 tracking-widest">Main Weapon</label>
                  <select value={buildWeapon} onChange={e => setBuildWeapon(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-[10px] font-bold">
                    {GEAR_DATA.filter(g => g.category === 'Weapon').map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase px-1 tracking-widest">Dragon Statue</label>
                  <select value={buildDragon} onChange={e => setBuildDragon(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-[10px] font-bold">
                    {GEAR_DATA.filter(g => g.category === 'Dragon').map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <Sparkles className="absolute top-3 right-3 text-orange-200" size={20} />
              <div className="relative z-10">
                <h4 className="text-[9px] font-black uppercase text-orange-100 tracking-widest mb-3 italic">AI Analysis</h4>
                <p className="text-sm font-black text-white italic leading-tight">{buildResult}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => addToast("Build saved")} className="bg-white/10 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/10">Save Plan</button>
                  <button onClick={() => setActiveTab('ai')} className="bg-orange-900/50 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-orange-700/50 flex items-center gap-1.5"><MessageSquare size={10}/> Expert Advice</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calc' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black italic text-orange-500 flex items-center justify-center gap-2 uppercase tracking-tight">
              <Calculator size={24} /> DPS Calculator
            </h2>
            <div className="grid grid-cols-2 gap-3 p-6 bg-gray-800/50 rounded-3xl border border-gray-700">
              {[
                { label: 'Base Attack', key: 'baseAtk' },
                { label: 'Crit Chance %', key: 'critChance' },
                { label: 'Crit Dmg %', key: 'critDmg' },
                { label: 'Atk Speed %', key: 'atkSpeed' },
              ].map(field => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-500 uppercase px-1 tracking-widest">{field.label}</label>
                  <input 
                    type="number"
                    value={calcStats[field.key as keyof CalcStats]}
                    onChange={(e) => setCalcStats(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs font-black focus:border-orange-500 outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 p-8 bg-gray-950 border-t-2 border-orange-500 rounded-[2.5rem] text-center shadow-inner relative overflow-hidden">
              <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 italic">Estimated DPS</h4>
              <div className="text-5xl font-black text-white tracking-tighter mb-5 italic">{dpsResult.toLocaleString()}</div>
              <p className="text-[8px] text-orange-400 font-black uppercase tracking-widest opacity-60">Formula: Atk * (1 + Crit%) * (1 + Speed%)</p>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black italic text-orange-500 uppercase tracking-tight">Training Lab</h2>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Trophy size={14} />
                  <span className="text-[10px] font-black">BEST: {trainingStats.bestStreak}</span>
                </div>
                <span className="text-[8px] text-gray-600 font-bold uppercase">Streak: {trainingStats.currentStreak}</span>
              </div>
            </div>

            <Card className="p-8 text-center bg-gray-800/50 border-orange-500/20 shadow-2xl">
              <h4 className="font-black text-lg text-white mb-6 uppercase tracking-tighter italic flex items-center justify-center gap-2">
                Stutter Step Master <MousePointer2 size={18} />
              </h4>
              <div className="relative h-10 bg-gray-950 rounded-full overflow-hidden mb-8 border border-gray-700 shadow-inner">
                <div className="absolute h-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${trainerProgress}%` }} />
                <div 
                  className="absolute top-0 h-full bg-green-500/30 border-x-2 border-green-500/50 flex items-center justify-center"
                  style={{ left: `${targetZone.start}%`, width: `${targetZone.end - targetZone.start}%` }}
                >
                  <span className="text-[7px] font-black text-green-400 uppercase tracking-widest opacity-60">WINDOW</span>
                </div>
              </div>
              <div className={`p-4 rounded-xl font-black uppercase text-xs mb-8 transition-all ${trainerFeedback.type === 'perfect' ? 'bg-green-600/20 text-green-500' : trainerFeedback.type === 'miss' ? 'bg-red-600/20 text-red-500' : 'bg-gray-900 text-gray-700'}`}>{trainerFeedback.text}</div>
              <button 
                onClick={handleLabAction} 
                className={`w-full py-6 rounded-2xl font-black uppercase text-xs transition-all shadow-xl active:scale-95 border-b-4 ${
                  labState === 'IDLE' 
                    ? 'bg-gray-900 border-gray-950 text-white' 
                    : 'bg-orange-600 border-orange-800 text-white animate-pulse'
                }`}
              >
                {labState === 'IDLE' ? 'ATTACK' : 'CANCEL ANIMATION'}
              </button>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 px-2"><Target size={14}/> Simulation Mode</h3>
              <div className="flex gap-2 bg-gray-950 p-1 rounded-2xl border border-gray-800">
                <button onClick={() => setIsInferno(false)} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${!isInferno ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500'}`}>Normal</button>
                <button onClick={() => setIsInferno(true)} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isInferno ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}>Inferno (H90+)</button>
              </div>
              <Card className={`${isInferno ? 'border-red-600 bg-red-950/20' : 'border-orange-600/30 bg-orange-950/5'} p-5 transition-colors`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${isInferno ? 'bg-red-600' : 'bg-orange-600'}`}><Ghost size={20} /></div>
                  <div className="flex-1">
                    <h4 className="font-black text-white uppercase italic text-sm mb-1">{isInferno ? 'Inferno Strategy' : 'PR Meta Build'}</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase opacity-80 italic">
                      {isInferno 
                        ? 'Chapter H90+ nerfed Projectile Resistance. Pivot to Raw HP, Collision Resist, and Bull Rings. Survival > Caps.' 
                        : 'Standard meta favors 100% Proj Resistance (PR) using Dragon Rings & Necrogon for 0 damage bullet hells.'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="text-center">
              <h2 className="text-xl font-black italic text-orange-500 uppercase tracking-tight">Pro Data Hub</h2>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Japanese Wiki Ground Truth</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase text-gray-400 px-1 flex items-center gap-2"><Crown size={12} className="text-yellow-500" /> Hero Investment</h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-x-auto no-scrollbar shadow-xl">
                  <table className="w-full text-left text-[10px] min-w-[320px]">
                    <thead className="bg-gray-900/50 border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-black uppercase text-gray-500">Hero</th>
                        <th className="px-4 py-3 font-black uppercase text-gray-500">Bonus</th>
                        <th className="px-4 py-3 font-black uppercase text-gray-500 text-right">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {HERO_EFFICIENCY_DATA.map((h, i) => (
                        <tr key={i} className="hover:bg-gray-700/20 transition-colors">
                          <td className="px-4 py-3 font-black text-white italic">{h.name}</td>
                          <td className="px-4 py-3 font-bold text-orange-400">{h.bonus}</td>
                          <td className="px-4 py-3 text-right font-black text-gray-400">{h.priority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase text-gray-400 px-1 flex items-center gap-2"><Sparkles size={12} className="text-orange-500" /> Skin Value</h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-x-auto no-scrollbar shadow-xl">
                  <table className="w-full text-left text-[10px] min-w-[320px]">
                    <thead className="bg-gray-900/50 border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-black uppercase text-gray-500">Skin</th>
                        <th className="px-4 py-3 font-black uppercase text-gray-500">Stat</th>
                        <th className="px-4 py-3 font-black uppercase text-gray-500 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {SKIN_VALUE_DATA.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-700/20 transition-colors">
                          <td className="px-4 py-3 font-black text-white italic">{s.name}</td>
                          <td className="px-4 py-3 font-bold text-green-400">{s.boost}</td>
                          <td className="px-4 py-3 text-right font-black text-gray-400">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-280px)] animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 no-scrollbar">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-5 opacity-40">
                  <div className="w-20 h-20 bg-gray-800 rounded-[2rem] flex items-center justify-center border border-gray-700 shadow-2xl">
                    <MessageSquare size={40} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-black italic uppercase text-white tracking-tighter">Archero Strategist</h3>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic px-10">Syncing with Meta 2025 DB...</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[10px] font-bold leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-800 border border-gray-700 rounded-tl-none text-gray-200 italic'}`}>
                    {msg.text}
                    {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-700/50 space-y-1">
                        {msg.sources.map((source: any, idx) => (
                          source.web && (
                            <a key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[8px] text-gray-500 hover:text-white transition-colors uppercase font-black">
                              <ExternalLink size={8} /> <span>Wiki Data Source</span>
                            </a>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-orange-500" />
                    <span className="text-[9px] font-black text-gray-500 uppercase">Consulting Meta Wiki...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2 bg-gray-950 p-2 rounded-2xl border border-gray-800 shadow-2xl">
              <input 
                type="text" 
                placeholder="Ask meta advice..." 
                className="flex-1 bg-transparent px-4 py-3 text-xs font-black focus:outline-none italic"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button onClick={handleSendChat} disabled={isChatLoading} className="bg-orange-600 text-white p-3 rounded-xl shadow-lg shadow-orange-600/40">
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FIXED BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gray-950/95 backdrop-blur-2xl border-t border-gray-800 p-2.5 flex justify-around items-center z-[110] rounded-t-[2.5rem] shadow-2xl">
        {[
          { id: 'tierlist', icon: Crown, label: 'Meta' },
          { id: 'builds', icon: BrainCircuit, label: 'Builder' },
          { id: 'calc', icon: Calculator, label: 'Calc' },
          { id: 'lab', icon: Zap, label: 'Lab' },
          { id: 'resources', icon: LayoutDashboard, label: 'Stats' },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as Tab)} 
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-all ${activeTab === tab.id ? 'text-orange-500 scale-110' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <tab.icon size={18} />
            <span className="text-[8px] font-black uppercase tracking-tight">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
