
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
  HeartHandshake, BarChart3, Scan, ShieldCheck, Zap as Bolt, Eye, Scroll, Wine, ArrowUp,
  Lock, FunctionSquare, Variable, ChevronDown, Hammer, Coins, Archive, Package, History,
  Clock, Gauge, UserCircle2, Zap as Spark, ChevronDown as ArrowDown, Droplets, Binary,
  Lightbulb, Link2, Ghost as Spook, Database, Cpu, Radio, Radar, Fingerprint as ScanIcon,
  Telescope, Activity as Pulse, Shrink, MoreHorizontal, Copy, FileText, Mountain, Zap as BoltIcon,
  ShieldAlert, DollarSign, Users, Award as AwardIcon, Sparkle as StarIcon, Info as InfoIcon,
  ChevronUp, ArrowDownWideNarrow, Check, Atom, RotateCcw, Scale, Milestone, Code, Swords as Combat, Shirt, UserPlus,
  Globe, Sun, CalendarDays, Plus, ArrowRight, Cookie, Microscope, Skull, Menu, Home
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, SET_BONUS_DESCRIPTIONS, FARMING_ROUTES, DRAGON_DATA, FarmingRoute, REFINE_TIPS, JEWEL_SLOT_BONUSES, DAILY_EVENTS
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic, GearSet, LogEntry, SlotBonus, StarMilestone, SunMilestone, ArcheroEvent, LoadoutBuild } from './types';
import { Badge, Card } from './components/UI';

