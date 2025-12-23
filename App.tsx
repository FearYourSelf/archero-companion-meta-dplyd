
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
  ChevronUp, ArrowDownWideNarrow, Check, Atom, RotateCcw, Scale, Milestone
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, SET_BONUS_DESCRIPTIONS, FARMING_ROUTES, DRAGON_DATA, FarmingRoute, REFINE_TIPS
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic, GearSet } from './types';
import { Badge, Card } from './components/UI';

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
  
  // persistence States
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

  // Hero Comparison state
  const [compareHeroIds, setCompareHeroIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Filter States
  const [farmingSearch, setFarmingSearch] = useState('');
  const [farmingCategory, setFarmingCategory] = useState<'All' | FarmingRoute['resource']>('All');
  const [farmingSort, setFarmingSort] = useState<{ field: 'resource' | 'chapter' | 'efficiency' | 'avgTime', direction: 'asc' | 'desc' }>({ 
    field: 'efficiency', 
    direction: 'desc' 
  });
  const [expandedFarmingId, setExpandedFarmingId] = useState<string | null>(null);
  const [jewelSimLevel, setJewelSimLevel] = useState<number>(10);
  const [jewelFilterSlot, setJewelFilterSlot] = useState<string>('All');

  // Unique Relic Sources for filter - Sorted alphabetically for UX
  const relicSources = useMemo(() => {
    const sources = RELIC_DATA.map(r => r.source).filter(Boolean) as string[];
    const sortedUnique = Array.from(new Set(sources)).sort((a, b) => a.localeCompare(b));
    return ['All', ...sortedUnique];
  }, []);

  // Refs
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
    // Allow dragging only if we're not clicking a specific interactive child element directly
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
      const dx = (e.pageX - d.startX) * 1.5; // Sensitivity multiplier
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

    // Horizontal scroll wheel support for bars
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
    if (tab === 'lab') {
      playSfx('error');
      setMaintenanceToast(true);
      setTimeout(() => setMaintenanceToast(false), 3000);
      return;
    }
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
--- Generated via ZV GRANDMASTER ---
    `.trim();
    navigator.clipboard.writeText(text);
    alert(`${set.name} configuration exported to tactical clipboard.`);
  };

  const findItemByName = (name: string) => {
    return [...GEAR_DATA, ...DRAGON_DATA].find(i => i.name === name || i.id === name);
  }

  const displayOrder: GearCategory[] = ['Hero', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Book', 'Spirit', 'Dragon', 'Pet', 'Relic', 'Jewel', 'Totem', 'Egg', 'Glyph'];
  const categoryIcons: Record<string, any> = { 'All': LayoutGrid, 'Hero': User, 'Weapon': Sword, 'Armor': Shield, 'Ring': Circle, 'Locket': Target, 'Bracelet': Zap, 'Book': Book, 'Spirit': Ghost, 'Dragon': Flame, 'Pet': Dog, 'Egg': Egg, 'Totem': Tower, 'Relic': Box, 'Jewel': Disc, 'Glyph': Layers };
  const categoryEmojis: Record<string, string> = { 'Hero': '🦸', 'Weapon': '⚔️', 'Armor': '🛡️', 'Ring': '💍', 'Bracelet': '⚡', 'Locket': '🎯', 'Book': '📖', 'Spirit': '👻', 'Dragon': '🐉', 'Pet': '🐾', 'Relic': '🏺', 'Jewel': '💎', 'Totem': '🏛️', 'Egg': '🥚', 'Glyph': '➰' };

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
      case 'Holy': 
        return {
          card: 'bg-orange-600/5 border-orange-500/20 hover:border-orange-500/40',
          iconContainer: 'bg-orange-600/20 border-orange-500/30 text-orange-500',
          tooltip: 'border-orange-500/30 text-orange-400',
          arrow: 'border-orange-500/30'
        };
      case 'Radiant':
        return {
          card: 'bg-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40',
          iconContainer: 'bg-yellow-600/20 border-yellow-500/30 text-yellow-500',
          tooltip: 'border-yellow-500/30 text-yellow-400',
          arrow: 'border-yellow-500/30'
        };
      default:
        return {
          card: 'bg-blue-600/5 border-blue-500/20 hover:border-blue-500/40',
          iconContainer: 'bg-blue-600/20 border-blue-500/30 text-blue-500',
          tooltip: 'border-blue-500/30 text-blue-400',
          arrow: 'border-blue-500/30'
        };
    }
  };

  const handleInteractiveClick = (e: React.MouseEvent, action: () => void) => {
    // If the user was dragging, don't trigger the click action
    if (dragRef.current.moved) return;
    action();
  };

  const SortHeader = ({ label, field, currentSort }: { label: string, field: typeof farmingSort.field, currentSort: typeof farmingSort }) => {
    const isActive = currentSort.field === field;
    return (
      <button 
        onClick={() => toggleFarmingSort(field)}
        className={`flex items-center gap-1 hover:text-orange-500 transition-colors group ${isActive ? 'text-orange-500' : 'text-gray-500'}`}
      >
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {isActive ? (
          currentSort.direction === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
        ) : (
          <ArrowDownWideNarrow size={10} className="opacity-0 group-hover:opacity-50" />
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

  const handleHeroCompareToggle = (id: string) => {
    playSfx('click');
    setCompareHeroIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const comparedHeroes = useMemo(() => {
    return HERO_DATA.filter(h => compareHeroIds.includes(h.id));
  }, [compareHeroIds]);

  return (
    <div className="h-screen w-full bg-[#030712] text-gray-100 flex flex-col font-sans max-w-3xl mx-auto relative overflow-hidden border-x border-white/5 shadow-4xl">
      
      {maintenanceToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-in fade-in zoom-in duration-300 pointer-events-none text-center">
          <div className="px-12 py-8 bg-gray-950/95 border-2 border-orange-500/60 rounded-[3rem] shadow-4xl flex flex-col items-center gap-4">
             <AlertTriangle className="text-orange-500 animate-pulse" size={32} />
             <p className="text-xl font-black text-white italic uppercase tracking-tighter">Under Maintenance</p>
          </div>
        </div>
      )}

      <header className="bg-gray-950/95 backdrop-blur-3xl border-b border-white/5 p-5 shrink-0 z-[100]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-orange-500 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none">ZV GRANDMASTER</h1>
              <p className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase mt-1">ZV Armory Clan Strategic Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => playSfx('click')} className="p-3 bg-white/5 text-orange-500 rounded-xl hover:bg-white/10 transition-all border border-white/5"><HelpCircle size={16}/></button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 bg-white/5 text-gray-500 rounded-xl border border-white/5">
                {soundEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}
            </button>
            <button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setActiveTab('meta'); playSfx('click'); }} className="p-3 bg-white/5 text-gray-500 rounded-xl transition-all border border-white/5"><RefreshCw size={16} /></button>
          </div>
        </div>
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-40 scroll-smooth relative">
        {/* STICKY UPPER TOOLBARS */}
        {(activeTab === 'meta' || activeTab === 'farming' || activeTab === 'relics' || activeTab === 'jewels') && (
          <div className="sticky top-0 z-[200] bg-gray-950/90 backdrop-blur-xl border-b border-white/5 px-5 py-4 space-y-4">
             {/* Integrated Search Bar for Meta and Relics */}
             {(activeTab === 'meta' || activeTab === 'relics') && (
                <div className="flex items-center gap-3">
                  <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input 
                      type="text" 
                      placeholder={`Search ${activeTab === 'meta' ? 'archives' : 'relics'}...`} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                  </div>
                  {activeTab === 'meta' && (
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => { setSssOnly(!sssOnly); playSfx('click'); }}
                        className={`p-3 rounded-2xl border transition-all ${sssOnly ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`}
                        title="SSS Tier Only"
                      >
                        <Crown size={18} />
                      </button>
                      <button 
                        onClick={handleResetFilters}
                        className="p-3 bg-white/5 border border-white/10 text-gray-500 rounded-2xl hover:text-orange-500 transition-all"
                        title="Reset Filters"
                      >
                        <RotateCcw size={18} />
                      </button>
                    </div>
                  )}
                </div>
             )}

             {activeTab === 'meta' && (
                <div 
                  ref={categoryScrollRef} 
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x draggable-content touch-pan-x flex-nowrap" 
                  onMouseDown={(e) => handleDragStart(e, categoryScrollRef)}
                >
                  {['All', ...displayOrder].map(cat => {
                    const Icon = categoryIcons[cat] || Package;
                    return (
                      <button 
                        key={cat} 
                        onClick={(e) => handleInteractiveClick(e, () => { setCategoryFilter(cat as any); playSfx('click'); })} 
                        className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${categoryFilter === cat ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}
                      >
                        <Icon size={12} /> {cat}
                      </button>
                    );
                  })}
                </div>
             )}

             {/* Sub-tab Toolbars */}
             {activeTab === 'farming' && (
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input type="text" placeholder="Search chapters or resources..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-[10px] font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all shadow-inner" value={farmingSearch} onChange={(e) => setFarmingSearch(e.target.value)} />
                  </div>
                  <div 
                    ref={farmFilterScrollRef} 
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" 
                    onMouseDown={(e) => handleDragStart(e, farmFilterScrollRef)}
                  >
                    {['All', 'Gear', 'Gold', 'Shards', 'Jewels', 'Runes', 'Exp'].map(cat => (
                      <button 
                        key={cat} 
                        onClick={(e) => handleInteractiveClick(e, () => { setFarmingCategory(cat as any); playSfx('click'); })} 
                        className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${farmingCategory === cat ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
             )}
             {activeTab === 'relics' && (
                <div className="space-y-3">
                  {/* Relic Tier Filter */}
                  <div 
                    ref={relicTierFilterScrollRef} 
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" 
                    onMouseDown={(e) => handleDragStart(e, relicTierFilterScrollRef)}
                  >
                    {['All', 'Holy', 'Radiant', 'Faint'].map(t => (
                      <button 
                        key={t} 
                        onClick={(e) => handleInteractiveClick(e, () => { setRelicTierFilter(t as any); playSfx('click'); })} 
                        className={`flex-shrink-0 px-8 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${relicTierFilter === t ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}
                      >
                        {t} Archive
                      </button>
                    ))}
                  </div>
                  {/* Relic Source Filter */}
                  <div 
                    ref={relicSourceFilterScrollRef} 
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content border-t border-white/5 pt-2" 
                    onMouseDown={(e) => handleDragStart(e, relicSourceFilterScrollRef)}
                  >
                    <div className="flex-shrink-0 px-3 flex items-center">
                       <MapPin size={10} className="text-gray-600" />
                    </div>
                    {relicSources.map(src => (
                      <button 
                        key={src} 
                        onClick={(e) => handleInteractiveClick(e, () => { setRelicSourceFilter(src); playSfx('click'); })} 
                        className={`flex-shrink-0 px-5 py-2 rounded-xl text-[8px] font-black uppercase transition-all border whitespace-nowrap ${relicSourceFilter === src ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-400'}`}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                </div>
             )}
             {activeTab === 'jewels' && (
                <div 
                  ref={jewelFilterScrollRef} 
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 snap-x flex-nowrap draggable-content" 
                  onMouseDown={(e) => handleDragStart(e, jewelFilterScrollRef)}
                >
                  {['All', 'Weapon', 'Armor', 'Ring', 'Bracelet', 'Locket', 'Spellbook'].map(slot => (
                    <button 
                      key={slot} 
                      onClick={(e) => handleInteractiveClick(e, () => { setJewelFilterSlot(slot); playSfx('click'); })} 
                      className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all border whitespace-nowrap ${jewelFilterSlot === slot ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}
                    >
                      {slot} Sockets
                    </button>
                  ))}
                </div>
             )}
          </div>
        )}

        <div className="px-5 py-6 space-y-8">
          {/* TAB CONTENT: META */}
          {activeTab === 'meta' && (
            <div className="space-y-12">
               {displayOrder.map(cat => {
                  if (categoryFilter !== 'All' && categoryFilter !== cat) return null;
                  const items = filteredData.filter(i => i.category === cat);
                  if (items.length === 0) return null;
                  
                  // SORT: Favorites first, then Equipped, then original (Tier)
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

                  return (
                    <div key={cat} className="space-y-6">
                      <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] border-l-4 border-orange-600 pl-4 italic flex items-center gap-3">
                        <span className="text-xl">{categoryEmojis[cat]}</span> {cat}S
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {sortedItems.map(item => {
                          const isEquipped = equippedItems.has(item.id);
                          const isBeingCompared = compareHeroIds.includes(item.id);
                          const isFavorite = favoriteHeroes.has(item.id);

                          return (
                            <div key={item.id} className="relative group">
                              {/* Enhanced Item Tooltip */}
                              {((item as any).mythicPerk || (item as any).deepLogic) && (
                                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute left-1/2 -translate-x-1/2 bottom-[105%] w-72 p-5 bg-gray-950/98 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-4xl z-[500] pointer-events-none animate-in fade-in slide-in-from-bottom-2">
                                  <div className="space-y-4">
                                    {(item as any).mythicPerk && (
                                      <div>
                                        <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                          <Sparkles size={10} /> Mythic Resonance
                                        </p>
                                        <p className="text-[11px] text-white font-bold italic leading-relaxed bg-orange-600/5 p-2.5 rounded-xl border border-orange-500/10">"{(item as any).mythicPerk}"</p>
                                      </div>
                                    )}
                                    {(item as any).deepLogic && (
                                      <div>
                                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                          <Atom size={10} /> Neural Synthesis
                                        </p>
                                        <p className="text-[10px] text-gray-300 font-medium italic leading-relaxed bg-blue-600/5 p-2.5 rounded-xl border border-blue-500/10">{(item as any).deepLogic}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-gray-950 rotate-45 border-r border-b border-white/10"></div>
                                </div>
                              )}

                              <div onClick={() => { setSelectedItem(item); playSfx('click'); }} className="cursor-pointer">
                                <Card 
                                  tier={item.tier} 
                                  className={`transition-all duration-500 ${isEquipped ? 'border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20' : 'hover:scale-[1.02]'} ${isFavorite && item.category === 'Hero' ? 'bg-yellow-400/5 border-yellow-500/20' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Badge tier={item.tier} />
                                        {isEquipped && (
                                          <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-600 text-[7px] font-black text-white uppercase rounded animate-pulse">
                                            <Zap size={8} fill="currentColor" /> ACTIVE
                                          </span>
                                        )}
                                        {isFavorite && item.category === 'Hero' && (
                                          <Star size={12} className="text-yellow-500 fill-current" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {item.category === 'Hero' && (
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); handleHeroCompareToggle(item.id); }}
                                            className={`p-2 rounded-xl border transition-all ${isBeingCompared ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/5 text-gray-600 hover:text-blue-500'}`}
                                            title="Compare Hero"
                                          >
                                            <Scale size={14} />
                                          </button>
                                        )}
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }}
                                          className={`p-2 rounded-xl border transition-all ${isEquipped ? 'bg-orange-600 border-orange-400 text-white' : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-300'}`}
                                        >
                                          {isEquipped ? <Check size={14} /> : <Box size={14} />}
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mt-3">
                                      <h3 className="text-lg font-black text-white uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors truncate">{item.name}</h3>
                                      {item.category === 'Hero' && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                                          className={`p-1.5 rounded-lg transition-all ${isFavorite ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'}`}
                                          title="Favorite Hero"
                                        >
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

          {/* TAB CONTENT: VS (GEAR COMPARISON) */}
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
                           <h5 className="text-lg font-black text-white uppercase italic mt-4">{GEAR_DATA.find(g => g.id === vsItemA)?.name}</h5>
                           <div className="mt-8 space-y-6">
                              <div>
                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p>
                                <p className="text-[11px] text-gray-200 font-bold italic">{GEAR_DATA.find(g => g.id === vsItemA)?.mythicPerk || "N/A"}</p>
                              </div>
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p>
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">{GEAR_DATA.find(g => g.id === vsItemA)?.deepLogic || "Neural scan unavailable."}</p>
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
                           <h5 className="text-lg font-black text-white uppercase italic mt-4">{GEAR_DATA.find(g => g.id === vsItemB)?.name}</h5>
                           <div className="mt-8 space-y-6">
                              <div>
                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Mythic Peak</p>
                                <p className="text-[11px] text-gray-200 font-bold italic">{GEAR_DATA.find(g => g.id === vsItemB)?.mythicPerk || "N/A"}</p>
                              </div>
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase mb-2">Deep Logic</p>
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">{GEAR_DATA.find(g => g.id === vsItemB)?.deepLogic || "Neural scan unavailable."}</p>
                              </div>
                           </div>
                        </Card>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {/* TAB CONTENT: TRACKER (SYNC) */}
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
                <div className="text-9xl font-black text-white italic tracking-tighter">{formulaResult.toLocaleString()}</div>
                <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Base Damage Capacity</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { k: 'baseAtk', l: 'Base ATK' },
                  { k: 'atkPercent', l: 'ATK %' },
                  { k: 'weaponDmgPercent', l: 'Weapon Dmg %' },
                  { k: 'critDmg', l: 'Crit Dmg %' }
                ].map(s => (
                  <div key={s.k} className="p-10 bg-gray-900/60 border border-white/5 rounded-[3.5rem] focus-within:border-orange-500/40 transition-all">
                    <label className="text-[11px] font-black text-gray-600 uppercase block mb-4 tracking-widest">{s.l}</label>
                    <input type="number" value={(fInputs as any)[s.k]} onChange={e => setFInputs(p => ({ ...p, [s.k]: Number(e.target.value) }))} className="bg-transparent text-white text-5xl font-black outline-none w-full tabular-nums" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: DRAGONS */}
          {activeTab === 'dragons' && (
            <div className="space-y-10 animate-in fade-in pb-12">
               <div className={`p-10 rounded-[3.5rem] border transition-all ${dragonSynergy ? 'bg-orange-600/10 border-orange-500/40' : 'bg-gray-900/40 border-white/5'} shadow-2xl`}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3"><Flame size={24} className={dragonSynergy ? 'text-orange-500' : 'text-gray-600'}/> Magestone Core</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{dragonSynergy ? "Resonance Optimized" : "Incomplete Synchronization"}</p>
                    </div>
                    {dragonSynergy && <Sparkles className="text-orange-500 animate-pulse" size={24} />}
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
                            <div className="px-2 space-y-2 animate-in fade-in slide-in-from-left-2">
                               <p className="text-[11px] font-bold text-orange-400 italic">Skill: {selected.deepLogic}</p>
                               <p className="text-[9px] text-gray-500 leading-relaxed font-medium">{selected.desc}</p>
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

          {/* TAB CONTENT: REFINE */}
          {activeTab === 'refine' && (
            <div className="space-y-10 animate-in fade-in pb-12">
               <div className="p-12 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-[4.5rem] text-center shadow-4xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>
                  <Cpu className="mx-auto mb-6 text-orange-600/20 group-hover:text-orange-500/40 transition-colors" size={60} />
                  <p className="text-[11px] font-black text-gray-500 uppercase mb-4 tracking-[0.4em]">Integrated Essence Output</p>
                  <div className="text-9xl font-black text-white italic tracking-tighter drop-shadow-2xl">{smeltEssenceYield.toLocaleString()}</div>
                  <div className="mt-12 grid grid-cols-2 gap-4">
                    <CustomSelect 
                      options={['Epic', 'PE', 'Legendary', 'AL', 'Mythic'].map(r => ({ id: r, name: r }))}
                      value={smeltItem}
                      onChange={(v) => setSmeltItem(v as any)}
                    />
                    <div className="relative group">
                      <input type="number" value={smeltQty} onChange={e => setSmeltQty(Number(e.target.value))} className="w-full bg-gray-900/80 border border-white/10 px-6 py-4 rounded-2xl text-xs font-black text-white outline-none focus:border-orange-500/50" min="1" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-600 uppercase">QTY</span>
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

          {/* TAB CONTENT: ANALYZE (SIM) */}
          {activeTab === 'analyze' && (
            <div className="flex flex-col min-h-full animate-in fade-in pb-24 space-y-10">
               {/* HUD HEADER */}
               <div className={`transition-all duration-700 relative ${simResult ? 'p-8 bg-blue-900/10 border border-blue-500/20 rounded-[3rem]' : 'p-16 bg-gray-950 border-2 border-blue-500/20 rounded-[4rem] shadow-4xl'}`}>
                  {!simResult && <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5 opacity-20 pointer-events-none animate-pulse"></div>}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <ScanIcon size={simResult ? 100 : 200} className="animate-pulse" />
                  </div>
                  
                  <div className={`relative z-10 flex flex-col items-center text-center ${simResult ? 'gap-4' : 'gap-10'}`}>
                    <div className={`transition-all duration-700 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-inner ${simResult ? 'w-16 h-16' : 'w-32 h-32'}`}>
                      <BrainCircuit size={simResult ? 24 : 64} className="text-blue-500 animate-pulse" />
                    </div>
                    
                    <div>
                      <h4 className={`${simResult ? 'text-lg' : 'text-3xl'} font-black text-white uppercase italic tracking-tighter transition-all duration-700`}>Strategic Synthesis</h4>
                      {!simResult && <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mt-3 italic">Neural Network V6.3 Uplink</p>}
                    </div>

                    <div className={`w-full max-w-sm transition-all ${simResult ? 'flex gap-4' : 'space-y-6'}`}>
                      <CustomSelect 
                        options={HERO_DATA.map(h => ({ id: h.id, name: h.name, subtitle: h.tier }))}
                        value={buildHero}
                        onChange={(val) => setBuildHero(val)}
                        placeholder="Select Hero Target..."
                        className="flex-1"
                      />
                      <button 
                        onClick={runSimulation} 
                        disabled={isSimulating} 
                        className={`transition-all duration-500 bg-blue-600 text-white font-black uppercase rounded-3xl hover:bg-blue-500 flex items-center justify-center gap-4 disabled:opacity-30 shadow-xl active:scale-95 ${simResult ? 'px-6 py-2 text-[10px]' : 'w-full py-6 text-[14px]'}`}
                      >
                        {isSimulating ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18} className="fill-current"/>}
                        <span>{isSimulating ? 'Processing...' : simResult ? 'RE-SYNTH' : 'INITIATE ANALYSIS'}</span>
                      </button>
                    </div>

                    {!simResult && (
                      <div className="flex items-center gap-4 p-5 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-xl">
                        <Timer className="text-blue-500" size={20} />
                        <div className="text-left">
                          <p className="text-[11px] font-black text-white uppercase tracking-wider">Computation Threshold</p>
                          <p className="text-[9px] font-bold text-gray-500 italic mt-0.5">Report generation requires 10-15 seconds of GPU load.</p>
                        </div>
                      </div>
                    )}
                  </div>
               </div>

               {/* REPORT DISPLAY */}
               {simResult ? (
                 <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700 pb-20">
                    <div className="flex items-center justify-between px-6 relative">
                       <div className="flex items-center gap-3">
                          <Pulse size={16} className="text-blue-500 animate-pulse" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Output: Finalizing Build Path</span>
                       </div>
                       
                       <div className="relative">
                          <button 
                            onClick={() => setIsSimMenuOpen(!isSimMenuOpen)}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-blue-500"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          {isSimMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-950 border border-white/10 rounded-2xl py-2 shadow-4xl z-[200] animate-in fade-in slide-in-from-top-2">
                               <button onClick={copySimResult} className="w-full px-5 py-3 flex items-center gap-3 text-[11px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                  <Copy size={14} /> <span>Copy to Clipboard</span>
                               </button>
                               <button onClick={exportSimResult} className="w-full px-5 py-3 flex items-center gap-3 text-[11px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                  <FileText size={14} /> <span>Export as .txt</span>
                               </button>
                            </div>
                          )}
                       </div>
                    </div>
                    
                    <div className="p-12 bg-gray-900/60 border-l-4 border-l-blue-500 border-y border-r border-white/5 rounded-r-[4rem] rounded-l-[1.5rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden ring-1 ring-white/5">
                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
                       
                       <div className="text-[16px] text-gray-200 leading-[2.2] italic whitespace-pre-wrap font-medium relative z-10 selection:bg-blue-500/30">
                          {simResult.split('\n').map((line, idx) => {
                             if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8 border-b border-blue-500/20 pb-4">{line.replace('# ', '')}</h1>;
                             if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-black text-blue-400 uppercase tracking-widest mt-10 mb-6">{line.replace('## ', '')}</h2>;
                             if (line.startsWith('- ')) return <div key={idx} className="flex gap-4 mb-3"><span className="text-blue-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span><span className="text-gray-300 font-medium">{line.replace('- ', '')}</span></div>;
                             return <p key={idx} className="mb-4">{line}</p>;
                          })}
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between opacity-50 relative z-10">
                          <div className="flex items-center gap-2">
                             <Terminal size={14} className="text-blue-500" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Checksum: VERIFIED</span>
                          </div>
                          <p className="text-[8px] font-bold text-gray-600">© 2025 ZV GRANDMASTER CORE</p>
                       </div>
                    </div>
                 </div>
               ) : !isSimulating && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20 animate-in fade-in duration-1000 delay-500">
                    <Radar size={80} className="text-gray-500 mb-8 animate-ping" style={{animationDuration: '4s'}} />
                    <div className="space-y-2">
                      <p className="text-sm font-black uppercase tracking-[0.5em] text-gray-400">Deep Search Inactive</p>
                      <p className="text-[10px] font-bold text-gray-600 italic">Target selection required for tactical projection.</p>
                    </div>
                 </div>
               )}

               {isSimulating && (
                 <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in">
                    <div className="relative">
                       <Loader2 size={120} className="text-blue-500/20 animate-spin" />
                       <BrainCircuit size={48} className="text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="mt-12 text-center space-y-4">
                       <p className="text-xl font-black italic text-white uppercase tracking-tighter">Synthesizing Tactical Matrix</p>
                       <div className="flex items-center justify-center gap-2">
                          <span className="w-12 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 w-1/2 animate-[shimmer_2s_infinite]"></div>
                          </span>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Core Cycles: {Math.floor(Date.now()/1000)%99}%</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* TAB CONTENT: GUARD (IMMUNITY) */}
          {activeTab === 'immunity' && (
            <div className="space-y-8 animate-in fade-in pb-12">
              <div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5">
                <p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projectile Resistance Cap</p>
                <div className={`text-9xl font-black italic tracking-tighter ${totalImmunity >= 100 ? 'text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'text-white'}`}>{totalImmunity.toFixed(1)}%</div>
                <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">{totalImmunity >= 100 ? 'SYSTEM IMMUNE' : 'VULNERABILITY DETECTED'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Dragon Rings (Max 2)', val: immunitySetup.rings, set: (v: number) => setImmunitySetup(p => ({...p, rings: v})) },
                  { label: 'Atreus Level 120 (+7%)', check: immunitySetup.atreus120, set: (v: boolean) => setImmunitySetup(p => ({...p, atreus120: v})) },
                  { label: 'Onir Level 120 (+10%)', check: immunitySetup.onir120, set: (v: boolean) => setImmunitySetup(p => ({...p, onir120: v})) },
                  { label: 'Bulletproof Locket (+15%)', check: immunitySetup.locket, set: (v: boolean) => setImmunitySetup(p => ({...p, locket: v})) },
                ].map((row, i) => (
                  <div key={i} className="p-6 bg-gray-900/60 border border-white/5 rounded-[2.5rem] flex items-center justify-between">
                     <span className="text-[11px] font-black text-gray-400 uppercase italic">{row.label}</span>
                     {row.hasOwnProperty('val') ? (
                       <input type="number" max="2" min="0" value={row.val} onChange={e => (row as any).set(Number(e.target.value))} className="bg-white/5 w-12 text-center text-white font-black rounded-lg p-1" />
                     ) : (
                       <button onClick={() => (row as any).set(!row.check)} className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${row.check ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-white/10'}`}>
                         {row.check && <CheckCircle2 size={14}/>}
                       </button>
                     )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: BURST (DPS) */}
          {activeTab === 'dps' && (
             <div className="space-y-8 animate-in fade-in pb-12">
               <div className="p-6 bg-amber-600/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
                 <AlertCircle className="text-amber-500 shrink-0" size={20} />
                 <p className="text-[11px] font-medium text-amber-100/80 leading-relaxed italic">
                   <span className="font-black text-amber-500 uppercase tracking-wider block mb-1">Manual Calibration:</span> 
                   Type in your specific hero stats from the inventory screen. Automated sync does not include skill-modifiers.
                 </p>
               </div>
               <div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative ring-1 ring-white/5">
                 <p className="text-[11px] font-black text-gray-600 uppercase mb-4 tracking-[0.3em]">Projected Effective DPS</p>
                 <div className="text-9xl font-black text-white italic tracking-tighter">{calculatedDPS.toLocaleString()}</div>
                 <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Integrated Combat Potency</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { k: 'baseAtk', l: 'Raw ATK' },
                    { k: 'critChance', l: 'Crit Chance %' },
                    { k: 'critDmg', l: 'Crit Dmg %' },
                    { k: 'atkSpeed', l: 'Atk Speed %' }
                  ].map(s => (
                    <div key={s.k} className="p-8 bg-gray-900/60 border border-white/5 rounded-[3rem]">
                       <label className="text-[10px] font-black text-gray-600 uppercase block mb-2">{s.l}</label>
                       <input type="number" value={(calcStats as any)[s.k]} onChange={e => setCalcStats(p => ({...p, [s.k]: Number(e.target.value)}))} className="bg-transparent text-white text-3xl font-black outline-none w-full" />
                    </div>
                  ))}
               </div>
             </div>
          )}

          {/* TAB CONTENT: FARMING */}
          {activeTab === 'farming' && (
            <div className="space-y-6 pb-12 animate-in fade-in">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900/60 rounded-[2rem] border border-white/5 sticky top-[130px] z-50 backdrop-blur-xl shadow-lg">
                <SortHeader label="Resource" field="resource" currentSort={farmingSort} />
                <SortHeader label="Chapter" field="chapter" currentSort={farmingSort} />
                <SortHeader label="Efficiency" field="efficiency" currentSort={farmingSort} />
                <SortHeader label="Avg Time" field="avgTime" currentSort={farmingSort} />
              </div>

              {filteredFarming.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <Compass size={48} className="mx-auto mb-4 animate-spin-slow" />
                  <p className="text-xs font-black uppercase tracking-widest">No routes found in sector</p>
                </div>
              ) : (
                filteredFarming.map((route) => {
                  const efficiencyColor = route.efficiency === 'SSS' ? 'text-red-500 border-red-500/20 bg-red-500/5' : route.efficiency === 'SS' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5';
                  return (
                    <div key={route.id} className={`bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedFarmingId === route.id ? 'ring-2 ring-orange-500/30 shadow-4xl scale-[1.01]' : 'hover:border-white/20'}`}>
                      <button onClick={() => { setExpandedFarmingId(expandedFarmingId === route.id ? null : route.id); playSfx('click'); }} className="w-full p-6 flex items-center justify-between group relative overflow-hidden">
                        <div className="flex items-center gap-6 text-left relative z-10">
                          <div className={`w-16 h-16 rounded-3xl flex flex-col items-center justify-center font-black border transition-colors ${efficiencyColor}`}>
                            <span className="text-[10px] uppercase opacity-60">Eff</span>
                            <span className="text-xl leading-none">{route.efficiency}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${route.difficulty === 'Hero' ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'}`}>{route.difficulty}</span>
                              <p className="text-lg font-black text-white uppercase italic tracking-tighter">{route.chapter}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                               <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{route.resource}</p>
                               <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                               <p className="text-[9px] font-medium text-gray-500 italic">Est. {route.avgTime}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                           <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5">
                             <User size={12} className="text-gray-500" />
                             <span className="text-[9px] font-black text-gray-300 uppercase">{route.bestHero}</span>
                           </div>
                           <ChevronDown size={20} className={`text-gray-700 transition-transform duration-500 ${expandedFarmingId === route.id ? 'rotate-180 text-orange-500' : ''}`} />
                        </div>
                      </button>
                      
                      {expandedFarmingId === route.id && (
                        <div className="p-8 space-y-8 bg-black/40 border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                 <p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Efficiency</p>
                                 <p className="text-xs font-black text-white italic">{route.efficiency} Rank</p>
                              </div>
                              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                 <p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Loot Projection</p>
                                 <p className="text-xs font-black text-white italic">{route.lootRate}</p>
                              </div>
                              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                 <p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Avg Duration</p>
                                 <p className="text-xs font-black text-white italic">{route.avgTime}</p>
                              </div>
                              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                 <p className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Tactical Asset</p>
                                 <p className="text-xs font-black text-white italic">{route.bestHero}</p>
                              </div>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <h5 className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest"><MapPin size={12}/> Tactical Briefing</h5>
                                 <p className="text-xs text-gray-300 leading-relaxed italic font-medium bg-black/20 p-4 rounded-2xl border border-white/5">{route.strategy}</p>
                              </div>
                              <div className="space-y-2">
                                 <h5 className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest"><Lightbulb size={12}/> Mentor's Pro-Tip</h5>
                                 <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[11px] text-blue-100/80 italic font-bold">
                                    {route.proTip}
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB CONTENT: RELICS */}
          {activeTab === 'relics' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-12">
              {filteredRelics.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-30">
                  <Search size={48} className="mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No matching relics in sector</p>
                </div>
              ) : (
                filteredRelics.map((r, index) => {
                  const styles = getRelicStyles(r.tier);
                  const isTopRow = index < 3; 
                  const setBonusEffect = r.setBonus ? SET_BONUS_DESCRIPTIONS[r.setBonus] : null;
                  const requiredRelics = r.setBonus ? RELIC_DATA.filter(other => other.setBonus === r.setBonus).map(other => other.name) : [];

                  return (
                    <div key={r.id} onClick={() => { setSelectedItem({...r, category: 'Relic'}); playSfx('click'); }} className={`relative p-8 rounded-[2.5rem] border transition-all cursor-pointer group active:scale-95 flex flex-col items-center text-center ${styles.card}`}>
                      <div className={`invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute left-1/2 -translate-x-1/2 w-64 p-5 bg-gray-950/98 backdrop-blur-3xl border rounded-[2rem] shadow-4xl z-[500] pointer-events-none animate-in fade-in ${isTopRow ? 'top-[110%] slide-in-from-top-2' : '-top-4 -translate-y-full slide-in-from-bottom-2'} ${styles.tooltip}`}>
                        {r.lore && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1.5 opacity-60">
                                <ScrollText size={10} className="shrink-0" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Relic Lore</span>
                            </div>
                            <p className="text-[10px] text-gray-300 font-medium italic leading-relaxed text-left">"{r.lore}"</p>
                          </div>
                        )}
                        {r.setBonus && (
                          <div className="pt-3 border-t border-white/5 space-y-3">
                             <div className="flex items-center gap-2">
                                <Link2 size={12} className="text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">{r.setBonus} resonance</span>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Full Set Synergy:</p>
                               <p className="text-[11px] text-gray-200 font-bold italic leading-tight text-left">{setBonusEffect || "Synergy effect unknown."}</p>
                             </div>
                             <div className="space-y-1">
                               <p className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Required Relics:</p>
                               <div className="flex flex-wrap gap-1.5">
                                 {requiredRelics.map(name => (
                                   <span key={name} className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${name === r.name ? 'bg-orange-600/20 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>{name}</span>
                                 ))}
                               </div>
                             </div>
                          </div>
                        )}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-950 rotate-45 ${isTopRow ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-r border-b'} ${styles.arrow}`}></div>
                      </div>
                      <div className={`w-16 h-16 rounded-2xl mb-5 flex items-center justify-center border transition-transform group-hover:rotate-12 ${styles.iconContainer}`}>
                        <RelicIcon type={r.iconType} className="w-8 h-8" />
                      </div>
                      <p className="text-[11px] font-black text-white uppercase italic tracking-tighter mb-1 leading-tight">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{r.tier} Tier</span>
                        {r.setBonus && (
                          <>
                            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                            <div className="flex items-center gap-1 text-orange-500/80">
                               <Link2 size={8} />
                               <span className="text-[8px] font-black uppercase tracking-tighter">Set</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
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
                   <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-center"><p className="text-sm font-black text-blue-400">LV {jewelSimLevel}</p></div>
                 </div>
                 <input type="range" min="1" max="40" value={jewelSimLevel} onChange={(e) => setJewelSimLevel(parseInt(e.target.value))} className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJewels.map(j => (
                  <div key={j.id} onClick={() => { setSelectedItem({...j, category: 'Jewel'}); playSfx('click'); }} className="cursor-pointer group relative">
                    <div className={`p-8 bg-gradient-to-br ${getJewelColorClasses(j.color)} rounded-[3rem] border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.03] active:scale-95 flex flex-col gap-6 h-full`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-black/40 rounded-[1.4rem] border border-white/10 flex items-center justify-center transition-transform duration-500"><Gem size={28} /></div>
                             <div><h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{j.name}</h4></div>
                          </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'ai' && (
            <div className="flex flex-col h-[65vh] animate-in fade-in">
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-10">
                {chatHistory.length === 0 && (
                  <div className="p-12 text-center space-y-6">
                    <div className="w-24 h-24 bg-orange-600/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500 animate-pulse"><Bot size={48} /></div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tactical Uplink Established</h3>
                    <p className="text-xs text-gray-400 leading-relaxed italic max-w-sm mx-auto">"Hello there, fellow archer! I'm your tactical mentor. Ask me anything about gear, boss patterns, or meta evolutions."</p>
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
        <div 
          ref={navScrollRef} 
          className="w-full max-w-3xl overflow-x-auto no-scrollbar flex items-center gap-2 px-4 pb-2 touch-pan-x draggable-content" 
          onMouseDown={(e) => handleDragStart(e, navScrollRef)}
        >
          {[
            { id: 'meta', icon: LayoutGrid, label: 'Archive' },
            { id: 'tracker', icon: Target, label: 'Sync' },
            { id: 'formula', icon: Variable, label: 'Formula' },
            { id: 'dragons', icon: Flame, label: 'Dragons' },
            { id: 'refine', icon: Wrench, label: 'Refine' },
            { id: 'vs', icon: ArrowRightLeft, label: 'Gear Vs' },
            { id: 'analyze', icon: BrainCircuit, label: 'Sim' },
            { id: 'immunity', icon: Shield, label: 'Guard' },
            { id: 'farming', icon: Map, label: 'Farming' },
            { id: 'dps', icon: Calculator, label: 'Burst' },
            { id: 'jewels', icon: Disc, label: 'Jewel' },
            { id: 'relics', icon: Box, label: 'Relic' },
            { id: 'ai', icon: MessageSquare, label: 'Grandmaster' },
          ].map(t => (
            <button 
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

      {/* Hero Comparison Floating Bar */}
      {compareHeroIds.length > 0 && activeTab === 'meta' && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[400] w-full max-w-md px-5 animate-in slide-in-from-bottom-5 duration-500">
          <div className="bg-gray-950/90 backdrop-blur-3xl border border-blue-500/30 rounded-[2rem] p-4 flex items-center justify-between shadow-4xl ring-1 ring-blue-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                <Scale size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Compare Protocol</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">{compareHeroIds.length} / 3 Heroes Locked</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCompareHeroIds([])}
                className="p-3 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
              <button 
                onClick={() => setIsCompareModalOpen(true)}
                disabled={compareHeroIds.length < 2}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Launch Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsCompareModalOpen(false)} />
           <div className="relative w-full max-w-4xl bg-gray-950 border border-white/10 rounded-[3rem] p-8 sm:p-12 max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 shadow-4xl overflow-x-auto">
              <div className="flex items-center justify-between mb-10 min-w-[600px]">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-500">
                    <Scale size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Tactical Hero Comparison</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Neural Data Synchronization: SUCCESS</p>
                  </div>
                </div>
                <button onClick={() => setIsCompareModalOpen(false)} className="p-4 bg-white/5 rounded-full border border-white/10 text-gray-400 hover:text-white transition-all"><X size={24}/></button>
              </div>
              <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(200px,1fr))] gap-6 min-w-[700px]">
                <div className="space-y-6 pt-24">
                  {['Tier', 'Global Bonus (L120)', 'Shard Cost', 'Unique Effect', 'Deep Logic', 'Evo 4★'].map(label => (
                    <div key={label} className="h-24 flex items-center px-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
                {comparedHeroes.map(hero => (
                  <div key={hero.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 bg-gray-900/60 border border-white/10 rounded-3xl text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-3xl">🦸</div>
                      <h3 className="text-xl font-black text-white uppercase italic truncate w-full">{hero.name}</h3>
                    </div>
                    <div className="h-24 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center">
                      <Badge tier={hero.tier} />
                    </div>
                    <div className="h-24 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center">
                      <p className="text-sm font-black text-orange-500 italic uppercase">{hero.globalBonus120}</p>
                    </div>
                    <div className="h-24 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center">
                      <p className="text-[11px] font-bold text-purple-400 uppercase italic leading-tight">{hero.shardCost || "Event Exclusive"}</p>
                    </div>
                    <div className="h-24 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center overflow-y-auto no-scrollbar">
                      <p className="text-[10px] font-medium text-blue-400 italic leading-snug">{hero.uniqueEffect || "Standard Build"}</p>
                    </div>
                    <div className="h-24 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center overflow-y-auto no-scrollbar">
                      <p className="text-[10px] font-medium text-gray-300 italic leading-snug">{hero.deepLogic || "Scan missing."}</p>
                    </div>
                    <div className="h-24 p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-center overflow-y-auto no-scrollbar">
                      <p className="text-[10px] font-medium text-yellow-500/80 italic leading-snug">{hero.evo4Star || "Passive Only"}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-14 pt-8 border-t border-white/5 flex items-center justify-between opacity-30 min-w-[600px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">Targeting specific synergies for high-wave chapters.</p>
                <p className="text-[8px] font-bold text-gray-700 uppercase">Archive Analysis: Complete</p>
              </div>
           </div>
        </div>
      )}

      {/* INSPECTOR MODAL - COMPREHENSIVE VIEW */}
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
                   {selectedItem.bio && (
                     <div className="p-8 bg-gray-900/40 rounded-[2.5rem] border border-white/5 space-y-3">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><History size={16} /> Biological Archive</h4>
                        <p className="text-[13px] text-gray-300 font-medium leading-relaxed italic">"{selectedItem.bio}"</p>
                     </div>
                   )}
                   <div className="p-10 bg-gray-950 border border-white/10 rounded-[3rem] shadow-inner relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><BrainCircuit size={100} /></div>
                     <h4 className="text-[11px] font-black text-orange-500 uppercase mb-5 flex items-center gap-3 tracking-[0.3em] relative z-10"><ScrollText size={22}/> Deep Logic Summary</h4>
                     <div className="text-[15px] text-gray-100 font-medium leading-[1.8] italic whitespace-pre-wrap relative z-10">
                        {selectedItem.deepLogic || "Neural uplink required for deep architectural scan."}
                     </div>
                   </div>
                </div>
                {selectedItem.category === 'Hero' && selectedItem.historicalTiers && selectedItem.historicalTiers.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="px-4 text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-3 italic"><Milestone size={22}/> Meta Evolution History</h4>
                    <div className="p-10 bg-gray-900/30 border border-white/5 rounded-[3rem] relative overflow-hidden">
                       <div className="absolute top-0 left-[2.5rem] w-px h-full bg-gradient-to-b from-orange-500/20 via-orange-500/5 to-transparent"></div>
                       <div className="space-y-10 relative z-10">
                          {selectedItem.historicalTiers.map((hist: any, hIdx: number) => (
                            <div key={hIdx} className="flex items-center gap-8 group/item">
                               <div className="relative">
                                 <div className="w-4 h-4 rounded-full bg-gray-950 border-2 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)] z-10 relative"></div>
                                 <div className="absolute inset-0 w-4 h-4 rounded-full bg-orange-500 animate-ping opacity-20"></div>
                               </div>
                               <div className="flex-1 flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-500">
                                  <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{hist.update}</p>
                                    <p className="text-sm font-bold text-white italic">Update Archive Data</p>
                                  </div>
                                  <Badge tier={hist.tier} />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}
                {selectedItem.category === 'Hero' && selectedItem.gearSets && selectedItem.gearSets.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="px-4 text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3 italic"><Swords size={22}/> Recommended Gear Sets</h4>
                    <div className="space-y-6">
                      {selectedItem.gearSets.map((set: GearSet, sIdx: number) => (
                        <div key={sIdx} className="p-8 bg-blue-900/5 border border-blue-500/20 rounded-[3rem] relative overflow-hidden group hover:bg-blue-900/10 transition-colors">
                           <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                             <LayoutGrid size={80} />
                           </div>
                           <div className="flex items-center justify-between mb-6">
                              <h5 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> {set.name}
                              </h5>
                              <button 
                                onClick={() => handleExportBuild(selectedItem.name, set)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                              >
                                <Copy size={12} /> EXPORT BUILD
                              </button>
                           </div>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                             <BuildSlot label="Weapon" name={set.weapon} icon={Sword} />
                             <BuildSlot label="Armor" name={set.armor} icon={Shield} />
                             <BuildSlot label="Bracelet" name={set.bracelet} icon={Zap} />
                             <BuildSlot label="Locket" name={set.locket} icon={Target} />
                             <BuildSlot label="Book" name={set.book} icon={Book} />
                             {set.rings.map((ringName, rIdx) => (
                               <BuildSlot key={rIdx} label={`Ring ${rIdx + 1}`} name={ringName} icon={Circle} />
                             ))}
                           </div>
                           <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Set Synergy Resonance</p>
                             <p className="text-[13px] text-gray-300 font-medium italic leading-relaxed italic">"{set.synergy}"</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   {selectedItem.globalBonus120 && (
                     <div className="p-7 bg-orange-600/10 border border-orange-500/20 rounded-[2.5rem] group hover:bg-orange-600/15 transition-colors">
                        <div className="flex items-center gap-3 mb-2"><AwardIcon size={18} className="text-orange-500"/><p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Global Perk (L120)</p></div>
                        <p className="text-2xl font-black text-white italic">{selectedItem.globalBonus120}</p>
                     </div>
                   )}
                   {selectedItem.shardCost && (
                     <div className="p-7 bg-purple-600/10 border border-purple-500/20 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-2"><Gem size={18} className="text-purple-500"/><p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Shard Acquisition</p></div>
                        <p className="text-lg font-black text-white italic">{selectedItem.shardCost}</p>
                     </div>
                   )}
                   {selectedItem.bestSkin && (
                     <div className="p-7 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] col-span-full">
                        <div className="flex items-center gap-3 mb-2"><StarIcon size={18} className="text-blue-500"/><p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Optimal Skin Variant</p></div>
                        <p className="text-lg font-black text-white italic">{selectedItem.bestSkin}</p>
                     </div>
                   )}
                   {selectedItem.evo4Star && (
                     <div className="p-7 bg-yellow-500/10 border border-yellow-500/20 rounded-[2.5rem] col-span-full">
                        <div className="flex items-center gap-3 mb-2"><Zap size={18} className="text-yellow-500"/><p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Evolution Perk (4★)</p></div>
                        <p className="text-[14px] font-bold text-gray-200 italic leading-relaxed">{selectedItem.evo4Star}</p>
                     </div>
                   )}
                </div>
                <div className="space-y-6">
                   {selectedItem.mythicPerk && (
                     <div className="p-9 bg-gradient-to-br from-orange-600/20 to-transparent border border-orange-500/40 rounded-[3rem] shadow-4xl">
                        <div className="flex items-center gap-3 mb-4"><Sparkles size={22} className="text-orange-500" /><p className="text-[11px] font-black text-orange-500 uppercase tracking-widest">Mythic Peak Resonance</p></div>
                        <p className="text-[18px] font-black text-white italic leading-snug">"{selectedItem.mythicPerk}"</p>
                     </div>
                   )}
                   {selectedItem.uniqueEffect && (
                     <div className="p-8 bg-blue-900/10 border border-blue-500/20 rounded-[2.8rem] flex items-start gap-4">
                        <Zap size={24} className="text-blue-500 mt-1 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Unique Protocol</p>
                          <p className="text-[14px] font-black text-white italic leading-relaxed">{selectedItem.uniqueEffect}</p>
                        </div>
                     </div>
                   )}
                   {selectedItem.rarityPerks && selectedItem.rarityPerks.length > 0 && (
                     <div className="space-y-4">
                        <h5 className="px-4 text-[11px] font-black text-gray-500 uppercase tracking-widest italic flex items-center gap-2"><Layers size={14}/> Rarity Evolution Matrix</h5>
                        <div className="grid grid-cols-1 gap-2">
                           {selectedItem.rarityPerks.map((p: any, i: number) => (
                             <div key={i} className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{p.rarity}</span>
                                <span className="text-[12px] font-bold text-gray-200 italic">{p.effect}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
                <div className="grid grid-cols-1 gap-5">
                   {selectedItem.bestPairs && selectedItem.bestPairs.length > 0 && (
                     <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] flex items-start gap-5">
                        <Link2 className="text-blue-400 mt-1 shrink-0" size={24} />
                        <div>
                           <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">S-Tier Loadout Synergy</p>
                           <div className="flex flex-wrap gap-2">
                              {selectedItem.bestPairs.map((p: string) => (
                                <span key={p} className="px-4 py-1.5 bg-blue-600/10 text-blue-400 text-[11px] font-black rounded-xl border border-blue-500/20 shadow-inner">{p}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}
                   {selectedItem.assistHeroes && selectedItem.assistHeroes.length > 0 && (
                     <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] flex items-start gap-5">
                        <Users className="text-purple-400 mt-1 shrink-0" size={24} />
                        <div>
                           <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">Recommended Assist Protocol</p>
                           <div className="flex flex-wrap gap-2">
                              {selectedItem.assistHeroes.map((p: string) => (
                                <span key={p} className="px-4 py-1.5 bg-purple-600/10 text-purple-400 text-[11px] font-black rounded-xl border border-purple-500/20">{p}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}
                   {selectedItem.trivia && (
                     <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] flex items-start gap-5">
                        <Lightbulb className="text-yellow-400 mt-1 shrink-0" size={24} />
                        <div>
                           <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Tactical Trivia</p>
                           <p className="text-[13px] text-gray-300 font-medium italic leading-relaxed">{selectedItem.trivia}</p>
                        </div>
                     </div>
                   )}
                </div>
                {selectedItem.category === 'Relic' && (
                   <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-gray-500 uppercase mb-1 flex items-center gap-2">
                             <Link2 size={12} className="text-orange-500" /> Set Resonance
                           </p>
                           <p className="text-sm font-black text-white uppercase italic">{selectedItem.setBonus || "Standalone"}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Chapter Source</p>
                           <p className="text-sm font-black text-white uppercase italic">{selectedItem.source || "Archive Lock"}</p>
                        </div>
                      </div>
                      {selectedItem.stars && (
                        <div className="space-y-4">
                           <h5 className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Evolution Growth Path</h5>
                           <div className="space-y-2">
                             {selectedItem.stars.map((s: string, i: number) => (
                               <div key={i} className="px-7 py-4 bg-white/5 rounded-2xl border border-white/5 text-[13px] font-bold text-gray-200 italic flex items-center gap-5">
                                 <div className="flex items-center gap-1 shrink-0">
                                   {[...Array(i+1)].map((_, idx) => <Star key={idx} size={11} className="text-yellow-500 fill-current" />)}
                                 </div>
                                 {s}
                               </div>
                             ))}
                           </div>
                        </div>
                      )}
                   </div>
                )}
                {selectedItem.category === 'Jewel' && (
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Stat Scaling Type</p>
                            <p className="text-sm font-black text-white uppercase italic">{selectedItem.statType}</p>
                         </div>
                         <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Available Sockets</p>
                            <p className="text-sm font-black text-white uppercase italic">{selectedItem.slots.join(', ')}</p>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <h5 className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Resonance Bonuses</h5>
                         <div className="p-7 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                               <span className="text-[11px] font-black text-blue-400 uppercase">LV 16</span>
                               <span className="text-[12px] font-bold text-white italic">{selectedItem.bonus16}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                               <span className="text-[11px] font-black text-orange-400 uppercase">LV 28</span>
                               <span className="text-[12px] font-bold text-white italic">{selectedItem.bonus28}</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <span className="text-[11px] font-black text-red-500 uppercase">LV 40</span>
                               <span className="text-[12px] font-bold text-white italic">{selectedItem.bonus40 || "Unknown Prototype"}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
              </div>
            </div>
            <div className="mt-14 pt-10 border-t border-white/5 flex items-center justify-between opacity-30">
               <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-orange-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">System Signature: v6.3.0_ZVA</span>
               </div>
               <p className="text-[8px] font-bold text-gray-600">© 2025 ZV ARMORY CORE</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
