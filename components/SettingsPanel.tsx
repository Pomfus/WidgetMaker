
import React from 'react';
import { TickerSettings, TickerTheme, THEMES, Member, HullShape } from '../types.ts';

interface SettingsPanelProps {
  settings: TickerSettings;
  setSettings: React.Dispatch<React.SetStateAction<TickerSettings>>;
  tiers: string[];
  insight: string;
  onExport: () => void;
  hasMembers: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  setSettings, 
  tiers,
  insight,
  onExport,
  hasMembers
}) => {
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

  const themeCategories: Record<string, TickerTheme[]> = {
    'Squadron Alpha': ['hud', 'strike', 'horizon', 'radar', 'vintage'],
    'Combat Wing': ['tomcat', 'raptor', 'flanker', 'afterburner', 'dogfight'],
    'Instrument Panel': ['altimeter', 'transponder', 'squawk', 'blackbox', 'glasscockpit'],
    'Sky & Space': ['stratosphere', 'aurora', 'sunset', 'nightflight', 'clearskies'],
    'Heritage Fleet': ['kittyhawk', 'spitfire', 'apollo', 'voyager', 'propeller'],
    'Aviation Service': ['concorde', 'firstclass', 'terminal', 'jetstream', 'mach1']
  };

  const hullShapes: { id: HullShape; label: string }[] = [
    { id: 'full', label: 'Full Span' },
    { id: 'chamfered', label: 'Chamfered' },
    { id: 'stealth', label: 'Stealth Facet' },
    { id: 'wing-root', label: 'Wing Root' },
    { id: 'hud-bracket', label: 'HUD Bracket' },
    { id: 'console', label: 'Console Base' }
  ];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full overflow-y-auto max-h-[85vh]">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2 tracking-tighter italic">
        <span className="text-cyan-500">CONTROL</span> TOWER
      </h2>

      {insight && (
        <div className="mb-6 p-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg text-xs italic text-cyan-200 font-mono">
          " {insight} "
        </div>
      )}

      <div className="space-y-8">
        {/* Theme Selector */}
        <section>
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-slate-500">Aesthetic Presets</label>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(themeCategories).map(([cat, themes]) => (
              <div key={cat}>
                <h4 className="text-[9px] text-slate-600 mb-1 font-bold uppercase">{cat}</h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {themes.map(t => (
                    <button
                      key={t}
                      onClick={() => setSettings(prev => ({ ...prev, ...THEMES[t], theme: t }))}
                      className={`px-3 py-2 rounded text-[10px] font-black transition-all border ${
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
          <div className="grid grid-cols-3 gap-2">
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
            <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-slate-500">Tier Manifest</label>
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
            <Toggle label="Avatars" checked={settings.showAvatars} onChange={v => updateSetting('showAvatars', v)} />
            <Toggle label="Tiers" checked={settings.showTiers} onChange={v => updateSetting('showTiers', v)} />
            <Toggle label="Duration" checked={settings.showDuration} onChange={v => updateSetting('showDuration', v)} />
          </div>
        </section>

        {/* Dimensions Sliders */}
        <section className="space-y-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
          <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-cyan-500">Hull Dimensions</label>
          <Slider label="Widget Width" min={10} max={100} value={settings.widgetWidth} onChange={v => updateSetting('widgetWidth', v)} unit="%" />
          <Slider label="Overall Height" min={40} max={400} value={settings.widgetHeight} onChange={v => updateSetting('widgetHeight', v)} unit="px" />
        </section>

        {/* Sliders */}
        <section className="space-y-6">
          <Slider label="Ground Speed" min={5} max={300} value={settings.speed} onChange={v => updateSetting('speed', v)} unit="s" />
          <Slider label="Text Scale" min={12} max={100} value={settings.fontSize} onChange={v => updateSetting('fontSize', v)} unit="px" />
          <Slider label="Hull Opacity" min={0} max={100} value={settings.backgroundOpacity * 100} onChange={v => updateSetting('backgroundOpacity', v / 100)} unit="%" />
          <Slider label="Kerning (Letter Space)" min={-10} max={40} value={settings.letterSpacing} onChange={v => updateSetting('letterSpacing', v)} unit="px" />
          <Slider label="Pod Compression" min={0.5} max={2.0} value={settings.lineHeight} onChange={v => updateSetting('lineHeight', v)} step={0.1} />
          <Slider label="Flight Gap" min={0} max={500} value={settings.gap} onChange={v => updateSetting('gap', v)} unit="px" />
        </section>

        {/* Colors */}
        <section>
           <label className="block text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-slate-500">Exterior Finish</label>
           <div className="grid grid-cols-2 gap-4">
            <ColorInput label="Primary Hull" value={settings.textColor} onChange={v => updateSetting('textColor', v)} />
            <ColorInput label="Landing Lights" value={settings.accentColor} onChange={v => updateSetting('accentColor', v)} />
            <ColorInput label="Beacon" value={settings.durationColor} onChange={v => updateSetting('durationColor', v)} />
            <ColorInput label="Base Plate" value={settings.backgroundColor} onChange={v => updateSetting('backgroundColor', v)} />
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
      className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-600"
    />
    <span className="text-[10px] font-black group-hover:text-cyan-400 transition-colors uppercase">{label}</span>
  </label>
);

const Slider = ({ label, min, max, value, onChange, unit = "", step = 1 }: any) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-widest text-slate-400">
      <label>{label}</label>
      <span>{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);

const ColorInput = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-[9px] mb-1 uppercase font-bold text-slate-500 tracking-wider">{label}</label>
    <input 
      type="color" 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-10 bg-slate-800 rounded cursor-pointer border border-slate-700 hover:border-slate-500 transition-colors"
    />
  </div>
);
