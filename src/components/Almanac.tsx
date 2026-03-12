import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles, 
  Sun, 
  Moon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { Solar, Lunar, HolidayUtil } from 'lunar-typescript';
import { translateGanZhi, translateYiJi, translateJieQi, translateZodiac, translateNaYin } from '../utils/lunar-vn';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AlmanacProps {
  onClose: () => void;
}

const DAYS_OF_WEEK = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const Almanac: React.FC<AlmanacProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: month - 1,
        year: year,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: year,
        isCurrentMonth: false
      });
    }
    
    return days;
  }, [currentDate]);

  const selectedLunar = useMemo(() => {
    const solar = Solar.fromDate(selectedDate);
    return solar.getLunar();
  }, [selectedDate]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (day: number, month: number, year: number) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const getDayDetails = (date: Date) => {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    
    // Hoàng Đạo / Hắc Đạo
    const dayZodiac = translateZodiac(lunar.getDayTianShen()); 
    const dayZodiacType = lunar.getDayTianShenType() === '黄道' ? 'Hoàng Đạo' : 'Hắc Đạo'; 
    
    // Tiết khí
    const jieQi = translateJieQi(lunar.getJieQi());
    
    // Giờ Hoàng Đạo
    const luckyHours = lunar.getTimes().filter(t => t.getTianShenType() === '黄道').map(t => {
      return translateGanZhi(t.getZhi());
    });
    
    // Việc nên làm / Kiêng kỵ
    const yi = lunar.getDayYi().map(translateYiJi);
    const ji = lunar.getDayJi().map(translateYiJi);
    
    return {
      lunarDay: lunar.getDay(),
      lunarMonth: lunar.getMonth(),
      lunarYear: translateGanZhi(lunar.getYearInGanZhi()),
      lunarDayCanChi: translateGanZhi(lunar.getDayInGanZhi()),
      lunarMonthCanChi: translateGanZhi(lunar.getMonthInGanZhi()),
      yearNaYin: translateNaYin(lunar.getYearNaYin()),
      monthNaYin: translateNaYin(lunar.getMonthNaYin()),
      dayNaYin: translateNaYin(lunar.getDayNaYin()),
      zodiac: dayZodiac,
      zodiacType: dayZodiacType,
      jieQi,
      luckyHours,
      yi,
      ji
    };
  };

  const details = getDayDetails(selectedDate);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 bg-black/80 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] bg-paper border-0 md:border md:border-gold/20 rounded-0 md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 rounded-full bg-black/40 md:bg-white/5 hover:bg-white/10 text-gold transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left Side: Calendar View */}
        <div className="w-full md:w-1/2 p-4 md:p-10 border-b md:border-b-0 md:border-r border-gold/10 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8 mt-8 md:mt-0">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-widest uppercase">
              Lịch Vạn Sự
            </h2>
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={prevMonth} className="p-1 md:p-2 text-gold hover:bg-gold/10 rounded-full transition-colors">
                <ChevronLeft size={typeof window !== 'undefined' && window.innerWidth < 768 ? 18 : 20} />
              </button>
              <span className="text-sm md:text-lg font-serif font-bold text-gold min-w-[100px] md:min-w-[120px] text-center">
                {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-1 md:p-2 text-gold hover:bg-gold/10 rounded-full transition-colors">
                <ChevronRight size={typeof window !== 'undefined' && window.innerWidth < 768 ? 18 : 20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-[8px] md:text-[10px] font-bold text-gold/40 uppercase tracking-widest py-1 md:py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {calendarData.map((d, i) => {
              const date = new Date(d.year, d.month, d.day);
              const solar = Solar.fromDate(date);
              const lunar = solar.getLunar();
              const isSelectedDay = isSelected(d.day, d.month, d.year);
              const isTodayDay = isToday(d.day, d.month, d.year);
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "relative aspect-square rounded-lg md:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group",
                    d.isCurrentMonth ? "bg-white/5 hover:bg-white/10" : "opacity-10",
                    isSelectedDay && "bg-gold/20 border border-gold/40 scale-105 z-10",
                    isTodayDay && !isSelectedDay && "border border-gold/20"
                  )}
                >
                  <span className={cn(
                    "text-sm md:text-lg font-display font-bold",
                    isSelectedDay ? "text-gold" : "text-white/80",
                    isTodayDay && "text-accent"
                  )}>
                    {d.day}
                  </span>
                  <span className="text-[8px] md:text-[10px] font-serif text-gold/40">
                    {lunar.getDay() === 1 ? `${lunar.getDay()}/${lunar.getMonth()}` : lunar.getDay()}
                  </span>
                  {isTodayDay && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2 w-1 md:h-1.5 md:w-1.5 h-1 bg-accent rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Daily Details */}
        <div className="w-full md:w-1/2 p-4 md:p-10 bg-black/20 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Date Header */}
              <div className="text-center space-y-2">
                <div className="text-gold/60 font-serif italic text-sm md:text-lg">
                  Thứ {DAYS_OF_WEEK[selectedDate.getDay()]}, {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
                </div>
                <div className="text-2xl md:text-4xl font-display font-bold text-white tracking-tighter">
                  Âm Lịch: {details.lunarDay}/{details.lunarMonth}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                  <span className={cn(
                    "text-[10px] md:text-xs font-bold uppercase tracking-widest",
                    details.zodiacType === 'Hoàng Đạo' ? "text-gold" : "text-white/40"
                  )}>
                    Ngày {details.zodiacType} ({details.zodiac})
                  </span>
                </div>
              </div>

              {/* Can Chi Info */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Năm', value: details.lunarYear, nayin: details.yearNaYin },
                  { label: 'Tháng', value: details.lunarMonthCanChi, nayin: details.monthNaYin },
                  { label: 'Ngày', value: details.lunarDayCanChi, nayin: details.dayNaYin }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-[10px] text-gold/40 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-sm font-bold text-white">{item.value}</div>
                    <div className="text-[9px] text-white/40 mt-1 italic leading-tight">{item.nayin}</div>
                  </div>
                ))}
              </div>

              {/* Lucky Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold">
                  <Clock size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Giờ Hoàng Đạo</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {details.luckyHours.map((h, i) => (
                    <div key={i} className="px-3 py-1.5 bg-gold/5 border border-gold/20 rounded-lg text-xs text-gold/80">
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Yi / Ji (Do / Don't) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={18} />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Nên Làm</h3>
                  </div>
                  <div className="space-y-2">
                    {details.yi.slice(0, 5).map((item, i) => (
                      <div key={i} className="text-sm text-white/60 flex items-start gap-2">
                        <span className="text-emerald-500/40 mt-1">•</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertCircle size={18} />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Kiêng Kỵ</h3>
                  </div>
                  <div className="space-y-2">
                    {details.ji.slice(0, 5).map((item, i) => (
                      <div key={i} className="text-sm text-white/60 flex items-start gap-2">
                        <span className="text-rose-500/40 mt-1">•</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tiết Khí */}
              {details.jieQi && (
                <div className="p-6 bg-accent/5 border border-accent/20 rounded-3xl flex items-center gap-6">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                    <Sun size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] text-accent/60 uppercase tracking-widest mb-1">Tiết Khí Hiện Tại</div>
                    <div className="text-lg font-bold text-white">{details.jieQi}</div>
                  </div>
                </div>
              )}

              {/* Spiritual Advice (Placeholder for AI integration) */}
              <div className="p-6 bg-gold/5 border border-gold/20 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Lời Khuyên Thiên Sư</h3>
                </div>
                <p className="text-sm text-white/60 italic font-serif leading-relaxed">
                  "Ngày này vận khí {details.zodiacType === 'Hoàng Đạo' ? 'hanh thông' : 'cần thận trọng'}. {details.yi[0] ? `Thích hợp cho việc ${details.yi[0].toLowerCase()}.` : ''} Hãy giữ tâm tịnh, hành sự bao dung để đón nhận duyên lành."
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
