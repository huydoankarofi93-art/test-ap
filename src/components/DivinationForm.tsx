import React, { useState, useEffect, useCallback } from 'react';
import { UserData, DivinationMethod, Gender } from '../types';
import { Sparkles, HelpCircle, History, AlertTriangle, Coins, CheckCircle2, LayoutGrid, ShieldCheck, ArrowRight, Clock, User, Calendar, MapPin, Zap, RotateCcw, Loader2, Plus, ChevronDown, Info, Compass, RefreshCw, Search } from 'lucide-react';
import { SpiritualClock } from './SpiritualClock';
import { StickDivination } from './StickDivination';
import { getHexagramFromLines, HEXAGRAMS, calculateMaiHoaFromTime } from '../constants/iching';
import { PROVINCES } from '../constants/provinces';
import { motion, AnimatePresence } from 'motion/react';
import { sanitizeInput } from '../utils/security';

interface Props {
  data: UserData;
  onChange: (data: UserData) => void;
  onNext: (data: UserData) => void;
  onOfflineNext: (data: UserData) => void;
}

const SwastikaIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <motion.div 
    animate={{ 
      filter: ["drop-shadow(0 0 2px var(--color-gold-light))", "drop-shadow(0 0 8px rgba(181, 148, 16, 0.5))", "drop-shadow(0 0 2px var(--color-gold-light))"]
    }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className={`relative flex items-center justify-center ${className}`} 
    style={{ width: size, height: size }}
  >
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative z-10"
    >
      {/* Outer stylized circle */}
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" className="opacity-40" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" className="opacity-20" />
      
      {/* The Swastika (卍) - Traditional Style */}
      <path 
        d="M12 4V12H20 M20 20H12V12 M12 20V12H4 M4 4H12V12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Decorative dots in the corners */}
      <circle cx="8" cy="8" r="0.8" fill="currentColor" className="opacity-60" />
      <circle cx="16" cy="8" r="0.8" fill="currentColor" className="opacity-60" />
      <circle cx="8" cy="16" r="0.8" fill="currentColor" className="opacity-60" />
      <circle cx="16" cy="16" r="0.8" fill="currentColor" className="opacity-60" />
    </svg>
    {/* Subtle Glow */}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-gold/20 blur-md rounded-full -z-0" 
    />
  </motion.div>
);

const Coin = ({ result, tossing, index }: { result: number | null, tossing: boolean, index: number }) => {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 perspective-1000">
      <motion.div
        animate={tossing ? {
          rotateY: [0, 720, 1440, 2160],
          y: [0, -80, -100, -80, 0],
          scale: [1, 1.2, 1.3, 1.2, 1],
        } : {
          rotateY: result === 1 ? 0 : 180,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: tossing ? 0.8 + index * 0.1 : 0.5,
          ease: tossing ? "easeInOut" : "backOut",
        }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front (Yang/Ngửa) */}
        <div className="absolute inset-0 backface-hidden rounded-full border-2 sm:border-4 border-gold bg-gradient-to-br from-gold/40 via-gold/10 to-gold/40 flex items-center justify-center shadow-[0_0_20px_rgba(166,124,82,0.3)]">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gold/30 flex items-center justify-center">
            <span className="text-gold font-serif font-bold text-lg sm:text-2xl">乾</span>
          </div>
          {/* Ancient Coin Hole */}
          <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-paper border border-gold/40 rotate-45" />
        </div>
        
        {/* Back (Yin/Sấp) */}
        <div className="absolute inset-0 backface-hidden rounded-full border-2 sm:border-4 border-gold/60 bg-gradient-to-br from-gold/20 via-gold/5 to-gold/20 flex items-center justify-center rotate-y-180 shadow-[0_0_15px_rgba(166,124,82,0.1)]">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gold/10 flex items-center justify-center">
            <span className="text-gold/40 font-serif font-bold text-lg sm:text-2xl">坤</span>
          </div>
          {/* Ancient Coin Hole */}
          <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-paper border border-gold/20 rotate-45" />
        </div>
      </motion.div>
    </div>
  );
};

