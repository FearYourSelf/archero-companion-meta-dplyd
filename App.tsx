
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
  Lock, FunctionSquare, Variable, ChevronDown, Hammer, Coins, Archive
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, FARMING_ROUTES, DRAGON_DATA, GLYPH_DATA 
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic } from './types';
import { Badge, Card } from './components/UI';

// --- Tactical Glossary for Context-Aware Tooltips ---
const GLOSSARY: Record<string, string> = {
  'ATK': 'Attack Power: The core stat determining your raw damage output before multipliers.',
  'Base ATK': 'The fundamental attack value shown on your character screen without in-game battle buffs.',
  'DR': 'Damage Resistance: Percentage reduction of incoming damage. Capped at ~75% for most mechanics.',
  'Crit Dmg': 'Critical Damage: The multiplier applied to your damage during a critical strike (e.g., 400% = 4x damage).',
  'Crit %': 'Critical Chance: The percentage probability that an attack will result in a critical hit.',
  'Atk SPD': 'Attack Speed: Increases the frequency of your attacks, significantly boosting DPS and stutter-stepping efficiency.',
  'Stutter Stepping': 'Moving briefly after firing to cancel the recovery animation, allowing for a 30-40% increase in fire rate.',
  'Immunity Formula': 'The build logic of stacking Proj Resistance to 100% using 2x Dragon Rings, L120 passives, and Bulletproof Locket.',
  'DR Cap': 'Damage Reduction Cap: The internal limit Archero places on stacking resistance (usually around 75-80%).',
  'Melee-hybrid': 'A playstyle using weapons like Expedition Fist or Demon Blade that switch between ranged and high-damage melee.',
  'Resonance': 'Synergy bonuses unlocked when specific item types or dragon rarities are equipped together.',
  'Magestone': 'Resource used for Dragon skills. Regeneration speed is tied to standing still and dragon resonance.',
  'Refine Essence': 'Resource obtained from smelting high-rarity gear, used to upgrade equipment slots permanently.',
  'Titan Node': 'Advanced equipment upgrade levels (Titan Tales) that provide massive final damage multipliers.',
  'Proj Resist': 'Projectile Resistance: Reduces damage taken specifically from ranged enemies and bosses.',
  'Collision Resist': 'Collision Resistance: Reduces damage taken from physical contact with enemies.',
};

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

// --- Synth Audio Engine ---
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

// --- Improved Global Mouse-Following Tooltip ---
const Tooltip: React.FC<{ text: string; children: React.ReactNode; className?: string }> = ({ text, children, className = "" }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const offset = 18;
    const margin = 20;
    let x = clientX + offset;
    let y = clientY + offset;

    if (tooltipRef.current) {
      const { offsetWidth: w, offsetHeight: h } = tooltipRef.current;
      if (x + w > window.innerWidth - margin) x = clientX - w - offset;
      if (y + h > window.innerHeight - margin) y = clientY - h - offset;
      if (x < margin) x = margin;
      if (y < margin) y = margin;
    }
    setCoords({ x, y });
  };

  return (
    <div 
      onMouseEnter={() => setVisible(true)}
      onMouseMove={updatePosition}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={(e) => { setVisible(true); updatePosition(e); }}
      onTouchEnd={() => setVisible(false)}
      className={`inline-flex items-center justify-center cursor-help ${className}`}
    >
      {children}
      {visible && createPortal(
        <div 
          ref={tooltipRef}
          style={{ 
            position: 'fixed', 
            left: `${coords.x}px`, 
            top: `${coords.y}px`, 
            pointerEvents: 'none', 
            zIndex: 9999,
            transform: 'translate3d(0,0,0)' 
          }}
          className="px-4 py-2.5 bg-gray-950/98 border border-orange-500/50 text-white text-[10px] font-black rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/10 max-w-[200px] uppercase tracking-wider text-center"
        >
          {text}
        </div>,
        document.body
      )}
    </div>
  );
};

const TOUR_STEPS = [
  { tab: 'meta', target: '[data-tour="search"]', title: 'Tactical Archive', content: 'Search the entire Archero database. Use the Crown icon to filter for only SSS Meta entries.' },
  { tab: 'tracker', target: '[data-tour="global-stats"]', title: 'Global Synthesis', content: 'Aggregates all passive L120 bonuses. Sync your heroes to see your account potential.' },
  { tab: 'formula', target: '[data-tour="formula-core"]', title: 'Formula Matrix', content: 'Advanced damage calculation. Manually enter your attributes to see your true hit potential.' },
  { tab: 'dragons', target: '[data-tour="dragon-sockets"]', title: 'Dragon Resonance', content: 'Socket your dragons here. Ensuring one of each type (Atk, Def, Bal) maximizes Magestone output.' },
  { tab: 'refine', target: '[data-tour="refine-utility"]', title: 'Refinement Protocol', content: 'The ultimate guide to gear recycling. Use the Smelt Calculator to predict your essence yield.' },
  { tab: 'vs', target: '[data-tour="gear-compare"]', title: 'Comparison Matrix', content: 'Decision core for high-tier upgrades. Side-by-side analysis for Titan and Mythic paths.' },
  { tab: 'analyze', target: '[data-tour="sim-card"]', title: 'Neural Synthesis', content: 'Our AI engine simulates your build. It takes 10-15s to generate a detailed strategic report.' },
  { tab: 'immunity', target: '[data-tour="immunity-display"]', title: 'Guard Protocol', content: 'Track your path to 100% Projectile Immunity. Mandatory for Hero Chapter survival.' },
  { tab: 'farming', target: '[data-tour="farming-list"]', title: 'Resource Hub', content: 'Optimized drop routes. We monitor live drop anomalies across all Hero chapters.' },
  { tab: 'dps', target: '[data-tour="dps-card"]', title: 'Burst Calculator', content: 'Real-time calculation of your effective DPS including Crit and Speed modifiers.' },
  { tab: 'jewels', target: '[data-tour="jewel-grid"]', title: 'Jewel Vault', content: 'Access hidden bonuses for Level 16 and 28 jewel thresholds across all gear slots.' },
  { tab: 'relics', target: '[data-tour="relic-grid"]', title: 'Relic Sync', content: 'Track Holy and Radiant relics. Set synergies provide massive hidden power boosts.' },
  { tab: 'estate', target: '[data-tour="estate-core"]', title: 'Estate Logistics', content: 'Manage resource production and personnel allocation for passive resource generation.' },
  { tab: 'ai', target: '[data-tour="oracle-input"]', title: 'Neural Oracle', content: 'Direct strategic uplink. Ask for evolution priority, build advice, or meta trends.' }
];

