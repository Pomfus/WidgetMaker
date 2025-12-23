
import React, { useMemo, useState, useEffect } from 'react';
import { Member, TickerSettings, HullShape } from '../types.ts';

interface TickerProps {
  members: Member[];
  settings: TickerSettings;
}

const RankIcon = ({ level, color, size }: { level: number; color: string; size: number }) => {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    style: { transition: 'all 0.3s ease' }
  };

  if (level >= 5) {
    return (
      <svg {...iconProps} strokeWidth="1.5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color + '33'} />
        <path d="M7 20C4.5 18 3 15 3 12C3 7 7 3 12 3C17 3 21 7 21 12C21 15 19.5 18 17 20" />
      </svg>
    );
  }
  if (level >= 3) {
    return (
      <svg {...iconProps} strokeWidth="2">
        <path d="M4 8L12 12L20 8" />
        <path d="M4 14L12 18L20 14" />
      </svg>
    );
  }
  return (
    <svg {...iconProps} strokeWidth="2">
      <path d="M4 12L12 16L20 12" />
    </svg>
  );
};

const BroadcastIcon = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
  </svg>
);

export const Ticker: React.FC<TickerProps> = ({ members, settings }) => {
  const [activeTierIdx, setActiveTierIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tiersManifest = useMemo(() => {
    const groups: Record<string, Member[]> = {};
    const selectedTiers = settings.tierFilter.length > 0 ? settings.tierFilter : Array.from(new Set(members.map(m => m.tier)));
    
    selectedTiers.forEach(t => {
      groups[t] = members.filter(m => m.tier === t).sort((a, b) => parseInt(b.totalMonths) - parseInt(a.totalMonths));
    });

    return Object.entries(groups).filter(([_, list]) => list.length > 0);
  }, [members, settings.tierFilter]);

  const currentTierData = tiersManifest[activeTierIdx % tiersManifest.length];
  const currentMembers = currentTierData ? currentTierData[1] : [];
  const currentTierName = currentTierData ? currentTierData[0] : '';

  useEffect(() => {
    if (tiersManifest.length <= 1) return;
    
    const cycleDuration = settings.speed * 1000;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTierIdx(prev => (prev + 1) % tiersManifest.length);
        setIsTransitioning(false);
      }, 800);
    }, cycleDuration);

    return () => clearInterval(interval);
  }, [tiersManifest.length, settings.speed]);

  const displayList = useMemo(() => {
    if (currentMembers.length === 0 && !settings.customMessage) return [];
    
    let base: any[] = currentMembers.map(m => ({ ...m, isMessage: false }));
    
    if (settings.customMessage && settings.customMessagePosition !== 'none') {
      const msgItem = { name: settings.customMessage, isMessage: true, channelId: 'sys-msg' };
      if (settings.customMessagePosition === 'start') {
        base = [msgItem, ...base];
      } else if (settings.customMessagePosition === 'end') {
        base = [...base, msgItem];
      }
    }
    
    return [...base, ...base];
  }, [currentMembers, settings.customMessage, settings.customMessagePosition]);

  if (displayList.length === 0) return null;

  const getAvatarUrl = (member: Member) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=128`;
  };

  const formatDuration = (totalMonths: string) => {
    const m = parseInt(totalMonths) || 0;
    if (m >= 12) {
      const yrs = Math.floor(m / 12);
      const rem = m % 12;
      return `${yrs}YR ${rem}MNTHS`;
    }
    return `${m} MONTHS`;
  };

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

  const dynamicBackground = hexToRgba(settings.backgroundColor, settings.backgroundOpacity);

  const getSeparator = (theme: string) => {
    // Fighter Wing
    if (['tomcat', 'raptor', 'flanker', 'afterburner', 'strike', 'falcon', 'harrier', 'phantom', 'vigilante', 'intruder'].includes(theme)) return '🛩️';
    if (['mach1', 'mustang', 'zero', 'thunderbolt', 'delta'].includes(theme)) return '🛫';
    if (['dogfight'].includes(theme)) return '⚔️';
    
    // Control Tower
    if (['radar', 'terminal', 'relay', 'uplink', 'bandwidth', 'latency'].includes(theme)) return '📡';
    if (['signal', 'comms', 'frequency', 'static'].includes(theme)) return '📶';
    if (['tower', 'beacon'].includes(theme)) return '🚨';
    
    // Space
    if (['apollo', 'voyager', 'orbit', 'zenith', 'nadir', 'galactic'].includes(theme)) return '🚀';
    if (['nebula', 'cosmos', 'andromeda', 'lunar', 'martian'].includes(theme)) return '🛰️';
    if (['eventhorizon', 'supernova', 'pulsar', 'eclipse', 'sol'].includes(theme)) return '🛸';

    // Cyber
    if (['neondrive', 'cyberdeck', 'datalink', 'mainframe', 'neural', 'singularity', 'dyson', 'proxy', 'kernel', 'root', 'shell', 'binary', 'crypt', 'cipher', 'hack'].includes(theme)) return '👾';
    if (['glitch'].includes(theme)) return '⚡';

    // Retro
    if (['vintage', 'polaroid', 'commodore', 'typewriter', 'vinyl', 'cassette', 'film'].includes(theme)) return '📟';
    if (['crt', 'blueprint', 'steampunk', 'amber', 'phosphor'].includes(theme)) return '🛠️';

    // Nature
    if (['forest', 'jungle', 'moss', 'canopy'].includes(theme)) return '🌲';
    if (['deepsea', 'coral', 'reef'].includes(theme)) return '🌊';
    if (['volcano', 'magma'].includes(theme)) return '🌋';
    if (['arctic', 'frost', 'blizzard', 'tundra'].includes(theme)) return '❄️';
    if (['desert', 'dune', 'oasis'].includes(theme)) return '🌵';
    if (['stormcloud', 'overcast', 'gale', 'monsoon', 'tornado', 'cyclone'].includes(theme)) return '🌪️';

    // Luxury
    if (['firstclass', 'platinum', 'onyx', 'goldleaf', 'diamond', 'emerald', 'sapphire', 'ruby', 'quartz', 'ivory'].includes(theme)) return '💎';
    if (['velvet', 'silk', 'cashmere', 'marble'].includes(theme)) return '✨';

    // Aviation Service
    if (['concorde', 'jetstream', 'horizon', 'kittyhawk', 'spitfire', 'propeller', 'terminal_b'].includes(theme)) return '✈️';

    return '•';
  };

  const getClipPath = (shape: HullShape) => {
    switch (shape) {
      case 'chamfered': return 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)';
      case 'console': return 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)';
      case 'window': return 'inset(0% round 12px)';
      case 'window-glass': return 'inset(0% round 24px)';
      case 'window-tactical': return 'inset(0% round 0px)';
      case 'window-minimal': return 'none';
      case 'full-bottom': return 'none';
      default: return 'none';
    }
  };

  const iconSize = Math.max(16, settings.widgetHeight * 0.4);
  const badgeFontSize = Math.max(8, settings.widgetHeight * 0.12);
  const squadronFontSize = Math.max(6, settings.widgetHeight * 0.08);

  const isFullBottom = settings.hullShape === 'full-bottom';
  const isWindowType = settings.hullShape.startsWith('window');
  const clipPathValue = getClipPath(settings.hullShape);

  const getHullStyle = () => {
    const base = {
      width: isFullBottom ? '100%' : `${settings.widgetWidth}%`,
      height: `${settings.widgetHeight}px`,
      backgroundColor: dynamicBackground,
      color: settings.textColor,
      clipPath: clipPathValue,
      WebkitClipPath: clipPathValue,
      transition: 'all 0.3s ease-in-out',
      zIndex: 1000
    };

    if (settings.hullShape === 'window-glass') {
      return {
        ...base,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid rgba(255,255,255,0.2)`,
      };
    }

    if (settings.hullShape === 'window-minimal') {
      return {
        ...base,
        backgroundColor: 'transparent',
        borderBottom: `2px solid ${settings.accentColor}`,
      };
    }

    if (settings.hullShape === 'window-tactical') {
      return {
        ...base,
        border: `3px solid ${settings.accentColor}`,
        boxShadow: `0 0 20px ${settings.accentColor}33`,
      };
    }

    if (settings.hullShape === 'window') {
      return {
        ...base,
        borderRadius: '12px',
        border: `1px solid ${settings.accentColor}33`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.5)`,
      };
    }

    return base;
  };

  return (
    <div 
      className={`fixed ${isFullBottom ? 'bottom-0 left-0 right-0 w-full' : 'bottom-4 left-1/2 -translate-x-1/2'} overflow-hidden flex items-center theme-${settings.theme} ${isTransitioning ? 'glitch-active' : ''}`}
      style={getHullStyle() as any}
    >
      {isWindowType && settings.hullShape !== 'window-minimal' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-40"></div>
      )}

      <div 
        className={`absolute left-0 top-0 h-full z-30 flex items-center gap-4 backdrop-blur-md px-6 shadow-2xl ${settings.hullShape === 'window-minimal' ? 'bg-black/80' : 'bg-black/40 border-r border-white/10'}`}
        style={{ transition: 'all 0.3s ease' }}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-10 scale-125"></div>
          <RankIcon level={activeTierIdx + 1} color={settings.accentColor} size={iconSize} />
        </div>
        <div className="flex flex-col justify-center border-l border-white/5 pl-4">
          <span 
            className="font-black uppercase tracking-tighter italic leading-none whitespace-nowrap"
            style={{ 
              color: settings.accentColor,
              fontSize: `${badgeFontSize}px`
            }}
          >
            {currentTierName || 'SQUADRON'}
          </span>
          <span 
            className="font-black uppercase tracking-[0.2em] opacity-40 leading-none mt-1 text-center"
            style={{ fontSize: `${squadronFontSize}px` }}
          >
            MANIFEST
          </span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="scan-line" style={{ backgroundColor: `${settings.accentColor}` }}></div>
      </div>

      <div 
        className="flex whitespace-nowrap animate-ticker items-center"
        style={{ 
          animation: `ticker ${settings.speed}s linear infinite`,
          gap: `${settings.gap}px`,
          paddingLeft: `${Math.max(200, settings.widgetHeight * 3)}px`,
          animationPlayState: isTransitioning ? 'paused' : 'running',
          willChange: 'transform'
        }}
      >
        {displayList.map((item: any, idx) => (
          <div 
            key={`${item.channelId || 'msg'}-${idx}`} 
            className="flex items-center gap-6 px-8 shrink-0 relative"
          >
            {item.isMessage ? (
              <BroadcastIcon color={settings.accentColor} size={settings.fontSize * 1.5} />
            ) : (
              settings.showAvatars && (
                <img 
                  src={getAvatarUrl(item)} 
                  alt="" 
                  loading="lazy"
                  className="rounded-full shadow-lg z-10 relative object-cover"
                  style={{ 
                    height: settings.fontSize * 1.5, 
                    width: settings.fontSize * 1.5, 
                    border: `2px solid ${settings.accentColor}`
                  }}
                />
              )
            )}
            
            <div className="flex flex-col items-center justify-center text-center" style={{ lineHeight: settings.lineHeight }}>
              <span 
                className={`name-label ${item.isMessage ? 'italic font-black' : ''}`} 
                style={{ 
                  fontSize: `${settings.fontSize}px`, 
                  letterSpacing: `${settings.letterSpacing}px`,
                  color: item.isMessage ? settings.accentColor : 'inherit'
                }}
              >
                {item.name.toUpperCase()}
              </span>
              <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                {!item.isMessage && settings.showDuration && (
                  <span className="meta-label" style={{ color: settings.durationColor }}>
                    {formatDuration(item.totalMonths).toUpperCase()}
                  </span>
                )}
                {item.isMessage && (
                  <span className="meta-label text-[8px] animate-pulse" style={{ color: settings.accentColor }}>
                    SYSTEM BROADCAST
                  </span>
                )}
              </div>
            </div>

            <span className="separator-icon ml-4" style={{ fontSize: `${settings.fontSize}px` }}>
              {getSeparator(settings.theme)}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }
        @keyframes scan { 0% { transform: translate3d(0, -100%, 0); } 100% { transform: translate3d(0, 100%, 0); } }
        .scan-line { position: absolute; width: 100%; height: 2px; animation: scan 4s linear infinite; box-shadow: 0 0 15px currentColor; will-change: transform; }
        .name-label { font-weight: 800; font-family: 'Inter', sans-serif; transition: all 0.3s; }
        .meta-label { font-size: 10px; font-weight: 900; font-family: 'Inter', sans-serif; letter-spacing: 0.1em; }
        .glitch-active { filter: hue-rotate(90deg) brightness(1.5); transform: translate3d(-50%, 10px, 0) skewX(10deg); opacity: 0.5; }
        .separator-icon { opacity: 0.6; display: flex; align-items: center; justify-content: center; user-select: none; }

        /* Typography Presets */
        .theme-hud .name-label { font-weight: 300; text-shadow: 0 0 12px currentColor; }
        .theme-strike .name-label, .theme-afterburner .name-label, .theme-dogfight .name-label, .theme-mach1 .name-label { font-family: 'Bebas Neue', cursive; font-weight: 900; font-style: italic; }
        .theme-radar .name-label, .theme-terminal .name-label, .theme-digital .name-label { font-family: 'Roboto Mono', monospace; font-weight: 800; }
        .theme-apollo .name-label, .theme-voyager .name-label, .theme-space .name-label { font-family: 'Space Mono', monospace; font-weight: 900; }
        .theme-vintage .name-label, .theme-paper .name-label { font-family: 'Crimson Pro', serif; font-weight: 700; }
        .theme-neondrive .name-label, .theme-cyberdeck .name-label { font-family: 'Inter'; font-weight: 900; text-shadow: 0 0 10px currentColor; }
        .theme-horizon .name-label, .theme-firstclass .name-label { font-family: 'Inter'; font-weight: 300; letter-spacing: 0.25em; }
      `}</style>
    </div>
  );
};
