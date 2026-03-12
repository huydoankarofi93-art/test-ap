import React from 'react';
import { motion } from 'motion/react';

export const SacredBackground = ({ lowPerf = false }: { lowPerf?: boolean }) => {
  const sanskritChars = ['ॐ', 'न', 'म', 'श्चิ', 'वा', 'य', 'बु', 'द्ध', 'ध', 'र्म', 'सं', 'घ', 'ह्रीं', 'श्रीं', 'क्लीं', 'ऐं'];
  const fengShuiSymbols = ['☯', '☸', '✧', '◈', '◇', '◆'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-paper">
      {/* Deep Background Gradient - Feng Shui Elemental Balance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(93,46,29,0.15)_0%,transparent_80%)]" />
      {!lowPerf && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(27,48,34,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(166,124,82,0.1)_0%,transparent_50%)]" />
        </>
      )}
      {/* Sacred Mandala / Buddha Silhouette */}
      <motion.div 
        animate={lowPerf ? { opacity: 0.04 } : { 
          scale: [1, 1.02, 1],
          opacity: [0.03, 0.06, 0.03]
        }}
        transition={lowPerf ? {} : { duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0"
      >
        {!lowPerf && <div className="absolute inset-0 bg-gold/10 blur-[120px] rounded-full" />}
        
        {/* Intricate Mandala SVG */}
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gold relative z-10">
          <defs>
            <radialGradient id="mandala-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          
          {/* Concentric Sacred Rings */}
          {[...Array(lowPerf ? 3 : 6)].map((_, i) => (
            <circle 
              key={i} 
              cx="100" cy="100" r={30 + i * 15} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.2" 
              strokeDasharray={i % 2 === 0 ? "1 3" : "none"}
              className="opacity-40"
            />
          ))}

          {/* Buddha Figure (Stylized) */}
          <g className="opacity-60">
            <path 
              fill="currentColor" 
              d="M100,40 C110,40 118,48 118,60 C118,72 110,80 100,80 C90,80 82,72 82,60 C82,48 90,40 100,40 Z" 
            />
            <path 
              fill="currentColor" 
              d="M100,85 C130,85 155,110 155,145 L155,175 L45,175 L45,145 C45,110 70,85 100,85 Z" 
            />
            {/* Lotus Base */}
            <path 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.8"
              d="M60,175 Q100,160 140,175 M50,182 Q100,167 150,182 M40,189 Q100,174 160,189" 
            />
          </g>

          {/* Rotating Mandala Petals */}
          <motion.g
            animate={lowPerf ? { rotate: 0 } : { rotate: 360 }}
            transition={lowPerf ? {} : { duration: 100, repeat: Infinity, ease: "linear" }}
            style={{ originX: '100px', originY: '100px' }}
          >
            {[...Array(lowPerf ? 6 : 12)].map((_, i) => (
              <path 
                key={i}
                d="M100,20 L105,35 L95,35 Z" 
                fill="currentColor"
                className="opacity-20"
                transform={`rotate(${i * (lowPerf ? 60 : 30)} 100 100)`}
              />
            ))}
          </motion.g>
        </svg>
      </motion.div>

      {/* Flowing Energy (Qi) Particles & Stars */}
      <div className="absolute inset-0">
        {/* Subtle Stars */}
        {!lowPerf && [...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            animate={{ 
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{ 
              left: Math.random() * 100 + '%', 
              top: Math.random() * 100 + '%' 
            }}
          />
        ))}

        {!lowPerf && [...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%', 
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              x: [null, (Math.random() - 0.5) * 200 + 'px'],
              y: [null, (Math.random() - 0.5) * 200 + 'px'],
              opacity: [0, 0.15, 0],
            }}
            transition={{ 
              duration: 15 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute text-gold/30 font-serif text-xl md:text-3xl"
          >
            {i % 2 === 0 ? sanskritChars[i % sanskritChars.length] : fengShuiSymbols[i % fengShuiSymbols.length]}
          </motion.div>
        ))}
      </div>

      {/* Vertical Sacred Rails - Enhanced with Feng Shui Symbols */}
      <div className="absolute left-6 top-0 bottom-0 w-12 flex flex-col items-center justify-around opacity-[0.03] text-gold text-[10px] font-serif writing-mode-vertical">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="py-12 tracking-[1.5em] flex flex-col items-center gap-4">
            <span>☯</span>
            <span>ॐ मणि पद्मे हूँ</span>
          </div>
        ))}
      </div>
      <div className="absolute right-6 top-0 bottom-0 w-12 flex flex-col items-center justify-around opacity-[0.03] text-gold text-[10px] font-serif writing-mode-vertical">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="py-12 tracking-[1.5em] flex flex-col items-center gap-4">
            <span>☸</span>
            <span>नमो बुद्धाय</span>
          </div>
        ))}
      </div>

      {/* Global Vignette & Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(15,10,8,0.8)_90%)]" />
    </div>
  );
};
