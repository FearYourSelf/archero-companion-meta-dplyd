
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, Image as ImageIcon, 
  Sparkles, Send, ChevronRight, BrainCircuit, ExternalLink, Loader2,
  X, Layers, Info, Trash2, Heart, DollarSign, Plus, Check, Calculator, RefreshCw,
  Trophy, Target, MousePointer2, Ghost, BookOpen, Crown
} from 'lucide-react';
import { HERO_DATA, GEAR_DATA, ABILITIES_DATA, MECHANICS } from './constants';
import { Badge, ProgressBar, Card } from './components/UI';
import { analyzeScreenshot, chatWithAI, findLocalAnswer } from './services/geminiService';
import { ChatMessage, Tier, BaseItem, Hero, GearCategory, CalcStats } from './types';

type Tab = 'meta' | 'gear' | 'builds' | 'calc' | 'ai' | 'lab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'All' | 'Favs'>('All');
  const [gearCategory, setGearCategory] = useState<GearCategory | 'All'>('Weapon');
  
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

  // UI State
  const [compareItems, setCompareItems] = useState<BaseItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isInferno, setIsInferno] = useState(false);

  // Build Selections
  const [buildHero, setBuildHero] = useState(HERO_DATA[0].id);
  const [buildWeapon, setBuildWeapon] = useState(GEAR_DATA.filter(g => g.category === 'Weapon')[0].id);
  const [buildArmor, setBuildArmor] = useState(GEAR_DATA.filter(g => g.category === 'Armor')[0].id);

  // Mini-Game State
  const [trainerProgress, setTrainerProgress] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [trainerFeedback, setTrainerFeedback] = useState<{ text: string, type: 'perfect' | 'miss' | 'none' }>({ text: 'Start Trainer', type: 'none' });
  const trainerInterval = useRef<number | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('archero_favs', JSON.stringify(favorites));
    localStorage.setItem('archero_chat_history', JSON.stringify(chatMessages));
    localStorage.setItem('archero_calc_stats', JSON.stringify(calcStats));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [favorites, chatMessages, calcStats]);

  // Logic: Trainer
  const startTrainer = () => {
    if (isAttacking) return;
    setIsAttacking(true);
    setTrainerProgress(0);
    setTrainerFeedback({ text: '...', type: 'none' });
    
    trainerInterval.current = window.setInterval(() => {
      setTrainerProgress(prev => {
        if (prev >= 100) {
          clearInterval(trainerInterval.current!);
          setIsAttacking(false);
          setTrainerFeedback({ text: 'TOO SLOW (Animation Locked)', type: 'miss' });
          return 100;
        }
        return prev + 4;
      });
    }, 40);
  };

  const handleCancel = () => {
    if (!isAttacking) return;
    clearInterval(trainerInterval.current!);
    setIsAttacking(false);
    
    // Goal: 30%. Perfect Window: 25-35%
    if (trainerProgress >= 25 && trainerProgress <= 35) {
      setTrainerFeedback({ text: 'PERFECT! (Attack Speed +40%)', type: 'perfect' });
    } else {
      setTrainerFeedback({ text: 'BAD TIMING (Animation Not Canceled)', type: 'miss' });
    }
  };

  // Logic: Calculator
  const dpsResult = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    const result = baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + atkSpeed / 100);
    return Math.round(result);
  }, [calcStats]);

  // Logic: Build Analyzer
  const analyzeBuild = () => {
    if (buildHero === 'zeus' && buildWeapon === 'hammer') return "GOD SYNERGY: Thunder God's Wrath Active!";
    if (buildWeapon === 'staff') {
      const isBadSynergy = true; // Simulating check for Front Arrow, here just based on selection
      return "WARNING: Bad Synergy. Staff needs Diagonal Arrows. Avoid Front Arrow.";
    }
    const heroName = HERO_DATA.find(h => h.id === buildHero)?.name;
    const weaponName = GEAR_DATA.find(w => w.id === buildWeapon)?.name;
    return `${heroName} with ${weaponName} is a solid balanced build. Focus on stutter-stepping.`;
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleCompareSelect = (item: BaseItem) => {
    setCompareItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev.filter(i => i.id !== item.id);
      if (prev.length >= 4) return prev;
      return [...prev, item];
    });
  };

  const filterItems = <T extends BaseItem>(items: T[]) => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = tierFilter === 'All' || item.tier === tierFilter;
      const matchFav = tierFilter === 'Favs' ? favorites.includes(item.id) : true;
      const matchCategory = gearCategory === 'All' || item.category === gearCategory;
      return matchSearch && (tierFilter === 'Favs' ? matchFav : matchTier) && matchCategory;
    });
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: Date.now() }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const res = await chatWithAI(chatMessages, userMsg);
      setChatMessages(prev => [...prev, { role: 'model', text: res.text, timestamp: Date.now() }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Wiki engine disconnected. Please check manual sources.", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto shadow-2xl relative border-x border-gray-800 pb-24">
      
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md p-5 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center transform -rotate-3 shadow-lg shadow-orange-600/30">
              <Sword className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">ARCHERO<span className="text-orange-500">DB</span></h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-800 px-2 rounded">JP Wiki Logic</span>
                <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsCompareOpen(true)}
            className={`p-2.5 rounded-xl transition-all relative ${compareItems.length > 0 ? 'bg-orange-600' : 'bg-gray-800 text-gray-500'}`}
          >
            <Layers size={20} />
            {compareItems.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">{compareItems.length}</span>}
          </button>
        </div>

        {/* Global Controls */}
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search gear, heroes, skills..." 
              className="w-full bg-gray-800 border border-gray-700/50 rounded-2xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['All', 'Favs', 'SSS', 'SS', 'S', 'A'].map(f => (
              <button 
                key={f} 
                onClick={() => setTierFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap border ${tierFilter === f ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-black text-xl flex items-center gap-3"><Layers className="text-orange-500" /> Comparison Deck</h3>
              <button onClick={() => setIsCompareOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-6 overflow-x-auto">
              {compareItems.length === 0 ? (
                <div className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest">Select up to 4 items to compare</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 min-w-[500px]">
                  {compareItems.map(item => (
                    <div key={item.id} className="bg-gray-800/50 p-4 rounded-3xl border border-gray-700 space-y-4">
                      <div className="flex justify-between items-start">
                        <Badge tier={item.tier} />
                        <button onClick={() => handleCompareSelect(item)}><Trash2 size={14} className="text-red-500" /></button>
                      </div>
                      <div className="h-12 flex items-center"><h4 className="font-black text-xs text-white uppercase leading-tight">{item.name}</h4></div>
                      <div className="text-[10px] font-bold text-orange-500 uppercase">{item.category}</div>
                      <div className="text-[10px] text-gray-400 leading-relaxed overflow-y-auto h-32 no-scrollbar">{item.details || item.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="flex-1 p-5 overflow-y-auto">
        
        {activeTab === 'meta' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="text-yellow-500" size={24} />
              <h2 className="text-xl font-black italic uppercase text-orange-500">Tier List Hub</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {['Hero', 'Weapon', 'Armor', 'Ring', 'Dragon', 'Pet', 'Book'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setGearCategory(cat as GearCategory)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all border ${gearCategory === cat ? 'bg-orange-600 border-orange-500' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                >
                  {cat}s
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {gearCategory === 'Hero' ? (
                filterItems(HERO_DATA).map(hero => (
                  <Card key={hero.id} className="relative group overflow-hidden">
                    {hero.isGodTier && <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent -rotate-45 translate-x-10 -translate-y-10" />}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleFavorite(hero.id)}>
                          <Heart size={20} className={favorites.includes(hero.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
                        </button>
                        <h3 className="font-black text-xl text-white uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors">{hero.name}</h3>
                      </div>
                      <Badge tier={hero.tier} />
                    </div>
                    <p className="text-xs text-gray-400 mb-4 font-medium leading-relaxed">{hero.details || hero.desc}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-[10px] font-black text-gray-600 uppercase">
                        <span className="w-12">ATK</span>
                        <ProgressBar value={hero.stats.atk} max={10} color="orange" />
                      </div>
                      <div className="flex items-center text-[10px] font-black text-gray-600 uppercase">
                        <span className="w-12">HP</span>
                        <ProgressBar value={hero.stats.hp} max={10} color="blue" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                filterItems(GEAR_DATA).map(item => (
                  <Card key={item.id} className="hover:border-orange-500/50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleFavorite(item.id)}>
                          <Heart size={18} className={favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
                        </button>
                        <h4 className="font-black text-white text-base uppercase italic tracking-tight">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                         <button onClick={() => handleCompareSelect(item)} className={`p-1 rounded bg-gray-900 border ${compareItems.find(i => i.id === item.id) ? 'border-orange-500 text-orange-500' : 'border-gray-700 text-gray-500'}`}><Plus size={14} /></button>
                         <Badge tier={item.tier} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">{item.desc}</p>
                    {item.details && <p className="text-[10px] text-gray-600 italic border-t border-gray-700 pt-2 mt-2">{item.details}</p>}
                    {item.synergy && <div className="mt-3 p-2 bg-blue-500/5 rounded-xl border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest"><Sparkles size={10} className="inline mr-1" /> Synergy: {item.synergy}</div>}
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'builds' && (
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
            <div className="text-center p-6 space-y-2">
              <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-2">
                <BrainCircuit size={28} /> Build Analyzer
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Wiki Synergy Logic</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hero</label>
                <select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 transition-colors cursor-pointer outline-none">
                  {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name.toUpperCase()} ({h.tier})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Weapon</label>
                <select value={buildWeapon} onChange={e => setBuildWeapon(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 transition-colors cursor-pointer outline-none">
                  {GEAR_DATA.filter(g => g.category === 'Weapon').map(w => <option key={w.id} value={w.id}>{w.name.toUpperCase()} ({w.tier})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Armor</label>
                <select value={buildArmor} onChange={e => setBuildArmor(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 transition-colors cursor-pointer outline-none">
                  {GEAR_DATA.filter(g => g.category === 'Armor').map(a => <option key={a.id} value={a.id}>{a.name.toUpperCase()} ({a.tier})</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <Sparkles className="absolute top-4 right-4 text-orange-200 animate-pulse" />
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase text-orange-200 tracking-widest mb-4">Synergy Summary</h4>
                <p className="text-xl font-black text-white italic leading-tight">{analyzeBuild()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calc' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center p-6 space-y-2">
              <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-2 uppercase">
                <Calculator size={28} /> DPS Calculator
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase">Manual Stat Analysis</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Base Attack', key: 'baseAtk', step: 100, icon: Sword },
                { label: 'Crit Chance %', key: 'critChance', step: 1, icon: Target },
                { label: 'Crit Dmg %', key: 'critDmg', step: 5, icon: Sparkles },
                { label: 'Atk Speed %', key: 'atkSpeed', step: 5, icon: RefreshCw },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1">
                    <field.icon size={10} /> {field.label}
                  </label>
                  <input 
                    type="number"
                    value={calcStats[field.key as keyof CalcStats]}
                    onChange={(e) => setCalcStats(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all shadow-inner"
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 p-10 bg-gray-950 border border-gray-800 rounded-[3rem] text-center shadow-2xl relative overflow-hidden border-t-orange-500 border-t-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Calculated Base DPS</h4>
              <div className="text-6xl font-black text-white tracking-tighter mb-4 italic">
                {dpsResult.toLocaleString()}
              </div>
              <p className="text-[10px] text-gray-500 max-w-xs mx-auto">Actual damage varies by Enemy Type, Elemental Resists, and Boss modifiers.</p>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black italic text-orange-500 text-center uppercase">Training Lab</h2>
            
            <Card className="p-8 text-center bg-gray-800/50">
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-xl text-white mb-1 uppercase tracking-tighter">Stutter Step Trainer</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Goal: Click Move at 30% Progress</p>
                </div>
                
                <div className="w-full space-y-8">
                  <div className="relative h-4 bg-gray-950 rounded-full overflow-hidden border border-gray-700">
                    <div 
                      className="absolute h-full bg-orange-600 transition-all duration-75"
                      style={{ width: `${trainerProgress}%` }}
                    />
                    {/* Perfect Region Indicator */}
                    <div className="absolute top-0 left-[25%] right-[65%] h-full bg-green-500/20 border-x border-green-500/40" />
                  </div>

                  <div className={`p-4 rounded-2xl font-black uppercase text-sm transition-all duration-300 ${
                    trainerFeedback.type === 'perfect' ? 'bg-green-600 text-white scale-110 shadow-lg' : 
                    trainerFeedback.type === 'miss' ? 'bg-red-600 text-white' : 
                    'bg-gray-800 text-gray-500'
                  }`}>
                    {trainerFeedback.text}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={startTrainer}
                      disabled={isAttacking}
                      className="flex-1 py-4 bg-gray-900 border border-gray-700 hover:bg-gray-800 disabled:opacity-50 rounded-2xl font-black uppercase text-xs flex flex-col items-center gap-2"
                    >
                      <Target size={20} />
                      Attack
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={!isAttacking}
                      className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-2xl font-black uppercase text-xs flex flex-col items-center gap-2 shadow-lg shadow-orange-600/30"
                    >
                      <MousePointer2 size={20} />
                      Move/Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Inferno Meta Switch</h3>
                 <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-xl">
                   <button onClick={() => setIsInferno(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!isInferno ? 'bg-orange-600' : 'text-gray-500'}`}>Normal</button>
                   <button onClick={() => setIsInferno(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isInferno ? 'bg-red-600' : 'text-gray-500'}`}>Inferno</button>
                 </div>
               </div>
               <Card className={isInferno ? 'border-red-600 bg-red-950/5' : 'border-orange-600'}>
                 <div className="flex items-start gap-4">
                   <div className={`p-3 rounded-2xl ${isInferno ? 'bg-red-600' : 'bg-orange-600'}`}>
                     <Ghost size={24} />
                   </div>
                   <div className="space-y-1">
                     <h4 className="font-black text-white uppercase">{isInferno ? 'Resistance Capped!' : 'Dmg Resistance is King'}</h4>
                     <p className="text-xs text-gray-400 leading-relaxed">
                       {isInferno 
                         ? 'In H90+, Projectile Resistance is capped. Switch to Raw HP and Collision Resistance. Bull Rings and Magmar are mandatory.' 
                         : 'Normal progression relies heavily on Dragon/Bull Rings. Proj Resistance allows pushing higher chapters with low stats.'}
                     </p>
                   </div>
                 </div>
               </Card>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-340px)] animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 no-scrollbar">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="w-20 h-20 bg-gray-800 rounded-[2rem] flex items-center justify-center rotate-6 border border-gray-700">
                    <MessageSquare size={40} className="text-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Wiki Logic Strategist</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Precise Meta Calculations</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Gold farming build?', 'Zeus vs Wukong?', 'Inferno meta help?'].map(q => (
                      <button key={q} onClick={() => setChatInput(q)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-[10px] font-black uppercase hover:border-orange-500 transition-all">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-medium leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-800 border border-gray-700 rounded-tl-none text-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-800 border border-gray-700 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-orange-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Consulting JP Wiki...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-3 bg-gray-950 p-2 rounded-[2.5rem] border border-gray-800">
              <input 
                type="text" 
                placeholder="Ask meta advice..." 
                className="flex-1 bg-transparent px-6 py-4 text-sm font-bold focus:outline-none"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button 
                onClick={handleSendChat}
                disabled={isChatLoading}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-4 rounded-full transition-all shadow-lg shadow-orange-600/30"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gray-950/90 backdrop-blur-2xl border-t border-gray-800 p-4 flex justify-around items-center z-[110] rounded-t-[3rem] shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
        {[
          { id: 'meta', icon: Crown, label: 'Meta' },
          { id: 'builds', icon: BrainCircuit, label: 'Builds' },
          { id: 'calc', icon: Calculator, label: 'Calc' },
          { id: 'ai', icon: MessageSquare, label: 'Strategy' },
          { id: 'lab', icon: Zap, label: 'Lab' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as Tab); setSearchQuery(''); setTierFilter('All'); }}
            className={`flex flex-col items-center gap-1.5 px-3 py-1 transition-all group ${activeTab === tab.id ? 'text-orange-500' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-orange-600/10' : 'group-hover:bg-gray-800'}`}>
              <tab.icon size={22} className={activeTab === tab.id ? 'animate-pulse' : ''} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tight">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
