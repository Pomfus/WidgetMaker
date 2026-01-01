import React, { useState, useEffect, useCallback } from 'react';
import { Member, TickerSettings, THEMES, SavedFavorite, SortOrder } from './types.ts';
import { PresetsPanel, ControlsPanel } from './components/SettingsPanel.tsx';
import { Ticker } from './components/Ticker.tsx';
import { analyzeCsvStructure, getTierInsights } from './services/geminiService.ts';

const STORAGE_KEY = 'ips_ticker_favorites';

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [tiers, setTiers] = useState<string[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  
  const [settings, setSettings] = useState<TickerSettings>({
    speed: 60,
    fontSize: 24,
    durationFontSize: 10,
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
    hullShape: 'window',
    gap: 80,
    letterSpacing: 2,
    lineHeight: 1,
    widgetWidth: 100,
    widgetHeight: 100,
    verticalOffset: 0,
    customMessage: '',
    customMessagePosition: 'none',
    sortOrder: 'duration_desc'
  });

  // Load favorites from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    setInsight("Upload your YouTube 'Members list' CSV to begin.");
  }, []);

  const saveFavorite = (name: string) => {
    const newFavorite: SavedFavorite = {
      id: crypto.randomUUID(),
      name: name || `Loadout ${favorites.length + 1}`,
      timestamp: Date.now(),
      settings,
      members
    };
    const updated = [newFavorite, ...favorites];
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const loadFavorite = (id: string) => {
    const fav = favorites.find(f => f.id === id);
    if (fav) {
      setSettings(fav.settings);
      setMembers(fav.members);
      const uniqueTiers = Array.from(new Set(fav.members.map(m => m.tier)));
      setTiers(uniqueTiers);
      setInsight(`Loadout "${fav.name}" restored from Hangar.`);
    }
  };

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

      const sample = rows.slice(0, 5).map(r => r.join(','));

      try {
        let mapping = await analyzeCsvStructure(sample);
        if (!mapping) {
            mapping = { nameIndex: 0, tierIndex: 1, monthsIndex: 2, idIndex: 3 };
        }

        const parsedMembers: Member[] = rows.slice(1).map(row => {
          const rawMonths = row[mapping!.monthsIndex]?.replace(/"/g, '').trim() || '0';
          const totalMonthsVal = parseFloat(rawMonths.replace(/[^-0-9.]/g, '')) || 0;
          
          return {
            name: row[mapping!.nameIndex]?.replace(/"/g, '').trim() || 'Anonymous',
            tier: row[mapping!.tierIndex]?.replace(/"/g, '').trim() || 'Default',
            totalMonths: totalMonthsVal.toString(),
            channelId: row[mapping!.idIndex]?.replace(/"/g, '').trim() || Math.random().toString(),
          };
        });

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
            case 'console': return 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)';
            case 'window': return 'inset(0% round 12px)';
            case 'window-glass': return 'inset(0% round 24px)';
            case 'window-tactical': return 'inset(0% round 0px)';
            case 'window-minimal': return 'none';
            case 'full-bottom': return 'none';
            case 'afterburner': return 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)';
            case 'delta-fin': return 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)';
            case 'supersonic': return 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 70%)';
            case 'chevron-wing': return 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)';
            case 'wingtip-l': return 'polygon(0% 0%, 100% 0%, 100% 100%, 15% 100%)';
            case 'stealth-v': return 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)';
            case 'radar-array': return 'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%)';
            default: return 'none';
        }
    };

    const dynamicBg = hexToRgba(settings.backgroundColor, settings.backgroundOpacity);
    const iconSize = Math.max(16, settings.widgetHeight * 0.4);
    const badgeFontSize = Math.max(8, settings.widgetHeight * 0.12);
    const squadronSubLabelSize = Math.max(6, settings.widgetHeight * 0.08);

    const isFullBottom = settings.hullShape === 'full-bottom';
    const isWindowType = settings.hullShape.startsWith('window');
    const clipPathValue = getClipPathCSS(settings.hullShape);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>IPS Aviation Ticker</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Bebas+Neue&family=Roboto+Mono&family=Space+Mono&family=Crimson+Pro:wght@700&display=swap" rel="stylesheet">
    <style>
        :root { color-scheme: dark; }
        body { margin: 0; padding: 0; overflow: hidden; background: transparent; -webkit-font-smoothing: antialiased; }
        #container {
            position: fixed; ${isFullBottom ? 'bottom: 0; left: 0; right: 0; width: 100%;' : 'bottom: 16px; left: 50%; transform: translateX(-50%); width: ' + settings.widgetWidth + '%;'}
            height: ${settings.widgetHeight}px;
            background: ${settings.hullShape === 'window-minimal' ? 'transparent' : dynamicBg};
            color: ${settings.textColor}; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            clip-path: ${clipPathValue}; -webkit-clip-path: ${clipPathValue};
            transition: all 0.3s ease; display: flex; align-items: center;
            ${settings.hullShape === 'window' ? 'border-radius: 12px; border: 1px solid ' + settings.accentColor + '33; box-shadow: 0 20px 50px rgba(0,0,0,0.5);' : ''}
            ${settings.hullShape === 'window-glass' ? 'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px;' : ''}
            ${settings.hullShape === 'window-tactical' ? 'border: 3px solid ' + settings.accentColor + '; box-shadow: 0 0 20px ' + settings.accentColor + '33;' : ''}
            ${settings.hullShape === 'window-minimal' ? 'border-bottom: 2px solid ' + settings.accentColor + ';' : ''}
            z-index: 1000;
        }
        
        .top-glow { position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: rgba(255,255,255,0.05); z-index: 40; }

        .badge {
            position: absolute; left: 0; top: 0; height: 100%;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            display: flex; align-items: center; padding: 0 24px;
            border-right: 1px solid rgba(255,255,255,0.1); z-index: 30;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        
        .badge-info { border-left: 1px solid rgba(255,255,255,0.05); padding-left: 16px; margin-left: 16px; display: flex; flex-direction: column; justify-content: center; }
        .tier-name-text { color: ${settings.accentColor}; font-weight: 900; font-style: italic; font-size: ${badgeFontSize}px; line-height: 1; white-space: nowrap; text-transform: uppercase; }
        .members-label { font-size: ${squadronSubLabelSize}px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.4; line-height: 1; margin-top: 4px; }
        
        .track-container { width: 100%; overflow: hidden; display: flex; align-items: center; }
        .track { display: flex; white-space: nowrap; align-items: center; padding-left: ${Math.max(200, settings.widgetHeight * 3)}px; will-change: transform; }
        .track.animating { animation: tick ${settings.speed}s linear infinite; }
        @keyframes tick { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-50%,0,0); } }
        
        .member-item { display: flex; align-items: center; gap: 24px; padding: 0 32px; flex-shrink: 0; position: relative; }
        .avatar { border-radius: 50%; border: 2px solid ${settings.accentColor}; width: ${settings.fontSize * 1.5}px; height: ${settings.fontSize * 1.5}px; object-fit: cover; }
        
        .item-text-container { 
            display: flex; flex-direction: column; align-items: center; justify-content: center; text-center;
            transform: translateY(${settings.verticalOffset}px); 
            transition: transform 0.3s ease; 
            line-height: ${settings.lineHeight};
        }
        
        .name-label { font-weight: 800; font-size: ${settings.fontSize}px; letter-spacing: ${settings.letterSpacing}px; text-transform: uppercase; transition: all 0.3s; }
        .meta-label { font-size: ${settings.durationFontSize}px; font-weight: 900; letter-spacing: 0.1em; opacity: 0.8; text-transform: uppercase; margin-top: 2px; }
        .separator { margin-left: 16px; opacity: 0.6; display: flex; align-items: center; justify-content: center; user-select: none; }
        
        .scan-line { position: absolute; width: 100%; height: 2px; background: ${settings.accentColor}; opacity: 0.15; animation: scan 4s linear infinite; box-shadow: 0 0 15px currentColor; pointer-events: none; z-index: 2; will-change: transform; }
        @keyframes scan { 0% { transform: translate3d(0, -100%, 0); } 100% { transform: translate3d(0, ${settings.widgetHeight}px, 0); } }

        /* Typography Styles Synchronized */
        .theme-hud .name-label { font-weight: 300; text-shadow: 0 0 12px currentColor; }
        .theme-strike .name-label, .theme-afterburner .name-label, .theme-dogfight .name-label, .theme-mach1 .name-label { font-family: 'Bebas Neue'; font-weight: 900; font-style: italic; }
        .theme-radar .name-label, .theme-terminal .name-label, .theme-digital .name-label { font-family: 'Roboto Mono'; font-weight: 800; }
        .theme-apollo .name-label, .theme-voyager .name-label { font-family: 'Space Mono'; font-weight: 900; }
        .theme-vintage .name-label, .theme-paper .name-label { font-family: 'Crimson Pro'; font-weight: 700; }
        .theme-neondrive .name-label, .theme-cyberdeck .name-label { font-family: 'Inter'; font-weight: 900; text-shadow: 0 0 10px currentColor; }
    </style>
