import React from 'react';

interface HeroBackgroundProps {
  variant?: string;
}

/**
 * More visible, vibrant animated SVG/CSS background for the homepage hero section.
 * Blobs are above the overlay, with a subtle animated grid for a legal-tech vibe.
 */
const HeroBackground: React.FC<HeroBackgroundProps> = ({ variant }) => {
  if (variant === 'dashboard') {
    // Responsive, full-width hexagon grid illusion
    const gridCols = 20;
    const gridRows = 12;
    const hexWidth = 60;
    const hexHeight = 52;
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
        {/* Parallax hexagon grid - full width/height */}
        <svg className="absolute inset-0 w-full h-full opacity-80 animate-dashboard-hex-parallax" width="100%" height="100%" viewBox="0 0 1200 600" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hexGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Draw a grid of hexagons */}
          {Array.from({ length: gridRows }).map((_, row) => (
            Array.from({ length: gridCols }).map((_, col) => {
              const x = hexWidth * col + (row % 2 === 0 ? 0 : hexWidth / 2);
              const y = hexHeight * row;
              return (
                <polygon
                  key={`hex-${row}-${col}`}
                  points="30,0 60,17 60,51 30,68 0,51 0,17"
                  transform={`translate(${x},${y}) scale(0.85)`}
                  fill="none"
                  stroke="url(#hexGlow)"
                  strokeWidth="2.5"
                  filter="url(#glow)"
                  opacity={0.7 - 0.04 * Math.abs(row - gridRows / 2)}
                />
              );
            })
          ))}
        </svg>
        {/* Animated glowing hexagon cluster (illusion effect) - centered */}
        <svg className="absolute left-1/2 top-1/2 w-[32vw] min-w-[320px] max-w-[520px] h-[32vw] min-h-[320px] max-h-[520px] -translate-x-1/2 -translate-y-1/2 opacity-90 animate-dashboard-hex-illusion" width="100%" height="100%" viewBox="0 0 420 420" fill="none" preserveAspectRatio="xMidYMid meet">
          <g filter="url(#glow)">
            <polygon points="210,60 300,105 300,195 210,240 120,195 120,105" stroke="url(#hexGlow)" strokeWidth="6" fill="none" />
            <polygon points="210,120 270,150 270,210 210,240 150,210 150,150" stroke="url(#hexGlow)" strokeWidth="4" fill="none" opacity="0.7" />
            <polygon points="210,180 240,195 240,225 210,240 180,225 180,195" stroke="url(#hexGlow)" strokeWidth="2.5" fill="none" opacity="0.5" />
          </g>
        </svg>
        {/* Soft glow overlay for extra pop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-white/0 mix-blend-lighten" />
      </div>
    );
  }

  // Default: original blobs + grid
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
      {/* Subtle animated grid */}
      <svg className="absolute inset-0 w-full h-full opacity-30 animate-hero-grid-move" width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Animated SVG blobs - more vibrant and visible */}
      <svg className="absolute left-[-10%] top-[-20%] w-[60vw] h-[60vw] min-w-[400px] min-h-[400px] opacity-80 animate-blob-move-slow" viewBox="0 0 600 600" fill="none">
        <defs>
          <radialGradient id="bg1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientTransform="rotate(20)">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="300" rx="280" ry="220" fill="url(#bg1)" />
      </svg>
      <svg className="absolute right-[-15%] top-[10%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] opacity-70 animate-blob-move-medium" viewBox="0 0 500 500" fill="none">
        <defs>
          <radialGradient id="bg2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <ellipse cx="250" cy="250" rx="200" ry="170" fill="url(#bg2)" />
      </svg>
      <svg className="absolute left-[30%] bottom-[-20%] w-[40vw] h-[40vw] min-w-[250px] min-h-[250px] opacity-60 animate-blob-move-fast" viewBox="0 0 400 400" fill="none">
        <defs>
          <radialGradient id="bg3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="200" rx="170" ry="120" fill="url(#bg3)" />
      </svg>
      {/* Soft glow overlay for extra pop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-white/0 mix-blend-lighten" />
    </div>
  );
};

export default HeroBackground; 