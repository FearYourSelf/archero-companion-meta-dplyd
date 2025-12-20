
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, Image as ImageIcon, 
  Sparkles, Send, ChevronRight, BrainCircuit, ExternalLink, Loader2,
  X, Layers, Info, Trash2, Heart, DollarSign, Plus, Check, Calculator, RefreshCw,
  Trophy, Target, MousePointer2
} from 'lucide-react';
import { HERO_DATA, GEAR_DATA, ABILITIES_DATA, MECHANICS } from './constants';
import { Badge, ProgressBar, Card } from './components/UI';
import { analyzeScreenshot, chatWithAI, findLocalAnswer } from './services/geminiService';
import { ChatMessage, Tier, BaseItem, Hero, GearCategory, CalcStats } from './types';

type Tab = 'heroes' | 'gear' | 'builds' | 'calc' | 'ai' | 'guide';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('heroes');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'All' | 'Favs'>('All');
  
  // State Persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('archero_favs');
    return saved ? JSON.parse(saved) : [];
  });
  const [userCoins, setUserCoins] = useState<number>(() => {
    const saved = localStorage.getItem('archero_coins');
    return saved ? parseInt(saved) : 1000;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('archero_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [calcStats, setCalcStats] = useState<CalcStats>(() => {
    const saved = localStorage.getItem('archero_calc_stats');
    return saved ? JSON.parse(saved) : { baseAtk: 10000, critChance: 30, critDmg: 200, atkSpeed: 50 };
  });

  // Comparison State (Max 4)
  const [compareItems, setCompareItems] = useState<BaseItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Build Tab Selection
  const [buildHero, setBuildHero] = useState(HERO_DATA[0].id);
  const [buildWeapon, setBuildWeapon] = useState(GEAR_DATA.filter(g => g.category === 'Weapon')[0].id);
  const [buildArmor, setBuildArmor] = useState(GEAR_DATA.filter(g => g.category === 'Armor')[0].id);

  // Training Lab State
  const [isInferno, setIsInferno] = useState(false);
  const [trainerProgress, setTrainerProgress] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [trainerFeedback, setTrainerFeedback] = useState<{ text: string, type: 'perfect' | 'miss' | 'none' }>({ text: 'Click Attack to Start', type: 'none' });
  const trainerInterval = useRef<number | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('archero_favs', JSON.stringify(favorites));
    localStorage.setItem('archero_coins', userCoins.toString());
    localStorage.setItem('archero_chat_history', JSON.stringify(chatMessages));
    localStorage.setItem('archero_calc_stats', JSON.stringify(calcStats));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [favorites, userCoins, chatMessages, calcStats]);

  // Mini-Game Logic
  const startTrainerAttack = () => {
    if (isAttacking) return;
    setIsAttacking(true);
    setTrainerProgress(0);
    setTrainerFeedback({ text: 'Aiming...', type: 'none' });

    trainerInterval.current = window.setInterval(() => {
      setTrainerProgress(prev => {
        if (prev >= 100) {
          clearInterval(trainerInterval.current!);
          setIsAttacking(false);
          setTrainerFeedback({ text: 'TOO SLOW (Animation Locked)', type: 'miss' });
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  const handleCancelClick = () => {
    if (!isAttacking) return;
    clearInterval(trainerInterval.current!);
    setIsAttacking(false);

    if (trainerProgress >= 25 && trainerProgress <= 45) {
      setTrainerFeedback({ text: 'PERFECT! (Attack Speed +40%)', type: 'perfect' });
    } else if (trainerProgress < 25) {
      setTrainerFeedback({ text: 'TOO EARLY (Canceled Shot)', type: 'miss' });
    } else {
      setTrainerFeedback({ text: 'TOO LATE (Animation Locked)', type: 'miss' });
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleCompare = (item: BaseItem) => {
    setCompareItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev.filter(i => i.id !== item.id);
      if (prev.length >= 4) return prev;
      return [...prev, item];
    });
  };

  const dpsResult = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    const result = baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + atkSpeed / 100);
    return Math.round(result);
  }, [calcStats]);

  const calculateSynergy = () => {
    const weapon = GEAR_DATA.find(w => w.id === buildWeapon);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    
    if (buildHero === 'zeus' && buildWeapon === 'hammer') return "GOD SYNERGY: Thunder God's Wrath Active! (Chain Lightning +50% Dmg)";
    if (buildWeapon === 'staff') return "WARNING: Bad Synergy. Staff needs Diagonal Arrows to reach SSS Tier. Avoid Front Arrow at all costs.";
    if (buildHero === 'wukong' && buildArmor === 'golden_chest') return "TANK BUILD: Clones + 30% Damage Resistance active.";
    if (buildHero === 'helix' && buildWeapon === 'blade') return "F2P MELEE: Classic Rage + Melee Life Steal build.";
    return `Balanced Build: ${hero?.name} with ${weapon?.name}. Note: Stutter-stepping is essential for maximizing DPS.`;
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: msg, timestamp: Date.now() }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const res = await chatWithAI(chatMessages, msg);
      setChatMessages(prev => [...prev, { role: 'model', text: res.text, timestamp: Date.now() }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Expert system offline. Consult the JP Wiki manually.", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const filterItems = <T extends BaseItem>(items: T[]) => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = tierFilter === 'All' || item.tier === tierFilter;
      const matchFav = tierFilter === 'Favs' ? favorites.includes(item.id) : true;
      return matchSearch && (tierFilter === 'Favs' ? matchFav : matchTier);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto shadow-2xl relative border-x border-gray-800">
      
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md p-5 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center transform -rotate-2 shadow-lg shadow-orange-600/30">
              <Sword className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white italic">ARCHERO COMPANION</h1>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-800 px-2 rounded">v2025 Meta</span>
                <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                  <DollarSign size={12} /> {userCoins.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsCompareOpen(true)}
              className={`p-2.5 rounded-xl transition-all relative ${compareItems.length > 0 ? 'bg-orange-600 shadow-orange-600/20 shadow-lg' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}
            >
              <Layers size={20} />
              {compareItems.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold border border-orange-600">{compareItems.length}</span>}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder={`Search in ${activeTab}...`} 
              className="w-full bg-gray-800/80 border border-gray-700/50 rounded-2xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['All', 'Favs', 'SSS', 'SS', 'S', 'A'].map(f => (
              <button 
                key={f} 
                onClick={() => setTierFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap border ${tierFilter === f ? 'bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-600/20' : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Comparison Deck Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h3 className="font-black text-xl flex items-center gap-3 uppercase tracking-tighter italic"><Layers className="text-orange-500" /> Comparison Deck</h3>
              <button onClick={() => setIsCompareOpen(false)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-x-auto">
              {compareItems.length === 0 ? (
                <div className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest">No items selected (Max 4)</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 min-w-[500px]">
                  {compareItems.map(item => (
                    <div key={item.id} className="bg-gray-800/50 p-4 rounded-3xl border border-gray-700 space-y-4">
                      <div className="flex justify-between items-start">
                        <Badge tier={item.tier} />
                        <button onClick={() => handleCompare(item)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                      <div className="h-12 flex items-center"><h4 className="font-black text-xs text-white uppercase leading-tight">{item.name}</h4></div>
                      <div className="text-[10px] font-bold text-orange-500 uppercase">{item.category}</div>
                      <div className="text-[10px] text-gray-400 leading-relaxed overflow-y-auto h-32 no-scrollbar">{item.details || item.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {compareItems.length > 0 && (
              <div className="p-6 bg-gray-800/20 border-t border-gray-800 flex justify-center">
                 <button onClick={() => setCompareItems([])} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                   <Trash2 size={12} /> Clear Deck
                 </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <main className="flex-1 p-5 overflow-y-auto pb-32">
        
        {activeTab === 'heroes' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-orange-500 flex items-center gap-2 uppercase tracking-tighter italic">Hero Meta</h2>
            {filterItems(HERO_DATA).map(hero => (
              <Card key={hero.id} className="relative overflow-hidden group">
                {hero.isGodTier && <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent -rotate-45 transform translate-x-10 -translate-y-10" />}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFavorite(hero.id)} className="transition-transform active:scale-125">
                      <Heart size={20} className={favorites.includes(hero.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-gray-400'} />
                    </button>
                    <h3 className="font-black text-xl text-white uppercase italic group-hover:text-orange-500 transition-all">{hero.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCompare(hero)} 
                      className={`p-1.5 rounded-lg border border-gray-700 transition-all ${compareItems.find(i => i.id === hero.id) ? 'bg-orange-600 text-white border-orange-400 shadow-lg shadow-orange-600/20' : 'text-gray-500 hover:text-white'}`}
                    >
                      <Plus size={16} />
                    </button>
                    <Badge tier={hero.tier} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4 font-medium leading-relaxed">{hero.details || hero.desc}</p>
                {hero.bestSkin && <div className="text-[10px] font-black text-orange-500 bg-orange-500/5 p-2 rounded-xl border border-orange-500/20 mb-4 inline-block uppercase">BEST SKIN: {hero.bestSkin}</div>}
                <div className="space-y-3">
                  <div className="flex items-center text-[10px] font-black text-gray-600 uppercase">
                    <span className="w-12">Atk</span>
                    <ProgressBar value={hero.stats.atk} max={10} color="orange" />
                  </div>
                  <div className="flex items-center text-[10px] font-black text-gray-600 uppercase">
                    <span className="w-12">Surv</span>
                    <ProgressBar value={hero.stats.hp} max={10} color="blue" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'gear' && (
          <div className="space-y-10">
            {['Weapon', 'Ring', 'Locket', 'Dragon', 'Pet', 'Armor', 'Relic'].map(cat => (
              <div key={cat} className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-3">
                  <span className="h-0.5 w-8 bg-orange-600" /> {cat}s
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {filterItems(GEAR_DATA.filter(g => g.category === cat)).map(item => (
                    <Card key={item.id} className="hover:border-orange-500/50 transition-all relative group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleFavorite(item.id)} className="transition-transform active:scale-125">
                            <Heart size={16} className={favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-gray-400'} />
                          </button>
                          <h4 className="font-black text-white text-sm uppercase group-hover:text-orange-500 transition-colors">{item.name}</h4>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCompare(item)} 
                            className={`p-1 rounded-md border border-gray-700 transition-all ${compareItems.find(i => i.id === item.id) ? 'bg-orange-600 text-white border-orange-400' : 'text-gray-600 hover:text-white'}`}
                          >
                            <Plus size={12} />
                          </button>
                          <Badge tier={item.tier} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{item.desc}</p>
                      <p className="text-[10px] text-gray-600 mb-2 italic">{item.details}</p>
                      {item.synergy && (
                        <div className="text-[10px] font-black text-blue-400 bg-blue-500/5 p-2 rounded-xl border border-blue-500/20 mb-2">
                           {item.synergy}
                        </div>
                      )}
                      {item.id === 'fist' && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/50">
                          <button 
                            onClick={() => setUserCoins(c => c - 500)}
                            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 shadow-lg shadow-green-600/20 transition-all active:scale-95"
                          >
                            <DollarSign size={10} /> Buy Sim (500)
                          </button>
                          <button 
                            onClick={() => setUserCoins(c => c + 350)}
                            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 shadow-lg shadow-red-600/20 transition-all active:scale-95"
                          >
                            <DollarSign size={10} /> Sell Sim (350)
                          </button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'builds' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center p-6 space-y-2">
              <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-2">
                <BrainCircuit size={28} /> BUILD ANALYZER
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Synergy Engine v4.0</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <User size={12} /> Active Hero
                </label>
                <select 
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-orange-500"
                  value={buildHero}
                  onChange={(e) => setBuildHero(e.target.value)}
                >
                  {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name.toUpperCase()} ({h.tier})</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Sword size={12} /> Primary Weapon
                </label>
                <select 
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-orange-500"
                  value={buildWeapon}
                  onChange={(e) => setBuildWeapon(e.target.value)}
                >
                  {GEAR_DATA.filter(g => g.category === 'Weapon').map(w => <option key={w.id} value={w.id}>{w.name.toUpperCase()} ({w.tier})</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Shield size={12} /> Defense Armor
                </label>
                <select 
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-orange-500"
                  value={buildArmor}
                  onChange={(e) => setBuildArmor(e.target.value)}
                >
                  {GEAR_DATA.filter(g => g.category === 'Armor').map(a => <option key={a.id} value={a.id}>{a.name.toUpperCase()} ({a.tier})</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-[3rem] shadow-2xl shadow-orange-600/40 relative overflow-hidden group border border-orange-400/30">
              <Sparkles className="absolute top-4 right-4 text-orange-200 animate-pulse" />
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase text-orange-100 tracking-[0.2em] mb-4 flex items-center gap-2">
                  <BrainCircuit size={14} /> Synergy Intelligence
                </h4>
                <p className="text-lg font-black text-white italic leading-tight group-hover:scale-[1.01] transition-transform">
                  {calculateSynergy()}
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-2 flex-1 bg-orange-950/40 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[95%] animate-pulse shadow-[0_0_15px_white]" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase italic">95% Synergy</span>
                </div>
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
              <p className="text-xs text-gray-500 font-bold uppercase">Wiki Formula Engine</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-3 text-sm font-bold focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 p-10 bg-gray-950 border border-gray-800 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-yellow-500" />
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Estimated Raw DPS</h4>
              <div className="text-6xl font-black text-white tracking-tighter mb-2 italic">
                {dpsResult.toLocaleString()}
              </div>
              <p className="text-[10px] text-orange-500 font-black uppercase mb-4 tracking-widest">Based on JP Wiki Formula</p>
              <div className="text-[9px] text-gray-600 bg-gray-900 p-2 rounded-lg border border-gray-800">
                Note: This calculates Base DPS. Actual damage varies by Enemy Type, Elemental Resists, and Boss modifiers.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-6">
              <h3 className="text-2xl font-black italic text-orange-500 uppercase text-center">Training Lab</h3>
              
              <Card className="p-8 bg-gray-800/50 border-orange-500/20 shadow-orange-500/5 shadow-2xl">
                <div className="flex flex-col items-center justify-center space-y-8">
                  <div className="text-center">
                    <h4 className="font-black text-xl text-white mb-1 uppercase italic tracking-tighter">Stutter Step Trainer</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Master the Rhythm</p>
                  </div>
                  
                  <div className="w-full space-y-6">
                    <div className="relative h-4 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                      <div 
                        className="absolute h-full bg-orange-600 transition-all duration-75"
                        style={{ width: `${trainerProgress}%` }}
                      />
                      {/* Perfect Window Indicator */}
                      <div className="absolute top-0 left-[25%] right-[55%] h-full bg-green-500/20 border-x border-green-500/40" />
                    </div>

                    <div className={`p-4 rounded-2xl text-center font-black uppercase tracking-tighter text-sm transition-all duration-300 ${
                      trainerFeedback.type === 'perfect' ? 'bg-green-600/10 text-green-500 scale-105' : 
                      trainerFeedback.type === 'miss' ? 'bg-red-600/10 text-red-500' : 
                      'bg-gray-800 text-gray-500'
                    }`}>
                      {trainerFeedback.text}
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={startTrainerAttack}
                        disabled={isAttacking}
                        className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-2xl font-black uppercase tracking-widest text-xs flex flex-col items-center gap-2 border border-gray-700 transition-all active:scale-95"
                      >
                        <Zap className={isAttacking ? 'text-orange-500' : ''} size={20} />
                        Attack
                      </button>
                      <button 
                        onClick={handleCancelClick}
                        disabled={!isAttacking}
                        className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-2xl font-black uppercase tracking-widest text-xs flex flex-col items-center gap-2 shadow-lg shadow-orange-600/30 transition-all active:scale-95"
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
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Endgame Guide</h3>
                  <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-xl border border-gray-700">
                    <button 
                      onClick={() => setIsInferno(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!isInferno ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500'}`}
                    >
                      Normal
                    </button>
                    <button 
                      onClick={() => setIsInferno(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isInferno ? 'bg-red-600 text-white shadow-md' : 'text-gray-500'}`}
                    >
                      Inferno
                    </button>
                  </div>
                </div>

                <Card className={`border-l-4 transition-all duration-500 ${isInferno ? 'border-l-red-600 bg-red-950/5' : 'border-l-orange-600 bg-orange-950/5'}`}>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white font-black uppercase italic tracking-tighter">
                         <Info size={18} className={isInferno ? 'text-red-500' : 'text-orange-500'} />
                         {isInferno ? 'Inferno Mode Meta (H90+)' : 'Normal Progression Meta'}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {isInferno 
                          ? 'In H90+, Projectile Resistance (PR) is capped and less effective. Switch your build focus to Raw HP, Attack, and Collision Resistance. Magmar dragon is mandatory for skill spamming.' 
                          : 'For normal chapters, Projectile Resistance is King. Focus on Dragon/Bull Rings and Angel Locket for bosses. Stutter-stepping is your primary tool for progression.'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                         {(isInferno ? ['Raw HP', 'Collision Resist', 'Magmar'] : ['Proj Resist', 'Bull Rings', 'Angel Locket']).map(tag => (
                           <span key={tag} className="text-[9px] font-black uppercase bg-gray-950 px-2 py-1 rounded border border-gray-800 text-gray-500 tracking-widest">{tag}</span>
                         ))}
                      </div>
                   </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-340px)] animate-in slide-in-from-bottom-6 duration-400">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-orange-500 font-black italic uppercase tracking-tighter text-sm">
                <Sparkles size={18} /> Wiki Strategist
              </div>
              <button 
                onClick={() => { if(confirm('Clear history?')) { setChatMessages([]); localStorage.removeItem('archero_chat_history'); } }}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8 opacity-60">
                  <div className="w-24 h-24 bg-gray-800 rounded-[2.5rem] flex items-center justify-center rotate-6 border-2 border-gray-700 shadow-2xl">
                    <MessageSquare size={48} className="text-orange-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Archero Expert AI</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Japanese Wiki Logic Engine</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Gold farm logic?', 'Zeus or Wukong?', 'Staff synergy?'].map(q => (
                      <button key={q} onClick={() => setChatInput(q)} className="px-5 py-2.5 bg-gray-800 rounded-2xl border border-gray-700 text-[10px] font-black uppercase hover:border-orange-500 hover:bg-gray-700 transition-all shadow-lg active:scale-90">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-medium leading-relaxed shadow-xl border ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none border-orange-500 shadow-orange-600/10' : 'bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-tl-none text-gray-200 shadow-black/20'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/90 p-5 rounded-[2rem] rounded-tl-none border border-gray-700 flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-orange-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Wiki Logic Calculating...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="mt-4 flex gap-3 bg-gray-950 p-2 rounded-[2.5rem] border border-gray-800 shadow-3xl">
              <input 
                type="text" 
                placeholder="Ask for build advice..." 
                className="flex-1 bg-transparent px-6 py-4 text-sm font-bold focus:outline-none"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button 
                onClick={handleSendChat}
                disabled={isChatLoading}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-4 rounded-full transition-all shadow-lg shadow-orange-600/30 active:scale-90"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gray-950/95 backdrop-blur-2xl border-t border-gray-800/50 p-4 flex justify-around items-center z-[110] rounded-t-[3rem] shadow-[0_-15px_40px_rgba(0,0,0,0.9)]">
        {[
          { id: 'heroes', icon: User, label: 'Hero' },
          { id: 'gear', icon: Sword, label: 'Gear' },
          { id: 'builds', icon: BrainCircuit, label: 'AI' },
          { id: 'calc', icon: Calculator, label: 'Calc' },
          { id: 'ai', icon: MessageSquare, label: 'Strategy' },
          { id: 'guide', icon: Zap, label: 'Lab' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as Tab); setSearchQuery(''); setTierFilter('All'); }}
            className={`flex flex-col items-center gap-1.5 px-3 py-1 transition-all group ${activeTab === tab.id ? 'text-orange-500' : 'text-gray-500 hover:text-gray-400'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-orange-600/10' : 'group-hover:bg-gray-800/40'}`}>
              <tab.icon size={22} className={activeTab === tab.id ? 'animate-pulse' : ''} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
