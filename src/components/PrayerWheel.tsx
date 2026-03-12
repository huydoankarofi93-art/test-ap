import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { RotateCcw, X, Sun, Wind, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MANTRA_VN = "ÚM MA NI BÁT NI HỒNG";
const SANSKRIT_CHARS = ['ॐ', 'म', 'णि', 'प', 'द्मे', 'हूँ'];

export const PrayerWheel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const controls = useAnimation();
  const lastRotation = useRef(0);
  
  const handleSpin = async (customRotation?: number) => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIntensity(1);
    
    const rotationAmount = customRotation !== undefined ? customRotation : 3600;
    const targetRotation = lastRotation.current + rotationAmount;
    const duration = customRotation !== undefined ? Math.max(1.5, Math.abs(customRotation) / 800) : 5;
    
    await Promise.all([
      controls.start({
        rotateY: targetRotation,
        transition: { 
          duration: duration,
          ease: [0.1, 0.4, 0.2, 1],
        }
      }),
      new Promise(resolve => {
        let currentIntensity = 1;
        const step = 1 / (duration * 20);
        const fadeInterval = setInterval(() => {
          currentIntensity -= step;
          setIntensity(Math.max(0, currentIntensity));
          if (currentIntensity <= 0) {
            clearInterval(fadeInterval);
            setIntensity(0);
            resolve(null);
          }
        }, 50);
      })
    ]);
    
    lastRotation.current = targetRotation;
    setSpinCount(prev => prev + 1);
    setIsSpinning(false);
  };

  const handlePan = (_: any, info: any) => {
    if (isSpinning) return;
    const delta = info.delta.x;
    lastRotation.current += delta * 0.5;
    controls.set({ rotateY: lastRotation.current });
    if (intensity < 0.2) setIntensity(0.2);
  };

  const handlePanEnd = (_: any, info: any) => {
    if (isSpinning) return;
    const velocity = info.velocity.x;
    if (Math.abs(velocity) > 150) {
      handleSpin(velocity * 2);
    } else {
      setIntensity(0);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSpinCount(0);
      lastRotation.current = 0;
      setIntensity(0);
      controls.set({ rotateY: 0 });
    }
  }, [isOpen, controls]);

  if (!isOpen) return null;

  const Jewel = ({ color = 'turquoise' }: { color?: 'turquoise' | 'red' }) => (
    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-lg border border-white/40 ${
      color === 'turquoise' ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
    }`} style={{
      backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), transparent 70%)`
    }} />
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Immersive Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(93,46,29,0.25),transparent_80%)]" />
        
        {/* Sacred Geometry Mandala Background */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] h-[150vh] opacity-[0.03] border-[1px] border-gold rounded-full flex items-center justify-center"
        >
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute inset-0 border border-gold/50 rounded-full" 
              style={{ transform: `scale(${0.2 + i * 0.1}) rotate(${i * 15}deg)` }} 
            />
          ))}
        </motion.div>

        {/* Floating Golden Embers */}
        {[...Array(window.innerWidth < 768 ? 10 : 30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "110%",
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 0.4, 0],
              x: (Math.random() * 100) + (Math.sin(i) * 10) + "%"
            }}
            transition={{ 
              duration: 10 + Math.random() * 15, 
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-gold rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 lg:-top-8 lg:-right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all z-50 border border-white/10 group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* 3D Wheel Assembly Section */}
        <div className="relative flex-1 flex flex-col items-center justify-center perspective-[3000px] [--halo-radius:-180px] md:[--halo-radius:-260px]">
          
          {/* Sacred Sanskrit Halo - Dynamic feedback */}
          <motion.div 
            animate={{ 
              rotate: isSpinning ? 360 : 0,
              scale: isSpinning ? 1.1 : 1,
              opacity: isSpinning ? 0.8 : 0.15
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.8, ease: "easeOut" },
              opacity: { duration: 0.8 }
            }}
            className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] pointer-events-none z-0 flex items-center justify-center"
          >
            {[...Array(18)].map((_, i) => (
              <div 
                key={i}
                className="absolute text-gold/60 font-serif text-2xl md:text-4xl drop-shadow-[0_0_20px_rgba(166,124,82,0.4)]"
                style={{ 
                  transform: `rotate(${i * 20}deg) translateY(var(--halo-radius, -180px))` 
                }}
              >
                {SANSKRIT_CHARS[i % SANSKRIT_CHARS.length]}
              </div>
            ))}
            {/* Concentric Energy Rings */}
            <div className="absolute inset-0 border-[0.5px] border-gold/10 rounded-full m-12 md:m-20 animate-spin-slow" />
            <div className="absolute inset-0 border-[0.5px] border-gold/5 rounded-full m-24 md:m-36 animate-reverse-spin-slow" />
          </motion.div>

          {/* Title & Spiritual Context */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-32 text-center space-y-2"
          >
            <h2 className="text-2xl md:text-4xl font-display font-black text-white tracking-[-0.02em] uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              Kinh Luân <span className="gold-gradient-text italic font-serif lowercase">pháp bảo</span>
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[0.5px] w-10 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <p className="text-[7px] md:text-[9px] text-gold/60 uppercase tracking-[0.4em] font-bold">
                Xoay chuyển luân hồi • Tích lũy công đức
              </p>
              <div className="h-[0.5px] w-10 bg-gradient-to-l from-transparent via-gold/50 to-transparent" />
            </div>
          </motion.div>

          {/* The 3D Wheel Structure */}
          <div className="relative preserve-3d flex flex-col items-center">
            
            {/* 1. Stupa-style Top (Static) */}
            <div className="relative z-30 flex flex-col items-center -mb-6">
              {/* Golden Spire */}
              <div className="w-1 h-12 bg-gold/80 blur-[0.5px]" />
              <div className="w-6 h-10 bg-gradient-to-b from-gold via-copper to-gold rounded-full shadow-2xl -mt-2" />
              
              {/* Ornate Dome */}
              <div className="relative w-40 h-20 md:w-56 md:h-28 bg-gradient-to-b from-gold via-copper to-accent rounded-t-[3rem] border-b-4 border-gold/40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center justify-end pb-3">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                {/* Jewels on Dome */}
                <div className="flex gap-4 mb-3">
                  <Jewel color="turquoise" />
                  <Jewel color="red" />
                  <Jewel color="turquoise" />
                </div>
                {/* Engraved Rim */}
                <div className="w-full h-8 bg-gold/90 border-t border-white/20 flex items-center justify-around px-4">
                   {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-1 bg-accent/40 rounded-full" />)}
                </div>
              </div>
              
              {/* Dome Base Ring */}
              <div className="w-48 h-8 md:w-64 md:h-10 bg-gradient-to-b from-gold to-accent rounded-lg shadow-2xl border-x-4 border-gold/30 flex items-center justify-around px-6 -mt-1">
                {[...Array(10)].map((_, i) => <div key={i} className="w-2 h-2 bg-red-700 rounded-full border border-gold/40 shadow-inner" />)}
              </div>
            </div>

            {/* 2. Main Spinning Body (Cylinder) */}
            <motion.div
              animate={controls}
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              onTap={() => handleSpin()}
              className="relative z-20 w-40 h-72 md:w-56 md:h-[400px] cursor-grab active:cursor-grabbing preserve-3d group"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Dynamic Aura Glow */}
              <AnimatePresence>
                {isSpinning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.5, 0.3], scale: [0.8, 1.1, 1] }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-[-40px] inset-y-[-20px] bg-gold/15 blur-[60px] rounded-full z-0 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Cylinder Panels (12-sided) */}
              <div className="absolute inset-0 preserve-3d flex items-center justify-center">
                {[...Array(12)].map((_, i) => {
                  const panelWidth = 58;
                  const radius = (panelWidth / 2) / Math.tan(Math.PI / 12);
                  return (
                    <div
                      key={i}
                      className="absolute h-full border-x border-gold/10 flex flex-col"
                      style={{
                        width: `${panelWidth}px`,
                        transform: `rotateY(${i * 30}deg) translateZ(${radius}px)`,
                        backfaceVisibility: 'visible',
                        backgroundColor: '#4A0E0E', // Deep Sangria/Wood
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), transparent, rgba(0,0,0,0.4))`
                      }}
                    >
                      {/* Top Decorative Band */}
                      <div className="h-10 border-b border-gold/20 bg-gradient-to-b from-gold/30 to-transparent flex flex-col items-center justify-center gap-1">
                        <span className="text-[8px] text-gold/50 font-serif">{SANSKRIT_CHARS[(i + 1) % 6]}</span>
                        <Jewel color="turquoise" />
                      </div>
                      
                      {/* Central Mantra Panel */}
                      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/exclusive-paper.png')]" />
                        <motion.span 
                          animate={isSpinning ? { 
                            textShadow: ["0 0 10px rgba(166,124,82,0.5)", "0 0 30px rgba(166,124,82,1)", "0 0 10px rgba(166,124,82,0.5)"] 
                          } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-gold font-serif font-bold text-4xl md:text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] select-none"
                        >
                          {SANSKRIT_CHARS[i % SANSKRIT_CHARS.length]}
                        </motion.span>
                      </div>

                      {/* Bottom Decorative Band */}
                      <div className="h-10 border-t border-gold/20 bg-gradient-to-t from-gold/30 to-transparent flex flex-col items-center justify-center gap-1">
                        <Jewel color="turquoise" />
                        <span className="text-[8px] text-gold/50 font-serif">{SANSKRIT_CHARS[(i + 3) % 6]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Structural Reinforcement Rings */}
              <div className="absolute inset-0 pointer-events-none preserve-3d">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[108%] h-4 bg-gradient-to-b from-gold via-white/30 to-gold rounded-full border border-gold/40 shadow-xl" style={{ transform: 'translateZ(2px)' }} />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[108%] h-4 bg-gradient-to-b from-gold via-white/30 to-gold rounded-full border border-gold/40 shadow-xl" style={{ transform: 'translateZ(2px)' }} />
              </div>

              {/* Light Reflection Streak */}
              <motion.div 
                animate={isSpinning ? { x: ['-150%', '250%'] } : {}}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-20"
              />
            </motion.div>

            {/* Emitted Spiritual Particles */}
            <AnimatePresence>
              {isSpinning && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(window.innerWidth < 768 ? 4 : 12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.5, 2.5],
                        x: (i % 2 === 0 ? 1 : -1) * (200 + Math.random() * 300),
                        y: (Math.random() - 0.5) * 600,
                        rotate: 1080
                      }}
                      transition={{ duration: 2, delay: i * 0.1, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 text-gold font-serif text-4xl md:text-6xl drop-shadow-[0_0_25px_rgba(212,175,55,0.8)]"
                    >
                      {SANSKRIT_CHARS[i % 6]}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* 3. Ornate Lotus Pedestal (Static) */}
            <div className="relative z-30 flex flex-col items-center -mt-8">
              
              {/* Upper Lotus Tier (Downward) */}
              <div className="relative flex items-center justify-center w-48 h-12 md:w-64 md:h-16">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-10 h-16 md:w-16 md:h-20 bg-gradient-to-b from-gold via-copper to-accent border-x border-gold/30 shadow-2xl"
                    style={{ 
                      transform: `rotate(${i * 30}deg) translateY(8px) perspective(800px) rotateX(50deg)`,
                      borderRadius: '0 0 60% 60%',
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                    }} 
                  />
                ))}
              </div>

              {/* Central Jeweled Foundation */}
              <div className="relative z-40 w-56 h-12 md:w-72 md:h-16 bg-gradient-to-b from-gold via-copper to-accent border-y-2 border-gold/50 shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex items-center justify-around px-6 -mt-3">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <Jewel color="red" />
                <Jewel color="turquoise" />
                <Jewel color="red" />
              </div>

              {/* Lower Lotus Tier (Upward) */}
              <div className="relative z-30 flex items-center justify-center w-64 h-16 md:w-80 md:h-24 -mt-3">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-16 h-20 md:w-24 md:h-32 bg-gradient-to-t from-gold via-copper to-white/10 border-x border-gold/40 shadow-2xl"
                    style={{ 
                      transform: `rotate(${i * 36}deg) translateY(20px) perspective(800px) rotateX(-35deg)`,
                      borderRadius: '60% 60% 0 0',
                      clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)'
                    }} 
                  >
                    <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-white/30 -translate-x-1/2" />
                  </div>
                ))}
              </div>

              {/* Solid Base Foundation with Bagua Pattern */}
              <div className="relative z-50 w-72 h-10 md:w-96 md:h-12 bg-gradient-to-b from-accent via-gold to-accent rounded-[2rem] border-t-2 border-white/30 shadow-[0_15px_60px_rgba(0,0,0,0.9)] flex items-center justify-center -mt-6 overflow-hidden">
                {/* Subtle Bagua Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    {[...Array(8)].map((_, i) => (
                      <g key={i} transform={`rotate(${i * 45} 50 50)`}>
                        <rect x="48" y="5" width="4" height="1" fill="currentColor" />
                        <rect x="48" y="7" width="4" height="1" fill="currentColor" />
                        <rect x="48" y="9" width="4" height="1" fill="currentColor" />
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="w-[96%] h-2/3 border border-gold/40 rounded-full opacity-40" />
              </div>
            </div>

          </div>

          {/* Merit Accumulation UI */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-white/[0.03] backdrop-blur-2xl rounded-[1.5rem] border border-white/10 flex flex-col items-center shadow-2xl"
            >
              <span className="text-gold/40 text-[7px] font-bold uppercase tracking-[0.4em] mb-1">Công Đức Tích Lũy</span>
              <div className="flex items-baseline gap-2">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={spinCount}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-2xl md:text-3xl font-serif font-bold text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                  >
                    {spinCount.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
                <span className="text-gold/30 text-[8px] font-serif italic tracking-widest uppercase">vòng xoay</span>
              </div>
            </motion.div>
            <div className="flex items-center gap-2 text-white/20">
              <div className="h-px w-4 bg-white/10" />
              <p className="text-[9px] italic font-serif tracking-widest">"Tâm tịnh, luân chuyển, vạn sự hanh thông"</p>
              <div className="h-px w-4 bg-white/10" />
            </div>
          </div>
        </div>

        {/* Right Side Informational Panel */}
        <div className="w-full lg:w-[320px] space-y-6 relative z-20">
          <div className="glass-panel p-8 space-y-8 border-gold/20">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gold">
                <div className="p-2 bg-gold/10 rounded-xl border border-gold/20">
                  <Sun size={20} />
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-[0.2em]">Pháp Bảo Kinh Luân</h3>
              </div>
              <p className="text-xs text-white/60 font-serif italic leading-relaxed text-justify">
                Kinh luân chứa đựng hàng triệu biến chân ngôn Lục Tự Đại Minh. Mỗi vòng xoay tương ứng với việc trì tụng bấy nhiêu lần chân ngôn, mang lại phước báu vô lượng.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Kim", icon: "◈", color: "text-white" },
                { label: "Mộc", icon: "◈", color: "text-emerald-400" },
                { label: "Thủy", icon: "◈", color: "text-blue-400" },
                { label: "Hỏa", icon: "◈", color: "text-red-400" },
                { label: "Thổ", icon: "◈", color: "text-amber-600" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white/[0.02] rounded-xl border border-white/5 flex items-center gap-2 group hover:border-gold/30 transition-colors">
                  <span className={`${item.color} text-[10px] group-hover:scale-125 transition-transform`}>{item.icon}</span>
                  <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSpin()}
              disabled={isSpinning}
              className="w-full group relative py-4 rounded-[1.5rem] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 animate-gradient-x" />
              <div className="relative flex items-center justify-center gap-3 text-gold font-bold uppercase tracking-[0.3em] text-[10px]">
                <RotateCcw size={14} className={isSpinning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'} />
                {isSpinning ? 'Đang Khởi Tâm...' : 'Xoay Kinh Luân'}
              </div>
            </button>
          </div>

          {/* Bottom Mantra Display */}
          <div className="text-center px-4">
            <motion.div 
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [0.98, 1, 0.98]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-xl md:text-2xl font-serif text-gold/30 tracking-[0.5em] uppercase"
            >
              {MANTRA_VN}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


