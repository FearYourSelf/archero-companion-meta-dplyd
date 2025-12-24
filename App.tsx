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
  Compass, Box, Disc, Timer, ZapOff, Fingerprint, Map, Sparkle, Bug, AlertCircle, Bot,
  HeartHandshake, Volume2, VolumeX, BarChart3, Scan, ShieldCheck, Zap as Bolt, Eye, Scroll, Wine, ArrowUp,
  Lock, FunctionSquare, Variable, ChevronDown, Hammer, Coins, Archive, Package, History,
  Clock, Gauge, UserCircle2, Zap as Spark, ChevronDown as ArrowDown, Droplets, Binary,
  Lightbulb, Link2, Ghost as Spook, Database, Cpu, Radio, Radar, Fingerprint as ScanIcon,
  Telescope, Activity as Pulse, Shrink, MoreHorizontal, Copy, FileText, Mountain, Zap as BoltIcon,
  ShieldAlert, DollarSign, Users, Award as AwardIcon, Sparkle as StarIcon, Info as InfoIcon,
  ChevronUp, ArrowDownWideNarrow, Check, Atom, RotateCcw, Scale, Milestone, Code, Swords as Combat, Shirt, UserPlus,
  Globe, Sun
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, SET_BONUS_DESCRIPTIONS, FARMING_ROUTES, DRAGON_DATA, FarmingRoute, REFINE_TIPS, JEWEL_SLOT_BONUSES
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic, GearSet, LogEntry, SlotBonus, StarMilestone, SunMilestone } from './types';
import { Badge, Card } from './components/UI';

// --- CUSTOM GAME ICONS ---
const BowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8 2C14 2 20 7 20 12C20 17 14 22 8 22" />
    <path d="M8 2L2 12L8 22" />
    <line x1="2" y1="12" x2="16" y2="12" />
    <polyline points="13 8 17 12 13 16" />
  </svg>
);

// --- WEAPON PHYSICS DATA ---
const WEAPON_SPEEDS: Record<string, { name: string; speed: number; label: string }> = {
  'Fist': { name: 'Expedition Fist', speed: 3.5, label: 'FAST (3.5x)' },
  'Scythe': { name: 'Death Scythe', speed: 1.2, label: 'HEAVY (1.2x)' },
  'Blade': { name: 'Demon Blade', speed: 2.0, label: 'NORMAL (2.0x)' },
  'Saw': { name: 'Saw Blade', speed: 4.5, label: 'EXTREME (4.5x)' },
};

// --- Improved Robust Search Logic ---
const fuzzyMatch = (str: string, pattern: string): boolean => {
  if (!pattern) return true;
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  let n = -1;
  for (let i = 0; i < pattern.length; i++) {
    if (!~(n = str.indexOf(pattern[i], n + 1))) return false;
  }
  return true;
};

const performRobustSearch = (item: any, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/);
  const searchableText = [
    item.name,
    item.id,
    item.desc,
    item.category,
    item.tier,
    item.deepLogic,
    item.mythicPerk,
    item.statType,
    item.effect,
    item.lore,
    item.uniqueEffect,
    item.globalBonus120,
    item.bestSkin,
    item.bio,
    item.source
  ].filter(Boolean).map(val => String(val).toLowerCase());

  return tokens.every(token => {
    const directMatch = searchableText.some(field => field.includes(token));
    if (directMatch) return true;
    return fuzzyMatch(item.name || '', token) || fuzzyMatch(item.id || '', token);
  });
};

