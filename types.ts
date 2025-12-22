
export interface Member {
  name: string;
  tier: string;
  totalMonths: string;
  channelId: string;
  profileUrl?: string;
}

export type TickerTheme = 
  | 'hud' | 'strike' | 'horizon' | 'radar' | 'vintage' 
  | 'tomcat' | 'raptor' | 'flanker' | 'afterburner' | 'dogfight'
  | 'altimeter' | 'transponder' | 'squawk' | 'blackbox' | 'glasscockpit'
  | 'stratosphere' | 'aurora' | 'sunset' | 'nightflight' | 'clearskies'
  | 'kittyhawk' | 'spitfire' | 'apollo' | 'voyager' | 'propeller'
  | 'concorde' | 'firstclass' | 'terminal' | 'jetstream' | 'mach1';

export type HullShape = 'full' | 'chamfered' | 'stealth' | 'wing-root' | 'hud-bracket' | 'console';

export interface TickerSettings {
  speed: number;
  fontSize: number;
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
}

export const THEMES: Record<TickerTheme, Partial<TickerSettings>> = {
  hud: { textColor: '#00ffff', backgroundColor: '#001414', backgroundOpacity: 0.9, accentColor: '#00ffff', durationColor: '#ffffff', fontSize: 24, letterSpacing: 2, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, hullShape: 'hud-bracket' },
  strike: { textColor: '#ffffff', backgroundColor: '#1a1a1a', backgroundOpacity: 1.0, accentColor: '#ffea00', durationColor: '#ffea00', fontSize: 28, letterSpacing: 1, lineHeight: 0.9, widgetWidth: 100, widgetHeight: 120, hullShape: 'stealth' },
  horizon: { textColor: '#fdf5e6', backgroundColor: '#001a33', backgroundOpacity: 1.0, accentColor: '#d4af37', durationColor: '#ffffff', fontSize: 22, letterSpacing: 1, lineHeight: 1.1, widgetWidth: 100, widgetHeight: 90, hullShape: 'wing-root' },
  radar: { textColor: '#33ff33', backgroundColor: '#000800', backgroundOpacity: 1.0, accentColor: '#33ff33', durationColor: '#00ff00', fontSize: 22, letterSpacing: 0, lineHeight: 1, widgetWidth: 100, widgetHeight: 80, hullShape: 'console' },
  vintage: { textColor: '#e8d4b9', backgroundColor: '#3d2b1f', backgroundOpacity: 1.0, accentColor: '#ff8c00', durationColor: '#e8d4b9', fontSize: 26, letterSpacing: 0, lineHeight: 1, widgetWidth: 100, widgetHeight: 110, hullShape: 'full' },
  tomcat: { textColor: '#e2e8f0', backgroundColor: '#334155', backgroundOpacity: 1.0, accentColor: '#fde047', durationColor: '#cbd5e1', fontSize: 26, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, hullShape: 'chamfered' },
  raptor: { textColor: '#cbd5e1', backgroundColor: '#0f172a', backgroundOpacity: 0.9, accentColor: '#22d3ee', durationColor: '#94a3b8', fontSize: 24, letterSpacing: 4, lineHeight: 0.8, widgetWidth: 100, widgetHeight: 90, hullShape: 'stealth' },
  flanker: { textColor: '#ffffff', backgroundColor: '#1d4ed8', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#bfdbfe', fontSize: 25, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, hullShape: 'wing-root' },
  afterburner: { textColor: '#ffffff', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#f97316', durationColor: '#ef4444', fontSize: 32, letterSpacing: 1, lineHeight: 0.9, widgetWidth: 100, widgetHeight: 130, hullShape: 'stealth' },
  dogfight: { textColor: '#000000', backgroundColor: '#fbbf24', backgroundOpacity: 1.0, accentColor: '#000000', durationColor: '#4b5563', fontSize: 28, letterSpacing: -1, lineHeight: 0.8, widgetWidth: 100, widgetHeight: 120, hullShape: 'chamfered' },
  altimeter: { textColor: '#ffffff', backgroundColor: '#262626', backgroundOpacity: 1.0, accentColor: '#dc2626', durationColor: '#a3a3a3', fontSize: 24, letterSpacing: 0, lineHeight: 1, widgetWidth: 100, widgetHeight: 80, hullShape: 'console' },
  transponder: { textColor: '#fbbf24', backgroundColor: '#1c1917', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#78350f', fontSize: 22, letterSpacing: 4, lineHeight: 1.2, widgetWidth: 100, widgetHeight: 90, hullShape: 'chamfered' },
  squawk: { textColor: '#ffffff', backgroundColor: '#ef4444', backgroundOpacity: 1.0, accentColor: '#ffffff', durationColor: '#000000', fontSize: 26, letterSpacing: 2, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, hullShape: 'stealth' },
  blackbox: { textColor: '#000000', backgroundColor: '#ea580c', backgroundOpacity: 1.0, accentColor: '#ffffff', durationColor: '#000000', fontSize: 24, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 90, hullShape: 'full' },
  glasscockpit: { textColor: '#22c55e', backgroundColor: '#020617', backgroundOpacity: 0.9, accentColor: '#3b82f6', durationColor: '#ffffff', fontSize: 22, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 80, hullShape: 'hud-bracket' },
  stratosphere: { textColor: '#ffffff', backgroundColor: '#1e1b4b', backgroundOpacity: 1.0, accentColor: '#c084fc', durationColor: '#e9d5ff', fontSize: 24, letterSpacing: 2, lineHeight: 1.1, widgetWidth: 100, widgetHeight: 100, hullShape: 'wing-root' },
  aurora: { textColor: '#4ade80', backgroundColor: '#2e1065', backgroundOpacity: 0.8, accentColor: '#f472b6', durationColor: '#d8b4fe', fontSize: 23, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 90, hullShape: 'chamfered' },
  sunset: { textColor: '#fff7ed', backgroundColor: '#431407', backgroundOpacity: 1.0, accentColor: '#f59e0b', durationColor: '#fdba74', fontSize: 25, letterSpacing: 1, lineHeight: 1.1, widgetWidth: 100, widgetHeight: 100, hullShape: 'wing-root' },
  nightflight: { textColor: '#64748b', backgroundColor: '#020617', backgroundOpacity: 1.0, accentColor: '#0ea5e9', durationColor: '#1e293b', fontSize: 22, letterSpacing: 2, lineHeight: 1, widgetWidth: 100, widgetHeight: 80, hullShape: 'console' },
  clearskies: { textColor: '#075985', backgroundColor: '#e0f2fe', backgroundOpacity: 1.0, accentColor: '#0ea5e9', durationColor: '#0369a1', fontSize: 24, letterSpacing: 0, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, hullShape: 'full' },
  kittyhawk: { textColor: '#451a03', backgroundColor: '#fef3c7', backgroundOpacity: 1.0, accentColor: '#92400e', durationColor: '#78350f', fontSize: 26, letterSpacing: 1, lineHeight: 1.2, widgetWidth: 100, widgetHeight: 110, hullShape: 'wing-root' },
  spitfire: { textColor: '#f0fdf4', backgroundColor: '#064e3b', backgroundOpacity: 1.0, accentColor: '#92400e', durationColor: '#065f46', fontSize: 25, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, hullShape: 'stealth' },
  apollo: { textColor: '#ffffff', backgroundColor: '#0f172a', backgroundOpacity: 1.0, accentColor: '#ef4444', durationColor: '#64748b', fontSize: 24, letterSpacing: 6, lineHeight: 0.9, widgetWidth: 100, widgetHeight: 90, hullShape: 'stealth' },
  voyager: { textColor: '#ccfbf1', backgroundColor: '#134e4a', backgroundOpacity: 1.0, accentColor: '#fbbf24', durationColor: '#2dd4bf', fontSize: 23, letterSpacing: 2, lineHeight: 1, widgetWidth: 100, widgetHeight: 90, hullShape: 'chamfered' },
  propeller: { textColor: '#e2e8f0', backgroundColor: '#475569', backgroundOpacity: 1.0, accentColor: '#94a3b8', durationColor: '#f8fafc', fontSize: 27, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 110, hullShape: 'full' },
  concorde: { textColor: '#1e3a8a', backgroundColor: '#ffffff', backgroundOpacity: 1.0, accentColor: '#dc2626', durationColor: '#1e40af', fontSize: 22, letterSpacing: 5, lineHeight: 1, widgetWidth: 100, widgetHeight: 80, hullShape: 'wing-root' },
  firstclass: { textColor: '#78350f', backgroundColor: '#fffbeb', backgroundOpacity: 1.0, accentColor: '#d4af37', durationColor: '#92400e', fontSize: 23, letterSpacing: 2, lineHeight: 1.1, widgetWidth: 100, widgetHeight: 100, hullShape: 'chamfered' },
  terminal: { textColor: '#10b981', backgroundColor: '#000000', backgroundOpacity: 1.0, accentColor: '#059669', durationColor: '#064e3b', fontSize: 20, letterSpacing: 1, lineHeight: 1.2, widgetWidth: 100, widgetHeight: 80, hullShape: 'console' },
  jetstream: { textColor: '#ffffff', backgroundColor: '#0ea5e9', backgroundOpacity: 1.0, accentColor: '#ffffff', durationColor: '#bae6fd', fontSize: 24, letterSpacing: 1, lineHeight: 1, widgetWidth: 100, widgetHeight: 100, hullShape: 'full' },
  mach1: { textColor: '#ffffff', backgroundColor: '#111827', backgroundOpacity: 1.0, accentColor: '#ef4444', durationColor: '#94a3b8', fontSize: 34, letterSpacing: -2, lineHeight: 0.7, widgetWidth: 100, widgetHeight: 140, hullShape: 'stealth' }
};
