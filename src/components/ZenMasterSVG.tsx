import React from 'react';

export const ZenMasterSVG: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background: Soft Zen Landscape */}
      <circle cx="200" cy="200" r="180" fill="#E8F0E6" fillOpacity="0.4" />
      
      {/* Subtle Mountains */}
      <path
        d="M40 300C80 260 120 280 160 300C200 320 240 280 280 260C320 240 360 280 360 300V380H40V300Z"
        fill="#D1D5DB"
        fillOpacity="0.2"
      />
      
      {/* Clouds */}
      <g opacity="0.4">
        <ellipse cx="100" cy="80" rx="30" ry="10" fill="white" />
        <ellipse cx="120" cy="90" rx="25" ry="8" fill="white" />
        <ellipse cx="280" cy="60" rx="35" ry="12" fill="white" />
        <ellipse cx="300" cy="70" rx="20" ry="6" fill="white" />
      </g>

      {/* Lotus Shape behind Master */}
      <path
        d="M200 60C200 60 260 140 200 200C140 140 200 60 200 60Z"
        fill="#D4AF37"
        fillOpacity="0.05"
      />
      
      {/* Lotus Petals at bottom */}
      <path
        d="M100 340C120 320 160 320 180 340C160 360 120 360 100 340Z"
        fill="#D4AF37"
        fillOpacity="0.2"
      />
      <path
        d="M300 340C280 320 240 320 220 340C240 360 280 360 300 340Z"
        fill="#D4AF37"
        fillOpacity="0.2"
      />
      <path
        d="M150 350C170 330 230 330 250 350C230 370 170 370 150 350Z"
        fill="#D4AF37"
        fillOpacity="0.3"
      />

      {/* Zen Master Body (Robes) */}
      <path
        d="M200 140C160 140 100 220 80 320H320C300 220 240 140 200 140Z"
        fill="#4A4A4A"
      />
      <path
        d="M200 140C180 140 140 180 130 240L200 320L270 240C260 180 220 140 200 140Z"
        fill="#333333"
      />
      
      {/* Hands in Dhyana Mudra */}
      <ellipse cx="200" cy="300" rx="40" ry="20" fill="#F5E0C3" />
      <path d="M180 300C180 290 220 290 220 300" stroke="#D4AF37" strokeWidth="1" />

      {/* Head */}
      <circle cx="200" cy="100" r="45" fill="#F5E0C3" />
      
      {/* Face Details (Kind Expression) */}
      {/* Eyes (Closed/Meditating) */}
      <path
        d="M175 105C175 105 180 100 185 105"
        stroke="#5D4037"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M215 105C215 105 220 100 225 105"
        stroke="#5D4037"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Eyebrows (White/Venerable) */}
      <path
        d="M170 95C170 95 180 85 190 95"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M210 95C210 95 220 85 230 95"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Beard (Venerable) */}
      <path
        d="M170 125C170 125 200 160 230 125C220 145 180 145 170 125Z"
        fill="white"
        fillOpacity="0.8"
      />
      
      {/* Smile */}
      <path
        d="M190 120C190 120 200 125 210 120"
        stroke="#5D4037"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Halo / Aura */}
      <circle
        cx="200"
        cy="100"
        r="60"
        stroke="#D4AF37"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
      />
    </svg>
  );
};
