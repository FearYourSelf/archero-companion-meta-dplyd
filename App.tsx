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
  ChevronUp, ArrowDownWideNarrow, Check, Atom, RotateCcw, Scale, Milestone, Code, History as HistoryIcon
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, JEWEL_RESONANCE_DATA, SET_BONUS_DESCRIPTIONS, FARMING_ROUTES, DRAGON_DATA, FarmingRoute, REFINE_TIPS
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic, GearSet, LogEntry, SlotResonance } from './types';
import { Badge, Card } from './components/UI';

// --- WEAPON PHYSICS DATA ---
const WEAPON_SPEEDS: Record<string, { name: string; speed: number; label: string }> = {
  'Fist': { name: 'Expedition Fist', speed: 3.5, label: 'FAST (3.5x)' },
  'Scythe': { name: 'Death Scythe', speed: 1.2, label: 'HEAVY (1.2x)' },
  'Blade': { name: 'Demon Blade', speed: 2.0, label: 'NORMAL (2.0x)' },
  'Saw': { name: 'Saw Blade', speed: 4.5, label: 'EXTREME (4.5x)' },
};

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
    case 'Flame': return <Flame className={className} />;
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

  const [unlockedHeroes, setUnlockedHeroes] = useState<Record<string, { lv120: boolean }>>(() => JSON.parse(localStorage.getItem('archero_v6_tracker') || '{}'));
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

  useEffect(() => {
    const addLog = (type: LogEntry['type'], ...args: any[]) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        message,
        timestamp: Date.now()
      };
      logsRef.current = [newEntry, ...logsRef.current].slice(0, 100);
      setLogs([...logsRef.current]);
    };

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => { originalLog(...args); addLog('info', ...args); };
    console.warn = (...args) => { originalWarn(...args); addLog('warn', ...args); };
    console.error = (...args) => { originalError(...args); addLog('error', ...args); };

    window.onerror = (message, source, lineno, colno, error) => {
      addLog('error', `Global Error: ${message} at ${source}:${lineno}:${colno}`);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "'") {
        setIsConsoleVisible(prev => !prev);
        if (!isConsoleVisible) playSfx('msg');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    addLog('system', 'Neural Uplink Stable. Press CTRL + \' for Tactical Debugger.');

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (uiToast) {
      const timer = setTimeout(() => setUiToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [uiToast]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setUiToast({ message, type });
    playSfx(type === 'error' ? 'error' : 'msg');
  };

  useEffect(() => {
    let interval: number;
    if (stutterActive) {
      interval = window.setInterval(() => {
        setStutterProgress(prev => {
          const speed = WEAPON_SPEEDS[selectedWeapon].speed;
          if (prev >= 100) {
            setStutterStreak(0);
            setStutterFeedback("MISS!");
            setEfficiency(0);
            return 0;
          }
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
  const [farmingSort, setFarmingSort] = useState<{ field: 'resource' | 'chapter' | 'efficiency' | 'avgTime', direction: 'asc' | 'desc' }>({ 
    field: 'efficiency', 
    direction: 'desc' 
  });
  const [expandedFarmingId, setExpandedFarmingId] = useState<string | null>(null);
  const [jewelSimLevel, setJewelSimLevel] = useState<number>(33);
  const [jewelFilterSlot, setJewelFilterSlot] = useState<string>('All');

  const relicSources = useMemo(() => {
    const sources = RELIC_DATA.map(r => r.source).filter(Boolean) as string[];
    const sortedUnique = Array.from(new Set(sources)).sort((a, b) => a.localeCompare(b));
    return ['All', ...sortedUnique];
  }, []);

  const scrollContainerRef = useRef<HTMLElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const farmFilterScrollRef = useRef<HTMLDivElement>(null);
  const relicTierFilterScrollRef = useRef<HTMLDivElement>(null);
  const relicSourceFilterScrollRef = useRef<HTMLDivElement>(null);
  const jewelFilterScrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ 
    isDragging: false, 
    moved: false, 
    startX: 0, 
    scrollLeft: 0, 
    targetRef: null as React.RefObject<HTMLElement | null> | null 
  });

  const playSfx = (type: 'click' | 'hover' | 'tab' | 'msg' | 'error') => {
    if (soundEnabled) {
      SFX.init();
      SFX.play(type);
    }
  };

  const handleDragStart = (e: React.MouseEvent, ref: React.RefObject<HTMLElement | null>) => {
    if (!ref.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, select, textarea, a')) return;
    
    ref.current.style.scrollBehavior = 'auto';
    dragRef.current = { 
      isDragging: true, 
      moved: false, 
      startX: e.pageX, 
      scrollLeft: ref.current.scrollLeft, 
      targetRef: ref 
    };
  };

  useLayoutEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d.isDragging || !d.targetRef?.current) return;
      
      const ref = d.targetRef.current;
      const dx = (e.pageX - d.startX) * 1.5;
      if (Math.abs(dx) > 3) {
        d.moved = true;
        ref.scrollLeft = d.scrollLeft - dx;
      }
    };

    const handleGlobalMouseUp = () => {
      const d = dragRef.current;
      if (d.isDragging) {
        if (d.targetRef?.current) {
          d.targetRef.current.style.scrollBehavior = 'smooth';
        }
        d.isDragging = false;
      }
    };

    const bars = [
      navScrollRef.current, 
      categoryScrollRef.current, 
      farmFilterScrollRef.current, 
      relicTierFilterScrollRef.current, 
      relicSourceFilterScrollRef.current,
      jewelFilterScrollRef.current
    ];
    const wheelListeners: {el: HTMLElement, fn: (e: WheelEvent) => void}[] = [];

    bars.forEach(bar => {
      if (!bar) return;
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
          e.preventDefault();
          bar.style.scrollBehavior = 'smooth';
          const scrollAmt = e.deltaY !== 0 ? e.deltaY : e.deltaX;
          bar.scrollBy({ left: scrollAmt * 4.5, behavior: 'smooth' });
        }
      };
      bar.addEventListener('wheel', onWheel, { passive: false });
      wheelListeners.push({ el: bar, fn: onWheel });
    });

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      wheelListeners.forEach(({el, fn}) => el.removeEventListener('wheel', fn));
    };
  }, [activeTab]);

  useEffect(() => { localStorage.setItem('archero_v6_tracker', JSON.stringify(unlockedHeroes)); }, [unlockedHeroes]);
  useEffect(() => { localStorage.setItem('archero_v6_equipped', JSON.stringify(Array.from(equippedItems))); }, [equippedItems]);
  useEffect(() => { localStorage.setItem('archero_v6_favorites', JSON.stringify(Array.from(favoriteHeroes))); }, [favoriteHeroes]);
  useEffect(() => { localStorage.setItem('archero_v6_chat', JSON.stringify(chatHistory)); }, [chatHistory]);
  useEffect(() => { localStorage.setItem('archero_v6_stats', JSON.stringify(calcStats)); }, [calcStats]);

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

  const toggleEquip = (id: string) => {
    playSfx('click');
    setEquippedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFavorite = (id: string) => {
    playSfx('click');
    setFavoriteHeroes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formulaResult = useMemo(() => {
    const { baseAtk, atkPercent, weaponDmgPercent, critDmg } = fInputs;
    return Math.round(baseAtk * (1 + atkPercent/100) * (1 + weaponDmgPercent/100) * (critDmg/100));
  }, [fInputs]);

  const calculatedDPS = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    return Math.round(baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + (atkSpeed / 100)));
  }, [calcStats]);

  const totalImmunity = useMemo(() => {
    return (immunitySetup.rings * 13.8) + (immunitySetup.atreus120 ? 7 : 0) + (immunitySetup.onir120 ? 10 : 0) + (immunitySetup.locket ? 15 : 0) + (immunitySetup.necrogon ? 7.5 : 0);
  }, [immunitySetup]);

  const dragonSynergy = useMemo(() => {
    const selected = [
      DRAGON_DATA.find(d => d.id === dragons.slot1),
      DRAGON_DATA.find(d => d.id === dragons.slot2),
      DRAGON_DATA.find(d => d.id === dragons.slot3)
    ];
    const uniqueTypes = new Set(selected.map(s => (s as BaseItem)?.dragonType).filter(Boolean));
    return uniqueTypes.size === 3;
  }, [dragons]);

  const handleEquipDragon = (slot: 'slot1' | 'slot2' | 'slot3', dragonId: string) => {
    setDragons(prev => {
      const next = { ...prev };
      if (slot !== 'slot1' && prev.slot1 === dragonId) next.slot1 = '';
      if (slot !== 'slot2' && prev.slot2 === dragonId) next.slot2 = '';
      if (slot !== 'slot3' && prev.slot3 === dragonId) next.slot3 = '';
      next[slot] = dragonId;
      return next;
    });
    playSfx('click');
  };

  const smeltEssenceYield = useMemo(() => {
    const baseline: Record<string, number> = { 'Epic': 50, 'PE': 150, 'Legendary': 500, 'AL': 1200, 'Mythic': 3500 };
    return (baseline[smeltItem] || 0) * smeltQty;
  }, [smeltItem, smeltQty]);

  const filteredFarming = useMemo(() => {
    const efficiencyWeight = { 'SSS': 4, 'SS': 3, 'S': 2, 'A': 1, 'B': 0 };
    const filtered = FARMING_ROUTES.filter(route => {
      const matchesSearch = fuzzyMatch(route.resource + route.chapter, farmingSearch);
      const matchesCategory = farmingCategory === 'All' || route.resource === farmingCategory;
      return matchesSearch && matchesCategory;
    });
    return [...filtered].sort((a, b) => {
      let valA: any = a[farmingSort.field];
      let valB: any = b[farmingSort.field];
      if (farmingSort.field === 'efficiency') {
        valA = (efficiencyWeight as any)[a.efficiency] || 0;
        valB = (efficiencyWeight as any)[b.efficiency] || 0;
      } else if (farmingSort.field === 'avgTime') {
        valA = parseFloat(a.avgTime) || 0;
        valB = parseFloat(b.avgTime) || 0;
      }
      if (valA < valB) return farmingSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return farmingSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [farmingSearch, farmingCategory, farmingSort]);

  const toggleFarmingSort = (field: typeof farmingSort.field) => {
    playSfx('click');
    setFarmingSort(prev => ({
      field,
      direction: prev.field === field ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'desc'
    }));
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    playSfx('msg');
    const msg = aiInput; setAiInput('');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, timestamp: Date.now() }]);
    setIsAiLoading(true);
    try {
      const response = await chatWithAI(msg, chatHistory.map(h => ({ role: h.role, text: h.text })));
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'Mentor offline.', timestamp: Date.now() }]);
    } catch (e: any) {
      console.error("Gemini API Uplink Failure", e);
      const errorMsg = e.message === "RATE_LIMIT_EXCEEDED" 
        ? "Rate limit hit. Free tier allows 15 requests per minute. Please wait a moment."
        : "Neural uplink interrupted. Please check your signal.";
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: errorMsg, timestamp: Date.now() }]);
      showToast(errorMsg, 'error');
    } finally { setIsAiLoading(false); }
  };

  const runSimulation = async () => {
    playSfx('click');
    setIsSimMenuOpen(false);
    setIsSimulating(true); 
    setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Advanced synthesis for ${hero?.name} at ${calcStats.baseAtk} Atk. Structure with headers and bold gear. Focus on synergy. 10-15s max. Include BEST build: Weapon, Armor, Rings, Bracelet, Locket, Book.`;
    try {
      const response = await chatWithAI(prompt, []);
      setSimResult(response || 'Simulation timeout.');
    } catch (e: any) { 
      console.error("Simulation Synth Error", e);
      const errorMsg = e.message === "RATE_LIMIT_EXCEEDED"
        ? "Neural Core is busy (Rate Limit). Try again in 60s."
        : "Simulation data corrupt. Resetting uplink...";
      showToast(errorMsg, 'error');
      setSimResult(errorMsg); 
    }
    finally { setIsSimulating(false); }
  };

  const copySimResult = () => {
    if (simResult) {
      navigator.clipboard.writeText(simResult);
      playSfx('click');
      setIsSimMenuOpen(false);
      showToast('Build Report copied to tactical clipboard.', 'success');
    }
  };

  const exportSimResult = () => {
    if (simResult) {
      const element = document.createElement("a");
      const file = new Blob([simResult], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Archero_Synthesis_${buildHero}_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      playSfx('click');
      setIsSimMenuOpen(false);
      showToast('Tactical Report exported as .txt', 'success');
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    playSfx('tab');
    setActiveTab(tab);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setSssOnly(false);
    playSfx('click');
  };

  const handleExportBuild = (heroName: string, set: GearSet) => {
    playSfx('click');
    const text = `
ARCHERO TACTICAL BUILD: ${set.name}
Hero: ${heroName}
--- CORE LOADOUT ---
Weapon: ${set.weapon}
Armor: ${set.armor}
Rings: ${set.rings.join(' + ')}
Bracelet: ${set.bracelet}
Locket: ${set.locket}
Book: ${set.book}
--- SYNERGY RESONANCE ---
${set.synergy}
--- Generated via ZA GRANDMASTER ---
    `.trim();
    navigator.clipboard.writeText(text);
    showToast(`${set.name} exported to clipboard.`, 'success');
  };

  const findItemByName = (name: string) => {
    return [...GEAR_DATA, ...DRAGON_DATA].find(i => i.name === name || i.id === name);
  }

  const displayOrder: GearCategory[] = ['Hero', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book', 'Spirit', 'Dragon', 'Pet', 'Relic', 'Jewel', 'Totem', 'Pet Farm Eggs', 'Glyph'];
  const categoryIcons: Record<string, any> = { 'All': LayoutGrid, 'Hero': User, 'Weapon': Sword, 'Armor': Shield, 'Ring': Circle, 'Locket': Target, 'Bracelet': Zap, 'Book': Book, 'Spirit': Ghost, 'Dragon': Flame, 'Pet': Dog, 'Pet Farm Eggs': Egg, 'Totem': Tower, 'Relic': Box, 'Jewel': Disc, 'Glyph': Layers };
  const categoryEmojis: Record<string, string> = { 'Hero': '🦸', 'Weapon': '⚔️', 'Armor': '🛡️', 'Ring': '💍', 'Bracelet': '⚡', 'Locket': '🎯', 'Book': '📖', 'Spirit': '👻', 'Dragon': '🐉', 'Pet': '🐾', 'Relic': '🏺', 'Jewel': '💎', 'Totem': '🏛️', 'Pet Farm Eggs': '🥚', 'Glyph': '➰' };

  const filteredJewels = useMemo(() => JEWEL_DATA.filter(j => jewelFilterSlot === 'All' || j.slots.includes(jewelFilterSlot)), [jewelFilterSlot]);
  
  const filteredRelics = useMemo(() => {
    return RELIC_DATA.filter(r => {
      const matchesTier = relicTierFilter === 'All' || r.tier === relicTierFilter;
      const matchesSource = relicSourceFilter === 'All' || r.source === relicSourceFilter;
      const matchesSearch = fuzzyMatch(r.name, searchQuery);
      return matchesSearch && (categoryFilter === 'All' || categoryFilter === 'Relic') && (!sssOnly);
    });
  }, [relicTierFilter, relicSourceFilter, searchQuery, categoryFilter, sssOnly]);

  const filteredData = useMemo(() => {
    const adaptedJewels = JEWEL_DATA.map(j => ({ ...j, category: 'Jewel' as GearCategory, tier: 'S' as Tier, desc: j.lore || j.statType }));
    const adaptedRelics = RELIC_DATA.map(r => {
      // Map Relic tiers to UI Badge tiers
      let tier: Tier = 'B';
      if (r.tier === 'Holy') tier = 'SSS';
      if (r.tier === 'Radiant') tier = 'S';
      return { ...r, category: 'Relic' as GearCategory, tier, desc: r.effect };
    });
    return [...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA, ...adaptedJewels, ...adaptedRelics].filter(item => {
      const matchesSearch = fuzzyMatch(item.name, searchQuery);
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
      case 'Teal': return 'from-cyan-600/40 via-cyan-950/20 text-cyan-500 border-cyan-500/30';
      default: return 'from-gray-600/40 via-gray-950/20 border-white/10 text-gray-500';
    }
  };

  const getRelicStyles = (tier: string) => {
    switch (tier) {
      case 'Holy': return { card: 'bg-red-600/5 border-red-500/20 hover:border-red-500/40', iconContainer: 'bg-red-600/20 border-red-500/30 text-red-500', tooltip: 'border-red-500/30 text-red-400', statColor: 'text-red-400' };
      case 'Radiant': return { card: 'bg-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40', iconContainer: 'bg-yellow-600/20 border-yellow-500/30 text-yellow-500', tooltip: 'border-yellow-500/30 text-yellow-400', statColor: 'text-yellow-400' };
      default: return { card: 'bg-blue-600/5 border-blue-500/20 hover:border-blue-500/40', iconContainer: 'bg-blue-600/20 border-blue-500/30 text-blue-500', tooltip: 'border-blue-500/30 text-blue-400', statColor: 'text-blue-400' };
    }
  };

  const handleInteractiveClick = (e: React.MouseEvent, action: () => void) => {
    if (dragRef.current.moved) return;
    action();
  };

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

  const handleHeroCompareToggle = (id: string) => {
    playSfx('click');
    setCompareHeroIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const comparedHeroes = useMemo(() => HERO_DATA.filter(h => compareHeroIds.includes(h.id)), [compareHeroIds]);

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

      {maintenanceToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-in fade-in zoom-in duration-300 pointer-events-none text-center">
          <div className="px-12 py-8 bg-gray-950/95 border-2 border-orange-500/60 rounded-[3rem] shadow-4xl flex flex-col items-center gap-4">
             <AlertTriangle className="text-orange-500 animate-pulse" size={32} />
             <p className="text-xl font-black text-white italic uppercase tracking-tighter">Under Maintenance</p>
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
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between opacity-30"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Terminal Shortcut: CTRL + ' to Exit</p><p className="text-[8px] font-bold text-gray-700">© 2025 ZA ARMORY CORE DEBUGGER</p></div>
        </div>
      )}

      <header className="bg-gray-950/95 backdrop-blur-3xl border-b border-white/5 p-5 shrink-0 z-[100]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-orange-500 w-8 h-8" />
            <div><h1 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none">ZA GRANDMASTER</h1><p className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase mt-1">ZA Armory Clan Strategic Companion</p></div>
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
                  <div className="relative group flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="text" placeholder={`Search ${activeTab === 'meta' ? 'archives' : 'relics'}...`} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                  {activeTab === 'meta' && (<div className="flex items-center gap-2"><button onClick={() => { setSssOnly(!sssOnly); playSfx('click'); }} className={`p-3 rounded-2xl border transition-all ${sssOnly ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`} title="SSS Tier Only"><Crown size={18} /></button><button onClick={handleResetFilters} className="p-3 bg-white/5 border border-white/10 text-gray-500 rounded-2xl hover:text-orange-500 transition-all" title="Reset Filters"><RotateCcw size={18} /></button></div>)}
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
                <div className="space-y-4"><div className="relative group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} /><input type="text" placeholder="Search chapters or resources..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-[10px] font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" value={farmingSearch} onChange={(e) => setFarmingSearch(e.target.value)} /></div><div ref={farmFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, farmFilterScrollRef)}>{['All', 'Gear', 'Gold', 'Shards', 'Jewels', 'Runes', 'Exp'].map(cat => (<button key={cat} onClick={(e) => handleInteractiveClick(e, () => { setFarmingCategory(cat as any); playSfx('click'); })} className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${farmingCategory === cat ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{cat}</button>))}</div></div>
             )}
             {activeTab === 'relics' && (
                <div className="space-y-3"><div ref={relicTierFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, relicTierFilterScrollRef)}>{['All', 'Holy', 'Radiant', 'Faint'].map(t => (<button key={t} onClick={(e) => handleInteractiveClick(e, () => { setRelicTierFilter(t as any); playSfx('click'); })} className={`flex-shrink-0 px-8 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${relicTierFilter === t ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{t} Archive</button>))}</div><div ref={relicSourceFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content border-t border-white/5 pt-2" onMouseDown={(e) => handleDragStart(e, relicSourceFilterScrollRef)}><div className="flex-shrink-0 px-3 flex items-center"><MapPin size={10} className="text-gray-600" /></div>{relicSources.map(src => (<button key={src} onClick={(e) => handleInteractiveClick(e, () => { setRelicSourceFilter(src); playSfx('click'); })} className={`flex-shrink-0 px-5 py-2 rounded-xl text-[8px] font-black uppercase transition-all border whitespace-nowrap ${relicSourceFilter === src ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-400'}`}>{src}</button>))}</div></div>
             )}
             {activeTab === 'jewels' && (
                <div ref={jewelFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, jewelFilterScrollRef)}>{['All', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Spellbook'].map(slot => (<button key={slot} onClick={(e) => handleInteractiveClick(e, () => { setJewelFilterSlot(slot); playSfx('click'); })} className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${jewelFilterSlot === slot ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{slot} Sockets</button>))}</div>
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
                  const sortedItems = [...items].sort((a, b) => {
                    if (cat === 'Hero') {
                      const aFav = favoriteHeroes.has(a.id);
                      const bFav = favoriteHeroes.has(b.id);
                      if (aFav && !bFav) return -1;
                      if (!aFav && bFav) return 1;
                    }
                    const aEquipped = equippedItems.has(a.id);
                    const bEquipped = equippedItems.has(b.id);
                    if (aEquipped && !bEquipped) return -1;
                    if (!aEquipped && bEquipped) return 1;
                    return 0;
                  });
                  return (<div key={cat} className="space-y-6"><h2 className="text-sm font-black text-white uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4 italic flex items-center gap-3"><span className="text-xl">{categoryEmojis[cat]}</span> {cat === 'Hero' ? 'HEROES' : (cat === 'Pet Farm Eggs' ? 'PET FARM EGGS' : cat + 'S')}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-5">{sortedItems.map(item => { const isEquipped = equippedItems.has(item.id); const isBeingCompared = compareHeroIds.includes(item.id); const isFavorite = favoriteHeroes.has(item.id); return (<div key={item.id} className="relative group">{((item as any).mythicPerk || (item as any).deepLogic) && (<div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute left-1/2 -translate-x-1/2 bottom-[105%] w-72 p-5 bg-gray-950/98 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-4xl z-[500] pointer-events-none animate-in fade-in slide-in-from-bottom-2"><div className="space-y-4">{(item as any).mythicPerk && (<div><p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Sparkles size={10} /> Mythic Resonance</p><p className="text-[11px] text-white font-bold italic leading-relaxed bg-orange-600/5 p-2.5 rounded-xl border border-orange-500/10">"{(item as any).mythicPerk}"</p></div>)}{(item as any).deepLogic && (<div><p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Atom size={10} /> Neural Synthesis</p><p className="text-[10px] text-gray-300 font-medium italic leading-relaxed bg-blue-600/5 p-2.5 rounded-xl border border-blue-500/10">{(item as any).deepLogic}</p></div>)}</div><div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-gray-950 rotate-45 border-r border-b border-white/10"></div></div>)}<div onClick={() => { setSelectedItem(item); playSfx('click'); }} className="cursor-pointer"><Card tier={item.tier} className={`transition-all duration-500 ${isEquipped ? 'border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20' : 'hover:scale-[1.02]'} ${isFavorite && item.category === 'Hero' ? 'bg-yellow-400/5 border-yellow-500/20' : ''}`}><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Badge tier={item.tier} />{isEquipped && (<span className="flex items-center gap-1 px-2 py-0.5 bg-orange-600 text-[7px] font-black text-white uppercase rounded animate-pulse"><Zap size={8} fill="currentColor" /> ACTIVE</span>)}{isFavorite && item.category === 'Hero' && (<Star size={12} className="text-yellow-500 fill-current" />)}</div><div className="flex items-center gap-2">{item.category === 'Hero' && (<button onClick={(e) => { e.stopPropagation(); handleHeroCompareToggle(item.id); }} className={`p-2 rounded-xl border transition-all ${isBeingCompared ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/5 text-gray-600 hover:text-blue-500'}`} title="Compare Hero"><Scale size={14} /></button>)}<button onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }} className={`p-2 rounded-xl border transition-all ${isEquipped ? 'bg-orange-600 border-orange-400 text-white' : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-300'}`}>{isEquipped ? <Check size={14} /> : <Box size={14} />}</button></div></div><div className="flex items-center gap-2 mt-3"><h3 className="text-lg font-black text-white uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors truncate">{item.name}</h3>{item.category === 'Hero' && (<button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }} className={`p-1.5 rounded-lg transition-all ${isFavorite ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'}`} title="Favorite Hero"><Star size={16} fill={isFavorite ? "currentColor" : "none"} /></button>)}</div><p className="text-[10px] text-gray-500 mt-2 line-clamp-2">{item.desc}</p></Card></div></div>);})}</div></div>);})}
            </div>
          )}

          {activeTab === 'vs' && (
            <div className="space-y-10 animate-in fade-in pb-12">
               <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[3rem] text-center"><h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Tactical Comparison Matrix</h4><p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em]">Side-by-Side Architectural Analysis</p></div>
               <div className="grid grid-cols-2 gap-4"><div className="space-y-6"><CustomSelect options={GEAR_DATA.map(g => ({ id: g.id, name: g.name, subtitle: g.category }))} value={vsItemA} onChange={(v) => setVsItemA(v)} placeholder="Load Source A..." />{GEAR_DATA.find(g => g.id === vsItemA) && (<div className="animate-in slide-in-from-left-4 duration-500"><Card tier={GEAR_DATA.find(g => g.id === vsItemA)?.tier} className="min-h-[400px]"><Badge tier={GEAR_DATA.find(g => g.id === vsItemA)!.tier} /><h5 className="text-lg font-black text-white uppercase italic mt-4">{GEAR_DATA.find(g => g.id === vsItemA)?.name}</h5><div className="mt-8 space-y-6">{GEAR_DATA.find(g => g.id === vsItemA)?.mythicPerk && (<div><p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p><p className="text-[11px] text-gray-200 font-bold italic">{GEAR_DATA.find(g => g.id === vsItemA)?.mythicPerk}</p></div>)}{GEAR_DATA.find(g => g.id === vsItemA)?.deepLogic && (<div className="p-4 bg-black/40 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p><p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">{GEAR_DATA.find(g => g.id === vsItemA)?.deepLogic}</p></div>)}</div></Card></div>)}</div><div className="space-y-6"><CustomSelect options={GEAR_DATA.map(g => ({ id: g.id, name: g.name, subtitle: g.category }))} value={vsItemB} onChange={(v) => setVsItemB(v)} placeholder="Load Source B..." />{GEAR_DATA.find(g => g.id === vsItemB) && (<div className="animate-in slide-in-from-right-4 duration-500"><Card tier={GEAR_DATA.find(g => g.id === vsItemB)?.tier} className="min-h-[400px]"><Badge tier={GEAR_DATA.find(g => g.id === vsItemB)!.tier} /><h5 className="text-lg font-black text-white uppercase italic mt-4">{GEAR_DATA.find(g => g.id === vsItemB)?.name}</h5><div className="mt-8 space-y-6">{GEAR_DATA.find(g => g.id === vsItemB)?.mythicPerk && (<div><p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p><p className="text-[11px] text-gray-200 font-bold italic">{GEAR_DATA.find(g => g.id === vsItemB)?.mythicPerk}</p></div>)}{GEAR_DATA.find(g => g.id === vsItemB)?.deepLogic && (<div className="p-4 bg-black/40 rounded-2xl border border-white/5"><p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p><p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">{GEAR_DATA.find(g => g.id === vsItemB)?.deepLogic}</p></div>)}</div></Card></div>)}</div></div>
            </div>
          )}

          {activeTab === 'jewels' && (
            <div className="space-y-12 animate-in fade-in pb-12">
              <div className="p-10 bg-blue-600/10 border border-blue-500/20 rounded-[3rem] shadow-4xl flex flex-col gap-8">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4"><div className="w-14 h-14 bg-blue-600/20 rounded-[1.4rem] border border-blue-500/30 flex items-center justify-center text-blue-400"><Binary size={32}/></div><div><h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Slot Resonance Codex</h3><p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">v6.3 Strategic Calibration Milestones</p></div></div>
                   <div className="flex flex-col items-end"><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Theoretical Slot LV</p><div className="px-6 py-2 bg-black/60 border border-white/10 rounded-xl text-center"><p className="text-xl font-black text-blue-400">{jewelSimLevel}</p></div></div>
                 </div>
                 <div className="relative pt-6">
                    <input type="range" min="1" max="38" value={jewelSimLevel} onChange={(e) => { setJewelSimLevel(parseInt(e.target.value)); playSfx('click'); }} className="w-full h-3 bg-black/50 rounded-full appearance-none cursor-pointer accent-blue-500 relative z-10" />
                    <div className="absolute top-0 left-0 w-full flex justify-between px-2 pointer-events-none opacity-40">
                      {[16, 28, 33, 38].map(lv => (
                        <div key={lv} className="flex flex-col items-center">
                          <div className={`w-px h-10 ${jewelSimLevel >= lv ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                          <span className={`text-[8px] font-black mt-2 ${jewelSimLevel >= lv ? 'text-blue-400' : 'text-gray-600'}`}>{lv}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {JEWEL_RESONANCE_DATA.map((res) => {
                    const milestones = [
                      { lv: 16, buff: res.lv16, color: 'text-blue-400', bg: 'bg-blue-600/10 border-blue-500/20' },
                      { lv: 28, buff: res.lv28, color: 'text-orange-400', bg: 'bg-orange-600/10 border-orange-500/20' },
                      { lv: 33, buff: res.lv33, color: 'text-purple-400', bg: 'bg-purple-600/10 border-purple-500/20' },
                      { lv: 38, buff: res.lv38, color: 'text-red-500', bg: 'bg-red-600/10 border-red-500/20' }
                    ];
                    return (
                      <div key={res.slot} className="bg-gray-900/60 border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
                        <div className="flex items-center gap-4 relative z-10">
                           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-white transition-colors border border-white/5">
                              {res.slot === 'Weapon' ? <Sword size={24}/> : res.slot === 'Armor' ? <Shield size={24}/> : res.slot === 'Ring' ? <Circle size={24}/> : res.slot === 'Bracelet' ? <Zap size={24}/> : res.slot === 'Locket' ? <Target size={24}/> : <Book size={24}/>}
                           </div>
                           <h4 className="text-xl font-black text-white uppercase italic italic tracking-tight">{res.slot} Resonance</h4>
                        </div>
                        <div className="space-y-3 relative z-10">
                          {milestones.map(m => (
                            <div key={m.lv} className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between gap-4 ${jewelSimLevel >= m.lv ? m.bg : 'bg-white/5 border-white/5 opacity-40 grayscale'}`}>
                               <span className={`text-[10px] font-black uppercase ${m.color}`}>LV {m.lv}</span>
                               <span className={`text-[11px] font-bold italic text-right leading-tight ${jewelSimLevel >= m.lv ? 'text-white' : 'text-gray-500'}`}>{m.buff}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                 <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4 italic">Individual Neural Catalysts (Jewels)</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJewels.map(j => (
                      <div key={j.id} onClick={() => { setSelectedItem({...j, category: 'Jewel'}); playSfx('click'); }} className="cursor-pointer group"><div className={`p-8 bg-gradient-to-br ${getJewelColorClasses(j.color)} rounded-[3rem] border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 flex flex-col gap-6`}><div className="flex items-center gap-4"><div className="w-14 h-14 bg-black/40 rounded-[1.4rem] border border-white/10 flex items-center justify-center transition-transform duration-500"><Gem size={28} /></div><div><h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{j.name}</h4><p className="text-[10px] text-white/60 font-black uppercase mt-1 tracking-widest">{j.statType}</p></div></div></div></div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[2.5rem]">
                <h4 className="text-[10px] font-black text-orange-500 uppercase mb-6 flex items-center gap-2 tracking-[0.3em]"><Activity size={14}/> Account Sync Protocol</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(calculateGlobalStats()).map(([stat, val]) => (
                    <div key={stat} className="p-5 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-md">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat}</p>
                      <p className="text-2xl font-black text-white italic">+{val}%</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {HERO_DATA.map(h => (
                  <div key={h.id} className="p-4 bg-gray-900/60 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
                    <div className="flex items-center gap-3"><Badge tier={h.tier} /><span className="text-xs font-black text-white italic uppercase tracking-tighter">{h.name}</span></div>
                    <button onClick={() => { setUnlockedHeroes(p => ({...p, [h.id]: { lv120: !p[h.id]?.lv120 }})); playSfx('click'); }} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${unlockedHeroes[h.id]?.lv120 ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-gray-600 hover:text-gray-400'}`}>{unlockedHeroes[h.id]?.lv120 ? 'Active' : 'L120'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'relics' && (
            <div className="space-y-10 animate-in fade-in pb-12">
              <div className="p-10 bg-purple-600/10 border border-purple-500/20 rounded-[3rem] shadow-4xl text-center">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Relic Antiquities Database</h3>
                <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.3em]">Historical Artifact Synthesis v6.3</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredRelics.map(relic => {
                  const styles = getRelicStyles(relic.tier);
                  return (
                    <div key={relic.id} onClick={() => { setSelectedItem({ ...relic, category: 'Relic' }); playSfx('click'); }} className={`cursor-pointer p-7 border rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${styles.card}`}>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-[1.4rem] flex items-center justify-center border shadow-inner ${styles.iconContainer}`}>
                            <RelicIcon type={relic.iconType} className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white uppercase italic leading-none tracking-tight">{relic.name}</h4>
                            <p className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${styles.tooltip}`}>{relic.tier} Antiquity</p>
                          </div>
                        </div>
                        <div className="p-2 bg-white/5 rounded-xl text-gray-600 group-hover:text-white transition-colors">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Combat Resonance</p>
                          <p className={`text-[13px] font-black italic ${styles.statColor}`}>{relic.effect}</p>
                        </div>
                        <p className="text-[12px] text-gray-400 font-medium italic leading-relaxed line-clamp-3">"{relic.lore}"</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: FORMULA */}
          {activeTab === 'formula' && (
            <div className="space-y-8 animate-in fade-in pb-12">
              <div className="p-6 bg-amber-600/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-[11px] font-medium text-amber-100/80 leading-relaxed italic">
                  <span className="font-black text-amber-500 uppercase tracking-wider block mb-1">Manual Calibration:</span> 
                  You must manually input your hero attributes from the character screen for the calculator to function correctly.
                </p>
              </div>
              <div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5">
                <p className="text-[12px] font-black text-gray-600 uppercase mb-5 tracking-[0.2em]">Effective Multiplier</p>
                <div className="text-6xl sm:text-7xl md:text-8xl font-black text-white italic tracking-tighter tabular-nums">{formulaResult.toLocaleString()}</div>
                <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Base Damage Capacity</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { k: 'baseAtk', l: 'Raw ATK', sub: 'The flat number on your gear screen' },
                  { k: 'atkPercent', l: 'ATK % Boost', sub: 'Total ATK+% from all sources' },
                  { k: 'weaponDmgPercent', l: 'Weapon DMG %', sub: 'Specific weapon tier bonuses' },
                  { k: 'critDmg', l: 'Crit DMG %', sub: 'Damage multiplier on critical hits' }
                ].map(s => (
                  <div key={s.k} className="px-8 py-5 bg-gray-900/60 border border-white/5 rounded-[2rem] focus-within:border-orange-500/40 transition-all flex items-center justify-between gap-6 shadow-lg">
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-black text-gray-500 uppercase block mb-1 tracking-widest leading-none">{s.l}</label>
                      <p className="text-[9px] text-gray-600 font-bold uppercase truncate">{s.sub}</p>
                    </div>
                    <div className="w-32 flex justify-end">
                      <input 
                        type="number" 
                        value={(fInputs as any)[s.k]} 
                        onChange={e => setFInputs(p => ({ ...p, [s.k]: Number(e.target.value) }))} 
                        className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-lg font-black outline-none w-full tabular-nums text-right focus:border-orange-500/40 transition-all" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-[65vh] animate-in fade-in">
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-10">
                {chatHistory.length === 0 && (<div className="p-12 text-center space-y-6"><div className="w-24 h-24 bg-orange-600/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500 animate-pulse"><Bot size={48} /></div><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tactical Uplink Established</h3><p className="text-xs text-gray-400 leading-relaxed italic max-w-sm mx-auto">"Hello there, fellow archer! I'm your tactical mentor. Ask me anything about gear, boss patterns, or meta evolutions."</p></div>)}
                {chatHistory.map(msg => (<div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-6 rounded-[2.5rem] ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-900 border border-white/5 text-gray-100 rounded-tl-none'}`}><p className="text-[13px] leading-[1.8] font-medium italic whitespace-pre-wrap">{msg.text}</p></div></div>))}
                {isAiLoading && (<div className="flex justify-start"><div className="p-6 bg-gray-900/40 rounded-3xl rounded-tl-none border border-white/5 animate-pulse flex items-center gap-4"><Loader2 className="text-orange-500 animate-spin" size={16} /><span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Synchronizing neural data...</span></div></div>)}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-gray-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center gap-3"><input type="text" placeholder="Inquire tactical advice..." className="flex-1 bg-transparent text-sm font-bold text-white outline-none px-4" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} /><button onClick={handleAiSend} disabled={isAiLoading || !aiInput.trim()} className="p-4 bg-orange-600 text-white rounded-2xl hover:bg-orange-500 transition-all disabled:opacity-30"><Send size={18}/></button></div>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-gray-950/98 backdrop-blur-3xl border-t border-white/5 p-4 flex flex-col items-center shadow-2xl">
        <div ref={navScrollRef} className="w-full max-w-3xl overflow-x-auto no-scrollbar flex items-center gap-2 px-4 pb-2 touch-pan-x draggable-content" onMouseDown={(e) => handleDragStart(e, navScrollRef)}>
          {[
            { id: 'meta', icon: LayoutGrid, label: 'Archive' },
            { id: 'tracker', icon: Target, label: 'Sync' },
            { id: 'formula', icon: Variable, label: 'Formula' },
            { id: 'dragons', icon: Flame, label: 'Dragons' },
            { id: 'refine', icon: Wrench, label: 'Refine' },
            { id: 'vs', icon: ArrowRightLeft, label: 'Gear Vs' },
            { id: 'analyze', icon: BrainCircuit, label: 'Sim' },
            { id: 'lab', icon: Zap, label: 'Lab' },
            { id: 'immunity', icon: Shield, label: 'Guard' },
            { id: 'farming', icon: Map, label: 'Farming' },
            { id: 'dps', icon: Calculator, label: 'Burst' },
            { id: 'jewels', icon: Disc, label: 'Jewel' },
            { id: 'relics', icon: Box, label: 'Relic' },
            { id: 'ai', icon: MessageSquare, label: 'Mentor' },
          ].map(t => (<button key={t.id} onClick={(e) => handleInteractiveClick(e, () => handleTabChange(t.id as any))} className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl transition-all duration-300 transform active:scale-90 relative ${activeTab === t.id ? 'text-orange-500 bg-white/5 ring-1 ring-white/10' : 'text-gray-500'}`}><t.icon size={20} className={activeTab === t.id ? 'animate-pulse' : ''} /><span className="text-[8px] font-black uppercase tracking-tight">{t.label}</span></button>))}
        </div>
      </nav>

      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-2xl bg-[#030712] border border-white/10 rounded-[3.5rem] p-8 sm:p-14 max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 shadow-4xl ring-1 ring-white/5">
            <button onClick={() => setSelectedItem(null)} className="absolute top-10 right-10 p-5 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-transform z-20 hover:bg-white/10"><X size={32}/></button>
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tier={selectedItem.tier} />
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-600/5 px-3 py-1 rounded-lg border border-orange-500/10">{selectedItem.category} Protocols</span>
                  {selectedItem.isGodTier && <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest bg-yellow-400/5 px-3 py-1 rounded-lg border border-yellow-400/20 flex items-center gap-1"><Sparkles size={12}/> Divine Grade</span>}
                </div>
                <h2 className="text-5xl sm:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedItem.name}</h2>
                <p className="text-[15px] text-gray-400 font-medium italic opacity-90 leading-relaxed max-w-lg">{selectedItem.desc}</p>
              </div>
              <div className="grid grid-cols-1 gap-10">
                <div className="space-y-4">
                   {selectedItem.lore && (<div className="p-8 bg-gray-900/40 rounded-[2.5rem] border border-white/5 space-y-3"><h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><HistoryIcon size={16} /> Chronology Archive</h4><p className="text-[13px] text-gray-300 font-medium leading-relaxed italic">"{selectedItem.lore}"</p></div>)}
                   {selectedItem.deepLogic && (<div className="p-10 bg-gray-950 border border-white/10 rounded-[3rem] shadow-inner relative overflow-hidden group"><div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><BrainCircuit size={100} /></div><h4 className="text-[11px] font-black text-orange-500 uppercase mb-5 flex items-center gap-3 tracking-[0.3em] relative z-10"><ScrollText size={22}/> Deep Logic Summary</h4><div className="text-[15px] text-gray-100 font-medium leading-[1.8] italic whitespace-pre-wrap relative z-10">{selectedItem.deepLogic}</div></div>)}
                </div>
                {selectedItem.category === 'Jewel' && (
                   <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-5">
                         <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 text-center"><p className="text-[10px] font-black text-gray-500 uppercase mb-2">Base Potential</p><p className="text-4xl font-black text-white italic">+{selectedItem.baseStat}</p><p className="text-[9px] font-black text-blue-400 uppercase mt-2 tracking-widest">{selectedItem.statType}</p></div>
                         <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 text-center"><p className="text-[10px] font-black text-gray-500 uppercase mb-2">Growth Vector</p><p className="text-4xl font-black text-white italic">+{selectedItem.statPerLevel}</p><p className="text-[9px] font-black text-orange-400 uppercase mt-2 tracking-widest">Per Catalyst LV</p></div>
                      </div>
                      <div className="p-8 bg-gray-900/40 rounded-[2.5rem] border border-white/5"><h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Socket Compatibility</h4><div className="flex flex-wrap gap-2">{selectedItem.slots.map((s: string) => (<span key={s} className="px-5 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[11px] font-black rounded-xl italic">{s} Socket</span>))}</div></div>
                      <div className="p-8 bg-amber-600/5 border border-amber-500/20 rounded-[2.5rem] flex items-start gap-4"><Info size={24} className="text-amber-500 mt-1 shrink-0" /><div><p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1">Resonance Protocol</p><p className="text-[13px] text-gray-400 font-medium leading-relaxed italic">Individual jewels do not yield resonance bonuses. Sync bonuses are calculated based on the **total level** of jewels equipped in a specific equipment slot.</p></div></div>
                   </div>
                )}
                {selectedItem.category === 'Relic' && (
                  <div className="space-y-6">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Discovery Source</h4>
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-purple-400" />
                        <span className="text-[13px] text-gray-200 font-black italic">{selectedItem.source || 'Classified Archive'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-14 pt-10 border-t border-white/5 flex items-center justify-between opacity-30"><div className="flex items-center gap-3"><Terminal size={14} className="text-orange-500" /><span className="text-[9px] font-black uppercase tracking-widest text-gray-500">System Signature: v6.3.0_ZVA</span></div><p className="text-[8px] font-bold text-gray-700">© 2025 ZA ARMORY CORE</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;