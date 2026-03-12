import React, { useState, useEffect } from 'react';

export const SpiritualClock = React.memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const getCanChiHour = (hour: number) => {
    const hours = [
      'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 
      'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'
    ];
    const index = Math.floor(((hour + 1) % 24) / 2);
    return hours[index];
  };

  return (
    <div className="relative py-16 flex flex-col items-center justify-center overflow-hidden">
      {/* Ancient Prayer Wheel Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer Wheel */}
        <div className="absolute w-80 h-80 rounded-full border border-gold/20 md:animate-spin-slow" />
        <div className="absolute w-[19rem] h-[19rem] rounded-full border-2 border-dashed border-gold/10 md:animate-reverse-spin-slow" />
        
        {/* Decorative Bronze Ring */}
        <div className="absolute w-64 h-64 rounded-full border-[12px] border-gold/5 shadow-[inset_0_0_50px_rgba(166,124,82,0.1)]" />
        
        {/* Patina Accents */}
        <div className="absolute w-72 h-72 rounded-full border border-patina/20 blur-sm hidden md:block" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-6 opacity-80">
          Giờ {getCanChiHour(time.getHours())} • Khắc Hiện Tại
        </div>
        
        <div className="flex items-baseline gap-2 md:gap-4">
          <div className="text-6xl sm:text-8xl md:text-9xl font-serif font-black text-copper tracking-tighter drop-shadow-[0_0_30px_rgba(205,127,50,0.3)]">
            {formatNumber(time.getHours())}
          </div>
          
          <div className="text-4xl md:text-7xl font-serif text-gold/30 animate-pulse">
            :
          </div>
          
          <div className="text-6xl sm:text-8xl md:text-9xl font-serif font-black text-copper tracking-tighter drop-shadow-[0_0_30px_rgba(205,127,50,0.3)]">
            {formatNumber(time.getMinutes())}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1">
          <div className="text-sm font-serif italic text-ink/50 tracking-wide">
            {time.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-4" />
        </div>
      </div>

      {/* Pulsing bronze aura */}
      <div className="absolute w-64 h-64 bg-gold/10 rounded-full blur-[100px] -z-10 opacity-20 animate-pulse" />
    </div>
  );
});
