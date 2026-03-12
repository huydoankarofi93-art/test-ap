import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Loader2, 
  Sparkles, 
  ChevronLeft, 
  Volume2, 
  VolumeX,
  Flame,
  Wind,
  Moon,
  Sun,
  Trash2,
  FileDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChatMessage, UserData, PalmImages } from '../types';
import { summarizeChatForExport } from '../services/gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { ZenMasterSVG } from './ZenMasterSVG';

interface SpiritualMediumPageProps {
  userData: UserData;
  palmImages: PalmImages;
  initialReading: string;
  chatMessages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  isThinking: boolean;
  onClose: () => void;
}

export const SpiritualMediumPage: React.FC<SpiritualMediumPageProps> = ({
  userData,
  palmImages,
  initialReading,
  chatMessages,
  onSendMessage,
  onClearChat,
  isThinking,
  onClose
}) => {
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleExportPDF = async () => {
    if (chatMessages.length === 0 || isExporting) return;
    
    setIsExporting(true);
    try {
      const summary = await summarizeChatForExport(userData, chatMessages, initialReading);
      
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.minHeight = '100px';
      container.style.padding = '40px';
      container.style.backgroundColor = '#0a0502';
      container.style.color = '#D4AF37';
      container.style.fontFamily = 'serif';
      
      container.innerHTML = `
        <div style="border: 2px solid #D4AF37; padding: 40px; border-radius: 30px; background: rgba(212, 175, 55, 0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 4px;">Huyền Cơ Đúc Kết</h1>
            <p style="font-style: italic; color: rgba(212, 175, 55, 0.6);">Thanh Đồng thỉnh ý Bề Trên dành cho: ${userData.fullName || 'Con'}</p>
          </div>
          <div style="border-top: 1px solid #D4AF37; opacity: 0.5; margin-bottom: 40px;"></div>
          <div id="pdf-content" style="line-height: 1.8; font-size: 18px; color: #FDFBF7;"></div>
          <div style="margin-top: 60px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 30px;">
            <p style="font-size: 14px; color: #D4AF37; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">Thiên Cơ Hiển Lộ • Tâm Thành Tất Ứng</p>
            <p style="font-size: 11px; color: rgba(212, 175, 55, 0.4); margin-top: 10px;">Ngày thỉnh ý: ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      
      // Wait a bit for layout
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const contentDiv = container.querySelector('#pdf-content');
      if (contentDiv) {
        contentDiv.innerHTML = summary
          .replace(/^## (.*$)/gim, '<h2 style="color: #D4AF37; margin-top: 30px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 10px;">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 style="color: #D4AF37; margin-top: 35px;">$1</h1>')
          .replace(/^\* (.*$)/gim, '<li style="margin-left: 20px; color: #FDFBF7;">$1</li>')
          .replace(/\*\*(.*)\*\*/gim, '<strong style="color: #D4AF37;">$1</strong>')
          .replace(/\n/gim, '<br/>');
      }

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0502'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Huyen_Co_Duc_Ket_${userData.fullName || 'Con'}.pdf`);
      
      document.body.removeChild(container);
    } catch (error) {
      console.error("Export PDF failed:", error);
      alert("Có lỗi xảy ra khi xuất file PDF. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isThinking]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0502] overflow-hidden flex flex-col font-serif">
      {/* Immersive Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep Red Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a0a0a] via-[#0a0502] to-[#000]" />
        
        {/* Flickering Light Effect */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#ff4e0022_0%,transparent_70%)]"
        />

        {/* Traditional Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-overlay" />
        
        {/* Floating Smoke/Mist */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -100, y: 500, opacity: 0 }}
              animate={{ 
                x: [null, 1000], 
                y: [null, -200],
                opacity: [0, 0.3, 0] 
              }}
              transition={{ 
                duration: 15 + i * 5, 
                repeat: Infinity, 
                delay: i * 3,
                ease: "linear" 
              }}
              className="absolute w-[600px] h-[400px] bg-white/5 blur-[100px] rounded-full"
            />
          ))}
        </div>

        {/* Floating Embers */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
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
                opacity: [0, 0.6, 0],
                x: (Math.random() * 100) + (Math.sin(i) * 10) + "%"
              }}
              transition={{ 
                duration: 15 + Math.random() * 20, 
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear" 
              }}
              className={cn(
                "absolute rounded-full blur-[1px]",
                i % 2 === 0 ? "w-1 h-1 bg-red-500/40" : "w-1.5 h-1.5 bg-gold/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Header / Top Bar */}
      <header className="relative z-20 p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="group relative flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 hover:bg-red-500/30 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <ChevronLeft size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Thoát Nghi Thức</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-display font-bold text-gold tracking-[0.2em] uppercase">Hầu Đồng Chiêm Bái</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Giao thoa Thiên - Địa - Nhân</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-xl bg-white/5 text-gold/60 hover:text-gold transition-all"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          {chatMessages.length > 0 && (
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gold/60 hover:text-gold transition-all disabled:opacity-50 border border-gold/10"
              title="Xuất bản tóm tắt PDF"
            >
              {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Xuất PDF</span>
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-950/40 border border-red-500/20 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Thanh Đồng Đang Ngự</span>
          </div>
          <button 
            onClick={onClearChat}
            className="p-3 rounded-xl bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Xóa lịch sử trò chuyện"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Persistent Floating Exit Button for Mobile/Always Visible */}
      <button 
        onClick={onClose}
        className="fixed bottom-6 left-6 z-[250] md:hidden w-14 h-14 bg-red-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center text-white border border-red-400/30 active:scale-90 transition-transform"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Spiritual Visuals */}
        <div className="hidden lg:flex flex-col w-1/3 p-8 items-center justify-center relative border-r border-white/5">
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            {/* Sacred Circle */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-gold/10 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border border-gold/5 rounded-full border-dashed"
            />
            
            {/* The Master Visual */}
            <div className="relative z-10 w-64 h-64">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-[60px] animate-pulse" />
              <ZenMasterSVG className="w-full h-full text-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]" />
            </div>

            {/* Floating Icons */}
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 text-gold/40"
            >
              <Sun size={32} />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 20, 0] }} 
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-gold/40"
            >
              <Moon size={32} />
            </motion.div>
          </div>

          <div className="mt-12 text-center space-y-4 max-w-xs">
            <h3 className="text-gold font-display text-xl tracking-widest uppercase">Lời Sấm Truyền</h3>
            <p className="text-white/40 italic text-sm leading-relaxed">
              "Trời cao có mắt, đất dày có linh. Tâm thành thì ứng, mệnh định tại thiên nhưng vận chuyển tại nhân."
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Flame className="text-red-500/40" size={20} />
              <Wind className="text-blue-500/40" size={20} />
              <Sparkles className="text-gold/40" size={20} />
            </div>
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="flex-1 flex flex-col relative bg-black/20">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-24 h-24 rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                >
                  <Sparkles size={40} />
                </motion.div>
                <div className="space-y-4">
                  <h3 className="text-2xl text-white font-bold tracking-wide">Khởi Đầu Nghi Thức</h3>
                  <p className="text-white/40 italic leading-relaxed">
                    Con hãy thành tâm đặt câu hỏi. Thanh Đồng sẽ thỉnh ý bề trên để khai mở thiên cơ cho con.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 w-full">
                  {[
                    'Xin Thầy cho biết vận hạn sắp tới?',
                    'Đường công danh của con có gì biến động?',
                    'Tình duyên gia đạo bao giờ mới yên ổn?'
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => onSendMessage(q)}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all text-sm font-serif italic"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    msg.role === 'user' 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-gold/10 border-gold/30 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <ZenMasterSVG className="w-8 h-8" />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`p-5 rounded-2xl text-[15px] leading-relaxed border backdrop-blur-sm ${
                      msg.role === 'user'
                        ? 'bg-white/5 text-white/90 border-white/10 rounded-tr-none'
                        : 'bg-gold/5 text-gold border-gold/20 rounded-tl-none'
                    }`}>
                      <div className="markdown-body markdown-dark prose prose-invert prose-sm max-w-none !text-inherit">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div className={`text-[9px] font-bold uppercase tracking-widest opacity-30 px-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-gold animate-spin" />
                  </div>
                  <div className="bg-gold/5 p-5 rounded-2xl rounded-tl-none border border-gold/20">
                    <div className="flex gap-2">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 md:p-10 bg-black/40 border-t border-white/5 backdrop-blur-2xl">
            <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Thỉnh ý Thanh Đồng..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-8 pr-16 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 focus:ring-4 focus:ring-gold/5 transition-all font-serif italic"
                disabled={isThinking}
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-gold text-black rounded-xl flex items-center justify-center disabled:opacity-20 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 hover:scale-105"
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-[10px] text-white/20 text-center mt-6 uppercase tracking-[0.4em] font-bold">
              Thiên Cơ Hiển Lộ • Tâm Thành Tất Ứng
            </p>
          </div>
        </div>
      </main>

      {/* Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full animate-pulse" />
                <ZenMasterSVG className="w-48 h-48 text-gold relative z-10" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-display font-bold text-gold tracking-[0.3em] uppercase">Khởi Nghi Thức</h1>
                <p className="text-white/40 font-serif italic text-xl">"Đang thỉnh mời Thanh Đồng giáng ngự..."</p>
              </div>
              <div className="flex justify-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-gold rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