const getTierWeight = (t: Tier) => {
  const weights: Record<Tier, number> = { 'SSS': 7, 'SS': 6, 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
  return weights[t] || 0;
};

const CustomSelect: React.FC<{ 
  options: { id: string; name: string; subtitle?: string }[]; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  className?: string;
}> = ({ options, value, onChange, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-900/80 border border-white/10 rounded-2xl text-xs font-black text-white uppercase italic transition-all hover:border-orange-500/30"
      >
        <span className="truncate">{selected ? selected.name : placeholder}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-[110%] left-0 w-full z-[1000] bg-gray-950/95 backdrop-blur-3xl border border-white/10 rounded-2xl py-2 shadow-4xl max-h-[300px] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2">
          {options.map(opt => (
            <button 
              key={opt.id}
              onClick={() => { onChange(opt.id); setIsOpen(false); }}
              className={`w-full px-6 py-3 text-left hover:bg-orange-600/10 transition-colors border-b border-white/5 last:border-0 ${value === opt.id ? 'text-orange-500' : 'text-gray-400'}`}
            >
              <p className="text-[11px] font-black uppercase italic">{opt.name}</p>
              {opt.subtitle && <p className="text-[8px] font-bold opacity-50 uppercase tracking-widest mt-0.5">{opt.subtitle}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const RelicIcon: React.FC<{ type?: string; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'Sword': return <Sword className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Scroll': return <Scroll className={className} />;
    case 'Gem': return <Gem className={className} />;
    case 'Eye': return <Eye className={className} />;
    case 'Book': return <Book className={className} />;
    case 'Cup': return <Wine className={className} />;
    case 'Arrow': return <ArrowUp className={className} />;
    case 'Mirror': return <Scan className={className} />;
    case 'Map': return <Map className={className} />;
    case 'Dog': return <Dog className={className} />;
    default: return <Box className={className} />;
  }
};

const SFX = {
  ctx: null as AudioContext | null,
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  },
  play(type: 'click' | 'hover' | 'tab' | 'msg' | 'error') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const now = this.ctx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(); osc.stop(now + 0.1);
    } else if (type === 'tab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(); osc.stop(now + 0.15);
    } else if (type === 'msg') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(); osc.stop(now + 0.2);
    } else if (type === 'error') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(); osc.stop(now + 0.2);
    }
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'tracker' | 'analyze' | 'dps' | 'vs' | 'immunity' | 'lab' | 'jewels' | 'relics' | 'farming' | 'ai' | 'formula' | 'dragons' | 'refine'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('All');
  const [relicTierFilter, setRelicTierFilter] = useState<'All' | 'Holy' | 'Radiant' | 'Faint'>('All');
  const [relicSourceFilter, setRelicSourceFilter] = useState<string>('All');
  const [sssOnly, setSssOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [maintenanceToast, setMaintenanceToast] = useState(false);
  const [uiToast, setUiToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsRef = useRef<LogEntry[]>([]);

  // Hero Tracker State: Level 120 + Stars + Sun Level
  const [unlockedHeroes, setUnlockedHeroes] = useState<Record<string, { lv120: boolean; stars: number; sunLevel: number }>>(() => {
    const saved = localStorage.getItem('archero_v6_tracker_plus_v2');
    if (saved) return JSON.parse(saved);
    // Migration fallback from older tracker
    const old = localStorage.getItem('archero_v6_tracker_plus');
    if (old) {
      const parsedOld = JSON.parse(old);
      const migrated: Record<string, { lv120: boolean; stars: number; sunLevel: number }> = {};
      Object.keys(parsedOld).forEach(k => migrated[k] = { ...parsedOld[k], sunLevel: 0 });
      return migrated;
    }
    return {};
  });

  const [equippedItems, setEquippedItems] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem('archero_v6_equipped') || '[]')));
  const [favoriteHeroes, setFavoriteHeroes] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem('archero_v6_favorites') || '[]')));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('archero_v6_chat') || '[]'));
  const [calcStats, setCalcStats] = useState<CalcStats>(() => JSON.parse(localStorage.getItem('archero_v6_stats') || '{"baseAtk":75000,"critChance":45,"critDmg":420,"atkSpeed":60,"weaponType":"Expedition Fist"}'));
  const [fInputs, setFInputs] = useState({ baseAtk: 60000, atkPercent: 75, weaponDmgPercent: 15, critDmg: 380 });
  const [dragons, setDragons] = useState({ slot1: DRAGON_DATA[0].id, slot2: DRAGON_DATA[1].id, slot3: DRAGON_DATA[2].id });
  const [smeltItem, setSmeltItem] = useState<'Epic' | 'PE' | 'Legendary' | 'AL' | 'Mythic'>('Legendary');
  const [smeltQty, setSmeltQty] = useState(1);
  const [vsItemA, setVsItemA] = useState<string>(GEAR_DATA[0]?.id || '');
  const [vsItemB, setVsItemB] = useState<string>(GEAR_DATA[1]?.id || GEAR_DATA[0]?.id || '');
  const [immunitySetup, setImmunitySetup] = useState({ rings: 2, atreus120: true, onir120: true, locket: true, necrogon: false });
  const [simResult, setSimResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [buildHero, setBuildHero] = useState<string>(HERO_DATA[0]?.id || '');
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSimMenuOpen, setIsSimMenuOpen] = useState(false);

  const [stutterProgress, setStutterProgress] = useState(0);
  const [stutterStreak, setStutterStreak] = useState(0);
  const [stutterActive, setStutterActive] = useState(false);
  const [stutterFeedback, setStutterFeedback] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState('Blade');
  const [efficiency, setEfficiency] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const farmFilterScrollRef = useRef<HTMLDivElement>(null);
  const relicTierFilterScrollRef = useRef<HTMLDivElement>(null);
  const relicSourceFilterScrollRef = useRef<HTMLDivElement>(null);
  const jewelFilterScrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, moved: false, startX: 0, scrollLeft: 0, targetRef: null as React.RefObject<HTMLElement | null> | null });

  useEffect(() => {
    const addLog = (type: LogEntry['type'], ...args: any[]) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      const newEntry: LogEntry = { id: Math.random().toString(36).substring(2, 9), type, message, timestamp: Date.now() };
      logsRef.current = [newEntry, ...logsRef.current].slice(0, 100);
      setLogs([...logsRef.current]);
    };
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    console.log = (...args) => { originalLog(...args); addLog('info', ...args); };
    console.warn = (...args) => { originalWarn(...args); addLog('warn', ...args); };
    console.error = (...args) => { originalError(...args); addLog('error', ...args); };
    window.onerror = (message, source, lineno, colno, error) => { addLog('error', `Global Error: ${message} at ${source}:${lineno}:${colno}`); };
    const handleKeyDown = (e: KeyboardEvent) => { if (e.ctrlKey && e.key === "'") { setIsConsoleVisible(prev => !prev); if (!isConsoleVisible) playSfx('msg'); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => { console.log = originalLog; console.warn = originalWarn; console.error = originalError; window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  useEffect(() => { if (uiToast) { const timer = setTimeout(() => setUiToast(null), 3000); return () => clearTimeout(timer); } }, [uiToast]);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => { setUiToast({ message, type }); playSfx(type === 'error' ? 'error' : 'msg'); };

  useEffect(() => {
    if (activeTab === 'ai' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  useEffect(() => {
    let interval: number;
    if (stutterActive) {
      interval = window.setInterval(() => {
        setStutterProgress(prev => {
          const speed = WEAPON_SPEEDS[selectedWeapon].speed;
          if (prev >= 100) { setStutterStreak(0); setStutterFeedback("MISS!"); setEfficiency(0); return 0; }
          return prev + speed;
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [stutterActive, selectedWeapon]);

  const [compareHeroIds, setCompareHeroIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [farmingSearch, setFarmingSearch] = useState('');
  const [farmingCategory, setFarmingCategory] = useState<'All' | FarmingRoute['resource']>('All');
  const [farmingSort, setFarmingSort] = useState<{ field: 'resource' | 'chapter' | 'efficiency' | 'avgTime', direction: 'asc' | 'desc' }>({ field: 'efficiency', direction: 'desc' });
  const [expandedFarmingId, setExpandedFarmingId] = useState<string | null>(null);
  const [jewelSimLevel, setJewelSimLevel] = useState<number>(16);
  const [jewelFilterSlot, setJewelFilterSlot] = useState<string>('All');

  const relicSources = useMemo(() => {
    const sources = RELIC_DATA.map(r => r.source).filter(Boolean) as string[];
    const sortedUnique = Array.from(new Set(sources)).sort((a, b) => a.localeCompare(b));
    return ['All', ...sortedUnique];
  }, []);

  const playSfx = (type: 'click' | 'hover' | 'tab' | 'msg' | 'error') => { if (soundEnabled) { SFX.init(); SFX.play(type); } };

  const handleDragStart = (e: React.MouseEvent, ref: React.RefObject<HTMLElement | null>) => {
    if (!ref.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, select, textarea, a')) return;
    ref.current.style.scrollBehavior = 'auto';
    dragRef.current = { isDragging: true, moved: false, startX: e.pageX, scrollLeft: ref.current.scrollLeft, targetRef: ref };
  };

  useLayoutEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d.isDragging || !d.targetRef?.current) return;
      const ref = d.targetRef.current;
      const dx = (e.pageX - d.startX) * 1.5;
      if (Math.abs(dx) > 3) { d.moved = true; ref.scrollLeft = d.scrollLeft - dx; }
    };
    const handleGlobalMouseUp = () => { const d = dragRef.current; if (d.isDragging) { if (d.targetRef?.current) { d.targetRef.current.style.scrollBehavior = 'smooth'; } d.isDragging = false; } };
    const bars = [navScrollRef.current, categoryScrollRef.current, farmFilterScrollRef.current, relicTierFilterScrollRef.current, relicSourceFilterScrollRef.current, jewelFilterScrollRef.current];
    const wheelListeners: {el: HTMLElement, fn: (e: WheelEvent) => void}[] = [];
    bars.forEach(bar => {
      if (!bar) return;
      const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) { e.preventDefault(); bar.style.scrollBehavior = 'smooth'; const scrollAmt = e.deltaY !== 0 ? e.deltaY : e.deltaX; bar.scrollBy({ left: scrollAmt * 4.5, behavior: 'smooth' }); } };
      bar.addEventListener('wheel', onWheel, { passive: false });
      wheelListeners.push({ el: bar, fn: onWheel });
    });
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => { window.removeEventListener('mousemove', handleGlobalMouseMove); window.removeEventListener('mouseup', handleGlobalMouseUp); wheelListeners.forEach(({el, fn}) => el.removeEventListener('wheel', fn)); };
  }, [activeTab]);

  useEffect(() => { localStorage.setItem('archero_v6_tracker_plus_v2', JSON.stringify(unlockedHeroes)); }, [unlockedHeroes]);
  useEffect(() => { localStorage.setItem('archero_v6_equipped', JSON.stringify(Array.from(equippedItems))); }, [equippedItems]);
  useEffect(() => { localStorage.setItem('archero_v6_favorites', JSON.stringify(Array.from(favoriteHeroes))); }, [favoriteHeroes]);
  useEffect(() => { localStorage.setItem('archero_v6_chat', JSON.stringify(chatHistory)); }, [chatHistory]);
  useEffect(() => { localStorage.setItem('archero_v6_stats', JSON.stringify(calcStats)); }, [calcStats]);

  const calculateGlobalStats = () => {
    const totals: Record<string, number> = {};
    
    const addStat = (rawBonus: string) => {
      const match = rawBonus.match(/([+-]?\d+)%?\s*(.*)/);
      if (match) {
        const val = parseInt(match[1]);
        const stat = match[2].trim() || 'General';
        totals[stat] = (totals[stat] || 0) + val;
      }
    };

    HERO_DATA.forEach(h => {
      const userHero = unlockedHeroes[h.id];
      if (!userHero) return;

      // Level 120 Bonus
      if (userHero.lv120) {
        addStat(h.globalBonus120);
      }

      // Star Global Bonuses
      (h.starMilestones as StarMilestone[])?.forEach(m => {
        if (m.isGlobal && userHero.stars >= m.stars) {
          addStat(m.effect);
        }
      });

      // Sun Global Bonuses (Dynamic Calculation for v6.3)
      (h.sunMilestones as SunMilestone[])?.forEach(m => {
        if (m.isGlobal && userHero.sunLevel >= m.level) {
          addStat(m.effect);
        }
      });
    });
    return totals;
  };

  const toggleEquip = (id: string) => { playSfx('click'); setEquippedItems(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };
  const toggleFavorite = (id: string) => { playSfx('click'); setFavoriteHeroes(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };

  const formulaResult = useMemo(() => { const { baseAtk, atkPercent, weaponDmgPercent, critDmg } = fInputs; return Math.round(baseAtk * (1 + atkPercent/100) * (1 + weaponDmgPercent/100) * (critDmg/100)); }, [fInputs]);
  const calculatedDPS = useMemo(() => { const { baseAtk, critChance, critDmg, atkSpeed } = calcStats; return Math.round(baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + (atkSpeed / 100))); }, [calcStats]);
  const totalImmunity = useMemo(() => (immunitySetup.rings * 13.8) + (immunitySetup.atreus120 ? 7 : 0) + (immunitySetup.onir120 ? 10 : 0) + (immunitySetup.locket ? 15 : 0) + (immunitySetup.necrogon ? 7.5 : 0), [immunitySetup]);

  const dragonSynergy = useMemo(() => {
    const selected = [DRAGON_DATA.find(d => d.id === dragons.slot1), DRAGON_DATA.find(d => d.id === dragons.slot2), DRAGON_DATA.find(d => d.id === dragons.slot3)];
    const uniqueTypes = new Set(selected.map(s => (s as BaseItem)?.dragonType).filter(Boolean));
    return uniqueTypes.size === 3;
  }, [dragons]);

  const handleEquipDragon = (slot: 'slot1' | 'slot2' | 'slot3', dragonId: string) => {
    setDragons(prev => { const next = { ...prev }; if (slot !== 'slot1' && prev.slot1 === dragonId) next.slot1 = ''; if (slot !== 'slot2' && prev.slot2 === dragonId) next.slot2 = ''; if (slot !== 'slot3' && prev.slot3 === dragonId) next.slot3 = ''; next[slot] = dragonId; return next; });
    playSfx('click');
  };

  const smeltEssenceYield = useMemo(() => { const baseline: Record<string, number> = { 'Epic': 50, 'PE': 150, 'Legendary': 500, 'AL': 1200, 'Mythic': 3500 }; return (baseline[smeltItem] || 0) * smeltQty; }, [smeltItem, smeltQty]);

  const filteredFarming = useMemo(() => {
    const efficiencyWeight = { 'SSS': 4, 'SS': 3, 'S': 2, 'A': 1, 'B': 0 };
    const filtered = FARMING_ROUTES.filter(route => { 
      const matchesSearch = performRobustSearch(route, farmingSearch); 
      const matchesCategory = farmingCategory === 'All' || route.resource === farmingCategory; 
      return matchesSearch && matchesCategory; 
    });
    return [...filtered].sort((a, b) => {
      let valA: any = a[farmingSort.field]; let valB: any = b[farmingSort.field];
      if (farmingSort.field === 'efficiency') { valA = (efficiencyWeight as any)[a.efficiency] || 0; valB = (efficiencyWeight as any)[b.efficiency] || 0; } else if (farmingSort.field === 'avgTime') { valA = parseFloat(a.avgTime) || 0; valB = parseFloat(b.avgTime) || 0; }
      if (valA < valB) return farmingSort.direction === 'asc' ? -1 : 1; if (valA > valB) return farmingSort.direction === 'asc' ? 1 : -1; return 0;
    });
  }, [farmingSearch, farmingCategory, farmingSort]);

  const toggleFarmingSort = (field: typeof farmingSort.field) => { playSfx('click'); setFarmingSort(prev => ({ field, direction: prev.field === field ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'desc' })); };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    playSfx('msg'); const msg = aiInput; setAiInput('');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, timestamp: Date.now() }]);
    setIsAiLoading(true);
    try {
      const response = await chatWithAI(msg, chatHistory.map(h => ({ role: h.role, text: h.text })));
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'Mentor offline.', timestamp: Date.now() }]);
    } catch (e: any) {
      console.error("Gemini API Uplink Failure", e);
      const errorMsg = e.message === "RATE_LIMIT_EXCEEDED" ? "Rate limit hit. Free tier allows 15 requests per minute." : "Neural uplink interrupted.";
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: errorMsg, timestamp: Date.now() }]);
      showToast(errorMsg, 'error');
    } finally { setIsAiLoading(false); }
  };

  const runSimulation = async () => {
    playSfx('click'); setIsSimMenuOpen(false); setIsSimulating(true); setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Advanced synthesis for ${hero?.name} at ${calcStats.baseAtk} Atk. Structure with headers and bold gear. Focus on synergy. Include BEST build: Weapon, Armor, Rings, Bracelet, Locket, Book.`;
    try { const response = await chatWithAI(prompt, []); setSimResult(response || 'Simulation timeout.'); } catch (e: any) { console.error("Simulation Synth Error", e); const errorMsg = e.message === "RATE_LIMIT_EXCEEDED" ? "Neural Core is busy (Rate Limit). Try again in 60s." : "Simulation data corrupt."; showToast(errorMsg, 'error'); setSimResult(errorMsg); }
    finally { setIsSimulating(false); }
  };

  const copySimResult = () => { if (simResult) { navigator.clipboard.writeText(simResult); playSfx('click'); setIsSimMenuOpen(false); showToast('Build Report copied.', 'success'); } };
  const exportSimResult = () => { if (simResult) { const element = document.createElement("a"); const file = new Blob([simResult], {type: 'text/plain'}); element.href = URL.createObjectURL(file); element.download = `Archero_Synthesis_${buildHero}_${Date.now()}.txt`; document.body.appendChild(element); element.click(); playSfx('click'); setIsSimMenuOpen(false); showToast('Tactical Report exported.', 'success'); } };

  const handleTabChange = (tab: typeof activeTab) => { playSfx('tab'); setActiveTab(tab); if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleResetFilters = () => { setSearchQuery(''); setCategoryFilter('All'); setSssOnly(false); playSfx('click'); };

  const handleExportBuild = (heroName: string, set: GearSet) => { playSfx('click'); const text = `ARCHERO TACTICAL BUILD: ${set.name}\nHero: ${heroName}\nWeapon: ${set.weapon}\nArmor: ${set.armor}\nRings: ${set.rings.join(' + ')}\nBracelet: ${set.bracelet}\nLocket: ${set.locket}\nBook: ${set.book}\nSYNERGY: ${set.synergy}`.trim(); navigator.clipboard.writeText(text); showToast(`${set.name} exported.`, 'success'); };

  const findItemByName = (name: string) => [...GEAR_DATA, ...DRAGON_DATA].find(i => i.name === name || i.id === name);

  const displayOrder: GearCategory[] = ['Hero', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book', 'Spirit', 'Dragon', 'Pet', 'Relic', 'Jewel', 'Totem', 'Pet Farm Eggs', 'Glyph'];
  const categoryIcons: Record<string, any> = { 'All': LayoutGrid, 'Hero': User, 'Weapon': Sword, 'Armor': Shield, 'Ring': Circle, 'Locket': Target, 'Bracelet': Zap, 'Book': Book, 'Spirit': Ghost, 'Dragon': Flame, 'Pet': Dog, 'Pet Farm Eggs': Egg, 'Totem': Tower, 'Relic': Box, 'Jewel': Disc, 'Glyph': Layers };
  const categoryEmojis: Record<string, string> = { 'Hero': '🦸', 'Weapon': '⚔️', 'Armor': '🛡️', 'Ring': '💍', 'Bracelet': '⚡', 'Locket': '🎯', 'Book': '📖', 'Spirit': '👻', 'Dragon': '🐉', 'Pet': '🐾', 'Relic': '🏺', 'Jewel': '💎', 'Totem': '🏛️', 'Pet Farm Eggs': '🥚', 'Glyph': '➰' };

  const filteredJewels = useMemo(() => JEWEL_DATA.filter(j => jewelFilterSlot === 'All' || j.slots.includes(jewelFilterSlot)), [jewelFilterSlot]);
  
  const filteredRelics = useMemo(() => RELIC_DATA.filter(r => { 
    const matchesTier = relicTierFilter === 'All' || r.tier === relicTierFilter; 
    const matchesSource = relicSourceFilter === 'All' || r.source === relicSourceFilter; 
    const matchesSearch = performRobustSearch(r, searchQuery); 
    return matchesSearch && matchesTier && matchesSource;
  }), [relicTierFilter, relicSourceFilter, searchQuery]);

  const filteredData = useMemo(() => {
    const adaptedJewels = JEWEL_DATA.map(j => ({ ...j, category: 'Jewel' as GearCategory, tier: 'S' as Tier, desc: j.lore || j.statType }));
    const adaptedRelics = RELIC_DATA.map(r => ({ ...r, category: 'Relic' as GearCategory, tier: 'S' as Tier, desc: r.effect }));
    return [...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA, ...adaptedJewels, ...adaptedRelics].filter(item => { 
      const matchesSearch = performRobustSearch(item, searchQuery); 
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter; 
      const matchesSss = !sssOnly || item.tier === 'SSS'; 
      return matchesSearch && matchesCategory && matchesSss; 
    });
  }, [searchQuery, categoryFilter, sssOnly]);

  const getJewelColorClasses = (color: string) => {
    switch (color) {
      case 'Red': return 'from-red-600/40 via-red-950/20 text-red-500 border-red-500/30';
      case 'Blue': return 'from-blue-600/40 via-blue-950/20 text-blue-500 border-blue-500/30';
      case 'Green': return 'from-green-600/40 via-green-950/20 text-green-500 border-green-500/30';
      case 'Purple': return 'from-purple-600/40 via-purple-950/20 text-purple-500 border-purple-500/30';
      case 'Yellow': return 'from-yellow-600/40 via-yellow-950/20 text-yellow-500 border-yellow-500/30';
      case 'Teal': return 'from-teal-600/40 via-teal-950/20 text-teal-500 border-teal-500/30';
      default: return 'from-gray-600/40 via-gray-950/20 border-white/10 text-gray-500';
    }
  };

  const getRelicStyles = (tier: string) => {
    switch (tier) {
      case 'Holy': return { card: 'bg-orange-600/5 border-orange-500/20 hover:border-orange-500/40', iconContainer: 'bg-orange-600/20 border-orange-500/30 text-orange-500', tooltip: 'border-orange-500/30 text-orange-400', arrow: 'border-orange-500/30' };
      case 'Radiant': return { card: 'bg-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40', iconContainer: 'bg-yellow-600/20 border-yellow-500/30 text-yellow-500', tooltip: 'border-orange-500/30 text-yellow-400', arrow: 'border-orange-500/30' };
      default: return { card: 'bg-blue-600/5 border-blue-500/20 hover:border-blue-500/40', iconContainer: 'bg-blue-600/20 border-blue-500/30 text-blue-500', tooltip: 'border-blue-500/30 text-blue-400', arrow: 'border-blue-500/30' };
    }
  };

  const handleInteractiveClick = (e: React.MouseEvent, action: () => void) => { if (dragRef.current.moved) return; action(); };

  const SortHeader = ({ label, field, currentSort }: { label: string, field: typeof farmingSort.field, currentSort: typeof farmingSort }) => {
    const isActive = currentSort.field === field;
    return (
      <button onClick={() => toggleFarmingSort(field)} className={`flex items-center gap-1 hover:text-orange-500 transition-colors group ${isActive ? 'text-orange-500' : 'text-gray-500'}`}>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {isActive ? (currentSort.direction === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />) : (<ArrowDownWideNarrow size={10} className="opacity-0 group-hover:opacity-50" />)}
      </button>
    );
  };

  const BuildSlot: React.FC<{ label: string; name: string; icon: any }> = ({ label, name, icon: Icon }) => {
    const item = findItemByName(name);
    return (
      <div onClick={() => { if (item) { setSelectedItem(item); playSfx('click'); } }} className={`p-4 bg-black/40 border border-white/5 rounded-2xl transition-all ${item ? 'cursor-pointer hover:border-blue-500/50 hover:bg-blue-900/10' : ''}`}>
        <p className="text-[8px] font-black text-gray-500 uppercase mb-1 flex items-center gap-1"><Icon size={10}/> {label}</p>
        <div className="flex items-center justify-between gap-1">
          <p className="text-[11px] font-black text-gray-200 uppercase italic whitespace-normal leading-tight">{name}</p>
          {item && <ArrowUpRight size={10} className="text-blue-400 shrink-0" />}
        </div>
      </div>
    );
  };

  const handleHeroCompareToggle = (id: string) => { playSfx('click'); setCompareHeroIds(prev => { if (prev.includes(id)) return prev.filter(x => x !== id); if (prev.length < 3) return [...prev, id]; return prev; }); };
  const comparedHeroes = useMemo(() => HERO_DATA.filter(h => compareHeroIds.includes(h.id)), [compareHeroIds]);

  const comparisonVerdict = useMemo(() => {
    if (comparedHeroes.length !== 2) return null;
    const [h1, h2] = comparedHeroes;
    const w1 = getTierWeight(h1.tier);
    const w2 = getTierWeight(h2.tier);
    
    let analysis = "";
    if (w1 > w2) analysis = `${h1.name} has a direct tier advantage (${h1.tier} vs ${h2.tier}).`;
    else if (w2 > w1) analysis = `${h2.name} has a direct tier advantage (${h2.tier} vs ${h1.tier}).`;
    else analysis = "Both heroes are in the same Power Tier.";

    const getBonusType = (s: string) => s.toLowerCase().includes('atk') || s.toLowerCase().includes('attack') ? 'Offense' : 'Defense';
    const b1 = getBonusType(h1.globalBonus120);
    const b2 = getBonusType(h2.globalBonus120);

    return {
      tierWinner: w1 > w2 ? 0 : (w2 > w1 ? 1 : null),
      bonusWinner: (b1 === 'Offense' && b2 === 'Defense') ? 0 : (b2 === 'Offense' && b1 === 'Defense' ? 1 : null),
      verdict: analysis
    };
  }, [comparedHeroes]);

  return (
    <div className="h-screen w-full bg-[#030712] text-gray-100 flex flex-col font-sans max-w-3xl mx-auto relative overflow-hidden border-x border-white/5 shadow-4xl">
      {uiToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[11000] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <div className={`px-6 py-3 rounded-full border shadow-4xl flex items-center gap-3 backdrop-blur-3xl ${uiToast.type === 'success' ? 'bg-green-950/90 border-green-500/30 text-green-400' : uiToast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-400' : 'bg-blue-950/90 border-blue-500/30 text-blue-400'}`}>
            {uiToast.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest italic">{uiToast.message}</span>
          </div>
        </div>
      )}

      {isConsoleVisible && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex flex-col p-8 font-mono overflow-hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <Terminal size={24} className="text-orange-500 animate-pulse" />
              <div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Tactical Developer Uplink</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">V6.3.0 Kernel // Stream: Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { navigator.clipboard.writeText(logs.map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.type.toUpperCase()}: ${l.message}`).join('\n')); playSfx('click'); }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white transition-all flex items-center gap-2"><Copy size={12} /> COPY LOGS</button>
              <button onClick={() => { setLogs([]); logsRef.current = []; playSfx('click'); }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white transition-all flex items-center gap-2"><Trash2 size={12} /> CLEAR</button>
              <button onClick={() => { setIsConsoleVisible(false); playSfx('click'); }} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all shadow-lg active:scale-95"><X size={16} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-4">
            {logs.length === 0 ? (<div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4"><Code size={48} className="text-gray-500 animate-pulse" /><p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Log Buffer Empty</p></div>) : (logs.map(log => (<div key={log.id} className="p-4 bg-white/5 border-l-2 border-white/10 rounded-r-xl group hover:bg-white/10 transition-colors animate-in slide-in-from-left-2"><div className="flex items-start gap-4"><span className="text-[10px] text-gray-600 font-bold shrink-0 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</span><div className="flex-1"><span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md mr-3 ${log.type === 'error' ? 'bg-red-600/20 text-red-500' : log.type === 'warn' ? 'bg-amber-600/20 text-amber-500' : log.type === 'system' ? 'bg-purple-600/20 text-purple-400' : 'bg-cyan-600/20 text-cyan-400'}`}>{log.type}</span><p className={`text-xs mt-2 leading-relaxed font-medium break-all ${log.type === 'error' ? 'text-red-400 font-bold' : log.type === 'warn' ? 'text-amber-300' : 'text-gray-300'}`}>{log.message}</p></div></div></div>)))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between opacity-30">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Terminal Shortcut: CTRL + ' to Exit</p>
            <p className="text-[8px] font-bold text-gray-700">© 2025 ZA ARMORY CORE DEBUGGER</p>
          </div>
        </div>
      )}

      <header className="bg-gray-950/95 backdrop-blur-3xl border-b border-white/5 p-5 shrink-0 z-[100]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BowIcon className="text-orange-500 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none">ZV GRANDMASTER</h1>
              <p className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase mt-1">ZV Armory Clan Strategic Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 bg-white/5 text-gray-500 rounded-xl border border-white/5">{soundEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}</button>
            <button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setActiveTab('meta'); playSfx('click'); }} className="p-3 bg-white/5 text-gray-500 rounded-xl transition-all border border-white/5"><RefreshCw size={16} /></button>
          </div>
        </div>
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-40 scroll-smooth relative">
        {(activeTab === 'meta' || activeTab === 'farming' || activeTab === 'relics' || activeTab === 'jewels') && (
          <div className="sticky top-0 z-[200] bg-gray-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-4 space-y-4">
             {(activeTab === 'meta' || activeTab === 'relics') && (
                <div className="flex items-center gap-3">
                  <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input 
                      type="text" 
                      placeholder={`Search by name, ID, or effect...`} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[11px] font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                  </div>
                  {activeTab === 'meta' && (
                    <div className="flex items-center gap-2">
                       <button onClick={() => { setSssOnly(!sssOnly); playSfx('click'); }} className={`p-3 rounded-2xl border transition-all ${sssOnly ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`} title="SSS Tier Only"><Crown size={18} /></button>
                      <button onClick={handleResetFilters} className="p-3 bg-white/5 border border-white/10 text-gray-500 rounded-2xl hover:text-orange-500 transition-all" title="Reset Filters"><RotateCcw size={18} /></button>
                    </div>
                  )}
                </div>
             )}
             {activeTab === 'meta' && (
                <div ref={categoryScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x draggable-content touch-pan-x flex-nowrap" onMouseDown={(e) => handleDragStart(e, categoryScrollRef)}>
                  {['All', ...displayOrder].map(cat => {
                    const Icon = categoryIcons[cat] || Package;
                    return (<button key={cat} onClick={(e) => handleInteractiveClick(e, () => { setCategoryFilter(cat as any); playSfx('click'); })} className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${categoryFilter === cat ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}><Icon size={12} /> {cat === 'Hero' ? 'HEROES' : (cat === 'Pet Farm Eggs' ? 'PET FARM EGGS' : cat + 'S')}</button>);
                  })}
                </div>
             )}
             {activeTab === 'farming' && (
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search routes by chapter, loot, or hero..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-[10px] font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" 
                      value={farmingSearch} 
                      onChange={(e) => setFarmingSearch(e.target.value)} 
                    />
                  </div>
                  <div ref={farmFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, farmFilterScrollRef)}>{['All', 'Gear', 'Gold', 'Shards', 'Jewels', 'Runes', 'Exp'].map(cat => (<button key={cat} onClick={(e) => handleInteractiveClick(e, () => { setFarmingCategory(cat as any); playSfx('click'); })} className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${farmingCategory === cat ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{cat}</button>))}</div>
                </div>
             )}
             {activeTab === 'relics' && (
                <div className="space-y-3">
                  <div ref={relicTierFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, relicTierFilterScrollRef)}>{['All', 'Holy', 'Radiant', 'Faint'].map(t => (<button key={t} onClick={(e) => handleInteractiveClick(e, () => { setRelicTierFilter(t as any); playSfx('click'); })} className={`flex-shrink-0 px-8 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${relicTierFilter === t ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{t} Tier</button>))}</div>
                  <div ref={relicSourceFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content border-t border-white/5 pt-2" onMouseDown={(e) => handleDragStart(e, relicSourceFilterScrollRef)}><div className="flex-shrink-0 px-3 flex items-center"><MapPin size={10} className="text-gray-600" /></div>{relicSources.map(src => (<button key={src} onClick={(e) => handleInteractiveClick(e, () => { setRelicSourceFilter(src); playSfx('click'); })} className={`flex-shrink-0 px-5 py-2 rounded-xl text-[8px] font-black uppercase transition-all border whitespace-nowrap ${relicSourceFilter === src ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-400'}`}>{src}</button>))}</div>
                </div>
             )}
             {activeTab === 'jewels' && (
                <div ref={jewelFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, jewelFilterScrollRef)}>{['All', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book'].map(slot => (<button key={slot} onClick={(e) => handleInteractiveClick(e, () => { setJewelFilterSlot(slot); playSfx('click'); })} className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${jewelFilterSlot === slot ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{slot} Sockets</button>))}</div>
             )}
          </div>
        )}

        <div className="px-5 py-6 space-y-8">
          {activeTab === 'meta' && (
            <div className="space-y-12">
               {displayOrder.map(cat => {
                  if (categoryFilter !== 'All' && categoryFilter !== cat) return null;
                  const items = filteredData.filter(i => i.category === cat);
                  if (items.length === 0) return null;
                  const sortedItems = [...items].sort((a, b) => { if (cat === 'Hero') { const aFav = favoriteHeroes.has(a.id); const bFav = favoriteHeroes.has(b.id); if (aFav && !bFav) return -1; if (!aFav && bFav) return 1; } const aEquipped = equippedItems.has(a.id); const bEquipped = equippedItems.has(b.id); if (aEquipped && !bEquipped) return -1; if (!aEquipped && bEquipped) return 1; return 0; });
                  return (
                    <div key={cat} className="space-y-6">
                      <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4 italic flex items-center gap-3"><span className="text-xl">{categoryEmojis[cat]}</span> {cat === 'Hero' ? 'HEROES' : (cat === 'Pet Farm Eggs' ? 'PET FARM EGGS' : cat + 'S')}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {sortedItems.map(item => {
                          const isEquipped = equippedItems.has(item.id); const isBeingCompared = compareHeroIds.includes(item.id); const isFavorite = favoriteHeroes.has(item.id);
                          return (
                            <div key={item.id} className="relative group">
                              {((item as any).mythicPerk || (item as any).deepLogic) && (
                                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute left-1/2 -translate-x-1/2 bottom-[105%] w-72 p-5 bg-gray-950/98 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-4xl z-[500] pointer-events-none animate-in fade-in slide-in-from-bottom-2"><div className="space-y-4">{(item as any).mythicPerk && (<div><p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Sparkles size={10} /> Mythic Resonance</p><p className="text-[11px] text-white font-bold italic leading-relaxed bg-orange-600/5 p-2.5 rounded-xl border border-orange-500/10">"{(item as any).mythicPerk}"</p></div>)}{(item as any).deepLogic && (<div><p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Atom size={10} /> Neural Synthesis</p><p className="text-[10px] text-gray-300 font-medium italic leading-relaxed bg-blue-600/5 p-2.5 rounded-xl border border-blue-500/10">{(item as any).deepLogic}</p></div>)}</div><div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-gray-950 rotate-45 border-r border-b border-white/10"></div></div>
                              )}
                              {isEquipped && (
                                <div className="absolute -top-1.5 -right-1.5 z-40 animate-in fade-in zoom-in pointer-events-none">
                                  <div className="bg-orange-600 text-white p-2 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.6)] border border-orange-400/50">
                                    <CheckCircle2 size={16} className="drop-shadow-sm" />
                                  </div>
                                </div>
                              )}
                              <div onClick={() => { setSelectedItem(item); playSfx('click'); }} className="cursor-pointer">
                                <Card tier={item.tier} className={`transition-all duration-500 ${isEquipped ? 'border-orange-500/70 shadow-[0_0_30px_rgba(249,115,22,0.2)] ring-2 ring-orange-500/30 ring-offset-2 ring-offset-black bg-orange-950/5 scale-[1.02]' : 'hover:scale-[1.02]'} ${isFavorite && item.category === 'Hero' ? 'bg-yellow-400/5 border-yellow-500/20' : ''}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge tier={item.tier} />
                                      {isEquipped && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 text-[8px] font-black text-white uppercase rounded-lg animate-pulse shadow-sm">
                                          <Zap size={10} fill="currentColor" className="mr-0.5" /> EQUIPPED
                                        </span>
                                      )}
                                      {isFavorite && item.category === 'Hero' && (<Star size={12} className="text-yellow-500 fill-current" />)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {item.category === 'Hero' && (
                                        <button onClick={(e) => { e.stopPropagation(); handleHeroCompareToggle(item.id); }} className={`p-2 rounded-xl border transition-all ${isBeingCompared ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-gray-600 hover:text-blue-500'}`} title="Compare Hero">
                                          <Scale size={14} />
                                        </button>
                                      )}
                                      <button onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }} className={`p-2 rounded-xl border transition-all ${isEquipped ? 'bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/20 pulse-orange' : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-300'}`} title={isEquipped ? "Remove from Build" : "Add to Build"}>
                                        {isEquipped ? <Check size={14} /> : <Box size={14} />}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-3">
                                    <h3 className={`text-lg font-black uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors truncate ${isEquipped ? 'text-orange-400' : 'text-white'}`}>
                                      {item.name}
                                    </h3>
                                    {item.category === 'Hero' && (
                                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }} className={`p-1.5 rounded-lg transition-all ${isFavorite ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'}`} title="Favorite Hero">
                                        <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">{item.desc}</p>
                                </Card>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
               })}
            </div>
          )}

          {activeTab === 'vs' && (
            <div className="space-y-10 animate-in fade-in pb-12">
               <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[3rem] text-center"><h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Tactical Comparison Matrix</h4><p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em]">Side-by-Side Architectural Analysis</p></div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-6"><CustomSelect options={GEAR_DATA.map(g => ({ id: g.id, name: g.name, subtitle: g.category }))} value={vsItemA} onChange={(v) => setVsItemA(v)} placeholder="Load Source A..." />{GEAR_DATA.find(g => g.id === vsItemA) && (<div className="animate-in slide-in-from-left-4 duration-500"><Card tier={GEAR_DATA.find(g => g.id === vsItemA)?.tier} className="min-h-[400px]"><Badge tier={GEAR_DATA.find(g => g.id === vsItemA)!.tier} /><h5 className="text-lg font-black text-white uppercase italic mt-4">{GEAR_DATA.find(g => g.id === vsItemA)?.name}</h5><div className="mt-8 space-y-6">{GEAR_DATA.find(g => g.id === vsItemA)?.mythicPerk && (<div><p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p><p className="text-[11px] text-gray-200 font-bold italic">{GEAR_DATA.find(g => g.id === vsItemA)?.mythicPerk}</p></div>)}{GEAR_DATA.find(g => g.id === vsItemA)?.deepLogic && (<div className="p-4 bg-black/40 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p><p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">{GEAR_DATA.find(g => g.id === vsItemA)?.deepLogic}</p></div>)}</div></Card></div>)}</div>
                  <div className="space-y-6"><CustomSelect options={GEAR_DATA.map(g => ({ id: g.id, name: g.name, subtitle: g.category }))} value={vsItemB} onChange={(v) => setVsItemB(v)} placeholder="Load Source B..." />{GEAR_DATA.find(g => g.id === vsItemB) && (<div className="animate-in slide-in-from-right-4 duration-500"><Card tier={GEAR_DATA.find(g => g.id === vsItemB)?.tier} className="min-h-[400px]"><Badge tier={GEAR_DATA.find(g => g.id === vsItemB)!.tier} /><h5 className="text-lg font-black text-white uppercase italic mt-4">{GEAR_DATA.find(g => g.id === vsItemB)?.name}</h5><div className="mt-8 space-y-6">{GEAR_DATA.find(g => g.id === vsItemB)?.mythicPerk && (<div><p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p><p className="text-[11px] text-gray-200 font-bold italic">{GEAR_DATA.find(g => g.id === vsItemB)?.mythicPerk}</p></div>)}{GEAR_DATA.find(g => g.id === vsItemB)?.deepLogic && (<div className="p-4 bg-black/40 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p><p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">{GEAR_DATA.find(g => g.id === vsItemB)?.deepLogic}</p></div>)}</div></Card></div>)}</div>
               </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-6 animate-in fade-in pb-24">
              <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[2.5rem]">
                <h4 className="text-[10px] font-black text-orange-500 uppercase mb-6 flex items-center gap-2 tracking-[0.3em]"><Activity size={14}/> Account Sync Protocol</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(calculateGlobalStats()).map(([stat, val]) => (
                    <div key={stat} className="p-5 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-md">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 truncate">{stat}</p>
                      <p className="text-2xl font-black text-white italic">+{val}%</p>
                    </div>
                  ))}
                  {Object.keys(calculateGlobalStats()).length === 0 && (
                    <div className="col-span-full py-4 text-center opacity-30 text-[9px] font-black uppercase tracking-widest italic">
                      No global stats active. Level 120 or Evolution required.
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {HERO_DATA.map(h => {
                  const userData = unlockedHeroes[h.id] || { lv120: false, stars: 0, sunLevel: 0 };
                  return (
                    <div key={h.id} className="p-5 bg-gray-900/60 border border-white/5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-orange-500/20 transition-all">
                      <div className="flex items-center gap-4">
                        <Badge tier={h.tier} />
                        <div>
                          <span className="text-sm font-black text-white italic uppercase tracking-tighter block">{h.name}</span>
                          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">L120: {h.globalBonus120}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-6 flex-wrap">
                        {/* Star Selector */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest px-1">Star Evolution</span>
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-black/40 rounded-xl border border-white/5">
                            {[1,2,3,4,5,6,7,8].map(starNum => (
                              <button 
                                key={starNum} 
                                onClick={() => {
                                  setUnlockedHeroes(p => ({
                                    ...p, 
                                    [h.id]: { ...p[h.id], stars: (p[h.id]?.stars === starNum) ? starNum - 1 : starNum }
                                  }));
                                  playSfx('click');
                                }} 
                                className={`transition-all ${userData.stars >= starNum ? 'text-yellow-500' : 'text-gray-800 hover:text-gray-600'}`}
                              >
                                <Star size={14} fill={userData.stars >= starNum ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sun Level Selector */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] font-black text-orange-500/80 uppercase tracking-widest px-1">Sun Evolution</span>
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-orange-950/20 rounded-xl border border-orange-500/10">
                            {[1,2,3,4,5].map(level => (
                              <button 
                                key={level} 
                                onClick={() => {
                                  setUnlockedHeroes(p => ({
                                    ...p, 
                                    [h.id]: { ...p[h.id], sunLevel: (p[h.id]?.sunLevel === level) ? level - 1 : level }
                                  }));
                                  playSfx('click');
                                }} 
                                className={`transition-all ${userData.sunLevel >= level ? 'text-orange-500' : 'text-gray-800 hover:text-gray-600'}`}
                              >
                                <Sun size={14} fill={userData.sunLevel >= level ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* L120 Toggle */}
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest px-1">Max Level</span>
                           <button 
                             onClick={() => { 
                               setUnlockedHeroes(p => ({...p, [h.id]: { ...p[h.id], lv120: !p[h.id]?.lv120 }})); 
                               playSfx('click'); 
                             }} 
                             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${userData.lv120 ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-600 hover:text-gray-400'}`}
                           >
                            {userData.lv120 ? 'ACTIVE' : 'L120'}
                           </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-6 animate-in fade-in pb-12">
              <div className="p-6 bg-amber-600/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-[11px] font-medium text-amber-100/80 leading-relaxed italic">
                  <span className="font-black text-amber-500 uppercase tracking-wider block mb-1">Manual Calibration:</span> 
                  Input hero attributes from character screen. Using compact curved rectangles for efficiency.
                </p>
              </div>
              <div className="p-10 bg-gray-950/90 border border-white/5 rounded-[3rem] text-center shadow-inner relative ring-1 ring-white/5">
                <p className="text-[11px] font-black text-gray-600 uppercase mb-3 tracking-[0.2em]">Effective Multiplier</p>
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white italic tracking-tighter tabular-nums">{formulaResult.toLocaleString()}</div>
                <p className="text-[10px] text-orange-500 font-black uppercase mt-4 tracking-[0.3em]">Base Damage Capacity</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { k: 'baseAtk', l: 'Raw ATK' },
                  { k: 'atkPercent', l: 'ATK %' },
                  { k: 'weaponDmgPercent', l: 'Weapon Dmg %' },
                  { k: 'critDmg', l: 'Crit Dmg %' }
                ].map(s => (
                  <div key={s.k} className="px-6 py-3 bg-gray-900/60 border border-white/5 rounded-2xl focus-within:border-orange-500/40 transition-all flex flex-col justify-center h-16 shadow-lg">
                    <label className="text-[8px] font-black text-gray-600 uppercase block mb-0.5 tracking-[0.2em]">{s.l}</label>
                    <input 
                      type="number" 
                      value={(fInputs as any)[s.k]} 
                      onChange={e => setFInputs(p => ({ ...p, [s.k]: Number(e.target.value) }))} 
                      className="bg-transparent text-white text-lg font-black outline-none w-full tabular-nums selection:bg-orange-500/30" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dragons' && (
            <div className="space-y-10 animate-in fade-in pb-12"><div className={`p-10 rounded-[3.5rem] border transition-all ${dragonSynergy ? 'bg-orange-600/10 border-orange-500/40' : 'bg-gray-900/40 border-white/5'} shadow-2xl`}><div className="flex items-center justify-between mb-8"><div><h4 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3"><Flame size={24} className={dragonSynergy ? 'text-orange-500' : 'text-gray-600'}/> Magestone Core</h4><p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{dragonSynergy ? "Resonance Optimized" : "Incomplete Synchronization"}</p></div>{dragonSynergy && <Sparkles className="text-orange-500 animate-pulse" size={24} />}</div><div className="grid grid-cols-1 gap-6">{['slot1', 'slot2', 'slot3'].map((slot, i) => { const selected = DRAGON_DATA.find(d => d.id === (dragons as any)[slot]); return (<div key={slot} className="p-6 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col gap-4"><CustomSelect options={DRAGON_DATA.map(d => ({ id: d.id, name: d.name, subtitle: (d as BaseItem).dragonType }))} value={(dragons as any)[slot]} onChange={(val) => handleEquipDragon(slot as any, val)} placeholder={`Assign Dragon Socket ${i+1}`} />{selected && (<div className="px-2 space-y-2 animate-in fade-in slide-in-from-left-2">{selected.deepLogic && <p className="text-[11px] font-bold text-orange-400 italic">Skill: {selected.deepLogic}</p>}<p className="text-[9px] text-gray-500 leading-relaxed font-medium">{selected.desc}</p></div>)}</div>); })}</div></div><div className="p-8 bg-black/20 rounded-[3rem] border border-white/5"><p className="text-[10px] font-black text-gray-600 uppercase mb-4 flex items-center gap-2"><Lightbulb size={12}/> Pro Tip</p><p className="text-[11px] text-gray-400 italic leading-relaxed">Assign unique dragons to each socket. Resonance is triggered by having one of each Type (Attack, Defense, Balance).</p></div></div>
          )}

          {activeTab === 'refine' && (
            <div className="space-y-10 animate-in fade-in pb-12"><div className="p-12 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-[4.5rem] text-center shadow-4xl relative overflow-hidden group"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div><Cpu className="mx-auto mb-6 text-orange-600/20 group-hover:text-orange-500/40 transition-colors" size={60} /><p className="text-[11px] font-black text-orange-500 uppercase mb-2 tracking-[0.4em]">Estimated Essence Yield</p><div className="text-6xl sm:text-7xl md:text-8xl font-black text-white italic tracking-tighter drop-shadow-2xl">{smeltEssenceYield.toLocaleString()}</div><p className="text-[9px] font-black text-gray-600 uppercase mt-2 tracking-[0.2em]">Glyph Essence Units</p></div><div className="mt-12 grid grid-cols-2 gap-4"><CustomSelect options={['Epic', 'PE', 'Legendary', 'AL', 'Mythic'].map(r => ({ id: r, name: r }))} value={smeltItem} onChange={(v) => setSmeltItem(v as any)} placeholder="Select Rarity..." /><div className="relative group"><input type="number" value={smeltQty} onChange={e => setSmeltQty(Number(e.target.value))} className="w-full bg-gray-900/80 border border-white/10 px-6 py-4 rounded-2xl text-xs font-black text-white outline-none focus:border-orange-500/50" min="1" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Qty</span></div></div><div className="space-y-4"><h5 className="px-4 text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Smelt Optimization Tips</h5><div className="grid grid-cols-1 gap-3">{REFINE_TIPS.map((tip, i) => (<div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-start gap-4"><ShieldCheck className="text-orange-500 mt-1 shrink-0" size={16} /><p className="text-[11px] text-gray-300 font-medium italic leading-relaxed">{tip}</p></div>))}</div></div></div>
          )}

          {activeTab === 'analyze' && (
            <div className="flex flex-col min-h-full animate-in fade-in pb-24 space-y-10"><div className={`transition-all duration-700 relative ${simResult ? 'p-8 bg-blue-900/10 border border-blue-500/20 rounded-[3rem]' : 'p-16 bg-gray-950 border-2 border-blue-500/20 rounded-[4rem] shadow-4xl'}`}>{!simResult && <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5 opacity-20 pointer-events-none animate-pulse"></div>}<div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><ScanIcon size={simResult ? 100 : 200} className="animate-pulse" /></div><div className={`relative z-10 flex flex-col items-center text-center ${simResult ? 'gap-4' : 'gap-10'}`}><div className={`transition-all duration-700 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-inner ${simResult ? 'w-16 h-16' : 'w-32 h-32'}`}><BrainCircuit size={simResult ? 24 : 64} className="text-blue-500 animate-pulse" /></div><div><h4 className={`${simResult ? 'text-lg' : 'text-3xl'} font-black text-white uppercase italic tracking-tighter transition-all duration-700`}>Strategic Synthesis</h4>{!simResult && <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mt-3 italic">Neural Network V6.3 Uplink</p>}</div><div className={`w-full max-w-sm transition-all ${simResult ? 'flex gap-4' : 'space-y-6'}`}><CustomSelect options={HERO_DATA.map(h => ({ id: h.id, name: h.name, subtitle: h.tier }))} value={buildHero} onChange={(val) => setBuildHero(val)} placeholder="Select Hero Target..." className="flex-1" /><button onClick={runSimulation} disabled={isSimulating} className={`transition-all duration-500 bg-blue-600 text-white font-black uppercase rounded-3xl hover:bg-blue-500 flex items-center justify-center gap-4 disabled:opacity-30 shadow-xl active:scale-95 ${simResult ? 'px-6 py-2 text-[10px]' : 'w-full py-6 text-[14px]'}`}>{isSimulating ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18} className="fill-current"/>}<span>{isSimulating ? 'Processing...' : simResult ? 'RE-SYNTH' : 'INITIATE ANALYSIS'}</span></button></div></div></div>{simResult ? (<div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700 pb-20"><div className="flex items-center justify-between px-6 relative"><div className="flex items-center gap-3"><Pulse size={16} className="text-blue-500 animate-pulse" /><span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Output: Finalizing Build Path</span></div><div className="relative"><button onClick={() => setIsSimMenuOpen(!isSimMenuOpen)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-blue-500"><MoreHorizontal size={20} /></button>{isSimMenuOpen && (<div className="absolute right-0 top-full mt-2 w-48 bg-gray-950 border border-white/10 rounded-2xl py-2 shadow-4xl z-[200] animate-in fade-in slide-in-from-top-2"><button onClick={copySimResult} className="w-full px-5 py-3 flex items-center gap-3 text-[11px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all"><Copy size={14} /> <span>Copy to Clipboard</span></button><button onClick={exportSimResult} className="w-full px-5 py-3 flex items-center gap-3 text-[11px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all"><FileText size={14} /> <span>Export as .txt</span></button></div>)}</div></div><div className="p-12 bg-gray-900/60 border-l-4 border-l-blue-500 border-y border-r border-white/5 rounded-r-[4rem] rounded-l-[1.5rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden ring-1 ring-white/5"><div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div><div className="text-[16px] text-gray-200 leading-[2.2] italic whitespace-pre-wrap font-medium relative z-10 selection:bg-blue-500/30">{simResult.split('\n').map((line, idx) => { if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8 border-b border-blue-500/20 pb-4">{line.replace('# ', '')}</h1>; if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-black text-blue-400 uppercase tracking-widest mt-10 mb-6">{line.replace('## ', '')}</h2>; if (line.startsWith('- ')) return <div key={idx} className="flex gap-4 mb-3"><span className="text-blue-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span><span className="text-gray-300 font-medium">{line.replace('- ', '')}</span></div>; return <p key={idx} className="mb-4">{line}</p>; })}</div></div></div>) : !isSimulating && (<div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20 animate-in fade-in duration-1000 delay-500"><Radar size={80} className="text-gray-500 mb-8 animate-ping" style={{animationDuration: '4s'}} /><div className="space-y-2"><p className="text-sm font-black uppercase tracking-[0.5em] text-gray-400">Deep Search Inactive</p><p className="text-[10px] font-bold text-gray-600 italic">Target selection required for tactical projection.</p></div></div>)}{isSimulating && (<div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in"><div className="relative"><Loader2 size={120} className="text-blue-500/20 animate-spin" /><BrainCircuit size={48} className="text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" /></div><div className="mt-12 text-center space-y-4"><p className="text-xl font-black italic text-white uppercase tracking-tighter">Synthesizing Tactical Matrix</p></div></div>)}</div>
          )}

          {activeTab === 'immunity' && (
            <div className="space-y-8 animate-in fade-in pb-12"><div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5"><p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projectile Resistance Cap</p><div className={`text-6xl sm:text-7xl md:text-8xl font-black italic tracking-tighter ${totalImmunity >= 100 ? 'text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'text-white'}`}>{totalImmunity.toFixed(1)}%</div><p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">{totalImmunity >= 100 ? 'SYSTEM IMMUNE' : 'VULNERABILITY DETECTED'}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[{ label: 'Dragon Rings (Max 2)', val: immunitySetup.rings, set: (v: number) => setImmunitySetup(p => ({...p, rings: v})) }, { label: 'Atreus Level 80 (+7%)', check: immunitySetup.atreus120, set: (v: boolean) => setImmunitySetup(p => ({...p, atreus120: v})) }, { label: 'Onir 7-Star Passive (+10%)', check: immunitySetup.onir120, set: (v: boolean) => setImmunitySetup(p => ({...p, onir120: v})) }, { label: 'Bulletproof Locket (+15%)', check: immunitySetup.locket, set: (v: boolean) => setImmunitySetup(p => ({...p, atreus120: v})) }].map((row, i) => (<div key={i} className="p-6 bg-gray-900/60 border border-white/5 rounded-[2.5rem] flex items-center justify-between"><span className="text-[11px] font-black text-gray-400 uppercase italic">{row.label}</span>{row.hasOwnProperty('val') ? (<input type="number" max="2" min="0" value={row.val} onChange={e => (row as any).set(Number(e.target.value))} className="bg-white/5 w-12 text-center text-white font-black rounded-lg p-1" />) : (<button onClick={() => (row as any).set(!row.check)} className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${row.check ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-white/10'}`}>{row.check && <CheckCircle2 size={14}/>}</button>)}</div>))}</div></div>
          )}

          {activeTab === 'dps' && (
             <div className="space-y-8 animate-in fade-in pb-12"><div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5"><p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projected Effective DPS</p><div className="text-6xl sm:text-7xl md:text-8xl font-black text-white italic tracking-tighter">{calculatedDPS.toLocaleString()}</div><p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Integrated Combat Potency</p></div><div className="grid grid-cols-2 gap-4">{[{ k: 'baseAtk', l: 'Raw ATK' }, { k: 'critChance', l: 'Crit Chance %' }, { k: 'critDmg', l: 'Crit Dmg %' }, { k: 'atkSpeed', l: 'Atk Speed %' }].map(s => (<div key={s.k} className="p-8 bg-gray-900/60 border border-white/5 rounded-[3rem]"><label className="text-10px] font-black text-gray-600 uppercase block mb-2">{s.l}</label><input type="number" value={(calcStats as any)[s.k]} onChange={e => setCalcStats(p => ({...p, [s.k]: Number(e.target.value)}))} className="bg-transparent text-white text-3xl font-black outline-none w-full" /></div>))}</div></div>
          )}

          {activeTab === 'farming' && (
            <div className="space-y-6 pb-24 animate-in fade-in">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900/60 rounded-[2rem] border border-white/5 sticky top-[130px] z-50 backdrop-blur-xl shadow-lg"><SortHeader label="Resource" field="resource" currentSort={farmingSort} /><SortHeader label="Chapter" field="chapter" currentSort={farmingSort} /><SortHeader label="Efficiency" field="efficiency" currentSort={farmingSort} /><SortHeader label="Avg Time" field="avgTime" currentSort={farmingSort} /></div>
              {filteredFarming.length === 0 ? (<div className="text-center py-20 opacity-30"><Compass size={48} className="mx-auto mb-4 animate-spin-slow" /><p className="text-xs font-black uppercase tracking-widest">No routes found</p></div>) : (filteredFarming.map((route) => {
                  const efficiencyColor = route.efficiency === 'SSS' ? 'text-red-500 border-red-500/20 bg-red-500/5' : route.efficiency === 'SS' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5';
                  return (
                    <div key={route.id} className={`bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedFarmingId === route.id ? 'ring-2 ring-orange-500/30 shadow-4xl scale-[1.01]' : 'hover:border-white/20'}`}>
                      <button onClick={() => { setExpandedFarmingId(expandedFarmingId === route.id ? null : route.id); playSfx('click'); }} className="w-full p-6 flex items-center justify-between group relative overflow-hidden"><div className="flex items-center gap-6 text-left relative z-10"><div className={`w-16 h-16 rounded-3xl flex flex-col items-center justify-center font-black border transition-colors ${efficiencyColor}`}><span className="text-[10px] uppercase opacity-60">Eff</span><span className="text-xl leading-none">{route.efficiency}</span></div><div><div className="flex items-center gap-2"><span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${route.difficulty === 'Hero' ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'}`}>{route.difficulty}</span><p className="text-lg font-black text-white uppercase italic tracking-tighter">{route.chapter}</p></div><div className="flex items-center gap-4 mt-1"><p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{route.resource}</p><span className="w-1 h-1 bg-gray-700 rounded-full"></span><p className="text-[9px] font-medium text-gray-500 italic">Est. {route.avgTime}</p></div></div></div><div className="flex items-center gap-3 relative z-10"><div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5"><User size={12} className="text-gray-500" /><span className="text-[9px] font-black text-gray-300 uppercase">{route.bestHero}</span></div><ChevronDown size={20} className={`text-gray-700 transition-transform duration-500 ${expandedFarmingId === route.id ? 'rotate-180 text-orange-500' : ''}`} /></div></button>
                      {expandedFarmingId === route.id && (<div className="p-8 space-y-8 bg-black/40 border-t border-white/5 animate-in slide-in-from-top-4 duration-300"><div className="grid grid-cols-2 sm:grid-cols-4 gap-4"><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Efficiency</p><p className="text-xs font-black text-white italic">{route.efficiency} Rank</p></div><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Loot Projection</p><p className="text-xs font-black text-white italic">{route.lootRate}</p></div><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Avg Duration</p><p className="text-xs font-black text-white italic">{route.avgTime}</p></div><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Tactical Asset</p><p className="text-xs font-black text-white italic">{route.bestHero}</p></div></div><div className="space-y-6"><div className="space-y-2"><h5 className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest"><MapPin size={12}/> Tactical Briefing</h5><p className="text-xs text-gray-300 leading-relaxed italic font-medium bg-black/20 p-4 rounded-2xl border border-white/5">{route.strategy}</p></div><div className="space-y-2"><h5 className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest"><Lightbulb size={12}/> Mentor's Pro-Tip</h5><div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[11px] text-blue-100/80 italic font-bold">{route.proTip}</div></div></div></div>)}
                    </div>
                  );
                }))}
            </div>
          )}

          {activeTab === 'relics' && (
            <div className="space-y-8 animate-in fade-in pb-12">
              <div className="p-10 bg-gradient-to-br from-purple-900/10 via-gray-950 to-purple-950/5 border border-purple-500/20 rounded-[4rem] text-center shadow-4xl">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center justify-center gap-4">
                   <Archive size={32} className="text-purple-500 animate-pulse"/> Relic Archive Protocols
                 </h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] italic">Full Tactical Database Sync: V6.3.0</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredRelics.length === 0 ? (<div className="col-span-full py-20 text-center opacity-30"><Search size={48} className="mx-auto mb-4" /><p className="text-xs font-black uppercase tracking-widest">No matching relics found</p></div>) : (filteredRelics.map((r, index) => {
                    const styles = getRelicStyles(r.tier); const isTopRow = index < 3; 
                    return (
                      <div key={r.id} onClick={() => { setSelectedItem({...r, category: 'Relic'}); playSfx('click'); }} className={`relative p-8 rounded-[2.5rem] border transition-all cursor-pointer group active:scale-95 flex flex-col items-center text-center ${styles.card}`}>
                        <div className={`invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute left-1/2 -translate-x-1/2 w-64 p-5 bg-gray-950/98 backdrop-blur-3xl border rounded-[2rem] shadow-4xl z-[500] pointer-events-none animate-in fade-in ${isTopRow ? 'top-[110%] slide-in-from-top-2' : '-top-4 -translate-y-full slide-in-from-bottom-2'} ${styles.tooltip}`}>
                          {r.lore && (<div className="mb-4"><div className="flex items-center gap-2 mb-1.5 opacity-60"><ScrollText size={10} className="shrink-0" /><span className="text-[8px] font-black uppercase tracking-widest">Archive Intel</span></div><p className="text-[10px] text-gray-300 font-medium italic leading-relaxed text-left">"{r.lore}"</p></div>)}
                          <div className="pt-3 border-t border-white/5 space-y-1">
                            <p className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Meta Benefit:</p>
                            <p className="text-[10px] text-orange-400 font-bold italic leading-tight text-left">{r.effect}</p>
                          </div>
                          <div className="pt-2 border-t border-white/5">
                             <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest text-left">Source: {r.source}</p>
                          </div>
                          <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-950 rotate-45 ${isTopRow ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-r border-b'} ${styles.arrow}`}></div>
                        </div>
                        <div className={`w-16 h-16 rounded-2xl mb-5 flex items-center justify-center border transition-transform group-hover:rotate-12 ${styles.iconContainer}`}><RelicIcon type={r.iconType} className="w-8 h-8" /></div>
                        <p className="text-[11px] font-black text-white uppercase italic tracking-tighter mb-1 leading-tight">{r.name}</p>
                        <div className="flex items-center gap-2 mt-1"><span className={`text-[8px] font-bold uppercase tracking-widest ${r.tier === 'Holy' ? 'text-red-400' : r.tier === 'Radiant' ? 'text-yellow-400' : 'text-blue-400'}`}>{r.tier} Archive</span></div>
                      </div>
                    );
                  }))}
              </div>
            </div>
          )}

          {activeTab === 'jewels' && (
            <div className="space-y-8 animate-in fade-in pb-12">
              <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400"><Binary size={24}/></div>
                     <div><h3 className="text-xl font-black text-white uppercase italic tracking-tight">Jewel Laboratory</h3></div>
                   </div>
                   <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-center"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Slot Total LV</p><p className="text-sm font-black text-blue-400">{jewelSimLevel}</p></div>
                 </div>
                 <input type="range" min="4" max="48" value={jewelSimLevel} onChange={(e) => setJewelSimLevel(parseInt(e.target.value))} className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                 <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest px-1"><span>LV 4</span><span>LV 28</span><span>LV 48</span></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJewels.map(j => (
                  <div key={j.id} onClick={() => { setSelectedItem({...j, category: 'Jewel'}); playSfx('click'); }} className="cursor-pointer group relative">
                    <div className={`p-8 bg-gradient-to-br ${getJewelColorClasses(j.color)} rounded-[3rem] border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 flex flex-col gap-6 h-full`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-black/40 rounded-[1.4rem] border border-white/10 flex items-center justify-center transition-transform duration-500"><Gem size={28} /></div>
                             <div>
                               <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{j.name}</h4>
                               <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Individual Gem</p>
                             </div>
                          </div>
                        </div>
                        <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                           <p className="text-[9px] font-black uppercase text-gray-400 mb-1">LV {Math.min(12, Math.floor(jewelSimLevel / 4))} Projection</p>
                           <p className="text-sm font-black text-white italic">{j.statType} +{Math.round(j.baseStat + (j.statPerLevel * Math.max(0, Math.floor(jewelSimLevel / 4) - 1)))}</p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-gray-900/40 border border-white/10 rounded-[3rem] space-y-8">
                 <h4 className="text-center text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] italic flex items-center justify-center gap-3"><Layers size={18}/> Slot Resonance Table (Sum of 4 Jewels)</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(JEWEL_SLOT_BONUSES).map(([slot, bonuses]) => (
                      <div key={slot} className="p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-4">
                         <p className="text-[11px] font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">{slot} Slot</p>
                         <div className="space-y-2">
                           {bonuses.map((b: SlotBonus) => (
                             <div key={b.level} className={`flex items-center justify-between text-[10px] ${jewelSimLevel >= b.level ? 'text-blue-400 font-black' : 'text-gray-600 font-bold opacity-40'}`}>
                                <span>LV {b.level}</span>
                                <span>{b.effect}</span>
                             </div>
                           ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="space-y-10 animate-in fade-in pb-20"><div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[3rem] text-center"><h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Stutter-Step Reflex Trainer</h4><p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-2 block">Calibrate Weapon Weight</p><div className="grid grid-cols-4 gap-2">{Object.entries(WEAPON_SPEEDS).map(([key]) => (<button key={key} onClick={() => setSelectedWeapon(key)} className={`p-2 rounded-lg text-xs font-bold border transition-all ${selectedWeapon === key ? 'bg-amber-600 border-amber-500 text-white shadow-lg scale-105' : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}>{key}</button>))}</div></div><div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center"><div className={`absolute w-20 h-20 rounded-full border-4 z-10 flex items-center justify-center bg-gray-900 transition-all duration-100 ${efficiency >= 140 ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)] scale-110' : efficiency === 0 && stutterStreak === 0 ? 'border-red-500 opacity-50' : 'border-gray-600'}`}><span className="text-3xl">⚔️</span></div><svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192"><circle cx="96" cy="96" r="82" fill="transparent" stroke="#1f2937" strokeWidth="12" /><circle cx="96" cy="96" r="82" fill="transparent" stroke="#15803d" strokeWidth="12" strokeDasharray="103 515" strokeDashoffset="-309" strokeLinecap="round" className="opacity-40" /><circle cx="96" cy="96" r="82" fill="transparent" stroke={stutterProgress >= 60 && stutterProgress <= 80 ? '#fbbf24' : '#6b7280'} strokeWidth="12" strokeDasharray="515" strokeDashoffset={515 - (515 * stutterProgress) / 100} strokeLinecap="round" className="transition-all duration-75 ease-linear" /></svg>{stutterStreak > 0 && (<div className="absolute -bottom-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-black animate-bounce shadow-lg">{stutterStreak}x COMBO</div>)}</div><div className="flex flex-col items-center gap-8"><button onMouseDown={() => { if (!stutterActive) return; let score = 0; let feedback = "MISS!"; if (stutterProgress >= 60 && stutterProgress <= 80) { const bonus = 20 - (stutterProgress - 60); score = 140 + bonus; feedback = score >= 155 ? "FRAME PERFECT!" : "PERFECT!"; setStutterStreak(s => s + 1); } else if (stutterProgress > 80 && stutterProgress < 100) { score = 100; feedback = "LATE"; setStutterStreak(0); } else { score = 0; feedback = "MISS!"; setStutterStreak(0); } setEfficiency(Math.round(score)); setStutterFeedback(feedback); setStutterProgress(0); playSfx('click'); }} className="w-44 h-44 rounded-full bg-orange-600 border-[10px] border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.3)] flex items-center justify-center text-white font-black text-2xl uppercase italic active:scale-90 transition-all select-none">ATTACK</button><button onClick={() => { setStutterActive(!stutterActive); setStutterFeedback(null); setStutterProgress(0); setEfficiency(0); playSfx('tab'); }} className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border transition-all ${stutterActive ? 'bg-red-600/20 border-red-500/50 text-red-500' : 'bg-green-600/20 border-green-500/50 text-green-500'}`}>{stutterActive ? 'HALT SIMULATION' : 'INITIALIZE NEURAL LINK'}</button></div></div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-[65vh] animate-in fade-in">
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-10">
                {chatHistory.length === 0 && (
                  <div className="p-12 text-center space-y-6">
                    <div className="w-24 h-24 bg-orange-600/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500 animate-pulse"><Bot size={48} /></div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tactical Uplink Established</h3>
                    <p className="text-xs text-gray-400 leading-relaxed italic max-w-sm mx-auto">"I'm your tactical mentor. Ask me anything about gear, boss patterns, or meta evolutions."</p>
                  </div>
                )}
                {chatHistory.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[2.5rem] ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-900 border border-white/5 text-gray-100 rounded-tl-none'}`}>
                      <p className="text-[13px] leading-[1.8] font-medium italic whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="p-6 bg-gray-900/40 rounded-3xl rounded-tl-none border border-white/5 animate-pulse flex items-center gap-4">
                      <Loader2 className="text-orange-500 animate-spin" size={16} />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Synchronizing neural data...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-gray-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center gap-3">
                <input type="text" placeholder="Inquire tactical advice..." className="flex-1 bg-transparent text-sm font-bold text-white outline-none px-4" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} />
                <button onClick={handleAiSend} disabled={isAiLoading || !aiInput.trim()} className="p-4 bg-orange-600 text-white rounded-2xl hover:bg-orange-500 transition-all disabled:opacity-30"><Send size={18}/></button>
              </div>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-gray-950/98 backdrop-blur-3xl border-t border-white/5 p-4 flex flex-col items-center shadow-2xl">
        <div ref={navScrollRef} className="w-full max-w-3xl overflow-x-auto no-scrollbar flex items-center gap-2 px-4 pb-2 touch-pan-x draggable-content" onMouseDown={(e) => handleDragStart(e, navScrollRef)}>{[{ id: 'meta', icon: LayoutGrid, label: 'Archive' }, { id: 'tracker', icon: Target, label: 'Sync' }, { id: 'formula', icon: Variable, label: 'Formula' }, { id: 'dragons', icon: Flame, label: 'Dragons' }, { id: 'refine', icon: Wrench, label: 'Refine' }, { id: 'vs', icon: ArrowRightLeft, label: 'Gear Vs' }, { id: 'analyze', icon: BrainCircuit, label: 'Sim' }, { id: 'lab', icon: Zap, label: 'Lab' }, { id: 'immunity', icon: Shield, label: 'Guard' }, { id: 'farming', icon: Map, label: 'Farming' }, { id: 'dps', icon: Calculator, label: 'Burst' }, { id: 'jewels', icon: Disc, label: 'Jewel' }, { id: 'relics', icon: Box, label: 'Relic Archive' }, { id: 'ai', icon: MessageSquare, label: 'Mentor' }].map(t => (<button key={t.id} onClick={(e) => handleInteractiveClick(e, () => handleTabChange(t.id as any))} className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl transition-all duration-300 transform active:scale-90 relative ${activeTab === t.id ? 'text-orange-500 bg-white/5 ring-1 ring-white/10' : 'text-gray-500'}`}><t.icon size={20} className={activeTab === t.id ? 'animate-pulse' : ''} /><span className="text-[8px] font-black uppercase tracking-tight">{t.label}</span></button>))}</div>
      </nav>

      {compareHeroIds.length > 0 && activeTab === 'meta' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] w-full max-w-[440px] px-6 animate-in zoom-in duration-300 pointer-events-none">
          <div className="relative p-1 overflow-hidden rounded-[2.5rem] pointer-events-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-white to-blue-500 animate-[shimmer_3s_infinite] opacity-40"></div>
            <div className="relative bg-gray-950/95 backdrop-blur-3xl rounded-[2.3rem] p-4 flex items-center justify-between shadow-[0_0_80px_rgba(59,130,246,0.3)] ring-1 ring-white/20">
              <div className="flex items-center gap-4 px-2">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur animate-pulse"></div>
                  <div className="relative w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <Scale size={28} />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none flex items-center gap-2">
                    Protocol <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5 tracking-widest">{compareHeroIds.length} / 3 Heroes Locked</p>
                  <p className="text-[8px] font-black text-blue-500 uppercase mt-1 tracking-tighter opacity-70">Status: ARCHIVE LINK ACTIVE</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setCompareHeroIds([]); playSfx('click'); }} className="p-3 text-gray-500 hover:text-red-500 transition-colors group">
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <button 
                  onClick={() => { setIsCompareModalOpen(true); playSfx('click'); }} 
                  disabled={compareHeroIds.length < 2} 
                  className="bg-orange-600 hover:bg-orange-500 disabled:opacity-30 text-white px-10 py-4 rounded-2xl text-[14px] font-black uppercase tracking-[0.1em] italic transition-all shadow-[0_0_25px_rgba(249,115,22,0.4)] active:scale-95 active:shadow-inner border-b-4 border-orange-800"
                >
                  LAUNCH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsCompareModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-[#030712] border border-white/10 rounded-[3.5rem] p-8 md:p-12 max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 shadow-4xl overflow-x-hidden ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-500"><Combat size={28} /></div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Tactical Head-to-Head</h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Archive Delta Analysis Protocol</p>
                </div>
              </div>
              <button onClick={() => setIsCompareModalOpen(false)} className="p-4 bg-white/5 rounded-full border border-white/10 text-gray-400 hover:text-white transition-all"><X size={24}/></button>
            </div>

            {comparedHeroes.length === 2 && comparisonVerdict && (
              <div className="mb-12 p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none"><ScanIcon size={120} /></div>
                <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
                  <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">Neural Link Verdict</h4>
                  <p className="text-xl font-black text-white italic leading-tight">"{comparisonVerdict.verdict}"</p>
                  <p className="text-[13px] text-gray-400 font-medium italic">Choosing between these legends depends on your chapter push style.</p>
                </div>
                <div className="w-px h-24 bg-white/10 hidden md:block" />
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Alpha Unit</p>
                    <div className="w-12 h-12 bg-gray-900 rounded-xl border border-white/10 flex items-center justify-center text-xl">1</div>
                  </div>
                  <div className="text-2xl font-black text-blue-500 italic">VS</div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Beta Unit</p>
                    <div className="w-12 h-12 bg-gray-900 rounded-xl border border-white/10 flex items-center justify-center text-xl">2</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-[140px_1fr_1fr] md:grid-cols-[180px_1fr_1fr] gap-4 md:gap-8 items-stretch">
              <div className="space-y-6 pt-32">
                {['Meta Tier', 'Global L120', 'Cost', 'Combat Style', 'Evo 4★ Perk'].map(label => (
                  <div key={label} className="h-28 flex items-center px-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {comparedHeroes.map((hero, idx) => {
                const isTierWinner = comparisonVerdict?.tierWinner === idx;
                const isBonusWinner = comparisonVerdict?.bonusWinner === idx;

                return (
                  <div key={hero.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`p-6 rounded-3xl text-center flex flex-col items-center gap-4 relative border transition-all ${idx === 0 ? 'bg-orange-600/5 border-orange-500/20' : 'bg-blue-600/5 border-blue-500/20'}`}>
                      <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-4xl shadow-inner">🦸</div>
                      <h3 className="text-xl md:text-2xl font-black text-white uppercase italic truncate w-full tracking-tighter">{hero.name}</h3>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 rounded-full border border-white/10 text-[8px] font-black text-gray-400 uppercase tracking-widest">UNIT 0{idx + 1}</div>
                    </div>

                    {/* Tier Cell */}
                    <div className={`h-28 p-6 bg-black/40 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${isTierWinner ? 'border-yellow-500/40 ring-1 ring-yellow-500/20 shadow-lg' : 'border-white/5'}`}>
                      <Badge tier={hero.tier} />
                      {isTierWinner && <div className="flex items-center gap-1 text-yellow-500 text-[9px] font-black uppercase tracking-tighter"><Crown size={10} /> Dominant</div>}
                    </div>

                    {/* Global Bonus Cell */}
                    <div className={`h-28 p-6 bg-black/40 border rounded-2xl flex flex-col items-center justify-center text-center transition-all ${isBonusWinner ? 'border-green-500/40 ring-1 ring-green-500/20' : 'border-white/5'}`}>
                      <p className="text-sm md:text-base font-black text-orange-500 italic uppercase">{hero.globalBonus120}</p>
                      {isBonusWinner && <div className="mt-1 flex items-center gap-1 text-green-500 text-[9px] font-black uppercase tracking-tighter"><TrendingUp size={10} /> Offensive Edge</div>}
                    </div>

                    {/* Shard Cost Cell */}
                    <div className="h-28 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center">
                      <p className="text-[11px] font-bold text-purple-400 uppercase italic leading-tight">{hero.shardCost || "Event Exclusive"}</p>
                    </div>

                    {/* Unique Effect Cell */}
                    <div className="h-28 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center overflow-y-auto no-scrollbar">
                      <p className="text-[10px] md:text-[11px] font-medium text-blue-400 italic leading-snug">{hero.uniqueEffect || "Standard Build"}</p>
                    </div>

                    {/* Evo 4 Star Cell */}
                    <div className="h-28 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center overflow-y-auto no-scrollbar">
                      <p className="text-[10px] md:text-[11px] font-medium text-yellow-500/80 italic leading-snug">{hero.evo4Star || "Passive Only"}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-14 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">Alpha & Beta units isolated for architectural delta analysis.</p>
              <p className="text-[8px] font-bold text-gray-700 uppercase">Archive Link Status: Stable</p>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-3xl bg-[#030712] border border-white/10 rounded-[3.5rem] p-8 sm:p-14 max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 shadow-4xl ring-1 ring-white/5">
            <button onClick={() => setSelectedItem(null)} className="absolute top-10 right-10 p-5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-transform active:scale-90 z-20">
              <X size={32}/>
            </button>
            
            <div className="space-y-12 pb-10">
              {/* Header */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tier={selectedItem.tier} />
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-600/5 px-3 py-1 rounded-lg border border-orange-500/10">
                    {selectedItem.category} Protocols
                  </span>
                </div>
                <h2 className="text-5xl sm:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {selectedItem.name}
                </h2>
                <p className="text-[15px] text-gray-400 font-medium italic opacity-90 leading-relaxed max-w-lg">
                  {selectedItem.desc}
                </p>
              </div>

              {/* Hero Specific Layout */}
              {selectedItem.category === 'Hero' ? (
                <div className="space-y-10">
                  {/* Bio & Acquisition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-gray-950 border border-white/10 rounded-[2.5rem] shadow-inner space-y-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-[0.2em]">
                        <BookOpen size={14}/> Tactical Bio
                      </h4>
                      <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5">
                        <p className="text-[13px] text-gray-300 font-medium italic leading-[1.7]">
                          {selectedItem.bio || "No historical data available for this unit."}
                        </p>
                      </div>
                    </div>
                    <div className="p-8 bg-gray-950 border border-white/10 rounded-[2.5rem] shadow-inner space-y-6">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-[0.3em]">
                        <Tag size={14}/> Acquisition Info
                      </h4>
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Unlocking Threshold</p>
                          <p className="text-sm font-black text-purple-400 uppercase italic leading-tight">{selectedItem.shardCost || "Limited Event"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Aesthetic Peak</p>
                          <p className="text-sm font-black text-yellow-500 uppercase italic leading-tight">{selectedItem.bestSkin || "Standard Issue"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Neural Link L120 Payload</p>
                          <p className="text-sm font-black text-orange-500 uppercase italic leading-tight">{selectedItem.globalBonus120}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deep Logic / Evo */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-10 bg-blue-600/5 border border-blue-500/20 rounded-[3.5rem] shadow-inner relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity"><BrainCircuit size={140} /></div>
                      <h4 className="text-[11px] font-black text-blue-500 uppercase mb-8 flex items-center gap-3 tracking-[0.4em] relative z-10">
                        <Scan size={24}/> NEURAL SYNTHESIS (META STRATEGY)
                      </h4>
                      <div className="text-[15px] text-gray-200 font-medium leading-[2] italic whitespace-pre-wrap relative z-10 bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                        {selectedItem.deepLogic}
                      </div>
                    </div>
                  </div>

                  {/* Evolution Milestones Grid (Stars & Sun) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Evolution Milestones Section (Stars) */}
                    {selectedItem.starMilestones && selectedItem.starMilestones.length > 0 && (
                      <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-3 px-4">
                          <StarIcon size={20} className="text-yellow-500"/> EVOLUTION PATHWAY
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedItem.starMilestones.map((milestone: StarMilestone, mIdx: number) => (
                            <div key={mIdx} className={`p-6 bg-gray-950 border rounded-3xl flex items-center gap-6 relative transition-all hover:bg-white/5 ${milestone.stars >= 7 ? 'border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : 'border-white/5'}`}>
                              <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-black/60 rounded-2xl border border-white/10 shadow-inner">
                                <span className="text-[10px] font-black text-gray-500 uppercase leading-none">Star</span>
                                <span className="text-2xl font-black text-white italic leading-none mt-1">{milestone.stars}</span>
                              </div>
                              <div className="flex-1 space-y-1">
                                {milestone.isGlobal && (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/30 mb-1">
                                    <Globe size={10} /> Global Bonus
                                  </span>
                                )}
                                <p className={`text-[13px] font-bold italic leading-relaxed ${milestone.stars >= 7 ? 'text-yellow-400' : 'text-gray-200'}`}>
                                  "{milestone.effect}"
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sun Evolution Section */}
                    {selectedItem.sunMilestones && selectedItem.sunMilestones.length > 0 && (
                      <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-3 px-4">
                          <Sun size={20} className="text-orange-500 animate-pulse"/> SUN EVOLUTION DETAILS
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedItem.sunMilestones.map((milestone: SunMilestone, mIdx: number) => (
                            <div key={mIdx} className="p-6 bg-orange-950/5 border border-orange-500/10 rounded-3xl flex items-center gap-6 relative transition-all hover:bg-orange-600/10">
                              <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-orange-600/20 rounded-2xl border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                                <span className="text-[10px] font-black text-orange-700 uppercase leading-none">Sun</span>
                                <span className="text-2xl font-black text-orange-500 italic leading-none mt-1">{milestone.level}</span>
                              </div>
                              <div className="flex-1 space-y-1">
                                {milestone.isGlobal && (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-600/20 text-orange-400 text-[8px] font-black uppercase rounded border border-orange-500/30 mb-1">
                                    <Globe size={10} /> Solar Global
                                  </span>
                                )}
                                <p className="text-[13px] font-bold italic leading-relaxed text-gray-200">
                                  "{milestone.effect}"
                                </p>
                              </div>
                              <div className="absolute top-2 right-4 text-[8px] font-black text-orange-500 uppercase tracking-widest opacity-40 italic">
                                Radiant Protocols
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Synergy: Assists & Pairs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-gray-950 border border-white/10 rounded-[2.5rem] shadow-inner">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase mb-6 flex items-center gap-2 tracking-[0.2em]">
                        <UserPlus size={14}/> Assist Heroes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.assistHeroes?.map((heroId: string) => {
                          const h = HERO_DATA.find(x => x.id.toLowerCase() === heroId.toLowerCase() || x.name === heroId);
                          return (
                            <button key={heroId} onClick={() => h && setSelectedItem(h)} className="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-gray-300 uppercase italic hover:border-blue-500/50 hover:text-white transition-all shadow-sm">
                              {h?.name || heroId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="p-8 bg-gray-950 border border-white/10 rounded-[2.5rem] shadow-inner">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase mb-6 flex items-center gap-2 tracking-[0.2em]">
                        <HeartHandshake size={14}/> Best Gear Pairs
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.bestPairs?.map((pairId: string) => {
                          const item = findItemByName(pairId);
                          return (
                            <button key={pairId} onClick={() => item && setSelectedItem(item)} className="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-orange-500 uppercase italic hover:border-orange-500/50 hover:text-white transition-all shadow-sm">
                              {item?.name || pairId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Signature Loadouts */}
                  {selectedItem.gearSets && selectedItem.gearSets.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-3 px-4">
                        <Award size={20}/> SIGNATURE META LOADOUT
                      </h4>
                      {selectedItem.gearSets.map((set: GearSet, sIdx: number) => (
                        <div key={sIdx} className="p-10 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-[4rem] shadow-4xl space-y-10">
                          <div className="flex items-center justify-between">
                            <h5 className="text-2xl font-black text-white italic uppercase tracking-tighter">{set.name}</h5>
                            <button onClick={() => handleExportBuild(selectedItem.name, set)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-blue-400 border border-white/5">
                              <Download size={22}/>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                            <BuildSlot label="Weapon" name={set.weapon} icon={Sword} />
                            <BuildSlot label="Armor" name={set.armor} icon={Shield} />
                            <BuildSlot label="Bracelet" name={set.bracelet} icon={Zap} />
                            <BuildSlot label="Locket" name={set.locket} icon={Target} />
                            <BuildSlot label="Book" name={set.book} icon={Book} />
                            <BuildSlot label="Rings" name={set.rings[0]} icon={Circle} />
                          </div>

                          <div className="p-8 bg-orange-600/5 border border-orange-500/20 rounded-[2.5rem]">
                            <p className="text-[10px] font-black text-orange-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                              <Sparkles size={14}/> Synergy Protocol
                            </p>
                            <p className="text-[14px] text-gray-200 italic leading-[1.8] font-medium">{set.synergy}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Non-Hero Detail Layout */
                <div className="grid grid-cols-1 gap-10">
                  <div className="space-y-4">
                    {selectedItem.deepLogic && (
                      <div className="p-10 bg-gray-950 border border-white/10 rounded-[3rem] shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><BrainCircuit size={100} /></div>
                        <h4 className="text-[11px] font-black text-orange-500 uppercase mb-5 flex items-center gap-3 tracking-[0.3em] relative z-10"><ScrollText size={22}/> Deep Logic Summary</h4>
                        <div className="text-[15px] text-gray-100 font-medium leading-[1.8] italic whitespace-pre-wrap relative z-10 bg-black/40 p-8 rounded-[2rem] border border-white/5">{selectedItem.deepLogic}</div>
                      </div>
                    )}
                  </div>
                  {selectedItem.category === 'Totem' && (
                    <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[2.5rem]"><p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Totem Power</p><p className="text-2xl font-black text-white italic">{selectedItem.desc}</p></div>
                  )}
                  {selectedItem.category === 'Relic' && (
                    <div className="space-y-8">
                      <div className="p-8 bg-gray-900/40 rounded-[2.5rem] border border-white/5 space-y-3">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><ScrollText size={16} /> Relic Description</h4>
                        <p className="text-[14px] text-gray-100 font-medium leading-relaxed italic bg-black/20 p-6 rounded-2xl border border-white/5">{selectedItem.lore}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5"><p className="text-[10px] font-black text-gray-500 uppercase mb-1">Archive Source</p><p className="text-sm font-black text-white uppercase italic">{selectedItem.source || "General Archive"}</p></div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5"><p className="text-[10px] font-black text-gray-500 uppercase mb-1">Primary Perk</p><p className="text-sm font-black text-orange-500 uppercase italic">{selectedItem.effect}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-14 pt-10 border-t border-white/5 flex items-center justify-between opacity-30">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-orange-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">System Signature: v6.3.0_ZVA</span>
              </div>
              <p className="text-[8px] font-bold text-gray-700">© 2025 ZA ARMORY CORE</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
