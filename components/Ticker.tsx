
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

export const Ticker: React.FC<TickerProps> = ({ members, settings }) => {
  const [activeTierIdx, setActiveTierIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Group members by tier
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

  // Cycle duration logic
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

  if (currentMembers.length === 0) return null;

  const displayList = [...currentMembers, ...currentMembers];

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
    const separators: Record<string, string> = {
      strike: '///', radar: '+', tomcat: '>>>', raptor: '|||', apollo: '---', 
      afterburner: '>>>', mach1: '>', vintage: '::', kittyhawk: '~', 
      terminal: '_', glasscockpit: '::', transponder: '#', squawk: '!!!'
    };
    return separators[theme] || '•';
  };

  const getClipPath = (shape: HullShape) => {
    switch (shape) {
      case 'chamfered': return 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)';
      case 'stealth': return 'polygon(0% 20%, 10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%)';
      case 'wing-root': return 'polygon(0% 100%, 15% 0%, 85% 0%, 100% 100%)';
      case 'hud-bracket': return 'polygon(0% 0%, 5% 0%, 5% 20%, 0% 20%, 0% 80%, 5% 80%, 5% 100%, 0% 100%, 0% 100%, 95% 100%, 95% 80%, 100% 80%, 100% 20%, 95% 20%, 95% 0%, 100% 0%)';
      case 'console': return 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)';
      default: return 'none';
    }
  };

  // Calculate icon and badge sizes based on widget height
  const iconSize = Math.max(16, settings.widgetHeight * 0.4);
  const badgeFontSize = Math.max(8, settings.widgetHeight * 0.12);
  const squadronFontSize = Math.max(6, settings.widgetHeight * 0.08);

  return (
    <div 
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 overflow-hidden flex items-center theme-${settings.theme} ${isTransitioning ? 'glitch-active' : ''}`}
      style={{ 
        width: `${settings.widgetWidth}%`,
        height: `${settings.widgetHeight}px`,
        backgroundColor: dynamicBackground,
        color: settings.textColor,
        clipPath: getClipPath(settings.hullShape),
        transition: 'all 0.3s ease-in-out'
      }}
    >
      {/* Tier Command Badge (Locked Height to Ticker) */}
      <div 
        className="absolute left-0 top-0 h-full z-30 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 border-r border-white/10 shadow-2xl animate-badge-pulse"
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
            {currentTierName}
          </span>
          <span 
            className="font-black uppercase tracking-[0.2em] opacity-40 leading-none mt-1"
            style={{ fontSize: `${squadronFontSize}px` }}
          >
            MEMBERS
          </span>
        </div>
      </div>

      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="scan-line" style={{ backgroundColor: `${settings.accentColor}` }}></div>
      </div>

      <div 
        className="flex whitespace-nowrap animate-ticker items-center"
        style={{ 
          animation: `ticker ${settings.speed}s linear infinite`,
          gap: `${settings.gap}px`,
          paddingLeft: `${Math.max(200, settings.widgetHeight * 3)}px`,
          animationPlayState: isTransitioning ? 'paused' : 'running'
        }}
      >
        {displayList.map((member, idx) => (
          <div 
            key={`${member.channelId}-${idx}`} 
            className="flex items-center gap-6 px-8 shrink-0 relative"
          >
            {settings.showAvatars && (
              <img 
                src={getAvatarUrl(member)} 
                alt="" 
                className="rounded-full shadow-lg z-10 relative"
                style={{ 
                  height: settings.fontSize * 1.5, 
                  width: settings.fontSize * 1.5, 
                  border: `2px solid ${settings.accentColor}`
                }}
              />
            )}
            
            <div className="flex flex-col items-center justify-center text-center" style={{ lineHeight: settings.lineHeight }}>
              <span className="name-label" style={{ fontSize: `${settings.fontSize}px`, letterSpacing: `${settings.letterSpacing}px` }}>
                {member.name.toUpperCase()}
              </span>
              <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                {settings.showDuration && (
                  <span className="meta-label" style={{ color: settings.durationColor }}>
                    {formatDuration(member.totalMonths).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <span className="ml-4 opacity-30 text-2xl font-black italic">{getSeparator(settings.theme)}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes badge-pulse { from { opacity: 0.95; } to { opacity: 1; } }
        
        .scan-line { position: absolute; width: 100%; height: 2px; animation: scan 4s linear infinite; box-shadow: 0 0 15px currentColor; }
        .name-label { font-weight: 800; font-family: 'Inter', sans-serif; transition: all 0.3s; }
        .meta-label { font-size: 10px; font-weight: 900; font-family: 'Inter', sans-serif; letter-spacing: 0.1em; }

        .glitch-active {
          filter: hue-rotate(90deg) brightness(1.5);
          transform: translateX(-50%) skewX(10deg);
          opacity: 0.5;
        }

        .theme-hud .name-label { font-weight: 300; text-shadow: 0 0 12px currentColor; }
        .theme-strike .name-label, .theme-afterburner .name-label, .theme-dogfight .name-label { font-family: 'Bebas Neue', cursive; font-weight: 900; font-style: italic; }
        .theme-mach1 .name-label { font-family: 'Bebas Neue'; font-weight: 900; font-style: italic; transform: skewX(-15deg); }
        .theme-radar .name-label, .theme-transponder .name-label, .theme-terminal .name-label, .theme-glasscockpit .name-label { font-family: 'Roboto Mono', monospace; font-weight: 800; }
        .theme-apollo .name-label { font-family: 'Space Mono', monospace; font-weight: 900; }
        .theme-vintage .name-label { font-family: 'Crimson Pro', serif; font-weight: 700; }
        .theme-horizon .name-label, .theme-concorde .name-label { font-family: 'Inter'; font-weight: 300; letter-spacing: 0.15em; }
      `}</style>
    </div>
  );
};