// --- CUSTOM COMPONENTS FOR AI FORMATTING ---
const FormattedMessage: React.FC<{ text: string; role: 'user' | 'model' }> = ({ text, role }) => {
  if (role === 'user') {
    return <p className="text-[15px] leading-relaxed font-semibold italic text-white/90">{text}</p>;
  }

  // Tactical Markdown Parser for Mentor Responses
  const lines = text.split('\n');
  return (
    <div className="space-y-5 font-sans selection:bg-cyan-500/30">
      {lines.map((line, i) => {
        const trimmedLine = line.trim();
        
        // Main Header: # TACTICAL PROFILE
        if (trimmedLine.startsWith('# ')) {
          return (
            <div key={i} className="mt-6 mb-4">
              <h3 className="text-xl font-black text-cyan-400 uppercase italic tracking-tighter border-b border-cyan-500/20 pb-2 flex items-center gap-2">
                <Scan size={18} className="text-cyan-500" /> {trimmedLine.replace('# ', '')}
              </h3>
            </div>
          );
        }
        
        // Section Header: ## CORE ARCHITECTURE
        if (trimmedLine.startsWith('## ')) {
          return (
            <h4 key={i} className="text-[13px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 mt-8 mb-3 group">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:animate-ping" />
              {trimmedLine.replace('## ', '')}
            </h4>
          );
        }
        
        // List Item: - **Weapon**: Name
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          const content = trimmedLine.replace(/^[-*]\s+/, '');
          return (
            <div key={i} className="flex gap-4 text-[14px] leading-relaxed pl-2 border-l border-white/5 py-1 transition-colors hover:bg-white/5 rounded-r-lg">
              <span className="text-cyan-500 font-black shrink-0">»</span>
              <div className="text-gray-300">
                {content.split(/(\*\*.*?\*\*)/g).map((part, pi) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    const itemName = part.replace(/\*\*/g, '');
                    return <span key={pi} className="text-white font-black uppercase italic tracking-tight underline decoration-cyan-500/40 underline-offset-4 decoration-2">{itemName}</span>;
                  }
                  return <span key={pi}>{part}</span>;
                })}
              </div>
            </div>
          );
        }

        // Empty line
        if (trimmedLine.length === 0) return <div key={i} className="h-2" />;

        // Standard Paragraph
        return (
          <p key={i} className="text-[14px] text-gray-400 leading-relaxed italic font-medium">
            {line.split(/(\*\*.*?\*\*)/g).map((part, pi) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={pi} className="text-orange-400 font-black italic">{part.replace(/\*\*/g, '')}</span>;
              }
              return <span key={pi}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

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
    <line x1="2" x2="16" y1="12" y2="12" />
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

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'meta', icon: LayoutGrid, label: 'Archive' },
  { id: 'intel', icon: Skull, label: 'Intel' },
  { id: 'dna', icon: Dna, label: 'DNA Lab' },
  { id: 'events', icon: CalendarDays, label: 'Events' },
  { id: 'tracker', icon: Target, label: 'Sync' },
  { id: 'talents', icon: Milestone, label: 'Talents' },
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
  { id: 'relics', icon: Box, label: 'Relic Archive' },
  { id: 'ai', icon: MessageSquare, label: 'Mentor' }
] as const;

type AppTab = (typeof NAV_ITEMS)[number]['id'] | 'loadout' | 'blacksmith' | 'dna' | 'intel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
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
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);

  const [stutterProgress, setStutterProgress] = useState(0);
  const [stutterStreak, setStutterStreak] = useState(0);
  const [stutterActive, setStutterActive] = useState(false);
  const [stutterFeedback, setStutterFeedback] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState('Blade');
  const [efficiency, setEfficiency] = useState(0);

  // Talents State
  const [currentTalent, setCurrentTalent] = useState(1);
  const [targetTalent, setTargetTalent] = useState(100);

  // DNA Lab State
  const [dnaCurrentStars, setDnaCurrentStars] = useState(1);
  const [dnaTargetStars, setDnaTargetStars] = useState(2);
  const [dnaResult, setDnaResult] = useState<{ shards: number; cookies: number; gold: number } | null>(null);

  // Blacksmith State
  const [forgeCurrentLevel, setForgeCurrentLevel] = useState(1);
  const [forgeTargetLevel, setForgeTargetLevel] = useState(80);
  const [forgeResult, setForgeResult] = useState<{ gold: number; scrolls: number } | null>(null);

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
  const quickNavRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickNavRef.current && !quickNavRef.current.contains(e.target as Node)) {
        setIsQuickNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const calculateDnaEvolution = () => {
    // Exact mapping from provided table: Shards, Cookies, Gold
    const EVO_DATA = [
      [10, 100, 20000],   // 1★ -> 2★ (Index 0)
      [20, 300, 87500],   // 2★ -> 3★ (Index 1)
      [40, 500, 157500],  // 3★ -> 4★ (Index 2)
      [80, 1000, 285000], // 4★ -> 5★ (Index 3)
      [150, 3000, 876000],// 5★ -> 6★ (Index 4)
      [250, 6000, 1680000],// 6★ -> 7★ (Index 5)
      [400, 10000, 2913000]// 7★ -> 8★ (Index 6)
    ];

    let totalShards = 0;
    let totalCookies = 0;
    let totalGold = 0;

    const start = Math.min(dnaCurrentStars, dnaTargetStars);
    const end = Math.max(dnaCurrentStars, dnaTargetStars);

    // Summing cost steps
    for (let i = start; i < end; i++) {
      const stepCosts = EVO_DATA[i - 1];
      if (stepCosts) {
        totalShards += stepCosts[0];
        totalCookies += stepCosts[1];
        totalGold += stepCosts[2];
      }
    }

    setDnaResult({ shards: totalShards, cookies: totalCookies, gold: totalGold });
    playSfx('click');
    showToast(`Simulation complete for ${end - start} evolution levels.`, 'success');
  };

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

  // Add Build Analysis functionality
  const analyzeCurrentBuild = async () => {
    const items = Object.entries(currentLoadout)
      .filter(([_, id]) => !!id)
      .map(([slot, id]) => {
        const item = [...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA].find(i => i.id === id);
        return `${slot}: ${item ? item.name : id}`;
      });

    if (items.length === 0) {
      showToast("Loadout empty. Cannot analyze.", "error");
      return;
    }

    const prompt = `Analyze this Archero build:\n${items.join('\n')}\n\nIs it good? Please provide a detailed build report with tactical pros/cons and potential improvements based on the current v6.3 meta.`;
    
    playSfx('msg');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: prompt, timestamp: Date.now() }]);
    setIsAiLoading(true);
    setActiveTab('ai'); // Switch to mentor tab immediately
    
    try {
      // Use slice to avoid sending too much context if history is huge
      const response = await chatWithAI(prompt, chatHistory.slice(-10).map(h => ({ role: h.role, text: h.text })));
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'Mentor offline.', timestamp: Date.now() }]);
    } catch (e: any) {
      const errorMsg = e.message === "RATE_LIMIT_EXCEEDED" ? "Mentor Core saturated. Try in 60s." : "Analysis stream failed.";
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: errorMsg, timestamp: Date.now() }]);
      showToast(errorMsg, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Add Reset Chat functionality
  const resetChat = () => {
    setChatHistory([]);
    localStorage.removeItem('archero_v6_chat');
    playSfx('error');
    showToast("Tactical logs wiped.", "info");
  };

  const runSimulation = async () => {
    playSfx('click'); setIsSimMenuOpen(false); setIsSimulating(true); setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Advanced synthesis for ${hero?.name} at ${calcStats.baseAtk} Atk. Structure with headers and bold gear. Focus on synergy. Include BEST build: Weapon, Armor, Rings, Bracelet, Locket, Book.`;
    try { const response = await chatWithAI(prompt, []); setSimResult(response || 'Simulation timeout.'); } catch (e: any) { const errorMsg = e.message === "RATE_LIMIT_EXCEEDED" ? "Neural Core is busy (Rate Limit). Try again in 60s." : "Simulation data corrupt."; showToast(errorMsg, 'error'); setSimResult(errorMsg); }
    finally { setIsSimulating(false); }
  };

  const handleTabChange = (tab: AppTab) => { playSfx('tab'); setActiveTab(tab); if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' }); setIsQuickNavOpen(false); };
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
    let analysis = w1 > w2 ? `${h1.name} has a direct tier advantage (${h1.tier} vs ${h2.tier}).` : w2 > w1 ? `${h2.name} has a direct tier advantage (${h2.tier} vs ${h2.tier}).` : "Both heroes are in the same Power Tier.";
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
              />

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsSavingModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={executeSaveBuild}
                  disabled={!newBuildName.trim()}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] italic hover:bg-blue-500 disabled:opacity-30 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={14} /> INITIALIZE
                </button>
              </div>
           </div>
        </div>
      )}

      {selectorActiveSlot && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectorActiveSlot(null)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-[3rem] p-8 max-h-[80vh] overflow-hidden flex flex-col shadow-4xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Assign {selectorActiveSlot.name}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Filtering archive: {selectorActiveSlot.category} only</p>
              </div>
              <button onClick={() => setSelectorActiveSlot(null)} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-all"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...HERO_DATA, ...GEAR_DATA, ...DRAGON_DATA].filter(i => i.category === selectorActiveSlot.category).map(item => {
                const isActiveInThisSlot = currentLoadout[selectorActiveSlot.name] === item.id;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => { setCurrentLoadout(p => ({ ...p, [selectorActiveSlot.name]: item.id })); setSelectorActiveSlot(null); playSfx('click'); }}
                    className={`p-5 border rounded-3xl cursor-pointer transition-all flex items-center gap-4 group 
                      ${isActiveInThisSlot 
                        ? 'bg-orange-600/20 border-orange-500/60 ring-2 ring-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
                        : 'bg-white/5 border-white/5 hover:border-orange-500/30 hover:bg-white/10'}`}
                  >
                    <div className="relative">
                      <Badge tier={item.tier} />
                      {isActiveInThisSlot && (
                        <div className="absolute -top-1 -left-1 w-full h-full border border-orange-500 rounded-lg animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-black uppercase italic transition-colors truncate ${isActiveInThisSlot ? 'text-orange-400' : 'text-white group-hover:text-orange-400'}`}>{item.name}</p>
                        {isActiveInThisSlot && <span className="bg-orange-600 text-[6px] font-black text-white px-1 py-0.5 rounded leading-none shrink-0">ACTIVE</span>}
                      </div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase truncate">{item.desc}</p>
                    </div>
                    {isActiveInThisSlot ? <CheckCircle2 size={16} className="text-orange-500" /> : <ChevronRight size={16} className="text-gray-700" />}
                  </div>
                );
              })}
            </div>
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
            <button onClick={() => handleTabChange('loadout')} className={`px-4 py-3 rounded-xl border transition-all ${activeTab === 'loadout' ? 'bg-blue-600/20 border-blue-500/50 text-blue-500 shadow-lg' : 'bg-white/5 text-gray-500 border-white/5 hover:text-blue-400'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Loadout</span>
            </button>
            <button 
              onClick={() => handleTabChange('intel')} 
              className={`p-3 rounded-xl border transition-all ${activeTab === 'intel' ? 'bg-red-600/20 border-red-500/50 text-red-500 shadow-lg' : 'bg-white/5 text-gray-500 border-white/5 hover:text-red-400'}`}
              title="Boss Dossiers"
            >
              <Skull size={18} />
            </button>
            <button 
              onClick={() => handleTabChange('blacksmith')} 
              className={`p-3 rounded-xl border transition-all ${activeTab === 'blacksmith' ? 'bg-orange-600/20 border-orange-500/50 text-orange-500 shadow-lg shadow-orange-500/10' : 'bg-white/5 text-gray-500 border-white/5 hover:text-orange-400'}`}
              title="Blacksmith"
            >
              <Hammer size={18} />
            </button>
            <button onClick={() => handleTabChange('ai')} className={`p-3 rounded-xl border transition-all ${activeTab === 'ai' ? 'bg-orange-600/20 border-orange-500/50 text-orange-500 shadow-lg shadow-orange-500/10' : 'bg-white/5 text-gray-500 border-white/5 hover:text-orange-400'}`} title="Quick Mentor Link">
              <MessageSquare size={16} />
            </button>
            <button 
              onClick={() => handleTabChange('home')} 
              className="p-3 bg-white/5 text-gray-500 rounded-xl transition-all border border-white/5 hover:text-orange-400"
              title="Return to Base"
            >
              <Home size={16} />
            </button>
          </div>
        </div>
      </header>

      <main ref={scrollContainerRef} className={`flex-1 overflow-y-auto no-scrollbar scroll-smooth relative ${activeTab === 'ai' ? 'overflow-hidden' : 'pb-40'}`}>
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 px-6 py-8 space-y-10 pb-40">
            <div className="p-10 bg-gradient-to-br from-orange-600/10 via-gray-950 to-blue-950/5 border border-white/10 rounded-[4rem] text-center shadow-4xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
               <Activity className="mx-auto mb-6 text-orange-500/30 animate-pulse" size={64} />
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Tactical Dashboard</h3>
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] italic">Archero Command Center v6.3</p>
               <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="px-5 py-2 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2">
                    <Calendar size={12} className="text-orange-500" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{currentDay}</span>
                  </div>
                  <div className="px-5 py-2 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2">
                    <RefreshCw size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">SYNCED</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {NAV_ITEMS.filter(item => item.id !== 'home').map((item, idx) => (
                <button 
                  key={item.id}
                  onClick={() => handleTabChange(item.id as AppTab)}
                  className="group relative p-8 bg-gray-950/40 border border-white/5 rounded-[2.8rem] flex flex-col items-center justify-center text-center gap-4 transition-all hover:bg-orange-600/5 hover:border-orange-500/30 hover:scale-[1.03] active:scale-95 shadow-xl animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                    <item.icon size={64} className="text-orange-500" />
                  </div>
                  <div className="w-16 h-16 bg-white/5 rounded-[1.8rem] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all shadow-inner">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase italic tracking-tighter group-hover:text-orange-400 transition-colors">{item.label}</h4>
                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Launch Protocol</p>
                  </div>
                </button>
              ))}
              
              <button 
                onClick={() => handleTabChange('loadout')}
                className="col-span-2 group relative p-10 bg-blue-600/10 border border-blue-500/20 rounded-[3.5rem] flex items-center justify-between transition-all hover:bg-blue-600/20 hover:border-blue-500/40 hover:scale-[1.02] active:scale-95 shadow-2xl animate-in fade-in zoom-in-95 delay-300"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-[2.2rem] border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                    <Shirt size={40} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Loadout Editor</h4>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1">Deploy Combat Configuration</p>
                  </div>
                </div>
                <div className="p-5 bg-black/20 rounded-full border border-white/5 group-hover:translate-x-2 transition-transform">
                  <ArrowRight size={24} className="text-blue-500" />
                </div>
              </button>
            </div>
            
            <div className="p-8 bg-black/20 border border-dashed border-white/10 rounded-[3rem] text-center opacity-40">
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Archero Command Uplink Active. Commander, your presence is required in the lab.</p>
            </div>
          </div>
        )}

        {(activeTab === 'meta' || activeTab === 'farming' || activeTab === 'relics' || activeTab === 'jewels') && (
          <div className="sticky top-0 z-[200] bg-gray-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-4 space-y-4">
             {(activeTab === 'meta' || activeTab === 'relics' || activeTab === 'farming' || activeTab === 'jewels') && (
                <div className="flex items-center gap-3">
                  {/* Quick Nav Dropdown */}
                  <div className="relative" ref={quickNavRef}>
                    <button 
                      onClick={() => { setIsQuickNavOpen(!isQuickNavOpen); playSfx('click'); }}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${isQuickNavOpen ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:text-orange-500'}`}
                    >
                      <Menu size={20} />
                      <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest italic">QUICK NAV</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isQuickNavOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isQuickNavOpen && (
                      <div className="absolute top-[120%] left-0 w-64 bg-gray-950/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] py-4 shadow-4xl z-[1000] animate-in fade-in slide-in-from-top-2 max-h-[70vh] overflow-y-auto no-scrollbar ring-1 ring-white/5">
                        <div className="px-6 mb-4">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em] italic">Jump to Protocol</p>
                        </div>
                        {NAV_ITEMS.map((item) => (
                          <button 
                            key={item.id}
                            onClick={() => handleTabChange(item.id as AppTab)}
                            className={`w-full px-6 py-3.5 flex items-center gap-4 transition-all hover:bg-orange-600/10 border-b border-white/5 last:border-0 ${activeTab === item.id ? 'text-orange-500 bg-white/5' : 'text-gray-400 hover:text-white'}`}
                          >
                            <item.icon size={18} className={activeTab === item.id ? 'animate-pulse' : 'opacity-40'} />
                            <span className="text-[11px] font-black uppercase tracking-tighter italic">{item.label}</span>
                            {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full"></div>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input 
                      type="text" 
                      placeholder={`Search ${activeTab === 'meta' ? 'Archive' : activeTab === 'relics' ? 'Relics' : activeTab === 'farming' ? 'Routes' : 'Jewels'}...`} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[11px] font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" 
                      value={activeTab === 'farming' ? farmingSearch : searchQuery} 
                      onChange={(e) => activeTab === 'farming' ? setFarmingSearch(e.target.value) : setSearchQuery(e.target.value)} 
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

        <div className={`px-5 py-6 ${activeTab === 'ai' ? 'h-full p-0' : 'space-y-8'}`}>
          {activeTab === 'intel' && (
            <div className="space-y-10 pb-24 animate-in fade-in transition-all">
               <div className="p-10 bg-gradient-to-br from-red-600/10 via-gray-950 to-red-950/5 border border-red-500/20 rounded-[4rem] text-center shadow-4xl relative overflow-hidden group">
                 <Skull className="mx-auto mb-6 text-red-500/20 group-hover:text-red-500/40 transition-colors" size={64} />
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Boss Dossiers</h3>
                 <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.4em] italic">Tactical Threat Database</p>
               </div>

               <div className="space-y-6">
                  {/* Boss 1 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">1. Owl Supreme:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Walls</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> Hide behind walls to block the whirlwind. Only attack during its cooldowns.</p>
                    </div>
                  </div>

                  {/* Boss 2 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">2. Tentacle Menace:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Constant Movement</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> Never stand still. Watch for the ground ripple 1 second before it spawns under you.</p>
                    </div>
                  </div>

                  {/* Boss 3 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">3. Crimson Witch:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Water/Ice</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> Her fire pools linger forever. Lure her to one side of the room to keep the center clean.</p>
                    </div>
                  </div>

                  {/* Boss 4 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">4. Scythe Mage:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Melee Range</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> His scythes flare out wide. Stand extremely close (inside the ring) to avoid damage.</p>
                    </div>
                  </div>

                  {/* Boss 5 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">5. Double Archers:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Sync Kills</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> Lower both HP bars evenly. Killing one enrages the survivor to 2x speed.</p>
                    </div>
                  </div>

                  {/* Boss 6 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">6. Giant Scarecrow:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Diagonals</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> The only safe spots are the immediate diagonals. Do not stand directly in front or to the side.</p>
                    </div>
                  </div>

                  {/* Boss 7 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">7. Ice Worm:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Timing</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> Stop attacking when it burrows. Pre-fire the location where the dirt mound appears.</p>
                    </div>
                  </div>

                  {/* Boss 8 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">8. Queen Bee:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Ricochet</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> Ignore the small bees; let Ricochet/Chain Lightning bounce off them to hit the Queen.</p>
                    </div>
                  </div>

                  {/* Boss 9 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">9. Skeleton King:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Aggression</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> He summons mobs when you retreat. Push forward and burst him down quickly.</p>
                    </div>
                  </div>

                  {/* Boss 10 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">10. Spinning Golem:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Freeze</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> Do not run away in a straight line; circle strafe tightly around him.</p>
                    </div>
                  </div>

                  {/* Boss 11 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">11. Desert Goliath:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Distance</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> His rock throw splits on impact. Stay max range to widen the gaps between rocks.</p>
                    </div>
                  </div>

                  {/* Boss 12 */}
                  <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">12. Medusa:</h4>
                    <div className="mt-4 space-y-3">
                      <p className="text-[12px] font-medium leading-relaxed italic"><span className="text-orange-500 font-black uppercase tracking-widest mr-2">Weakness:</span> Line of Sight</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-gray-300"><span className="text-blue-400 font-black uppercase tracking-widest mr-2">Tip:</span> When eyes grow, hide behind a wall or look away to avoid the Stone status.</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'dna' && (
            <div className="space-y-10 animate-in fade-in pb-24">
              <div className="p-12 bg-gradient-to-br from-green-900/10 via-gray-950 to-emerald-950/5 border border-green-500/20 rounded-[4rem] text-center shadow-4xl relative overflow-hidden group">
                 <Dna className="mx-auto mb-6 text-green-500/20 group-hover:text-green-500/40 transition-all duration-700 group-hover:rotate-12" size={80} />
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">DNA LAB</h3>
                 <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.5em] italic">Hero Star Evolution Projection</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-gray-950/40 border border-white/5 rounded-[3.5rem] space-y-10 shadow-2xl backdrop-blur-xl">
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end px-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Current Star Level</label>
                        <span className="text-xl font-black text-white italic">{dnaCurrentStars} ★</span>
                      </div>
                      <div className="relative pt-2">
                        <input 
                          type="range" 
                          min="1" 
                          max="7" 
                          step="1"
                          value={dnaCurrentStars} 
                          onChange={(e) => setDnaCurrentStars(parseInt(e.target.value))}
                          className="w-full h-3 bg-black/60 rounded-full appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all shadow-inner ring-1 ring-white/10"
                        />
                        <div className="flex justify-between mt-2 px-1 text-[8px] font-black text-gray-700 uppercase tracking-tighter">
                          {[1, 2, 3, 4, 5, 6, 7].map(v => <span key={v}>{v}★</span>)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end px-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Objective Star Level</label>
                        <span className="text-xl font-black text-green-500 italic">{dnaTargetStars} ★</span>
                      </div>
                      <div className="relative pt-2">
                        <input 
                          type="range" 
                          min="2" 
                          max="8" 
                          step="1"
                          value={dnaTargetStars} 
                          onChange={(e) => setDnaTargetStars(parseInt(e.target.value))}
                          className="w-full h-3 bg-black/60 rounded-full appearance-none cursor-pointer accent-green-600 hover:accent-green-500 transition-all shadow-inner ring-1 ring-white/10"
                        />
                        <div className="flex justify-between mt-2 px-1 text-[8px] font-black text-gray-700 uppercase tracking-tighter">
                          {[2, 3, 4, 5, 6, 7, 8].map(v => <span key={v}>{v}★</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={calculateDnaEvolution}
                    className="w-full py-6 bg-green-600 text-white text-[15px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-green-500 transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(34,197,94,0.3)] active:scale-95 group"
                  >
                    <FlaskConical className="group-hover:rotate-12 transition-transform" size={24}/> INITIATE EVOLUTION SCAN
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {dnaResult ? (
                    <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right-4 duration-500">
                      <div className="p-8 bg-gray-950 border border-green-500/20 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform"><User size={80} className="text-green-500" /></div>
                        <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em] mb-2">Total Hero Shards</p>
                        <div className="text-4xl font-black text-white italic tabular-nums">{dnaResult.shards.toLocaleString()}</div>
                      </div>

                      <div className="p-8 bg-gray-950 border border-rose-500/20 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform"><Cookie size={80} className="text-rose-500" /></div>
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-[0.3em] mb-2">Total Evolution Cookies</p>
                        <div className="text-4xl font-black text-white italic tabular-nums">{dnaResult.cookies.toLocaleString()}</div>
                      </div>

                      <div className="p-8 bg-gray-950 border border-amber-500/20 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform"><Coins size={80} className="text-amber-500" /></div>
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Total Gold Required</p>
                        <div className="text-4xl font-black text-white italic tabular-nums">{dnaResult.gold.toLocaleString()}</div>
                      </div>

                      <div className="p-6 bg-black/40 border border-white/5 rounded-[2.5rem]">
                        <h4 className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2"><ClipboardCheck size={12}/> Evolutionary Breakdown ({dnaCurrentStars}★ to {dnaTargetStars}★)</h4>
                        <div className="space-y-1.5">
                          {dnaTargetStars > dnaCurrentStars ? (
                             Array.from({ length: 7 }, (_, i) => i + 1).map(i => {
                               if (i >= dnaCurrentStars && i < dnaTargetStars) {
                                 const EVO_DATA = [[10, 100, 20000], [20, 300, 87500], [40, 500, 157500], [80, 1000, 285000], [150, 3000, 876000], [250, 6000, 1680000], [400, 10000, 2913000]];
                                 const step = EVO_DATA[i-1];
                                 return (
                                   <div key={i} className="flex items-center justify-between text-[10px] py-1.5 border-b border-white/5 last:border-0 opacity-80">
                                      <span className="font-bold text-gray-500 uppercase italic">{i}★ ➔ {i+1}★</span>
                                      <span className="font-black text-white/90">{step[0]} Shards • {step[1]} Cookies • {step[2].toLocaleString()} Gold</span>
                                   </div>
                                 );
                               }
                               return null;
                             })
                           ) : (
                             <p className="text-[10px] text-red-400 font-bold uppercase italic text-center">Protocol Error: Target level must exceed baseline.</p>
                           )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white/5 border border-dashed border-white/10 rounded-[3.5rem] opacity-30">
                       <Microscope size={60} className="mb-6" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Awaiting Bio-Evolution Data</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blacksmith' && (
            <div className="space-y-10 animate-in fade-in pb-24">
              <div className="p-12 bg-gradient-to-br from-blue-900/10 via-gray-950 to-orange-950/5 border border-white/10 rounded-[4rem] text-center shadow-4xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none"></div>
                 <div className="relative mx-auto mb-8 w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse"></div>
                    <Atom className="absolute inset-0 text-orange-500/10 animate-spin-slow" size={96} />
                    <Hammer className="relative text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" size={64} />
                    <Sparkle className="absolute top-0 right-0 text-orange-400 animate-ping" size={20} />
                 </div>
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Blacksmith Forge</h3>
                 <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.5em] italic">Tactical Gear Scaling Projection</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Calibration Slot to fill space highlighted in Screenshot 2 */}
                  <div className="p-6 bg-gray-950/40 border border-white/5 rounded-[2.5rem] shadow-xl backdrop-blur-xl group hover:border-orange-500/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-black/60 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-gray-700 group-hover:text-orange-500/40 transition-colors">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Component Calibration</p>
                        <h4 className="text-xs font-bold text-gray-400 uppercase italic mt-1">Status: Awaiting Slot In</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-950/40 border border-white/5 rounded-[3rem] space-y-10 shadow-2xl backdrop-blur-xl">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Current Level</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="149" 
                          value={forgeCurrentLevel} 
                          onChange={(e) => setForgeCurrentLevel(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-3xl font-black text-white italic outline-none focus:border-orange-500/50 transition-all tabular-nums text-center" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Objective Level</label>
                        <input 
                          type="number" 
                          min="2" 
                          max="150" 
                          value={forgeTargetLevel} 
                          onChange={(e) => setForgeTargetLevel(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-3xl font-black text-white italic outline-none focus:border-orange-500/50 transition-all tabular-nums text-center" 
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={calculateBlacksmithForge}
                      className="w-full py-7 bg-gradient-to-r from-orange-600 to-orange-700 text-white text-[15px] font-black uppercase tracking-[0.4em] rounded-[2.2rem] hover:from-orange-500 hover:to-orange-600 transition-all flex flex-col items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.3)] active:scale-95 group relative overflow-hidden border border-orange-400/30"
                    >
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] pointer-events-none"></div>
                      <div className="flex items-center gap-4 mb-0.5">
                        <Hammer className="group-hover:rotate-12 transition-transform drop-shadow-md" size={24}/> 
                        <span>INITIATE FORGE PROTOCOL</span>
                      </div>
                      <span className="text-[8px] opacity-60 tracking-[0.3em] font-bold">SYNCCED // SYSTEM READY</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {forgeResult ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                      <div className="p-10 bg-gray-950 border-2 border-orange-500/30 rounded-[3.5rem] shadow-[0_0_50px_rgba(249,115,22,0.1)] relative overflow-hidden group">
                        <Coins className="absolute -bottom-8 -right-8 text-orange-500/5 group-hover:rotate-12 transition-transform duration-1000" size={180} />
                        <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Total Gold Required</p>
                        <div className="text-6xl font-black text-white italic tracking-tighter mb-2 tabular-nums drop-shadow-2xl">
                          {forgeResult.gold.toLocaleString()}
                        </div>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">Archero Gold Reserves Estimation</p>
                      </div>

                      <div className="p-10 bg-gray-950 border-2 border-blue-500/30 rounded-[3.5rem] shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                        <ScrollText className="absolute -bottom-8 -right-8 text-blue-500/5 group-hover:-rotate-12 transition-transform duration-1000" size={180} />
                        <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Total Scrolls Required</p>
                        <div className="text-6xl font-black text-white italic tracking-tighter mb-2 tabular-nums drop-shadow-2xl">
                          {forgeResult.scrolls.toLocaleString()}
                        </div>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">Tactical Scroll Consumption</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white/5 border border-dashed border-white/10 rounded-[3.5rem] opacity-30">
                       <ZapOff size={60} className="mb-6" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Awaiting Forge Parameters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loadout' && (
            <div className="space-y-8 animate-in fade-in pb-24">
              <div className="flex items-stretch gap-4">
                <button 
                  onClick={() => handleTabChange('home')} 
                  className="px-6 bg-white/5 rounded-[2.5rem] border border-white/10 hover:text-orange-500 transition-all shadow-xl group flex items-center justify-center"
                >
                  <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex-1 p-8 bg-gradient-to-br from-blue-900/10 via-gray-950 to-blue-950/5 border border-blue-500/20 rounded-[3.5rem] text-center shadow-4xl relative overflow-hidden">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center justify-center gap-4">
                     <Shirt size={28} className="text-blue-500 animate-pulse"/> Loadout Editor
                   </h3>
                   <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] italic">Tactical Configuration Interface</p>
                </div>
              </div>

              {/* Build Editor (Paper Doll) */}
              <div className="relative max-w-sm mx-auto bg-gray-900/40 p-6 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
                   <UserCircle2 size={350} className="text-white" />
                </div>
                
                <div className="relative z-10 space-y-4">
                  {/* Gear Layout */}
                  <div className="grid grid-cols-3 gap-3">
                    <LoadoutSlot name="Weapon" category="Weapon" icon={Sword} />
                    <LoadoutSlot name="Hero" category="Hero" icon={UserCircle2} variant="hero" />
                    <LoadoutSlot name="Armor" category="Armor" icon={Shield} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <LoadoutSlot name="Ring 1" category="Ring" icon={Circle} />
                    <LoadoutSlot name="Bracelet" category="Bracelet" icon={Zap} />
                    <LoadoutSlot name="Ring 2" category="Ring" icon={Circle} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <LoadoutSlot name="Spirit 1" category="Spirit" icon={Ghost} />
                    <LoadoutSlot name="Locket" category="Locket" icon={Target} />
                    <LoadoutSlot name="Spirit 2" category="Spirit" icon={Ghost} />
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <LoadoutSlot name="Book" category="Book" icon={Book} />
                    <div className="flex items-center justify-center opacity-10"><Code size={16} /></div>
                    <LoadoutSlot name="Dragon 1" category="Dragon" icon={Flame} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <LoadoutSlot name="Dragon 2" category="Dragon" icon={Flame} />
                    <div className="flex items-center justify-center opacity-10"><Terminal size={16} /></div>
                    <LoadoutSlot name="Dragon 3" category="Dragon" icon={Flame} />
                  </div>

                  <div className="pt-4 space-y-3">
                    <button 
                      onClick={analyzeCurrentBuild}
                      disabled={isAiLoading}
                      className="w-full py-4 bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95 group"
                    >
                      {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} className="group-hover:rotate-12 transition-transform" />} AI TACTICAL SYNTHESIS
                    </button>
                    <button 
                      onClick={handleSaveBuild}
                      className="w-full py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                    >
                      <Save size={16} /> ARCHIVE CURRENT BUILD
                    </button>
                  </div>
                </div>
              </div>

              {/* Saved Build List */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic px-4 flex items-center gap-3">
                  <History size={16}/> DEPLOYABLE PROTOCOLS
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {savedLoadouts.length === 0 ? (
                    <div className="p-8 text-center bg-white/5 border border-white/5 rounded-[2rem] opacity-30">
                      <p className="text-[9px] font-black uppercase tracking-widest">No stored protocols detected</p>
                    </div>
                  ) : (
                    savedLoadouts.map(build => (
                      <div key={build.id} className="p-5 bg-gray-950 border border-white/10 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                             <Package size={18} />
                          </div>
                          <div>
                             <h5 className="text-base font-black text-white uppercase italic tracking-tighter">{build.name}</h5>
                             <p className="text-[8px] font-bold text-gray-500 uppercase mt-0.5">{Object.values(build.slots).filter(Boolean).length} Assets Assigned</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEquipBuild(build)}
                            className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-blue-500 transition-all flex items-center gap-2"
                          >
                            <Bolt size={12} /> DEPLOY
                          </button>
                          <button 
                            onClick={() => { setBuildToDelete(build); setIsDeletingModalOpen(true); playSfx('click'); }}
                            className="p-2 bg-white/5 text-gray-600 rounded-xl hover:text-red-500 transition-all border border-white/5"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-10 animate-in fade-in pb-24">
               <div className="p-10 bg-gradient-to-br from-orange-600/10 via-gray-950 to-orange-950/5 border border-orange-500/20 rounded-[4rem] text-center shadow-4xl relative overflow-hidden group">
                 <CalendarDays className="mx-auto mb-6 text-orange-500/20 group-hover:text-orange-500/40 transition-colors" size={64} />
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Ops Center Schedule</h3>
                 <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.4em] italic">Real-Time Event Coordination</p>
                 <div className="mt-8 inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest italic">{currentDay}, 2025</p>
                 </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] italic flex items-center gap-3 px-4">
                    <Target size={18}/> LIVE MISSIONS TODAY
                  </h4>
                  <div className="grid grid-cols-1 gap-5">
                    {DAILY_EVENTS.map(event => {
                      const isActive = event.days.includes(currentDay);
                      const colorStyles = getEventColor(event.color);
                      return (
                        <div key={event.id} className={`p-8 bg-gradient-to-r rounded-[3rem] border transition-all duration-500 ${isActive ? `${colorStyles} shadow-2xl scale-[1.02]` : 'from-gray-900/40 border-white/5 text-gray-700 opacity-60'}`}>
                           <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <h5 className="text-xl font-black uppercase italic tracking-tighter leading-none">{event.name}</h5>
                                  {isActive && <span className="px-2 py-0.5 bg-white text-black text-[8px] font-black uppercase rounded animate-pulse">ACTIVE</span>}
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{event.days.join(' • ')}</p>
                              </div>
                              <div className={`p-4 rounded-2xl border ${isActive ? 'bg-black/20 border-white/10' : 'bg-black/10 border-white/5'}`}>
                                <Clock size={16} />
                              </div>
                           </div>
                           
                           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                  <Award size={12}/> High-Yield Spoils
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {event.rewards.map(r => (
                                    <span key={r} className={`px-3 py-1 text-[9px] font-bold uppercase rounded-lg border ${isActive ? 'bg-white/10 border-white/20 text-white' : 'bg-black/20 border-white/5'}`}>{r}</span>
                                  ))}
                                </div>
                                <p className="text-[11px] italic font-medium leading-relaxed opacity-80 mt-4">{event.desc}</p>
                              </div>

                              <div className={`p-6 rounded-[2rem] border ${isActive ? 'bg-black/30 border-white/10' : 'bg-black/10 border-white/5 opacity-50'}`}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <ShieldAlert size={12}/> Mentor's Briefing
                                </p>
                                <p className="text-[11px] font-bold italic leading-relaxed text-gray-200">"{event.proTip}"</p>
                              </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
               </div>

               <div className="p-8 bg-black/20 border border-white/5 rounded-[3rem] text-center opacity-40">
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">Archero Daily Reset occurs at 16:00 UTC. Adjust strategies accordingly.</p>
               </div>
            </div>
          )}

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
              <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-2.5rem">
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
              <div className="grid grid-cols-1 gap-4">
                {HERO_DATA.map(h => {
                  const userData = unlockedHeroes[h.id] || { lv120: false, stars: 0, sunLevel: 0 };
                  return (
                    <div key={h.id} className="p-6 bg-gray-900/60 border border-white/5 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center gap-6 group hover:border-orange-500/20 transition-all">
                      {/* Left: Hero Basic Info */}
                      <div className="flex items-center gap-4 lg:w-48 shrink-0">
                        <Badge tier={h.tier} />
                        <div className="min-w-0">
                          <span className="text-sm font-black text-white italic uppercase tracking-tighter block truncate">{h.name}</span>
                          <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest block truncate">L120: {h.globalBonus120}</span>
                        </div>
                      </div>
                      
                      {/* Right: Evolution Grid for Alignment */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Star Evolution Path */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] px-1">Star Evolution</span>
                          <div className="flex items-center justify-between px-3 py-2.5 bg-black/40 rounded-2xl border border-white/5 w-full">
                            {[1,2,3,4,5,6,7,8].map(starNum => (
                              <button key={starNum} onClick={() => { setUnlockedHeroes(p => ({ ...p, [h.id]: { ...p[h.id], stars: (p[h.id]?.stars === starNum) ? starNum - 1 : starNum } })); playSfx('click'); }} className={`transition-all hover:scale-125 ${userData.stars >= starNum ? 'text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'text-gray-800 hover:text-gray-600'}`}>
                                <Star size={12} fill={userData.stars >= starNum ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sun Evolution Path */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[8px] font-black text-orange-500/60 uppercase tracking-[0.2em] px-1">Sun Evolution</span>
                          <div className="flex items-center justify-between px-3 py-2.5 bg-orange-950/10 rounded-2xl border border-orange-500/10 w-full">
                            {[1,2,3,4,5].map(level => (
                              <button key={level} onClick={() => { setUnlockedHeroes(p => ({ ...p, [h.id]: { ...p[h.id], sunLevel: (p[h.id]?.sunLevel === level) ? level - 1 : level } })); playSfx('click'); }} className={`transition-all hover:scale-125 ${userData.sunLevel >= level ? 'text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'text-gray-800 hover:text-gray-600'}`}>
                                <Sun size={12} fill={userData.sunLevel >= level ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Level Cap Binary Toggle */}
                        <div className="flex flex-col gap-2">
                           <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] px-1">Threshold L120</span>
                           <button onClick={() => { setUnlockedHeroes(p => ({...p, [h.id]: { ...p[h.id], lv120: !p[h.id]?.lv120 }})); playSfx('click'); }} className={`w-full py-2.5 rounded-2xl text-[9px] font-black uppercase transition-all border ${userData.lv120 ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-600 hover:text-gray-400'}`}>
                            {userData.lv120 ? 'SYNCCED' : 'NOT SYNCCED'}
                           </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-[calc(100vh-200px)] animate-in fade-in transition-all duration-500 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 bg-gray-950/90 border border-white/10 rounded-t-[3rem] shadow-2xl z-20 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/10 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                      <Bot size={24} className="animate-bounce" style={{ animationDuration: '3s' }} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white uppercase italic tracking-tighter">Tactical Mentor Core</h4>
                      <p className="text-[8px] font-black text-green-500 uppercase tracking-[0.3em] leading-none mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> ARCHIVE SYNCED
                      </p>
                    </div>
                 </div>
                 <button 
                  onClick={resetChat} 
                  className="flex items-center gap-3 px-5 py-2.5 bg-red-600/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95"
                 >
                   <Trash2 size={14}/> WIPE ARCHIVE
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 p-6 md:p-10 bg-gray-950/40 border-x border-white/5 shadow-inner">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40 animate-in fade-in zoom-in duration-700">
                    <div className="relative">
                      <div className="absolute -inset-10 bg-orange-500/5 blur-3xl rounded-full"></div>
                      <div className="w-32 h-32 bg-gray-900 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <HelpCircle size={48} className="text-gray-500" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-white font-black uppercase tracking-[0.2em] italic">Awaiting Direct Query</p>
                      <p className="text-xs text-gray-500 font-bold italic max-w-sm mx-auto leading-relaxed uppercase tracking-wider">"Deploy tactical inquiry regarding boss mechanics, hero evolution priority, or gear synthesis paths."</p>
                    </div>
                    <div className="flex gap-3">
                       {["Best build for Melinda?", "How to get 100% DR?", "Meta weapon for N70?"].map(hint => (
                         <button key={hint} onClick={() => setAiInput(hint)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-gray-400 hover:text-orange-500 transition-all uppercase">{hint}</button>
                       ))}
                    </div>
                  </div>
                )}
                {chatHistory.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`relative max-w-[90%] p-7 rounded-[2.8rem] shadow-3xl ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none border border-orange-500 shadow-orange-950/20' : 'bg-gray-900 border border-white/10 text-gray-100 rounded-tl-none ring-1 ring-white/5'}`}>
                      <FormattedMessage text={msg.text} role={msg.role} />
                      <div className={`absolute top-0 ${msg.role === 'user' ? '-right-1 border-l-orange-600' : '-left-1 border-r-gray-900'} w-0 h-0 border-[6px] border-transparent border-t-[10px] border-t-transparent`}></div>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
                    <div className="p-7 bg-gray-900/60 rounded-[2.8rem] rounded-tl-none border border-white/10 flex items-center gap-6 shadow-2xl backdrop-blur-md">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce"></span>
                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce delay-300"></span>
                      </div>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Processing Neural Stream...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 bg-gray-950 border border-white/10 rounded-b-[3rem] shadow-4xl shrink-0 z-20">
                <div className="relative flex items-center gap-4 bg-white/5 border border-white/10 rounded-[2.2rem] p-2 pr-3 focus-within:border-orange-500/50 transition-all shadow-inner ring-1 ring-white/5">
                  <input 
                    type="text" 
                    placeholder="Establish link query... (Try: 'Best Melinda loadout')" 
                    className="flex-1 bg-transparent text-[15px] font-black text-white outline-none px-6 py-4 placeholder:text-gray-700 selection:bg-orange-500/30" 
                    value={aiInput} 
                    onChange={e => setAiInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAiSend()} 
                  />
                  <button 
                    onClick={handleAiSend} 
                    disabled={isAiLoading || !aiInput.trim()} 
                    className="p-5 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-90 group shrink-0"
                  >
                    <Send size={24} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between px-6 opacity-30">
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Neural Kernel v6.3.0 // Ready</p>
                   <p className="text-[8px] font-bold text-gray-600 uppercase">Input encrypted</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'talents' && (
            <div className="space-y-10 animate-in fade-in pb-24">
              <div className="p-12 bg-gradient-to-br from-orange-600/10 via-gray-950 to-orange-950/5 border border-orange-500/20 rounded-[4rem] text-center shadow-4xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>
                 <Trophy className="mx-auto mb-6 text-orange-500/20 group-hover:text-orange-500/40 transition-colors" size={64} />
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Talent Growth Matrix</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] italic">Strategic Leveling Cost Projection</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-gray-900/60 border border-white/5 rounded-[3rem] space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Current Talent Level</label>
                      <input type="number" min="1" max="205" value={currentTalent} onChange={(e) => setCurrentTalent(Math.max(1, parseInt(e.target.value) || 0))} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-2xl font-black text-white outline-none focus:border-orange-500/50 transition-all tabular-nums" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Target Talent Level</label>
                      <input type="number" min="2" max="206" value={targetTalent} onChange={(e) => setTargetTalent(Math.max(1, parseInt(e.target.value) || 0))} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-2xl font-black text-white outline-none focus:border-orange-500/50 transition-all tabular-nums" />
                    </div>
                  </div>
                  <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
                    <InfoIcon className="text-blue-500 mt-1 shrink-0" size={16} />
                    <p className="text-[11px] text-gray-400 italic leading-relaxed">Costs increase geometrically. Projections include base scaling for the current Archero v6.3 metadata.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-10 bg-gray-950 border border-white/10 rounded-[3.5rem] shadow-inner relative group overflow-hidden">
                    <Coins className="absolute -bottom-6 -right-6 text-orange-500/5 group-hover:rotate-12 transition-transform duration-1000" size={160} />
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Cumulative Gold Req.</p>
                    <div className="text-5xl font-black text-white italic tracking-tighter mb-2 tabular-nums">{talentsCost.gold.toLocaleString()}</div>
                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Calculated for {Math.abs(targetTalent - currentTalent)} Upgrades</p>
                  </div>
                  <div className="p-10 bg-gray-950 border border-white/10 rounded-[3.5rem] shadow-inner relative group overflow-hidden">
                    <ScrollText className="absolute -bottom-6 -right-6 text-blue-500/5 group-hover:rotate-12 transition-transform duration-1000" size={160} />
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Total Talent Scrolls</p>
                    <div className="text-5xl font-black text-white italic tracking-tighter mb-2 tabular-nums">{talentsCost.scrolls.toLocaleString()}</div>
                    <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Archive Precision: High</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-6 animate-in fade-in pb-12">
              <div className="p-6 bg-amber-600/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-[11px] font-medium text-amber-100/80 leading-relaxed italic"><span className="font-black text-amber-500 uppercase tracking-wider block mb-1">Manual Calibration:</span> Input hero attributes from character screen. Using compact curved rectangles for efficiency.</p>
              </div>
              <div className="p-10 bg-gray-950/90 border border-white/5 rounded-[3rem] text-center shadow-inner relative ring-1 ring-white/5">
                <p className="text-[11px] font-black text-gray-600 uppercase mb-3 tracking-[0.2em]">Effective Multiplier</p>
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white italic tracking-tighter tabular-nums">{formulaResult.toLocaleString()}</div>
                <p className="text-[10px] text-orange-500 font-black uppercase mt-4 tracking-[0.3em]">Base Damage Capacity</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ k: 'baseAtk', l: 'Raw ATK' }, { k: 'atkPercent', l: 'ATK %' }, { k: 'weaponDmgPercent', l: 'Weapon Dmg %' }, { k: 'critDmg', l: 'Crit Dmg %' }].map(s => (
                  <div key={s.k} className="px-6 py-3 bg-gray-900/60 border border-white/5 rounded-2xl focus-within:border-orange-500/40 transition-all flex flex-col justify-center h-16 shadow-lg">
                    <label className="text-[8px] font-black text-gray-600 uppercase block mb-0.5 tracking-[0.2em]">{s.l}</label>
                    <input type="number" value={(fInputs as any)[s.k]} onChange={e => setFInputs(p => ({ ...p, [s.k]: Number(e.target.value) }))} className="bg-transparent text-white text-lg font-black outline-none w-full tabular-nums selection:bg-orange-500/30" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dragons' && (
            <div className="space-y-10 animate-in fade-in pb-12"><div className={`p-10 rounded-[3.5rem] border transition-all ${dragonSynergy ? 'bg-orange-600/10 border-orange-500/40' : 'bg-gray-900/40 border-white/5'} shadow-2xl`}><div className="flex items-center justify-between mb-8"><div><h4 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3"><Flame size={24} className={dragonSynergy ? 'text-orange-500' : 'text-gray-600'}/> Magestone Core</h4><p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{dragonSynergy ? "Resonance Optimized" : "Incomplete Synchronization"}</p></div>{dragonSynergy && <Sparkles className="text-orange-500 animate-pulse" size={24} />}</div><div className="grid grid-cols-1 gap-6">{['slot1', 'slot2', 'slot3'].map((slot, i) => { const selected = DRAGON_DATA.find(d => d.id === (dragons as any)[slot]); return (<div key={slot} className="p-6 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col gap-4"><CustomSelect options={DRAGON_DATA.map(d => ({ id: d.id, name: d.name, subtitle: (d as BaseItem).dragonType }))} value={(dragons as any)[slot]} onChange={(val) => handleEquipDragon(slot as any, val)} placeholder={`Assign Dragon Socket ${i+1}`} />{selected && (<div className="px-2 space-y-2 animate-in fade-in slide-in-from-left-2">{selected.deepLogic && <p className="text-[11px] font-bold text-orange-400 italic">Skill: {selected.deepLogic}</p>}<p className="text-[9px] text-gray-500 leading-relaxed font-medium">{selected.desc}</p></div>)}</div>); })}</div></div><div className="p-8 bg-black/20 rounded-[3rem] border border-white/5"><p className="text-[10px] font-black text-gray-600 uppercase mb-4 flex items-center gap-2"><Lightbulb size={12}/> Pro Tip</p><p className="text-[11px] text-gray-400 italic leading-relaxed">Assign unique dragons to each socket. Resonance is triggered by having one of each Type (Attack, Defense, Balance).</p></div></div>
          )}

          {activeTab === 'refine' && (
            <div className="space-y-10 animate-in fade-in pb-12"><div className="p-12 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-[4.5rem] text-center shadow-4xl relative overflow-hidden group"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div><Cpu className="mx-auto mb-6 text-orange-600/20 group-hover:text-orange-500/40 transition-colors" size={60} /><p className="text-[11px] font-black text-orange-500 uppercase mb-2 tracking-[0.4em]">Estimated Essence Yield</p><div className="text-6xl sm:text-7xl md:text-8xl font-black text-white italic tracking-tighter drop-shadow-2xl">{smeltEssenceYield.toLocaleString()}</div><p className="text-[9px] font-black text-gray-600 uppercase mt-2 tracking-[0.2em]">Glyph Essence Units</p></div><div className="mt-12 grid grid-cols-2 gap-4"><CustomSelect options={['Epic', 'PE', 'Legendary', 'AL', 'Mythic'].map(r => ({ id: r, name: r }))} value={smeltItem} onChange={(v) => setVsItemA(v as any)} placeholder="Select Rarity..." /><div className="relative group"><input type="number" value={smeltQty} onChange={e => setSmeltQty(Number(e.target.value))} className="w-full bg-gray-900/80 border border-white/10 px-6 py-4 rounded-2xl text-xs font-black text-white outline-none focus:border-orange-500/50" min="1" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Qty</span></div></div><div className="space-y-4"><h5 className="px-4 text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Smelt Optimization Tips</h5><div className="grid grid-cols-1 gap-3">{REFINE_TIPS.map((tip, i) => (<div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-start gap-4"><ShieldCheck className="text-orange-500 mt-1 shrink-0" size={16} /><p className="text-[11px] text-gray-300 font-medium italic leading-relaxed">{tip}</p></div>))}</div></div></div>
          )}

          {activeTab === 'analyze' && (
            <div className="flex flex-col min-h-full animate-in fade-in pb-24 space-y-10"><div className={`transition-all duration-700 relative ${simResult ? 'p-8 bg-blue-900/10 border border-blue-500/20 rounded-[3rem]' : 'p-16 bg-gray-950 border-2 border-blue-500/20 rounded-[4rem] shadow-4xl'}`}>{!simResult && <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5 opacity-20 pointer-events-none animate-pulse"></div>}<div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><ScanIcon size={simResult ? 100 : 200} className="animate-pulse" /></div><div className={`relative z-10 flex flex-col items-center text-center ${simResult ? 'gap-4' : 'gap-10'}`}><div className={`transition-all duration-700 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-inner ${simResult ? 'w-16 h-16' : 'w-32 h-32'}`}><BrainCircuit size={simResult ? 24 : 64} className="text-blue-500 animate-pulse" /></div><div><h4 className={`${simResult ? 'text-lg' : 'text-3xl'} font-black text-white uppercase italic tracking-tighter transition-all duration-700`}>Strategic Synthesis</h4>{!simResult && <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mt-3 italic">Neural Network V6.3 Uplink</p>}</div><div className={`w-full max-w-sm transition-all ${simResult ? 'flex gap-4' : 'space-y-6'}`}><CustomSelect options={HERO_DATA.map(h => ({ id: h.id, name: h.name, subtitle: h.tier }))} value={buildHero} onChange={(val) => setBuildHero(val)} placeholder="Select Hero Target..." className="flex-1" /><button onClick={runSimulation} disabled={isSimulating} className={`transition-all duration-500 bg-blue-600 text-white font-black uppercase rounded-3xl hover:bg-blue-500 flex items-center justify-center gap-4 disabled:opacity-30 shadow-xl active:scale-95 ${simResult ? 'px-6 py-2 text-[10px]' : 'w-full py-6 text-[14px]'}`}>{isSimulating ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18} className="fill-current"/>}<span>{isSimulating ? 'Processing...' : simResult ? 'RE-SYNTH' : 'INITIATE ANALYSIS'}</span></button></div></div></div>{simResult ? (<div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700 pb-20"><div className="flex items-center justify-between px-6 relative"><div className="flex items-center gap-3"><Pulse size={16} className="text-blue-500 animate-pulse" /><span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Output: Finalizing Build Path</span></div><div className="relative"><button onClick={() => { setIsSimMenuOpen(!isSimMenuOpen); playSfx('click'); }} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-blue-500"><MoreHorizontal size={20} /></button>{isSimMenuOpen && (<div className="absolute right-0 top-full mt-2 w-48 bg-gray-950 border border-white/10 rounded-2xl py-2 shadow-4xl z-[200] animate-in fade-in slide-in-from-top-2"><button onClick={() => { navigator.clipboard.writeText(simResult); playSfx('click'); setIsSimMenuOpen(false); showToast('Build Report copied.', 'success'); }} className="w-full px-5 py-3 flex items-center gap-3 text-[11px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all"><Copy size={14} /> <span>Copy to Clipboard</span></button><button onClick={() => { const element = document.createElement("a"); const file = new Blob([simResult], {type: 'text/plain'}); element.href = URL.createObjectURL(file); element.download = `Archero_Synthesis_${buildHero}_${Date.now()}.txt`; document.body.appendChild(element); element.click(); playSfx('click'); setIsSimMenuOpen(false); showToast('Tactical Report exported.', 'success'); }} className="w-full px-5 py-3 flex items-center gap-3 text-[11px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all"><FileText size={14} /> <span>Export as .txt</span></button></div>)}</div></div><div className="p-12 bg-gray-900/60 border-l-4 border-l-blue-500 border-y border-r border-white/5 rounded-r-[4rem] rounded-l-[1.5rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden ring-1 ring-white/5"><div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div><div className="text-[16px] text-gray-200 leading-[2.2] italic whitespace-pre-wrap font-medium relative z-10 selection:bg-blue-500/30"><FormattedMessage text={simResult} role="model" /></div></div></div>) : !isSimulating && (<div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20 animate-in fade-in duration-1000 delay-500"><Radar size={80} className="text-gray-500 mb-8 animate-ping" style={{animationDuration: '4s'}} /><div className="space-y-2"><p className="text-sm font-black uppercase tracking-[0.5em] text-gray-400">Deep Search Inactive</p><p className="text-[10px] font-bold text-gray-600 italic">Target selection required for tactical projection.</p></div></div>)}{isSimulating && (<div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in"><div className="relative"><Loader2 size={120} className="text-blue-500/20 animate-spin" /><BrainCircuit size={48} className="text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" /></div><div className="mt-12 text-center space-y-4"><p className="text-xl font-black italic text-white uppercase tracking-tighter">Synthesizing Tactical Matrix</p></div></div>)}</div>
          )}

          {activeTab === 'immunity' && (
            <div className="space-y-8 animate-in fade-in pb-12"><div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5"><p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projectile Resistance Cap</p><div className={`text-6xl sm:text-7xl md:text-8xl font-black italic tracking-tighter ${totalImmunity >= 100 ? 'text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'text-white'}`}>{totalImmunity.toFixed(1)}%</div><p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">{totalImmunity >= 100 ? 'SYSTEM IMMUNE' : 'VULNERABILITY DETECTED'}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[{ label: 'Dragon Rings (Max 2)', val: immunitySetup.rings, set: (v: number) => setImmunitySetup(p => ({...p, rings: v})) }, { label: 'Atreus Level 80 (+7%)', check: immunitySetup.atreus120, set: (v: boolean) => setImmunitySetup(p => ({...p, atreus120: v})) }, { label: 'Onir 7-Star Passive (+10%)', check: immunitySetup.onir120, set: (v: boolean) => setImmunitySetup(p => ({...p, onir120: v})) }, { label: 'Bulletproof Locket (+15%)', check: immunitySetup.locket, set: (v: boolean) => setImmunitySetup(p => ({...p, locket: v})) }].map((row, i) => (<div key={i} className="p-6 bg-gray-900/60 border border-white/5 rounded-[2.5rem] flex items-center justify-between"><span className="text-[11px] font-black text-gray-400 uppercase italic">{row.label}</span>{row.hasOwnProperty('val') ? (<input type="number" max="2" min="0" value={row.val} onChange={e => (row as any).set(Number(e.target.value))} className="bg-white/5 w-12 text-center text-white font-black rounded-lg p-1" />) : (<button onClick={() => (row as any).set(!row.check)} className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${row.check ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-white/10'}`}>{row.check && <CheckCircle2 size={14}/>}</button>)}</div>))}</div></div>
          )}

          {activeTab === 'dps' && (
             <div className="space-y-8 animate-in fade-in pb-12"><div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5"><p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projected Effective DPS</p><div className="text-6xl sm:text-7xl md:text-8xl font-black text-white italic tracking-tighter">{calculatedDPS.toLocaleString()}</div><p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Integrated Combat Potency</p></div><div className="grid grid-cols-2 gap-4">{[{ k: 'baseAtk', l: 'Raw ATK' }, { k: 'critChance', l: 'Crit Chance %' }, { k: 'critDmg', l: 'Crit Dmg %' }, { k: 'atkSpeed', l: 'Atk Speed %' }].map(s => (<div key={s.k} className="p-8 bg-gray-900/60 border border-white/5 rounded-[3rem]"><label className="text-10px] font-black text-gray-600 uppercase block mb-2">{s.l}</label><input type="number" value={(calcStats as any)[s.k]} onChange={e => setCalcStats(p => ({...p, [s.k]: Number(e.target.value)}))} className="bg-transparent text-white text-3xl font-black outline-none w-full" /></div>))}</div></div>
          )}

          {activeTab === 'farming' && (
            <div className="space-y-6 pb-40 animate-in fade-in">
              {/* Ancient Maze Portal Guide */}
              <div className="p-6 bg-gray-950/60 border border-white/5 rounded-[2.5rem] space-y-4 shadow-xl">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic flex items-center gap-2">
                    <Map size={14} className="text-orange-500" /> Ancient Maze Portal Intel
                  </h4>
                  <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest animate-pulse italic">Priority: Tactical Shards</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-green-600/10 border border-green-500/20 rounded-2xl flex flex-col items-center text-center gap-2 group transition-all hover:bg-green-600/20 hover:scale-105 active:scale-95">
                    <Package size={20} className="text-green-500" />
                    <div>
                      <p className="text-[7px] font-black text-green-700 uppercase leading-none mb-1">Green</p>
                      <p className="text-[9px] font-black text-white italic uppercase truncate tracking-tight">Equipment</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col items-center text-center gap-2 group transition-all hover:bg-blue-600/20 hover:scale-105 active:scale-95">
                    <Gem size={20} className="text-blue-500" />
                    <div>
                      <p className="text-[7px] font-black text-blue-700 uppercase leading-none mb-1">Blue</p>
                      <p className="text-[9px] font-black text-white italic uppercase truncate tracking-tight">Sapphires</p>
                    </div>
                  </div>
                  <div className="relative p-4 bg-purple-600/20 border-2 border-purple-500/50 rounded-2xl flex flex-col items-center text-center gap-2 group transition-all hover:bg-purple-600/30 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-[6px] font-black text-white px-2 py-0.5 rounded-full whitespace-nowrap tracking-widest border border-purple-400 shadow-md">BEST CHOICE</div>
                    <Sparkles size={20} className="text-purple-400 animate-pulse" />
                    <div>
                      <p className="text-[7px] font-black text-purple-700 uppercase leading-none mb-1">Purple</p>
                      <p className="text-[9px] font-black text-white italic uppercase truncate tracking-tight">Soulstones</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] italic flex items-center gap-2"><Zap size={14} className="animate-pulse" /> ACTIVE OPERATIONS (TODAY)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DAILY_EVENTS.filter(e => e.days.includes(currentDay)).map(event => (
                    <div key={event.id} className={`p-6 bg-gradient-to-br ${getEventColor(event.color)} rounded-[2.5rem] border shadow-2xl flex flex-col justify-between h-full relative overflow-hidden group`}>
                      <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity"><MapPin size={80} /></div>
                      <div className="flex justify-between items-start mb-5 relative z-10"><div><h5 className="text-base font-black text-white uppercase italic tracking-tighter">{event.name}</h5><p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-0.5">Tactical Objective Active</p></div><div className="p-3 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-md"><Timer size={16} className="text-white" /></div></div>
                      <div className="space-y-3 relative z-10"><p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Expected Spoils</p><div className="flex flex-wrap gap-2">{event.rewards.map(r => (<span key={r} className="px-3 py-1 bg-black/40 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-tighter">{r}</span>))}</div></div>
                      <div className="mt-5 pt-4 border-t border-white/10 relative z-10"><button onClick={() => { setActiveTab('events'); playSfx('tab'); }} className="text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:opacity-70">VIEW INTEL BRIEFING <ChevronRight size={10} /></button></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900/60 rounded-[2rem] border border-white/5 sticky top-[130px] z-50 backdrop-blur-xl shadow-lg mt-8"><SortHeader label="Resource" field="resource" currentSort={farmingSort} /><SortHeader label="Chapter" field="chapter" currentSort={farmingSort} /><SortHeader label="Efficiency" field="efficiency" currentSort={farmingSort} /><SortHeader label="Avg Time" field="avgTime" currentSort={farmingSort} /></div>
              {filteredFarming.length === 0 ? (<div className="text-center py-20 opacity-30"><Compass size={48} className="mx-auto mb-4 animate-spin-slow" /><p className="text-xs font-black uppercase tracking-widest">No routes found</p></div>) : (filteredFarming.map((route) => (
                    <div key={route.id} className={`bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedFarmingId === route.id ? 'ring-2 ring-orange-500/30 shadow-4xl scale-[1.01]' : 'hover:border-white/20'}`}>
                      <button onClick={() => { setExpandedFarmingId(expandedFarmingId === route.id ? null : route.id); playSfx('click'); }} className="w-full p-6 flex items-center justify-between group relative overflow-hidden"><div className="flex items-center gap-6 text-left relative z-10"><div className={`w-16 h-16 rounded-3xl flex flex-col items-center justify-center font-black border transition-colors ${route.efficiency === 'SSS' ? 'text-red-500 border-red-500/20 bg-red-500/5' : route.efficiency === 'SS' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5'}`}><span className="text-[10px] uppercase opacity-60">Eff</span><span className="text-xl leading-none">{route.efficiency}</span></div><div><div className="flex items-center gap-2"><span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${route.difficulty === 'Hero' ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'}`}>{route.difficulty}</span><p className="text-lg font-black text-white uppercase italic tracking-tighter">{route.chapter}</p></div><div className="flex items-center gap-4 mt-1"><p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{route.resource}</p><span className="w-1 h-1 bg-gray-700 rounded-full"></span><p className="text-[9px] font-medium text-gray-500 italic">Est. {route.avgTime}</p></div></div></div><div className="flex items-center gap-3 relative z-10"><div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5"><User size={12} className="text-gray-500" /><span className="text-[9px] font-black text-gray-300 uppercase">{route.bestHero}</span></div><ChevronDown size={20} className={`text-gray-700 transition-transform duration-500 ${expandedFarmingId === route.id ? 'rotate-180 text-orange-500' : ''}`} /></div></button>
                      {expandedFarmingId === route.id && (<div className="p-8 space-y-8 bg-black/40 border-t border-white/5 animate-in slide-in-from-top-4 duration-300"><div className="grid grid-cols-2 sm:grid-cols-4 gap-4"><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Efficiency</p><p className="text-xs font-black text-white italic">{route.efficiency} Rank</p></div><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Loot Projection</p><p className="text-xs font-black text-white italic">{route.lootRate}</p></div><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Avg Duration</p><p className="text-xs font-black text-white italic">{route.avgTime}</p></div><div className="p-4 bg-white/5 border border-white/5 rounded-2xl"><p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Tactical Asset</p><p className="text-xs font-black text-white italic">{route.bestHero}</p></div></div><div className="space-y-6"><div className="space-y-2"><h5 className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest"><MapPin size={12}/> Tactical Briefing</h5><p className="text-xs text-gray-300 leading-relaxed italic font-medium bg-black/20 p-4 rounded-2xl border border-white/5">{route.strategy}</p></div><div className="space-y-2"><h5 className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest"><Lightbulb size={12}/> Mentor's Pro-Tip</h5><div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[11px] text-blue-100/80 italic font-bold">{route.proTip}</div></div></div></div>)}
                    </div>
                  )))}
            </div>
          )}

          {activeTab === 'relics' && (
            <div className="space-y-8 animate-in fade-in pb-12"><div className="p-10 bg-gradient-to-br from-purple-900/10 via-gray-950 to-purple-950/5 border border-purple-500/20 rounded-[4rem] text-center shadow-4xl"><h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center justify-center gap-4"><Archive size={32} className="text-purple-500 animate-pulse"/> Relic Archive Protocols</h3><p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] italic">Full Tactical Database Sync: v6.3.0</p></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredRelics.length === 0 ? (<div className="col-span-full py-20 text-center opacity-30"><Search size={48} className="mx-auto mb-4" /><p className="text-xs font-black uppercase tracking-widest">No matching relics found</p></div>) : (filteredRelics.map((r, index) => (
                      <div key={r.id} onClick={() => { setSelectedItem({...r, category: 'Relic'}); playSfx('click'); }} className={`relative p-8 rounded-[2.5rem] border transition-all cursor-pointer group active:scale-95 flex flex-col items-center text-center ${getRelicStyles(r.tier).card}`}><div className={`w-16 h-16 rounded-2xl mb-5 flex items-center justify-center border transition-transform group-hover:rotate-12 ${getRelicStyles(r.tier).iconContainer}`}><RelicIcon type={r.iconType} className="w-8 h-8" /></div><p className="text-[11px] font-black text-white uppercase italic tracking-tighter mb-1 leading-tight">{r.name}</p><div className="flex items-center gap-2 mt-1"><span className={`text-[8px] font-bold uppercase tracking-widest ${r.tier === 'Holy' ? 'text-red-400' : r.tier === 'Radiant' ? 'text-yellow-400' : 'text-blue-400'}`}>{r.tier} Archive</span></div></div>
                    )))}
              </div>
            </div>
          )}

          {activeTab === 'jewels' && (
            <div className="space-y-8 animate-in fade-in pb-12">
              <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400"><Binary size={24}/></div><div><h3 className="text-xl font-black text-white uppercase italic tracking-tight">Jewel Laboratory</h3></div></div><div className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-center"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Slot Total LV</p><p className="text-sm font-black text-blue-400">{jewelSimLevel}</p></div></div><input type="range" min="4" max="48" value={jewelSimLevel} onChange={(e) => setJewelSimLevel(parseInt(e.target.value))} className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-blue-500" /><div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest px-1"><span>LV 4</span><span>LV 28</span><span>LV 48</span></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJewels.map(j => (
                  <div key={j.id} onClick={() => { setSelectedItem({...j, category: 'Jewel'}); playSfx('click'); }} className="cursor-pointer group relative"><div className={`p-8 bg-gradient-to-br ${getJewelColorClasses(j.color)} rounded-[3rem] border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 flex flex-col gap-6 h-full`}><div className="flex justify-between items-start"><div className="flex items-center gap-4"><div className="w-14 h-14 bg-black/40 rounded-[1.4rem] border border-white/10 flex items-center justify-center transition-transform duration-500"><Gem size={28} /></div><div><h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{j.name}</h4><p className="text-[10px] font-bold opacity-60 uppercase mt-1">Individual Gem</p></div></div></div><div className="p-4 bg-black/20 rounded-2xl border border-white/5"><p className="text-[9px] font-black uppercase text-gray-400 mb-1">LV {Math.min(12, Math.floor(jewelSimLevel / 4))} Projection</p><p className="text-sm font-black text-white italic">{j.statType} +{Math.round(j.baseStat + (j.statPerLevel * Math.max(0, Math.floor(jewelSimLevel / 4) - 1)))}</p></div></div></div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="space-y-10 animate-in fade-in pb-20"><div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[3rem] text-center"><h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Stutter-Step Reflex Trainer</h4><p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-2 block">Calibrate Weapon Weight</p><div className="grid grid-cols-4 gap-2">{Object.entries(WEAPON_SPEEDS).map(([key]) => (<button key={key} onClick={() => setSelectedWeapon(key)} className={`p-2 rounded-lg text-xs font-bold border transition-all ${selectedWeapon === key ? 'bg-amber-600 border-amber-500 text-white shadow-lg scale-105' : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}>{key}</button>))}</div></div><div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center"><div className={`absolute w-20 h-20 rounded-full border-4 z-10 flex items-center justify-center bg-gray-900 transition-all duration-100 ${efficiency >= 140 ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)] scale-110' : efficiency === 0 && stutterStreak === 0 ? 'border-red-500 opacity-50' : 'border-gray-600'}`}><span className="text-3xl">⚔️</span></div><svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192"><circle cx="96" cy="96" r="82" fill="transparent" stroke="#1f2937" strokeWidth="12" /><circle cx="96" cy="96" r="82" fill="transparent" stroke="#15803d" strokeWidth="12" strokeDasharray="103 515" strokeDashoffset="-309" strokeLinecap="round" className="opacity-40" /><circle cx="96" cy="96" r="82" fill="transparent" stroke={stutterProgress >= 60 && stutterProgress <= 80 ? '#fbbf24' : '#6b7280'} strokeWidth="12" strokeDasharray="515" strokeDashoffset={515 - (515 * stutterProgress) / 100} strokeLinecap="round" className="transition-all duration-75 ease-linear" /></svg>{stutterStreak > 0 && (<div className="absolute -bottom-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-black animate-bounce shadow-lg">{stutterStreak}x COMBO</div>)}</div><div className="flex flex-col items-center gap-8"><button onMouseDown={() => { if (!stutterActive) return; let score = 0; let feedback = "MISS!"; if (stutterProgress >= 60 && stutterProgress <= 80) { const bonus = 20 - (stutterProgress - 60); score = 140 + bonus; feedback = score >= 155 ? "FRAME PERFECT!" : "PERFECT!"; setStutterStreak(s => s + 1); } else if (stutterProgress > 80 && stutterProgress < 100) { score = 100; feedback = "LATE"; setStutterStreak(0); } else { score = 0; feedback = "MISS!"; setStutterStreak(0); } setEfficiency(Math.round(score)); setStutterFeedback(feedback); setStutterProgress(0); playSfx('click'); }} className="w-44 h-44 rounded-full bg-orange-600 border-[10px] border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.3)] flex items-center justify-center text-white font-black text-2xl uppercase italic active:scale-90 transition-all select-none">ATTACK</button><button onClick={() => { setStutterActive(!stutterActive); setStutterFeedback(null); setStutterProgress(0); setEfficiency(0); playSfx('tab'); }} className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border transition-all ${stutterActive ? 'bg-red-600/20 border-red-500/50 text-red-500' : 'bg-green-600/20 border-green-500/50 text-green-500'}`}>{stutterActive ? 'HALT SIMULATION' : 'INITIALIZE NEURAL LINK'}</button></div></div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-gray-950/98 backdrop-blur-3xl border-t border-white/5 p-4 flex flex-col items-center shadow-2xl">
        <div ref={navScrollRef} className="w-full max-w-3xl overflow-x-auto no-scrollbar flex items-center gap-2 px-4 pb-2 touch-pan-x draggable-content" onMouseDown={(e) => handleDragStart(e, navScrollRef)}>{NAV_ITEMS.map(t => (<button key={t.id} onClick={(e) => handleInteractiveClick(e, () => handleTabChange(t.id as any))} className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl transition-all duration-300 transform active:scale-90 relative ${activeTab === t.id ? 'text-orange-500 bg-white/5 ring-1 ring-white/10' : 'text-gray-500'}`}><t.icon size={20} className={activeTab === t.id ? 'animate-pulse' : ''} /><span className="text-[8px] font-black uppercase tracking-tight">{t.label}</span></button>))}</div>
      </nav>

      {compareHeroIds.length > 0 && activeTab === 'meta' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] w-full max-w-[440px] px-6 animate-in zoom-in duration-300 pointer-events-none">
          <div className="relative p-1 overflow-hidden rounded-[2.5rem] pointer-events-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-white to-blue-500 animate-[shimmer_3s_infinite] opacity-40"></div>
            <div className="relative bg-gray-950/95 backdrop-blur-3xl rounded-[2.3rem] p-4 flex items-center justify-between shadow-[0_0_80px_rgba(59,130,246,0.3)] ring-1 ring-white/20">
              <div className="flex items-center gap-4 px-2"><div className="relative group"><div className="absolute -inset-2 bg-blue-500/20 rounded-full blur animate-pulse"></div><div className="relative w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30"><Scale size={28} /></div></div><div className="text-left"><p className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none flex items-center gap-2">Protocol <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span></p><p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5 tracking-widest">{compareHeroIds.length} / 3 Heroes Locked</p><p className="text-[8px] font-black text-blue-500 uppercase mt-1 tracking-tighter opacity-70">Status: ARCHIVE LINK ACTIVE</p></div></div>
              <div className="flex items-center gap-3"><button onClick={() => { setCompareHeroIds([]); playSfx('click'); }} className="p-3 text-gray-500 hover:text-red-500 transition-colors group"><X size={24} className="group-hover:rotate-90 transition-transform duration-300" /></button><button onClick={() => { setIsCompareModalOpen(true); playSfx('click'); }} disabled={compareHeroIds.length < 2} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-30 text-white px-10 py-4 rounded-2xl text-[14px] font-black uppercase tracking-[0.1em] italic transition-all shadow-[0_0_25px_rgba(249,115,22,0.4)] active:scale-95 active:shadow-inner border-b-4 border-orange-800">LAUNCH</button></div>
            </div>
          </div>
        </div>
      )}

      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsCompareModalOpen(false)} /><div className="relative w-full max-w-4xl bg-[#030712] border border-white/10 rounded-[3.5rem] p-8 md:p-12 max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 shadow-4xl overflow-x-hidden ring-1 ring-white/5"><div className="flex items-center justify-between mb-10"><div className="flex items-center gap-4"><div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-500"><Combat size={28} /></div><div><h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Tactical Head-to-Head</h2><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Archive Delta Analysis Protocol</p></div></div><button onClick={() => setIsCompareModalOpen(false)} className="p-4 bg-white/5 rounded-full border border-white/10 text-gray-400 hover:text-white transition-all"><X size={24}/></button></div>
            {comparedHeroes.length === 2 && comparisonVerdict && (<div className="mb-12 p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none"><ScanIcon size={120} /></div><div className="flex-1 space-y-4 text-center md:text-left relative z-10"><h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">Neural Link Verdict</h4><p className="text-xl font-black text-white italic leading-tight">"{comparisonVerdict.verdict}"</p><p className="text-[13px] text-gray-400 font-medium italic">Choosing between these legends depends on your chapter push style.</p></div><div className="w-px h-24 bg-white/10 hidden md:block" /><div className="flex items-center gap-6"><div className="text-center"><p className="text-[9px] font-black text-gray-500 uppercase mb-2">Alpha Unit</p><div className="w-12 h-12 bg-gray-900 rounded-xl border border-white/10 flex items-center justify-center text-xl">1</div></div><div className="text-2xl font-black text-blue-500 italic">VS</div><div className="text-center"><p className="text-[9px] font-black text-gray-500 uppercase mb-2">Beta Unit</p><div className="w-12 h-12 bg-gray-900 rounded-xl border border-white/10 flex items-center justify-center text-xl">2</div></div></div></div>)}
            <div className="grid grid-cols-[140px_1fr_1fr] md:grid-cols-[180px_1fr_1fr] gap-4 md:gap-8 items-stretch"><div className="space-y-6 pt-32">{['Meta Tier', 'Global L120', 'Cost', 'Combat Style', 'Evo 4★ Perk'].map(label => (<div key={label} className="h-28 flex items-center px-4 bg-white/5 rounded-2xl border border-white/5"><span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-tight">{label}</span></div>))}</div>
              {comparedHeroes.map((hero, idx) => (
                  <div key={hero.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`p-6 rounded-3xl text-center flex flex-col items-center gap-4 relative border transition-all ${idx === 0 ? 'bg-orange-600/5 border-orange-500/20' : 'bg-blue-600/5 border-blue-500/20'}`}><div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-4xl shadow-inner">🦸</div><h3 className="text-xl md:text-2xl font-black text-white uppercase italic truncate w-full tracking-tighter">{hero.name}</h3><div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 rounded-full border border-white/10 text-[8px] font-black text-gray-400 uppercase tracking-widest">UNIT 0{idx + 1}</div></div>
                    <div className={`h-28 p-6 bg-black/40 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${comparisonVerdict?.tierWinner === idx ? 'border-yellow-500/40 ring-1 ring-yellow-500/20 shadow-lg' : 'border-white/5'}`}><Badge tier={hero.tier} />{comparisonVerdict?.tierWinner === idx && <div className="flex items-center gap-1 text-yellow-500 text-[9px] font-black uppercase tracking-tighter"><Crown size={10} /> Dominant</div>}</div>
                    <div className={`h-28 p-6 bg-black/40 border rounded-2xl flex flex-col items-center justify-center text-center transition-all ${comparisonVerdict?.bonusWinner === idx ? 'border-green-500/40 ring-1 ring-green-500/20' : 'border-white/5'}`}><p className="text-sm md:text-base font-black text-orange-500 italic uppercase">{hero.globalBonus120}</p>{comparisonVerdict?.bonusWinner === idx && <div className="mt-1 flex items-center gap-1 text-green-500 text-[9px] font-black uppercase tracking-tighter"><TrendingUp size={10} /> Offensive Edge</div>}</div>
                    <div className="h-28 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center"><p className="text-[11px] font-bold text-purple-400 uppercase italic leading-tight">{hero.shardCost || "Event Exclusive"}</p></div>
                    <div className="h-28 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center overflow-y-auto no-scrollbar"><p className="text-[10px] md:text-[11px] font-medium text-blue-400 italic leading-snug">{hero.uniqueEffect || "Standard Build"}</p></div>
                    <div className="h-28 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center overflow-y-auto no-scrollbar"><p className="text-[10px] md:text-[11px] font-medium text-yellow-500/80 italic leading-snug">{hero.evo4Star || "Passive Only"}</p></div>
                  </div>
                ))}
            </div>
            <div className="mt-14 pt-8 border-t border-white/5 flex items-center justify-between opacity-30"><p className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">Alpha & Beta units isolated for architectural delta analysis.</p><p className="text-[8px] font-bold text-gray-700 uppercase">Archive Link Status: Stable</p></div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedItem(null)} /><div className="relative w-full max-w-3xl bg-[#030712] border border-white/10 rounded-[3.5rem] p-8 sm:p-14 max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 shadow-4xl ring-1 ring-white/5"><button onClick={() => setSelectedItem(null)} className="absolute top-10 right-10 p-5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-transform active:scale-90 z-20"><X size={32}/></button>
            <div className="space-y-12 pb-10"><div className="space-y-6"><div className="flex flex-wrap items-center gap-3"><Badge tier={selectedItem.tier} /><span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-600/5 px-3 py-1 rounded-lg border border-orange-500/10">{selectedItem.category} Protocols</span></div><h2 className="text-5xl sm:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedItem.name}</h2><p className="text-[15px] text-gray-400 font-medium italic opacity-90 leading-relaxed max-w-lg">{selectedItem.desc}</p></div>
              {selectedItem.category === 'Hero' ? (
                <div className="space-y-10"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-8 bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-inner space-y-4"><h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-[0.2em]"><BookOpen size={14}/> Tactical Bio</h4><div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5"><p className="text-[13px] text-gray-300 font-medium italic leading-[1.7]">{selectedItem.bio || "No historical data available for this unit."}</p></div></div><div className="p-8 bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-inner space-y-6"><h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-[0.3em]"><Tag size={14}/> Acquisition Info</h4><div className="space-y-6"><div className="space-y-1"><p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Unlocking Threshold</p><p className="text-sm font-black text-purple-400 uppercase italic leading-tight">{selectedItem.shardCost || "Limited Event"}</p></div><div className="space-y-1"><p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">Aesthetic Peak</p><p className="text-sm font-black text-yellow-500 uppercase italic leading-tight">{selectedItem.bestSkin || "Standard Issue"}</p></div><div className="space-y-1"><p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Neural Link L120 Payload</p><p className="text-sm font-black text-orange-500 uppercase italic leading-tight">{selectedItem.globalBonus120}</p></div></div></div></div><div className="grid grid-cols-1 gap-6"><div className="p-10 bg-blue-600/5 border border-blue-500/20 rounded-[3.5rem] shadow-inner relative overflow-hidden group"><div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity"><BrainCircuit size={140} /></div><h4 className="text-[11px] font-black text-blue-500 uppercase mb-8 flex items-center gap-3 tracking-[0.4em] relative z-10"><Scan size={24}/> NEURAL SYNTHESIS (META STRATEGY)</h4><div className="text-[15px] text-gray-200 font-medium leading-[2] italic whitespace-pre-wrap relative z-10 bg-black/40 p-8 rounded-[2.5rem] border border-white/5">{selectedItem.deepLogic}</div></div></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {selectedItem.starMilestones && selectedItem.starMilestones.length > 0 && (<div className="space-y-6"><h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-3 px-4"><StarIcon size={20} className="text-yellow-500"/> EVOLUTION PATHWAY</h4><div className="grid grid-cols-1 gap-4">{selectedItem.starMilestones.map((milestone: StarMilestone, mIdx: number) => (<div key={mIdx} className={`p-6 bg-gray-900 border rounded-3xl flex items-center gap-6 relative transition-all hover:bg-white/5 ${milestone.stars >= 7 ? 'border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : 'border-white/5'}`}><div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-black/60 rounded-2xl border border-white/10 shadow-inner"><span className="text-[10px] font-black text-gray-500 uppercase leading-none">Star</span><span className="text-2xl font-black text-white italic leading-none mt-1">{milestone.stars}</span></div><div className="flex-1 space-y-1">{milestone.isGlobal && (<span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/30 mb-1"><Globe size={10} /> Global Bonus</span>)}<p className={`text-[13px] font-bold italic leading-relaxed ${milestone.stars >= 7 ? 'text-yellow-400' : 'text-gray-200'}`}>"{milestone.effect}"</p></div></div>))}</div></div>)}
                    {selectedItem.sunMilestones && selectedItem.sunMilestones.length > 0 && (<div className="space-y-6"><h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-3 px-4"><Sun size={20} className="text-orange-500 animate-pulse"/> SUN EVOLUTION DETAILS</h4><div className="grid grid-cols-1 gap-4">{selectedItem.sunMilestones.map((milestone: SunMilestone, mIdx: number) => (<div key={mIdx} className="p-6 bg-orange-950/5 border border-orange-500/10 rounded-3xl flex items-center gap-6 relative transition-all hover:bg-orange-600/10"><div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-orange-600/20 rounded-2xl border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"><span className="text-[10px] font-black text-orange-700 uppercase leading-none">Sun</span><span className="text-2xl font-black text-orange-500 italic leading-none mt-1">{milestone.level}</span></div><div className="flex-1 space-y-1">{milestone.isGlobal && (<span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-600/20 text-orange-400 text-[8px] font-black uppercase rounded border border-blue-500/30 mb-1"><Globe size={10} /> Solar Global</span>)}<p className="text-[13px] font-bold italic leading-relaxed text-gray-200">"{milestone.effect}"</p></div><div className="absolute top-2 right-4 text-[8px] font-black text-orange-500 uppercase tracking-widest opacity-40 italic">Radiant Protocols</div></div>))}</div></div>)}
                  </div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-8 bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-inner"><h4 className="text-[10px] font-black text-gray-500 uppercase mb-6 flex items-center gap-2 tracking-[0.2em]"><UserPlus size={14}/> Assist Heroes</h4><div className="flex flex-wrap gap-2">{selectedItem.assistHeroes?.map((heroId: string) => { const h = HERO_DATA.find(x => x.id.toLowerCase() === heroId.toLowerCase() || x.name === heroId); return (<button key={heroId} onClick={() => h && setSelectedItem(h)} className="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-gray-300 uppercase italic hover:border-blue-500/50 hover:text-white transition-all shadow-sm">{h?.name || heroId}</button>); })}</div></div><div className="p-8 bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-inner"><h4 className="text-[10px] font-black text-gray-500 uppercase mb-6 flex items-center gap-2 tracking-[0.2em]"><HeartHandshake size={14}/> Best Gear Pairs</h4><div className="flex flex-wrap gap-2">{selectedItem.bestPairs?.map((pairId: string) => { const item = findItemByName(pairId); return (<button key={pairId} onClick={() => item && setSelectedItem(item)} className="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-orange-500 uppercase italic hover:border-orange-500/50 hover:text-white transition-all shadow-sm">{item?.name || pairId}</button>); })}</div></div></div>
                  {selectedItem.gearSets && selectedItem.gearSets.length > 0 && (<div className="space-y-6"><h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-3 px-4"><Award size={20}/> SIGNATURE META LOADOUT</h4>{selectedItem.gearSets.map((set: GearSet, sIdx: number) => (<div key={sIdx} className="p-10 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-[4rem] shadow-4xl space-y-10"><div className="flex items-center justify-between"><h5 className="text-2xl font-black text-white italic uppercase tracking-tighter">{set.name}</h5><button onClick={() => handleExportBuild(selectedItem.name, set)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-blue-400 border border-white/5"><Download size={22}/></button></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-5"><BuildSlot label="Weapon" name={set.weapon} icon={Sword} /><BuildSlot label="Armor" name={set.armor} icon={Shield} /><BuildSlot label="Bracelet" name={set.bracelet} icon={Zap} /><BuildSlot label="Locket" name={set.locket} icon={Target} /><BuildSlot label="Book" name={set.book} icon={Book} /><BuildSlot label="Rings" name={set.rings[0]} icon={Circle} /></div><div className="p-8 bg-orange-600/5 border border-orange-500/20 rounded-[2.5rem]"><p className="text-[10px] font-black text-orange-500 uppercase mb-4 tracking-widest flex items-center gap-2"><Sparkles size={14}/> Synergy Protocol</p><p className="text-[14px] text-gray-200 italic leading-[1.8] font-medium">{set.synergy}</p></div></div>))}</div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-10"><div className="space-y-4">{selectedItem.deepLogic && (<div className="p-10 bg-gray-900 border border-white/10 rounded-[3rem] shadow-inner relative overflow-hidden group"><div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><BrainCircuit size={100} /></div><h4 className="text-[11px] font-black text-orange-500 uppercase mb-5 flex items-center gap-3 tracking-[0.3em] relative z-10"><ScrollText size={22}/> Deep Logic Summary</h4><div className="text-[15px] text-gray-100 font-medium leading-[1.8] italic whitespace-pre-wrap relative z-10 bg-black/40 p-8 rounded-[2rem] border border-white/5"><FormattedMessage text={selectedItem.deepLogic} role="model" /></div></div>)}</div>
                  {selectedItem.category === 'Totem' && (<div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[2.5rem]"><p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Totem Power</p><p className="text-2xl font-black text-white italic">{selectedItem.desc}</p></div>)}
                  {selectedItem.category === 'Relic' && (<div className="space-y-8"><div className="p-8 bg-gray-900/40 rounded-[2.5rem] border border-white/5 space-y-3"><h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><ScrollText size={16} /> Relic Description</h4><p className="text-[14px] text-gray-100 font-medium leading-relaxed italic bg-black/20 p-6 rounded-2xl border border-white/5">{selectedItem.lore}</p></div><div className="grid grid-cols-2 gap-4"><div className="p-6 bg-white/5 rounded-2xl border border-white/5"><p className="text-[10px] font-black text-gray-500 uppercase mb-1">Archive Source</p><p className="text-sm font-black text-white uppercase italic">{selectedItem.source || "General Archive"}</p></div><div className="p-6 bg-white/5 rounded-2xl border border-white/5"><p className="text-[10px] font-black text-gray-500 uppercase mb-1">Primary Perk</p><p className="text-sm font-black text-orange-500 uppercase italic">{selectedItem.effect}</p></div></div></div>)}
                </div>
              )}
            </div>
            <div className="mt-14 pt-10 border-t border-white/5 flex items-center justify-between opacity-30"><div className="flex items-center gap-3"><Terminal size={14} className="text-orange-500" /><span className="text-[9px] font-black uppercase tracking-widest text-gray-500">System Signature: v6.3.0_ZVA</span></div><p className="text-[8px] font-bold text-gray-700">© 2025 ZA ARMORY CORE</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