export const DivinationForm = React.memo(({ data, onChange, onNext, onOfflineNext }: Props) => {
  const [tossing, setTossing] = useState(false);
  const [currentToss, setCurrentToss] = useState<number[] | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [history, setHistory] = useState<number[][]>(data.divinationCoins || []);
  const [now, setNow] = useState(new Date());
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [adminEra, setAdminEra] = useState<'historical' | 'future'>('historical');
  const [showRevelation, setShowRevelation] = useState(false);
  const [revelationResult, setRevelationResult] = useState<number | null>(null);
  const [isFadingToBlack, setIsFadingToBlack] = useState(false);

  const getFilteredProvinces = () => {
    if (adminEra === 'historical') {
      return PROVINCES.filter(p => p.isHistorical);
    }
    return PROVINCES.filter(p => p.isConsolidated);
  };

  const eraLabels = {
    historical: 'Trước 2008 (64 Tỉnh)',
    future: 'Sau 2025 (34 Tỉnh)'
  };

  const cycleEra = () => {
    setAdminEra(prev => (prev === 'historical' ? 'future' : 'historical'));
  };

  useEffect(() => {
    if (data.divinationMethod === 'auto') {
      const timer = setInterval(() => {
        setNow(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data.divinationMethod]);

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [showRipple, setShowRipple] = useState<{ x: number, y: number } | null>(null);

  const handleCastingAreaClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setShowRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setShowRipple(null), 1000);
  };

  const methodInstructions = [
    {
      title: "Mai Hoa Dịch Số (Theo Giờ)",
      content: "Dựa trên sự tương tác giữa Thiên - Địa - Nhân tại thời điểm bạn khởi tâm động niệm. Hệ thống tự động lấy Ngày, Giờ, Phút hiện tại để tính toán quẻ. Phù hợp để xem các vấn đề mang tính thời điểm, xu hướng vận khí ngắn hạn.",
      purpose: "Việc cấp bách, Di chuyển, Sức khỏe"
    },
    {
      title: "Lục Hào (3 Đồng Xu)",
      content: "Phương pháp chi tiết nhất. Bạn cần tung 3 đồng xu 6 lần. Mỗi lần tung xác định một Hào (từ dưới lên). Lục Hào cho phép luận giải sâu về Lục Thân, Thế - Ứng và các biến động cụ thể của sự việc.",
      purpose: "Sự nghiệp, Tài lộc, Pháp lý"
    },
    {
      title: "Gieo Thẻ (Lắc Ống Thẻ)",
      content: "Nghi thức rút thẻ truyền thống. Bạn hãy tập trung vào câu hỏi, lắc ống thẻ cho đến khi có một thẻ rơi ra. Mỗi thẻ tương ứng với một quẻ dịch mang tính triết lý và lời khuyên tu thân.",
      purpose: "Tình cảm, Gia đạo, Bình an"
    },
    {
      title: "Vấn Đáp Thiên Cơ (Số Nét Chữ)",
      content: "Lập quẻ dựa trên số nét chữ hoặc ý nghĩa sâu xa của câu hỏi. Phương pháp này đòi hỏi sự thành tâm tuyệt đối. Phù hợp khi bạn có một thắc mắc cụ thể và muốn tìm kiếm sự thấu thị từ Kinh Dịch.",
      purpose: "Tình cảm, Gia đạo, Thắc mắc cụ thể"
    }
  ];

  const focuses: { id: UserData['divinationFocus']; label: string; icon: any }[] = [
    { id: 'career', label: 'Sự nghiệp', icon: LayoutGrid },
    { id: 'wealth', label: 'Tài lộc', icon: Coins },
    { id: 'love', label: 'Tình cảm', icon: Sparkles },
    { id: 'health', label: 'Sức khỏe', icon: AlertTriangle },
    { id: 'family', label: 'Gia đạo', icon: SwastikaIcon },
    { id: 'relocation', label: 'Di chuyển', icon: History },
    { id: 'legal', label: 'Pháp lý', icon: ShieldCheck },
    { id: 'general', label: 'Tổng quan', icon: HelpCircle },
  ];

  const getRecommendedMethod = (focus: UserData['divinationFocus'], urgency: UserData['divinationUrgency']): DivinationMethod => {
    // If high urgency, always prioritize fast methods (Mai Hoa/Chạm Gieo)
    if (urgency === 'high') return 'auto';

    switch (focus) {
      case 'career':
      case 'wealth':
      case 'legal':
        return 'coins'; // Lục Hào for detailed matters
      case 'love':
      case 'family':
        return 'question'; // Vấn Đáp for emotional matters
      case 'health':
      case 'relocation':
        return 'auto'; // Mai Hoa for time/energy matters
      case 'general':
        return 'sticks'; // Gieo Thẻ for general guidance
      default:
        return 'auto';
    }
  };

  const methods: { id: DivinationMethod; label: string; icon: any; desc: string; guide: string }[] = [
    { 
      id: 'auto', 
      label: 'Mai Hoa', 
      icon: History, 
      desc: 'Theo Giờ',
      guide: 'Phù hợp cho: Việc cấp bách, Di chuyển, Sức khỏe. Dựa trên thời điểm bạn khởi tâm động niệm. Hệ thống sẽ lấy Ngày, Giờ, Phút hiện tại để lập quẻ.'
    },
    { 
      id: 'sticks', 
      label: 'Gieo Thẻ', 
      icon: LayoutGrid, 
      desc: 'Lắc ống thẻ',
      guide: 'Phù hợp cho: Tình cảm, Gia đạo, Bình an. Nghi thức rút thẻ truyền thống. Hãy tập trung vào câu hỏi, lắc ống thẻ cho đến khi có một thẻ rơi ra.'
    },
    { 
      id: 'coins', 
      label: 'Lục Hào', 
      icon: Coins, 
      desc: '3 Đồng Xu',
      guide: 'Phù hợp cho: Sự nghiệp, Tài lộc, Pháp lý. Phương pháp chi tiết nhất, cho phép luận giải sâu về Lục Thân, Thế - Ứng và các hào động.'
    },
    { 
      id: 'click', 
      label: 'Chạm Gieo', 
      icon: Sparkles, 
      desc: 'Thành tâm',
      guide: 'Phù hợp cho: Tổng quan, Vận khí ngắn hạn. Kết hợp giữa thời gian và sự tương tác trực tiếp. Hãy nhấn gieo khi bạn cảm thấy tâm trí tập trung nhất.'
    },
    { 
      id: 'question', 
      label: 'Vấn Đáp', 
      icon: SwastikaIcon, 
      desc: 'Đặt câu hỏi',
      guide: 'Phù hợp cho: Tình cảm, Gia đạo, Thắc mắc cụ thể. Lập quẻ dựa trên ý nghĩa của câu hỏi. Tìm kiếm sự chỉ dẫn trực tiếp từ Kinh Dịch.'
    },
    { 
      id: 'lookup', 
      label: 'Tra Cứu', 
      icon: Search, 
      desc: 'Nhập số thẻ',
      guide: 'Phù hợp cho: Tra cứu nhanh ý nghĩa quẻ. Chỉ cần nhập số thẻ (1-64) để xem giải mã chi tiết mà không cần gieo quẻ.'
    }
  ];

  const handleAutoCast = () => {
    setTossing(true);
    // Phase 1: Ritual animation (tossing/praying)
    setTimeout(() => {
      // Phase 2: Gradual darkening
      setIsFadingToBlack(true);
      
      setTimeout(() => {
        setTossing(false);
        setIsFadingToBlack(false);
        const time = new Date();
        const { hexagram, movingLine } = calculateMaiHoaFromTime(time);
        
        setRevelationResult(hexagram);
        setShowRevelation(true);
        
        onChange({ 
          ...data, 
          divinationTime: time.toISOString(),
          divinationMovingLine: movingLine,
        });
      }, 2000); // 2 seconds for deep darkening
    }, 1500); // 1.5 seconds of initial ritual
  };

  const handleToss = () => {
    if (history.length >= 6 || tossing) return;
    setTossing(true);
    setCurrentToss(null);
    
    setTimeout(() => {
      const toss = [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())];
      setCurrentToss(toss);
      const newHistory = [...history, toss];
      
      setTimeout(() => {
        setHistory(newHistory);
        onChange({ ...data, divinationCoins: newHistory, divinationTime: new Date().toISOString() });
        setTossing(false);
      }, 1000);
    }, 100);
  };

  const resetToss = () => {
    setHistory([]);
    onChange({ ...data, divinationCoins: [], divinationIsCastDone: false });
  };

  const handleFocusChange = (focus: UserData['divinationFocus']) => {
    const recommended = getRecommendedMethod(focus, data.divinationUrgency);
    onChange({ 
      ...data, 
      divinationFocus: focus,
      divinationMethod: recommended,
      divinationIsCastDone: false,
      divinationCoins: []
    });
    setHistory([]);
  };

  const handleUrgencyChange = (urgency: UserData['divinationUrgency']) => {
    const recommended = getRecommendedMethod(data.divinationFocus, urgency);
    onChange({ 
      ...data, 
      divinationUrgency: urgency,
      divinationMethod: recommended,
      divinationIsCastDone: false,
      divinationCoins: []
    });
    setHistory([]);
  };

  const canProceed = () => {
    if (!data.divinationIsCastDone) return false;
    if (showPersonalInfo) {
      return data.birthDate && data.birthPlace;
    }
    return true;
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-8 2xl:gap-16 items-stretch max-w-full 2xl:max-w-[100rem] mx-auto">
      {/* Left Column: Configuration (Purpose, Question, Method) */}
      <div className="w-full lg:w-1/3 2xl:w-1/4 space-y-6 2xl:space-y-10 flex flex-col">
        <div className="glass-panel p-6 2xl:p-10 space-y-6 2xl:space-y-10 flex-1 border-white/5">
          <div className="space-y-4 2xl:space-y-8">
            <h3 className="text-xs 2xl:text-sm font-bold text-gold uppercase tracking-[0.3em]">1. Mục Đích & Cấp Bách</h3>
            <div className="grid grid-cols-2 gap-2 2xl:gap-4">
              {focuses.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFocusChange(f.id)}
                  className={`p-3 2xl:p-5 rounded-xl border text-left flex items-center gap-2 2xl:gap-4 transition-all hover:scale-[1.02] ${
                    data.divinationFocus === f.id ? 'border-accent bg-accent/10 text-white' : 'border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <f.icon size={14} className={`${data.divinationFocus === f.id ? 'text-accent' : 'text-gold/40'} 2xl:w-5 2xl:h-5`} />
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-wider">{f.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 2xl:gap-4">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleUrgencyChange(level as any)}
                  className={`flex-1 py-2 2xl:py-4 rounded-lg border text-[9px] 2xl:text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] ${
                    data.divinationUrgency === level ? 'bg-accent/20 border-accent/40 text-accent' : 'border-white/5 text-white/20 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  {level === 'high' ? 'Cấp Bách' : level === 'medium' ? 'Cần Thiết' : 'Bình Thường'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 2xl:space-y-6">
            <h3 className="text-xs 2xl:text-sm font-bold text-gold uppercase tracking-[0.3em]">2. Câu Hỏi Của Bạn</h3>
            <textarea
              value={data.divinationQuestion || ''}
              onChange={(e) => onChange({ ...data, divinationQuestion: sanitizeInput(e.target.value, 5000) })}
              placeholder="Nhập điều bạn muốn thấu thị..."
              className="input-spiritual min-h-[100px] 2xl:min-h-[150px] text-sm 2xl:text-lg py-4 2xl:py-6"
            />
          </div>

          <div className="space-y-3 2xl:space-y-6">
            <h3 className="text-xs 2xl:text-sm font-bold text-gold uppercase tracking-[0.3em]">3. Phương Pháp</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 2xl:grid-cols-5 gap-2 2xl:gap-4">
              {methods.map((m) => {
                const isRecommended = getRecommendedMethod(data.divinationFocus, data.divinationUrgency) === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onChange({ ...data, divinationMethod: m.id, divinationIsCastDone: false, divinationCoins: [] });
                      setHistory([]);
                    }}
                    className={`p-2 sm:p-3 2xl:p-4 rounded-xl border text-center space-y-1 2xl:space-y-2 transition-all relative hover:scale-[1.02] ${
                      data.divinationMethod === m.id ? 'border-accent bg-accent/10' : 'border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100 hover:bg-white/5'
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-1 -right-1 px-1 bg-gold text-ink text-[6px] 2xl:text-[8px] font-bold rounded-sm uppercase tracking-tighter z-10">
                        Hợp
                      </div>
                    )}
                    <m.icon size={16} className="mx-auto text-gold 2xl:w-6 2xl:h-6" />
                    <div className="text-[8px] sm:text-[9px] 2xl:text-[10px] font-bold text-white uppercase tracking-tighter">{m.label}</div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-4 2xl:p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 2xl:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gold">
                  <SwastikaIcon size={14} className="2xl:w-5 2xl:h-5" />
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest">Hướng dẫn gieo</span>
                </div>
                {data.divinationUrgency === 'high' && (
                  <div className="flex items-center gap-1 text-[8px] 2xl:text-[10px] font-bold text-accent uppercase animate-pulse">
                    <Zap size={10} className="2xl:w-4 2xl:h-4" />
                    <span>Ưu tiên tốc độ</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] 2xl:text-sm text-white/40 leading-relaxed italic font-serif">
                {methods.find(m => m.id === data.divinationMethod)?.guide}
              </p>
            </div>

            {/* Detailed Instructions Collapsible */}
            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                className="w-full flex items-center justify-between p-3 2xl:p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group hover:scale-[1.01]"
              >
                <div className="flex items-center gap-2 text-gold">
                  <Info size={14} className="2xl:w-5 2xl:h-5" />
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest">Chi tiết các phương pháp</span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`text-white/20 transition-transform duration-300 2xl:w-5 2xl:h-5 ${isInstructionsOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {isInstructionsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 2xl:p-8 space-y-4 2xl:space-y-8">
                      {methodInstructions.map((inst, idx) => (
                        <div key={idx} className="space-y-1 2xl:space-y-2">
                          <h4 className="text-[10px] 2xl:text-xs font-bold text-gold/80 uppercase tracking-wider">{inst.title}</h4>
                          <div className="flex items-center gap-1 text-[8px] 2xl:text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
                            <Compass size={10} className="2xl:w-4 2xl:h-4" />
                            <span>Phù hợp: {inst.purpose}</span>
                          </div>
                          <p className="text-[10px] 2xl:text-sm text-white/40 leading-relaxed font-serif italic">
                            {inst.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Casting Area / Result / Personal Info */}
      <div className="flex-1 flex flex-col">
        <div 
          onClick={handleCastingAreaClick}
          className="glass-panel p-8 2xl:p-16 flex-1 flex flex-col items-center justify-center relative overflow-hidden border-white/5 cursor-crosshair"
        >
          {/* Spiritual Ripples */}
          <AnimatePresence>
            {showRipple && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute pointer-events-none w-20 h-20 border border-gold/40 rounded-full z-50"
                style={{ left: showRipple.x - 40, top: showRipple.y - 40 }}
              />
            )}
          </AnimatePresence>

          {/* Majestic Spiritual Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-96 2xl:w-[40rem] h-96 2xl:h-[40rem] bg-accent/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-96 2xl:w-[40rem] h-96 2xl:h-[40rem] bg-gold/5 blur-[120px] rounded-full -z-10" />
            
            {/* Floating Sacred Geometry */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] 2xl:w-[1000px] h-[600px] 2xl:h-[1000px] opacity-[0.03] border border-gold rounded-full"
            >
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gold/20" 
                  style={{ transform: `rotate(${i * 22.5}deg)` }}
                />
              ))}
            </motion.div>
          </div>
          
          {!data.divinationIsCastDone ? (
            <div className="w-full max-w-2xl 2xl:max-w-5xl">
              {data.divinationMethod === 'sticks' && (
                <StickDivination 
                  isCasting={tossing} 
                  setIsCasting={setTossing} 
                  onResult={(num) => onChange({ ...data, divinationStick: num, divinationHexagram: num, divinationTime: new Date().toISOString(), divinationIsCastDone: true })} 
                />
              )}
              {data.divinationMethod === 'coins' && (
                <div className="text-center space-y-12 2xl:space-y-24 relative">
                  {/* Celestial Compass Background for Coins */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                      className="w-[500px] 2xl:w-[80rem] h-[500px] 2xl:h-[80rem] border border-gold rounded-full flex items-center justify-center"
                    >
                      {[...Array(24)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gold/40" 
                          style={{ transform: `rotate(${i * 15}deg)` }}
                        />
                      ))}
                      <div className="absolute inset-20 2xl:inset-40 border border-gold/40 rounded-full" />
                      <div className="absolute inset-40 2xl:inset-80 border border-gold/20 rounded-full" />
                    </motion.div>
                  </div>

                  <div className="space-y-4 2xl:space-y-8 relative z-10">
                    <h4 className="text-xl 2xl:text-4xl font-serif font-bold text-white/80 tracking-widest uppercase">Nghi Thức Lục Hào</h4>
                    <p className="text-xs 2xl:text-lg text-white/30 font-serif italic max-w-xs 2xl:max-w-2xl mx-auto leading-relaxed">
                      "Tập trung vào câu hỏi. Tung 3 đồng xu 6 lần để lập thành quẻ. Mỗi lần tung đại diện cho một hào từ dưới lên trên."
                    </p>
                  </div>
                  
                  <div className="relative h-32 sm:h-48 2xl:h-72 flex items-center justify-center">
                    <div className="flex justify-center gap-6 sm:gap-12 2xl:gap-24">
                      {[0, 1, 2].map(i => (
                        <Coin 
                          key={i} 
                          index={i}
                          tossing={tossing} 
                          result={currentToss ? currentToss[i] : (history.length > 0 ? history[history.length - 1][i] : 1)} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8 2xl:space-y-16 relative z-10">
                    <div className="flex flex-col items-center gap-6 2xl:gap-12">
                      <div className="text-[10px] 2xl:text-sm text-gold font-bold uppercase tracking-[0.3em] mb-2">Lịch Sử 6 Hào (Từ dưới lên)</div>
                      <div className="grid grid-cols-1 gap-3 2xl:gap-6 w-full max-w-md 2xl:max-w-3xl relative">
                        {/* Scroll Background for History */}
                        <div className="absolute -inset-4 2xl:-inset-8 bg-[#1a0a05]/40 border border-gold/10 rounded-3xl -z-10 backdrop-blur-sm" />
                        {[...Array(6)].map((_, i) => {
                          const index = 5 - i;
                          const toss = history[index];
                          const heads = toss ? toss.filter(c => c === 1).length : 0;
                          const tails = toss ? 3 - heads : 0;
                          
                          let lineLabel = "";
                          let lineSymbol = "";
                          let lineClass = "text-white/10";
                          
                          if (toss) {
                            if (heads === 3) { [lineLabel, lineSymbol, lineClass] = ["Lão Dương (Động)", "◯", "text-accent font-bold"]; }
                            else if (heads === 0) { [lineLabel, lineSymbol, lineClass] = ["Lão Âm (Động)", "✕", "text-blue-400 font-bold"]; }
                            else if (heads === 1) { [lineLabel, lineSymbol, lineClass] = ["Thiếu Dương", "—", "text-gold"]; }
                            else if (heads === 2) { [lineLabel, lineSymbol, lineClass] = ["Thiếu Âm", "--", "text-white/60"]; }
                          }

                          return (
                            <div key={i} className={`flex items-center justify-between p-3 2xl:p-6 rounded-xl border transition-all duration-500 ${toss ? 'bg-white/[0.05] border-white/10' : 'bg-transparent border-white/5 opacity-30'}`}>
                              <div className="flex items-center gap-4 2xl:gap-8">
                                <span className="text-[10px] 2xl:text-sm font-bold text-white/20 w-4 2xl:w-8">H{6 - i}</span>
                                <div className="flex gap-1 2xl:gap-2">
                                  {toss ? toss.map((c, ci) => (
                                    <div key={ci} className={`w-4 h-4 2xl:w-6 2xl:h-6 rounded-full border ${c === 1 ? 'bg-gold/40 border-gold' : 'bg-white/10 border-white/20'}`} title={c === 1 ? 'Ngửa' : 'Sấp'} />
                                  )) : (
                                    <div className="flex gap-1 2xl:gap-2">
                                      <div className="w-4 h-4 2xl:w-6 2xl:h-6 rounded-full border border-white/5" />
                                      <div className="w-4 h-4 2xl:w-6 2xl:h-6 rounded-full border border-white/5" />
                                      <div className="w-4 h-4 2xl:w-6 2xl:h-6 rounded-full border border-white/5" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 2xl:gap-8">
                                <span className={`text-xs 2xl:text-lg font-serif ${lineClass}`}>{lineLabel}</span>
                                <span className={`text-xl 2xl:text-3xl font-bold w-6 2xl:w-10 text-center ${lineClass}`}>{lineSymbol}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-[10px] 2xl:text-sm text-white/40 uppercase tracking-[0.2em]">Tiến trình: {history.length}/6 hào</div>
                    </div>

                    <div className="flex flex-col items-center gap-4 2xl:gap-8">
                      <button 
                        onClick={handleToss} 
                        disabled={tossing || history.length >= 6} 
                        className="btn-spiritual px-16 2xl:px-24 2xl:py-6 group"
                      >
                        {tossing ? (
                          <div className="flex items-center gap-3 2xl:gap-6">
                            <RotateCcw size={18} className="animate-spin 2xl:w-6 2xl:h-6" />
                            <span className="2xl:text-xl">Đang Tung...</span>
                          </div>
                        ) : history.length >= 6 ? (
                          <div className="flex items-center gap-3 2xl:gap-6">
                            <CheckCircle2 size={18} className="2xl:w-6 2xl:h-6" />
                            <span className="2xl:text-xl">Đã Hoàn Tất</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 2xl:gap-6">
                            <Coins size={18} className="group-hover:rotate-12 transition-transform 2xl:w-6 2xl:h-6" />
                            <span className="2xl:text-xl">Tung Lần {history.length + 1}</span>
                          </div>
                        )}
                      </button>

                      {history.length === 6 && !tossing && (
                        <motion.button 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(166, 124, 82, 0.2)' }}
                          onClick={() => {
                            const lines = history.map(t => (t.filter(c => c === 1).length % 2 !== 0 ? 1 : 0));
                            const hex = getHexagramFromLines(lines)?.number;
                            if (hex) {
                              setIsFadingToBlack(true);
                              setTimeout(() => {
                                setIsFadingToBlack(false);
                                setRevelationResult(hex);
                                setShowRevelation(true);
                              }, 2000);
                            }
                          }} 
                          className="px-8 py-3 2xl:px-12 2xl:py-5 bg-gold/10 border border-gold/30 rounded-full text-gold font-bold uppercase tracking-widest text-xs 2xl:text-sm transition-all flex items-center gap-2 2xl:gap-4"
                        >
                          <Sparkles size={14} className="2xl:w-5 2xl:h-5" />
                          Xem Kết Quả Quẻ Dịch
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {data.divinationMethod === 'auto' && (
                <div className="text-center space-y-12 2xl:space-y-24 relative">
                  <div className="space-y-4 2xl:space-y-8 relative z-10">
                    <h4 className="text-xl 2xl:text-4xl font-serif font-bold text-white/80 tracking-widest uppercase">Mai Hoa Dịch Số</h4>
                    <p className="text-xs 2xl:text-lg text-white/30 font-serif italic max-w-xs 2xl:max-w-2xl mx-auto leading-relaxed">
                      "Vạn vật hữu linh, thời khắc hữu ý. Hệ thống sẽ dựa trên thiên thời hiện tại để lập quẻ Mai Hoa."
                    </p>
                  </div>
                  
                  <div className="relative h-80 2xl:h-[35rem] flex items-center justify-center">
                    {/* Background Rings - More Majestic */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute w-80 2xl:w-[35rem] h-80 2xl:h-[35rem] border border-gold/10 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      className="absolute w-72 2xl:w-[30rem] h-72 2xl:h-[30rem] border border-gold/5 rounded-full border-dashed"
                    />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                      className="absolute w-[450px] 2xl:w-[50rem] h-[450px] 2xl:h-[50rem] border border-gold/5 rounded-full opacity-20"
                    >
                      {[...Array(24)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gold/20" 
                          style={{ transform: `rotate(${i * 15}deg) translateY(0)` }}
                        />
                      ))}
                    </motion.div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-6 2xl:gap-12">
                      <div className={`w-48 h-48 2xl:w-72 2xl:h-72 rounded-full bg-gold/5 border transition-all duration-1000 flex items-center justify-center relative overflow-hidden ${tossing ? 'border-gold shadow-[0_0_100px_rgba(166,124,82,0.5)] scale-110' : 'border-gold/30'}`}>
                        <AnimatePresence>
                          {tossing ? (
                            <motion.div
                              initial={{ opacity: 0, rotate: 0 }}
                              animate={{ opacity: 1, rotate: 1440 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 2.5, ease: "easeInOut" }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent,rgba(166,124,82,0.6),transparent)] animate-spin" />
                              <div className="absolute inset-4 2xl:inset-8 bg-paper rounded-full flex items-center justify-center">
                                <Sparkles size={48} className="text-gold animate-pulse 2xl:w-20 2xl:h-20" />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center"
                            >
                              <Clock size={56} className="text-gold/60 2xl:w-24 2xl:h-24" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Bagua Trigrams around - Enhanced */}
                        {['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'].map((t, i) => (
                          <motion.div 
                            key={i}
                            animate={tossing ? { 
                              scale: [1, 1.8, 1],
                              color: ['rgba(166, 124, 82, 0.4)', 'rgba(166, 124, 82, 1)', 'rgba(166, 124, 82, 0.4)'],
                              textShadow: tossing ? '0 0 20px rgba(166, 124, 82, 0.8)' : 'none'
                            } : {}}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                            className="absolute text-gold/40 font-bold text-2xl 2xl:text-4xl"
                            style={{
                              transform: `rotate(${i * 45}deg) translateY(${window.innerWidth >= 1536 ? '-130px' : '-85px'})`
                            }}
                          >
                            {t}
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="space-y-1 2xl:space-y-4">
                        <div className="text-4xl 2xl:text-7xl font-serif font-bold text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{now.toLocaleTimeString('vi-VN')}</div>
                        <div className="text-[10px] 2xl:text-sm text-white/40 uppercase tracking-[0.3em] font-bold">Thời khắc hiện tại</div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleAutoCast} 
                    disabled={tossing}
                    className="btn-spiritual px-16 2xl:px-24 2xl:py-6 group relative overflow-hidden"
                  >
                    <AnimatePresence>
                      {tossing && (
                        <motion.div 
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                      )}
                    </AnimatePresence>
                    <div className="relative z-10 flex items-center gap-3 2xl:gap-6">
                      {tossing ? <Loader2 size={18} className="animate-spin 2xl:w-6 2xl:h-6" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform 2xl:w-6 2xl:h-6" />}
                      <span className="2xl:text-xl">{tossing ? 'Đang Lập Quẻ...' : 'Lập Quẻ Mai Hoa'}</span>
                    </div>
                  </button>
                </div>
              )}

              {data.divinationMethod === 'click' && (
                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <h4 className="text-xl font-serif font-bold text-white/80 tracking-widest uppercase">Chạm Gieo Ý Niệm</h4>
                    <p className="text-xs text-white/30 font-serif italic max-w-xs mx-auto leading-relaxed">
                      "Tập trung năng lượng vào ngón tay. Chạm và giữ vào vòng tròn linh hồn để truyền tải ý niệm của bạn."
                    </p>
                  </div>
                  
                  <div className="relative h-72 flex items-center justify-center">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      {/* Energy Field */}
                      <AnimatePresence>
                        {tossing && (
                          <>
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 2, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
                            />
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                              className="absolute inset-0 rounded-full border-2 border-accent/40"
                            />
                          </>
                        )}
                      </AnimatePresence>
                      
                      <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
                      
                      <motion.button
                        onMouseDown={() => setTossing(true)}
                        onMouseUp={() => {
                          if (tossing) {
                            handleAutoCast();
                          }
                        }}
                        onTouchStart={() => setTossing(true)}
                        onTouchEnd={() => {
                          if (tossing) {
                            handleAutoCast();
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative z-10 w-40 h-40 rounded-full border-2 transition-all duration-700 flex items-center justify-center group ${
                          tossing ? 'border-accent bg-accent/30 shadow-[0_0_80px_rgba(242,125,38,0.6)]' : 'border-gold/30 bg-gold/5 hover:border-gold/60'
                        }`}
                      >
                        <div className="relative">
                          <Zap size={48} className={`transition-all duration-700 ${tossing ? 'text-white scale-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-gold/40'}`} />
                          {tossing && (
                            <motion.div 
                              animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="absolute inset-0 bg-white blur-lg rounded-full"
                            />
                          )}
                        </div>
                        
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <motion.circle
                            cx="80"
                            cy="80"
                            r="76"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="477"
                            initial={{ strokeDashoffset: 477 }}
                            animate={tossing ? { strokeDashoffset: 0 } : { strokeDashoffset: 477 }}
                            transition={{ duration: 2.5, ease: "linear" }}
                            className="text-accent"
                          />
                        </svg>
                      </motion.button>
                      
                      <div className="absolute -bottom-12 flex flex-col items-center gap-2">
                        <div className={`text-xs font-bold uppercase tracking-[0.4em] transition-colors duration-500 ${tossing ? 'text-accent' : 'text-white/20'}`}>
                          {tossing ? 'Đang truyền ý niệm...' : 'Chạm và giữ'}
                        </div>
                        {tossing && (
                          <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                              <motion.div 
                                key={i}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-1 h-1 rounded-full bg-accent"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {data.divinationMethod === 'lookup' && (
                <div className="text-center space-y-12 relative w-full max-w-md mx-auto">
                  <div className="space-y-4 relative z-10">
                    <h4 className="text-xl 2xl:text-4xl font-serif font-bold text-white/80 tracking-widest uppercase">Tra Cứu Thiên Cơ</h4>
                    <p className="text-xs 2xl:text-lg text-white/30 font-serif italic max-w-xs 2xl:max-w-2xl mx-auto leading-relaxed">
                      "Nhập số thẻ bạn đã rút được để xem giải mã chi tiết từ thư viện Kinh Dịch."
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <input
                        type="number"
                        min="1"
                        max="64"
                        value={data.divinationStick || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1 && val <= 64) {
                            onChange({ ...data, divinationStick: val, divinationHexagram: val });
                          } else if (e.target.value === '') {
                            onChange({ ...data, divinationStick: undefined, divinationHexagram: undefined });
                          }
                        }}
                        placeholder="Nhập số thẻ (1-64)"
                        className="relative w-full bg-black/40 border border-gold/30 rounded-2xl py-8 text-center text-5xl font-serif font-bold text-gold placeholder:text-gold/10 focus:outline-none focus:border-gold transition-all"
                      />
                    </div>

                    <AnimatePresence>
                      {data.divinationHexagram && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-8 rounded-3xl bg-gold/5 border border-gold/20 space-y-6"
                        >
                          <div className="space-y-2">
                            <div className="text-3xl font-serif font-bold text-white uppercase tracking-widest">
                              {HEXAGRAMS[data.divinationHexagram].name}
                            </div>
                            <div className="text-lg text-gold/80 font-serif italic">
                              "{HEXAGRAMS[data.divinationHexagram].meaning}"
                            </div>
                          </div>
                          
                          <div className="h-px w-full bg-gold/10" />
                          
                          <p className="text-sm text-white/60 leading-relaxed font-serif">
                            {HEXAGRAMS[data.divinationHexagram].description}
                          </p>

                          <button
                            onClick={() => onOfflineNext({ ...data, divinationIsCastDone: true, divinationTime: new Date().toISOString() })}
                            className="btn-spiritual w-full py-4 text-xs"
                          >
                            Xác Nhận & Tra Cứu Nhanh
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {data.divinationMethod === 'question' && (
                <div className="text-center space-y-12 relative">
                  <div className="space-y-4 relative z-10">
                    <h4 className="text-xl 2xl:text-4xl font-serif font-bold text-white/80 tracking-widest uppercase">Vấn Đáp Thiên Cơ</h4>
                    <p className="text-xs 2xl:text-lg text-white/30 font-serif italic max-w-xs 2xl:max-w-2xl mx-auto leading-relaxed">
                      "Lời văn càng thành tâm, quẻ ứng càng linh nghiệm. Hãy gửi gắm tâm tư của bạn vào hư không."
                    </p>
                  </div>
                  
                  <div className="relative h-80 2xl:h-[35rem] flex items-center justify-center">
                    {/* Ritual Altar Base */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 2xl:w-96 h-12 2xl:h-20 bg-gradient-to-b from-[#2a1a10] to-[#1a0a05] rounded-t-3xl border-t border-gold/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]" />
                    
                    {/* Incense Burner (Lư Hương) */}
                    <div className="absolute bottom-8 2xl:bottom-16 left-1/2 -translate-x-1/2 w-20 2xl:w-32 h-16 2xl:h-24 bg-[#3a2a1a] rounded-full border-2 border-gold/30 flex items-center justify-center shadow-2xl">
                      <div className="w-12 2xl:w-20 h-1 2xl:h-2 bg-gold/40 absolute top-4 2xl:top-6 rounded-full blur-sm" />
                      {/* Incense Sticks */}
                      <div className="flex gap-1 2xl:gap-2 absolute -top-12 2xl:-top-20">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-0.5 2xl:w-1 h-16 2xl:h-24 bg-[#8b4513] relative">
                            <motion.div 
                              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 2xl:w-2.5 h-1.5 2xl:h-2.5 bg-orange-500 rounded-full blur-[2px]" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Incense Smoke Effect */}
                    <div className="absolute bottom-20 2xl:bottom-32 left-1/2 -translate-x-1/2 w-full h-80 2xl:h-[30rem] pointer-events-none flex justify-center gap-16">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -400],
                            x: [0, i % 2 === 0 ? 80 : -80, i % 2 === 0 ? -40 : 40],
                            opacity: [0, 0.3, 0.5, 0.2, 0],
                            scale: [1, 2, 4, 6],
                            filter: ["blur(10px)", "blur(30px)", "blur(60px)"]
                          }}
                          transition={{ 
                            duration: 7 + i, 
                            repeat: Infinity, 
                            delay: i * 0.8,
                            ease: "easeOut"
                          }}
                          className="w-4 h-40 bg-white/5 rounded-full"
                        />
                      ))}
                    </div>
                    
                    {/* Floating Sacred Symbols */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {['☯', 'ॐ', '卍', '☸'].map((sym, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -100, 0],
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1],
                            rotate: [0, 360]
                          }}
                          transition={{ 
                            duration: 15 + i * 5, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                          className="absolute text-gold/20 text-4xl 2xl:text-7xl font-serif"
                          style={{
                            left: `${20 + i * 20}%`,
                            top: `${30 + (i % 2) * 20}%`
                          }}
                        >
                          {sym}
                        </motion.div>
                      ))}
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-10">
                      <div className="relative">
                        <div className={`w-32 h-32 rounded-full transition-all duration-1000 flex items-center justify-center relative ${tossing ? 'bg-gold/20 border-gold shadow-[0_0_80px_rgba(166,124,82,0.3)]' : 'bg-white/5 border-white/10'} border`}>
                          <AnimatePresence mode="wait">
                            {tossing ? (
                              <motion.div
                                key="casting"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                className="flex flex-col items-center relative"
                              >
                                {/* Lighting Effect Layers */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <motion.div 
                                    animate={{ 
                                      opacity: [0.3, 0.6, 0.3],
                                      scale: [0.8, 1.1, 0.8],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-32 h-32 bg-gold/10 rounded-full blur-2xl"
                                  />
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-40 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent blur-[1px]"
                                  />
                                  <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    className="absolute h-40 w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-transparent blur-[1px]"
                                  />
                                </div>
                                <Plus size={48} className="text-gold filter drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] relative z-10" strokeWidth={1.5} />
                                {/* Inner Glow */}
                                <motion.div 
                                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute inset-0 flex items-center justify-center z-20"
                                >
                                  <div className="w-1 h-1 bg-white rounded-full blur-[1px]" />
                                </motion.div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center"
                              >
                                <SwastikaIcon size={40} className="text-gold/40" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <motion.div 
                            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 rounded-full border-2 border-gold/20"
                          />
                        </div>
                        
                        {tossing && (
                          <div className="absolute -inset-8 pointer-events-none">
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                  opacity: [0, 1, 0], 
                                  scale: [0, 1.5],
                                  x: Math.cos(i * 45 * Math.PI / 180) * 100,
                                  y: Math.sin(i * 45 * Math.PI / 180) * 100
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-gold rounded-full blur-[1px]"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-6">
                        <button 
                          onClick={() => {
                            if (data.divinationQuestion?.trim()) {
                              handleAutoCast();
                            }
                          }}
                          disabled={!data.divinationQuestion?.trim() || tossing}
                          className="btn-spiritual px-20 group disabled:opacity-30 relative overflow-hidden"
                        >
                          <div className="relative z-10 flex items-center gap-3">
                            {tossing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                            <span>{tossing ? 'Đang Gửi Lời Cầu...' : 'Gửi Lời Cầu Nguyện'}</span>
                          </div>
                        </button>
                        
                        {!data.divinationQuestion?.trim() && !tossing && (
                          <p className="text-[10px] text-accent/60 uppercase tracking-widest animate-pulse font-bold">Vui lòng nhập câu hỏi ở bên trái</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : !showPersonalInfo ? (
            <div className="w-full max-w-2xl space-y-12 text-center">
              <div className="space-y-4">
                <div className="text-gold font-bold uppercase tracking-[0.4em] text-xs">Quẻ Đã Gieo</div>
                <h2 className="text-6xl font-serif font-bold text-white tracking-tighter">
                  {data.divinationHexagram ? HEXAGRAMS[data.divinationHexagram].name : 'Thiên Cơ'}
                </h2>
                <p className="text-xl text-gold/60 font-serif italic">"{data.divinationHexagram ? HEXAGRAMS[data.divinationHexagram].meaning : ''}"</p>
                
                {/* Tướng Tinh Display in Result Screen */}
                {data.divinationHexagram && HEXAGRAMS[data.divinationHexagram].tuongTinh && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-4 mt-6"
                  >
                    <div className="h-px w-8 bg-gold/20" />
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-serif text-gold/80">{HEXAGRAMS[data.divinationHexagram].tuongTinh?.char}</span>
                      <span className="text-[10px] text-gold/40 uppercase tracking-[0.3em] font-bold">Tướng Tinh: {HEXAGRAMS[data.divinationHexagram].tuongTinh?.animal}</span>
                    </div>
                    <div className="h-px w-8 bg-gold/20" />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => onOfflineNext(data)} className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-gold/30 hover:bg-gold/5 transition-all text-left space-y-4">
                  <Zap size={24} className="text-white/40 group-hover:text-gold" />
                  <div>
                    <h4 className="font-bold text-white group-hover:text-gold">Luận Nhanh (Offline)</h4>
                    <p className="text-[10px] text-white/40 mt-1">Giải mã ý nghĩa chung từ thư viện.</p>
                  </div>
                </button>
                <button onClick={() => setShowPersonalInfo(true)} className="group p-8 rounded-3xl border border-gold/20 bg-gold/5 hover:border-gold/50 hover:bg-gold/10 transition-all text-left space-y-4">
                  <ShieldCheck size={24} className="text-gold" />
                  <div>
                    <h4 className="font-bold text-white">Luận Chuyên Sâu</h4>
                    <p className="text-[10px] text-white/40 mt-1">Cá nhân hóa dựa trên ngày giờ sinh.</p>
                  </div>
                </button>
              </div>
              
              <button onClick={resetToss} className="text-[10px] text-white/20 uppercase tracking-widest hover:text-white">Gieo lại quẻ khác</button>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-8">
              <div className="text-center space-y-2">
                <button onClick={() => setShowPersonalInfo(false)} className="text-[10px] text-white/40 uppercase tracking-widest hover:text-white">← Quay lại</button>
                <h3 className="text-3xl font-display font-bold gold-gradient-text uppercase">Thông Tin Bản Mệnh</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Họ Tên</label>
                  <input type="text" value={data.fullName || ''} onChange={(e) => onChange({ ...data, fullName: e.target.value })} placeholder="Nguyễn Văn An" className="input-spiritual text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Giới Tính</label>
                  <div className="flex gap-2">
                    {['Nam', 'Nữ'].map(g => (
                      <button key={g} onClick={() => onChange({ ...data, gender: g as any })} className={`flex-1 py-3 rounded-xl border text-xs font-bold ${data.gender === g ? 'bg-accent/20 border-accent/40 text-accent' : 'border-white/5 text-white/20'}`}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ngày Sinh</label>
                  <input 
                    type="date" 
                    min="1900-01-01"
                    max={new Date().toISOString().split('T')[0]}
                    value={data.birthDate || ''} 
                    onChange={(e) => onChange({ ...data, birthDate: e.target.value })} 
                    className="input-spiritual text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Giờ Sinh</label>
                  <input type="time" value={data.birthTime || ''} onChange={(e) => onChange({ ...data, birthTime: e.target.value })} className="input-spiritual text-sm" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nơi Sinh</label>
                    <button 
                      type="button"
                      onClick={cycleEra}
                      className="flex items-center gap-1 text-[8px] font-bold text-gold/60 hover:text-gold transition-colors uppercase tracking-widest"
                    >
                      <RefreshCw size={10} /> {eraLabels[adminEra]}
                    </button>
                  </div>
                  <select
                    value={data.birthPlace || ''}
                    onChange={(e) => onChange({ ...data, birthPlace: e.target.value })}
                    className="input-spiritual text-sm appearance-none"
                  >
                    <option value="" disabled className="bg-paper">Chọn tỉnh thành</option>
                    {getFilteredProvinces().map(p => (
                      <option key={p.id} value={p.id} className="bg-paper">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nơi Ở Hiện Tại</label>
                    <button 
                      type="button"
                      onClick={cycleEra}
                      className="flex items-center gap-1 text-[8px] font-bold text-gold/60 hover:text-gold transition-colors uppercase tracking-widest"
                    >
                      <RefreshCw size={10} /> {eraLabels[adminEra]}
                    </button>
                  </div>
                  <select
                    value={data.currentPlace || ''}
                    onChange={(e) => onChange({ ...data, currentPlace: e.target.value })}
                    className="input-spiritual text-sm appearance-none"
                  >
                    <option value="" disabled className="bg-paper">Chọn tỉnh thành</option>
                    {getFilteredProvinces().map(p => (
                      <option key={p.id} value={p.id} className="bg-paper">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={() => onNext(data)} disabled={!canProceed()} className="btn-spiritual w-full py-5 text-sm uppercase tracking-[0.3em]">Bắt Đầu Luận Giải Chuyên Sâu</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Gradual Darkening Overlay */}
      <AnimatePresence>
        {isFadingToBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Solemn Black Screen Revelation Overlay */}
      <AnimatePresence>
        {showRevelation && revelationResult && (
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
                      {revelationResult}
                    </div>
                    
                    {/* Tướng Tinh Badge in Revelation */}
                    {HEXAGRAMS[revelationResult].tuongTinh && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3, duration: 1 }}
                        className="flex items-center gap-3 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm"
                      >
                        <span className="text-2xl font-serif text-gold">{HEXAGRAMS[revelationResult].tuongTinh?.char}</span>
                        <span className="text-[10px] text-gold/60 uppercase tracking-[0.2em] font-bold">Tướng Tinh: {HEXAGRAMS[revelationResult].tuongTinh?.animal}</span>
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
                      {HEXAGRAMS[revelationResult].name}
                    </div>
                    <div className="text-lg md:text-xl text-gold/80 font-serif italic">
                      "{HEXAGRAMS[revelationResult].meaning}"
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
                  onClick={() => {
                    onChange({
                      ...data,
                      divinationHexagram: revelationResult,
                      divinationIsCastDone: true
                    });
                    setShowRevelation(false);
                  }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
