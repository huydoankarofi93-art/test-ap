import React, { useRef, useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Download, 
  RefreshCw, 
  Share2, 
  Plus, 
  Star, 
  Flame, 
  Fingerprint, 
  Type, 
  Sparkles, 
  MapPin, 
  ShieldCheck,
  Compass,
  Loader2,
  Heart,
  Table as TableIcon,
  Info,
  ScrollText,
  Activity,
  Home,
  Zap,
  Printer,
  Maximize2,
  Sun,
  Moon,
  X,
  User,
  Calendar,
  Clock,
  Tag,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { InteractivePalmMap } from './InteractivePalmMap';
import PalmLineOverlay from './PalmLineOverlay';

import { TuViChart } from '../services/tuvi-engine/tuviChart';
import { TuViGrid } from './TuViGrid';
import { PalmImages, UserData } from '../types';

interface Props {
  content: string;
  onReset: () => void;
  tuviChart?: TuViChart;
  palmImages?: PalmImages;
  userData: UserData;
  isGenerating?: boolean;
  onUpgrade?: () => void;
  tokenUsage?: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
  sessionTotalTokens?: number;
}

const SynthesisSection = ({ content }: { content: string }) => {
  // Extract the synthesis part (usually at the end or under a specific header)
  const synthesisMatch = content.match(/(## (?:Hợp Nhất|Tổng Kết|Lời Kết|Huyền Cơ Hợp Nhất)[\s\S]*?)(?=##|$)/i);
  const synthesisContent = synthesisMatch ? synthesisMatch[1] : "";
  
  if (!synthesisContent) return null;

  const lines = synthesisContent.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('##'));
  
  return (
    <div className="mt-20 space-y-12" id="synthesis-section">
      <div className="relative p-12 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 overflow-hidden group shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-colors duration-1000" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-colors duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="w-32 h-32 shrink-0 rounded-full bg-gradient-to-tr from-accent to-purple-500 p-1 shadow-[0_0_50px_rgba(181,148,16,0.3)]">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white">
              <Sparkles size={56} className="animate-pulse text-accent" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-accent uppercase tracking-[0.4em]">Hợp Nhất Huyền Cơ</span>
              <h4 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
                Thiên Mệnh <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">& Thực Tại</span>
              </h4>
            </div>
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="markdown-body text-white/90 leading-relaxed text-lg font-serif italic">
                <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {lines.join('\n\n')}
                </Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-accent/20 transition-all shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6 text-accent">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <ScrollText size={24} />
            </div>
            <h5 className="font-bold uppercase tracking-[0.2em] text-sm">Tiền Định (Tử Vi)</h5>
          </div>
          <p className="text-base text-white/60 leading-relaxed italic font-serif">
            "Bản đồ thiên mệnh được khắc ghi từ lúc sơ sinh, định hình khung sườn và những cột mốc quan trọng của vận mệnh đời người."
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6 text-purple-400">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Fingerprint size={24} />
            </div>
            <h5 className="font-bold uppercase tracking-[0.2em] text-sm">Biến Chuyển (Chỉ Tay)</h5>
          </div>
          <p className="text-base text-white/60 leading-relaxed italic font-serif">
            "Dấu ấn thực tại phản ánh sự nỗ lực, tu dưỡng và những thay đổi do tâm thức xoay chuyển, giúp con vượt thoát định mệnh cũ."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const ReadingSummaryTicket: React.FC<{ userData: UserData; tuviChart?: TuViChart }> = ({ userData, tuviChart }) => {
  const [isCopied, setIsCopied] = useState(false);

  const getReadingTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      full: 'Luận Giải Toàn Diện',
      yearly: 'Vận Hạn Năm',
      monthly: 'Vận Hạn Tháng',
      daily: 'Vận Hạn Ngày',
      name: 'Đặt Tên Khai Sinh',
      baby_name: 'Đặt Tên Cho Bé',
      divination: 'Kinh Dịch Chiêm Bốc',
      palm: 'Nhân Tướng Chỉ Tay',
      tuvi: 'Lá Số Tử Vi',
      yearly_horoscope: 'Tử Vi Năm',
      seven_killings: 'Thất Sát Chiêm Nghiệm',
      numerology: 'Thần Số Học Pitago',
      villa: 'Góc Biệt Thự (Phái Nữ)'
    };
    return types[type] || type;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleCopy = async () => {
    const text = `Họ tên: ${userData.fullName || 'Ẩn danh'}\nNgày giờ sinh: ${userData.birthDate} • ${userData.birthTime}\nGiới tính: ${userData.gender}\nNơi sinh: ${userData.birthPlace}\nLoại hình: ${getReadingTypeLabel(userData.readingType)}`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Thông Tin Nhân Sinh - Thiên Mệnh Ký',
          text: `Đây là thông tin nhân sinh của ${userData.fullName || 'tôi'} từ Thiên Mệnh Ký.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div 
      initial={!isMobile ? { opacity: 0, y: 20 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 rounded-[2.5rem] border-2 border-gold/30 bg-gold/5 relative overflow-hidden backdrop-blur-xl shadow-2xl"
    >
      <div className="bg-gold/20 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gold/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
            <ScrollText className="text-gold" size={20} />
          </div>
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-[0.2em]">Phiếu Tổng Hợp Thông Tin Nhân Sinh</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Đã Đối Soát Thiên Cơ</span>
          </div>
          <div className="text-[10px] font-mono text-gold/60 bg-black/40 px-3 py-1 rounded-full border border-gold/10">
            Mã Số: TMK-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 hover:bg-white/10 rounded-lg text-gold/60 hover:text-gold transition-colors" title="In bản luận">
              <Printer size={16} />
            </button>
            <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg text-gold/60 hover:text-gold transition-colors" title="Sao chép">
              {isCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
            <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-lg text-gold/60 hover:text-gold transition-colors" title="Chia sẻ">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="space-y-1.5 border-l-2 border-emerald-500/20 pl-6 relative group">
          <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981]" />
          <p className="text-[10px] text-emerald-500/50 uppercase tracking-widest font-bold flex items-center gap-2">
            Trạng Thái Hệ Thống <ShieldCheck size={10} />
          </p>
          <p className="text-lg font-display font-bold text-emerald-400 uppercase tracking-wider">Tin Cậy Tuyệt Đối</p>
          <div className="absolute left-full ml-4 top-0 w-48 p-3 rounded-xl bg-slate-900 border border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
            <p className="text-[9px] text-emerald-400/80 leading-relaxed">Dữ liệu đã được đối soát qua 3 tầng thuật toán: Tử Vi Đẩu Số, Bát Tự Hà Lạc và Kinh Dịch Chiêm Bốc.</p>
          </div>
        </div>
        <div className="space-y-1.5 border-l-2 border-gold/20 pl-6">
          <p className="text-[10px] text-gold/50 uppercase tracking-widest font-bold">Họ và Tên</p>
          <p className="text-2xl font-display font-bold text-white">{userData.fullName || 'Ẩn danh'}</p>
        </div>
        <div className="space-y-1.5 border-l-2 border-gold/20 pl-6">
          <p className="text-[10px] text-gold/50 uppercase tracking-widest font-bold">Ngày Giờ Sinh</p>
          <p className="text-xl font-serif text-white/90">{userData.birthDate} • {userData.birthTime}</p>
        </div>
        <div className="space-y-1.5 border-l-2 border-gold/20 pl-6">
          <p className="text-[10px] text-gold/50 uppercase tracking-widest font-bold">Giới Tính</p>
          <p className="text-xl font-serif text-white/90">{userData.gender}</p>
        </div>
        <div className="space-y-1.5 border-l-2 border-gold/20 pl-6">
          <p className="text-[10px] text-gold/50 uppercase tracking-widest font-bold">Nơi Sinh</p>
          <p className="text-xl font-serif text-white/90">{userData.birthPlace}</p>
        </div>
        <div className="space-y-1.5 border-l-2 border-gold/20 pl-6">
          <p className="text-[10px] text-gold/50 uppercase tracking-widest font-bold">Gia Đạo</p>
          <p className="text-lg font-serif text-white/90">
            {userData.familyStatus ? (userData.familyStatus.hasSpouse ? (userData.familyStatus.isDivorced ? 'Đã ly hôn' : 'Đã kết hôn') : 'Độc thân') : 'N/A'}
            {userData.familyStatus?.hasChildren ? (
              userData.familyStatus.useTotalCount 
                ? ` • ${userData.familyStatus.totalChildren || 0} con`
                : ` • ${userData.familyStatus.numSons + userData.familyStatus.numDaughters} con`
            ) : ''}
          </p>
        </div>
        <div className="space-y-1.5 border-l-2 border-gold/20 pl-6">
          <p className="text-[10px] text-gold/50 uppercase tracking-widest font-bold">Loại Hình Luận Giải</p>
          <p className="text-lg font-display font-bold text-gold uppercase tracking-wider">{getReadingTypeLabel(userData.readingType)}</p>
        </div>
        {tuviChart && (
          <div className="space-y-1.5 border-l-2 border-gold/20 pl-6">
            <p className="text-[10px] text-gold/50 uppercase tracking-widest font-bold">Bản Mệnh</p>
            <p className="text-lg font-serif text-white/90">{tuviChart.menh}</p>
          </div>
        )}
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
        <ScrollText size={300} className="text-gold rotate-12" />
      </div>
    </motion.div>
  );
};

export const ReadingResult = React.memo(({ 
  content, 
  onReset, 
  tuviChart, 
  palmImages, 
  userData, 
  isGenerating,
  onUpgrade,
  tokenUsage, 
  sessionTotalTokens 
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingJPG, setIsDownloadingJPG] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showTokenUsage, setShowTokenUsage] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bản Luận Giải Thiên Mệnh Ký',
          text: `Bản luận giải tâm linh dành cho ${userData.fullName}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  // Warning before closing tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleResetClick = () => {
    setShowExitConfirm(true);
  };

  const confirmReset = () => {
    setShowExitConfirm(false);
    onReset();
  };

  const cancelReset = () => {
    setShowExitConfirm(false);
  };

  const isBasicMode = userData.readingMode === 'basic';

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = calculateAge(userData.birthDate);

  const generateCanvas = async () => {
    return new Promise<HTMLCanvasElement | null>(async (resolve) => {
      // Capture complex components as images first
      const captureComponent = async (selector: string) => {
        const el = document.querySelector(selector) as HTMLElement;
        if (!el) return null;
        try {
          const canvas = await html2canvas(el, {
            scale: 2,
            backgroundColor: '#0A0E1A',
            useCORS: true,
            logging: false,
          });
          return canvas.toDataURL('image/png');
        } catch (e) {
          console.error(`Failed to capture ${selector}`, e);
          return null;
        }
      };

      const tuviImage = await captureComponent('.tuvi-grid-container');
      const palmImage = await captureComponent('.palm-overlay-container');
      const radarImage = await captureComponent('.radar-chart-container');

      // Create a hidden iframe for ultimate isolation from main document CSS
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '1200px'; 
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        document.body.removeChild(iframe);
        resolve(null);
        return;
      }

      const parseImageRefsForPDF = (refStr: string) => {
        if (!palmImages) return [];
        const refs = refStr.split(',').map(r => r.trim());
        return refs.map(ref => {
          const normalizedRef = ref.toLowerCase();
          const coordMatch = ref.match(/[\[\(]\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*[\]\)]/);
          const coords = coordMatch ? coordMatch.slice(1, 5).map(Number) : null;
          const cleanLabel = ref.replace(/[\[\(].*[\]\)]/, '').trim();
          const normalizedCleanLabel = cleanLabel.toLowerCase();
          const allImages = [...(palmImages?.primary || []), ...(palmImages?.secondary || [])];
          let foundImg = allImages.find(img => img.label && normalizedCleanLabel.includes(img.label.toLowerCase()));
          
          if (!foundImg) {
            const isMale = userData.gender === 'Nam';
            const isLeftRef = normalizedCleanLabel.includes('trái');
            const isRightRef = normalizedCleanLabel.includes('phải');
            if (isLeftRef) {
              const targetArray = isMale ? palmImages?.primary : palmImages?.secondary;
              if (targetArray && targetArray.length > 0) foundImg = targetArray[0];
            } else if (isRightRef) {
              const targetArray = isMale ? palmImages?.secondary : palmImages?.primary;
              if (targetArray && targetArray.length > 0) foundImg = targetArray[0];
            }
          }
          
          if (!foundImg && (normalizedCleanLabel.includes('tay') || normalizedCleanLabel.includes('ảnh'))) {
            if (palmImages?.primary && palmImages.primary.length > 0) foundImg = palmImages.primary[0];
            else if (palmImages?.secondary && palmImages.secondary.length > 0) foundImg = palmImages.secondary[0];
          }
          
          return foundImg ? { data: foundImg.data, coords, label: cleanLabel } : null;
        }).filter(item => item !== null);
      };

      // Reconstruct content into clean HTML
      const sections = content.split(/(?=## )/g).filter(s => s.trim().length > 0);
      
      const getReadingTypeLabel = (type: string) => {
        const types: Record<string, string> = {
          full: 'Luận Giải Toàn Diện',
          yearly: 'Vận Hạn Năm',
          monthly: 'Vận Hạn Tháng',
          daily: 'Vận Hạn Ngày',
          name: 'Đặt Tên Khai Sinh',
          baby_name: 'Đặt Tên Cho Bé',
          divination: 'Kinh Dịch Chiêm Bốc',
          palm: 'Nhân Tướng Chỉ Tay',
          tuvi: 'Lá Số Tử Vi',
          yearly_horoscope: 'Tử Vi Năm',
          seven_killings: 'Thất Sát Chiêm Nghiệm',
          numerology: 'Thần Số Học Pitago',
          villa: 'Góc Biệt Thự (Phái Nữ)'
        };
        return types[type] || type;
      };

      let bodyHtml = `
        <div class="header">
          <h1>THIÊN MỆNH KÝ</h1>
          <p>Lời Giáo Huấn Huyền Vi - Ngày ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <div class="card" style="padding: 0; border: 2px solid #B59410; background: rgba(181, 148, 16, 0.05); position: relative; overflow: hidden;">
          <div style="background: #B59410; color: #0A0E1A; padding: 15px 40px; font-weight: bold; font-size: 18px; letter-spacing: 4px; text-transform: uppercase; text-align: center;">
            Phiếu Tổng Hợp Thông Tin Nhân Sinh
          </div>
          
          <div style="padding: 40px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;">
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Họ và Tên</p>
              <p style="font-size: 28px; font-weight: bold; margin: 5px 0 0 0; color: #fff; font-family: 'Times New Roman', serif;">${userData.fullName || 'Ẩn danh'}</p>
            </div>
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Ngày Giờ Sinh</p>
              <p style="font-size: 20px; margin: 5px 0 0 0; color: #fff;">${userData.birthDate} • ${userData.birthTime}</p>
            </div>
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Giới Tính</p>
              <p style="font-size: 20px; margin: 5px 0 0 0; color: #fff;">${userData.gender}</p>
            </div>
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Nơi Sinh</p>
              <p style="font-size: 20px; margin: 5px 0 0 0; color: #fff;">${userData.birthPlace}</p>
            </div>
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Gia Đạo</p>
              <p style="font-size: 18px; margin: 5px 0 0 0; color: #fff;">
                ${userData.familyStatus ? (userData.familyStatus.hasSpouse ? (userData.familyStatus.isDivorced ? 'Đã ly hôn' : 'Đã kết hôn') : 'Độc thân') : 'N/A'}
                ${userData.familyStatus?.hasChildren ? (
                  userData.familyStatus.useTotalCount 
                    ? ` • ${userData.familyStatus.totalChildren || 0} con`
                    : ` • ${userData.familyStatus.numSons + userData.familyStatus.numDaughters} con`
                ) : ''}
              </p>
            </div>
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Loại Hình Luận Giải</p>
              <p style="font-size: 18px; margin: 5px 0 0 0; color: #B59410; font-weight: bold;">${getReadingTypeLabel(userData.readingType).toUpperCase()}</p>
            </div>
            ${tuviChart ? `
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Bản Mệnh</p>
              <p style="font-size: 18px; margin: 5px 0 0 0; color: #fff;">${tuviChart.menh}</p>
            </div>
            ` : ''}
            <div style="border-left: 3px solid rgba(181, 148, 16, 0.4); padding-left: 20px;">
              <p style="font-size: 12px; color: rgba(181, 148, 16, 0.6); margin: 0; text-transform: uppercase; letter-spacing: 2px;">Mã Số Luận Giải</p>
              <p style="font-size: 18px; margin: 5px 0 0 0; color: #fff;">TMK-${Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
          </div>
          
          <div style="position: absolute; bottom: -20px; right: -20px; opacity: 0.1; transform: rotate(-15deg);">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#B59410" stroke-width="2"/>
              <path d="M50 10V90M10 50H90" stroke="#B59410" stroke-width="1"/>
              <circle cx="50" cy="50" r="20" stroke="#B59410" stroke-width="1"/>
            </svg>
          </div>
        </div>
      `;

      // Add Tu Vi Image if available
      if (tuviImage) {
        bodyHtml += `
          <div class="card">
            <h2>Bản Đồ Thiên Mệnh (Tử Vi)</h2>
            <div class="visual-container">
              <img src="${tuviImage}" style="width: 100%; border-radius: 20px; border: 1px solid rgba(181, 148, 16, 0.3);" />
            </div>
          </div>
        `;
      }

      // Add Radar Chart if available
      if (radarImage) {
        bodyHtml += `
          <div class="card">
            <h2>Biểu Đồ Vận Mệnh</h2>
            <div class="visual-container" style="text-align: center;">
              <img src="${radarImage}" style="width: 80%; max-width: 600px; border-radius: 20px;" />
            </div>
          </div>
        `;
      }

      sections.forEach(section => {
        const lines = section.split('\n');
        const title = lines[0].replace('## ', '').trim();
        
        // Skip sections that are purely technical or already handled
        if (title.toLowerCase().includes('hợp nhất') || title.toLowerCase().includes('tổng kết')) return;

        // Handle Palm Table in PDF/JPG
        let tableHtml = '';
        const isPalmSection = section.toUpperCase().includes('BẢNG TRÍCH XUẤT ĐẶC ĐIỂM TƯỚNG TAY') || section.includes('| Đặc điểm |');
        
        if (isPalmSection) {
          const tableStartIndex = lines.findIndex(l => l.includes('| Đặc điểm |') || l.includes('|Đặc điểm|'));
          if (tableStartIndex !== -1) {
            const tableLines = lines.slice(tableStartIndex).filter(l => l.trim().startsWith('|'));
            if (tableLines.length >= 3) {
              const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h && h !== '|');
              const rows = tableLines.slice(2).map(row => row.split('|').map(c => c.trim()).filter(c => c !== '')).filter(r => r.length > 0);
              
              tableHtml = `
                <div class="table-container" style="margin: 30px 0; border: 1px solid rgba(181, 148, 16, 0.2); border-radius: 15px; overflow: hidden;">
                  <div style="background: rgba(181, 148, 16, 0.1); padding: 15px; font-weight: bold; color: #B59410; border-bottom: 1px solid rgba(181, 148, 16, 0.2);">Bảng Trích Xuất Đặc Điểm Tướng Tay</div>
                  <table style="width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.02);">
                    <thead>
                      <tr style="background: rgba(181, 148, 16, 0.05);">
                        ${headers.map(h => `<th style="padding: 12px; text-align: left; font-size: 11px; color: #B59410; border-bottom: 1px solid rgba(181, 148, 16, 0.1);">${h}</th>`).join('')}
                        <th style="padding: 12px; text-align: left; font-size: 11px; color: #B59410; border-bottom: 1px solid rgba(181, 148, 16, 0.1);">Ảnh đối chiếu</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rows.map(row => {
                        // Try to find image refs in any cell if not explicitly in a column
                        let images: any[] = [];
                        row.forEach(cell => {
                          if (cell.includes('[') && cell.includes(']')) {
                            const found = parseImageRefsForPDF(cell);
                            if (found.length > 0) images = [...images, ...found];
                          }
                        });

                        return `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                          ${row.map((cell, j) => `<td style="padding: 12px; font-size: 12px; color: rgba(255,255,255,0.8); vertical-align: top;">${cell}</td>`).join('')}
                          <td style="padding: 12px; vertical-align: top; width: 150px;">
                            ${images.map(img => `
                              <div style="margin-bottom: 10px; border: 1px solid rgba(181, 148, 16, 0.3); border-radius: 8px; overflow: hidden;">
                                <img src="${img.data}" style="width: 100%; display: block;" />
                                <div style="font-size: 8px; color: #B59410; text-align: center; padding: 4px; background: rgba(0,0,0,0.5);">${img.label}</div>
                              </div>
                            `).join('')}
                          </td>
                        </tr>
                      `}).join('')}
                    </tbody>
                  </table>
                </div>
              `;
            }
          }
        }

        const bodyContent = lines.slice(1)
          .filter(line => {
            const l = line.trim();
            if (l.startsWith('|') || l.toLowerCase().includes('bảng trích xuất đặc điểm tướng tay')) return false;
            if (l.toLowerCase().includes('[ưu tiên:') || l.toLowerCase().includes('**[ưu tiên:')) return false;
            if (l.match(/(sự nghiệp|tài chính|tài vận|tình cảm|tình duyên|sức khỏe|con cái|cơ duyên):\s*([\w\s%]+)/i)) return false;
            if (l.toLowerCase().includes('mức độ ứng nghiệm:') || l.toLowerCase().includes('confidence index:')) return false;
            if (l.toLowerCase().includes('thế vận hiện tại:') || l.toLowerCase().includes('life progress index:')) return false;
            if (l.toLowerCase().includes('vị trí xã hội:')) return false;
            
            if (l.toLowerCase().includes('việc nên làm') || l.toLowerCase().includes('việc nên tránh') || l.toLowerCase().includes('hành thiện') || l.toLowerCase().includes('kiêng kỵ')) {
              if (l.length < 50) return false;
            }
            return true;
          })
          .join('\n');
        
        let formattedBody = bodyContent
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/^[-*] (.*)/gm, '<li>$1</li>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>')
          .replace(/#+$/, '') // Clean up trailing hashes
          .replace(/---$/, ''); // Clean up trailing separators
          
        formattedBody = formattedBody.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);
        
        bodyHtml += `
          <div class="card">
            <h2>${title}</h2>
            ${tableHtml}
            <div class="content">
              <p>${formattedBody}</p>
            </div>
          </div>
        `;
      });

      // Add Palm Overlay Image if available
      if (palmImage) {
        bodyHtml += `
          <div class="card">
            <h2>Dấu Ấn Thực Tại (Chỉ Tay)</h2>
            <div class="visual-container">
              <img src="${palmImage}" style="width: 100%; border-radius: 20px; border: 1px solid rgba(181, 148, 16, 0.3);" />
            </div>
          </div>
        `;
      }

      // Add Synthesis Section at the end
      const synthesisMatch = content.match(/(## (?:Hợp Nhất|Tổng Kết|Lời Kết|Huyền Cơ Hợp Nhất)[\s\S]*?)(?=##|$)/i);
      if (synthesisMatch) {
        const synthesisLines = synthesisMatch[1].split('\n').slice(1).filter(l => l.trim().length > 0);
        bodyHtml += `
          <div class="card" style="background: linear-gradient(135deg, rgba(181, 148, 16, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(181, 148, 16, 0.3);">
            <h2>Hợp Nhất Huyền Cơ</h2>
            <div class="content" style="font-style: italic; color: #fff;">
              <p>${synthesisLines.join('<br><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
            </div>
          </div>
        `;
      }

      bodyHtml += `
        <div class="footer">
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 150px; color: rgba(181, 148, 16, 0.03); font-weight: bold; pointer-events: none; white-space: nowrap; z-index: -1;">THIÊN MỆNH KÝ</div>
          <p class="footer-quote">"Tâm tịnh thì duyên khởi, đức dày thì nghiệp tan. Hãy dùng trí tuệ để soi đường, dùng từ bi để tích phúc."</p>
          <p class="footer-brand">© THIÊN MỆNH KÝ - HỆ THỐNG GIÁO HUẤN HUYỀN VI</p>
        </div>
      `;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            :root {
              --color-paper: #0A0E1A;
              --color-gold: #B59410;
              --color-accent: #B59410;
            }
            body { background-color: #0A0E1A; color: #FDFBF7; margin: 0; padding: 60px; font-family: 'Georgia', serif; }
            .header { text-align: center; margin-bottom: 60px; border-bottom: 2px solid var(--color-gold); padding-bottom: 40px; }
            h1 { color: var(--color-gold); font-size: 64px; margin: 0; font-weight: bold; letter-spacing: 4px; }
            .header p { color: var(--color-gold); font-size: 24px; font-style: italic; margin-top: 10px; opacity: 0.7; }
            .card { background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 40px; padding: 60px; margin-bottom: 60px; }
            h2 { color: var(--color-gold); font-size: 42px; margin: 0 0 40px 0; border-bottom: 1px solid rgba(181, 148, 16, 0.2); padding-bottom: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
            .content { font-size: 26px; line-height: 1.8; color: rgba(255,255,255,0.9); }
            .content p { margin-bottom: 30px; text-align: justify; }
            .visual-container { margin: 40px 0; }
            .table-container { margin: 40px 0; border: 1px solid rgba(181, 148, 16, 0.3); border-radius: 30px; overflow: hidden; background: rgba(181, 148, 16, 0.05); }
            .table-header { background: rgba(181, 148, 16, 0.2); padding: 20px 30px; font-weight: bold; color: var(--color-gold); font-size: 28px; border-bottom: 1px solid rgba(181, 148, 16, 0.3); }
            table { width: 100%; border-collapse: collapse; }
            th { background: rgba(181, 148, 16, 0.1); padding: 20px; text-align: left; font-size: 20px; color: var(--color-gold); text-transform: uppercase; }
            td { padding: 25px 20px; border-bottom: 1px solid rgba(181, 148, 16, 0.1); font-size: 22px; vertical-align: top; }
            td:first-child { font-weight: bold; color: var(--color-gold); }
            ul { list-style-type: none; padding-left: 30px; margin-bottom: 40px; border-left: 3px solid var(--color-gold); }
            li { margin-bottom: 15px; padding-left: 15px; position: relative; }
            strong { color: var(--color-gold); font-weight: bold; }
            em { color: rgba(255,255,255,0.7); font-style: italic; }
            .footer { text-align: center; margin-top: 100px; padding-top: 60px; border-top: 1px solid rgba(181, 148, 16, 0.2); }
            .footer-quote { font-style: italic; color: rgba(181, 148, 16, 0.5); font-size: 32px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            .footer-brand { color: rgba(181, 148, 16, 0.3); margin-top: 40px; font-size: 20px; letter-spacing: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div id="capture-root">
            ${bodyHtml}
          </div>
        </body>
        </html>
      `);
      doc.close();

      // Wait for rendering to complete
      setTimeout(async () => {
        try {
          const captureRoot = doc.getElementById('capture-root');
          if (!captureRoot) {
            resolve(null);
            return;
          }

          // Adjust iframe height to content
          iframe.style.height = doc.body.scrollHeight + 'px';
          
          const canvas = await html2canvas(captureRoot, {
            scale: 2,
            backgroundColor: '#0A0E1A',
            useCORS: true,
            logging: false,
          });
          resolve(canvas);
        } catch (err) {
          console.error('Iframe canvas error:', err);
          resolve(null);
        } finally {
          document.body.removeChild(iframe);
        }
      }, 1000); // Increased delay for images to load
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Remaining pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      const fileName = `${userData.fullName || 'An-danh'}-${userData.birthDate || 'ngay-sinh'}`.replace(/\s+/g, '-');
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('PDF Download failed:', error);
      alert('Không thể tạo file PDF. Vui lòng thử lại hoặc sử dụng tính năng In Bản Luận.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadJPG = async () => {
    setIsDownloadingJPG(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const fileName = `${userData.fullName || 'An-danh'}-${userData.birthDate || 'ngay-sinh'}`.replace(/\s+/g, '-');
      const link = document.createElement('a');
      link.download = `${fileName}.jpg`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error('JPG Download failed:', error);
      alert('Không thể tạo file ảnh. Vui lòng thử lại.');
    } finally {
      setIsDownloadingJPG(false);
    }
  };

  // Clean content for display (remove system_data tag, JSON blocks, and palace markers)
  const displayContent = content
    .replace(/<system_data>[\s\S]*?<\/system_data>/g, '')
    .replace(/```json\s*\{[\s\S]*?("palm_lines"|"palm_features")[\s\S]*?\}\s*```/g, '')
    .replace(/\[\[CUNG_[\s\S]*?(?=\[\[CUNG_|##|$)/g, '') // Remove palace blocks
    .trim();

  // Split content into sections based on ## headers
  const sections = displayContent.split(/(?=## )/g).filter(s => s.trim().length > 0);
  const introHook = sections[0] && !sections[0].startsWith('##') ? sections[0] : null;
  const mainSections = introHook ? sections.slice(1) : sections;
  
  const hasPalmReading = displayContent.toLowerCase().includes('chỉ tay') || displayContent.toLowerCase().includes('tướng tay');
  
  // Find the best section to show the palm table if it's not explicitly marked
  const palmSectionIndex = mainSections.findIndex(s => 
    s.toLowerCase().includes('tướng tay') || 
    s.toLowerCase().includes('chỉ tay') || 
    s.toUpperCase().includes('BẢNG TRÍCH XUẤT ĐẶC ĐIỂM TƯỚNG TAY')
  );
  
  const firstTableSectionIndex = palmSectionIndex;

  // Extract system data JSON if present
  const systemDataMatch = content.match(/<system_data>([\s\S]*?)<\/system_data>/i);
  const systemData = systemDataMatch ? (() => {
    try {
      return JSON.parse(systemDataMatch[1].trim());
    } catch (e) {
      console.error("Failed to parse system data", e);
      return null;
    }
  })() : null;

  const palmLinesData = systemData?.palm_lines ? systemData : (content.match(/```json\s*(\{[\s\S]*?"palm_lines"[\s\S]*?\})\s*```/i) ? (() => {
    try {
      const match = content.match(/```json\s*(\{[\s\S]*?"palm_lines"[\s\S]*?\})\s*```/i);
      return JSON.parse(match![1].trim());
    } catch (e) { return null; }
  })() : null);

  const getSectionIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('bản chất') || t.includes('căn mệnh') || t.includes('linh hồn')) return Star;
    if (t.includes('tiềm năng') || t.includes('nhân sinh') || t.includes('tam trụ')) return Flame;
    if (t.includes('tổng quan') || t.includes('vận mệnh') || t.includes('tứ trụ')) return Compass;
    if (t.includes('con cái') || t.includes('hậu duệ')) return ShieldCheck;
    if (t.includes('tình duyên') || t.includes('hôn nhân')) return Heart;
    if (t.includes('vị thế')) return MapPin;
    if (t.includes('chiến lược') || t.includes('tu thân') || t.includes('cố vấn')) return ShieldCheck;
    if (t.includes('nghiệp chướng') || t.includes('rủi ro') || t.includes('nghiệp lực')) return Flame;
    if (t.includes('duyên lành') || t.includes('cơ hội')) return Sparkles;
    if (t.includes('lời kết')) return Plus;
    if (t.includes('nên làm') || t.includes('hành thiện')) return Sparkles;
    if (t.includes('nên tránh') || t.includes('kiêng kỵ')) return ShieldCheck;
    if (t.includes('ứng kỳ') || t.includes('thời gian')) return Compass;
    if (t.includes('mô hình') || t.includes('pattern')) return Fingerprint;
    if (t.includes('chu kỳ')) return RefreshCw;
    if (t.includes('tính cách')) return Type;
    if (t.includes('thiên hướng')) return Compass;
    if (t.includes('khởi nguyên') || t.includes('địa khí') || t.includes('gốc rễ')) return MapPin;
    if (t.includes('danh tự')) return Type;
    if (t.includes('chữa lành') || t.includes('tâm lý') || t.includes('biệt thự')) return Home;
    if (t.includes('năng lượng') || t.includes('rung động')) return Zap;
    return Sparkles;
  };

  const CroppedImage = ({ data, coords, label, onClick }: { data: string, coords: number[] | null, label: string, onClick?: () => void }) => {
    const isGeneric = !coords || (coords[0] === 0 && coords[1] === 0 && coords[2] === 1000 && coords[3] === 1000);

    if (isGeneric) {
      return (
        <div className="relative group/img cursor-zoom-in" onClick={onClick}>
          <img 
            src={data} 
            alt={label} 
            className="w-full h-40 object-cover rounded-2xl border border-gold/20 group-hover/img:border-gold/50 transition-all"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
            <Maximize2 size={24} className="text-white" />
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-lg text-[8px] text-white/60 uppercase tracking-widest">
            Toàn cảnh
          </div>
        </div>
      );
    }

    // coords: [ymin, xmin, ymax, xmax] (0-1000)
    const [ymin, xmin, ymax, xmax] = coords!;
    
    // Calculate center and dimensions
    const centerX = (xmin + xmax) / 2;
    const centerY = (ymin + ymax) / 2;
    const width = Math.max(xmax - xmin, 100); 
    const height = Math.max(ymax - ymin, 100); 
    
    // Expand crop area
    const contextPadding = 0.6;
    const cropWidth = Math.min(width * (1 + contextPadding * 2), 1000);
    const cropHeight = Math.min(height * (1 + contextPadding * 2), 1000);
    
    const cropXmin = Math.max(centerX - cropWidth / 2, 0);
    const cropYmin = Math.max(centerY - cropHeight / 2, 0);
    
    const imgStyle: React.CSSProperties = {
      position: 'absolute',
      width: `${100000 / cropWidth}%`,
      height: `${100000 / cropHeight}%`,
      left: `${-cropXmin * 100 / cropWidth}%`,
      top: `${-cropYmin * 100 / cropHeight}%`,
      objectFit: 'cover',
    };

    return (
      <div className="relative group/img cursor-zoom-in" onClick={onClick}>
        <div className="w-full h-56 overflow-hidden rounded-2xl border-2 border-gold/30 group-hover/img:border-gold/60 transition-all bg-black relative shadow-lg">
          <img 
            src={data} 
            alt={label} 
            style={imgStyle}
            className="group-hover/img:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          
          {/* Red Circle Overlay - The "Khoanh Vùng" */}
          <div 
            className="absolute rounded-full border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] pointer-events-none flex items-center justify-center"
            style={{
              left: `${(centerX - cropXmin) * 100 / cropWidth}%`,
              top: `${(centerY - cropYmin) * 100 / cropHeight}%`,
              width: `${width * 100 / cropWidth}%`,
              height: `${height * 100 / cropHeight}%`,
              minWidth: '40px',
              minHeight: '40px',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-full h-full rounded-full border-2 border-white/30 animate-pulse" />
            <div className="absolute -top-6 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest whitespace-nowrap shadow-lg">
              Vùng phân tích
            </div>
          </div>
          
          {/* Label Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest truncate">{label}</p>
          </div>

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 size={24} className="text-white drop-shadow-lg" />
          </div>
        </div>
      </div>
    );
  };

  const PalmFeatureTable = ({ content, sectionTitle }: { content: string, sectionTitle?: string }) => {

      // 1. Try to use structured systemData if available
      const hasPalmFeatures = systemData?.palm_features && systemData.palm_features.length > 0;
      const isPalmSection = sectionTitle?.toLowerCase().includes('tướng tay') || sectionTitle?.toLowerCase().includes('chỉ tay') || content.toUpperCase().includes('BẢNG TRÍCH XUẤT ĐẶC ĐIỂM TƯỚNG TAY');

      if (hasPalmFeatures && isPalmSection) {
        const isRedundantHeader = sectionTitle?.toLowerCase().includes('bảng trích xuất đặc điểm tướng tay');
        
        return (
          <div className="my-12 space-y-8">
            {!isRedundantHeader && (
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold text-white uppercase tracking-wider">Bảng trích xuất đặc điểm tướng tay</h4>
                  <p className="text-xs text-white/40 font-serif italic">Các đặc điểm nhân trắc học được AI nhận diện từ ảnh chụp</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemData.palm_features.map((feature, idx) => {
                // Find the image data from palmImages
                let imageData = '';
                const allImages = [...(palmImages?.primary || []), ...(palmImages?.secondary || [])];
                
                if (feature.image_ref) {
                  const normalizedRef = feature.image_ref.toLowerCase();
                  const foundImg = allImages.find(img => 
                    img.label && normalizedRef.includes(img.label.toLowerCase())
                  );
                  if (foundImg) imageData = foundImg.data;
                }
                
                // Fallback to first image if not found
                if (!imageData && allImages.length > 0) {
                  imageData = allImages[0].data;
                }

                return (
                  <motion.div 
                    key={feature.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel p-6 border-white/5 hover:border-gold/20 transition-all group/feature"
                  >
                    <div className="flex flex-col gap-6">
                      {imageData && (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover/feature:border-gold/30 transition-all">
                          <CroppedImage 
                            data={imageData} 
                            coords={feature.bbox || null} 
                            label={feature.label} 
                            onClick={() => setZoomedImage(imageData)}
                          />
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-gold/10 rounded-lg text-[10px] font-bold text-gold uppercase tracking-widest border border-gold/20">
                            {feature.id}
                          </span>
                          <h5 className="text-lg font-display font-bold text-white group-hover/feature:text-gold transition-colors">
                            {feature.label}
                          </h5>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed font-serif italic">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      }

      // 2. Fallback to parsing markdown table (Legacy)
      if (!content.toUpperCase().includes('BẢNG TRÍCH XUẤT ĐẶC ĐIỂM TƯỚNG TAY')) return null;

    // Try to parse the markdown table
    const lines = content.split('\n');
    const tableStartIndex = lines.findIndex(l => l.includes('| Đặc điểm |') || l.includes('|Đặc điểm|'));
    if (tableStartIndex === -1) return null;

    const tableLines = lines.slice(tableStartIndex).filter(l => l.trim().startsWith('|'));
    if (tableLines.length < 3) return null;

    // Extract headers and rows
    const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h && h !== '|');
    const rows = tableLines.slice(2).map(row => {
      // Handle potential double pipes or extra separators
      const cells = row.split('|').map(c => c.trim()).filter(c => c !== '');
      return cells;
    }).filter(r => r.length > 0);

    // Check if we have an image column (usually index 4 or the last one if it contains image refs)
    const hasExplicitImageColumn = headers.some(h => h.toLowerCase().includes('ảnh') || h.toLowerCase().includes('đối chiếu'));
    const imageColumnIndex = hasExplicitImageColumn ? headers.findIndex(h => h.toLowerCase().includes('ảnh') || h.toLowerCase().includes('đối chiếu')) : -1;

    const parseImageRefs = (refStr: string) => {
      if (!palmImages) return [];
      
      // Split by comma if multiple images are referenced
      const refs = refStr.split(',').map(r => r.trim());
      
      return refs.map(ref => {
        const normalizedRef = ref.toLowerCase();
        
        // Extract coordinates if present: "Name [ymin, xmin, ymax, xmax]"
        const coordMatch = ref.match(/[\[\(]\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*[\]\)]/);
        const coords = coordMatch ? coordMatch.slice(1, 5).map(Number) : null;
        const cleanLabel = ref.replace(/[\[\(].*[\]\)]/, '').trim();
        const normalizedCleanLabel = cleanLabel.toLowerCase();

        // 1. Try to find by explicit label match
        const allImages = [...(palmImages?.primary || []), ...(palmImages?.secondary || [])];
        let foundImg = allImages.find(img => 
          img.label && normalizedCleanLabel.includes(img.label.toLowerCase())
        );

        // 2. Try to find by "Trái/Phải" keywords and gender logic
        if (!foundImg && palmImages) {
          const isMale = userData.gender === 'Nam';
          const isLeftRef = normalizedCleanLabel.includes('trái');
          const isRightRef = normalizedCleanLabel.includes('phải');

          if (isLeftRef) {
            // Male: Left is Primary, Female: Left is Secondary
            const targetArray = isMale ? palmImages?.primary : palmImages?.secondary;
            if (targetArray && targetArray.length > 0) foundImg = targetArray[0];
          } else if (isRightRef) {
            // Male: Right is Secondary, Female: Right is Primary
            const targetArray = isMale ? palmImages?.secondary : palmImages?.primary;
            if (targetArray && targetArray.length > 0) foundImg = targetArray[0];
          }
        }

        // 3. Fallback to first image if still not found and it's a generic reference
        if (!foundImg && palmImages && (normalizedCleanLabel.includes('tay') || normalizedCleanLabel.includes('ảnh'))) {
          if (palmImages?.primary && palmImages.primary.length > 0) foundImg = palmImages.primary[0];
          else if (palmImages?.secondary && palmImages.secondary.length > 0) foundImg = palmImages.secondary[0];
        }

        return foundImg ? { data: foundImg.data, coords, label: cleanLabel } : null;
      }).filter((item): item is { data: string, coords: number[] | null, label: string } => item !== null);
    };

    return (
      <div className="my-20 overflow-hidden rounded-[2.5rem] border border-gold/20 bg-gold/[0.02] backdrop-blur-xl shadow-2xl shadow-gold/5">
        <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-transparent px-10 py-6 border-b border-gold/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
            <TableIcon size={20} className="text-gold" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-display font-bold text-gold uppercase tracking-[0.2em]">Bảng Trích Xuất Đặc Điểm Tướng Tay</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest italic">Phân tích đa chiều: Duy vật & Duy tâm</p>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gold/10 bg-gold/[0.05]">
                {headers.map((header, i) => (
                  <th key={i} className={`px-8 py-5 text-[10px] font-bold text-gold/60 uppercase tracking-[0.2em] whitespace-nowrap ${i === 3 ? 'w-1/4' : i === 4 ? 'w-1/6' : ''}`}>
                    {header}
                  </th>
                ))}
                {!hasExplicitImageColumn && (
                  <th className="px-8 py-5 text-[10px] font-bold text-gold/60 uppercase tracking-[0.2em] whitespace-nowrap w-1/6">
                    Ảnh Đối Chiếu
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {rows.map((row, i) => {
                // Try to find images in the row if no explicit column
                let autoImages: any[] = [];
                if (!hasExplicitImageColumn) {
                  row.forEach(cell => {
                    if (cell.includes('[') && cell.includes(']')) {
                      const found = parseImageRefs(cell);
                      if (found.length > 0) autoImages = [...autoImages, ...found];
                    }
                  });
                }

                return (
                  <tr key={i} className="hover:bg-gold/[0.03] transition-colors group">
                    {row.map((cell, j) => {
                      const isImageColumn = j === imageColumnIndex;
                      const images = isImageColumn ? parseImageRefs(cell) : [];

                      return (
                        <td key={j} className={`px-8 py-8 text-sm leading-relaxed align-top ${j === 0 ? 'font-bold text-gold' : 'text-white/80'}`}>
                          {j === 3 && headers.length > 3 ? (
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 text-accent/60 group-hover:text-accent transition-colors">
                                <Info size={14} className="flex-shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Dẫn chứng & Phân tích</span>
                              </div>
                              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 italic text-white/70 font-serif leading-loose">
                                {cell}
                              </div>
                            </div>
                          ) : isImageColumn ? (
                            <div className="space-y-4">
                              {images.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                  {images.map((img, idx) => (
                                    <div key={idx} className="space-y-2">
                                      <CroppedImage data={img.data} coords={img.coords} label={img.label} />
                                      <div className="text-[9px] text-gold/40 uppercase tracking-widest text-center font-bold">{img.label}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="w-full h-24 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-[8px] text-white/20 uppercase tracking-widest text-center px-2">
                                  Không có ảnh đối chiếu
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {cell.split('\n').map((line, idx) => (
                                <p key={idx}>{line}</p>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    {!hasExplicitImageColumn && (
                      <td className="px-8 py-8 text-sm leading-relaxed align-top">
                        <div className="space-y-4">
                          {autoImages.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                              {autoImages.map((img, idx) => (
                                <div key={idx} className="space-y-2">
                                  <CroppedImage data={img.data} coords={img.coords} label={img.label} />
                                  <div className="text-[9px] text-gold/40 uppercase tracking-widest text-center font-bold">{img.label}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="w-full h-24 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-[8px] text-white/20 uppercase tracking-widest text-center px-2">
                              Không có ảnh đối chiếu
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-accent/5 px-10 py-6 border-t border-gold/10 flex items-center justify-between">
          <p className="text-[10px] text-gold/40 uppercase tracking-[0.3em] italic">
            * Dữ liệu được trích xuất trực tiếp từ hình thái lòng bàn tay của bạn
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold/40 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-gold/40 animate-pulse delay-75" />
            <div className="w-1 h-1 rounded-full bg-gold/40 animate-pulse delay-150" />
          </div>
        </div>
      </div>
    );
  };

  const DestinyCharts = ({ sectionContent }: { sectionContent: string }) => {
    // Basic parser for scores like "Sự nghiệp: Hanh Thông" or "Sự nghiệp: 72%"
    const scores: { name: string; value: number; label: string }[] = [];
    const lines = sectionContent.split('\n');
    
    const levelMap: Record<string, number> = {
      'Đại cát': 95,
      'Thượng cát': 80,
      'Cát': 65,
      'Bình': 50,
      'Tiểu hung': 35,
      'Hung': 20,
      'Đại hung': 10,
      'Viên Mãn': 95,
      'Hanh Thông': 80,
      'Bình Hòa': 60,
      'Trắc Trở': 40,
      'Nghiệp Nặng': 20,
      'Đang mở vận': 85,
      'Có đà phát triển': 70,
      'Bình hòa': 50,
      'Cần kiên nhẫn': 30,
      'Tài lộc dồi dào': 85,
      'Đang tích lũy': 70,
      'Bình ổn': 50,
      'Cần thận trọng': 30,
      'Duyên lành hội tụ': 85,
      'Có hỷ sự': 70,
      'Có thử thách': 30,
      'Khí huyết sung mãn': 85,
      'Tương đối ổn': 70,
      'Bình thường': 50,
      'Cần điều dưỡng': 30
    };

    lines.forEach(line => {
      const match = line.match(/(Sự nghiệp|Tài chính|Tài vận|Tình cảm|Tình duyên|Sức khỏe|Con cái|Cơ duyên|Vận mệnh|Công danh):\s*\*?\*?([^*|\n]+)\*?\*?/i);
      if (match) {
        const name = match[1];
        const rawValue = match[2].trim();
        
        let value = 0;
        let label = rawValue;

        // Try to find in map
        const foundLevel = Object.keys(levelMap).find(k => rawValue.toLowerCase().includes(k.toLowerCase()));
        if (foundLevel) {
          value = levelMap[foundLevel];
          label = foundLevel;
        } else if (rawValue.includes('%')) {
          value = parseInt(rawValue, 10);
        }

        if (value > 0) {
          scores.push({ name, value, label });
        }
      }
    });

    if (scores.length === 0) return null;

    return (
      <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-8 radar-chart-container">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scores}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
              />
              <Radar
                name="Vận Mệnh"
                dataKey="value"
                stroke="#B59410"
                fill="#B59410"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {scores.map((score, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-white/5"
                    strokeDasharray="100, 100"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-accent"
                    strokeDasharray={`${score.value}, 100`}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white uppercase text-center px-1 leading-tight">
                  {score.label}
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">{score.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PriorityTaskList = ({ sectionContent }: { sectionContent: string }) => {
    const tasks: { text: string; priority: 'Cao' | 'Trung bình' | 'Thấp'; type: 'do' | 'avoid' }[] = [];
    const lines = sectionContent.split('\n');
    
    let currentType: 'do' | 'avoid' = 'do';

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('việc nên tránh') || trimmed.toLowerCase().includes('kiêng kỵ')) {
        currentType = 'avoid';
      } else if (trimmed.toLowerCase().includes('việc nên làm') || trimmed.toLowerCase().includes('hành thiện')) {
        currentType = 'do';
      }

      const priorityMatch = line.match(/\[Ưu tiên:\s*(Cao|Trung bình|Thấp)\]/i);
      if (priorityMatch) {
        const priority = priorityMatch[1] as 'Cao' | 'Trung bình' | 'Thấp';
        // Clean up the text: remove the priority marker and the list bullet
        const text = line.replace(/[-*]\s*/, '').replace(/\[Ưu tiên:\s*(Cao|Trung bình|Thấp)\]/i, '').trim();
        if (text) {
          tasks.push({ text, priority, type: currentType });
        }
      }
    });

    if (tasks.length === 0) return null;

    const priorityColors = {
      'Cao': 'border-red-500/50 bg-red-500/10 text-red-400',
      'Trung bình': 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
      'Thấp': 'border-blue-500/50 bg-blue-500/10 text-blue-400'
    };

    const priorityBadges = {
      'Cao': 'bg-red-500 text-white',
      'Trung bình': 'bg-yellow-500 text-black',
      'Thấp': 'bg-blue-500 text-white'
    };

    return (
      <div className="mt-20 space-y-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
            <ShieldCheck className="text-accent" size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-display font-bold text-white uppercase tracking-[0.2em]">Danh Mục Hành Động Ưu Tiên</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest italic">Hướng dẫn cải vận & bảo an</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl border ${priorityColors[task.priority]} backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-all`}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest ${priorityBadges[task.priority]}`}>
                    Ưu tiên {task.priority}
                  </span>
                  {task.type === 'avoid' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Kiêng Kỵ</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Nên Làm</span>
                    </div>
                  )}
                </div>
                <p className="text-base font-serif leading-loose text-white/90">
                  {task.text}
                </p>
              </div>
              {/* Subtle background icon */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                {task.type === 'avoid' ? <ShieldCheck size={120} /> : <Sparkles size={120} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const ConfidenceDisplay = ({ sectionContent }: { sectionContent: string }) => {
    // Match "Mức độ ứng nghiệm: **Rất cao**" or "Độ ứng nghiệm dự kiến: 85%"
    const match = sectionContent.match(/(?:Mức độ ứng nghiệm|Độ ứng nghiệm dự kiến):\s*\*?\*?([^*|\n]+)\*?\*?/i) || sectionContent.match(/Confidence Index:\s*(\d+)%/i);
    if (!match) return null;
    
    const rawValue = match[1].trim();
    const isLabel = isNaN(parseInt(rawValue, 10));
    const label = isLabel ? rawValue : null;
    
    // Map labels to values for the progress bar
    const valueMap: Record<string, number> = {
      'Rất cao': 95,
      'Cao': 75,
      'Trung bình': 50,
      'Thấp': 25
    };
    
    const value = !isLabel ? parseInt(rawValue, 10) : (valueMap[label || ''] || 50);

    return (
      <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-accent" size={24} />
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Mức Độ Ứng Nghiệm</h4>
          </div>
          <span className="text-2xl font-display font-bold text-accent">{label || `${value}%`}</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${value}%` }}
            className="h-full bg-accent shadow-[0_0_10px_rgba(181,148,16,0.5)]"
          />
        </div>
        <p className="mt-4 text-xs text-white/40 italic">
          * Chỉ số phản ánh mức độ nhất quán giữa Can Chi, Ngũ hành, Điểm số thực tế và Nội dung luận giải.
        </p>
      </div>
    );
  };

  const LifeProgressDisplay = ({ sectionContent }: { sectionContent: string }) => {
    const indexMatch = sectionContent.match(/Thế vận hiện tại:\s*\*?\*?([^*|\n]+)\*?\*?/i) || sectionContent.match(/Life Progress Index:\s*(\d+)\/100/i);
    const socialMatch = sectionContent.match(/Vị trí xã hội:\s*\*?\*?Top\s*(\d+)%\*?\*?/i);
    
    if (!indexMatch && !socialMatch) return null;

    const rawIndexValue = indexMatch ? indexMatch[1].trim() : null;
    const indexLabel = rawIndexValue && isNaN(parseInt(rawIndexValue, 10)) ? rawIndexValue : null;
    
    const indexValueMap: Record<string, number> = {
      'Đang thịnh': 90,
      'Đang mở vận': 75,
      'Đang tích lũy': 55,
      'Đang chuyển vận': 35,
      'Chưa khai vận': 15
    };

    const indexValue = indexMatch && !indexLabel ? parseInt(rawIndexValue!, 10) : (indexValueMap[indexLabel || ''] || 50);
    const socialValue = socialMatch ? parseInt(socialMatch[1], 10) : null;

    return (
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {indexMatch && (
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Thế Vận Hiện Tại</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl md:text-3xl font-display font-bold text-white">{indexLabel || indexValue}</span>
              {!indexLabel && <span className="text-white/20 mb-1">/ 100</span>}
            </div>
            <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gold/40" style={{ width: `${indexValue}%` }} />
            </div>
          </div>
        )}
        {socialValue !== null && (
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Vị Thế Xã Hội</div>
            <div className="flex items-end gap-2">
              <span className="text-white/20 mb-1">Top</span>
              <span className="text-4xl font-display font-bold text-accent">{socialValue}%</span>
            </div>
            <p className="mt-2 text-[10px] text-white/30 italic">So với chúng sinh cùng trang lứa</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl 2xl:max-w-7xl mx-auto space-y-8 md:space-y-16 2xl:space-y-24 pb-32 px-4 md:px-0">
      <div ref={contentRef} id="printable-content" className="space-y-8 md:space-y-16 2xl:space-y-24 relative">
        {/* Background Watermark for PDF */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px]">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gold">
              <path fill="currentColor" d="M100,25 C112,25 122,35 122,50 C122,65 112,75 100,75 C88,75 78,65 78,50 C78,35 88,25 100,25 Z M100,80 C135,80 165,110 165,150 L165,185 L35,185 L35,150 C35,110 65,80 100,80 Z" />
            </svg>
          </div>
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rotate-180">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gold">
              <path fill="currentColor" d="M100,25 C112,25 122,35 122,50 C122,65 112,75 100,75 C88,75 78,65 78,50 C78,35 88,25 100,25 Z M100,80 C135,80 165,110 165,150 L165,185 L35,185 L35,150 C35,110 65,80 100,80 Z" />
            </svg>
          </div>
        </div>
        {/* Summary Ticket */}
        <ReadingSummaryTicket userData={userData} tuviChart={tuviChart} />

        {isBasicMode && (
          <div className="flex justify-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onUpgrade}
              className="group relative px-8 py-4 bg-gold text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all shadow-[0_0_30px_rgba(181,148,16,0.2)] flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles size={20} className="animate-pulse" />
              <span>Mở Khóa Luận Giải Chuyên Sâu (Full Mode)</span>
            </motion.button>
          </div>
        )}

        {/* Header Card / Intro */}
        <div className="glass-panel relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
          <div className="card-body space-y-8 md:space-y-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full -z-10" />
              <Plus size={64} className="md:w-24 md:h-24 mx-auto text-accent/40" />
            </div>
            <div className="space-y-6">
              <span className="section-subtitle">Lời Khuyên Từ Bậc Bề Trên</span>
              <h2 className="section-title">Giáo Huấn Của Thầy</h2>
              <div className="flex items-center justify-center gap-6 md:gap-12">
                <div className="h-px w-12 md:w-32 bg-gold/10" />
                <div className="text-white/50 italic font-serif text-base md:text-2xl max-w-3xl mx-auto leading-relaxed">
                  {introHook ? (
                    <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{introHook}</Markdown>
                  ) : (
                    <p>"Thiên cơ bất khả lộ, nhưng từ bi có thể soi đường. Hãy chiêm nghiệm từng lời để thấu hiểu nghiệp lực và chuyển hóa vận mệnh."</p>
                  )}
                </div>
                <div className="h-px w-12 md:w-32 bg-gold/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Tu Vi Chart Grid */}
        {tuviChart && !isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <span className="section-subtitle">Bản Đồ Thiên Mệnh</span>
              <h2 className="section-title">Lá Số Tử Vi</h2>
              <div className="flex items-center justify-center gap-4 text-white/40 text-sm font-serif italic">
                <span>Âm lịch: Ngày {tuviChart.lunarDate.day} tháng {tuviChart.lunarDate.month} năm {tuviChart.lunarDate.year} {tuviChart.lunarDate.isLeap ? '(Tháng Nhuận)' : ''}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>Giờ {tuviChart.hourCanChi.chi}</span>
              </div>
            </div>
            <div className="tuvi-grid-container">
              <TuViGrid 
                chart={tuviChart} 
                userData={userData} 
                content={content} 
                isGenerating={isGenerating}
                palmImages={palmImages}
                systemData={systemData}
              />
            </div>
          </motion.div>
        )}

        {/* Section Cards */}
        <div className="grid grid-cols-1 gap-12 md:gap-20 2xl:gap-12">
          {mainSections.map((section, index) => {
            const titleMatch = section.match(/^## (.*)/);
            const title = titleMatch ? titleMatch[1] : `Phần ${index + 1}`;
            const Icon = getSectionIcon(title);
            
            return (
              <div 
                key={index}
                id={`section-${index}`}
                className={`glass-panel hover:bg-white/[0.04] group relative border-white/5 hover:border-accent/20 transition-all duration-700`}
              >
                {/* Decorative side accent */}
                <div className="absolute left-0 top-12 bottom-12 w-1 bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Section Header with Icon */}
                <div className="card-header flex items-center justify-between gap-8">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent/10 transition-all duration-700">
                      <Icon size={40} />
                    </div>
                    <div>
                      <span className="section-subtitle mb-1">Kiến Giải Huyền Cơ</span>
                      <h3 className="text-2xl md:text-4xl font-display font-bold text-white group-hover:text-accent transition-colors duration-700">
                        {title}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(section);
                      alert(`Đã sao chép phần "${title}"!`);
                    }}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all opacity-0 group-hover:opacity-100"
                    title="Sao chép phần này"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="card-body">
                  {/* Subtle index number */}
                  <div className="absolute -top-6 md:-top-12 -right-6 md:-right-12 text-[8rem] md:text-[15rem] font-display font-bold text-white/[0.01] select-none pointer-events-none group-hover:text-accent/[0.02] transition-colors duration-700">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  
                  <div className="markdown-body relative z-10">
                    {title.toLowerCase().includes('chỉ tay') && palmLinesData && palmImages?.primary && palmImages.primary.length > 0 && (
                      <div className="mb-12 palm-overlay-container">
                        <PalmLineOverlay 
                          imageUrl={palmImages.primary[0].data} 
                          lines={palmLinesData.palm_lines} 
                          title="Sơ đồ đường chỉ tay chi tiết (Tiền định)"
                        />
                      </div>
                    )}
                    {((introHook ? index + 1 : index) === firstTableSectionIndex) && <PalmFeatureTable content={section} sectionTitle={title} />}
                    <Markdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        table: ({ children }) => (
                          <div className="my-12 overflow-x-auto custom-scrollbar">
                            <table className="spiritual-table">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => <thead>{children}</thead>,
                        th: ({ children }) => <th>{children}</th>,
                        td: ({ children }) => <td>{children}</td>,
                        li: ({ children, ...props }) => {
                          const getText = (node: any): string => {
                            if (typeof node === 'string') return node;
                            if (Array.isArray(node)) return node.map(getText).join('');
                            if (node?.props?.children) return getText(node.props.children);
                            return '';
                          };
                          const content = getText(children);
                          let priorityClass = '';
                          if (content.includes('Ưu tiên: Cao')) priorityClass = 'border-l-4 border-red-500 pl-4 my-2 bg-red-500/5 py-2 rounded-r-lg';
                          else if (content.includes('Ưu tiên: Trung bình')) priorityClass = 'border-l-4 border-yellow-500 pl-4 my-2 bg-yellow-500/5 py-2 rounded-r-lg';
                          else if (content.includes('Ưu tiên: Thấp')) priorityClass = 'border-l-4 border-blue-500 pl-4 my-2 bg-blue-500/5 py-2 rounded-r-lg';
                          
                          return (
                            <li className={priorityClass} {...props}>
                              {children}
                            </li>
                          );
                        },
                        strong: ({ children, ...props }) => {
                          const getText = (node: any): string => {
                            if (typeof node === 'string') return node;
                            if (Array.isArray(node)) return node.map(getText).join('');
                            if (node?.props?.children) return getText(node.props.children);
                            return '';
                          };
                          const content = getText(children);
                          if (content.includes('Ưu tiên: Cao')) return <strong className="text-red-500 font-bold" {...props}>{children}</strong>;
                          if (content.includes('Ưu tiên: Trung bình')) return <strong className="text-yellow-500 font-bold" {...props}>{children}</strong>;
                          if (content.includes('Ưu tiên: Thấp')) return <strong className="text-blue-500 font-bold" {...props}>{children}</strong>;
                          return <strong {...props}>{children}</strong>;
                        },
                        img: ({ src, alt, ...props }) => {
                          if (src?.startsWith('palm_feature:')) {
                            const featureId = src.split(':')[1];
                            let feature = systemData?.palm_features?.find((f: any) => f.id === featureId);
                            
                            // Fallback to finding by label if ID doesn't match
                            if (!feature && alt) {
                              feature = systemData?.palm_features?.find((f: any) => 
                                f.label && f.label.toLowerCase().includes(alt.toLowerCase())
                              );
                            }
                            
                            if (feature) {
                              let imageData = '';
                              const allImages = [...(palmImages?.primary || []), ...(palmImages?.secondary || [])];
                              
                              if (feature.image_ref) {
                                const normalizedRef = feature.image_ref.toLowerCase();
                                const foundImg = allImages.find(img => 
                                  img.label && normalizedRef.includes(img.label.toLowerCase())
                                );
                                if (foundImg) imageData = foundImg.data;
                              }
                              
                              if (!imageData && allImages.length > 0) {
                                imageData = allImages[0].data;
                              }

                              if (imageData) {
                                return (
                                  <div className="my-8 max-w-md mx-auto">
                                    <CroppedImage 
                                      data={imageData} 
                                      coords={feature.bbox || null} 
                                      label={alt || feature.label} 
                                      onClick={() => setZoomedImage(imageData)}
                                    />
                                    <p className="mt-2 text-center text-xs text-white/40 font-serif italic">
                                      Minh họa: {alt || feature.label} (Trích xuất từ ảnh gốc)
                                    </p>
                                  </div>
                                );
                              }
                            }
                            // If it's a palm_feature but we couldn't find data, don't show a broken image
                            return null;
                          }
                          return <img src={src} alt={alt} referrerPolicy="no-referrer" {...props} />;
                        }
                      }}
                    >
                      {section
                        .split('\n')
                        .filter(line => {
                          const l = line.trim().toLowerCase();
                          
                          // Filter out the palm table from Markdown as it's handled by PalmFeatureTable
                          if (l.startsWith('|') || l.includes('bảng trích xuất đặc điểm tướng tay')) return false;

                          // Filter out JSON blocks
                          if (l.startsWith('```json') || l.startsWith('```') || l.includes('"palm_lines"')) {
                            // This is a bit naive but should work for the palm_lines block
                            return false;
                          }

                          // Filter out lines that are handled by specialized visual components
                          if (l.includes('[ưu tiên:') || l.includes('**[ưu tiên:')) return false;
                          if (l.match(/(sự nghiệp|tài chính|tài vận|tình cảm|tình duyên|sức khỏe|con cái|cơ duyên|vận mệnh):\s*([\w\s%]+)/i)) return false;
                          if (l.includes('mức độ ứng nghiệm:') || l.includes('độ ứng nghiệm dự kiến:') || l.includes('confidence index:')) return false;
                          if (l.includes('thế vận hiện tại:') || l.includes('life progress index:')) return false;
                          if (l.includes('vị trí xã hội:')) return false;
                          
                          // Filter out headers that introduce priority tasks to avoid empty headers
                          if (l.includes('việc nên làm') || l.includes('việc nên tránh') || l.includes('hành thiện') || l.includes('kiêng kỵ')) {
                            // Only filter if it looks like a header (short line)
                            if (l.length < 50) return false;
                          }
                          
                          return true;
                        })
                        .join('\n')
                        .replace(/^## .*\n?/, '')
                      }
                    </Markdown>
                  </div>
                  <DestinyCharts sectionContent={section} />
                  <PriorityTaskList sectionContent={section} />
                  <LifeProgressDisplay sectionContent={section} />
                  <ConfidenceDisplay sectionContent={section} />
                  
                  {(title.toLowerCase().includes('tổng hợp') || title.toLowerCase().includes('hợp nhất') || title.toLowerCase().includes('tổng kết')) && (
                    <SynthesisSection content={section} />
                  )}
                </div>
              </div>
            );
          })}

          {isBasicMode && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-12 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-gold/30 overflow-hidden shadow-2xl text-center space-y-8"
            >
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 text-gold mb-4 border border-gold/20 shadow-[0_0_30px_rgba(181,148,16,0.1)]">
                  <ShieldCheck size={40} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gold uppercase tracking-[0.4em]">Huyền Cơ Còn Ẩn Giấu</span>
                  <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
                    Mở Khóa <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Luận Giải Chuyên Sâu</span>
                  </h3>
                </div>
                <p className="text-white/60 text-lg max-w-2xl mx-auto font-serif italic leading-relaxed">
                  Ta thấy trong lá số của con còn nhiều huyền cơ chưa được hé lộ, đặc biệt là sự biến chuyển của 14 chính tinh, các đại vận 10 năm và tướng tay thực tại. Hãy mở gói Chuyên Sâu để thấu thị toàn bộ vận mệnh và nhận lộ trình hành động chi tiết.
                </p>
                <div className="pt-6">
                  <button 
                    onClick={onUpgrade}
                    className="group relative px-12 py-5 bg-gold text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all shadow-[0_0_50px_rgba(181,148,16,0.3)] flex items-center gap-3 mx-auto overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Sparkles size={24} className="animate-pulse" />
                    <span className="text-lg">Mở Khóa Toàn Bộ (Full Mode)</span>
                  </button>
                  <p className="mt-4 text-xs text-white/30 tracking-widest uppercase">Phân tích 14 cung • Xem chỉ tay • Kinh dịch • Bảng JSON</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Interactive Palm Guide (Conditional) */}
        {hasPalmReading && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel relative overflow-hidden"
          >
            <div className="card-header flex items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Fingerprint size={40} />
              </div>
              <div>
                <span className="section-subtitle mb-1">Pháp Bảo Đối Chiếu</span>
                <h3 className="text-2xl md:text-4xl font-display font-bold text-white">Sơ đồ giải phẫu bàn tay</h3>
              </div>
            </div>
            <div className="card-body">
              <p className="text-white/40 font-serif italic mb-8 max-w-2xl">
                Sử dụng sơ đồ tương tác dưới đây để đối chiếu với các đường chỉ tay được nhắc đến trong bản luận giải của bạn. Nhấn vào một vùng để tìm đoạn luận giải tương ứng.
              </p>
              <InteractivePalmMap 
                onAreaClick={(area) => {
                  const sectionIndex = mainSections.findIndex(s => 
                    s.toLowerCase().includes(area.vietnameseName.toLowerCase()) || 
                    s.toLowerCase().includes(area.name.toLowerCase())
                  );
                  if (sectionIndex !== -1) {
                    const sectionElement = document.getElementById(`section-${sectionIndex}`);
                    sectionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Floating Token Usage Table with VND Cost */}
        {tokenUsage && (
          <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
            <AnimatePresence>
              {showTokenUsage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-black/90 backdrop-blur-2xl border border-gold/30 rounded-2xl shadow-2xl overflow-hidden min-w-[240px]"
                >
                  <div className="bg-gold/20 px-4 py-2 border-b border-gold/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gold">
                      <Activity size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Chi phí Linh Khí (Google)</span>
                    </div>
                    <button 
                      onClick={() => setShowTokenUsage(false)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <table className="w-full text-[10px] uppercase tracking-wider">
                      <tbody className="space-y-2">
                        <tr className="flex justify-between items-center">
                          <td className="text-white/40">Thiên Cơ (Input):</td>
                          <td className="text-white/80 font-mono">{tokenUsage.promptTokens.toLocaleString()}</td>
                        </tr>
                        <tr className="flex justify-between items-center">
                          <td className="text-white/40">Kiến Giải (Output):</td>
                          <td className="text-white/80 font-mono">{tokenUsage.candidatesTokens.toLocaleString()}</td>
                        </tr>
                        <tr className="h-px bg-white/10 my-2 w-full block"></tr>
                        <tr className="flex justify-between items-center font-bold">
                          <td className="text-gold/60">Tổng Token:</td>
                          <td className="text-gold font-mono">{tokenUsage.totalTokens.toLocaleString()}</td>
                        </tr>
                        <tr className="flex justify-between items-center font-bold text-emerald-400 mt-2 pt-2 border-t border-white/10">
                          <td className="text-[9px]">Thành tiền (VND):</td>
                          <td className="text-xs font-mono">
                            {Math.ceil(
                              ((tokenUsage.promptTokens * 0.075 / 1000000) + (tokenUsage.candidatesTokens * 0.30 / 1000000)) * 25400 * 1.1
                            ).toLocaleString()} đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-[8px] text-white/20 italic text-center border-t border-white/5 pt-2">
                      * Đã bao gồm thuế VAT 10%
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTokenUsage(!showTokenUsage)}
              className={`p-3 rounded-full border shadow-2xl backdrop-blur-xl transition-all ${
                showTokenUsage 
                  ? 'bg-gold text-black border-gold' 
                  : 'bg-black/40 text-gold/60 border-gold/20 hover:border-gold/50 hover:text-gold'
              }`}
              title="Xem chi phí linh khí"
            >
              <Activity size={20} />
            </motion.button>
          </div>
        )}

        {/* Footer Quote */}
        <div className="text-center space-y-10 py-20">
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-gold/20 to-transparent mx-auto" />
          <p className="italic text-white/30 text-2xl font-serif tracking-wide max-w-2xl mx-auto leading-relaxed">
            "Tâm tịnh thì duyên khởi, đức dày thì nghiệp tan. Hãy dùng trí tuệ để soi đường, dùng từ bi để tích phúc."
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 print:hidden sticky bottom-6 md:bottom-12 z-50 px-4">
        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF || isDownloadingJPG}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-6 bg-gold/10 backdrop-blur-3xl border border-gold/20 rounded-full text-gold font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-gold/20 hover:border-gold/40 hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingPDF ? (
              <>
                <Loader2 size={20} className="md:w-6 md:h-6 animate-spin" /> Đang Tải PDF...
              </>
            ) : (
              <>
                <Download size={20} className="md:w-6 md:h-6" /> Tải PDF
              </>
            )}
          </button>
          <button
            onClick={handleDownloadJPG}
            disabled={isDownloadingPDF || isDownloadingJPG}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-6 bg-accent/10 backdrop-blur-3xl border border-accent/20 rounded-full text-accent font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-accent/20 hover:border-accent/40 hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingJPG ? (
              <>
                <Loader2 size={20} className="md:w-6 md:h-6 animate-spin" /> Đang Tải JPG...
              </>
            ) : (
              <>
                <Download size={20} className="md:w-6 md:h-6" /> Tải JPG
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-6 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-full text-white/70 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white/[0.1] hover:border-white/20 hover:scale-[1.02] transition-all shadow-2xl"
          >
            <Printer size={20} className="md:w-6 md:h-6" /> In Bản Luận
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(content);
              alert('Đã sao chép toàn bộ bản luận giải!');
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-6 bg-emerald-500/10 backdrop-blur-3xl border border-emerald-500/20 rounded-full text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-[1.02] transition-all shadow-2xl"
          >
            <Plus size={20} className="md:w-6 md:h-6" /> Sao Chép
          </button>
          <button
            onClick={handleShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-6 bg-blue-500/10 backdrop-blur-3xl border border-blue-500/20 rounded-full text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-blue-500/20 hover:border-blue-500/40 hover:scale-[1.02] transition-all shadow-2xl"
          >
            <Share2 size={20} className="md:w-6 md:h-6" /> Chia Sẻ
          </button>
        </div>
        <button
          onClick={handleResetClick}
          className="btn-spiritual w-full md:w-auto px-10 md:px-16 py-4 md:py-6 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <RefreshCw size={20} className="md:w-6 md:h-6" /> Luận Giải Mới
        </button>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelReset}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertTriangle size={40} className="text-red-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-white">Xác Nhận Thoát?</h3>
                  <p className="text-white/60 font-serif italic">
                    Bản luận giải này sẽ bị mất nếu con thoát ra. Con đã lưu hoặc tải bản luận này về chưa?
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3 pt-4">
                  <button
                    onClick={confirmReset}
                    className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-2xl text-red-400 font-bold uppercase tracking-widest transition-all"
                  >
                    Thoát & Xóa Dữ Liệu
                  </button>
                  <button
                    onClick={cancelReset}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/60 font-bold uppercase tracking-widest transition-all"
                  >
                    Quay Lại Xem Tiếp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setZoomedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              onClick={() => setZoomedImage(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
