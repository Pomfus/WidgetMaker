
import React, { useState, useEffect } from 'react';
import { Member, TickerSettings, THEMES } from './types.ts';
import { SettingsPanel } from './components/SettingsPanel.tsx';
import { Ticker } from './components/Ticker.tsx';
import { analyzeCsvStructure, getTierInsights } from './services/geminiService.ts';

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [tiers, setTiers] = useState<string[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState<TickerSettings>({
    speed: 60,
    fontSize: 24,
    textColor: '#00ffff',
    backgroundColor: '#001414',
    backgroundOpacity: 0.9,
    accentColor: '#00ffff',
    durationColor: '#ffffff',
    showAvatars: true,
    showTiers: true,
    showDuration: true,
    tierFilter: [],
    theme: 'hud',
    hullShape: 'hud-bracket',
    gap: 80,
    letterSpacing: 2,
    lineHeight: 1,
    widgetWidth: 100,
    widgetHeight: 100,
  });

  useEffect(() => {
    setInsight("Upload your YouTube 'Members list' CSV to begin.");
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n')
        .map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/))
        .filter(r => r.length > 1);

      if (rows.length < 2) {
        setIsLoading(false);
        return;
      }

      const headers = rows[0];
      const sample = rows.slice(0, 5).map(r => r.join(','));

      try {
        let mapping = await analyzeCsvStructure(sample);
        if (!mapping) {
            // Fallback manual mapping if AI fails
            mapping = { nameIndex: 0, tierIndex: 1, monthsIndex: 2, idIndex: 3 };
        }

        const parsedMembers: Member[] = rows.slice(1).map(row => ({
          name: row[mapping!.nameIndex]?.replace(/"/g, '').trim() || 'Anonymous',
          tier: row[mapping!.tierIndex]?.replace(/"/g, '').trim() || 'Default',
          totalMonths: row[mapping!.monthsIndex]?.replace(/"/g, '').trim() || '0',
          channelId: row[mapping!.idIndex]?.replace(/"/g, '').trim() || Math.random().toString(),
        }));

        setMembers(parsedMembers);
        const uniqueTiers = Array.from(new Set(parsedMembers.map(m => m.tier)));
        setTiers(uniqueTiers);
        setSettings(prev => ({ ...prev, tierFilter: uniqueTiers }));

        const newInsight = await getTierInsights(parsedMembers);
        setInsight(newInsight);
      } catch (err) {
        console.error("CSV Processing Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const exportStandaloneWidget = () => {
    const hexToRgba = (hex: string, alpha: number) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getClipPathCSS = (shape: string) => {
        switch (shape) {
            case 'chamfered': return 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)';
            case 'stealth': return 'polygon(0% 20%, 10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%)';
            case 'wing-root': return 'polygon(0% 100%, 15% 0%, 85% 0%, 100% 100%)';
            case 'hud-bracket': return 'polygon(0% 0%, 5% 0%, 5% 20%, 0% 20%, 0% 80%, 5% 80%, 5% 100%, 0% 100%, 0% 100%, 95% 100%, 95% 80%, 100% 80%, 100% 20%, 95% 20%, 95% 0%, 100% 0%)';
            case 'console': return 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)';
            default: return 'none';
        }
    };

    const dynamicBg = hexToRgba(settings.backgroundColor, settings.backgroundOpacity);
    const iconSize = Math.max(16, settings.widgetHeight * 0.4);
    const badgeFontSize = Math.max(8, settings.widgetHeight * 0.12);
    const membersSubLabelSize = Math.max(6, settings.widgetHeight * 0.08);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IPS Aviation Ticker</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Bebas+Neue&family=Roboto+Mono&family=Space+Mono&family=Crimson+Pro:wght@700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
        #container {
            position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
            width: ${settings.widgetWidth}%; height: ${settings.widgetHeight}px;
            background: ${dynamicBg};
            color: ${settings.textColor}; font-family: 'Inter', sans-serif;
            clip-path: ${getClipPathCSS(settings.hullShape)};
            transition: all 0.3s ease; display: flex; align-items: center;
        }
        .badge {
            position: absolute; left: 0; top: 0; height: 100%;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(10px);
            display: flex; align-items: center; padding: 0 24px;
            border-right: 1px solid rgba(255,255,255,0.1); z-index: 100;
        }
        .badge-icon-container { position: relative; display: flex; align-items: center; justify-content: center; }
        .ping {
            position: absolute; inset: 0; background: ${settings.accentColor}; 
            border-radius: 50%; opacity: 0.1; transform: scale(1.25);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
        
        .badge-info { border-left: 1px solid rgba(255,255,255,0.05); padding-left: 16px; margin-left: 16px; display: flex; flex-direction: column; justify-content: center; }
        .tier-name-text { color: ${settings.accentColor}; font-weight: 900; font-style: italic; font-size: ${badgeFontSize}px; line-height: 1; white-space: nowrap; }
        .members-label { font-size: ${membersSubLabelSize}px; font-weight: 900; text-transform: uppercase; tracking: 0.2em; opacity: 0.4; line-height: 1; margin-top: 4px; }
        
        .track-container { width: 100%; overflow: hidden; display: flex; align-items: center; }
        .track { display: flex; white-space: nowrap; align-items: center; padding-left: ${Math.max(200, settings.widgetHeight * 3)}px; will-change: transform; }
        .track.animating { animation: tick ${settings.speed}s linear infinite; }
        
        @keyframes tick { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .member-item { display: flex; align-items: center; gap: 24px; padding: 0 32px; flex-shrink: 0; position: relative; }
        .avatar { border-radius: 50%; border: 2px solid ${settings.accentColor}; width: ${settings.fontSize * 1.5}px; height: ${settings.fontSize * 1.5}px; object-fit: cover; }
        .name-label { font-weight: 800; font-size: ${settings.fontSize}px; letter-spacing: ${settings.letterSpacing}px; text-transform: uppercase; }
        .meta-label { font-size: 10px; font-weight: 900; letter-spacing: 0.1em; opacity: 0.8; text-transform: uppercase; }
        .separator { margin-left: 16px; opacity: 0.3; font-size: 24px; font-weight: 900; font-style: italic; }

        .scan-line { position: absolute; width: 100%; height: 2px; background: ${settings.accentColor}; opacity: 0.15; animation: scan 4s linear infinite; box-shadow: 0 0 15px currentColor; pointer-events: none; z-index: 2; }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(${settings.widgetHeight}px); } }

        .glitch-active { filter: contrast(1.5) hue-rotate(45deg); opacity: 0.6; }

        /* THEME STYLES */
        .theme-hud .name-label { font-weight: 300; text-shadow: 0 0 12px currentColor; }
        .theme-strike .name-label, .theme-afterburner .name-label, .theme-dogfight .name-label { font-family: 'Bebas Neue'; font-weight: 900; font-style: italic; }
        .theme-mach1 .name-label { font-family: 'Bebas Neue'; font-weight: 900; font-style: italic; transform: skewX(-15deg); }
        .theme-radar .name-label, .theme-transponder .name-label, .theme-terminal .name-label, .theme-glasscockpit .name-label { font-family: 'Roboto Mono'; font-weight: 800; }
        .theme-apollo .name-label { font-family: 'Space Mono'; font-weight: 900; }
        .theme-vintage .name-label { font-family: 'Crimson Pro'; font-weight: 700; }
    </style>
</head>
<body class="theme-${settings.theme}">
    <div id="container">
        <div class="badge" id="badge-ui">
            <div class="badge-icon-container">
                <div class="ping"></div>
                <div id="icon-svg"></div>
            </div>
            <div class="badge-info">
                <span id="tier-name" class="tier-name-text">...</span>
                <span class="members-label">MEMBERS</span>
            </div>
        </div>
        <div class="scan-line"></div>
        <div class="track-container">
            <div class="track animating" id="track"></div>
        </div>
    </div>
    <script>
        const membersData = ${JSON.stringify(members)};
        const settings = ${JSON.stringify(settings)};
        const tiers = ${JSON.stringify(settings.tierFilter.length > 0 ? settings.tierFilter : Array.from(new Set(members.map(m => m.tier))))};
        let currentTierIdx = 0;

        const getRankIcon = (level, color, size) => {
            const common = 'width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" style="transition: all 0.3s ease"';
            if (level >= 5) return '<svg ' + common + ' stroke-width="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="' + color + '33" /><path d="M7 20C4.5 18 3 15 3 12C3 7 7 3 12 3C17 3 21 7 21 12C21 15 19.5 18 17 20" /></svg>';
            if (level >= 3) return '<svg ' + common + ' stroke-width="2"><path d="M4 8L12 12L20 8" /><path d="M4 14L12 18L20 14" /></svg>';
            return '<svg ' + common + ' stroke-width="2"><path d="M4 12L12 16L20 12" /></svg>';
        };

        const getSeparator = (theme) => {
            const seps = { strike: '///', radar: '+', tomcat: '>>>', raptor: '|||', apollo: '---', afterburner: '>>>', mach1: '>', vintage: '::', kittyhawk: '~', terminal: '_', glasscockpit: '::', transponder: '#', squawk: '!!!' };
            return seps[theme] || '•';
        };

        function formatDuration(totalMonths) {
            const m = parseInt(totalMonths) || 0;
            if (m >= 12) {
                const yrs = Math.floor(m / 12);
                const rem = m % 12;
                return yrs + 'YR ' + rem + 'MNTHS';
            }
            return m + ' MONTHS';
        }

        function updateTier() {
            if (tiers.length === 0) return;
            const container = document.getElementById('container');
            container.classList.add('glitch-active');
            
            setTimeout(() => {
                const tier = tiers[currentTierIdx];
                document.getElementById('tier-name').innerText = tier.toUpperCase();
                document.getElementById('icon-svg').innerHTML = getRankIcon(currentTierIdx + 1, settings.accentColor, ${iconSize});
                
                const filtered = membersData.filter(m => m.tier === tier).sort((a,b) => parseInt(b.totalMonths) - parseInt(a.totalMonths));
                const track = document.getElementById('track');
                track.innerHTML = '';
                
                const list = filtered.length > 0 ? [...filtered, ...filtered] : [];
                list.forEach(m => {
                    const item = document.createElement('div');
                    item.className = 'member-item';
                    
                    if (settings.showAvatars) {
                        const img = document.createElement('img');
                        img.className = 'avatar';
                        img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.name) + '&background=random&color=fff&size=128';
                        item.appendChild(img);
                    }
                    
                    const info = document.createElement('div');
                    info.style.display = 'flex';
                    info.style.flexDirection = 'column';
                    info.style.alignItems = 'center';
                    info.style.lineHeight = settings.lineHeight;
                    
                    const name = document.createElement('span');
                    name.className = 'name-label';
                    name.innerText = m.name.toUpperCase();
                    info.appendChild(name);
                    
                    if (settings.showDuration) {
                        const dur = document.createElement('span');
                        dur.className = 'meta-label';
                        dur.style.color = settings.durationColor;
                        dur.innerText = formatDuration(m.totalMonths).toUpperCase();
                        info.appendChild(dur);
                    }
                    item.appendChild(info);
                    
                    const sep = document.createElement('span');
                    sep.className = 'separator';
                    sep.innerText = getSeparator(settings.theme);
                    item.appendChild(sep);
                    
                    track.appendChild(item);
                });
                
                container.classList.remove('glitch-active');
                currentTierIdx = (currentTierIdx + 1) % tiers.length;
            }, 800);
        }

        if (tiers.length > 0) {
            updateTier();
            if (tiers.length > 1) {
                setInterval(updateTier, settings.speed * 1000);
            }
        }
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IPS_Aviation_Ticker.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <div className={`fixed top-4 left-4 z-50 transition-opacity duration-300 ${showSettings ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg shadow-2xl font-black text-xs uppercase tracking-widest italic"
        >
          {showSettings ? 'TERMINATE UI' : 'ACCESS DASHBOARD'}
        </button>
      </div>

      {showSettings && (
        <div className="z-40 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 -rotate-45 translate-x-16 -translate-y-16 border border-cyan-500/10"></div>
            
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-8 border border-cyan-500/20 relative group">
              <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping opacity-20"></div>
              <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">IPS Ticker Builder</h3>
            <p className="text-slate-400 text-sm mb-10 font-mono uppercase tracking-tight">Deployment Ready: Web & Desktop</p>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <label className="cursor-pointer bg-cyan-500 text-black px-12 py-4 rounded-xl font-black hover:bg-cyan-400 transition-all uppercase tracking-tighter shadow-[0_10px_30px_rgba(6,182,212,0.3)] active:scale-95 text-lg text-center">
                {isLoading ? 'ANALYZING...' : 'IMPORT CSV'}
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
              <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Step 1: Upload Members CSV</p>
            </div>
            
            {members.length > 0 && (
              <div className="mt-10 bg-slate-800/80 p-4 rounded-lg border border-cyan-500/20 text-cyan-400 font-mono text-[10px] tracking-widest animate-pulse">
                [SYSTEM_STATUS: NOMINAL] [LOADED: {members.length} ENTRIES]
              </div>
            )}
            
            <div className="mt-12 text-left w-full border-t border-slate-800 pt-8">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Deployment Guide</h4>
               <ul className="text-xs space-y-3 text-slate-400 font-medium">
                  <li className="flex gap-3"><span className="text-cyan-500 font-black">01</span> Customize the visual HUD in the Control Tower.</li>
                  <li className="flex gap-3"><span className="text-cyan-500 font-black">02</span> Click "Deploy" to download your standalone .html widget.</li>
                  <li className="flex gap-3"><span className="text-cyan-500 font-black">03</span> Add that file to OBS as a "Browser Source" (Local File).</li>
               </ul>
            </div>
          </div>

          <SettingsPanel 
            settings={settings} 
            setSettings={setSettings} 
            tiers={tiers}
            insight={insight}
            onExport={exportStandaloneWidget}
            hasMembers={members.length > 0}
          />
        </div>
      )}

      <Ticker members={members} settings={settings} />
    </div>
  );
};

export default App;
