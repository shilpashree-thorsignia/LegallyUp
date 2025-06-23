import React, { useRef, useEffect } from 'react';

interface HeroBackgroundProps {
  variant?: string;
}

/**
 * Background for the homepage hero section with videos and custom animations.
 * Custom animated background for dashboard using logo colors.
 */
const HeroBackground: React.FC<HeroBackgroundProps> = ({ variant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Set playback rate to 56% (20% slower than previous 0.7 rate) for all variants
      videoRef.current.playbackRate = 0.56;
    }
  }, []);

  // Custom animated background for dashboard
  if (variant === 'dashboard') {
    // Generate fully connected grid of 3D boxes
    const generateBoxGrid = () => {
      const boxes = [];
      const cols = 10; // Number of columns
      const rows = 6; // Number of rows
      const boxSize = 90; // Base size for boxes
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const isGreen = (row + col) % 2 === 0;
          const delay = (row * cols + col) * 0.05; // Quick stagger
          const animationDuration = 6 + Math.random() * 2; // 6-8 seconds
          
          // Position boxes to touch each other (no gaps)
          const left = col * (100 / cols); // No spacing between columns
          const top = row * (100 / rows); // No spacing between rows
          
          // Consistent rotation for connected feel
          const rotateX = 15 + Math.random() * 5; // 15-20 degrees
          const rotateY = -2 + Math.random() * 4; // -2 to 2 degrees
          
          boxes.push(
            <div
              key={`box-${row}-${col}`}
              className="absolute transform-gpu"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${boxSize}px`,
                height: `${boxSize}px`,
                background: isGreen 
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.35) 0%, rgba(22, 163, 74, 0.45) 50%, rgba(21, 128, 61, 0.35) 100%)'
                  : 'linear-gradient(135deg, rgba(27, 54, 93, 0.35) 0%, rgba(30, 64, 175, 0.45) 50%, rgba(29, 78, 216, 0.35) 100%)',
                transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                animation: `float3d ${animationDuration}s ease-in-out infinite ${delay}s, rotateZ ${animationDuration * 2}s linear infinite ${delay * 0.3}s`,
                boxShadow: isGreen 
                  ? '0 6px 12px rgba(34, 197, 94, 0.2)'
                  : '0 6px 12px rgba(27, 54, 93, 0.2)',
                opacity: 0.5 + Math.random() * 0.2, // 0.5-0.7 opacity
                zIndex: row + col, // Layer boxes properly
                border: isGreen 
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : '1px solid rgba(27, 54, 93, 0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent rounded-sm"></div>
              
              {/* Vertical connection to box below */}
              {row < rows - 1 && (
                <div
                  className="absolute"
                  style={{
                    bottom: '-1px',
                    left: '0',
                    width: '100%',
                    height: '3px',
                    background: isGreen 
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'rgba(27, 54, 93, 0.3)',
                  }}
                />
              )}
              
              {/* Horizontal connection to box on right */}
              {col < cols - 1 && (
                <div
                  className="absolute"
                  style={{
                    right: '-1px',
                    top: '0',
                    width: '3px',
                    height: '100%',
                    background: isGreen 
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'rgba(27, 54, 93, 0.3)',
                  }}
                />
              )}
            </div>
          );
        }
      }
      return boxes;
    };

    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
        {/* Animated gradient background - thick blue like logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-logoBlue via-logoBlue to-primary" />
        
        {/* 3D Boxes Grid */}
        <div className="absolute inset-0">
          {generateBoxGrid()}
        </div>
        
        {/* Additional Floating Elements for More Depth - very subtle */}
        <div className="absolute inset-0">
          {/* Large accent circles - much more subtle */}
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-logoGreen/5 rounded-full 
                          animate-pulse opacity-30"
               style={{ animationDuration: '8s' }} />
          
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-logoBlue/5 rounded-full 
                          animate-pulse opacity-30"
               style={{ animationDuration: '6s', animationDelay: '2s' }} />
          
          {/* Medium accent circles */}
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-logoGreen/8 rounded-full 
                          animate-pulse opacity-25"
               style={{ animationDuration: '7s', animationDelay: '1s' }} />
        </div>
        
        {/* Animated grid overlay - very subtle */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dashboard-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1.5" fill="#22C55E" opacity="0.3">
                  <animate attributeName="r" values="1;2.5;1" dur="5s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="25" r="1" fill="#1B365D" opacity="0.2">
                  <animate attributeName="opacity" values="0.1;0.4;0.1" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle cx="75" cy="25" r="0.8" fill="#22C55E" opacity="0.2">
                  <animate attributeName="r" values="0.5;1.5;0.5" dur="7s" repeatCount="indefinite" />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dashboard-grid)" />
          </svg>
        </div>
        
        {/* Flowing waves animation - very subtle */}
        <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden opacity-30">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C200,80 400,40 600,60 C800,80 1000,40 1200,60 L1200,120 L0,120 Z" 
                  fill="rgba(34, 197, 94, 0.08)">
              <animate attributeName="d" 
                       values="M0,60 C200,80 400,40 600,60 C800,80 1000,40 1200,60 L1200,120 L0,120 Z;
                               M0,40 C200,60 400,80 600,40 C800,60 1000,80 1200,40 L1200,120 L0,120 Z;
                               M0,60 C200,80 400,40 600,60 C800,80 1000,40 1200,60 L1200,120 L0,120 Z"
                       dur="10s" 
                       repeatCount="indefinite" />
            </path>
            <path d="M0,80 C300,60 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z" 
                  fill="rgba(27, 54, 93, 0.06)">
              <animate attributeName="d" 
                       values="M0,80 C300,60 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z;
                               M0,100 C300,80 600,60 900,100 C1000,90 1100,70 1200,100 L1200,120 L0,120 Z;
                               M0,80 C300,60 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z"
                       dur="8s" 
                       repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        
        {/* Minimal overlay for text readability - balanced */}
        <div className="absolute inset-0 bg-black/12" />
        
        {/* Very subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-logoBlue/5 via-transparent to-logoGreen/5" />
        
        {/* CSS animations for 3D boxes */}
        <style>{`
          @keyframes float3d {
            0%, 100% { 
              transform: perspective(800px) rotateX(15deg) rotateY(0deg) translateY(0px);
            }
            50% { 
              transform: perspective(800px) rotateX(15deg) rotateY(0deg) translateY(-10px);
            }
          }
          
          @keyframes rotateZ {
            0% { 
              transform: perspective(800px) rotateX(15deg) rotateY(0deg) rotateZ(0deg);
            }
            25% { 
              transform: perspective(800px) rotateX(15deg) rotateY(0deg) rotateZ(90deg);
            }
            50% { 
              transform: perspective(800px) rotateX(15deg) rotateY(0deg) rotateZ(180deg);
            }
            75% { 
              transform: perspective(800px) rotateX(15deg) rotateY(0deg) rotateZ(270deg);
            }
            100% { 
              transform: perspective(800px) rotateX(15deg) rotateY(0deg) rotateZ(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Determine which video to use based on variant (for non-dashboard variants)
  const videoSrc = 
    variant === 'homepage' ? '/anime.mp4' :
    '/anime2.mp4';

  // Video background for all other pages and variants
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center',
          minWidth: '100%',
          minHeight: '100%'
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-logoBlue/20 via-transparent to-logoBlue/10" />
    </div>
  );
};

export default HeroBackground; 