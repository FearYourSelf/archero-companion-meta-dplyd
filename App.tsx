
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sword, Shield, Zap, User, Search, MessageSquare, 
  Sparkles, Send, BrainCircuit, Loader2,
  X, Layers, Trash2, Heart, Calculator, 
  Crown, MousePointer2, Ghost, Target, PawPrint as Dog, Book, Egg, Landmark as Tower, Flame,
  Circle, ExternalLink, LayoutDashboard, Trophy, Star, AlertTriangle, TrendingUp,
  Info, Settings2
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, ARCHERO_KNOWLEDGE_BASE 
} from './constants';
import { Badge, Card } from './components/UI';
import { chatWithAI } from './services/geminiService';
import { ChatMessage, Tier, BaseItem, GearCategory, CalcStats, TrainingStats, Hero } from './types';

type Tab = 'tierlist' | 'builds' | 'calc' | 'lab' | 'resources' | 'ai';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tierlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'All'>('All');
  const [isGodTierOnly, setIsGodTierOnly] = useState(false);
  const [gearCategory, setGearCategory] = useState<GearCategory | 'Hero'>('Hero');
  
  // State Persistence
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('archero_favs') || '[]'));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('archero_chat') || '[]'));
  const [calcStats, setCalcStats] = useState<CalcStats>(() => JSON.parse(localStorage.getItem('archero_stats') || '{"baseAtk":100000,"critChance":45,"critDmg":400,"atkSpeed":60,"weaponType":"Demon Blade"}'));
  const [trainingStats, setTrainingStats] = useState<TrainingStats>(() => JSON.parse(localStorage.getItem('archero_training') || '{"bestStreak":0}'));

  // UI States
  const [isInfernoMode, setIsInfernoMode] = useState(false);
  const [buildHero, setBuildHero] = useState(HERO_DATA[0].id);
  const [buildWeapon, setBuildWeapon] = useState(GEAR_DATA.find(g => g.category === 'Weapon')?.id || '');
  const [buildArmor, setBuildArmor] = useState(GEAR_DATA.find(g => g.category === 'Armor')?.id || '');
  
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lab Game State
  const [labState, setLabState] = useState<'IDLE' | 'ATTACKING'>('IDLE');
  const [trainerProgress, setTrainerProgress] = useState(0);
  const [targetZone, setTargetZone] = useState({ start: 25, end: 35 });
  const [streak, setStreak] = useState(0);
  const trainerInterval = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('archero_favs', JSON.stringify(favorites));
    localStorage.setItem('archero_chat', JSON.stringify(chatMessages));
    localStorage.setItem('archero_stats', JSON.stringify(calcStats));
    localStorage.setItem('archero_training', JSON.stringify(trainingStats));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [favorites, chatMessages, calcStats, trainingStats]);

  const weaponMultipliers: Record<string, number> = {
    'Demon Blade': 1.8,
    'Expedition Fist': 1.7,
    'Celestial Hammer': 1.65,
    'Demon King Spear': 1.75,
    'Scythe': 1.45,
    'Bow': 1.0,
    'Antiquated Sword': 1.7
  };

  const dpsResult = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed, weaponType } = calcStats;
    const mult = weaponMultipliers[weaponType] || 1.0;
    const critFactor = 1 + (critChance / 100 * (critDmg / 100));
    const speedFactor = 1 + (atkSpeed / 100);
    return Math.round(baseAtk * mult * critFactor * speedFactor);
  }, [calcStats]);

  const buildAnalysis = useMemo(() => {
    let advice = [];
    if (buildHero === 'zeus') advice.push("ZEUS META: Ensure full **Celestial Set** (Hammer, Warplate, Band) for 20% Lightning DPS bonus.");
    if (buildHero === 'helix') advice.push("HELIX STRAT: Use **Meowgik** in Offense Assist slot. Keep HP low to maximize Rage multiplier.");
    if (buildWeapon === 'dk_spear') advice.push("SPEAR TECH: In Shield mode, healing charges your blast. Use **Expedition Plate** for the heal-on-kill loop.");
    
    if (isInfernoMode) {
      advice.push("⚠️ INFERNO WARNING: Chapter 90+ ignores PR. Switch **Dragon Ring** to **Celestial Bracer** for Collision Res.");
    } else {
      advice.push("STANDARD META: Focus on **Projectile Resistance** via Atreus Lv120 and Dragon Rings.");
    }

    return advice;
  }, [buildHero, buildWeapon, isInfernoMode]);

  const handleLabAction = () => {
    if (labState === 'IDLE') {
      const start = Math.floor(Math.random() * 50) + 20;
      setTargetZone({ start, end: start + 10 });
      setLabState('ATTACKING');
      setTrainerProgress(0);
      
      trainerInterval.current = window.setInterval(() => {
        setTrainerProgress(p => {
          if (p >= 100) {
            clearInterval(trainerInterval.current!);
            setLabState('IDLE');
            setStreak(0);
            return 100;
          }
          return p + 4;
        });
      }, 50);
    } else {
      clearInterval(trainerInterval.current!);
      setLabState('IDLE');
      if (trainerProgress >= targetZone.start && trainerProgress <= targetZone.end) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > trainingStats.bestStreak) {
          setTrainingStats({ bestStreak: newStreak });
        }
      } else {
        setStreak(0);
      }
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: Date.now() }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const history = chatMessages.map(m => ({ role: m.role, text: m.text }));
      const res = await chatWithAI(history, userMsg);
      setChatMessages(prev => [...prev, { role: 'model', text: res.text, timestamp: Date.now(), sources: res.sources }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Luhcaran math engine timed out. Offline data only.", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    const items: BaseItem[] = gearCategory === 'Hero' ? HERO_DATA : GEAR_DATA.filter(g => g.category === gearCategory);
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = isGodTierOnly ? item.isGodTier : (tierFilter === 'All' ? true : item.tier === tierFilter);
      return matchSearch && matchTier;
    });
  }, [gearCategory, searchQuery, tierFilter, isGodTierOnly]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans max-w-2xl mx-auto border-x border-gray-800 pb-24 shadow-2xl relative">
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-[100] p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center -rotate-6 shadow-lg shadow-orange-900/40">
              <Sword className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">ARCHERO<span className="text-orange-500">PRO</span></h1>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">SCORCHED EARTH DATA v2.6</span>
            </div>
          </div>
          <button 
            onClick={() => setIsGodTierOnly(!isGodTierOnly)}
            className={`p-2 rounded-xl transition-all duration-300 ${isGodTierOnly ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-gray-600'}`}
          >
            <Crown size={24} className={isGodTierOnly ? 'fill-yellow-500' : ''} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search mechanics, leaks, Lv120 bonuses..." 
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === 'tierlist' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['All', 'SSS', 'SS', 'S'].map(f => (
              <button 
                key={f} 
                onClick={() => setTierFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all flex-shrink-0 ${tierFilter === f ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
              >
                {f}
              </button>
            ))}
            <div className="w-px h-5 bg-gray-800 my-auto mx-1" />
            {['Hero', 'Weapon', 'Armor', 'Ring', 'Totem', 'Dragon'].map(cat => (
              <button
                key={cat}
                onClick={() => setGearCategory(cat as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all flex-shrink-0 ${gearCategory === cat ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 p-5 overflow-y-auto no-scrollbar scroll-smooth">
        
        {activeTab === 'tierlist' && (
          <div className="grid grid-cols-1 gap-5">
            {filteredItems.map(item => (
              <Card key={item.id} tier={item.tier}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-black text-base text-white uppercase italic tracking-tight">{item.name}</h3>
                  <Badge tier={item.tier} />
                </div>
                <p className="text-xs text-gray-400 italic mb-3 leading-relaxed">{item.desc}</p>
                {item.mythicPerk && (
                  <div className="bg-red-950/20 border border-red-500/20 p-3 rounded-xl flex items-start gap-2 mb-3">
                    <Star size={12} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-yellow-500 font-bold uppercase italic">Mythic Perk: {item.mythicPerk}</p>
                  </div>
                )}
                {item.category === 'Hero' && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-gray-800 pt-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase">
                      <Zap size={12} /> Lv120 Bonus: {(item as Hero).globalBonus120}
                    </div>
                    {(item as Hero).assistSlots && (
                      <div className="flex gap-2 flex-wrap">
                        {(item as Hero).assistSlots?.map(s => (
                          <span key={s} className="bg-gray-900 px-2 py-0.5 rounded text-[8px] font-bold text-gray-500 border border-gray-800 uppercase">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'builds' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5">
            <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-3 uppercase tracking-tighter">
              <Settings2 size={32} /> Build Analyzer
            </h2>
            
            <div className="space-y-6 bg-gray-800/40 p-8 rounded-[3rem] border border-gray-700 shadow-inner">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Target Hero</label>
                <select value={buildHero} onChange={e => setBuildHero(e.target.value)} className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl p-4 text-xs font-black text-white focus:border-orange-500 outline-none transition-all">
                  {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Weapon</label>
                  <select value={buildWeapon} onChange={e => setBuildWeapon(e.target.value)} className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl p-4 text-[10px] font-black text-white focus:border-orange-500 outline-none">
                    {GEAR_DATA.filter(g => g.category === 'Weapon').map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Armor</label>
                  <select value={buildArmor} onChange={e => setBuildArmor(e.target.value)} className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl p-4 text-[10px] font-black text-white focus:border-orange-500 outline-none">
                    {GEAR_DATA.filter(g => g.category === 'Armor').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${isInfernoMode ? 'bg-orange-600/20 text-orange-500' : 'bg-gray-700 text-gray-500'}`}>
                      <Flame size={18} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase text-white">Inferno Mode (H90+)</div>
                      <div className="text-[8px] font-bold text-gray-500 uppercase">Enables Resistance Penetration logic</div>
                   </div>
                </div>
                <button 
                  onClick={() => setIsInfernoMode(!isInfernoMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${isInfernoMode ? 'bg-orange-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${isInfernoMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-orange-950/20 border-2 border-orange-600/40 shadow-xl relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles size={24} className="text-orange-500" />
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-orange-500 italic">Tactical Briefing</h4>
                  </div>
                  {buildAnalysis.map((txt, i) => (
                    <p key={i} className="text-sm font-bold text-gray-200 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: txt.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-500">$1</span>') }} />
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'calc' && (
          <div className="space-y-8 animate-in zoom-in-95">
            <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-3 uppercase tracking-tighter">
              <Calculator size={32} /> DPS Engine v2.6
            </h2>
            <div className="grid grid-cols-1 gap-5 p-8 bg-gray-800/40 rounded-[3rem] border border-gray-700">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">Base Multiplier</label>
                <select 
                  value={calcStats.weaponType}
                  onChange={e => setCalcStats(p => ({...p, weaponType: e.target.value}))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-xs font-black text-white focus:border-orange-500 outline-none"
                >
                  {Object.keys(weaponMultipliers).map(k => <option key={k} value={k}>{k} ({weaponMultipliers[k]}x)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'baseAtk', label: 'Raw Attack' },
                  { key: 'critChance', label: 'Crit %' },
                  { key: 'critDmg', label: 'Crit Dmg %' },
                  { key: 'atkSpeed', label: 'Speed %' },
                ].map(f => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase px-2 tracking-widest">{f.label}</label>
                    <input 
                      type="number"
                      value={calcStats[f.key as keyof CalcStats] as number}
                      onChange={e => setCalcStats(p => ({...p, [f.key]: parseFloat(e.target.value) || 0}))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-xs font-black"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-12 bg-gray-950 border-t-4 border-orange-600 rounded-[3.5rem] text-center shadow-3xl relative overflow-hidden">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-600 uppercase tracking-widest">Total Real DPS</div>
              <div className="text-6xl font-black text-white italic tracking-tighter mt-4">{dpsResult.toLocaleString()}</div>
              <div className="mt-8 p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl text-left text-[10px] font-bold text-gray-500 uppercase flex gap-3">
                 <Info size={16} className="text-orange-500 flex-shrink-0" />
                 Endgame Note: Flat mob damage on rings is omitted as it does not benefit from critical multipliers.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-8 animate-in slide-in-from-right-5">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black italic text-orange-500 uppercase tracking-tighter">Pro Lab</h2>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Trophy size={18} /> <span className="text-lg font-black italic">{trainingStats.bestStreak}</span>
                </div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Global Best</span>
              </div>
            </div>

            <Card className="p-10 text-center bg-gray-800/40 border-orange-500/20 shadow-2xl relative overflow-hidden rounded-[3rem]">
              <div className="mb-6 flex justify-center">
                 <div className="bg-gray-900 w-20 h-20 rounded-full flex items-center justify-center border-4 border-orange-600/30">
                    <MousePointer2 size={32} className="text-orange-500" />
                 </div>
              </div>
              <h4 className="font-black text-white text-lg mb-2 uppercase italic">Stutter Step Training</h4>
              <p className="text-[10px] text-gray-500 uppercase mb-10 font-bold tracking-widest">Tap when in the green zone to cancel animation</p>
              
              <div className="relative h-6 bg-gray-950 rounded-full overflow-hidden mb-8 border-2 border-gray-800 shadow-inner">
                <div className="absolute h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-75" style={{ width: `${trainerProgress}%` }} />
                <div className="absolute top-0 h-full bg-green-500/30 border-x-4 border-green-500/60" style={{ left: `${targetZone.start}%`, width: `${targetZone.end - targetZone.start}%` }} />
              </div>

              <div className="flex justify-between items-center mb-8 px-4">
                 <span className="text-xs font-black text-gray-600 uppercase">Current Streak</span>
                 <span className="text-2xl font-black text-white italic">{streak}</span>
              </div>

              <button 
                onMouseDown={handleLabAction} 
                className={`w-full py-8 rounded-[2rem] font-black uppercase text-sm transition-all shadow-2xl active:scale-95 border-b-8 ${labState === 'IDLE' ? 'bg-gray-800 border-gray-950 text-white hover:bg-gray-700' : 'bg-orange-600 border-orange-800 text-white animate-pulse'}`}
              >
                {labState === 'IDLE' ? 'Execute Attack' : 'FRAME CANCEL'}
              </button>
            </Card>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-black italic text-orange-500 flex items-center justify-center gap-3 uppercase tracking-tighter">
              <LayoutDashboard size={32} /> Resources Hub
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800/40 border-2 border-gray-700 rounded-[3rem] overflow-hidden shadow-xl">
                <div className="bg-gray-900/80 p-6 border-b-2 border-gray-700 font-black text-xs uppercase tracking-[0.2em] text-blue-400 flex items-center gap-3">
                  <Star size={18} className="fill-blue-400" /> Lv120 Global Mastery Table
                </div>
                <div className="p-6 grid grid-cols-1 gap-3">
                  {HERO_DATA.filter(h => h.globalBonus120).map(h => (
                    <div key={h.id} className="flex justify-between items-center bg-gray-900/40 p-4 rounded-2xl border border-gray-800/50">
                      <span className="font-black text-white italic text-xs">{h.name}</span>
                      <span className="font-black text-blue-400 text-xs">{h.globalBonus120}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/40 border-2 border-gray-700 rounded-[3rem] overflow-hidden shadow-xl">
                <div className="bg-gray-900/80 p-6 border-b-2 border-gray-700 font-black text-xs uppercase tracking-[0.2em] text-yellow-500 flex items-center gap-3">
                  <Tower size={18} className="fill-yellow-500" /> Estate & Totem ROI
                </div>
                <div className="p-8 space-y-4">
                   <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                      <div className="font-black text-white text-xs uppercase italic mb-1">Skin Stats Totem</div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">Highest ROI in Chaos-tier. Multiplies the core stats that power-up every hero skin you own.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 text-center">
                        <div className="text-[8px] font-black text-gray-500 uppercase mb-1">Worker Priority</div>
                        <div className="text-xs font-black text-white uppercase italic">Daniel (Mob %)</div>
                      </div>
                      <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 text-center">
                        <div className="text-[8px] font-black text-gray-500 uppercase mb-1">Building ROI</div>
                        <div className="text-xs font-black text-white uppercase italic">Fountain #1</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-280px)] animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex-1 overflow-y-auto space-y-5 mb-5 no-scrollbar p-2">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-20 text-center px-10">
                  <BrainCircuit size={80} className="mb-6 text-orange-500" />
                  <p className="font-black italic uppercase text-sm tracking-widest">Awaiting Tactical Directive...</p>
                  <p className="text-[10px] font-bold mt-2 uppercase tracking-tight">Syncing JP Wiki & Luhcaran Archives...</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-5 rounded-[2rem] text-[11px] font-medium leading-relaxed shadow-2xl ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-800 border-2 border-gray-700 rounded-tl-none text-gray-200'}`}>
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-800 border-2 border-gray-700 p-5 rounded-[2rem] text-[10px] font-black text-orange-500 uppercase italic flex items-center gap-3">
                    <Loader2 className="animate-spin" size={16} /> Datamining 2026 archives...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="flex gap-3 bg-gray-950 p-3 rounded-[2.5rem] border-2 border-gray-800 shadow-3xl">
              <input 
                type="text" 
                placeholder="Query the Ultimate Strategist..." 
                className="flex-1 bg-transparent px-6 py-3 text-xs font-black outline-none italic placeholder:text-gray-800"
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              />
              <button 
                onClick={handleSendChat} 
                disabled={isChatLoading} 
                className="bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-2xl shadow-xl shadow-orange-900/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={20}/>
              </button>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gray-950/95 backdrop-blur-2xl border-t-2 border-gray-800 p-3 flex justify-around items-center z-[110] rounded-t-[3rem] shadow-3xl">
        {[
          { id: 'tierlist', icon: Crown, label: 'Meta' },
          { id: 'builds', icon: TrendingUp, label: 'Analyze' },
          { id: 'calc', icon: Calculator, label: 'DPS' },
          { id: 'lab', icon: Target, label: 'Lab' },
          { id: 'resources', icon: LayoutDashboard, label: 'Data' },
          { id: 'ai', icon: MessageSquare, label: 'Ask AI' },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as Tab)} 
            className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-300 group ${activeTab === t.id ? 'text-orange-500 scale-110' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <t.icon size={22} className={activeTab === t.id ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : ''} />
            <span className="text-[9px] font-black uppercase tracking-tight">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
