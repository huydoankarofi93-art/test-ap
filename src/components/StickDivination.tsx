import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { HEXAGRAMS } from '../constants/iching';

interface Props {
  onResult: (stickNumber: number) => void;
  isCasting: boolean;
  setIsCasting: (casting: boolean) => void;
}

const HAN_NOM_CHARS = ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌', '福', '祿', '壽', '德', '智', '信', '義', '禮', '仁', '和'];

export const StickDivination: React.FC<Props> = ({ onResult, isCasting, setIsCasting }) => {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [isFalling, setIsFalling] = useState(false);
  const [showRevelation, setShowRevelation] = useState(false);
  const [isFadingToBlack, setIsFadingToBlack] = useState(false);

  const hexagram = result ? HEXAGRAMS[result] : null;

  useEffect(() => {
    if (isCasting) {
      setProgress(0);
      setResult(null);
      setIsFalling(false);
      setShowRevelation(false);
      
      const duration = 6000; // 6 seconds of shaking
      const interval = 50;
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setProgress((currentStep / steps) * 100);
        
        if (currentStep >= steps) {
          clearInterval(timer);
          
          const finalStick = Math.floor(Math.random() * 64) + 1;
          setResult(finalStick);
          setIsFalling(true);
          
          // Start gradual darkening
          setTimeout(() => {
            setIsFadingToBlack(true);
          }, 1500); // Give more time to see the stick fall

          // Show black screen revelation after darkening
          setTimeout(() => {
            setIsFadingToBlack(false);
            setShowRevelation(true);
          }, 3000);

          // Delay finalization
          setTimeout(() => {
            setIsFalling(false);
          }, 3500);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isCasting]);

  const handleFinalize = () => {
    if (result) {
      onResult(result);
      setIsCasting(false);
      setShowRevelation(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 2xl:py-32 space-y-16 2xl:space-y-32 relative overflow-hidden min-h-[600px] 2xl:min-h-[800px]">
      {/* Ancient Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] 2xl:w-[1200px] h-[800px] 2xl:h-[1200px] bg-accent/5 blur-[120px] rounded-full opacity-30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] 2xl:w-[1000px] h-[600px] 2xl:h-[1000px] bg-gold/5 blur-[100px] rounded-full opacity-20" />
      </div>

      <div className="relative w-full max-w-[320px] 2xl:max-w-[500px] h-72 sm:h-96 2xl:h-[30rem] flex items-center justify-center mx-auto">
        {/* The Bamboo Stick Holder (Ống Xăm) - Ancient Wood Style */}
        <div className="relative group">
          {/* Spiritual Aura around the holder */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gold/20 blur-[60px] rounded-full -z-10"
          />
          
          <motion.div 
            animate={isCasting ? {
              rotate: [0, -12, 12, -12, 12, 0],
              x: [0, -6, 6, -6, 6, 0],
              y: [0, -3, 3, -3, 3, 0],
              scale: [1, 1.05, 0.95, 1.05, 1]
            } : {}}
            transition={isCasting ? {
              duration: 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            } : {
              type: "spring", stiffness: 100, damping: 15
            }}
            className="relative z-20 w-28 h-44 sm:w-36 sm:h-56 2xl:w-48 2xl:h-72 bg-gradient-to-b from-[#3a2a1a] to-[#1a0a05] rounded-t-xl rounded-b-[3rem] border-2 border-gold/30 shadow-[0_40px_80px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden"
          >
            {/* Wood Texture Overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
            
            {/* Ancient Golden Bands with Engravings */}
            <div className="absolute top-8 2xl:top-12 left-0 right-0 h-4 2xl:h-6 bg-gradient-to-r from-gold/40 via-gold to-gold/40 border-y border-gold/30 shadow-[0_0_15px_rgba(166,124,82,0.3)]">
              <div className="absolute inset-0 flex items-center justify-around opacity-30">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[6px] 2xl:text-[8px]">卍</span>)}
              </div>
            </div>
            <div className="absolute bottom-12 2xl:bottom-16 left-0 right-0 h-6 2xl:h-8 bg-gradient-to-r from-gold/40 via-gold to-gold/40 border-y border-gold/30 shadow-[0_0_20px_rgba(166,124,82,0.4)]">
              <div className="absolute inset-0 flex items-center justify-around opacity-30">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[8px] 2xl:text-[10px]">☯</span>)}
              </div>
            </div>

          {/* Vertical Text - Ancient Style */}
          <div className="relative z-10 flex flex-col items-center gap-2 2xl:gap-4">
            <div className="text-gold/60 font-serif font-bold text-xl 2xl:text-3xl tracking-[0.5em] vertical-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              THIÊN CƠ
            </div>
            <div className="text-gold/40 font-serif text-lg 2xl:text-2xl">
              {HAN_NOM_CHARS[0]}
            </div>
          </div>

          {/* The sticks inside (static bundle) */}
          <div className="absolute -top-12 sm:-top-16 2xl:-top-24 left-1/2 -translate-x-1/2 flex gap-0.5 2xl:gap-1">
            {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 24)].map((_, i) => (
              <motion.div
                key={i}
                animate={isCasting ? {
                  y: [0, -12, 0],
                  rotate: [i * 2 - (window.innerWidth < 768 ? 12 : 24), i * 2 - (window.innerWidth < 768 ? 16 : 28), i * 2 - (window.innerWidth < 768 ? 8 : 20), i * 2 - (window.innerWidth < 768 ? 12 : 24)]
                } : {}}
                transition={{
                  duration: 0.35,
                  repeat: Infinity,
                  delay: i * 0.01,
                  ease: "easeInOut"
                }}
                style={{ 
                  transform: `rotate(${i * 2 - (window.innerWidth < 768 ? 12 : 24)}deg)`,
                  backgroundColor: i % 4 === 0 ? '#d4af37' : i % 3 === 0 ? '#8b4513' : i % 2 === 0 ? '#a0522d' : '#5d4037'
                }}
                className="w-1 h-32 sm:w-1.5 sm:h-40 2xl:w-2 2xl:h-56 rounded-full border border-black/30 opacity-90 flex items-start justify-center pt-4 shadow-sm"
              >
                <span className="text-[6px] 2xl:text-[8px] font-serif text-black/60 select-none font-bold">
                  {HAN_NOM_CHARS[i % HAN_NOM_CHARS.length]}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

        {/* The falling stick animation */}
        <AnimatePresence>
          {isFalling && result && !isCasting && (
            <>
              <motion.div
                initial={{ y: -100, opacity: 0, rotate: -10, x: -20 }}
                animate={{ 
                  y: [null, 120, 200, 240],
                  x: [-20, 10, -5, 0],
                  opacity: [0, 1, 1, 1],
                  rotate: [-10, 20, 45, 60],
                }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ 
                  duration: window.innerWidth < 768 ? 1.5 : 2.2,
                  times: [0, 0.4, 0.8, 1],
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="absolute z-30 w-3 h-40 sm:w-4 sm:h-52 2xl:w-6 2xl:h-72 bg-gradient-to-b from-[#d4af37] via-[#b8860b] to-[#5d4037] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-start py-6 border border-gold/20"
              >
                <div className="w-full h-full absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10" />
                  <div className="absolute top-0 left-0 right-0 h-1/4 bg-white/10" />
                </div>
                <span className="relative z-10 text-[8px] 2xl:text-[10px] font-serif font-bold text-black/60 vertical-text">
                  {HAN_NOM_CHARS[result % HAN_NOM_CHARS.length]}
                </span>
              </motion.div>

              {/* Subtle Revelation Light */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  scale: [0.8, 1.5, 2],
                }}
                transition={{ 
                  duration: 2,
                  ease: "easeOut",
                  delay: 0.6
                }}
                className="absolute z-20 w-40 h-40 bg-gold/20 blur-[60px] rounded-full pointer-events-none"
              />
            </>
          )}
        </AnimatePresence>

        {/* Ritual Smoke/Mist Effect */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-40 pointer-events-none hidden md:block">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, -100],
                x: [0, i % 2 === 0 ? 30 : -30],
                opacity: [0, 0.2, 0],
                scale: [1, 2]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear"
              }}
              className="absolute bottom-0 left-1/2 w-20 h-20 bg-white/5 blur-3xl rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg space-y-8 relative z-40">
        {isCasting ? (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="animate-spin text-gold" size={32} />
                <div className="absolute inset-0 blur-lg bg-gold/20 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-serif font-bold text-gold uppercase tracking-[0.4em]">Đang Kết Nối Thiên Cơ</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Tâm tĩnh khí hòa...</div>
              </div>
            </div>
            
            <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-transparent via-gold to-transparent"
              />
            </div>
            
            <motion.p 
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-xs text-white/40 italic font-serif"
            >
              "Lòng thành cảm ứng, quẻ ứng lòng người."
            </motion.p>
          </div>
        ) : (
          <div className="text-center space-y-10">
            <div className="space-y-4">
              <h4 className="text-xl font-serif font-bold text-white/80 tracking-widest uppercase">Nghi Thức Gieo Thẻ</h4>
              <p className="text-xs text-white/30 font-serif italic max-w-xs mx-auto leading-relaxed">
                "Tĩnh tâm, nhắm mắt, nghĩ về điều cần hỏi. Khi tâm đã tịnh, hãy nhấn bắt đầu. Lắc ống thẻ cho đến khi có một thẻ rơi ra."
              </p>
            </div>
            
            <button
              onClick={() => setIsCasting(true)}
              className="relative group p-1 rounded-full overflow-hidden transition-all duration-700 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold/40 via-gold to-gold/40 animate-gradient-x" />
              <div className="relative px-12 py-6 bg-black rounded-full flex items-center justify-center gap-4 text-gold border border-gold/20 group-hover:bg-gold/5 transition-colors">
                <Sparkles className="group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-[0.4em]">Bắt Đầu Gieo Thẻ</span>
              </div>
            </button>
            
            <div className="flex items-center justify-center gap-6 opacity-20">
              <div className="w-12 h-px bg-gold" />
              <div className="w-2 h-2 rounded-full bg-gold" />
              <div className="w-12 h-px bg-gold" />
            </div>
          </div>
        )}
      </div>

      {/* Gradual Darkening Overlay */}
      <AnimatePresence>
        {isFadingToBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Solemn Black Screen Revelation Overlay */}
      <AnimatePresence>
        {showRevelation && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-gold/5 rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/10 rounded-full animate-pulse delay-700" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/20 rounded-full animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 text-center space-y-16 max-w-2xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="space-y-4"
              >
                <div className="text-gold/40 font-serif text-sm uppercase tracking-[0.6em]">Thiên Cơ Hiển Lộ</div>
                <div className="text-gold/20 font-serif text-2xl tracking-widest">心誠則應</div>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto" />
              </motion.div>

              <div className="relative py-20">
                {/* The Revelation Glow */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 blur-[100px] rounded-full"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ delay: 2, duration: 2.5, ease: "easeOut" }}
                  className="relative space-y-8"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-8xl md:text-9xl font-serif font-bold gold-gradient-text drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                      {result}
                    </div>
                    
                    {/* Tướng Tinh Badge in Revelation */}
                    {hexagram?.tuongTinh && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3, duration: 1 }}
                        className="flex items-center gap-3 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm"
                      >
                        <span className="text-2xl font-serif text-gold">{hexagram.tuongTinh.char}</span>
                        <span className="text-[10px] text-gold/60 uppercase tracking-[0.2em] font-bold">Tướng Tinh: {hexagram.tuongTinh.animal}</span>
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5, duration: 1.5 }}
                    className="space-y-4"
                  >
                    <div className="text-2xl md:text-4xl font-serif font-bold text-white tracking-widest uppercase">
                      {hexagram?.name}
                    </div>
                    <div className="text-lg md:text-xl text-gold/80 font-serif italic">
                      "{hexagram?.meaning}"
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 1 }}
                className="pt-12"
              >
                <button
                  onClick={handleFinalize}
                  className="group relative px-16 py-5 rounded-full overflow-hidden transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gold/20 backdrop-blur-md border border-gold/40" />
                  <div className="relative flex items-center gap-4 text-gold font-bold uppercase tracking-[0.4em] text-xs">
                    <Plus size={18} />
                    <span>Tiếp Tục Luận Giải</span>
                  </div>
                </button>
              </motion.div>
            </div>

            {/* Floating Hán Nôm Characters in Revelation Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {HAN_NOM_CHARS.slice(0, 10).map((char, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [null, Math.random() * -100],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 10 + Math.random() * 10, 
                    repeat: Infinity,
                    delay: i * 2
                  }}
                  className="absolute text-4xl font-serif text-gold"
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
