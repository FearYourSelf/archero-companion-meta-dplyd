
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Sparkles, Send, BrainCircuit, Loader2,
  X, Layers, Trash2, Heart, Calculator, 
  Crown, MousePointer2, Ghost, Target, PawPrint as Dog, Book, Egg, Landmark as Tower, Flame,
  Circle, ExternalLink, LayoutDashboard, Trophy, Star, AlertTriangle, TrendingUp,
  Info, Settings2, Copy, Check, ChevronRight, Info as InfoIcon, ScrollText, 
  Gem, LayoutGrid, Award, Coins
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, MONSTER_FARM_EGGS, ARCHERO_KNOWLEDGE_BASE, 
  SHARD_EVO_COSTS, FARMING_ROUTES, TRIVIA_ARCHIVE 
} from './constants';
import { chatWithAI } from './services/geminiService';
import { BaseItem, Hero, Tier, GearCategory, ChatMessage, CalcStats, TrainingStats } from './types';

const Badge: React.FC<{ tier: Tier }> = ({ tier }) => {
  const colors: Record<Tier, string> = {
    'SSS': 'bg-red-600 text-yellow-100 border-yellow-400 border shadow-[0_0_12px_rgba(220,38,38,0.6)] font-black',
    'SS': 'bg-red-500 text-white border-red-300/30 border font-bold',
    'S': 'bg-orange-500 text-white shadow-md shadow-orange-900/20 font-bold',
    'A': 'bg-purple-600 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-blue-400 text-white',
    'D': 'bg-gray-600 text-gray-200',
    'F': 'bg-gray-800 text-gray-500',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] tracking-widest uppercase shadow-sm ${colors[tier] || 'bg-gray-500'}`}>
      {tier}
    </span>
  );
};

const Card: React.FC<{ children: React.ReactNode; tier?: Tier; className?: string; mythic?: string }> = ({ children, tier, className = '', mythic }) => {
  const isGod = tier === 'SSS';
  return (
    <div className={`
      bg-gray-800/50 backdrop-blur-md border rounded-[2rem] p-5 shadow-2xl transition-all duration-300 overflow-hidden relative group
      ${isGod ? 'border-yellow-500/30 ring-1 ring-yellow-500/10' : 'border-gray-700/50 hover:border-gray-600'}
      ${className}
    `}>
      {isGod && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-500/10 blur-[50px] pointer-events-none rounded-full" />
      )}
      {mythic && (
        <div className="absolute top-0 right-0 bg-red-600/90 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg border-l border-b border-red-400/30">
          MYTHIC: {mythic}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'analyze' | 'dps' | 'lab' | 'data' | 'ai'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('Hero');
  const [isGodTierOnly, setIsGodTierOnly] = useState(false);
  const [cardViews, setCardViews] = useState<Record<string, 'stats' | 'lore'>>({});
  const [copyStatus, setCopyStatus] = useState(false);
  
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('archero_favs') || '[]'));
  const [calcStats, setCalcStats] = useState<CalcStats>(() => JSON.parse(localStorage.getItem('archero_stats') || '{"baseAtk":50000,"critChance":40,"critDmg":350,"atkSpeed":50,"weaponType":"Demon Blade"}'));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('archero_chat') || '[]'));
  const [trainingStats, setTrainingStats] = useState<TrainingStats>(() => JSON.parse(localStorage.getItem('archero_lab') || '{"bestStreak":0}'));

  const [buildHero, setBuildHero] = useState<string>('zeus');
  const [buildWeapon, setBuildWeapon] = useState<string>('fist');
  const [buildArmor, setBuildArmor] = useState<string>('c_warplate');
  const [isInfernoMode, setIsInfernoMode] = useState(false);

  // Lab State
  const [labStreak, setLabStreak] = useState(0);
  const [labProgress, setLabProgress] = useState(0);
  const [isLabActive, setIsLabActive] = useState(false);
  const [labFeedback, setLabFeedback] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const labIntervalRef = useRef<number>();

  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('archero_favs', JSON.stringify(favorites));
    localStorage.setItem('archero_stats', JSON.stringify(calcStats));
    localStorage.setItem('archero_chat', JSON.stringify(chatHistory));
    localStorage.setItem('archero_lab', JSON.stringify(trainingStats));
    if (activeTab === 'ai') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [favorites, calcStats, chatHistory, trainingStats, activeTab]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleCardView = (id: string) => {
    setCardViews(prev => ({
      ...prev,
      [id]: prev[id] === 'lore' ? 'stats' : 'lore'
    }));
  };

  const copyBuild = () => {
    const hero = HERO_DATA.find(h => h.id === buildHero)?.name;
    const weapon = GEAR_DATA.find(g => g.id === buildWeapon)?.name;
    const armor = GEAR_DATA.find(g => g.id === buildArmor)?.name;
    const text = `Archero Pro Build: [Hero: ${hero}] [Weapon: ${weapon}] [Armor: ${armor}] ${isInfernoMode ? '(Inferno Mode Active)' : ''}`;
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const filteredData = useMemo(() => {
    const combined = [...HERO_DATA, ...GEAR_DATA];
    return combined.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
      const matchTier = isGodTierOnly ? item.tier === 'SSS' : (tierFilter === 'All' || item.tier === tierFilter);
      return matchSearch && matchCat && matchTier;
    });
  }, [searchQuery, categoryFilter, tierFilter, isGodTierOnly]);

  const analysisResult = useMemo(() => {
    let result = [];
    if (buildHero === 'zeus') result.push("ZEUS META: You MUST equip the **Celestial Set**. Wiki notes: Lightning chains ignore 15% DR.");
    if (buildHero === 'helix') result.push("HELIX STRAT: **Demon Blade** or **Fist**. Pair with **Meowgik Assist**. Rage multiplier is king.");
    
    if (buildWeapon === 'db') {
      result.push("⚔️ DEMON BLADE PRO TIP: Pick 'Diagonal Arrows' and 'Side Arrows' but **AVOID** 'Front Arrow' synergy as it reduces your melee burst by 25%.");
    }

    if (isInfernoMode) {
      result.push("⚠️ INFERNO WARNING: PR is capped at 75% in H90+. Projectile Resistance is less effective here.");
      if (buildWeapon === 'dragon_ring') {
         result.push("⚡ INFERNO META: Dragon Ring PR is capped. Recommend switching to **Celestial Bracer** for Collision Resistance coverage.");
      }
    }
    
    return result.length ? result : ["Select options to analyze synergy."];
  }, [buildHero, buildWeapon, isInfernoMode]);

  const recommendedAssist = useMemo(() => {
    if (buildHero === 'helix') return "Meowgik (Offense) / Gugu (Defense)";
    if (buildHero === 'zeus') return "Melinda (Burst) / Stella (Stats)";
    if (buildHero === 'melinda') return "Zeus (Base Stats) / Iris (Speed)";
    return "Balanced Mix";
  }, [buildHero]);

  const calculatedDPS = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed, weaponType } = calcStats;
    const multipliers: any = { 'Demon Blade': 1.8, 'Expedition Fist': 1.7, 'Scythe': 1.45, 'Bow': 1.0 };
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
        setLabProgress(p => {
          if (p >= 100) {
            handleLabResult(false);
            return 0;
          }
          return p + 4.5; // Approx 0.8s for 100%
        });
      }, 30);
    } else {
      const isHit = labProgress >= 25 && labProgress <= 35;
      handleLabResult(isHit);
    }
  };

  const handleLabResult = (success: boolean) => {
    clearInterval(labIntervalRef.current);
    setIsLabActive(false);
    if (success) {
      const nextStreak = labStreak + 1;
      setLabStreak(nextStreak);
      setLabFeedback("PERFECT!");
      if (nextStreak > trainingStats.bestStreak) {
        setTrainingStats({ bestStreak: nextStreak });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      setLabStreak(0);
      setLabFeedback("TOO SLOW");
    }
    setTimeout(() => setLabFeedback(null), 1000);
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const msg = aiInput;
    setAiInput('');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, timestamp: Date.now() }]);
    setIsAiLoading(true);
    try {
      const history = chatHistory.map(h => ({ role: h.role, text: h.text }));
      const response = await chatWithAI(msg, history);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'Data Uplink Error', timestamp: Date.now() }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Archives Offline.', timestamp: Date.now() }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const CATEGORY_ICONS: Record<string, any> = {
    'All': LayoutGrid,
    'Hero': User,
    'Weapon': Sword,
    'Armor': Shield,
    'Ring': Circle,
    'Dragon': Flame,
    'Book': Book,
    'Egg': Egg,
    'Totem': Tower,
    'Locket': Award,
    'Bracelet': Zap,
    'Spirit': Ghost,
    'Pet': Dog
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto border-x border-gray-800 pb-24 shadow-2xl relative">
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-[100] p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center -rotate-6 shadow-lg shadow-orange-900/40">
              <Sword className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">ZA ARMORY <span className="text-orange-500">ARCHERO PRO</span></h1>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">LORE & STATS v3.0</span>
            </div>
          </div>
          <button 
            onClick={() => setIsGodTierOnly(!isGodTierOnly)}
            className={`p-2.5 rounded-xl transition-all duration-300 relative ${isGodTierOnly ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <Crown size={24} className={isGodTierOnly ? 'fill-yellow-500' : ''} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search lore, farming, or gear..." 
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === 'meta' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sticky top-0">
             {['All', 'Hero', 'Weapon', 'Armor', 'Ring', 'Dragon', 'Book', 'Egg', 'Totem', 'Locket', 'Bracelet', 'Spirit', 'Pet'].map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button 
                  key={cat} 
                  onClick={() => setCategoryFilter(cat as any)} 
                  className={`px-4 py-3 rounded-xl border transition-all flex flex-col items-center gap-1 flex-shrink-0 min-w-[60px] ${categoryFilter === cat ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/40' : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}
                >
                  <Icon size={18} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">{cat}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-1 p-5 overflow-y-auto no-scrollbar scroll-smooth">
        {activeTab === 'meta' && (
          <div className="grid grid-cols-1 gap-5">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
               {['All', 'SSS', 'SS', 'S', 'A'].map(f => (
                <button key={f} onClick={() => setTierFilter(f as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all flex-shrink-0 ${tierFilter === f ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>{f}</button>
              ))}
            </div>
            {filteredData.map(item => {
              const view = cardViews[item.id] || 'stats';
              return (
                <Card key={item.id} tier={item.tier} mythic={item.mythicPerk} className="hover:scale-[1.01] transform transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Heart size={20} onClick={() => toggleFavorite(item.id)} className={`cursor-pointer transition-transform active:scale-150 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                      <h3 className="font-black text-base text-white uppercase italic tracking-tight">{item.name}</h3>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toggleCardView(item.id)} className="p-1.5 bg-gray-900 rounded-lg text-gray-500 hover:text-orange-500 transition-colors">
                        {view === 'stats' ? <ScrollText size={14} /> : <Zap size={14} />}
                      </button>
                      <Badge tier={item.tier} />
                    </div>
                  </div>

                  {view === 'stats' ? (
                    <>
                      <p className="text-xs text-gray-400 italic mb-3 leading-relaxed">{item.desc}</p>
                      {item.category === 'Hero' && (
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase"><Zap size={12} /> Global: {(item as Hero).globalBonus120}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      {item.category === 'Hero' && (item as Hero).bio && (
                        <div className="text-[10px] text-gray-300 leading-relaxed italic border-l-2 border-orange-600/50 pl-3">
                          "{(item as Hero).bio}"
                        </div>
                      )}
                      {item.trivia && (
                        <div className="bg-blue-950/20 border border-blue-500/20 p-3 rounded-xl">
                          <p className="text-[9px] text-blue-400 font-black uppercase mb-1 flex items-center gap-1"><InfoIcon size={10} /> Wiki Trivia</p>
                          <p className="text-[10px] text-gray-400 italic font-medium">{item.trivia}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-3 uppercase tracking-tighter"><TrendingUp size={32} /> Tactical Analyzer</h2>
            <div className="bg-gray-800/40 p-8 rounded-[3rem] border border-gray-700 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Select Hero</label>
                  <select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-xs font-black text-white outline-none">
                    {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Weapon</label>
                    <select value={buildWeapon} onChange={e => setBuildWeapon(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-xs font-black text-white outline-none">
                      {GEAR_DATA.filter(g => g.category === 'Weapon' || g.category === 'Ring').map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Armor</label>
                    <select value={buildArmor} onChange={e => setBuildArmor(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-xs font-black text-white outline-none">
                      {GEAR_DATA.filter(g => g.category === 'Armor').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Flame className={isInfernoMode ? "text-orange-500" : "text-gray-600"} size={18} />
                    <span className="text-xs font-black uppercase text-gray-300 italic">Inferno Mode (H90+)</span>
                  </div>
                  <button 
                    onClick={() => setIsInfernoMode(!isInfernoMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isInfernoMode ? 'bg-orange-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isInfernoMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Synergy Breakdown</p>
                {analysisResult.map((res, i) => (
                  <div key={i} className="bg-orange-950/20 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
                    <AlertTriangle size={14} className="text-orange-500 mt-0.5" />
                    <p className="text-[11px] text-gray-200 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                ))}
                
                <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
                  <User size={14} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase italic">Recommended Assist</p>
                    <p className="text-[11px] text-gray-200 font-medium">{recommendedAssist}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={copyBuild}
                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-2 transition-all ${copyStatus ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-500'}`}
              >
                {copyStatus ? <><Check size={16} /> BUILD COPIED</> : <><Copy size={16} /> COPY BUILD CONFIG</>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'data' && ( activeTab === 'data' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-3 uppercase tracking-tighter"><LayoutDashboard size={32} /> Resources</h2>
            
            <div className="space-y-6">
              {/* LV 120 GLOBAL MASTERY TABLE */}
              <div className="bg-gray-800/40 border-2 border-gray-700 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="bg-gray-900/80 p-6 border-b-2 border-gray-700 font-black text-xs uppercase tracking-[0.2em] text-orange-500 flex items-center gap-3"><Award size={18} /> Lv120 Global Masteries</div>
                <div className="p-6 overflow-x-auto">
                   <table className="w-full text-[10px] font-bold">
                    <thead><tr className="text-gray-500 text-left border-b border-gray-800"><th className="pb-2">Hero</th><th className="pb-2">Stat Bonus</th><th className="pb-2">Priority</th></tr></thead>
                    <tbody>
                      {HERO_DATA.filter(h => h.globalBonus120).map(h => (
                        <tr key={h.id} className="border-b border-gray-800/30">
                          <td className="py-3 text-white">{h.name}</td>
                          <td className="py-3 text-orange-400 font-black">{h.globalBonus120}</td>
                          <td className="py-3">
                            {h.id === 'taranis' || h.id === 'atreus' ? (
                              <span className="text-red-500 font-black italic">MANDATORY</span>
                            ) : (
                              <span className="text-gray-500">Normal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ESTATE ROI TABLE */}
              <div className="bg-gray-800/40 border-2 border-gray-700 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="bg-gray-900/80 p-6 border-b-2 border-gray-700 font-black text-xs uppercase tracking-[0.2em] text-blue-400 flex items-center gap-3"><Tower size={18} /> Estate ROI (Totems)</div>
                <div className="p-6">
                  <div className="space-y-4">
                    {GEAR_DATA.filter(g => g.category === 'Totem').map((t, idx) => (
                      <div key={t.id} className="flex items-center justify-between bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center font-black text-blue-400 text-xs">{idx + 1}</div>
                          <div>
                            <p className="text-[10px] font-black text-white uppercase">{t.name}</p>
                            <p className="text-[9px] text-gray-500 italic">{t.trivia || t.desc}</p>
                          </div>
                        </div>
                        <Badge tier={t.tier} />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[9px] text-gray-500 font-bold uppercase text-center tracking-widest italic">Note: Skin Stats Totem is #1 priority across all accounts.</p>
                </div>
              </div>

              <div className="bg-gray-800/40 border-2 border-gray-700 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="bg-gray-900/80 p-6 border-b-2 border-gray-700 font-black text-xs uppercase tracking-[0.2em] text-green-400 flex items-center gap-3"><Target size={18} /> Best Farming Chapters</div>
                <div className="p-4 space-y-3">
                  {FARMING_ROUTES.map(r => (
                    <div key={r.resource} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
                      <div><p className="text-[10px] font-black text-white uppercase">{r.resource}</p><p className="text-[9px] text-gray-500 italic">{r.note}</p></div>
                      <span className="text-green-400 font-black italic text-xs">{r.chapter}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'dps' && (
          <div className="space-y-8 animate-in zoom-in-95">
            <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-3 uppercase tracking-tighter"><Calculator size={32} /> Damage Engine</h2>
            <div className="grid grid-cols-1 gap-5 p-8 bg-gray-800/40 rounded-[3rem] border border-gray-700">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Base Multiplier</label>
                <select value={calcStats.weaponType} onChange={e => setCalcStats(p => ({...p, weaponType: e.target.value}))} className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-xs font-black text-white outline-none">
                  <option value="Demon Blade">Demon Blade (1.8x Melee)</option>
                  <option value="Expedition Fist">Expedition Fist (1.7x Burst)</option>
                  <option value="Scythe">Death Scythe (1.45x Heavy)</option>
                  <option value="Bow">Brave Bow (1.0x Base)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{ key: 'baseAtk', label: 'Raw Attack' }, { key: 'critChance', label: 'Crit %' }, { key: 'critDmg', label: 'Crit Dmg %' }, { key: 'atkSpeed', label: 'Speed %' }].map(f => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">{f.label}</label>
                    <input type="number" value={calcStats[f.key as keyof CalcStats] as number} onChange={e => setCalcStats(p => ({...p, [f.key]: parseFloat(e.target.value) || 0}))} className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-xs font-black focus:border-orange-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-12 bg-gray-950 border-t-4 border-orange-600 rounded-[3.5rem] text-center shadow-3xl group">
              <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Final Battle DPS</div>
              <div className="text-7xl font-black text-white italic tracking-tighter transition-transform duration-500 group-hover:scale-110">{calculatedDPS.toLocaleString()}</div>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-8 relative">
            {showConfetti && <div className="absolute inset-0 z-50 flex items-center justify-center animate-bounce"><h1 className="text-4xl font-black text-yellow-500 italic shadow-2xl">NEW RECORD!</h1></div>}
            <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-3 uppercase tracking-tighter"><Target size={32} /> Stutter Step Trainer</h2>
            <Card className="p-10 text-center bg-gray-800/40 border-orange-500/20 shadow-2xl rounded-[4rem]">
              <div className="relative h-12 bg-gray-950 rounded-full overflow-hidden mb-8 border-4 border-gray-800 shadow-inner">
                {isLabActive && (
                  <div 
                    className="absolute h-full bg-orange-600 transition-all duration-30" 
                    style={{ width: `${labProgress}%` }} 
                  />
                )}
                {/* Fixed Success Zone at 30% */}
                <div 
                  className="absolute top-0 h-full bg-green-500/40 border-x-4 border-green-500" 
                  style={{ left: `25%`, width: `10%` }} 
                />
              </div>

              {labFeedback && (
                <div className={`mb-6 text-2xl font-black italic animate-in slide-in-from-bottom-2 ${labFeedback === 'PERFECT!' ? 'text-green-500' : 'text-red-500'}`}>
                  {labFeedback}
                </div>
              )}

              <div className="flex justify-between items-center mb-8 px-6 bg-gray-900/50 p-4 rounded-3xl border border-gray-800">
                 <div><span className="text-[10px] font-black text-gray-600 uppercase">Current Streak</span><p className="text-4xl font-black italic">{labStreak}</p></div>
                 <div><span className="text-[10px] font-black text-gray-600 uppercase">Best</span><p className="text-xl font-black text-yellow-500">{trainingStats.bestStreak}</p></div>
              </div>
              <button 
                onMouseDown={handleLabAction} 
                className={`w-full py-10 rounded-[2.5rem] font-black uppercase text-xl transition-all shadow-2xl active:scale-95 border-b-8 ${isLabActive ? 'bg-orange-600 border-orange-800 text-white animate-pulse' : 'bg-gray-800 border-gray-950 text-white hover:bg-gray-700'}`}
              >
                {isLabActive ? 'CANCEL ATTACK!' : 'START ATTACK'}
              </button>
              <p className="text-[9px] text-gray-500 font-bold uppercase mt-6 tracking-widest italic">Target Zone: 30% Mark (Fast Speed: 0.8s)</p>
            </Card>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-280px)] animate-in slide-in-from-bottom-8">
            <div className="flex-1 overflow-y-auto space-y-5 mb-5 no-scrollbar p-2">
              {chatHistory.length === 0 && <div className="flex flex-col items-center justify-center h-full opacity-20"><BrainCircuit size={100} className="mb-6 text-orange-500 animate-pulse" /><p className="font-black italic uppercase text-white">Archives Connected</p></div>}
              {chatHistory.map((msg, i) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-5 rounded-[2.5rem] text-[11px] font-medium leading-relaxed shadow-2xl transition-all duration-300 ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-800 border-2 border-gray-700 rounded-tl-none text-gray-200'}`}>
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="p-6 bg-gray-800 rounded-3xl text-[10px] font-black text-orange-500 uppercase italic animate-pulse">Consulting datamine archives...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-3 bg-gray-950 p-3 rounded-[3rem] border-2 border-gray-800 shadow-3xl focus-within:border-orange-600/50">
              <input type="text" placeholder="Ask about farming, lore, or math..." className="flex-1 bg-transparent px-6 py-3 text-xs font-black outline-none italic text-white" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} />
              <button onClick={handleAiSend} disabled={isAiLoading} className="bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-3xl shadow-xl transition-all active:scale-95 disabled:opacity-50"><Send size={20}/></button>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gray-950/95 backdrop-blur-2xl border-t-2 border-gray-800 p-3 flex justify-around items-center z-[110] rounded-t-[3.5rem] shadow-3xl">
        {[
          { id: 'meta', icon: Crown, label: 'Meta' },
          { id: 'analyze', icon: TrendingUp, label: 'Analyze' },
          { id: 'dps', icon: Calculator, label: 'DPS' },
          { id: 'lab', icon: Target, label: 'Lab' },
          { id: 'data', icon: LayoutDashboard, label: 'Resources' },
          { id: 'ai', icon: MessageSquare, label: 'Ask AI' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-300 ${activeTab === t.id ? 'text-orange-500 scale-110' : 'text-gray-600 hover:text-gray-400'}`}>
            <t.icon size={22} className={activeTab === t.id ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : ''} />
            <span className="text-[9px] font-black uppercase tracking-tight">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