</head>
<body class="theme-${settings.theme}">
    <div id="container">
        ${isWindowType && settings.hullShape !== 'window-minimal' ? '<div class="top-glow"></div>' : ''}
        <div class="badge" id="badge-ui">
            <div id="icon-svg" style="display:flex; position:relative;"></div>
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
            const common = 'width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '"';
            if (level >= 5) return '<svg ' + common + ' stroke-width="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="' + color + '33" /><path d="M7 20C4.5 18 3 15 3 12C3 7 7 3 12 3C17 3 21 7 21 12C21 15 19.5 18 17 20" /></svg>';
            if (level >= 3) return '<svg ' + common + ' stroke-width="2"><path d="M4 8L12 12L20 8" /><path d="M4 14L12 18L20 14" /></svg>';
            return '<svg ' + common + ' stroke-width="2"><path d="M4 12L12 16L20 12" /></svg>';
        };

        const getBroadcastIcon = (color, size) => {
          return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></svg>';
        };

        const getSeparator = (theme) => {
          if (['tomcat', 'raptor', 'flanker', 'afterburner', 'strike', 'falcon', 'harrier', 'phantom', 'vigilante', 'intruder'].includes(theme)) return '🛩️';
          if (['mach1', 'mustang', 'zero', 'thunderbolt', 'delta'].includes(theme)) return '🛫';
          if (['dogfight'].includes(theme)) return '⚔️';
          if (['radar', 'terminal', 'relay', 'uplink', 'bandwidth', 'latency'].includes(theme)) return '📡';
          if (['signal', 'comms', 'frequency', 'static'].includes(theme)) return '📶';
          if (['tower', 'beacon'].includes(theme)) return '🚨';
          if (['apollo', 'voyager', 'orbit', 'zenith', 'nadir', 'galactic'].includes(theme)) return '🚀';
          if (['nebula', 'cosmos', 'andromeda', 'lunar', 'martian'].includes(theme)) return '🛰️';
          if (['eventhorizon', 'supernova', 'pulsar', 'eclipse', 'sol'].includes(theme)) return '🛸';
          if (['neondrive', 'cyberdeck', 'datalink', 'mainframe', 'neural', 'singularity', 'dyson', 'proxy', 'kernel', 'root', 'shell', 'binary', 'crypt', 'cipher', 'hack'].includes(theme)) return '👾';
          if (['glitch'].includes(theme)) return '⚡';
          if (['vintage', 'polaroid', 'commodore', 'typewriter', 'vinyl', 'cassette', 'film'].includes(theme)) return '📟';
          if (['crt', 'blueprint', 'steampunk', 'amber', 'phosphor'].includes(theme)) return '🛠️';
          if (['forest', 'jungle', 'moss', 'canopy'].includes(theme)) return '🌲';
          if (['deepsea', 'coral', 'reef'].includes(theme)) return '🌊';
          if (['volcano', 'magma'].includes(theme)) return '🌋';
          if (['arctic', 'frost', 'blizzard', 'tundra'].includes(theme)) return '❄️';
          if (['desert', 'dune', 'oasis'].includes(theme)) return '🌵';
          if (['stormcloud', 'overcast', 'gale', 'monsoon', 'tornado', 'cyclone'].includes(theme)) return '🌪️';
          if (['firstclass', 'platinum', 'onyx', 'goldleaf', 'diamond', 'emerald', 'sapphire', 'ruby', 'quartz', 'ivory'].includes(theme)) return '💎';
          if (['velvet', 'silk', 'cashmere', 'marble'].includes(theme)) return '✨';
          if (['concorde', 'jetstream', 'horizon', 'kittyhawk', 'spitfire', 'propeller', 'terminal_b'].includes(theme)) return '✈️';
          return '•';
        };

        function formatDuration(totalMonths) {
            const m = Math.floor(parseFloat(totalMonths) || 0);
            const yrs = Math.floor(m / 12);
            const rem = m % 12;
            if (yrs > 0) {
                const yrLabel = yrs === 1 ? 'YR' : 'YRS';
                return yrs + yrLabel + ' ' + rem + 'MNTHS';
            }
            return m + ' MNTHS';
        }

        function updateTier() {
            if (tiers.length === 0 && !settings.customMessage) return;
            const container = document.getElementById('container');
            container.style.opacity = '0.5';
            
            setTimeout(() => {
                const tier = (tiers.length > 0) ? tiers[currentTierIdx] : null;
                document.getElementById('tier-name').innerText = tier ? tier.toUpperCase() : 'MEMBERSHIP';
                document.getElementById('icon-svg').innerHTML = getRankIcon(currentTierIdx + 1, settings.accentColor, ${iconSize});
                
                let filtered = tier ? membersData.filter(m => m.tier === tier) : [];
                
                filtered.sort((a, b) => {
                  if (settings.sortOrder === 'alpha') return a.name.localeCompare(b.name);
                  const aMonths = parseFloat(a.totalMonths) || 0;
                  const bMonths = parseFloat(b.totalMonths) || 0;
                  if (settings.sortOrder === 'duration_asc') return aMonths - bMonths;
                  return bMonths - aMonths;
                });

                let displayItems = filtered.map(m => ({ ...m, isMessage: false }));
                if (settings.customMessage && settings.customMessagePosition !== 'none') {
                  const msg = { name: settings.customMessage, isMessage: true };
                  if (settings.customMessagePosition === 'start') displayItems = [msg, ...displayItems];
                  else if (settings.customMessagePosition === 'end') displayItems = [...displayItems, msg];
                }

                const track = document.getElementById('track');
                track.innerHTML = '';
                const list = [...displayItems, ...displayItems];
                list.forEach(m => {
                    const item = document.createElement('div');
                    item.className = 'member-item';
                    if (m.isMessage) {
                        const iconWrapper = document.createElement('div');
                        iconWrapper.innerHTML = getBroadcastIcon(settings.accentColor, settings.fontSize * 1.5);
                        item.appendChild(iconWrapper);
                    } else if (settings.showAvatars) {
                        const img = document.createElement('img'); img.className = 'avatar';
                        img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.name) + '&background=random&color=fff&size=128';
                        item.appendChild(img);
                    }
                    
                    const info = document.createElement('div');
                    info.className = 'item-text-container';
                    const name = document.createElement('span'); name.className = 'name-label';
                    if (m.isMessage) { name.style.color = settings.accentColor; name.style.fontStyle = 'italic'; }
                    name.innerText = m.name.toUpperCase();
                    info.appendChild(name);
                    
                    if (!m.isMessage && settings.showDuration) {
                        const dur = document.createElement('span'); dur.className = 'meta-label';
                        dur.style.color = settings.durationColor; dur.style.fontSize = settings.durationFontSize + 'px';
                        dur.innerText = formatDuration(m.totalMonths);
                        info.appendChild(dur);
                    }
                    item.appendChild(info);
                    
                    const sep = document.createElement('span'); 
                    sep.className = 'separator'; 
                    sep.style.fontSize = settings.fontSize + 'px';
                    sep.innerText = getSeparator(settings.theme);
                    item.appendChild(sep);
                    track.appendChild(item);
                });
                container.style.opacity = '1';
                if (tiers.length > 0) currentTierIdx = (currentTierIdx + 1) % tiers.length;
            }, 800);
        }

        updateTier();
        if (tiers.length > 1 || (tiers.length > 0 && settings.customMessage)) setInterval(updateTier, settings.speed * 1000);
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
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className={`fixed top-4 left-4 z-50 transition-opacity duration-300 ${showSettings ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg shadow-2xl font-black text-xs uppercase tracking-widest italic focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {showSettings ? 'TERMINATE HUD' : 'REBOOT SYSTEM'}
        </button>
      </div>

      {showSettings && (
        <div className="z-40 w-full max-w-[1500px] grid md:grid-cols-3 gap-6 h-[85vh]">
          
          {/* Box 1: CSV Importer */}
          <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 -rotate-45 translate-x-16 -translate-y-16 border border-cyan-500/10 pointer-events-none"></div>
            
            <div className="p-8 flex flex-col items-center text-center overflow-y-auto custom-scrollbar h-full w-full">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20 relative group shrink-0">
                <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping opacity-20"></div>
                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic shrink-0">CSV IMPORTER</h3>
              <p className="text-slate-400 text-[10px] mb-8 font-mono uppercase tracking-widest shrink-0">DEPLOYMENT SECTOR: ALPHA</p>
              
              <div className="flex flex-col gap-4 w-full shrink-0">
                <label className="cursor-pointer bg-cyan-500 text-black px-8 py-4 rounded-xl font-black hover:bg-cyan-400 transition-all uppercase tracking-tighter shadow-lg active:scale-95 text-md text-center select-none">
                  {isLoading ? 'ANALYZING...' : 'IMPORT ROSTER'}
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
                <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2">Community Intel</p>
                  <div className="text-xs italic text-cyan-200 font-mono">
                    {insight || "Waiting for CSV data upload..."}
                  </div>
                </div>
              </div>
              
              {members.length > 0 && (
                <div className="mt-6 w-full bg-slate-800/80 p-3 rounded-lg border border-cyan-500/20 text-cyan-400 font-mono text-[9px] tracking-widest animate-pulse shrink-0">
                  STATUS: NOMINAL | ENTRIES: {members.length}
                </div>
              )}

              <div className="mt-12 text-left w-full border-t border-slate-800 pt-6">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">FLIGHT MANUAL</h4>
                <ul className="text-[10px] space-y-3 text-slate-400 font-medium">
                    <li className="flex gap-2"><span className="text-cyan-500 font-black">1.</span> Upload Members_list.csv</li>
                    <li className="flex gap-2"><span className="text-cyan-500 font-black">2.</span> Choose an Aesthetic Preset</li>
                    <li className="flex gap-2"><span className="text-cyan-500 font-black">3.</span> Tune tactical HUD sliders</li>
                    <li className="flex gap-2"><span className="text-cyan-500 font-black">4.</span> Deploy to OBS Browser Source</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Box 2: Aesthetic Presets */}
          <PresetsPanel settings={settings} setSettings={setSettings} />

          {/* Box 3: All Sliders & Controls */}
          <ControlsPanel 
            settings={settings} 
            setSettings={setSettings} 
            tiers={tiers}
            onExport={exportStandaloneWidget}
            hasMembers={members.length > 0}
            favorites={favorites}
            onSave={saveFavorite}
            onDelete={deleteFavorite}
            onLoad={loadFavorite}
          />
        </div>
      )}

      <Ticker members={members} settings={settings} />
    </div>
  );
};

export default App;
