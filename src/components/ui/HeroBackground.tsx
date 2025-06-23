import React, { useRef, useEffect } from 'react';

interface HeroBackgroundProps {
  variant?: string;
}

/**
 * More visible, vibrant animated SVG/CSS background for the homepage hero section.
 * Blobs are above the overlay, with a subtle animated grid for a legal-tech vibe.
 */
const HeroBackground: React.FC<HeroBackgroundProps> = ({ variant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Set playback rate to 56% (20% slower than previous 0.7 rate) for all variants
      videoRef.current.playbackRate = 0.56;
    }
  }, []);

  // Determine which video to use based on variant
  const videoSrc = variant === 'homepage' ? '/src/assets/anime.mp4' : '/src/assets/anime2.mp4';

  // Video background for all pages and variants
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
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