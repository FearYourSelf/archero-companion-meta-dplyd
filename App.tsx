
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
  ChevronUp, ArrowDownWideNarrow, ArrowUpWideNarrow, Check, Atom, RotateCcw, Scale, Milestone
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, SET_BONUS_DESCRIPTIONS, FARMING_ROUTES, DRAGON_DATA, FarmingRoute, REFINE_TIPS
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic, GearSet } from './types';
import { Badge, Card } from './components/UI';

const TOUR_STEPS = [
  { title: 'Welcome, Grandmaster', content: 'Welcome to the V6.3 Archive. This tool contains the complete 2026 Meta knowledge base.' },
  { title: 'Smart Search', content: 'Use the top bar to filter the database by name, tier, or ability.' },
  { title: 'Categorized Archives', content: 'Jump between Heroes, Weapons, and the new Dragon Squad builder using the category tabs.' },
  { title: 'Deep Dive', content: 'Tap "Deep Dive" on any item to reveal Hidden Stats and Titan Tales perks.' },
  { title: 'The Lab', content: 'Access the Formula Calculator and Squad Optimizer in the bottom tabs.' },
];

// --- Fuzzy Match Logic ---
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

// --- Custom Styled Select Component ---
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
        <span className="truncate pr-2">{selected ? selected.name : placeholder}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-[110%] left-0 w-full z-[1000] bg-gray-950/95 backdrop-blur-3xl border border-white/10 rounded-2xl py-2 shadow-4xl max-h-[300px] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2">
          {options.map(opt => (
            <button 
              key={opt.id}
              onClick={() => { onChange(opt.id); setIsOpen(false); }}
              className={`w-full px-6 py-3 text-left hover:bg-orange-600/10 transition-colors border-b border-white/5 last:border-0 ${value === opt.id ? 'text-orange-500' : 'text-gray-400'}`}
            >
              <p className="text-[11px] font-black uppercase italic truncate">{opt.name}</p>
              {opt.subtitle && <p className="text-[8px] font-bold opacity-50 uppercase tracking-widest mt-0.5 truncate">{opt.subtitle}</p>}
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

  // --- TUTORIAL STATE ---
  const [runTour, setRunTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenV6Tour');
    if (!hasSeen) {
      setTimeout(() => setRunTour(true), 1500); // Wait 1.5s before starting
    }
  }, []);

  const closeTour = () => {
    setRunTour(false);
    localStorage.setItem('hasSeenV6Tour', 'true');
  };

  const handleNextTourStep = () => {
    playSfx('click');
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      closeTour();
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('All');
  const [relicTierFilter, setRelicTierFilter] = useState<'All' | 'Holy' | 'Radiant' | 'Faint'>('All');
  const [relicSourceFilter, setRelicSourceFilter] = useState<string>('All');
  const [sssOnly, setSssOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [maintenanceToast, setMaintenanceToast] = useState(false);
  
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

  useEffect(() => {
    let interval: number;
    if (stutterActive) {
      interval = window.setInterval(() => {
        setStutterProgress((prev) => {
          if (prev >= 100) {
            setStutterStreak(0);
            setStutterFeedback("MISS!");
            return 0;
          }
          return prev + 2;
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [stutterActive]);

  const [compareHeroIds, setCompareHeroIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [farmingSearch, setFarmingSearch] = useState('');
  const [farmingCategory, setFarmingCategory] = useState<'All' | FarmingRoute['resource']>('All');
  const [farmingSort, setFarmingSort] = useState<{ field: 'resource' | 'chapter' | 'efficiency' | 'avgTime', direction: 'asc' | 'desc' }>({ 
    field: 'efficiency', 
    direction: 'desc' 
  });
  const [expandedFarmingId, setExpandedFarmingId] = useState<string | null>(null);
  const [jewelSimLevel, setJewelSimLevel] = useState<number>(10);
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

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

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

  const handleHeroCompareToggle = (id: string) => {
    playSfx('click');
    setCompareHeroIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(hid => hid !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
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
    } catch (e) {
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Archived offline.", timestamp: Date.now() }]);
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
    } catch (e) { setSimResult('Neural core error.'); }
    finally { setIsSimulating(false); }
  };

  const copySimResult = () => {
    if (simResult) {
      navigator.clipboard.writeText(simResult);
      playSfx('click');
      setIsSimMenuOpen(false);
      alert('Report copied to clipboard!');
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
    const text = `ARCHERO TACTICAL BUILD: ${set.name}\nHero: ${heroName}\n--- CORE LOADOUT ---\nWeapon: ${set.weapon}\nArmor: ${set.armor}\nRings: ${set.rings.join(' + ')}\nBracelet: ${set.bracelet}\nLocket: ${set.locket}\nBook: ${set.book}\n--- SYNERGY RESONANCE ---\n${set.synergy}\n--- Generated via ZV GRANDMASTER ---`.trim();
    navigator.clipboard.writeText(text);
    alert(`${set.name} configuration exported to tactical clipboard.`);
  };

  const findItemByName = (name: string) => {
    return [...GEAR_DATA, ...DRAGON_DATA].find(i => i.name === name || i.id === name);
  };

  const displayOrder: GearCategory[] = ['Hero', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book', 'Spirit', 'Dragon', 'Pet', 'Relic', 'Jewel', 'Totem', 'Egg', 'Glyph'];
  const categoryIcons: Record<string, any> = { 'All': LayoutGrid, 'Hero': User, 'Weapon': Sword, 'Armor': Shield, 'Ring': Circle, 'Locket': Target, 'Bracelet': Zap, 'Book': Book, 'Spirit': Ghost, 'Dragon': Flame, 'Pet': Dog, 'Egg': Egg, 'Totem': Tower, 'Relic': Box, 'Jewel': Disc, 'Glyph': Layers };
  const categoryEmojis: Record<string, string> = { 'Hero': '🦸', 'Weapon': '⚔️', 'Armor': '🛡️', 'Ring': '💍', 'Bracelet': '⚡', 'Locket': '🎯', 'Book': '📖', 'Spirit': '👻', 'Dragon': '🐉', 'Pet': '🐾', 'Relic': '🏺', 'Jewel': '💎', 'Totem': '🏛️', 'Egg': '🥚', 'Glyph': '➰' };

  const filteredJewels = useMemo(() => JEWEL_DATA.filter(j => jewelFilterSlot === 'All' || j.slots.includes(jewelFilterSlot)), [jewelFilterSlot]);
  const filteredRelics = useMemo(() => RELIC_DATA.filter(r => {
    const matchesTier = relicTierFilter === 'All' || r.tier === relicTierFilter;
    const matchesSource = relicSourceFilter === 'All' || r.source === relicSourceFilter;
    const matchesSearch = fuzzyMatch(r.name, searchQuery);
    return matchesSearch && (categoryFilter === 'All' || categoryFilter === 'Relic') && (!sssOnly);
  }), [relicTierFilter, relicSourceFilter, searchQuery, categoryFilter, sssOnly]);

  const filteredData = useMemo(() => {
    const adaptedJewels = JEWEL_DATA.map(j => ({ ...j, category: 'Jewel' as GearCategory, tier: 'S' as Tier, desc: j.lore || j.statType }));
    const adaptedRelics = RELIC_DATA.map(r => ({ ...r, category: 'Relic' as GearCategory, tier: 'S' as Tier, desc: r.effect }));
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
      default: return 'from-gray-600/40 via-gray-950/20 border-white/10 text-gray-500';
    }
  };

  const getRelicStyles = (tier: string) => {
    switch (tier) {
      case 'Holy': return { card: 'bg-orange-600/5 border-orange-500/20 hover:border-orange-500/40', iconContainer: 'bg-orange-600/20 border-orange-500/30 text-orange-500' };
      case 'Radiant': return { card: 'bg-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40', iconContainer: 'bg-yellow-600/20 border-yellow-500/30 text-yellow-500' };
      default: return { card: 'bg-blue-600/5 border-blue-500/20 hover:border-blue-500/40', iconContainer: 'bg-blue-600/20 border-blue-500/30 text-blue-500' };
    }
  };

  const handleInteractiveClick = (e: React.MouseEvent, action: () => void) => {
    if (dragRef.current.moved) return;
    action();
  };

  // --- SortHeader Component Fix ---
  const SortHeader: React.FC<{ 
    label: string; 
    field: 'resource' | 'chapter' | 'efficiency' | 'avgTime'; 
    currentSort: { field: string; direction: 'asc' | 'desc' };
  }> = ({ label, field, currentSort }) => {
    const isActive = currentSort.field === field;
    return (
      <button 
        onClick={() => toggleFarmingSort(field)}
        className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
      >
        {label}
        {isActive && (
          currentSort.direction === 'asc' ? <ArrowUpWideNarrow size={10} /> : <ArrowDownWideNarrow size={10} />
        )}
      </button>
    );
  };

  const BuildSlot: React.FC<{ label: string; name: string; icon: any }> = ({ label, name, icon: Icon }) => {
    const item = findItemByName(name);
    return (
      <div 
        onClick={() => { if (item) { setSelectedItem(item); playSfx('click'); } }}
        className={`p-4 bg-black/40 border border-white/5 rounded-2xl transition-all ${item ? 'cursor-pointer hover:border-blue-500/50 hover:bg-blue-900/10' : ''}`}
      >
        <p className="text-[8px] font-black text-gray-500 uppercase mb-1 flex items-center gap-1"><Icon size={10}/> {label}</p>
        <div className="flex items-center justify-between gap-1">
          <p className="text-[11px] font-black text-gray-200 uppercase italic truncate">{name}</p>
          {item && <ArrowUpRight size={10} className="text-blue-400 shrink-0" />}
        </div>
      </div>
    );
  };

  const comparedHeroes = useMemo(() => HERO_DATA.filter(h => compareHeroIds.includes(h.id)), [compareHeroIds]);

  return (
    <div className="h-screen w-full bg-[#030712] text-gray-100 flex flex-col font-sans max-w-3xl mx-auto relative overflow-hidden border-x border-white/5 shadow-4xl">
      
      {/* 🚀 DYNAMIC WALKTHROUGH BUBBLE */}
      {runTour && (
        <div className="fixed inset-0 z-[5000] pointer-events-none">
           <div className="absolute inset-0 bg-black/60 transition-all duration-700 pointer-events-auto" onClick={closeTour} />
           
           <div 
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-700 ease-out flex flex-col gap-4 w-[300px] sm:w-[340px] p-6 bg-gray-950 border-2 border-orange-500 rounded-[2.5rem] shadow-[0_0_50px_rgba(249,115,22,0.3)] animate-in fade-in zoom-in-90 ring-1 ring-orange-500/20 backdrop-blur-2xl z-[5001]`}
           >
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-orange-600/20 rounded-xl text-orange-500 shrink-0">
                    <Bot size={24} className="animate-pulse" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none">System Briefing</p>
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mt-1 truncate">{TOUR_STEPS[tourStep].title}</h3>
                 </div>
              </div>
              
              <p className="text-[12px] text-gray-300 font-medium italic leading-relaxed break-words">
                "{TOUR_STEPS[tourStep].content}"
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                 <button onClick={closeTour} className="text-[10px] font-black text-gray-600 uppercase hover:text-white transition-colors">Dismiss</button>
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-gray-600 tabular-nums">{tourStep + 1} / {TOUR_STEPS.length}</span>
                    <button onClick={handleNextTourStep} className="px-5 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-orange-600/20">
                       {tourStep === TOUR_STEPS.length - 1 ? "FINALIZE" : "PROCEED"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <header className="bg-gray-950/95 backdrop-blur-3xl border-b border-white/5 p-5 shrink-0 z-[100]">
        <div className="flex items-center justify-between">
          <div id="header-logo" className={`flex items-center gap-3 transition-all relative`}>
            <Trophy className={`text-orange-500 w-8 h-8`} />
            <div>
              <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none truncate max-w-[180px] sm:max-w-none">ZV GRANDMASTER</h1>
              <p className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase mt-1 hidden sm:block">ZV Armory Clan Strategic Companion</p>
              <p className="text-[8px] text-orange-500 font-bold tracking-tight uppercase mt-0.5 sm:hidden">Strategic Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button id="help-btn" onClick={() => { setTourStep(0); setRunTour(true); playSfx('click'); }} className={`p-3 bg-white/5 text-orange-500 rounded-xl hover:bg-white/10 transition-all border border-white/5`}><HelpCircle size={16}/></button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 bg-white/5 text-gray-500 rounded-xl border border-white/5">
                {soundEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}
            </button>
            <button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setActiveTab('meta'); playSfx('click'); }} className="p-3 bg-white/5 text-gray-500 rounded-xl transition-all border border-white/5"><RefreshCw size={16} /></button>
          </div>
        </div>
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-40 scroll-smooth relative">
        {(activeTab === 'meta' || activeTab === 'farming' || activeTab === 'relics' || activeTab === 'jewels') && (
          <div className="sticky top-0 z-[200] bg-gray-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-4 space-y-4">
             {(activeTab === 'meta' || activeTab === 'relics') && (
                <div id="search-bar" className={`flex items-center gap-3 transition-all duration-500 relative`}>
                  <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input 
                      type="text" 
                      placeholder={`Search archives...`} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" 
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
                    return (
                      <button key={cat} onClick={(e) => handleInteractiveClick(e, () => { setCategoryFilter(cat as any); playSfx('click'); })} className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${categoryFilter === cat ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}><Icon size={12} /> {cat}</button>
                    );
                  })}
                </div>
             )}

             {activeTab === 'farming' && (
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input type="text" placeholder="Search chapters..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-[10px] font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" value={farmingSearch} onChange={(e) => setFarmingSearch(e.target.value)} />
                  </div>
                  <div ref={farmFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, farmFilterScrollRef)}>
                    {['All', 'Gear', 'Gold', 'Shards', 'Jewels', 'Runes', 'Exp'].map(cat => (
                      <button key={cat} onClick={(e) => handleInteractiveClick(e, () => { setFarmingCategory(cat as any); playSfx('click'); })} className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${farmingCategory === cat ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{cat}</button>
                    ))}
                  </div>
                </div>
             )}
             {activeTab === 'relics' && (
                <div className="space-y-3">
                  <div ref={relicTierFilterScrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" onMouseDown={(e) => handleDragStart(e, relicTierFilterScrollRef)}>
                    {['All', 'Holy', 'Radiant', 'Faint'].map(t => (
                      <button key={t} onClick={(e) => handleInteractiveClick(e, () => { setRelicTierFilter(t as any); playSfx('click'); })} className={`flex-shrink-0 px-8 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${relicTierFilter === t ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}>{t} Archive</button>
                    ))}
                  </div>
                </div>
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
                      const aFav = favoriteHeroes.has(a.id), bFav = favoriteHeroes.has(b.id);
                      if (aFav && !bFav) return -1; if (!aFav && bFav) return 1;
                    }
                    const aEquipped = equippedItems.has(a.id), bEquipped = equippedItems.has(b.id);
                    if (aEquipped && !bEquipped) return -1; if (!aEquipped && bEquipped) return 1;
                    return 0;
                  });
                  return (
                    <div key={cat} className="space-y-6">
                      <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4 italic flex items-center gap-3">
                        <span className="text-xl">{categoryEmojis[cat]}</span> {cat}S
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {sortedItems.map(item => {
                          const isEquipped = equippedItems.has(item.id), isBeingCompared = compareHeroIds.includes(item.id), isFavorite = favoriteHeroes.has(item.id);
                          return (
                            <div key={item.id} className="relative group">
                              <div onClick={() => { setSelectedItem(item); playSfx('click'); }} className="cursor-pointer h-full">
                                <Card tier={item.tier} className={`transition-all duration-500 h-full flex flex-col ${isEquipped ? 'border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20' : 'hover:scale-[1.02]'} ${isFavorite && item.category === 'Hero' ? 'bg-yellow-400/5 border-yellow-500/20' : ''}`}>
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2"><Badge tier={item.tier} />{isEquipped && <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-600 text-[7px] font-black text-white uppercase rounded animate-pulse"><Zap size={8} fill="currentColor" /> ACTIVE</span>}{isFavorite && item.category === 'Hero' && <Star size={12} className="text-yellow-500 fill-current" />}</div>
                                      <div className="flex items-center gap-2">
                                        {item.category === 'Hero' && <button onClick={(e) => { e.stopPropagation(); handleHeroCompareToggle(item.id); }} className={`p-2 rounded-xl border transition-all ${isBeingCompared ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/5 text-gray-600 hover:text-blue-500'}`} title="Compare Hero"><Scale size={14} /></button>}
                                        <button onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }} className={`p-2 rounded-xl border transition-all ${isEquipped ? 'bg-orange-600 border-orange-400 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`}>{isEquipped ? <Check size={14} /> : <Box size={14} />}</button>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2 min-w-0"><h3 className="text-lg font-black text-white uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors truncate">{item.name}</h3>{item.category === 'Hero' && <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }} className={`p-1.5 rounded-lg transition-all shrink-0 ${isFavorite ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'}`} title="Favorite Hero"><Star size={16} fill={isFavorite ? "currentColor" : "none"} /></button>}</div>
                                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed italic">{item.desc}</p>
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

          {activeTab === 'analyze' && (
            <div className="flex flex-col min-h-full animate-in fade-in pb-24 space-y-10">
               <div className={`transition-all duration-700 relative ${simResult ? 'p-8 bg-blue-900/10 border border-blue-500/20 rounded-[3rem]' : 'p-12 sm:p-16 bg-gray-950 border-2 border-blue-500/20 rounded-[4rem] shadow-4xl'}`}>
                  <div className={`relative z-10 flex flex-col items-center text-center ${simResult ? 'gap-4' : 'gap-10'}`}>
                    <div className={`transition-all duration-700 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-inner ${simResult ? 'w-16 h-16' : 'w-24 h-24 sm:w-32 sm:h-32'}`}><BrainCircuit size={simResult ? 24 : 64} className="text-blue-500 animate-pulse" /></div>
                    <div><h4 className={`${simResult ? 'text-lg' : 'text-2xl sm:text-3xl'} font-black text-white uppercase italic tracking-tighter transition-all duration-700`}>Strategic Synthesis</h4>{!simResult && <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mt-3 italic">Neural Network V6.3 Uplink</p>}</div>
                    <div className={`w-full max-w-sm transition-all ${simResult ? 'flex flex-col sm:flex-row gap-4' : 'space-y-6'}`}>
                      <CustomSelect options={HERO_DATA.map(h => ({ id: h.id, name: h.name, subtitle: h.tier }))} value={buildHero} onChange={(val) => setBuildHero(val)} placeholder="Select Hero Target..." className="flex-1" />
                      <button onClick={runSimulation} disabled={isSimulating} className={`transition-all duration-500 bg-blue-600 text-white font-black uppercase rounded-3xl hover:bg-blue-500 flex items-center justify-center gap-4 disabled:opacity-30 shadow-xl active:scale-95 ${simResult ? 'px-6 py-3 text-[10px]' : 'w-full py-6 text-[14px]'}`}>{isSimulating ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18} className="fill-current"/>}<span>{isSimulating ? 'Processing...' : simResult ? 'RE-SYNTH' : 'INITIATE ANALYSIS'}</span></button>
                    </div>
                  </div>
               </div>
               {simResult && <div className="p-8 sm:p-12 bg-gray-900/60 border-l-4 border-l-blue-500 border-y border-r border-white/5 rounded-r-[4rem] rounded-l-[1.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden"><div className="text-[14px] sm:text-[16px] text-gray-200 leading-[2] italic whitespace-pre-wrap font-medium overflow-y-auto max-h-[60vh] no-scrollbar break-words">{simResult}</div></div>}
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[2.5rem]">
                <h4 className="text-[10px] font-black text-orange-500 uppercase mb-6 flex items-center gap-2 tracking-[0.3em]"><Activity size={14}/> Account Sync Protocol</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(calculateGlobalStats()).map(([stat, val]) => (
                    <div key={stat} className="p-5 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-md min-w-0">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 truncate">{stat}</p>
                      <p className="text-2xl font-black text-white italic">+{val}%</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {HERO_DATA.map(h => (
                  <div key={h.id} className="p-4 bg-gray-900/60 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
                    <div className="flex items-center gap-3 min-w-0"><Badge tier={h.tier} /><span className="text-xs font-black text-white italic uppercase tracking-tighter truncate">{h.name}</span></div>
                    <button onClick={() => { setUnlockedHeroes(p => ({...p, [h.id]: { lv120: !p[h.id]?.lv120 }})); playSfx('click'); }} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 ${unlockedHeroes[h.id]?.lv120 ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-gray-600 hover:text-gray-400'}`}>{unlockedHeroes[h.id]?.lv120 ? 'Active' : 'L120'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <div className="text-7xl sm:text-9xl font-black text-white italic tracking-tighter truncate px-4">{formulaResult.toLocaleString()}</div>
                <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Base Damage Capacity</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { k: 'baseAtk', l: 'Base ATK' },
                  { k: 'atkPercent', l: 'ATK %' },
                  { k: 'weaponDmgPercent', l: 'Weapon Dmg %' },
                  { k: 'critDmg', l: 'Crit Dmg %' }
                ].map(s => (
                  <div key={s.k} className="p-8 sm:p-10 bg-gray-900/60 border border-white/5 rounded-[3rem] focus-within:border-orange-500/40 transition-all min-w-0">
                    <label className="text-[11px] font-black text-gray-600 uppercase block mb-4 tracking-widest truncate">{s.l}</label>
                    <input type="number" value={(fInputs as any)[s.k]} onChange={e => setFInputs(p => ({ ...p, [s.k]: Number(e.target.value) }))} className="bg-transparent text-white text-3xl sm:text-5xl font-black outline-none w-full tabular-nums" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dragons' && (
            <div className="space-y-10 animate-in fade-in pb-12">
               <div className={`p-8 sm:p-10 rounded-[3.5rem] border transition-all ${dragonSynergy ? 'bg-orange-600/10 border-orange-500/40 shadow-glow' : 'bg-gray-900/40 border-white/5'} shadow-2xl`}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3"><Flame size={24} className={dragonSynergy ? 'text-orange-500' : 'text-gray-600'}/> Magestone Core</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{dragonSynergy ? "Resonance Optimized" : "Incomplete Synchronization"}</p>
                    </div>
                    {dragonSynergy && <Sparkles className="text-orange-500 animate-pulse shrink-0" size={24} />}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {['slot1', 'slot2', 'slot3'].map((slot, i) => {
                      const selected = DRAGON_DATA.find(d => d.id === (dragons as any)[slot]);
                      return (
                        <div key={slot} className="p-6 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col gap-4">
                          <CustomSelect 
                            options={DRAGON_DATA.map(d => ({ id: d.id, name: d.name, subtitle: (d as BaseItem).dragonType }))}
                            value={(dragons as any)[slot]}
                            onChange={(val) => setDragons(p => ({...p, [slot]: val}))}
                            placeholder={`Assign Dragon Socket ${i+1}`}
                          />
                          {selected && (
                            <div className="px-2 space-y-2 animate-in fade-in slide-in-from-left-2 overflow-hidden">
                               <p className="text-[11px] font-bold text-orange-400 italic truncate">Skill: {selected.deepLogic}</p>
                               <p className="text-[9px] text-gray-500 leading-relaxed font-medium italic line-clamp-3">{selected.desc}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
               </div>
               <div className="p-8 bg-black/20 rounded-[3rem] border border-white/5">
                 <p className="text-[10px] font-black text-gray-600 uppercase mb-4 flex items-center gap-2"><Lightbulb size={12}/> Pro Tip</p>
                 <p className="text-[11px] text-gray-400 italic leading-relaxed">Ensure one of each type (Attack, Defense, Balance) is socketed. This triggers the unique Magestone Resonance, doubling your base mana regeneration rate.</p>
               </div>
            </div>
          )}

          {activeTab === 'refine' && (
            <div className="space-y-10 animate-in fade-in pb-12">
               <div className="p-8 sm:p-12 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-[4.5rem] text-center shadow-4xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>
                  <Cpu className="mx-auto mb-6 text-orange-600/20 group-hover:text-orange-500/40 transition-colors" size={60} />
                  <p className="text-[11px] font-black text-gray-500 uppercase mb-4 tracking-[0.4em]">Integrated Essence Output</p>
                  <div className="text-7xl sm:text-9xl font-black text-white italic tracking-tighter drop-shadow-2xl truncate px-4">{smeltEssenceYield.toLocaleString()}</div>
                  <div className="mt-12 grid grid-cols-2 gap-4">
                    <CustomSelect 
                      options={['Epic', 'PE', 'Legendary', 'AL', 'Mythic'].map(r => ({ id: r, name: r }))}
                      value={smeltItem}
                      onChange={(v) => setSmeltItem(v as any)}
                    />
                    <div className="relative group">
                      <input type="number" value={smeltQty} onChange={e => setSmeltQty(Number(e.target.value))} className="w-full bg-gray-900/80 border border-white/10 px-6 py-4 rounded-2xl text-xs font-black text-white outline-none focus:border-orange-500/50" min="1" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-600 uppercase pointer-events-none">QTY</span>
                    </div>
                  </div>
               </div>
               <div className="space-y-4">
                 <h5 className="px-4 text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Smelt Optimization Tips</h5>
                 <div className="grid grid-cols-1 gap-3">
                   {REFINE_TIPS.map((tip, i) => (
                     <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-start gap-4">
                       <ShieldCheck className="text-orange-500 mt-1 shrink-0" size={16} />
                       <p className="text-[11px] text-gray-300 font-medium italic leading-relaxed">{tip}</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'vs' && (
            <div className="space-y-10 animate-in fade-in pb-12">
               <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[3rem] text-center">
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Tactical Comparison Matrix</h4>
                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em]">Side-by-Side Architectural Analysis</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-6">
                    <CustomSelect 
                      options={GEAR_DATA.map(g => ({ id: g.id, name: g.name, subtitle: g.category }))}
                      value={vsItemA}
                      onChange={(v) => setVsItemA(v)}
                      placeholder="Load Source A..."
                    />
                    {GEAR_DATA.find(g => g.id === vsItemA) && (
                      <div className="animate-in slide-in-from-left-4 duration-500">
                        <Card tier={GEAR_DATA.find(g => g.id === vsItemA)?.tier} className="min-h-[400px]">
                           <Badge tier={GEAR_DATA.find(g => g.id === vsItemA)!.tier} />
                           <h5 className="text-lg font-black text-white uppercase italic mt-4 truncate">{GEAR_DATA.find(g => g.id === vsItemA)?.name}</h5>
                           <div className="mt-8 space-y-6">
                              <div>
                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p>
                                <p className="text-[11px] text-gray-200 font-bold italic leading-tight">{GEAR_DATA.find(g => g.id === vsItemA)?.mythicPerk || "N/A"}</p>
                              </div>
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p>
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic line-clamp-6">{GEAR_DATA.find(g => g.id === vsItemA)?.deepLogic || "Neural scan unavailable."}</p>
                              </div>
                           </div>
                        </Card>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <CustomSelect 
                      options={GEAR_DATA.map(g => ({ id: g.id, name: g.name, subtitle: g.category }))}
                      value={vsItemB}
                      onChange={(v) => setVsItemB(v)}
                      placeholder="Load Source B..."
                    />
                    {GEAR_DATA.find(g => g.id === vsItemB) && (
                      <div className="animate-in slide-in-from-right-4 duration-500">
                        <Card tier={GEAR_DATA.find(g => g.id === vsItemB)?.tier} className="min-h-[400px]">
                           <Badge tier={GEAR_DATA.find(g => g.id === vsItemB)!.tier} />
                           <h5 className="text-lg font-black text-white uppercase italic mt-4 truncate">{GEAR_DATA.find(g => g.id === vsItemB)?.name}</h5>
                           <div className="mt-8 space-y-6">
                              <div>
                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p>
                                <p className="text-[11px] text-gray-200 font-bold italic leading-tight">{GEAR_DATA.find(g => g.id === vsItemB)?.mythicPerk || "N/A"}</p>
                              </div>
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p>
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic line-clamp-6">{GEAR_DATA.find(g => g.id === vsItemB)?.deepLogic || "Neural scan unavailable."}</p>
                              </div>
                           </div>
                        </Card>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'immunity' && (
            <div className="space-y-8 animate-in fade-in pb-12">
              <div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5">
                <p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projectile Resistance Cap</p>
                <div className={`text-7xl sm:text-9xl font-black italic tracking-tighter truncate px-4 ${totalImmunity >= 100 ? 'text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'text-white'}`}>{totalImmunity.toFixed(1)}%</div>
                <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">{totalImmunity >= 100 ? 'SYSTEM IMMUNE' : 'VULNERABILITY DETECTED'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Dragon Rings (Max 2)', val: immunitySetup.rings, set: (v: number) => setImmunitySetup(p => ({...p, rings: v})) },
                  { label: 'Atreus Level 120 (+7%)', check: immunitySetup.atreus120, set: (v: boolean) => setImmunitySetup(p => ({...p, atreus120: v})) },
                  { label: 'Onir Level 120 (+10%)', check: immunitySetup.onir120, set: (v: boolean) => setImmunitySetup(p => ({...p, onir120: v})) },
                  { label: 'Bulletproof Locket (+15%)', check: immunitySetup.locket, set: (v: boolean) => setImmunitySetup(p => ({...p, locket: v})) },
                ].map((row, i) => (
                  <div key={i} className="p-6 bg-gray-900/60 border border-white/5 rounded-[2.5rem] flex items-center justify-between min-w-0">
                     <span className="text-[11px] font-black text-gray-400 uppercase italic truncate pr-2">{row.label}</span>
                     {row.hasOwnProperty('val') ? (
                       <input type="number" max="2" min="0" value={row.val} onChange={e => (row as any).set(Number(e.target.value))} className="bg-white/5 w-12 text-center text-white font-black rounded-lg p-1 shrink-0" />
                     ) : (
                       <button onClick={() => (row as any).set(!row.check)} className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${row.check ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-white/10'}`}>
                         {row.check && <CheckCircle2 size={14}/>}
                       </button>
                     )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dps' && (
             <div className="space-y-8 animate-in fade-in pb-12">
               <div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5">
                 <p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projected Effective DPS</p>
                 <div className="text-7xl sm:text-9xl font-black text-white italic tracking-tighter truncate px-4">{calculatedDPS.toLocaleString()}</div>
                 <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Integrated Combat Potency</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { k: 'baseAtk', l: 'Raw ATK' },
                    { k: 'critChance', l: 'Crit Chance %' },
                    { k: 'critDmg', l: 'Crit Dmg %' },
                    { k: 'atkSpeed', l: 'Atk Speed %' }
                  ].map(s => (
                    <div key={s.k} className="p-8 bg-gray-900/60 border border-white/5 rounded-[3rem] min-w-0">
                       <label className="text-[10px] font-black text-gray-600 uppercase block mb-2 truncate">{s.l}</label>
                       <input type="number" value={(calcStats as any)[s.k]} onChange={e => setCalcStats(p => ({...p, [s.k]: Number(e.target.value)}))} className="bg-transparent text-white text-2xl sm:text-3xl font-black outline-none w-full tabular-nums" />
                    </div>
                  ))}
               </div>
             </div>
          )}

          {activeTab === 'farming' && (
            <div className="space-y-6 pb-12 animate-in fade-in">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900/60 rounded-[2rem] border border-white/5 sticky top-[130px] z-50 backdrop-blur-xl shadow-lg">
                <SortHeader label="Resource" field="resource" currentSort={farmingSort} />
                <SortHeader label="Chapter" field="chapter" currentSort={farmingSort} />
                <SortHeader label="Efficiency" field="efficiency" currentSort={farmingSort} />
                <SortHeader label="Avg Time" field="avgTime" currentSort={farmingSort} />
              </div>

              {filteredFarming.map((route) => {
                const efficiencyColor = route.efficiency === 'SSS' ? 'text-red-500 border-red-500/20 bg-red-500/5' : route.efficiency === 'SS' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5';
                return (
                  <div key={route.id} className={`bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedFarmingId === route.id ? 'ring-2 ring-orange-500/30 shadow-4xl scale-[1.01]' : 'hover:border-white/20'}`}>
                    <button onClick={() => { setExpandedFarmingId(expandedFarmingId === route.id ? null : route.id); playSfx('click'); }} className="w-full p-6 flex items-center justify-between group relative overflow-hidden">
                      <div className="flex items-center gap-4 sm:gap-6 text-left relative z-10 min-w-0">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center font-black border transition-colors shrink-0 ${efficiencyColor}`}>
                          <span className="text-[8px] sm:text-[10px] uppercase opacity-60">Eff</span>
                          <span className="text-sm sm:text-xl leading-none">{route.efficiency}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[7px] sm:text-[8px] font-black px-2 py-0.5 rounded border uppercase shrink-0 ${route.difficulty === 'Hero' ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'}`}>{route.difficulty}</span>
                            <p className="text-base sm:text-lg font-black text-white uppercase italic tracking-tighter truncate">{route.chapter}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                             <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest truncate">{route.resource}</p>
                             <p className="text-[9px] font-medium text-gray-500 italic shrink-0">Est. {route.avgTime}</p>
                          </div>
                        </div>
                      </div>
                      <ChevronDown size={20} className={`text-gray-700 transition-transform duration-500 shrink-0 ${expandedFarmingId === route.id ? 'rotate-180 text-orange-500' : ''}`} />
                    </button>
                    {expandedFarmingId === route.id && (
                      <div className="p-8 space-y-6 bg-black/40 border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl min-w-0">
                               <p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Loot Projection</p>
                               <p className="text-[10px] sm:text-xs font-black text-white italic truncate">{route.lootRate}</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl min-w-0">
                               <p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Tactical Asset</p>
                               <p className="text-[10px] sm:text-xs font-black text-white italic truncate">{route.bestHero}</p>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <h5 className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest"><MapPin size={12}/> Tactical Briefing</h5>
                            <p className="text-xs text-gray-300 leading-relaxed italic font-medium bg-black/20 p-4 rounded-2xl border border-white/5 break-words">{route.strategy}</p>
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'relics' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-12">
              {filteredRelics.map((r) => (
                <div key={r.id} onClick={() => { setSelectedItem({...r, category: 'Relic'}); playSfx('click'); }} className={`p-6 sm:p-8 rounded-[2.5rem] border transition-all cursor-pointer group active:scale-95 flex flex-col items-center text-center ${getRelicStyles(r.tier).card}`}>
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mb-4 sm:mb-5 flex items-center justify-center border transition-transform group-hover:rotate-12 ${getRelicStyles(r.tier).iconContainer}`}>
                    <RelicIcon type={r.iconType} className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-tighter mb-1 leading-tight line-clamp-2 min-h-[2rem]">{r.name}</p>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{r.tier} Archive</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'jewels' && (
            <div className="space-y-8 animate-in fade-in pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJewels.map(j => (
                  <div key={j.id} onClick={() => { setSelectedItem({...j, category: 'Jewel'}); playSfx('click'); }} className="cursor-pointer group relative h-full">
                    <div className={`p-8 bg-gradient-to-br ${getJewelColorClasses(j.color)} rounded-[3rem] border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 flex flex-col gap-6 h-full`}>
                        <div className="flex items-center gap-4 min-w-0">
                           <div className="w-14 h-14 bg-black/40 rounded-[1.4rem] border border-white/10 flex items-center justify-center transition-transform duration-500 shrink-0"><Gem size={28} /></div>
                           <div className="min-w-0"><h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none truncate">{j.name}</h4></div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="space-y-10 animate-in fade-in pb-20">
              <div className="p-8 bg-orange-600/10 border border-orange-500/20 rounded-[3rem] text-center">
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Stutter-Step Reflex Trainer</h4>
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em]">Master the animation cancel timing</p>
              </div>

              <div className="relative h-24 bg-gray-900/60 rounded-[2rem] border border-white/5 overflow-hidden flex items-center px-1">
                <div className="absolute h-full bg-green-500/20 border-x border-green-500/30" style={{ left: '60%', width: '20%' }}>
                  <div className="h-full flex items-center justify-center opacity-40">
                    <Zap size={20} className="text-green-500 fill-current" />
                  </div>
                </div>
                <div className="absolute h-full w-1.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 transition-all duration-[16ms] linear" style={{ left: `${stutterProgress}%` }} />
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="text-center min-h-[120px]">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Streak</p>
                  <div className="text-7xl font-black text-white italic tracking-tighter">{stutterStreak}</div>
                  {stutterFeedback && (
                    <p className={`text-sm font-black uppercase mt-2 animate-bounce ${stutterFeedback === 'PERFECT!' ? 'text-green-500' : 'text-red-500'}`}>
                      {stutterFeedback}
                    </p>
                  )}
                </div>

                <button
                  onMouseDown={() => {
                    if (!stutterActive) return;
                    if (stutterProgress >= 60 && stutterProgress <= 80) {
                      setStutterStreak(s => s + 1);
                      setStutterFeedback("PERFECT!");
                      setStutterProgress(0);
                    } else {
                      setStutterStreak(0);
                      setStutterFeedback("MISS!");
                    }
                    playSfx('click');
                  }}
                  className="w-44 h-44 rounded-full bg-orange-600 border-[10px] border-orange-500 shadow-glow flex items-center justify-center text-white font-black text-2xl uppercase italic active:scale-90 transition-all select-none"
                >
                  ATTACK
                </button>

                <button
                  onClick={() => {
                    setStutterActive(!stutterActive);
                    setStutterFeedback(null);
                    setStutterProgress(0);
                    playSfx('tab');
                  }}
                  className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border transition-all ${stutterActive ? 'bg-red-600/20 border-red-500/50 text-red-500' : 'bg-green-600/20 border-green-500/50 text-green-500'}`}
                >
                  {stutterActive ? 'HALT SIMULATION' : 'INITIALIZE NEURAL LINK'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-[65vh] animate-in fade-in">
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-10 px-2">
                {chatHistory.length === 0 && (
                  <div className="p-12 text-center space-y-6">
                    <Bot size={48} className="text-orange-500 animate-pulse mx-auto" />
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tactical Uplink</h3>
                    <p className="text-xs text-gray-400 leading-relaxed italic max-w-sm mx-auto">"Ask me anything about gear, boss patterns, or meta evolutions."</p>
                  </div>
                )}
                {chatHistory.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-6 rounded-[2rem] ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-900 border border-white/5 text-gray-100 rounded-tl-none shadow-xl'}`}>
                      <p className="text-[13px] leading-[1.6] font-medium italic whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                   <Loader2 className="text-orange-500 animate-spin" size={24} />
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

      <nav className="fixed bottom-0 left-0 w-full z-[100] bg-gray-950/98 backdrop-blur-3xl border-t border-white/5 p-4 flex flex-col items-center shadow-2xl">
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
            { id: 'ai', icon: MessageSquare, label: 'Grandmaster' },
          ].map(t => (
            <button 
              id={`nav-${t.id}`}
              key={t.id} 
              onClick={(e) => handleInteractiveClick(e, () => handleTabChange(t.id as any))} 
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl transition-all duration-300 transform active:scale-90 relative ${activeTab === t.id ? 'text-orange-500 bg-white/5 ring-1 ring-white/10' : 'text-gray-500'}`}
            >
              <t.icon size={20} className={activeTab === t.id ? 'animate-pulse' : ''} />
              <span className="text-[8px] font-black uppercase tracking-tight">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-2xl bg-[#030712] border border-white/10 rounded-[3.5rem] p-8 sm:p-14 max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 shadow-4xl ring-1 ring-white/5">
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 sm:p-5 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-transform z-20 hover:bg-white/10"><X size={24}/></button>
            <div className="space-y-12">
              <div className="space-y-6 min-w-0">
                <div className="flex flex-wrap items-center gap-3"><Badge tier={selectedItem.tier} /><span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-600/5 px-3 py-1 rounded-lg border border-orange-500/10 truncate">{selectedItem.category} Protocols</span></div>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-none break-words">{selectedItem.name}</h2>
                <p className="text-[14px] sm:text-[15px] text-gray-400 font-medium italic opacity-90 leading-relaxed max-w-lg break-words">{selectedItem.desc}</p>
              </div>
              <div className="grid grid-cols-1 gap-10">
                {selectedItem.deepLogic && <div className="p-8 sm:p-10 bg-gray-950 border border-white/10 rounded-[3rem] shadow-inner relative overflow-hidden group"><h4 className="text-[11px] font-black text-orange-500 uppercase mb-5 flex items-center gap-3 tracking-[0.3em] relative z-10 italic">Deep Logic Analysis</h4><div className="text-[14px] sm:text-[15px] text-gray-100 font-medium leading-[1.8] italic whitespace-pre-wrap relative z-10 break-words">{selectedItem.deepLogic}</div></div>}
                {selectedItem.gearSets && <div className="space-y-6"><h4 className="px-4 text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">Recommended Gear Sets</h4><div className="space-y-6">{selectedItem.gearSets.map((set: GearSet, sIdx: number) => (<div key={sIdx} className="p-6 sm:p-8 bg-blue-900/5 border border-blue-500/20 rounded-[3rem] group"><div className="flex items-center justify-between mb-6 gap-4"><h5 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter truncate">{set.name}</h5><button onClick={() => handleExportBuild(selectedItem.name, set)} className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shrink-0">Copy</button></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"><BuildSlot label="Weapon" name={set.weapon} icon={Sword} /><BuildSlot label="Armor" name={set.armor} icon={Shield} /><BuildSlot label="Bracelet" name={set.bracelet} icon={Zap} /><BuildSlot label="Locket" name={set.locket} icon={Target} /><BuildSlot label="Book" name={set.book} icon={Book} />{set.rings.map((ringName, rIdx) => <BuildSlot key={rIdx} label={`Ring ${rIdx + 1}`} name={ringName} icon={Circle} />)}</div><div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl"><p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Synergy Resonance</p><p className="text-[12px] sm:text-[13px] text-gray-300 font-medium italic leading-relaxed break-words">"{set.synergy}"</p></div></div>))}</div></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
