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
  ChevronUp, ArrowDownWideNarrow, Check, Atom, RotateCcw, Scale, Milestone, Code
} from 'lucide-react';
import { 
  HERO_DATA, GEAR_DATA, JEWEL_DATA, RELIC_DATA, SET_BONUS_DESCRIPTIONS, FARMING_ROUTES, DRAGON_DATA, FarmingRoute, REFINE_TIPS
} from './constants';
import { chatWithAI } from './services/geminiService';
import { Hero, Tier, GearCategory, ChatMessage, CalcStats, BaseItem, Jewel, Relic, GearSet, LogEntry } from './types';
import { Badge, Card } from './components/UI';

// --- AUDIO HELPERS ---
const playCritSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Sound Profile: High-pitched "Crit" Ping
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High A
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15); // Fast drop

    gain.gain.setValueAtTime(0.1, ctx.currentTime); // Volume
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); // Fade out

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error("Audio error", e);
  }
};

// --- WEAPON PHYSICS DATA ---
const WEAPON_SPEEDS: Record<string, { name: string; speed: number; label: string }> = {
  'Fist': { name: 'Expedition Fist', speed: 3.5, label: 'FAST (3.5x)' },
  'Scythe': { name: 'Death Scythe', speed: 1.2, label: 'HEAVY (1.2x)' },
  'Blade': { name: 'Demon Blade', speed: 2.0, label: 'NORMAL (2.0x)' },
  'Saw': { name: 'Saw Blade', speed: 4.5, label: 'EXTREME (4.5x)' },
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
        className="w