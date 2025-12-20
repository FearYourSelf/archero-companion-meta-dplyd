
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Sparkles, Send, BrainCircuit, Loader2,
  X, Layers, Info, Trash2, Heart, Calculator, RefreshCw,
  Crown, MousePointer2, Ghost, Target, PawPrint, BookOpen
} from 'lucide-react';
import { HERO_DATA, GEAR_DATA } from './constants';
import { Badge, ProgressBar, Card } from './components/UI';
import { chatWithAI } from './services/geminiService';
import { ChatMessage, Tier, BaseItem, Hero, GearCategory, CalcStats } from './types';

type Tab = 'tierlist' | 'builds' | 'calc' | 'ai' | 'lab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tierlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'All' | 'Favs'>('All');
  const [gearCategory, setGearCategory] = useState<GearCategory | 'Hero'>('Hero');
  
  // Persistence
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

  // UI States
  const [isInferno, setIsInferno] = useState(false);
  const [buildHero, setBuildHero] = useState(HERO_DATA[0].id);
  const [buildWeapon, setBuildWeapon] = useState(GEAR_DATA.filter(g => g.category === 'Weapon')[0].id);
  const [buildArmor, setBuildArmor] = useState(GEAR_DATA.filter(g => g.category === 'Armor')[0].id);

  // Mini-Game State
  const [trainerProgress, setTrainerProgress] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [trainerFeedback, setTrainerFeedback] = useState<{ text: string, type: 'perfect' | 'miss' | 'none' }>({ text: 'Start Training', type: 'none' });
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

  // Trainer Logic
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
          setTrainerFeedback({ text: 'TOO SLOW', type: 'miss' });
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
    
    // Perfect window is around 30% (25-35%)
    if (trainerProgress >= 25 && trainerProgress <= 35) {
      setTrainerFeedback({ text: 'PERFECT! (Attack Speed +40%)', type: 'perfect' });
    } else {
      setTrainerFeedback({ text: 'MISSED TIMING', type: 'miss' });
    }
  };

  // DPS Calculation
  const dpsResult = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    const result = baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + atkSpeed / 100);
    return Math.round(result);
  }, [calcStats]);

  // Build Logic
  const buildResult = useMemo(() => {
    if (buildHero === 'zeus' && buildWeapon === 'hammer') {
      return "GOD SYNERGY: Thunder God's Wrath Enabled!";
    }
    if (buildWeapon === 'staff') {
      return "WARNING: Bad Synergy. Staff needs Diagonal Arrows. Avoid Front Arrow at all costs.";
    }
    const h = HERO_DATA.find(x => x.id === buildHero);
    const w = GEAR_DATA.find(x => x.id === buildWeapon);
    return `Stats Summary: Balanced ${h?.name} build with ${w?.name}. Remember to stutter-step!`;
  }, [buildHero, buildWeapon, buildArmor]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredItems = useMemo(() => {
    let items: BaseItem[] = [];
    if (gearCategory === 'Hero') {
      items = HERO_DATA;
    } else {
      items = GEAR_DATA.filter(g => g.category === gearCategory);
    }

    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = tierFilter === 'All' || item.tier === tierFilter;
      const matchFav = tierFilter === 'Favs' ? favorites.includes(item.id) : true;
      return matchSearch && (tierFilter === 'Favs' ? matchFav : matchTier);
    });
  }, [gearCategory, searchQuery, tierFilter, favorites]);

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
      setChatMessages(prev => [...prev, { role: 'model', text: "Wiki systems offline.", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const categoryIcons: Record<string, any> = {
    Hero: User,
    Weapon: Sword,
    Armor: Shield,
    Ring: Crown,
    Locket: Heart,
    Spirit: Ghost,
    Pet: PawPrint,
    Dragon: Sparkles,
    Book: BookOpen
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto shadow-2xl relative border-x border-gray-800 pb-24">
      
      <header className="bg-gray-900/95 backdrop-blur-md p-5 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center transform -rotate-3 shadow-lg shadow-orange-600/30">
              <Sword className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white italic">ARCHERO<span className="text-orange-500">PRO</span></h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-800 px-2 rounded">JP Wiki Logic</span>
                <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search gear or heroes..." 
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
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap border ${tierFilter === f ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 overflow-y-auto">
        
        {activeTab === 'tierlist' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {Object.keys(categoryIcons).map(cat => {
                const Icon = categoryIcons[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setGearCategory(cat as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all border flex items-center gap-2 ${gearCategory === cat ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                  >
                    <Icon size={12} />
                    {cat}s
                  </button>
                );
              })}
            </div>
            
            <div className="space-y-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="relative group overflow-hidden hover:border-orange-500/50 transition-all">
                  {item.isGodTier && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-transparent -rotate-45 translate-x-8 -translate-y-8" />}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleFavorite(item.id)} className="active:scale-125 transition-transform">
                        <Heart size={20} className={favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
                      </button>
                      <h3 className="font-black text-xl text-white uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    </div>
                    <Badge tier={item.tier} />
                  </div>
                  <p className="text-xs text-gray-400 mb-3 font-medium leading-relaxed">{item.desc}</p>
                  {item.details && <p className="text-[10px] text-gray-600 italic border-t border-gray-700/30 pt-2 mb-2">{item.details}</p>}
                  {item.synergy && <div className="p-2 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[10px] font-black text-blue-400 uppercase tracking-widest">Synergy: {item.synergy}</div>}
                  
                  {gearCategory === 'Hero' && (item as Hero).stats && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center text-[10px] font-black text-gray-600 uppercase">
                        <span className="w-12">ATK</span>
                        <ProgressBar value={(item as Hero).stats.atk} max={10} color="orange" />
                      </div>
                      <div className="flex items-center text-[10px] font-black text-gray-600 uppercase">
                        <span className="w-12">HP</span>
                        <ProgressBar value={(item as Hero).stats.hp} max={10} color="blue" />
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              {filteredItems.length === 0 && <div className="text-center py-20 text-gray-600 uppercase font-black text-xs">No items found in this category</div>}
            </div>
          </div>
        )}

        {activeTab === 'builds' && (
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
            <div className="text-center p-6 space-y-2">
              <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-2">
                <BrainCircuit size={28} /> Build Analyzer
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase px-1 tracking-widest">Hero Selection</label>
                <select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 outline-none">
                  {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name.toUpperCase()} ({h.tier})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase px-1 tracking-widest">Primary Weapon</label>
                <select value={buildWeapon} onChange={e => setBuildWeapon(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 outline-none">
                  {GEAR_DATA.filter(g => g.category === 'Weapon').map(w => <option key={w.id} value={w.id}>{w.name.toUpperCase()} ({w.tier})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase px-1 tracking-widest">Selected Armor</label>
                <select value={buildArmor} onChange={e => setBuildArmor(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-sm font-bold appearance-none hover:border-orange-500 outline-none">
                  {GEAR_DATA.filter(g => g.category === 'Armor').map(a => <option key={a.id} value={a.id}>{a.name.toUpperCase()} ({a.tier})</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <Sparkles className="absolute top-4 right-4 text-orange-200 animate-pulse" />
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase text-orange-100 tracking-widest mb-4">Meta Recommendation</h4>
                <p className="text-xl font-black text-white italic leading-tight">{buildResult}</p>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Base Attack', key: 'baseAtk', step: 100, icon: Crown },
                { label: 'Crit Chance %', key: 'critChance', step: 1, icon: Target },
                { label: 'Crit Dmg %', key: 'critDmg', step: 5, icon: Sparkles },
                { label: 'Atk Speed %', key: 'atkSpeed', step: 5, icon: RefreshCw },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1">
                    {field.label}
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
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Theoretical DPS</h4>
              <div className="text-6xl font-black text-white tracking-tighter mb-4 italic">
                {dpsResult.toLocaleString()}
              </div>
              <p className="text-[10px] text-gray-500 max-w-xs mx-auto italic">Note: Actual damage varies by Enemy Type, Boss modifiers, and Hatchery Crit Damage bonuses.</p>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black italic text-orange-500 text-center uppercase">Combat Training</h2>
            
            <Card className="p-8 text-center bg-gray-800/50">
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-xl text-white mb-1 uppercase tracking-tighter">Stutter Step Trainer</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Click "Move" exactly at 30% Progress</p>
                </div>
                
                <div className="w-full space-y-8">
                  <div className="relative h-4 bg-gray-950 rounded-full overflow-hidden border border-gray-700 shadow-inner">
                    <div 
                      className="absolute h-full bg-orange-600 transition-all duration-75"
                      style={{ width: `${trainerProgress}%` }}
                    />
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
                      className="flex-1 py-4 bg-gray-900 border border-gray-700 hover:bg-gray-800 disabled:opacity-50 rounded-2xl font-black uppercase text-xs flex flex-col items-center gap-2 transition-all active:scale-95"
                    >
                      <Target size={20} />
                      Attack
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={!isAttacking}
                      className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-2xl font-black uppercase text-xs flex flex-col items-center gap-2 shadow-lg shadow-orange-600/30 transition-all active:scale-95"
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
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Inferno Meta Toggle</h3>
                 <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-xl">
                   <button onClick={() => setIsInferno(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!isInferno ? 'bg-orange-600' : 'text-gray-500'}`}>Normal</button>
                   <button onClick={() => setIsInferno(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isInferno ? 'bg-red-600' : 'text-gray-500'}`}>Inferno</button>
                 </div>
               </div>
               <Card className={isInferno ? 'border-red-600 bg-red-950/10' : 'border-orange-600'}>
                 <div className="flex items-start gap-4">
                   <div className={`p-3 rounded-2xl ${isInferno ? 'bg-red-600' : 'bg-orange-600'} shadow-lg`}>
                     <Ghost size={24} />
                   </div>
                   <div className="space-y-1">
                     <h4 className="font-black text-white uppercase">{isInferno ? 'Inferno Strategy: Resist Capped' : 'Dmg Resistance is Meta'}</h4>
                     <p className="text-xs text-gray-400 leading-relaxed">
                       {isInferno 
                         ? 'In chapters H90+, Projectile Resistance (PR) is capped. Shift focus to Raw HP and Collision Resistance. Bull Rings and Necrogon dragon are mandatory.' 
                         : 'Standard chapters favor Proj Resistance (PR) heavily. Bull/Dragon rings provide massive damage reduction to push higher stats.'}
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
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                  <div className="w-20 h-20 bg-gray-800 rounded-[2rem] flex items-center justify-center rotate-6 border border-gray-700 shadow-xl">
                    <MessageSquare size={40} className="text-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Wiki Strategist AI</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Ask about builds, farming, or specific heroes</p>
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
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Consulting Wiki logic...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-3 bg-gray-950 p-2 rounded-[2.5rem] border border-gray-800 shadow-2xl">
              <input 
                type="text" 
                placeholder="Ask about meta advice..." 
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

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gray-950/90 backdrop-blur-2xl border-t border-gray-800 p-4 flex justify-around items-center z-[110] rounded-t-[3rem] shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
        {[
          { id: 'tierlist', icon: Crown, label: 'Meta' },
          { id: 'builds', icon: BrainCircuit, label: 'Builds' },
          { id: 'calc', icon: Calculator, label: 'DPS' },
          { id: 'ai', icon: MessageSquare, label: 'Expert' },
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
