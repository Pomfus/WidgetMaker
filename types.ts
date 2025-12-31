export interface Member {
  name: string;
  tier: string;
  totalMonths: string;
  channelId: string;
  profileUrl?: string;
}

export interface SavedFavorite {
  id: string;
  name: string;
  timestamp: number;
  settings: TickerSettings;
  members: Member[];
}

export type SortOrder = 'alpha' | 'duration_desc' | 'duration_asc';

export type TickerTheme = 
  // Fighter Wing
  | 'tomcat' | 'raptor' | 'flanker' | 'afterburner' | 'dogfight' | 'mach1' | 'strike' | 'falcon' | 'harrier' | 'phantom' | 'mustang' | 'zero' | 'thunderbolt' | 'delta' | 'vigilante' | 'intruder'
  // Ground Control
  | 'radar' | 'tower' | 'terminal' | 'signal' | 'beacon' | 'relay' | 'uplink' | 'comms' | 'frequency' | 'static' | 'bandwidth' | 'latency'
  // Instrument Panel
  | 'hud' | 'altimeter' | 'transponder' | 'squawk' | 'blackbox' | 'glasscockpit' | 'analog' | 'digital' | 'gforce' | 'pitch' | 'yaw' | 'roll' | 'throttle' | 'flaps' | 'trim' | 'gyro'
  // Atmospherics
  | 'stratosphere' | 'aurora' | 'sunset' | 'nightflight' | 'clearskies' | 'stormcloud' | 'tailwind' | 'cirrus' | 'cumulus' | 'overcast' | 'gale' | 'zephyr' | 'monsoon' | 'tornado' | 'cyclone' | 'blizzard'
  // Deep Space
  | 'apollo' | 'voyager' | 'nebula' | 'eventhorizon' | 'supernova' | 'pulsar' | 'andromeda' | 'galactic' | 'cosmos' | 'orbit' | 'zenith' | 'nadir' | 'eclipse' | 'sol' | 'lunar' | 'martian'
  // Cyber Ops
  | 'neondrive' | 'cyberdeck' | 'datalink' | 'mainframe' | 'glitch' | 'neural' | 'singularity' | 'dyson' | 'proxy' | 'kernel' | 'root' | 'shell' | 'binary' | 'crypt' | 'cipher' | 'hack'
  // Retro Systems
  | 'vintage' | 'polaroid' | 'commodore' | 'crt' | 'blueprint' | 'steampunk' | 'paper' | 'typewriter' | 'vinyl' | 'cassette' | 'film' | 'grainy' | 'sepia' | 'monochrome' | 'amber' | 'phosphor'
  // Nature Elements
  | 'forest' | 'deepsea' | 'volcano' | 'arctic' | 'desert' | 'jungle' | 'moss' | 'coral' | 'magma' | 'frost' | 'dune' | 'canopy' | 'ridge' | 'tundra' | 'oasis' | 'reef'
  // Elite Luxury
  | 'firstclass' | 'platinum' | 'onyx' | 'goldleaf' | 'marble' | 'velvet' | 'silk' | 'cashmere' | 'diamond' | 'emerald' | 'sapphire' | 'ruby' | 'ivory' | 'quartz' | 'granite' | 'slate'
  // Aviation Service
  | 'concorde' | 'jetstream' | 'horizon' | 'kittyhawk' | 'spitfire' | 'propeller' | 'terminal_b';

export type HullShape = 'full' | 'chamfered' | 'console' | 'window' | 'window-glass' | 'window-minimal' | 'window-tactical' | 'full-bottom';

export interface TickerSettings {
  speed: number;
  fontSize: number;
  durationFontSize: number;
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  accentColor: string;
  durationColor: string;
  showAvatars: boolean;
  showTiers: boolean;
  showDuration: boolean;
  tierFilter: string[];
  theme: TickerTheme;
  hullShape: HullShape;
  gap: number;
  letterSpacing: number;
  lineHeight: number;
  widgetWidth: number;
  widgetHeight: number;
  verticalOffset: number;
  customMessage: string;
  customMessagePosition: 'start' | 'end' | 'none';
  sortOrder: SortOrder;
}

const aviationBase = { fontSize: 24, durationFontSize: 10, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, verticalOffset: 0, sortOrder: 'duration_desc' as SortOrder };