const WalkthroughBubble: React.FC<{ 
  stepIndex: number; 
  onNext: () => void; 
  onBack: () => void; 
  onClose: () => void;
  onSkip: () => void;
}> = ({ stepIndex, onNext, onBack, onClose, onSkip }) => {
  const [pos, setPos] = useState({ top: 0, left: 0, opacity: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const step = TOUR_STEPS[stepIndex];

  useLayoutEffect(() => {
    const update = () => {
      const target = document.querySelector(step.target);
      if (!target || !bubbleRef.current) return;
      const rect = target.getBoundingClientRect();
      const bubble = bubbleRef.current.getBoundingClientRect();
      const margin = 20;
      let top = rect.bottom + 15;
      let left = rect.left + (rect.width / 2) - (bubble.width / 2);
      if (left < margin) left = margin;
      if (left + bubble.width > window.innerWidth - margin) left = window.innerWidth - bubble.width - margin;
      if (top + bubble.height > window.innerHeight - margin) top = rect.top - bubble.height - 15;
      if (top < margin) top = margin;
      setPos({ top, left, opacity: 1 });
    };
    const t = setTimeout(update, 500);
    window.addEventListener('resize', update);
    return () => { clearTimeout(t); window.removeEventListener('resize', update); };
  }, [stepIndex, step.tab]);

  return createPortal(
    <>
      <div 
        ref={bubbleRef}
        style={{ 
          position: 'fixed', top: pos.top, left: pos.left, opacity: pos.opacity, zIndex: 9999, 
          pointerEvents: pos.opacity ? 'auto' : 'none', 
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
        className="w-[92vw] max-w-[340px] bg-gray-950 border-2 border-orange-500/60 rounded-[2rem] p-6 shadow-[0_40px_100px_rgba(0,0,0,1)] ring-1 ring-white/10"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-black text-white uppercase italic flex items-center gap-2 tracking-tight shrink-0"><Sparkles className="text-orange-500 shrink-0" size={18}/>{step.title}</h3>
          <button onClick={onSkip} className="text-[10px] font-black text-gray-600 hover:text-orange-500 transition-all uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg">Skip All</button>
        </div>
        <p className="text-[12px] text-gray-400 font-medium leading-relaxed mb-8">{step.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === stepIndex ? 'w-6 bg-orange-500' : 'w-1 bg-white/10'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onBack} disabled={stepIndex === 0} className="p-2.5 bg-white/5 rounded-xl text-gray-400 disabled:opacity-5 hover:bg-white/10 transition-colors"><ChevronLeft size={20}/></button>
            <button onClick={onNext} className="px-5 py-2.5 bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-orange-500 shadow-xl shadow-orange-950/50 transition-all flex items-center gap-2 whitespace-nowrap">
              {stepIndex < TOUR_STEPS.length - 1 ? 'Forward' : 'Done'} <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>
      {document.querySelector(step.target) && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: `${document.querySelector(step.target)!.getBoundingClientRect().top - 6}px`,
            left: `${document.querySelector(step.target)!.getBoundingClientRect().left - 6}px`,
            width: `${document.querySelector(step.target)!.getBoundingClientRect().width + 12}px`,
            height: `${document.querySelector(step.target)!.getBoundingClientRect().height + 12}px`,
            zIndex: 9998, pointerEvents: 'none',
          }}
          className="border-2 border-orange-500 rounded-2xl animate-pulse ring-4 ring-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
        />,
        document.body
      )}
    </>,
    document.body
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'tracker' | 'analyze' | 'dps' | 'vs' | 'relicVs' | 'immunity' | 'lab' | 'jewels' | 'relics' | 'farming' | 'ai' | 'estate' | 'formula' | 'dragons' | 'refine'>('meta');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<GearCategory | 'All'>('All');
  const [relicTierFilter, setRelicTierFilter] = useState<'All' | 'Holy' | 'Radiant' | 'Faint'>('All');
  const [sssOnly, setSssOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItem | Hero | null>(null);
  const [selectedRelic, setSelectedRelic] = useState<Relic | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [maintenanceToast, setMaintenanceToast] = useState(false);
  
  const scrollContainerRef = useRef<HTMLElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  // Fixed ReferenceError: 'ref' is not defined. Initialized scrollLeft and scrollTop to 0 for the initial ref value.
  const dragRef = useRef({ isDragging: false, moved: false, startX: 0, startY: 0, lastX: 0, lastTime: Date.now(), velocity: 0, scrollLeft: 0, scrollTop: 0, mode: 'both' as 'both' | 'horizontal', targetRef: null as any });
  const inertiaRef = useRef<number | null>(null);

  const [unlockedHeroes, setUnlockedHeroes] = useState<Record<string, { lv120: boolean }>>(() => JSON.parse(localStorage.getItem('archero_v6_tracker') || '{}'));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('archero_v6_chat') || '[]'));
  const [calcStats, setCalcStats] = useState<CalcStats>(() => JSON.parse(localStorage.getItem('archero_v6_stats') || '{"baseAtk":75000,"critChance":45,"critDmg":420,"atkSpeed":60,"weaponType":"Expedition Fist"}'));
  
  const [vsItemA, setVsItemA] = useState<string>(GEAR_DATA[0]?.id || '');
  const [vsItemB, setVsItemB] = useState<string>(GEAR_DATA[1]?.id || GEAR_DATA[0]?.id || '');
  
  const [vsRelicA, setVsRelicA] = useState<string>(RELIC_DATA[0]?.id || '');
  const [vsRelicB, setVsRelicB] = useState<string>(RELIC_DATA[1]?.id || RELIC_DATA[0]?.id || '');
  
  const [immunitySetup, setImmunitySetup] = useState({ rings: 2, atreus120: true, onir120: true, locket: true, necrogon: false });
  const [estateWorkers, setEstateWorkers] = useState(10);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [buildHero, setBuildHero] = useState<string>(HERO_DATA[0]?.id || '');
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [labStreak, setLabStreak] = useState(0);
  const [bestLabStreak, setBestLabStreak] = useState(Number(localStorage.getItem('archero_lab_streak') || 0));
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [fInputs, setFInputs] = useState({ baseAtk: 60000, atkPercent: 75, weaponDmgPercent: 15, critDmg: 380 });
  const [dragons, setDragons] = useState({ slot1: DRAGON_DATA[0]?.id || '', slot2: DRAGON_DATA[1]?.id || '', slot3: DRAGON_DATA[2]?.id || '' });
  const [smeltItem, setSmeltItem] = useState<'Epic' | 'PE' | 'Legendary' | 'AL' | 'Mythic'>('Legendary');
  const [smeltQty, setSmeltQty] = useState(1);

  const playSfx = (type: 'click' | 'hover' | 'tab' | 'msg' | 'error') => {
    if (soundEnabled) {
      SFX.init();
      SFX.play(type);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "'") { e.preventDefault(); setShowDebug(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('archero_v6_tour_complete');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setTourStep(0);
        addLog("Initiating first-time tactical walkthrough...");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const addLog = (msg: string) => {
    setDebugLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const handleDragStart = (e: React.MouseEvent, ref: React.RefObject<HTMLElement | null>, mode: 'both' | 'horizontal' = 'both') => {
    if (!ref.current) return;
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
    const target = e.target as HTMLElement;
    if (target.closest('button, input, select, textarea, a')) return;
    ref.current.style.scrollBehavior = 'auto';
    dragRef.current = { isDragging: true, moved: false, startX: e.pageX, startY: e.pageY, lastX: e.pageX, lastTime: Date.now(), velocity: 0, scrollLeft: ref.current.scrollLeft, scrollTop: ref.current.scrollTop, mode, targetRef: ref };
  };

  const handleDragMove = (e: React.MouseEvent) => {
    const d = dragRef.current;
    if (!d.isDragging || !d.targetRef?.current) return;
    if (e.buttons !== 1) { handleDragEnd(); return; }
    const ref = d.targetRef.current;
    const now = Date.now();
    const dt = now - d.lastTime;
    const dx = (e.pageX - d.startX) * 1.5; 
    const dy = (e.pageY - d.startY) * 1.5;
    const v = dt > 0 ? (e.pageX - d.lastX) / dt : 0;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      if (!d.moved) d.moved = true;
      e.preventDefault();
      if (d.mode === 'horizontal') ref.scrollLeft = d.scrollLeft - dx;
      else { ref.scrollLeft = d.scrollLeft - dx; ref.scrollTop = d.scrollTop - dy; }
      d.lastX = e.pageX; d.lastTime = now; d.velocity = v;
    }
  };

  const handleDragEnd = () => {
    const d = dragRef.current;
    if (d.isDragging) {
      const ref = d.targetRef?.current;
      if (ref) {
        if (d.mode === 'horizontal' && Math.abs(d.velocity) > 0.15) applyInertia(ref, d.velocity);
        else ref.style.scrollBehavior = 'smooth';
      }
      d.isDragging = false;
    }
  };

  const applyInertia = (ref: HTMLElement, velocity: number) => {
    let currentV = velocity * 18;
    const friction = 0.94;
    const step = () => {
      if (Math.abs(currentV) < 0.1) { ref.style.scrollBehavior = 'smooth'; return; }
      ref.scrollLeft -= currentV; currentV *= friction;
      inertiaRef.current = requestAnimationFrame(step);
    };
    inertiaRef.current = requestAnimationFrame(step);
  };

  useLayoutEffect(() => {
    const bars = [headerScrollRef.current, navScrollRef.current];
    const cleanupFns: (() => void)[] = [];
    bars.forEach(bar => {
      if (!bar) return;
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > 0) {
          e.preventDefault();
          if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
          bar.style.scrollBehavior = 'smooth';
          bar.scrollBy({ left: e.deltaY * 4.5, behavior: 'smooth' });
        }
      };
      bar.addEventListener('wheel', onWheel, { passive: false });
      cleanupFns.push(() => bar.removeEventListener('wheel', onWheel));
    });
    window.addEventListener('mouseup', handleDragEnd);
    return () => { cleanupFns.forEach(fn => fn()); window.removeEventListener('mouseup', handleDragEnd); };
  }, []);

  useEffect(() => { localStorage.setItem('archero_v6_tracker', JSON.stringify(unlockedHeroes)); }, [unlockedHeroes]);
  useEffect(() => { localStorage.setItem('archero_v6_chat', JSON.stringify(chatHistory)); }, [chatHistory]);
  useEffect(() => { localStorage.setItem('archero_v6_stats', JSON.stringify(calcStats)); }, [calcStats]);
  useEffect(() => { if (labStreak > bestLabStreak) setBestLabStreak(labStreak); }, [labStreak]);
  useEffect(() => { localStorage.setItem('archero_lab_streak', bestLabStreak.toString()); }, [bestLabStreak]);

  useEffect(() => {
    if (tourStep !== null) {
      const targetTab = TOUR_STEPS[tourStep].tab as any;
      if (targetTab !== 'lab') {
        setActiveTab(targetTab);
      }
      if (navScrollRef.current) {
        const icon = navScrollRef.current.querySelector(`[data-tab-id="${TOUR_STEPS[tourStep].tab}"]`);
        if (icon) icon.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [tourStep]);

  useEffect(() => {
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

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

  const calculatedDPS = useMemo(() => {
    const { baseAtk, critChance, critDmg, atkSpeed } = calcStats;
    return Math.round(baseAtk * (1 + (critChance / 100 * (critDmg / 100))) * (1 + (atkSpeed / 100)));
  }, [calcStats]);

  const totalImmunity = useMemo(() => {
    return (immunitySetup.rings * 13.8) + (immunitySetup.atreus120 ? 7 : 0) + (immunitySetup.onir120 ? 10 : 0) + (immunitySetup.locket ? 15 : 0) + (immunitySetup.necrogon ? 7.5 : 0);
  }, [immunitySetup]);

  const formulaResult = useMemo(() => {
    const { baseAtk, atkPercent, weaponDmgPercent, critDmg } = fInputs;
    return Math.round(baseAtk * (1 + atkPercent/100) * (1 + weaponDmgPercent/100) * (critDmg/100));
  }, [fInputs]);

  const dragonSynergy = useMemo(() => {
    const selected = [
      DRAGON_DATA.find(d => d.id === dragons.slot1),
      DRAGON_DATA.find(d => d.id === dragons.slot2),
      DRAGON_DATA.find(d => d.id === dragons.slot3)
    ];
    const types = selected.map(s => s?.type).filter(Boolean);
    const uniqueTypes = new Set(types);
    return uniqueTypes.size === 3;
  }, [dragons]);

  const smeltEssenceYield = useMemo(() => {
    const baseline: Record<string, number> = { 'Epic': 50, 'PE': 150, 'Legendary': 500, 'AL': 1200, 'Mythic': 3500 };
    return (baseline[smeltItem] || 0) * smeltQty;
  }, [smeltItem, smeltQty]);

  const runSimulation = async () => {
    playSfx('click');
    setIsSimulating(true); setSimResult(null);
    const hero = HERO_DATA.find(h => h.id === buildHero);
    const prompt = `Perform an ADVANCED ARCHERO TACTICAL SYNTHESIS for hero ${hero?.name} at ${calcStats.baseAtk} Attack. 
    Structure your output as follows:
    # BUILD ARCHITECTURE (Short summary)
    ## CORE EQUIPMENT (List mandatory slots)
    ## STRATEGIC DEPTH (Advanced mechanics)
    ## NEXT-LEVEL PRIORITY (Upgrades to focus on)
    Use # for main headers, ## for subheaders, and **Bold** for gear names. Use - for bullet points. Keep it professional yet encouraging.`;
    
    try {
      addLog(`Initiating neural sim for ${hero?.name}...`);
      const response = await chatWithAI(prompt, []);
      setSimResult(response || 'Simulation timeout.');
      addLog("Sim result received.");
    } catch (e) { 
      const errMsg = e instanceof Error ? e.message : String(e);
      addLog(`Sim Error: ${errMsg}`);
      setSimResult('Neural core error. Uplink severed.'); 
    }
    finally { setIsSimulating(false); }
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    playSfx('msg');
    const msg = aiInput; setAiInput('');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, timestamp: Date.now() }]);
    setIsAiLoading(true);
    try {
      addLog(`Uplink: Sending query to Tactical Mentor...`);
      const response = await chatWithAI(msg, chatHistory.map(h => ({ role: h.role, text: h.text })));
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'Mentor offline.', timestamp: Date.now() }]);
      addLog("Oracle response successful.");
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      addLog(`Oracle Error: ${errMsg}`);
      let friendlyError = `Archives Offline. (System: ${errMsg.substring(0, 50)}...)`;
      if (errMsg.toLowerCase().includes('leaked') || errMsg.includes('403')) {
        friendlyError = "SYSTEM BLOCKED: Your API key is leaked. Contact support to restore uplink.";
      }
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: friendlyError, timestamp: Date.now() }]);
    } finally { setIsAiLoading(false); }
  };

  const executeClearChat = () => {
    playSfx('click');
    setChatHistory([]);
    setIsConfirmingClear(false);
    addLog("Tactical archives cleared.");
  };

  const filteredData = useMemo(() => {
    return [...HERO_DATA, ...GEAR_DATA].filter(item => {
      const matchesSearch = fuzzyMatch(item.name, searchQuery);
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSss = !sssOnly || item.tier === 'SSS';
      return matchesSearch && matchesCategory && matchesSss;
    }).sort((a, b) => {
      // Prioritize items that start with the query
      const aStarts = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bStarts = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }, [searchQuery, categoryFilter, sssOnly]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return [...HERO_DATA, ...GEAR_DATA]
      .filter(item => fuzzyMatch(item.name, searchQuery))
      .slice(0, 5);
  }, [searchQuery]);

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

  const renderMessageText = (text: string, isModel: boolean) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;
      if (trimmed.startsWith('# ')) return <h2 key={idx} className="text-base font-black text-orange-500 uppercase italic mt-4 mb-2 tracking-tight">{trimmed.replace(/^#\s/, '')}</h2>;
      if (trimmed.startsWith('## ')) return <h3 key={idx} className="text-[13px] font-black text-gray-400 uppercase italic mt-3 mb-1">{trimmed.replace(/^##\s/, '')}</h3>;
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.replace(/^[*-\s]+/, '');
        return (
          <div key={idx} className="flex gap-2 mb-1 pl-1">
            <span className="text-orange-500 font-black">•</span>
            <span className="flex-1">{formatInline(content)}</span>
          </div>
        );
      }
      if (trimmed.toUpperCase().includes('MENTOR\'S SECRET:')) {
        return (
          <div key={idx} className="my-6 p-6 bg-gradient-to-br from-orange-600/15 via-orange-500/5 to-transparent border border-orange-500/30 rounded-[2.5rem] animate-in slide-in-from-left-4 shadow-xl ring-1 ring-orange-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-orange-600 rounded-lg shadow-lg"><Sparkles size={16} className="text-white" /></div>
              <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em]">Mentor's Secret</span>
            </div>
            <span className="text-[13px] italic text-gray-100 leading-relaxed font-semibold">{formatInline(trimmed.replace(/^MENTOR'S SECRET:\s*/i, ''))}</span>
          </div>
        );
      }
      return <p key={idx} className="mb-2.5 leading-relaxed">{formatInline(trimmed)}</p>;
    });
  };

  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-orange-500 shadow-orange-500/10 drop-shadow-sm">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const vsItemVerdict = useMemo(() => {
    const itemA = GEAR_DATA.find(i => i.id === vsItemA);
    const itemB = GEAR_DATA.find(i => i.id === vsItemB);
    const tierWeight: Record<string, number> = { 'SSS': 100, 'SS': 80, 'S': 60, 'A': 40, 'B': 30, 'C': 20, 'D': 10, 'F': 0 };
    const scoreA = tierWeight[itemA?.tier || 'F'];
    const scoreB = tierWeight[itemB?.tier || 'F'];
    if (scoreA > scoreB) return { winner: itemA?.name, reason: `Rank gap: ${itemA?.tier} superior to ${itemB?.tier}. ${itemA?.name} offers significantly higher base multipliers and late-game scaling.` };
    if (scoreB > scoreA) return { winner: itemB?.name, reason: `Rank gap: ${itemB?.tier} superior to ${itemA?.tier}. ${itemB?.name} is the meta choice for this slot compared to ${itemA?.name}.` };
    return { winner: 'Situational', reason: 'Equal tier items. Choosing between them depends on your current chapter mechanics (e.g. boss density vs mob waves).' };
  }, [vsItemA, vsItemB]);

  const RelicIcon: React.FC<{ type?: Relic['iconType']; className?: string }> = ({ type, className }) => {
    switch (type) {
      case 'Sword': return <Sword className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Scroll': return <Scroll className={className} />;
      case 'Gem': return <Gem className={className} />;
      case 'Eye': return <Eye className={className} />;
      case 'Book': return <BookOpen className={className} />;
      case 'Cup': return <Wine className={className} />;
      case 'Arrow': return <ArrowUp className={className} />;
      default: return <Sparkle className={className} />;
    }
  };

  const filteredRelics = useMemo(() => {
    if (relicTierFilter === 'All') return RELIC_DATA;
    return RELIC_DATA.filter(r => r.tier === relicTierFilter);
  }, [relicTierFilter]);

  const completeTour = () => {
    localStorage.setItem('archero_v6_tour_complete', 'true');
    setTourStep(null);
    addLog("Tactical walkthrough completed. Protocol saved.");
  };

  return (
    <div className="h-screen w-full bg-[#030712] text-gray-100 flex flex-col font-sans max-w-3xl mx-auto relative overflow-hidden border-x border-white/5 shadow-4xl">
      
      {showDebug && (
        <div className="fixed top-0 left-0 w-full h-[30vh] bg-black/95 z-[3000] border-b border-orange-500/30 p-4 font-mono text-[10px] text-orange-400 overflow-y-auto no-scrollbar pointer-events-none">
          <div className="flex justify-between items-center mb-2 border-b border-orange-500/10 pb-1">
            <span className="flex items-center gap-2 font-black uppercase tracking-widest"><Bug size={12}/> Diagnostic Terminal</span>
            <span className="text-[8px] opacity-40">Ctrl + ' to hide</span>
          </div>
          {debugLogs.map((log, i) => <div key={i} className="mb-0.5">{log}</div>)}
        </div>
      )}

      {maintenanceToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-in fade-in zoom-in duration-300 pointer-events-none">
          <div className="px-12 py-8 bg-gray-950/95 border-2 border-orange-500/60 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,1)] ring-1 ring-white/10 flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30">
                <AlertTriangle className="text-orange-500 animate-pulse" size={32} />
             </div>
             <p className="text-xl font-black text-white italic uppercase tracking-tighter text-center leading-none">Under Maintenance</p>
             <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest text-center">indefinitely until i fix it</p>
          </div>
        </div>
      )}

      {tourStep !== null && (
        <WalkthroughBubble 
          stepIndex={tourStep}
          onNext={() => tourStep < TOUR_STEPS.length - 1 ? setTourStep(tourStep + 1) : completeTour()}
          onBack={() => setTourStep(Math.max(0, tourStep - 1))}
          onClose={() => setTourStep(null)}
          onSkip={completeTour}
        />
      )}

      <header className="bg-gray-950/95 backdrop-blur-3xl border-b border-white/5 p-5 shrink-0 z-[100]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Trophy className="text-orange-500 w-8 h-8 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
            <div>
              <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none">ZA ARMORY GRANDMASTER</h1>
              <p className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase mt-1">Advanced Tactical Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip text="Toggle Interface SFX">
              <button onClick={() => { setSoundEnabled(!soundEnabled); playSfx('click'); }} className="p-3.5 bg-white/5 text-gray-500 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-white/10 active:scale-90">
                {soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
              </button>
            </Tooltip>
            <Tooltip text="Tactical Walkthrough">
              <button onClick={() => { setTourStep(0); playSfx('click'); }} className="p-3.5 bg-white/5 text-orange-500 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-orange-500/20 active:scale-90"><HelpIcon size={18} /></button>
            </Tooltip>
            <Tooltip text="Back to Archive">
              <button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setActiveTab('meta'); playSfx('click'); }} className="p-3.5 bg-white/5 text-gray-500 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-white/10 active:scale-90"><Archive size={18} /></button>
            </Tooltip>
          </div>
        </div>
        
        {activeTab === 'meta' && (
          <div data-tour="search" className="space-y-4 animate-in slide-in-from-top-2 relative">
            <div className="flex items-center gap-3">
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Scanning fuzzy data..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-orange-500/50 text-white transition-all" 
                  value={searchQuery} 
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }} 
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {searchSuggestions.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => { setSearchQuery(item.name); setShowSuggestions(false); playSfx('click'); }}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-orange-500/10 transition-colors text-left"
                      >
                        <span className="text-xs font-bold text-gray-200">{item.name}</span>
                        <Badge tier={item.tier} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Tooltip text={sssOnly ? "SSS Restricted" : "Show All Tiers"}>
                <button onClick={() => { setSssOnly(!sssOnly); playSfx('click'); }} className={`p-4 rounded-2xl border transition-all active:scale-90 ${sssOnly ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-600'}`}><Crown size={20} /></button>
              </Tooltip>
            </div>
            <div ref={headerScrollRef} onMouseDown={(e) => handleDragStart(e, headerScrollRef, 'horizontal')} onMouseMove={handleDragMove} className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 draggable-content smooth-scroll snap-x-container whitespace-nowrap">
              {['All', 'Hero', 'Weapon', 'Armor', 'Ring', 'Locket', 'Dragon', 'Pet', 'Relic', 'Egg', 'Totem', 'Glyph'].map(cat => (
                <Tooltip key={cat} text={`Filter by ${cat}`}>
                  <button onClick={() => { setCategoryFilter(cat as any); playSfx('click'); }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex-shrink-0 border ${categoryFilter === cat ? 'bg-orange-600 text-white border-orange-400 shadow-md' : 'bg-white/5 text-gray-500 border-white/5 hover:text-gray-300'}`}>{cat}</button>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relics' && (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 draggable-content smooth-scroll snap-x-container whitespace-nowrap animate-in slide-in-from-top-2">
            {['All', 'Holy', 'Radiant', 'Faint'].map(tier => (
              <Tooltip key={tier} text={`Show ${tier} Relics`}>
                <button 
                  onClick={() => { setRelicTierFilter(tier as any); playSfx('tab'); }}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${relicTierFilter === tier ? 'bg-orange-600 text-white border-orange-400 shadow-lg' : 'bg-white/5 text-gray-500 border-white/5 hover:text-gray-300'}`}
                >
                  {tier}
                </button>
              </Tooltip>
            ))}
          </div>
        )}
      </header>

      <main ref={scrollContainerRef} onMouseDown={(e) => handleDragStart(e, scrollContainerRef, 'both')} onMouseMove={handleDragMove} className="flex-1 overflow-y-auto px-5 py-8 draggable-content no-scrollbar pb-40 scroll-smooth relative">
        {activeTab === 'meta' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map(item => (
              <Card key={item.id} tier={item.tier}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge tier={item.tier} />
                    <span className="text-[8px] font-black text-gray-500 uppercase">{item.category}</span>
                  </div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-tighter mb-1">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 mb-2 line-clamp-2 h-[30px]">{item.desc}</p>
                  <Tooltip text={`View details for ${item.name}`}>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedItem(item); playSfx('click'); }} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-gray-400 hover:text-orange-500 transition-all active:scale-95">Archive Protocol</button>
                  </Tooltip>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-in fade-in">
            <div data-tour="global-stats" className="p-6 bg-orange-600/10 border border-orange-500/20 rounded-[2rem]">
              <h4 className="text-[10px] font-black text-orange-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
                <Tooltip text={GLOSSARY['Resonance']}><Activity size={14}/></Tooltip> Integrated Global Synthesis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(calculateGlobalStats()).map(([stat, val]) => (
                  <div key={stat} className="p-4 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
                    <Tooltip text={GLOSSARY[stat] || `Passive bonus for ${stat}`}>
                      <p className="text-[8px] font-black text-gray-500 uppercase">{stat}</p>
                    </Tooltip>
                    <p className="text-xl font-black text-white">+{val}%</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HERO_DATA.map(h => (
                <div key={h.id} className="p-4 bg-gray-900/60 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-3"><Badge tier={h.tier} /><span className="text-xs font-black text-white italic uppercase tracking-tighter">{h.name}</span></div>
                  <Tooltip text={`Toggle L120 bonus for ${h.name}`}>
                    <button onClick={(e) => { e.stopPropagation(); setUnlockedHeroes(prev => ({ ...prev, [h.id]: { lv120: !prev[h.id]?.lv120 } })); playSfx('click'); }} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${unlockedHeroes[h.id]?.lv120 ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-gray-600 hover:text-gray-400'}`}>{unlockedHeroes[h.id]?.lv120 ? 'Sync Active' : 'Sync L120'}</button>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'formula' && (
          <div data-tour="formula-core" className="space-y-8 animate-in fade-in pb-12">
            <div className="p-6 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center gap-5 ring-1 ring-blue-500/10 shadow-xl">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center shrink-0"><Info className="text-blue-500" size={24} /></div>
              <p className="text-[11px] text-blue-400 font-black uppercase tracking-widest leading-relaxed">Attention Archer: The calculation below requires manual data entry from your in-game Character attributes screen. Ensure all multipliers are active before inputting.</p>
            </div>

            <div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative group ring-1 ring-white/5">
              <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-[12px] font-black text-gray-600 uppercase mb-5 tracking-[0.2em]">Effective Hybrid Multiplier</p>
              <div className="text-9xl font-black text-white italic tracking-tighter drop-shadow-2xl">{formulaResult.toLocaleString()}</div>
              <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Single Hit Capacity (Base)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { k: 'baseAtk', l: 'Base ATK', t: GLOSSARY['Base ATK'] },
                { k: 'atkPercent', l: 'ATK %', t: GLOSSARY['ATK'] },
                { k: 'weaponDmgPercent', l: 'Weapon Dmg %', t: 'Final multiplier applied to weapon damage.' },
                { k: 'critDmg', l: 'Crit Dmg %', t: GLOSSARY['Crit Dmg'] }
              ].map(s => (
                <div key={s.k} className="p-10 bg-gray-900/60 border border-white/5 rounded-[3.5rem] focus-within:border-orange-500/40 transition-all shadow-xl">
                  <Tooltip text={s.t}>
                    <label className="text-[11px] font-black text-gray-600 uppercase block mb-4 tracking-widest">{s.l}</label>
                  </Tooltip>
                  <input 
                    type="number" 
                    value={fInputs[s.k as keyof typeof fInputs]} 
                    onChange={e => { setFInputs(p => ({ ...p, [s.k]: Number(e.target.value) })); playSfx('click'); }} 
                    className="bg-transparent text-white text-5xl font-black outline-none w-full tabular-nums" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dragons' && (
          <div data-tour="dragon-sockets" className="space-y-12 animate-in fade-in pb-12">
            <div className={`p-10 rounded-[4rem] border-2 text-center transition-all shadow-4xl relative overflow-hidden ${dragonSynergy ? 'bg-green-600/10 border-green-500/40 text-green-500' : 'bg-red-600/10 border-red-500/40 text-red-500'}`}>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Flame className="w-full h-full scale-150 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                  {dragonSynergy ? <ShieldCheck size={32} className="animate-bounce" /> : <ZapOff size={32} className="animate-pulse" />}
                  <p className="text-3xl font-black uppercase italic tracking-tighter">
                    {dragonSynergy ? 'Perfect Resonance' : 'Resonance Failed'}
                  </p>
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em]">
                  {dragonSynergy ? 'Configuration Optimal: All types aligned.' : 'Logic Warning: Inefficient type overlap detected.'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center gap-8 py-10">
              {['slot1', 'slot2', 'slot3'].map((slot, idx) => {
                const dragon = DRAGON_DATA.find(d => d.id === dragons[slot as keyof typeof dragons]);
                return (
                  <div key={slot} className="flex flex-col items-center gap-4 group">
                    <Tooltip text={`Modify Dragon Socket ${idx + 1}`}>
                      <div className="relative">
                        <div className={`w-32 h-32 rounded-[2.5rem] border-4 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xl ${
                          dragon?.type === 'Attack' ? 'border-red-500/40 bg-red-950/20 text-red-500' :
                          dragon?.type === 'Defense' ? 'border-blue-500/40 bg-blue-950/20 text-blue-500' :
                          'border-green-500/40 bg-green-950/20 text-green-500'
                        }`}>
                          <Flame size={48} className={dragonSynergy ? 'animate-pulse' : ''} />
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                            {idx + 1}
                          </div>
                        </div>
                        <select 
                          value={dragons[slot as keyof typeof dragons]} 
                          onChange={e => { setDragons(p => ({ ...p, [slot]: e.target.value })); playSfx('click'); }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        >
                          {DRAGON_DATA.map(d => <option key={d.id} value={d.id}>{d.name} ({d.type})</option>)}
                        </select>
                      </div>
                    </Tooltip>
                    <p className="text-[10px] font-black text-white uppercase italic tracking-widest">{dragon?.name}</p>
                    <Badge tier={dragon?.type === 'Attack' ? 'SS' : dragon?.type === 'Defense' ? 'S' : 'A'} />
                  </div>
                );
              })}
            </div>

            <div className="p-8 bg-gray-900/60 border border-white/5 rounded-[3rem] shadow-xl">
               <h4 className="text-[11px] font-black text-orange-500 uppercase mb-6 tracking-widest flex items-center gap-3"><Info size={16}/> Synergy Logic</h4>
               <p className="text-[12px] font-medium text-gray-400 leading-relaxed italic">By socketing one of each type (Attack, Defense, Balance), you unlock the **Global <Tooltip text={GLOSSARY['Magestone']}>Magestone Overclock</Tooltip>**. This allows for 25% faster mana regeneration when standing still.</p>
            </div>
          </div>
        )}

        {activeTab === 'refine' && (
          <div data-tour="refine-utility" className="space-y-12 animate-in fade-in pb-12">
            <div className="p-10 bg-gray-950 border border-white/10 rounded-[4rem] shadow-4xl relative overflow-hidden ring-1 ring-white/5">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-red-600"></div>
              <h3 className="text-3xl font-black text-white italic uppercase mb-10 tracking-tighter flex items-center gap-4"><Hammer className="text-orange-500" /> Smelt Efficiency Protocol</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Target Gear Rarity</label>
                    <Tooltip text="Select the quality of gear you are smelting">
                      <select 
                        value={smeltItem} 
                        onChange={e => { setSmeltItem(e.target.value as any); playSfx('click'); }}
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white outline-none focus:ring-1 focus:ring-orange-500/50 appearance-none shadow-xl cursor-pointer"
                      >
                        {['Epic', 'PE', 'Legendary', 'AL', 'Mythic'].map(r => <option key={r} value={r} className="bg-gray-950">{r}</option>)}
                      </select>
                    </Tooltip>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Quantity</label>
                    <Tooltip text="Number of items to smelt">
                      <div className="flex items-center gap-4">
                        <button onClick={() => { setSmeltQty(q => Math.max(1, q - 1)); playSfx('click'); }} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-xl font-black">-</button>
                        <div className="flex-1 bg-black/40 border border-white/10 rounded-xl py-4 text-center text-xl font-black tabular-nums">{smeltQty}</div>
                        <button onClick={() => { setSmeltQty(q => q + 1); playSfx('click'); }} className="w-12 h-12 bg-orange-600 border border-orange-400 rounded-xl text-xl font-black shadow-lg shadow-orange-950/50">+</button>
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <div className="p-10 bg-orange-600/10 border border-orange-500/30 rounded-[3rem] flex flex-col items-center justify-center text-center shadow-inner">
                  <p className="text-[11px] font-black text-orange-500 uppercase mb-4 tracking-[0.2em]">Estimated <Tooltip text={GLOSSARY['Refine Essence']}>Refine Essence</Tooltip></p>
                  <div className="flex items-center gap-4">
                    <Coins className="text-orange-500" size={32} />
                    <span className="text-6xl font-black text-white italic drop-shadow-2xl">{smeltEssenceYield.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-6 tracking-widest">Protocol Verified</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Variable className="text-orange-500" /> Refinement Logic Trace</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                   { l: 'Lvl 1-10', d: 'Base ATK / HP increments. 2x Essence cost.' },
                   { l: 'PE Unlock', d: 'Slot resonance enables first Glyph socket.' },
                   { l: 'Chaos Path', d: 'Mandatory refinement for 100k+ ATK builds.' }
                 ].map((trace, i) => (
                   <Tooltip key={i} text="Refinement Stage Details">
                     <div className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-orange-500/20 transition-all cursor-default">
                       <p className="text-[10px] font-black text-orange-400 uppercase mb-2 italic tracking-tighter">{trace.l}</p>
                       <p className="text-[11px] font-bold text-gray-300 leading-snug">{trace.d}</p>
                     </div>
                   </Tooltip>
                 ))}
               </div>
            </div>

            <div className="p-8 bg-gray-900/60 border border-white/10 rounded-[3rem] shadow-xl">
              <h4 className="text-[10px] font-black text-gray-500 uppercase mb-6 tracking-widest flex items-center gap-2"><Disc size={16}/> Socketable Glyph Database</h4>
              <div className="space-y-3">
                {GLYPH_DATA.map((g, idx) => (
                  <Tooltip key={idx} text={`Details for ${g.name}`}>
                    <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/40 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-600/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-500"><Sparkle size={18} /></div>
                          <div><p className="text-sm font-black text-white italic uppercase leading-none">{g.name}</p><p className="text-[10px] text-gray-500 mt-1 font-medium italic">{g.desc}</p></div>
                       </div>
                       <Badge tier={g.slot === 'Weapon' ? 'SSS' : g.slot === 'Armor' ? 'SS' : 'S'} />
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vs' && (
          <div data-tour="gear-compare" className="space-y-8 animate-in fade-in pb-12">
            <div className="p-6 bg-gray-900/80 border border-white/5 rounded-[2.5rem] flex items-center gap-6 ring-1 ring-white/5 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                <BarChart3 className="text-orange-500" size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-[12px] font-black text-white uppercase italic tracking-wider">Comparison Verdict</p>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  <span className="text-orange-500 font-bold uppercase tracking-tight">Recommendation:</span> {vsItemVerdict.winner === 'Situational' ? vsItemVerdict.winner : <span className="text-white italic">{vsItemVerdict.winner}</span>} - {vsItemVerdict.reason}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[ {id: vsItemA, setter: setVsItemA, list: GEAR_DATA, label: 'Gear A'}, {id: vsItemB, setter: setVsItemB, list: GEAR_DATA, label: 'Gear B'} ].map((slot, idx) => {
                const item = slot.list.find(i => i.id === slot.id);
                return (
                  <div key={idx} className="space-y-6 flex flex-col">
                    <Tooltip text={`Select ${slot.label}`}>
                      <div className="relative group">
                        <select 
                          value={slot.id} 
                          onChange={e => { slot.setter(e.target.value); playSfx('click'); }} 
                          className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] py-5 px-6 text-sm font-black text-white outline-none ring-1 ring-white/5 focus:ring-orange-500/50 appearance-none shadow-xl cursor-pointer hover:bg-black/80 transition-colors"
                        >
                          {slot.list.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500 rotate-90 pointer-events-none" size={20} />
                      </div>
                    </Tooltip>
                    {item && (
                      <Card tier={item.tier} className="flex-1 border-2 border-white/5 flex flex-col !p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="p-6 border-b border-white/5 bg-white/2">
                          <div className="flex items-center justify-between mb-4">
                            <Badge tier={item.tier}/>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.category}</span>
                          </div>
                          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{item.name}</h3>
                          <p className="text-[11px] font-medium text-gray-400 mt-3 italic line-clamp-2 h-8">{item.desc}</p>
                        </div>
                        
                        <div className="p-6 space-y-6 flex-1">
                          {item.mythicPerk && (
                            <div className="p-4 bg-orange-600/5 border border-orange-500/20 rounded-2xl shadow-inner">
                              <p className="text-[9px] font-black text-orange-500 uppercase mb-2 flex items-center gap-2 tracking-widest"><Trophy size={14}/> <Tooltip text={GLOSSARY['Titan Node']}>Titan Node</Tooltip></p>
                              <p className="text-[11px] font-bold text-gray-100 leading-relaxed italic">"{item.mythicPerk}"</p>
                            </div>
                          )}

                          {item.deepLogic && (
                            <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl shadow-inner">
                              <p className="text-[9px] font-black text-blue-500 uppercase mb-2 flex items-center gap-2 tracking-widest"><Scan size={14}/> Logic Core</p>
                              <p className="text-[11px] font-bold text-gray-300 leading-relaxed italic">{item.deepLogic.split('\n')[0]}</p>
                            </div>
                          )}
                        </div>

                        {item.bestPairs && item.bestPairs.length > 0 && (
                          <div className="p-6 bg-black/40 border-t border-white/5">
                            <p className="text-[8px] font-black text-gray-600 uppercase mb-3 tracking-[0.2em]">Synergy Match</p>
                            <div className="flex flex-wrap gap-2">
                              {item.bestPairs.map(p => <span key={p} className="text-[10px] font-bold text-orange-400 bg-orange-400/5 px-3 py-1 rounded-xl border border-orange-400/10 shadow-lg">{p}</span>)}
                            </div>
                          </div>
                        )}
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div data-tour="sim-card" className="space-y-6 animate-in fade-in min-h-[500px] pb-12 flex flex-col items-center">
            <div className="w-full p-2 bg-gradient-to-br from-orange-600/40 via-blue-600/20 to-purple-600/40 rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/5">
              <div className="bg-[#020617]/95 border border-white/10 p-8 sm:p-10 rounded-[2.8rem] space-y-8 relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] pointer-events-none select-none">
                  <BrainCircuit size={240}/>
                </div>
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-[1.2rem] bg-orange-600 flex items-center justify-center shadow-lg border-t border-white/20">
                      <Sparkles className="text-white" size={24}/>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">Neural Synthesis</h4>
                  </div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] leading-none">Architecture Engine v6.0</p>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-orange-500 uppercase ml-4 tracking-[0.2em] flex items-center justify-center gap-2">
                      <Scan size={16} className="animate-pulse" /> Targeted Analysis
                    </label>
                    <Tooltip text="Select target hero for tactical simulation">
                      <div className="relative group max-w-sm mx-auto">
                        <select 
                          value={buildHero} 
                          onChange={e => { setBuildHero(e.target.value); playSfx('click'); }} 
                          className="w-full bg-black/90 border border-white/10 rounded-[1.8rem] py-6 px-8 text-xl font-black text-white outline-none focus:border-orange-500/50 appearance-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] cursor-pointer text-center group-hover:bg-black transition-all"
                        >
                          {HERO_DATA.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500 rotate-90 pointer-events-none" size={24} />
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="max-w-md mx-auto flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner ring-1 ring-white/5">
                    <Timer size={20} className="text-orange-500 shrink-0" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                      Synthesis cycle requires <span className="text-orange-500">10-15s</span> of multi-threaded processing.
                    </p>
                  </div>
                  
                  <Tooltip text="Begin synthesis protocol">
                    <button 
                      onClick={(e) => { e.stopPropagation(); runSimulation(); }} 
                      disabled={isSimulating} 
                      className="w-full max-w-md mx-auto py-6 px-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-[2rem] text-[12px] font-black uppercase text-white shadow-[0_15px_40px_rgba(234,88,12,0.4)] hover:shadow-orange-500/50 active:scale-[0.96] transition-all flex items-center justify-center gap-3 disabled:opacity-20 border-t border-white/20 group overflow-hidden whitespace-nowrap"
                    >
                      {isSimulating ? (
                        <><Loader2 className="animate-spin" size={20} /> Processing Build...</>
                      ) : (
                        <><Bolt size={20} className="group-hover:animate-bounce" fill="currentColor"/> Initiate Protocol</>
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
            {simResult && (
              <div className="w-full p-8 sm:p-12 bg-gray-900/80 border border-orange-500/30 rounded-[3.5rem] shadow-4xl animate-in slide-in-from-bottom-10 backdrop-blur-3xl ring-1 ring-white/10 mt-6 overflow-hidden">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                  <ShieldCheck className="text-green-500" size={28} />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Synthesis Report Compiled</span>
                </div>
                <div className="text-gray-200 text-[14px] font-medium leading-[1.8] space-y-6">
                  {renderMessageText(simResult, true)}
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                  <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                    <Info size={14} className="text-orange-500" /> Advanced Simulation Verified
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'immunity' && (
          <div className="space-y-6 animate-in fade-in pb-12">
            <div data-tour="immunity-display" className="p-12 bg-gray-900/80 border border-white/5 rounded-[4rem] text-center shadow-4xl relative overflow-hidden ring-1 ring-white/5">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <p className="text-[11px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">
                <Tooltip text={GLOSSARY['Immunity Formula']}>Projectile Immunity Meter</Tooltip>
              </p>
              <div className="text-8xl font-black text-white italic mb-8 tracking-tighter drop-shadow-2xl">{totalImmunity.toFixed(1)}%</div>
              <div className="w-full h-6 bg-black/50 rounded-full overflow-hidden border border-white/10 p-1.5 shadow-inner">
                <div className="h-full bg-gradient-to-r from-orange-800 to-orange-500 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]" style={{ width: `${Math.min(totalImmunity, 100)}%` }}></div>
              </div>
              <p className="text-[12px] text-orange-500 font-black uppercase tracking-[0.3em] mt-6">{totalImmunity >= 100 ? 'INVULNERABLE TO PROJECTILES' : 'CALIBRATING ARMOR'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Dual Dragon Rings (+27.6%)', key: 'rings', t: GLOSSARY['Proj Resist'] },
                { label: 'Atreus L120 (+7%)', key: 'atreus120', t: 'Global L120 passive.' },
                { label: 'Onir L120 (+10%)', key: 'onir120', t: 'Global L120 passive.' },
                { label: 'Bulletproof Titan (+15%)', key: 'locket', t: 'Locket conditional resistance.' },
                { label: 'Necrogon Dragon (+7.5%)', key: 'necrogon', t: 'Passive dragon shield bonus.' }
              ].map(opt => (
                <Tooltip key={opt.key} text={opt.t}>
                  <button onClick={(e) => { e.stopPropagation(); setImmunitySetup(s => ({ ...s, [opt.key]: !s[opt.key as keyof typeof s] })); playSfx('click'); }} className={`w-full p-7 border rounded-[2rem] text-[11px] font-black uppercase transition-all flex justify-between items-center ${immunitySetup[opt.key as keyof typeof immunitySetup] ? 'bg-orange-600/20 text-orange-400 border-orange-500/40 shadow-lg' : 'bg-white/5 text-gray-600 border-white/5 hover:bg-white/10'}`}>
                    <span>{opt.label}</span>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-all ${immunitySetup[opt.key as keyof typeof immunitySetup] ? 'bg-orange-600 border-orange-400 text-white' : 'border-white/10 bg-black/40 text-transparent'}`}><CheckCircle2 size={18}/></div>
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'farming' && (
          <div data-tour="farming-list" className="space-y-4 animate-in fade-in pb-12">
            <div className="text-center mb-10"><h2 className="text-2xl font-black text-white uppercase italic tracking-widest">Optimized Drop Zones</h2><p className="text-[11px] text-orange-500 font-bold uppercase tracking-[0.3em] mt-3">Verified Chapter Yields</p></div>
            {FARMING_ROUTES.map((route, i) => (
              <div key={i} className="p-7 bg-gray-900/60 border border-white/10 rounded-[3rem] flex items-center justify-between gap-6 group hover:border-orange-500/40 transition-all shadow-xl ring-1 ring-white/5">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-[2.2rem] bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-2xl shadow-inner ring-1 ring-orange-500/5">{route.chapter.match(/\d+/)?.[0] || '?' }</div>
                  <div><p className="text-lg font-black text-white uppercase italic tracking-tight leading-none">{route.resource}</p><p className="text-[11px] font-black text-orange-500 uppercase tracking-widest mt-3">{route.chapter}</p><p className="text-[11px] text-gray-500 mt-2 font-medium italic opacity-80">{route.note}</p></div>
                </div>
                <ChevronRight size={24} className="text-gray-700 group-hover:text-orange-500 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dps' && (
          <div data-tour="dps-card" className="space-y-8 animate-in fade-in pb-12">
            <div className="p-5 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center gap-5 ring-1 ring-blue-500/10">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center shrink-0"><Info className="text-blue-500" size={24} /></div>
              <p className="text-[11px] text-blue-400 font-black uppercase tracking-widest leading-relaxed">System Calibration: Enter your exact in-game stats manually to calculate real-time effective burst DPS.</p>
            </div>

            <div className="p-16 bg-gray-950/90 border border-white/5 rounded-[5rem] text-center shadow-inner relative group ring-1 ring-white/5">
              <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-[12px] font-black text-gray-600 uppercase mb-5 tracking-[0.2em]">Effective Burst Potential</p>
              <div className="text-9xl font-black text-white italic tracking-tighter drop-shadow-2xl">{calculatedDPS.toLocaleString()}</div>
              <p className="text-[11px] text-orange-500 font-black uppercase mt-6 tracking-[0.4em]">Damage per Second Estimate</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[ 
                { k: 'baseAtk', l: 'ATK', t: GLOSSARY['Base ATK'] }, 
                { k: 'critChance', l: 'Crit %', t: GLOSSARY['Crit %'] }, 
                { k: 'critDmg', l: 'Crit Dmg %', t: GLOSSARY['Crit Dmg'] }, 
                { k: 'atkSpeed', l: 'Atk SPD %', t: GLOSSARY['Atk SPD'] } 
              ].map(s => (
                <div key={s.k} className="p-10 bg-gray-900/60 border border-white/5 rounded-[3.5rem] focus-within:border-orange-500/40 transition-all shadow-xl">
                  <Tooltip text={s.t}>
                    <label className="text-[11px] font-black text-gray-600 uppercase block mb-4 tracking-widest">{s.l}</label>
                  </Tooltip>
                  <input type="number" value={calcStats[s.k as keyof CalcStats] as number} onChange={e => { setCalcStats(p => ({ ...p, [s.k]: Number(e.target.value) })); playSfx('click'); }} className="bg-transparent text-white text-5xl font-black outline-none w-full tabular-nums" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jewels' && (
          <div data-tour="jewel-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in pb-12">
            {JEWEL_DATA.map(j => (
              <Card key={j.id} className="bg-gray-950/80 border-white/10 ring-1 ring-white/5 p-8">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{j.name}</h3>
                   <span className="text-[11px] font-black text-gray-500 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5">{j.statPerLevel} / LV</span>
                </div>
                <div className="space-y-5">
                  <div className="p-7 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner"><p className="text-[10px] font-black text-gray-600 uppercase mb-3 tracking-widest">LV 16 Threshold</p><p className="text-[14px] font-bold text-white italic leading-snug">{j.bonus16}</p></div>
                  <div className="p-7 bg-orange-600/10 border border-orange-500/30 rounded-[2rem] shadow-lg"><p className="text-[10px] font-black text-orange-500 uppercase mb-3 tracking-widest">LV 28 Threshold</p><p className="text-[14px] font-black text-white italic leading-snug">{j.bonus28}</p></div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'relics' && (
          <div data-tour="relic-grid" className="space-y-12 animate-in fade-in pb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredRelics.map(r => (
                <div 
                  key={r.id} 
                  onClick={() => { setSelectedRelic(r); playSfx('click'); }}
                  className={`
                    relative p-8 rounded-[2.5rem] border transition-all cursor-pointer group active:scale-95 flex flex-col items-center text-center
                    ${r.tier === 'Holy' ? 'bg-orange-600/5 border-orange-500/20 hover:bg-orange-600/10' : 
                      r.tier === 'Radiant' ? 'bg-purple-600/5 border-purple-500/20 hover:bg-purple-600/10' : 
                      'bg-blue-600/5 border-blue-500/20 hover:bg-blue-600/10'}
                  `}
                >
                  <div className={`
                    w-16 h-16 rounded-2xl mb-5 flex items-center justify-center border transition-transform group-hover:rotate-12
                    ${r.tier === 'Holy' ? 'bg-orange-600/20 border-orange-500/30 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 
                      r.tier === 'Radiant' ? 'bg-purple-600/20 border-purple-500/30 text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 
                      'bg-blue-600/20 border-blue-500/30 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'}
                  `}>
                    <RelicIcon type={r.iconType} className="w-8 h-8" />
                  </div>
                  <p className="text-[11px] font-black text-white uppercase italic tracking-tighter mb-1 leading-tight">{r.name}</p>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{r.tier}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-500 pb-12">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.4rem] bg-orange-600/10 border border-orange-500/20 flex items-center justify-center shadow-inner ring-1 ring-orange-500/5">
                  <HeartHandshake size={28} className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Tactical Mentor</h2>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mentor Connected</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isConfirmingClear ? (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                    <button onClick={() => { setIsConfirmingClear(false); playSfx('click'); }} className="p-3 bg-white/5 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors border border-white/5">Cancel</button>
                    <button onClick={executeClearChat} className="p-3 bg-red-600 rounded-xl text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-red-950/40 border border-red-400/50 flex items-center gap-2"><Trash2 size={14}/> Clear Now</button>
                  </div>
                ) : (
                  <Tooltip text="Purge Session Archives">
                    <button onClick={(e) => { e.stopPropagation(); setIsConfirmingClear(true); playSfx('click'); }} className="p-3.5 bg-white/5 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5 group active:scale-95"><Trash2 size={20} className="group-hover:rotate-12 transition-transform" /></button>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-12 mb-8 no-scrollbar pr-1 min-h-[450px]">
              {chatHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-60 text-center px-10 py-12 animate-in fade-in zoom-in-95">
                  <div className="w-24 h-24 rounded-[2rem] bg-orange-600/5 border border-orange-500/10 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <Bot size={56} className="text-orange-500 relative z-10 animate-bounce [animation-duration:4s]" />
                  </div>
                  <p className="text-base font-black uppercase tracking-[0.3em] leading-loose text-white mb-2">Mentor Protocol: Ready</p>
                  <p className="text-[11px] font-bold text-gray-500 uppercase max-w-xs leading-relaxed tracking-wider">Hello Archer! I'm here to help you refine your gear and conquer those Hero Chapters. What's on your mind?</p>
                </div>
              )}
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-6 duration-500`}>
                  <div className={`flex items-center gap-3 mb-3 px-4`}>
                    {msg.role === 'model' ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-950/50 ring-2 ring-orange-400/20"><HeartHandshake size={16} className="text-white"/></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-500">Supportive Mentor</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Elite Archer</span>
                        <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center border border-white/10 shadow-lg ring-2 ring-white/5"><User size={16} className="text-gray-400"/></div>
                      </div>
                    )}
                  </div>
                  <div className={`max-w-[94%] px-8 py-7 select-text shadow-2xl leading-[1.8] text-[14px] relative group ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-l-[2rem] rounded-tr-[2rem] rounded-br-lg font-bold ring-1 ring-white/10 shadow-orange-950/40' : 'bg-gray-900/60 text-gray-200 border border-white/10 backdrop-blur-3xl rounded-r-[2rem] rounded-tl-[2rem] rounded-bl-lg font-medium ring-1 ring-white/5'}`}>
                    <div className="whitespace-pre-wrap break-words">{renderMessageText(msg.text, msg.role === 'model')}</div>
                    <div className="absolute -bottom-8 opacity-0 group-hover:opacity-60 transition-all duration-300 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] py-1 px-2">Synced • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300 ml-2">
                  <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center animate-spin"><Loader2 size={16} className="text-orange-500" /></div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] animate-pulse">Mentor is reflecting...</span>
                  </div>
                  <div className="bg-gray-900/40 border border-white/5 backdrop-blur-sm rounded-r-[2rem] rounded-tl-[2rem] rounded-bl-lg w-[240px] h-16 flex items-center gap-2 px-8">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} className="h-12" />
            </div>

            <div data-tour="oracle-input" className="flex gap-4 bg-gray-950/90 backdrop-blur-3xl border border-white/10 p-4 rounded-[3rem] shadow-4xl sticky bottom-0 z-[100] ring-1 ring-white/10 animate-in slide-in-from-bottom-12 duration-700">
              <div className="flex-1 bg-white/5 rounded-2xl flex items-center px-6 group focus-within:ring-2 focus-within:ring-orange-500/30 transition-all border border-transparent focus-within:border-orange-500/20">
                <input type="text" placeholder="Ask the mentor a tactical question..." className="w-full bg-transparent text-[14px] font-bold outline-none text-white h-14" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSend()} />
              </div>
              <Tooltip text="Transmit Query">
                <button onClick={(e) => { e.stopPropagation(); handleAiSend(); }} disabled={!aiInput.trim() || isAiLoading} className="bg-orange-600 w-14 h-14 rounded-[1.5rem] hover:bg-orange-500 transition-all shadow-xl shadow-orange-950/40 active:scale-90 flex items-center justify-center border-t border-white/20 disabled:opacity-20 disabled:grayscale ring-1 ring-orange-400/20"><Send size={24} className="text-white translate-x-0.5 -translate-y-0.5"/></button>
              </Tooltip>
            </div>
          </div>
        )}
        <div className="h-32 w-full shrink-0" />
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-[500] bg-gray-950/98 backdrop-blur-3xl border-t border-white/5 p-4 flex flex-col items-center">
        <div ref={navScrollRef} onMouseDown={(e) => handleDragStart(e, navScrollRef, 'horizontal')} onMouseMove={handleDragMove} className="w-full max-w-3xl overflow-x-auto no-scrollbar draggable-content smooth-scroll snap-x-container flex items-center gap-2 px-4">
          {[
            { id: 'meta', icon: LayoutGrid, label: 'Archive' },
            { id: 'tracker', icon: Target, label: 'Sync' },
            { id: 'formula', icon: Variable, label: 'Formula' },
            { id: 'dragons', icon: Flame, label: 'Dragons' },
            { id: 'refine', icon: Wrench, label: 'Refine' },
            { id: 'vs', icon: ArrowRightLeft, label: 'Gear Vs' },
            { id: 'relicVs', icon: Layers, label: 'Relic Vs' },
            { id: 'analyze', icon: BrainCircuit, label: 'Sim' },
            { id: 'immunity', icon: Shield, label: 'Guard' },
            { id: 'lab', icon: FlaskConical, label: 'Lab', isMaintenance: true },
            { id: 'farming', icon: Map, label: 'Farming' },
            { id: 'dps', icon: Calculator, label: 'Burst' },
            { id: 'jewels', icon: Disc, label: 'Jewel' },
            { id: 'relics', icon: Box, label: 'Relic' },
            { id: 'estate', icon: Tower, label: 'Estate' },
            { id: 'ai', icon: MessageSquare, label: 'Oracle' },
          ].map(t => (
            <Tooltip key={t.id} text={t.isMaintenance ? "Lab Maintenance" : `Switch to ${t.label}`}>
              <button 
                data-tab-id={t.id} onClick={() => handleTabChange(t.id as any)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl transition-all duration-300 transform active:scale-90 group snap-center-item relative 
                  ${activeTab === t.id ? 'text-orange-500 bg-white/5 ring-1 ring-white/10 shadow-lg' : 'text-gray-500 hover:text-gray-300'}
                  ${t.isMaintenance ? 'opacity-30 grayscale saturate-0' : ''}
                `}
              >
                <t.icon size={20} className={activeTab === t.id ? 'animate-pulse' : ''} />
                {t.isMaintenance && (
                  <div className="absolute top-2 right-2">
                    <Lock size={10} className="text-gray-400" />
                  </div>
                )}
                <span className="text-[8px] font-black uppercase tracking-tight">{t.label}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </nav>

      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => { setSelectedItem(null); playSfx('click'); }} />
          <div className="relative w-full bg-[#030712] border-t border-orange-500/30 rounded-t-[4rem] p-8 sm:p-14 max-h-[95vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-32 shadow-4xl ring-1 ring-white/5">
            <div className="flex items-start justify-between mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Badge tier={selectedItem.tier} /><span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">{selectedItem.category} PROTOCOL</span>{selectedItem.isGodTier && <div className="flex items-center gap-1 text-yellow-500 font-black text-[9px] uppercase"><Star size={10} fill="currentColor"/> God Tier</div>}</div>
                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedItem.name}</h2>
              </div>
              <Tooltip text="Close Archive"><button onClick={() => { setSelectedItem(null); playSfx('click'); }} className="p-5 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-transform hover:bg-white/10 hover:border-white/20"><X size={32}/></button></Tooltip>
            </div>
            <div className="space-y-12 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedItem.mythicPerk && (
                  <div className="p-7 bg-orange-600/5 border border-orange-500/20 rounded-[2.5rem] shadow-inner ring-1 ring-orange-500/10"><p className="text-[10px] font-black text-orange-500 uppercase mb-4 flex items-center gap-2 tracking-widest"><Trophy size={16}/> Awakening Node (Titan)</p><p className="text-[14px] font-bold text-white leading-relaxed italic">"{selectedItem.mythicPerk}"</p></div>
                )}
                {(selectedItem as Hero).globalBonus120 && (
                  <div className="p-7 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] ring-1 ring-blue-500/10"><p className="text-[10px] font-black text-blue-500 uppercase mb-4 flex items-center gap-2 tracking-widest"><Award size={16}/> Synthesis Sync (L120)</p><p className="text-3xl font-black text-white italic">{(selectedItem as Hero).globalBonus120}</p><p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-widest">Global Passive Boost</p></div>
                )}
                {(selectedItem as Hero).evo4Star && (
                  <div className="p-7 bg-purple-500/5 border border-purple-500/20 rounded-[2.5rem] ring-1 ring-purple-500/10"><p className="text-[10px] font-black text-purple-500 uppercase mb-4 flex items-center gap-2 tracking-widest"><Sparkles size={16}/> 4-Star Evolution</p><p className="text-[14px] font-bold text-gray-200">{(selectedItem as Hero).evo4Star}</p></div>
                )}
                {selectedItem.uniqueEffect && (
                  <div className="p-7 bg-green-500/5 border border-green-500/20 rounded-[2.5rem] ring-1 ring-green-500/10"><p className="text-[10px] font-black text-green-500 uppercase mb-4 flex items-center gap-2 tracking-widest"><FlaskConical size={16}/> Unique Attribute</p><p className="text-[14px] font-bold text-gray-100">{selectedItem.uniqueEffect}</p></div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedItem.deepLogic && (
                  <div className="p-10 bg-gray-950 border border-white/10 rounded-[3.5rem] relative overflow-hidden group ring-1 ring-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><BrainCircuit size={120}/></div>
                    <h4 className="text-[11px] font-black text-orange-500 uppercase mb-8 flex items-center gap-3 tracking-[0.3em]"><ScrollText size={20}/> Strategist Insights</h4>
                    <div className="text-[14px] text-gray-300 font-medium leading-[2] italic select-text space-y-6">{selectedItem.deepLogic.split('\n').map((l, i) => <p key={i} className="flex gap-4 items-start"><span className="text-orange-600 font-black mt-1">>></span><span>{l.replace(/^•\s*/, '')}</span></p>)}</div>
                  </div>
                )}
                <div className="space-y-8">
                  {selectedItem.bestPairs && selectedItem.bestPairs.length > 0 && (
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] ring-1 ring-white/5">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase mb-6 tracking-[0.2em] flex items-center gap-2"><Swords size={16}/> Tactical Synergies</h4>
                      <div className="flex flex-wrap gap-3">{selectedItem.bestPairs.map((pair, idx) => <div key={idx} className="px-5 py-3 bg-gray-900 border border-white/10 rounded-2xl text-[12px] font-bold text-white italic shadow-lg ring-1 ring-orange-500/10">{pair}</div>)}</div>
                    </div>
                  )}
                  {selectedItem.trivia && (
                    <div className="p-8 bg-blue-900/5 border border-blue-500/10 rounded-[3rem] italic ring-1 ring-blue-500/5"><p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest flex items-center gap-2"><Info size={16}/> Archive Trivia</p><p className="text-[13px] text-gray-400 leading-relaxed font-medium">"{selectedItem.trivia}"</p></div>
                  )}
                </div>
              </div>
              {selectedItem.rarityPerks && selectedItem.rarityPerks.length > 0 && (
                <div className="p-10 bg-gray-950 border border-white/5 rounded-[4rem] shadow-inner ring-1 ring-white/5">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase mb-8 tracking-[0.3em] flex items-center gap-3"><Layers size={16}/> Rarity Evolution Path</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{selectedItem.rarityPerks.map((perk, pidx) => <div key={pidx} className="p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-orange-500/20 transition-all"><p className="text-[9px] font-black text-orange-400 uppercase mb-2 tracking-widest italic">{perk.rarity}</p><p className="text-[12px] font-bold text-gray-300 leading-snug">{perk.effect}</p></div>)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedRelic && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => { setSelectedRelic(null); playSfx('click'); }} />
          <div className="relative w-full bg-[#030712] border-t border-white/10 rounded-t-[4rem] p-8 sm:p-14 max-h-[95vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-32 shadow-4xl ring-1 ring-white/5">
            <div className="flex items-start justify-between mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                    selectedRelic.tier === 'Holy' ? 'bg-orange-600/20 border-orange-500/40 text-orange-400' : 
                    selectedRelic.tier === 'Radiant' ? 'bg-purple-600/20 border-purple-500/40 text-purple-400' : 
                    'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  }`}>
                    {selectedRelic.tier} Artifact Protocol
                  </span>
                </div>
                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedRelic.name}</h2>
              </div>
              <Tooltip text="Close Uplink"><button onClick={() => { setSelectedRelic(null); playSfx('click'); }} className="p-5 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-transform hover:bg-white/10 hover:border-white/20"><X size={32}/></button></Tooltip>
            </div>
            
            <div className="space-y-10 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-10 bg-gray-950 border border-white/10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute -top-6 -right-6 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><RelicIcon type={selectedRelic.iconType} className="w-48 h-48" /></div>
                     <h4 className="text-[11px] font-black text-orange-500 uppercase mb-6 tracking-[0.3em] flex items-center gap-3"><Activity size={20}/> Primary Attribute</h4>
                     <p className="text-3xl font-black text-white italic drop-shadow-lg">{selectedRelic.effect}</p>
                     <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                        <p className="text-[9px] font-black text-gray-500 uppercase mb-3 tracking-widest">Synergy Set</p>
                        <p className="text-[14px] font-bold text-gray-300 italic">{selectedRelic.setBonus || 'Universal Alignment'}</p>
                     </div>
                  </div>
                  
                  {selectedRelic.lore && (
                    <div className="p-10 bg-blue-900/5 border border-blue-500/10 rounded-[3.5rem] ring-1 ring-blue-500/5">
                      <h4 className="text-[10px] font-black text-blue-500 uppercase mb-6 tracking-widest flex items-center gap-2"><BookOpen size={16}/> Artifact Chronology</h4>
                      <p className="text-[13px] text-gray-400 leading-[1.8] font-medium italic">"{selectedRelic.lore}"</p>
                    </div>
                  )}
                  
                  {selectedRelic.source && (
                    <div className="p-8 bg-white/5 border border-white/5 rounded-[3rem]">
                       <h4 className="text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest flex items-center gap-2"><MapPin size={16}/> Fragment Synthesis</h4>
                       <p className="text-[13px] font-bold text-orange-500">{selectedRelic.source}</p>
                    </div>
                  )}
                </div>

                <div className="p-10 bg-gray-950 border border-white/10 rounded-[3.5rem] shadow-2xl relative">
                  <h4 className="text-[11px] font-black text-purple-500 uppercase mb-8 tracking-[0.3em] flex items-center gap-3"><Sparkles size={20}/> Star Level Calibration</h4>
                  <div className="space-y-4">
                    {selectedRelic.stars?.map((star, idx) => (
                      <div key={idx} className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center gap-4 group hover:border-purple-500/30 transition-all">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500">
                           <Star size={16} fill={idx < 2 ? "currentColor" : "none"} />
                        </div>
                        <p className="text-[12px] font-black text-gray-200 uppercase italic tracking-tight">{star}</p>
                      </div>
                    ))}
                    {!selectedRelic.stars && <p className="text-center text-gray-600 italic py-12">Calibration data unavailable for this tier.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
