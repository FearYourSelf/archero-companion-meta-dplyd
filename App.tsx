
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
  Globe, Sun, CalendarDays, Plus
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, SET_BONUS_DESCRIPTIONS, FARMING_ROUTES, DRAGON_DATA, FarmingRoute, REFINE_TIPS, JEWEL_SLOT_BONUSES, DAILY_EVENTS
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic, GearSet, LogEntry, SlotBonus, StarMilestone, SunMilestone, ArcheroEvent, LoadoutBuild } from './types';
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
    item.source,
    item.chapter,
    item.resource,
    item.strategy,
    item.proTip,
    item.bestHero,
    item.lootRate,
    item.difficulty
  ].filter(Boolean).map(val => String(val).toLowerCase());

  return tokens.every(token => {
    const directMatch = searchableText.some(field => field.includes(token));
    if (directMatch) return true;
    return fuzzyMatch(item.name || item.chapter || '', token) || fuzzyMatch(item.id || '', token);
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
  const [activeTab, setActiveTab] = useState<'meta' | 'tracker' | 'analyze' | 'dps' | 'vs' | 'immunity' | 'lab' | 'jewels' | 'relics' | 'farming' | 'ai' | 'formula' | 'dragons' | 'refine' | 'talents' | 'events' | 'loadout' | 'blacksmith'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('All');
  const [relicTierFilter, setRelicTierFilter] = useState<'All' | 'Holy' | 'Radiant' | 'Faint'>('All');
  const [relicSourceFilter, setRelicSourceFilter] = useState<string>('All');
  const [sssOnly, setSssOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [uiToast, setUiToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsRef = useRef<LogEntry[]>([]);

  // Tracker State
  const [unlockedHeroes, setUnlockedHeroes] = useState<Record<string, { lv120: boolean; stars: number; sunLevel: number }>>(() => {
    const saved = localStorage.getItem('archero_v6_tracker_plus_v2');
    if (saved) return JSON.parse(saved);
    const old = localStorage.getItem('archero_v6_tracker_plus');
    if (old) {
      const parsedOld = JSON.parse(old);
      const migrated: Record<string, { lv120: boolean; stars: number; sunLevel: number }> = {};
      Object.keys(parsedOld).forEach(k => migrated[k] = { ...parsedOld[k], sunLevel: 0 });
      return migrated;
    }
    return {};
  });

  // Loadout Editor State
  const [currentLoadout, setCurrentLoadout] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('archero_v6_wip_loadout');
    if (saved) return JSON.parse(saved);
    return {
      Hero: '', Weapon: '', Armor: '', 'Ring 1': '', 'Ring 2': '', 'Spirit 1': '', 'Spirit 2': '',
      Bracelet: '', Locket: '', Book: '', 'Dragon 1': '', 'Dragon 2': '', 'Dragon 3': ''
    };
  });

  // Derived set for equipped items based on currentLoadout for consistent Archive checkmarks
  const equippedItems = useMemo(() => new Set(Object.values(currentLoadout).filter(Boolean)), [currentLoadout]);

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

  // Talents State
  const [currentTalent, setCurrentTalent] = useState(1);
  const [targetTalent, setTargetTalent] = useState(100);

  // Blacksmith State
  const [forgeCurrentLevel, setForgeCurrentLevel] = useState(1);
  const [forgeTargetLevel, setForgeTargetLevel] = useState(80);
  const [forgeResult, setForgeResult] = useState<{ gold: number; scrolls: number } | null>(null);

  // Farming Guide State
  const [isMazeGuideOpen, setIsMazeGuideOpen] = useState(false);

  const [savedLoadouts, setSavedLoadouts] = useState<LoadoutBuild[]>(() => JSON.parse(localStorage.getItem('archero_v6_loadouts') || '[]'));
  const [selectorActiveSlot, setSelectorActiveSlot] = useState<{ name: string; category: GearCategory } | null>(null);

  // Build Modal States
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const [newBuildName, setNewBuildName] = useState('');
  const [isDeletingModalOpen, setIsDeletingModalOpen] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState<LoadoutBuild | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const farmFilterScrollRef = useRef<HTMLDivElement>(null);
  const relicTierFilterScrollRef = useRef<HTMLDivElement>(null);
  const relicSourceFilterScrollRef = useRef<HTMLDivElement>(null);
  const jewelFilterScrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, moved: false, startX: 0, scrollLeft: 0, targetRef: null as React.RefObject<HTMLElement | null> | null });

  const currentDay = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }), []);

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

  useEffect(() => { if (activeTab === 'ai' && chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, activeTab]);

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
    if (target.closest('input, select, textarea, a, button')) return;
    ref.current.style.scrollBehavior = 'auto';
    dragRef.current = { isDragging: true, moved: false, startX: e.pageX, scrollLeft: ref.current.scrollLeft, targetRef: ref };
  };

  useLayoutEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d.isDragging || !d.targetRef?.current) return;
      const ref = d.targetRef.current;
      const dx = (e.pageX - d.startX) * 1.5;
      if (Math.abs(dx) > 8) { d.moved = true; ref.scrollLeft = d.scrollLeft - dx; }
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
  useEffect(() => { localStorage.setItem('archero_v6_favorites', JSON.stringify(Array.from(favoriteHeroes))); }, [favoriteHeroes]);
  useEffect(() => { localStorage.setItem('archero_v6_chat', JSON.stringify(chatHistory)); }, [chatHistory]);
  useEffect(() => { localStorage.setItem('archero_v6_stats', JSON.stringify(calcStats)); }, [calcStats]);
  useEffect(() => { localStorage.setItem('archero_v6_loadouts', JSON.stringify(savedLoadouts)); }, [savedLoadouts]);
  useEffect(() => { localStorage.setItem('archero_v6_wip_loadout', JSON.stringify(currentLoadout)); }, [currentLoadout]);

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
      if (userHero.lv120) addStat(h.globalBonus120);
      (h.starMilestones as StarMilestone[])?.forEach(m => { if (m.isGlobal && userHero.stars >= m.stars) addStat(m.effect); });
      (h.sunMilestones as SunMilestone[])?.forEach(m => { if (m.isGlobal && userHero.sunLevel >= m.level) addStat(m.effect); });
    });
    return totals;
  };

  const toggleEquip = (id: string) => {
    playSfx('click');
    const item = [...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA].find(i => i.id === id);
    if (!item) return;

    setCurrentLoadout(prev => {
      const next = { ...prev };
      const category = item.category;
      
      // Check if item is already in ANY slot
      const existingSlot = Object.keys(next).find(k => next[k] === id);
      if (existingSlot) {
        next[existingSlot] = '';
        return next;
      }

      // Assign based on category logic
      if (category === 'Hero') next['Hero'] = id;
      else if (category === 'Weapon') next['Weapon'] = id;
      else if (category === 'Armor') next['Armor'] = id;
      else if (category === 'Bracelet') next['Bracelet'] = id;
      else if (category === 'Locket') next['Locket'] = id;
      else if (category === 'Book') next['Book'] = id;
      else if (category === 'Ring') {
        if (!next['Ring 1']) next['Ring 1'] = id;
        else if (!next['Ring 2']) next['Ring 2'] = id;
        else next['Ring 1'] = id;
      }
      else if (category === 'Spirit') {
        if (!next['Spirit 1']) next['Spirit 1'] = id;
        else if (!next['Spirit 2']) next['Spirit 2'] = id;
        else next['Spirit 1'] = id;
      }
      else if (category === 'Dragon') {
        if (!next['Dragon 1']) next['Dragon 1'] = id;
        else if (!next['Dragon 2']) next['Dragon 2'] = id;
        else if (!next['Dragon 3']) next['Dragon 3'] = id;
        else next['Dragon 1'] = id;
      }
      return next;
    });
  };

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
    const filtered = FARMING_ROUTES.filter(route => performRobustSearch(route, farmingSearch) && (farmingCategory === 'All' || route.resource === farmingCategory));
    return [...filtered].sort((a, b) => {
      let valA: any = a[farmingSort.field]; let valB: any = b[farmingSort.field];
      if (farmingSort.field === 'efficiency') { valA = (efficiencyWeight as any)[a.efficiency] || 0; valB = (efficiencyWeight as any)[b.efficiency] || 0; } else if (farmingSort.field === 'avgTime') { valA = parseFloat(a.avgTime) || 0; valB = parseFloat(b.avgTime) || 0; }
      if (valA < valB) return farmingSort.direction === 'asc' ? -1 : 1; if (valA > valB) return farmingSort.direction === 'asc' ? 1 : -1; return 0;
    });
  }, [farmingSearch, farmingCategory, farmingSort]);

  const talentsCost = useMemo(() => {
    let totalGold = 0; let totalScrolls = 0; const start = Math.min(currentTalent, targetTalent); const end = Math.max(currentTalent, targetTalent);
    for (let i = start; i < end; i++) { totalGold += Math.round(50 * Math.pow(i, 2.45) + 200); if (i > 20) totalScrolls += Math.ceil(i / 15); }
    return { gold: totalGold, scrolls: totalScrolls };
  }, [currentTalent, targetTalent]);

  const calculateBlacksmithForge = () => {
    let totalGold = 0;
    let totalScrolls = 0;
    const start = Math.min(forgeCurrentLevel, forgeTargetLevel);
    const end = Math.max(forgeCurrentLevel, forgeTargetLevel);
    
    // Archero scaling logic: costs increase geometrically
    for (let i = start; i < end; i++) {
      // Gold(L) = 150 * L^1.7 + 200
      totalGold += Math.floor(150 * Math.pow(i, 1.7) + 200);
      // Scrolls(L) = 1 + floor(L/10)
      totalScrolls += Math.floor(1 + i / 10);
    }
    
    setForgeResult({ gold: totalGold, scrolls: totalScrolls });
    playSfx('click');
    showToast("Forge calculation completed.", "success");
  };

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
      const errorMsg = e.message === "RATE_LIMIT_EXCEEDED" ? "Rate limit hit. Free tier allows 15 requests per minute." : "Neural uplink interrupted.";
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: errorMsg, timestamp: Date.now() }]);
      showToast(errorMsg, 'error');
    } finally { setIsAiLoading(false); }
  };

  const runSimulation = async () => {
    playSfx('click'); setIsSimMenuOpen(false); setIsSimulating(true); setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Advanced synthesis for ${hero?.name} at ${calcStats.baseAtk} Atk. Structure with headers and bold gear. Focus on synergy. Include BEST build: Weapon, Armor, Rings, Bracelet, Locket, Book.`;
    try { const response = await chatWithAI(prompt, []); setSimResult(response || 'Simulation timeout.'); } catch (e: any) { const errorMsg = e.message === "RATE_LIMIT_EXCEEDED" ? "Neural Core is busy (Rate Limit). Try again in 60s." : "Simulation data corrupt."; showToast(errorMsg, 'error'); setSimResult(errorMsg); }
    finally { setIsSimulating(false); }
  };

  const handleTabChange = (tab: typeof activeTab) => { playSfx('tab'); setActiveTab(tab); if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleResetFilters = () => { setSearchQuery(''); setCategoryFilter('All'); setSssOnly(false); playSfx('click'); };
  const handleExportBuild = (heroName: string, set: GearSet) => { playSfx('click'); const text = `ARCHERO TACTICAL BUILD: ${set.name}\nHero: ${heroName}\nWeapon: ${set.weapon}\nArmor: ${set.armor}\nRings: ${set.rings.join(' + ')}\nBracelet: ${set.bracelet}\nLocket: ${set.locket}\nBook: ${set.book}\nSYNERGY: ${set.synergy}`.trim(); navigator.clipboard.writeText(text); showToast(`${set.name} exported.`, 'success'); };
  const findItemByName = (name: string) => [...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA].find(i => i.name === name || i.id === name);
  const displayOrder: GearCategory[] = ['Hero', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book', 'Spirit', 'Dragon', 'Pet', 'Relic', 'Jewel', 'Totem', 'Pet Farm Eggs', 'Glyph'];
  const categoryIcons: Record<string, any> = { 'All': LayoutGrid, 'Hero': User, 'Weapon': Sword, 'Armor': Shield, 'Ring': Circle, 'Locket': Target, 'Bracelet': Zap, 'Book': Book, 'Spirit': Ghost, 'Dragon': Flame, 'Pet': Dog, 'Pet Farm Eggs': Egg, 'Totem': Tower, 'Relic': Box, 'Jewel': Disc, 'Glyph': Layers };
  const categoryEmojis: Record<string, string> = { 'Hero': '🦸', 'Weapon': '⚔️', 'Armor': '🛡️', 'Ring': '💍', 'Bracelet': '⚡', 'Locket': '🎯', 'Book': '📖', 'Spirit': '👻', 'Dragon': '🐉', 'Pet': '🐾', 'Relic': '🏺', 'Jewel': '💎', 'Totem': '🏛️', 'Pet Farm Eggs': '🥚', 'Glyph': '➰' };

  const filteredJewels = useMemo(() => JEWEL_DATA.filter(j => jewelFilterSlot === 'All' || j.slots.includes(jewelFilterSlot)), [jewelFilterSlot]);
  const filteredRelics = useMemo(() => RELIC_DATA.filter(r => performRobustSearch(r, searchQuery) && (relicTierFilter === 'All' || r.tier === relicTierFilter) && (relicSourceFilter === 'All' || r.source === relicSourceFilter)), [relicTierFilter, relicSourceFilter, searchQuery]);
  const filteredData = useMemo(() => {
    const adaptedJewels = JEWEL_DATA.map(j => ({ ...j, category: 'Jewel' as GearCategory, tier: 'S' as Tier, desc: j.lore || j.statType }));
    const adaptedRelics = RELIC_DATA.map(r => ({ ...r, category: 'Relic' as GearCategory, tier: 'S' as Tier, desc: r.effect }));
    return [...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA, ...adaptedJewels, ...adaptedRelics].filter(item => performRobustSearch(item, searchQuery) && (categoryFilter === 'All' || item.category === categoryFilter) && (!sssOnly || item.tier === 'SSS'));
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
    const w1 = getTierWeight(h1.tier); const w2 = getTierWeight(h2.tier);
    let analysis = w1 > w2 ? `${h1.name} has a direct tier advantage (${h1.tier} vs ${h2.tier}).` : w2 > w1 ? `${h2.name} has a direct tier advantage (${h2.tier} vs ${h1.tier}).` : "Both heroes are in the same Power Tier.";
    const getBonusType = (s: string) => s.toLowerCase().includes('atk') || s.toLowerCase().includes('attack') ? 'Offense' : 'Defense';
    const b1 = getBonusType(h1.globalBonus120); const b2 = getBonusType(h2.globalBonus120);
    return { tierWinner: w1 > w2 ? 0 : (w2 > w1 ? 1 : null), bonusWinner: (b1 === 'Offense' && b2 === 'Defense') ? 0 : (b2 === 'Offense' && b1 === 'Defense' ? 1 : null), verdict: analysis };
  }, [comparedHeroes]);

  const getEventColor = (color: string) => {
    switch (color) {
      case 'orange': return 'from-orange-600/40 border-orange-500/30 text-orange-500';
      case 'blue': return 'from-blue-600/40 border-blue-500/30 text-blue-500';
      case 'purple': return 'from-purple-600/40 border-purple-500/30 text-purple-500';
      case 'teal': return 'from-teal-600/40 border-teal-500/30 text-teal-500';
      case 'red': return 'from-red-600/40 border-red-500/30 text-red-500';
      case 'green': return 'from-green-600/40 border-green-500/30 text-green-500';
      case 'amber': return 'from-amber-600/40 border-amber-500/30 text-amber-500';
      default: return 'from-gray-600/40 border-gray-500/30 text-gray-500';
    }
  };

  const handleSaveBuild = () => {
    setNewBuildName(`Build ${savedLoadouts.length + 1}`);
    setIsSavingModalOpen(true);
    playSfx('click');
  };

  const executeSaveBuild = () => {
    if (!newBuildName.trim()) return;
    const name = newBuildName.trim();
    const newBuild: LoadoutBuild = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      slots: { ...currentLoadout },
      timestamp: Date.now()
    };
    setSavedLoadouts(prev => [newBuild, ...prev]);
    setIsSavingModalOpen(false);
    showToast(`Build "${name}" saved to archive.`, 'success');
  };

  const handleEquipBuild = (build: LoadoutBuild) => {
    // Overwrite editor state with the selected build
    setCurrentLoadout({ ...build.slots });
    showToast(`Deployed protocol "${build.name}".`, 'success');
  };

  const executeDeleteBuild = () => {
    if (!buildToDelete) return;
    setSavedLoadouts(prev => prev.filter(x => x.id !== buildToDelete.id));
    setIsDeletingModalOpen(false);
    setBuildToDelete(null);
    showToast(`Build deleted.`, 'info');
    playSfx('error');
  };

  const LoadoutSlot: React.FC<{ name: string; category: GearCategory; icon: any; variant?: 'hero' | 'default' }> = ({ name, category, icon: Icon, variant = 'default' }) => {
    const itemId = currentLoadout[name];
    const item = [...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA].find(i => i.id === itemId);
    const isEditing = selectorActiveSlot?.name === name;
    
    return (
      <div 
        onClick={() => { setSelectorActiveSlot({ name, category }); playSfx('click'); }}
        className={`relative aspect-square rounded-[1.8rem] border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer group active:scale-95 
          ${isEditing ? 'border-orange-500 ring-4 ring-orange-500/30 scale-105 z-20 shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 'border-white/5'}
          ${item 
            ? (variant === 'hero' ? 'bg-blue-600/10 border-blue-500/40 shadow-lg' : 'bg-orange-600/5 border-orange-500/40 shadow-md') 
            : 'bg-gray-950/40 hover:border-white/20'
          } 
          ${variant === 'hero' && !isEditing ? 'scale-110 ring-2 ring-blue-500/20' : ''}`}
      >
        {!item && <Icon size={variant === 'hero' ? 28 : 22} className={`transition-colors ${isEditing ? 'text-orange-500' : 'text-gray-700 opacity-50 group-hover:opacity-100'}`} />}
        {!item && <span className={`text-[7px] font-black uppercase mt-1 text-center leading-none tracking-tighter transition-colors ${isEditing ? 'text-orange-400' : 'text-gray-600'}`}>{name}</span>}
        {item && (
          <div className="text-center animate-in zoom-in-50 duration-300 w-full overflow-hidden">
            <Badge tier={item.tier} />
            <p className="text-[8px] font-black text-white uppercase italic mt-1 leading-tight px-0.5 line-clamp-2">{item.name}</p>
          </div>
        )}
        {item && (
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentLoadout(p => ({ ...p, [name]: '' })); playSfx('click'); }}
            className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X size={10} />
          </button>
        )}
        {/* Pulsing indicator for active slot in build view */}
        {isEditing && (
          <div className="absolute inset-0 rounded-[1.8rem] border-2 border-orange-500 animate-ping opacity-20 pointer-events-none" />
        )}
      </div>
    );
  };

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

      {/* Build Deletion Modal */}
      {isDeletingModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in" onClick={() => setIsDeletingModalOpen(false)} />
           <div className="relative w-full max-w-md bg-gray-950 border border-white/10 rounded-[3rem] p-10 shadow-4xl animate-in zoom-in-95 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-600/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center text-red-500 mb-6 shadow-inner">
                <AlertTriangle size={36} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Wipe Data?</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Delete protocol "{buildToDelete?.name}" permanently?</p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsDeletingModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all"
                >
                  ABORT
                </button>
                <button 
                  onClick={executeDeleteBuild}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] italic hover:bg-red-500 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> CONFIRM
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Build Naming Modal */}
      {isSavingModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in" onClick={() => setIsSavingModalOpen(false)} />
           <div className="relative w-full max-w-md bg-gray-950 border border-white/10 rounded-[3rem] p-10 shadow-4xl animate-in zoom-in-95 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-center text-blue-500 mb-6 shadow-inner">
                <Archive size={36} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Archive Protocol</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Establish a unique designation for this loadout</p>
              
              <input 
                autoFocus
                type="text"
                placeholder="Enter designation..."
                value={newBuildName}
                onChange={(e) => setNewBuildName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSaveBuild()}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg font-black text-white italic outline-none focus:border-blue-500/50 transition-all text-center mb-8"