export const THEMES: Record<TickerTheme, Partial<TickerSettings>> = {
  tomcat: { ...aviationBase, textColor: '#e2e8f0', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#fde047', durationColor: '#cbd5e1', hullShape: 'chamfered' },
  raptor: { ...aviationBase, textColor: '#cbd5e1', backgroundColor: '#0f172a', backgroundOpacity: 0.9, accentColor: '#22d3ee', durationColor: '#94a3b8', hullShape: 'window-tactical' },
  flanker: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1d4ed8', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#bfdbfe', hullShape: 'window' },
  afterburner: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#f97316', durationColor: '#ef4444', hullShape: 'window-tactical', fontSize: 32 },
  dogfight: { ...aviationBase, textColor: '#000000', backgroundColor: '#fbbf24', backgroundOpacity: 1.0, accentColor: '#000000', durationColor: '#4b5563', hullShape: 'chamfered' },
  mach1: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#111827', backgroundOpacity: 1.0, accentColor: '#ef4444', durationColor: '#94a3b8', fontSize: 34, hullShape: 'window-tactical' },
  strike: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1a1a1a', backgroundOpacity: 1.0, accentColor: '#ffea00', durationColor: '#ffea00', hullShape: 'window-tactical' },
  falcon: { ...aviationBase, textColor: '#f8fafc', backgroundColor: '#475569', backgroundOpacity: 1.0, accentColor: '#38bdf8', durationColor: '#94a3b8', hullShape: 'window' },
  harrier: { ...aviationBase, textColor: '#ecfeff', backgroundColor: '#164e63', backgroundOpacity: 1.0, accentColor: '#22d3ee', durationColor: '#06b6d4', hullShape: 'chamfered' },
  phantom: { ...aviationBase, textColor: '#f1f5f9', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#a5f3fc', durationColor: '#94a3b8', hullShape: 'window-glass' },
  mustang: { ...aviationBase, textColor: '#fff7ed', backgroundColor: '#7c2d12', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#ea580c', hullShape: 'window' },
  zero: { ...aviationBase, textColor: '#fef2f2', backgroundColor: '#7f1d1d', backgroundOpacity: 1.0, accentColor: '#ffffff', durationColor: '#fca5a5', hullShape: 'window-minimal' },
  thunderbolt: { ...aviationBase, textColor: '#f0fdf4', backgroundColor: '#14532d', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#4ade80', hullShape: 'window-tactical' },
  delta: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e1b4b', backgroundOpacity: 1.0, accentColor: '#c084fc', durationColor: '#818cf8', hullShape: 'chamfered' },
  vigilante: { ...aviationBase, textColor: '#f8fafc', backgroundColor: '#0f172a', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#cbd5e1', hullShape: 'window-glass' },
  intruder: { ...aviationBase, textColor: '#f1f5f9', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#60a5fa', durationColor: '#94a3b8', hullShape: 'window' },
  radar: { ...aviationBase, textColor: '#33ff33', backgroundColor: '#000800', backgroundOpacity: 1.0, accentColor: '#33ff33', durationColor: '#00ff00', hullShape: 'console' },
  tower: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#475569', backgroundOpacity: 1.0, accentColor: '#ef4444', durationColor: '#f1f5f9', hullShape: 'window' },
  terminal: { ...aviationBase, textColor: '#10b981', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#059669', durationColor: '#064e3b', hullShape: 'console' },
  signal: { ...aviationBase, textColor: '#fbbf24', backgroundColor: '#1c1917', backgroundOpacity: 1.0, accentColor: '#f59e0b', durationColor: '#fbbf24', hullShape: 'window-tactical' },
  beacon: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#ef4444', backgroundOpacity: 1.0, accentColor: '#ffffff', durationColor: '#000000', hullShape: 'window' },
  relay: { ...aviationBase, textColor: '#ecfeff', backgroundColor: '#083344', backgroundOpacity: 1.0, accentColor: '#22d3ee', durationColor: '#22d3ee', hullShape: 'window-minimal' },
  uplink: { ...aviationBase, textColor: '#f0abfc', backgroundColor: '#4a044e', backgroundOpacity: 1.0, accentColor: '#fdf4ff', durationColor: '#e879f9', hullShape: 'window-glass' },
  comms: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e3a8a', backgroundOpacity: 1.0, accentColor: '#60a5fa', durationColor: '#93c5fd', hullShape: 'window' },
  frequency: { ...aviationBase, textColor: '#22c55e', backgroundColor: '#052e16', backgroundOpacity: 1.0, accentColor: '#4ade80', durationColor: '#14532d', hullShape: 'window-tactical' },
  static: { ...aviationBase, textColor: '#94a3b8', backgroundColor: '#0f172a', backgroundOpacity: 1.0, accentColor: '#cbd5e1', durationColor: '#475569', hullShape: 'window' },
  bandwidth: { ...aviationBase, textColor: '#facc15', backgroundColor: '#422006', backgroundOpacity: 1.0, accentColor: '#fde047', durationColor: '#a16207', hullShape: 'window-glass' },
  latency: { ...aviationBase, textColor: '#ef4444', backgroundColor: '#450a0a', backgroundOpacity: 1.0, accentColor: '#fca5a5', durationColor: '#b91c1c', hullShape: 'window-tactical' },
  hud: { ...aviationBase, textColor: '#00ffff', backgroundColor: '#001414', backgroundOpacity: 0.9, accentColor: '#00ffff', durationColor: '#ffffff', hullShape: 'window' },
  altimeter: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#262626', backgroundOpacity: 1.0, accentColor: '#dc2626', durationColor: '#a3a3a3', hullShape: 'console' },
  transponder: { ...aviationBase, textColor: '#fbbf24', backgroundColor: '#1c1917', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#78350f', hullShape: 'chamfered' },
  squawk: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#ef4444', backgroundOpacity: 1.0, accentColor: '#ffffff', durationColor: '#000000', hullShape: 'window-tactical' },
  blackbox: { ...aviationBase, textColor: '#000000', backgroundColor: '#ea580c', backgroundOpacity: 1.0, accentColor: '#ffffff', durationColor: '#000000', hullShape: 'full' },
  glasscockpit: { ...aviationBase, textColor: '#22c55e', backgroundColor: '#020617', backgroundOpacity: 0.9, accentColor: '#3b82f6', durationColor: '#ffffff', hullShape: 'window-glass' },
  analog: { ...aviationBase, textColor: '#e2e8f0', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#94a3b8', hullShape: 'window' },
  digital: { ...aviationBase, textColor: '#4ade80', backgroundColor: '#020617', backgroundOpacity: 1.0, accentColor: '#4ade80', durationColor: '#166534', hullShape: 'window-tactical' },
  gforce: { ...aviationBase, textColor: '#fcd34d', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#fbbf24', hullShape: 'window-minimal' },
  pitch: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#3b82f6', durationColor: '#94a3b8', hullShape: 'window' },
  yaw: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#10b981', durationColor: '#94a3b8', hullShape: 'window' },
  roll: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#94a3b8', hullShape: 'window' },
  throttle: { ...aviationBase, textColor: '#000000', backgroundColor: '#ffffff', backgroundOpacity: 1.0, accentColor: '#dc2626', durationColor: '#64748b', hullShape: 'window-tactical' },
  flaps: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#facc15', durationColor: '#94a3b8', hullShape: 'window' },
  trim: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#60a5fa', durationColor: '#475569', hullShape: 'window-minimal' },
  gyro: { ...aviationBase, textColor: '#38bdf8', backgroundColor: '#0c4a6e', backgroundOpacity: 1.0, accentColor: '#f0f9ff', durationColor: '#0ea5e9', hullShape: 'window-glass' },
  stratosphere: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e1b4b', backgroundOpacity: 1.0, accentColor: '#c084fc', durationColor: '#e9d5ff', hullShape: 'window-minimal' },
  aurora: { ...aviationBase, textColor: '#4ade80', backgroundColor: '#2e1065', backgroundOpacity: 0.8, accentColor: '#f472b6', durationColor: '#d8b4fe', hullShape: 'chamfered' },
  sunset: { ...aviationBase, textColor: '#fff7ed', backgroundColor: '#431407', backgroundOpacity: 1.0, accentColor: '#f59e0b', durationColor: '#fdba74', hullShape: 'window-minimal' },
  nightflight: { ...aviationBase, textColor: '#64748b', backgroundColor: '#020617', backgroundOpacity: 1.0, accentColor: '#0ea5e9', durationColor: '#1e293b', hullShape: 'console' },
  clearskies: { ...aviationBase, textColor: '#075985', backgroundColor: '#e0f2fe', backgroundOpacity: 1.0, accentColor: '#0ea5e9', durationColor: '#0369a1', hullShape: 'full' },
  stormcloud: { ...aviationBase, textColor: '#f8fafc', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#fcd34d', durationColor: '#94a3b8', hullShape: 'window-tactical' },
  tailwind: { ...aviationBase, textColor: '#fdf4ff', backgroundColor: '#701a75', backgroundOpacity: 1.0, accentColor: '#f5d0fe', durationColor: '#d946ef', hullShape: 'window-glass' },
  cirrus: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#bae6fd', backgroundOpacity: 1.0, accentColor: '#38bdf8', durationColor: '#0369a1', hullShape: 'window' },
  cumulus: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#ffffff', backgroundOpacity: 1.0, accentColor: '#0ea5e9', durationColor: '#64748b', hullShape: 'window-glass' },
  overcast: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#64748b', backgroundOpacity: 1.0, accentColor: '#cbd5e1', durationColor: '#334155', hullShape: 'window' },
  gale: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#ffffff', hullShape: 'window-tactical' },
  zephyr: { ...aviationBase, textColor: '#ecfeff', backgroundColor: '#155e75', backgroundOpacity: 1.0, accentColor: '#22d3ee', durationColor: '#22d3ee', hullShape: 'window-minimal' },
  monsoon: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e3a8a', backgroundOpacity: 1.0, accentColor: '#0ea5e9', durationColor: '#bfdbfe', hullShape: 'window' },
  tornado: { ...aviationBase, textColor: '#f1f5f9', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#64748b', durationColor: '#cbd5e1', hullShape: 'window-tactical' },
  cyclone: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#111827', backgroundOpacity: 1.0, accentColor: '#94a3b8', durationColor: '#4b5563', hullShape: 'window-glass' },
  blizzard: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#f1f5f9', backgroundOpacity: 1.0, accentColor: '#38bdf8', durationColor: '#64748b', hullShape: 'window' },
  apollo: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#0f172a', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#64748b', hullShape: 'window-tactical' },
  voyager: { ...aviationBase, textColor: '#ccfbf1', backgroundColor: '#134e4a', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#2dd4bf', hullShape: 'chamfered' },
  nebula: { ...aviationBase, textColor: '#fdf4ff', backgroundColor: '#4a044e', backgroundOpacity: 1.0, accentColor: '#d946ef', durationColor: '#f0abfc', hullShape: 'window-glass' },
  eventhorizon: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#f8fafc', durationColor: '#4b5563', hullShape: 'window-tactical' },
  supernova: { ...aviationBase, textColor: '#fff7ed', backgroundColor: '#7c2d12', backgroundOpacity: 1.0, accentColor: '#f59e0b', durationColor: '#ea580c', hullShape: 'window-minimal' },
  pulsar: { ...aviationBase, textColor: '#ecfeff', backgroundColor: '#083344', backgroundOpacity: 1.0, accentColor: '#22d3ee', durationColor: '#22d3ee', hullShape: 'window' },
  andromeda: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e1b4b', backgroundOpacity: 1.0, accentColor: '#818cf8', durationColor: '#c084fc', hullShape: 'window-glass' },
  galactic: { ...aviationBase, textColor: '#f0abfc', backgroundColor: '#2e1065', backgroundOpacity: 1.0, accentColor: '#c084fc', durationColor: '#d8b4fe', hullShape: 'window' },
  cosmos: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#020617', backgroundOpacity: 1.0, accentColor: '#f8fafc', durationColor: '#94a3b8', hullShape: 'window-minimal' },
  orbit: { ...aviationBase, textColor: '#38bdf8', backgroundColor: '#0c4a6e', backgroundOpacity: 1.0, accentColor: '#f0f9ff', durationColor: '#0ea5e9', hullShape: 'window' },
  zenith: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e1b4b', backgroundOpacity: 1.0, accentColor: '#f8fafc', durationColor: '#818cf8', hullShape: 'window-tactical' },
  nadir: { ...aviationBase, textColor: '#cbd5e1', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#475569', durationColor: '#475569', hullShape: 'window' },
  eclipse: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#f59e0b', durationColor: '#4b5563', hullShape: 'window-minimal' },
  sol: { ...aviationBase, textColor: '#000000', backgroundColor: '#fbbf24', backgroundOpacity: 1.0, accentColor: '#fffbeb', durationColor: '#b45309', hullShape: 'window' },
  lunar: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#f8fafc', backgroundOpacity: 1.0, accentColor: '#64748b', durationColor: '#64748b', hullShape: 'window-glass' },
  martian: { ...aviationBase, textColor: '#fef2f2', backgroundColor: '#7f1d1d', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#fca5a5', hullShape: 'window-tactical' },
  neondrive: { ...aviationBase, textColor: '#ff00ff', backgroundColor: '#1a001a', backgroundOpacity: 1.0, accentColor: '#00ffff', durationColor: '#ffffff', hullShape: 'window-glass' },
  cyberdeck: { ...aviationBase, textColor: '#00ff00', backgroundColor: '#001a00', backgroundOpacity: 1.0, accentColor: '#ff00ff', durationColor: '#00ff00', hullShape: 'window-tactical' },
  datalink: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000033', backgroundOpacity: 1.0, accentColor: '#00ffff', durationColor: '#9999ff', hullShape: 'window' },
  mainframe: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#111111', backgroundOpacity: 1.0, accentColor: '#00ff00', durationColor: '#ffffff', hullShape: 'console' },
  glitch: { ...aviationBase, textColor: '#00ffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#ff00ff', durationColor: '#ffffff', hullShape: 'window-tactical' },
  neural: { ...aviationBase, textColor: '#e879f9', backgroundColor: '#2e1065', backgroundOpacity: 1.0, accentColor: '#f5d0fe', durationColor: '#d8b4fe', hullShape: 'window-glass' },
  singularity: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#f8fafc', durationColor: '#ffffff', hullShape: 'window-minimal' },
  dyson: { ...aviationBase, textColor: '#fbbf24', backgroundColor: '#422006', backgroundOpacity: 1.0, accentColor: '#fef3c7', durationColor: '#fde047', hullShape: 'window' },
  proxy: { ...aviationBase, textColor: '#38bdf8', backgroundColor: '#082f49', backgroundOpacity: 1.0, accentColor: '#bae6fd', durationColor: '#0ea5e9', hullShape: 'window-tactical' },
  kernel: { ...aviationBase, textColor: '#10b981', backgroundColor: '#064e3b', backgroundOpacity: 1.0, accentColor: '#d1fae5', durationColor: '#059669', hullShape: 'window' },
  root: { ...aviationBase, textColor: '#ef4444', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#fca5a5', durationColor: '#ffffff', hullShape: 'window-tactical' },
  shell: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e293b', backgroundOpacity: 1.0, accentColor: '#f1f5f9', durationColor: '#94a3b8', hullShape: 'console' },
  binary: { ...aviationBase, textColor: '#00ff00', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#dcfce7', durationColor: '#003300', hullShape: 'window-minimal' },
  crypt: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#111827', backgroundOpacity: 1.0, accentColor: '#fcd34d', durationColor: '#4b5563', hullShape: 'window-glass' },
  cipher: { ...aviationBase, textColor: '#fbbf24', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#fff7ed', durationColor: '#ffffff', hullShape: 'window-tactical' },
  hack: { ...aviationBase, textColor: '#00ff00', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#f0fdf4', durationColor: '#00ff00', hullShape: 'window-tactical' },
  vintage: { ...aviationBase, textColor: '#e8d4b9', backgroundColor: '#3d2b1f', backgroundOpacity: 1.0, accentColor: '#ff8c00', durationColor: '#e8d4b9', hullShape: 'full' },
  polaroid: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#f8fafc', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#64748b', hullShape: 'window' },
  commodore: { ...aviationBase, textColor: '#93c5fd', backgroundColor: '#1e3a8a', backgroundOpacity: 1.0, accentColor: '#dbeafe', durationColor: '#60a5fa', hullShape: 'window' },
  crt: { ...aviationBase, textColor: '#4ade80', backgroundColor: '#020617', backgroundOpacity: 1.0, accentColor: '#86efac', durationColor: '#14532d', hullShape: 'window-tactical' },
  blueprint: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e40af', backgroundOpacity: 1.0, accentColor: '#bfdbfe', durationColor: '#93c5fd', hullShape: 'window' },
  steampunk: { ...aviationBase, textColor: '#fbbf24', backgroundColor: '#422006', backgroundOpacity: 1.0, accentColor: '#d97706', durationColor: '#fbbf24', hullShape: 'chamfered' },
  paper: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#fff7ed', backgroundOpacity: 1.0, accentColor: '#f97316', durationColor: '#64748b', hullShape: 'window' },
  typewriter: { ...aviationBase, textColor: '#000000', backgroundColor: '#ffffff', backgroundOpacity: 1.0, accentColor: '#4b5563', durationColor: '#64748b', hullShape: 'window-minimal' },
  vinyl: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#111827', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#4b5563', hullShape: 'window-glass' },
  cassette: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#ea580c', backgroundOpacity: 1.0, accentColor: '#fed7aa', durationColor: '#000000', hullShape: 'window' },
  film: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#e5e7eb', durationColor: '#4b5563', hullShape: 'window-glass' },
  grainy: { ...aviationBase, textColor: '#d1d5db', backgroundColor: '#374151', backgroundOpacity: 1.0, accentColor: '#f3f4f6', durationColor: '#6b7280', hullShape: 'window' },
  sepia: { ...aviationBase, textColor: '#431407', backgroundColor: '#fde68a', backgroundOpacity: 1.0, accentColor: '#b45309', durationColor: '#78350f', hullShape: 'window' },
  monochrome: { ...aviationBase, textColor: '#000000', backgroundColor: '#ffffff', backgroundOpacity: 1.0, accentColor: '#1f2937', durationColor: '#94a3b8', hullShape: 'window-tactical' },
  amber: { ...aviationBase, textColor: '#f59e0b', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#78350f', hullShape: 'window-tactical' },
  phosphor: { ...aviationBase, textColor: '#22c55e', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#4ade80', durationColor: '#14532d', hullShape: 'window-tactical' },
  forest: { ...aviationBase, textColor: '#f0fdf4', backgroundColor: '#064e3b', backgroundOpacity: 1.0, accentColor: '#86efac', durationColor: '#065f46', hullShape: 'window' },
  deepsea: { ...aviationBase, textColor: '#ecfeff', backgroundColor: '#083344', backgroundOpacity: 1.0, accentColor: '#67e8f9', durationColor: '#0e7490', hullShape: 'window-glass' },
  volcano: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#450a0a', backgroundOpacity: 1.0, accentColor: '#f87171', durationColor: '#dc2626', hullShape: 'window-tactical' },
  arctic: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#f1f5f9', backgroundOpacity: 1.0, accentColor: '#7dd3fc', durationColor: '#94a3b8', hullShape: 'window-glass' },
  desert: { ...aviationBase, textColor: '#422006', backgroundColor: '#fef3c7', backgroundOpacity: 1.0, accentColor: '#f59e0b', durationColor: '#92400e', hullShape: 'window' },
  jungle: { ...aviationBase, textColor: '#f0fdf4', backgroundColor: '#14532d', backgroundOpacity: 1.0, accentColor: '#fcd34d', durationColor: '#166534', hullShape: 'window' },
  moss: { ...aviationBase, textColor: '#dcfce7', backgroundColor: '#166534', backgroundOpacity: 1.0, accentColor: '#4ade80', durationColor: '#14532d', hullShape: 'window-minimal' },
  coral: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#f43f5e', backgroundOpacity: 1.0, accentColor: '#ffe4e6', durationColor: '#9f1239', hullShape: 'window' },
  magma: { ...aviationBase, textColor: '#fbbf24', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#f43f5e', durationColor: '#f59e0b', hullShape: 'window-tactical' },
  frost: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#bae6fd', backgroundOpacity: 1.0, accentColor: '#f0f9ff', durationColor: '#0ea5e9', hullShape: 'window-glass' },
  dune: { ...aviationBase, textColor: '#92400e', backgroundColor: '#fde68a', backgroundOpacity: 1.0, accentColor: '#f59e0b', durationColor: '#78350f', hullShape: 'window' },
  canopy: { ...aviationBase, textColor: '#f0fdf4', backgroundColor: '#064e3b', backgroundOpacity: 1.0, accentColor: '#4ade80', durationColor: '#14532d', hullShape: 'window-glass' },
  ridge: { ...aviationBase, textColor: '#f8fafc', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#cbd5e1', durationColor: '#cbd5e1', hullShape: 'chamfered' },
  tundra: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#cbd5e1', backgroundOpacity: 1.0, accentColor: '#3b82f6', durationColor: '#64748b', hullShape: 'window' },
  oasis: { ...aviationBase, textColor: '#ecfeff', backgroundColor: '#0e7490', backgroundOpacity: 1.0, accentColor: '#fcd34d', durationColor: '#22d3ee', hullShape: 'window-glass' },
  reef: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#0891b2', backgroundOpacity: 1.0, accentColor: '#cffafe', durationColor: '#155e75', hullShape: 'window' },
  firstclass: { ...aviationBase, textColor: '#78350f', backgroundColor: '#fffbeb', backgroundOpacity: 1.0, accentColor: '#fde047', durationColor: '#92400e', hullShape: 'chamfered' },
  platinum: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#f1f5f9', backgroundOpacity: 1.0, accentColor: '#cbd5e1', durationColor: '#64748b', hullShape: 'window-glass' },
  onyx: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#e5e7eb', durationColor: '#4b5563', hullShape: 'window-tactical' },
  goldleaf: { ...aviationBase, textColor: '#000000', backgroundColor: '#fbbf24', backgroundOpacity: 1.0, accentColor: '#fffbeb', durationColor: '#b45309', hullShape: 'window' },
  marble: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#ffffff', backgroundOpacity: 1.0, accentColor: '#e5e7eb', durationColor: '#64748b', hullShape: 'window-glass' },
  velvet: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#45062e', backgroundOpacity: 1.0, accentColor: '#f0abfc', durationColor: '#701a75', hullShape: 'window' },
  silk: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#f5d0fe', backgroundOpacity: 1.0, accentColor: '#a21caf', durationColor: '#a21caf', hullShape: 'window-glass' },
  cashmere: { ...aviationBase, textColor: '#422006', backgroundColor: '#fef3c7', backgroundOpacity: 1.0, accentColor: '#d97706', durationColor: '#b45309', hullShape: 'window' },
  diamond: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#f0f9ff', backgroundOpacity: 1.0, accentColor: '#7dd3fc', durationColor: '#0ea5e9', hullShape: 'window-glass' },
  emerald: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#064e3b', backgroundOpacity: 1.0, accentColor: '#34d399', durationColor: '#065f46', hullShape: 'window' },
  sapphire: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1e3a8a', backgroundOpacity: 1.0, accentColor: '#60a5fa', durationColor: '#1e40af', hullShape: 'window' },
  ruby: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#7f1d1d', backgroundOpacity: 1.0, accentColor: '#f87171', durationColor: '#b91c1c', hullShape: 'window-tactical' },
  ivory: { ...aviationBase, textColor: '#1e293b', backgroundColor: '#fdfcf0', backgroundOpacity: 1.0, accentColor: '#e5e7eb', durationColor: '#64748b', hullShape: 'window' },
  quartz: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#fdf4ff', backgroundOpacity: 1.0, accentColor: '#f5d0fe', durationColor: '#a21caf', hullShape: 'window-glass' },
  granite: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#1f2937', backgroundOpacity: 1.0, accentColor: '#9ca3af', durationColor: '#4b5563', hullShape: 'window-tactical' },
  slate: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#94a3b8', durationColor: '#475569', hullShape: 'window' },
  concorde: { ...aviationBase, textColor: '#1e3a8a', backgroundColor: '#ffffff', backgroundOpacity: 1.0, accentColor: '#f87171', durationColor: '#1e40af', hullShape: 'window' },
  jetstream: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#0ea5e9', backgroundOpacity: 1.0, accentColor: '#bae6fd', durationColor: '#bae6fd', hullShape: 'full' },
  horizon: { ...aviationBase, textColor: '#fdf5e6', backgroundColor: '#001a33', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#ffffff', hullShape: 'window-minimal' },
  kittyhawk: { ...aviationBase, textColor: '#451a03', backgroundColor: '#fef3c7', backgroundOpacity: 1.0, accentColor: '#b45309', durationColor: '#78350f', hullShape: 'window' },
  spitfire: { ...aviationBase, textColor: '#f0fdf4', backgroundColor: '#064e3b', backgroundOpacity: 1.0, accentColor: '#b45309', durationColor: '#065f46', hullShape: 'window-tactical' },
  propeller: { ...aviationBase, textColor: '#e2e8f0', backgroundColor: '#475569', backgroundOpacity: 1.0, accentColor: '#cbd5e1', durationColor: '#f8fafc', hullShape: 'full' },
  terminal_b: { ...aviationBase, textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#e5e7eb', durationColor: '#4b5563', hullShape: 'console' },
};