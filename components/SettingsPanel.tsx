import React, { useState } from 'react';
import { TickerSettings, TickerTheme, THEMES, Member, HullShape, SavedFavorite, SortOrder } from '../types.ts';

interface SettingsPanelProps {
  settings: TickerSettings;
  setSettings: React.Dispatch<React.SetStateAction<TickerSettings>>;
  tiers: string[];
  insight: string;
  onExport: () => void;
  hasMembers: boolean;
  favorites: SavedFavorite[];
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
  onLoad: (id: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  setSettings, 
  tiers,
  insight,
  onExport,
  hasMembers,
  favorites,
  onSave,
  onDelete,
  onLoad
}) => {
  const [saveName, setSaveName] = useState('');

  const updateSetting = <K extends keyof TickerSettings>(key: K, value: TickerSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleTier = (tier: string) => {
    const current = settings.tierFilter;
    if (current.includes(tier)) {
      updateSetting('tierFilter', current.filter(t => t !== tier));
    } else {
      updateSetting('tierFilter', [...current, tier]);
    }
  };

  const handleSave = () => {
    onSave(saveName);
    setSaveName('');
  };

  const themeCategories: Record<string, TickerTheme[]> = {
    'Sector: Tactical Wing': ['tomcat', 'raptor', 'flanker', 'afterburner', 'dogfight', 'mach1', 'strike', 'falcon', 'harrier', 'phantom', 'mustang', 'zero', 'thunderbolt', 'delta', 'vigilante', 'intruder'],
    'Sector: Control Tower': ['radar', 'tower', 'terminal', 'signal', 'beacon', 'relay', 'uplink', 'comms', 'frequency', 'static', 'bandwidth', 'latency'],
    'Sector: Glass Cockpit': ['hud', 'altimeter', 'transponder', 'squawk', 'blackbox', 'glasscockpit', 'analog', 'digital', 'gforce', 'pitch', 'yaw', 'roll', 'throttle', 'flaps', 'trim', 'gyro'],
    'Sector: Atmospherics': ['stratosphere', 'aurora', 'sunset', 'nightflight', 'clearskies', 'stormcloud', 'tailwind', 'cirrus', 'cumulus', 'overcast', 'gale', 'zephyr', 'monsoon', 'tornado', 'cyclone', 'blizzard'],
    'Sector: Deep Space': ['apollo', 'voyager', 'nebula', 'eventhorizon', 'supernova', 'pulsar', 'andromeda', 'galactic', 'cosmos', 'orbit', 'zenith', 'nadir', 'eclipse', 'sol', 'lunar', 'martian'],
    'Sector: Cyber Ops': ['neondrive', 'cyberdeck', 'datalink', 'mainframe', 'glitch', 'neural', 'singularity', 'dyson', 'proxy', 'kernel', 'root', 'shell', 'binary', 'crypt', 'cipher', 'hack'],
    'Sector: Retro Relay': ['vintage', 'polaroid', 'commodore', 'crt', 'blueprint', 'steampunk', 'paper', 'typewriter', 'vinyl', 'cassette', 'film', 'grainy', 'sepia', 'monochrome', 'amber', 'phosphor'],
    'Sector: Elements': ['forest', 'deepsea', 'volcano', 'arctic', 'desert', 'jungle', 'moss', 'coral', 'magma', 'frost', 'dune', 'canopy', 'ridge', 'tundra', 'oasis', 'reef'],
    'Sector: Luxury Fleet': ['firstclass', 'platinum', 'onyx', 'goldleaf', 'marble', 'velvet', 'silk', 'cashmere', 'diamond', 'emerald', 'sapphire', 'ruby', 'ivory', 'quartz', 'granite', 'slate'],
    'Sector: Aviation Heritage': ['concorde', 'jetstream', 'horizon', 'kittyhawk', 'spitfire', 'propeller', 'terminal_b']
  };

  const hullShapes: { id: HullShape; label: string }[] = [
    { id: 'full', label: 'Classic Bar' },
    { id: 'full-bottom', label: 'Full Bottom' },
    { id: 'window', label: 'Standard HUD' },
    { id: 'window-glass', label: 'Glass HUD' },
    { id: 'window-minimal', label: 'Minimal HUD' },
    { id: 'window-tactical', label: 'Tactical HUD' },
    { id: 'chamfered', label: 'Chamfered' },
    { id: 'console', label: 'Console' }
  ];

  const sortOptions: { id: SortOrder; label: string }[] = [
    { id: 'duration_desc', label: 'Longest Member' },
    { id: 'duration_asc', label: 'Newest Member' },
    { id: 'alpha', label: 'A-Z Alphabetical' }
  ];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full overflow-y-auto max-h-[85vh] custom-scrollbar">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2 tracking-tighter italic">
        <span className="text-cyan-500">CONTROL</span> TOWER
      </h2>

      {insight && (
        <div className="mb-6 p-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg text-xs italic text-cyan-200 font-mono">
          " {insight} "
        </div>
      )}

      <div className="space-y-8">
        {/* Tactical Archive Section */}
        <section className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 shadow-inner">
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-cyan-400">Tactical Archive</label>
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Loadout Name..." 
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-medium focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
            />
            <button 
              onClick={handleSave}
              className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all active:scale-95"
            >
              Archive
            </button>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
            {favorites.length === 0 && (
              <p className="text-[10px] text-slate-500 italic text-center py-2">Hangar is empty.</p>
            )}
            {favorites.map(fav => (
              <div key={fav.id} className="bg-slate-900 p-3 rounded border border-slate-800 flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-200 truncate max-w-[120px]">{fav.name.toUpperCase()}</span>
                  <span className="text-[8px] text-slate-500">{new Date(fav.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onLoad(fav.id)}
                    className="text-[9px] font-black text-cyan-500 hover:text-cyan-400 uppercase"
                  >
                    Load
                  </button>
                  <button 
                    onClick={() => onDelete(fav.id)}
                    className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase"
                  >
                    Scrap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sorting Sector */}
        <section>
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-cyan-500">Sorting Protocol</label>
          <div className="grid grid-cols-1 gap-2">
            {sortOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => updateSetting('sortOrder', opt.id)}
                className={`px-3 py-2 rounded text-[9px] font-black transition-all border text-left ${
                  settings.sortOrder === opt.id 
                    ? 'bg-cyan-500 text-black border-cyan-300' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                {opt.label.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Custom Message Section */}
        <section className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 shadow-inner">
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-cyan-400">Broadcast Message</label>
          <textarea
            value={settings.customMessage}
            onChange={(e) => updateSetting('customMessage', e.target.value)}
            placeholder="Type your custom announcement here..."
            className="w-full h-20 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-medium focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 resize-none"
          />
          <div className="grid grid-cols-3 gap-2 mt-3">
            {(['none', 'start', 'end'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => updateSetting('customMessagePosition', pos)}
                className={`px-2 py-2 rounded text-[9px] font-black transition-all border ${
                  settings.customMessagePosition === pos 
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                {pos.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Theme Selector */}
        <section>
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-slate-500">Aesthetic Presets (100+)</label>
          <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(themeCategories).map(([cat, themes]) => (
              <div key={cat} className="border-b border-slate-800 pb-4">
                <h4 className="text-[10px] text-cyan-500/70 mb-2 font-black uppercase tracking-widest">{cat}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map(t => (
                    <button
                      key={t}
                      onClick={() => setSettings(prev => ({ ...prev, ...THEMES[t], theme: t }))}
                      className={`px-3 py-2 rounded text-[9px] font-black transition-all border text-left truncate ${
                        settings.theme === t 
                          ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hull Shape Selector */}
        <section>
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-cyan-500">Hull Geometry</label>
          <div className="grid grid-cols-2 gap-2">
            {hullShapes.map(s => (
              <button
                key={s.id}
                onClick={() => updateSetting('hullShape', s.id)}
                className={`px-2 py-2 rounded text-[9px] font-black transition-all border ${
                  settings.hullShape === s.id 
                    ? 'bg-white text-black border-white' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                {s.label.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Tier Filter Section */}
        {tiers.length > 0 && (
          <section>
            <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-slate-500">Tier Members</label>
            <div className="flex flex-wrap gap-2">
              {tiers.map(tier => (
                <button
                  key={tier}
                  onClick={() => toggleTier(tier)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all border ${
                    settings.tierFilter.includes(tier) 
                      ? 'bg-green-600 text-white border-green-400' 
                      : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {tier.toUpperCase()}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Visibility Toggles */}
        <section className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
           <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-slate-500">Visibility</label>
           <div className="flex flex-wrap gap-4">
            <Toggle label="Avatars" checked={settings.showAvatars} onChange={(v: boolean) => updateSetting('showAvatars', v)} />
            <Toggle label="Tiers" checked={settings.showTiers} onChange={(v: boolean) => updateSetting('showTiers', v)} />
            <Toggle label="Duration" checked={settings.showDuration} onChange={(v: boolean) => updateSetting('showDuration', v)} />
          </div>
        </section>

        {/* Dimensions Sliders */}
        <section className="space-y-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-cyan-500">Hull Dimensions</label>
          <Slider label="Widget Width" min={10} max={100} value={settings.widgetWidth} onChange={(v: number) => updateSetting('widgetWidth', v)} unit="%" />
          <Slider label="Overall Height" min={40} max={400} value={settings.widgetHeight} onChange={(v: number) => updateSetting('widgetHeight', v)} unit="px" />
          <Slider label="Vertical Alignment" min={-100} max={100} value={settings.verticalOffset} onChange={(v: number) => updateSetting('verticalOffset', v)} unit="px" />
        </section>

        {/* Sliders */}
        <section className="space-y-6">
          <Slider label="Ground Speed" min={5} max={300} value={settings.speed} onChange={(v: number) => updateSetting('speed', v)} unit="s" />
          <Slider label="Primary Font Scale" min={12} max={100} value={settings.fontSize} onChange={(v: number) => updateSetting('fontSize', v)} unit="px" />
          <Slider label="Duration Font Scale" min={6} max={50} value={settings.durationFontSize} onChange={(v: number) => updateSetting('durationFontSize', v)} unit="px" />
          <Slider label="Hull Opacity" min={0} max={100} value={settings.backgroundOpacity * 100} onChange={(v: number) => updateSetting('backgroundOpacity', v / 100)} unit="%" />
          <Slider label="Kerning (Letter Space)" min={-10} max={40} value={settings.letterSpacing} onChange={(v: number) => updateSetting('letterSpacing', v)} unit="px" />
          <Slider label="Pod Compression" min={0.5} max={2.0} value={settings.lineHeight} onChange={(v: number) => updateSetting('lineHeight', v)} step={0.1} />
          <Slider label="Flight Gap" min={0} max={500} value={settings.gap} onChange={(v: number) => updateSetting('gap', v)} unit="px" />
        </section>

        {/* Colors */}
        <section>
           <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-slate-500">Exterior Finish</label>
           <div className="grid grid-cols-2 gap-4">
            <ColorInput label="Primary Hull" value={settings.textColor} onChange={(v: string) => updateSetting('textColor', v)} />
            <ColorInput label="Landing Lights" value={settings.accentColor} onChange={(v: string) => updateSetting('accentColor', v)} />
            <ColorInput label="Beacon" value={settings.durationColor} onChange={(v: string) => updateSetting('durationColor', v)} />
            <ColorInput label="Base Plate" value={settings.backgroundColor} onChange={(v: string) => updateSetting('backgroundColor', v)} />
          </div>
        </section>

        {/* Export Button */}
        {hasMembers && (
          <button
            onClick={onExport}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl uppercase tracking-tighter italic"
          >
            Deploy Widget Package (.html)
          </button>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const Toggle = ({ label, checked, onChange }: any) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={e => onChange(e.target.checked)}
      className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-600 focus:ring-offset-slate-900"
    />
    <span className="text-[10px] font-black group-hover:text-cyan-400 transition-colors uppercase select-none">{label}</span>
  </label>
);

const Slider = ({ label, min, max, value, onChange, unit = "", step = 1 }: any) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-widest text-slate-400">
      <label>{label}</label>
      <span className="tabular-nums">{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-colors"
    />
  </div>
);

const ColorInput = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-[9px] mb-1 uppercase font-bold text-slate-500 tracking-wider">{label}</label>
    <div className="relative group">
      <input 
        type="color" 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-10 bg-slate-800 rounded cursor-pointer border border-slate-700 hover:border-slate-500 transition-colors outline-none p-1"
      />
    </div>
  </div>
);