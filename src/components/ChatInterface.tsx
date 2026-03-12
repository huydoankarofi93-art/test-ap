import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Loader2, MessageSquare, Sparkles, FileDown, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ChatMessage, UserData, PalmImages } from '../types';
import { ZenMasterSVG } from './ZenMasterSVG';
import { summarizeChatForExport } from '../services/gemini';

interface ChatInterfaceProps {
  userData: UserData;
  palmImages: PalmImages;
  initialReading: string;
  chatMessages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isThinking: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userData,
  palmImages,
  initialReading,
  chatMessages,
  onSendMessage,
  isThinking
}) => {
  const [input, setInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (chatMessages.length === 0 || isExporting) return;
    
    setIsExporting(true);
    try {
      // 1. Get summary from AI
      const summary = await summarizeChatForExport(userData, chatMessages, initialReading);
      
      // 2. Create a temporary container for PDF rendering
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.minHeight = '100px';
      container.style.padding = '40px';
      container.style.backgroundColor = '#FDFCFB';
      container.style.color = '#4A4439';
      container.style.fontFamily = 'serif';
      
      container.innerHTML = `
        <div style="border: 2px solid #D4AF37; padding: 30px; border-radius: 20px;">
          <h1 style="text-align: center; color: #4A4439; margin-bottom: 10px;">BẢN TỔNG HỢP KIẾN GIẢI HUYỀN CƠ</h1>
          <p style="text-align: center; font-style: italic; color: #8C8475; margin-bottom: 30px;">Dành cho: ${userData.fullName || 'Con'}</p>
          <div style="border-top: 1px solid #D4AF37; opacity: 0.3; margin-bottom: 30px;"></div>
          <div id="pdf-content" style="line-height: 1.6; font-size: 16px;"></div>
          <div style="margin-top: 50px; text-align: center; border-top: 1px solid #E5E1D8; padding-top: 20px;">
            <p style="font-size: 12px; color: #8C8475; text-transform: uppercase; letter-spacing: 2px;">Vạn sự tùy duyên - Thiên Sư AI</p>
            <p style="font-size: 10px; color: #8C8475; opacity: 0.6;">Ngày xuất bản: ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      
      // Wait a bit for layout
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // We need to render the markdown summary into the container
      // Since we are in a function, we can't easily use React components here for the temp div
      // but we can use a simple markdown to html converter or just basic formatting
      const contentDiv = container.querySelector('#pdf-content');
      if (contentDiv) {
        // Simple conversion for basic markdown tags
        contentDiv.innerHTML = summary
          .replace(/^## (.*$)/gim, '<h2 style="color: #4A4439; margin-top: 25px; border-bottom: 1px solid #F5F2ED;">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 style="color: #4A4439; margin-top: 30px;">$1</h1>')
          .replace(/^\* (.*$)/gim, '<li style="margin-left: 20px;">$1</li>')
          .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
          .replace(/\n/gim, '<br/>');
      }

      // 3. Render to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FDFCFB'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Kien_Giai_Huyen_Co_${userData.fullName || 'Con'}.pdf`);
      
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const getPalmImageSrc = (ref: string) => {
    if (ref.startsWith('palm_')) {
      const index = parseInt(ref.replace('palm_', '')) - 1;
      const allImages = [...(palmImages?.primary || []), ...(palmImages?.secondary || [])];
      if (allImages[index]) return allImages[index].data;
    }
    return ref;
  };

  return (
    <div className="flex flex-col h-[650px] bg-[#FDFCFB] rounded-[2.5rem] border border-[#E5E1D8] overflow-hidden shadow-2xl relative">
      {/* Zen Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      
      {/* Header */}
      <div className="p-6 border-b border-[#E5E1D8] bg-[#F5F2ED]/80 backdrop-blur-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-[#E5E1D8] shadow-sm overflow-hidden">
            <ZenMasterSVG className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-display font-bold !text-[#4A4439] text-lg tracking-tight">Đàm Đạo Cùng Thiên Sư</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[10px] text-[#8C8475] font-medium uppercase tracking-widest">Đang hiện diện</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chatMessages.length > 0 && (
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="p-2.5 rounded-xl bg-white border border-[#E5E1D8] text-[#8C8475] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              title="Xuất bản tóm tắt PDF"
            >
              {isExporting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileDown size={18} />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Xuất PDF</span>
            </button>
          )}
          <div className="p-2 rounded-full bg-[#E8F0E6] text-[#5A6B5D]">
            <Sparkles size={18} />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
        {(chatMessages?.length || 0) === 0 && (
          <div className="text-center py-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-48 h-48 mx-auto relative"
            >
              <div className="absolute inset-0 bg-[#E8F0E6] rounded-full blur-3xl opacity-40 animate-pulse" />
              <ZenMasterSVG className="w-full h-full relative z-10 drop-shadow-2xl" />
            </motion.div>
            
            <div className="max-w-xs mx-auto space-y-4">
              <div className="space-y-2">
                <p className="!text-[#4A4439] font-serif italic text-lg leading-relaxed">
                  "Tâm tịnh thì duyên khởi,<br/>trí sáng thì mệnh thông."
                </p>
                <div className="w-12 h-0.5 bg-[#D4AF37]/30 mx-auto rounded-full" />
              </div>
              <p className="text-[#8C8475] text-[10px] uppercase tracking-[0.2em] font-bold">
                Hãy đặt câu hỏi để được khai mở
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 px-4">
              {[
                'Công việc năm nay thế nào?', 
                'Bao giờ tôi đổi việc?',
                'Tình duyên sắp tới ra sao?',
                'Sức khỏe và tài lộc có gì biến động?'
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => onSendMessage(q)}
                  className="text-xs px-5 py-2.5 rounded-2xl bg-white border border-[#E5E1D8] !text-[#5A5449] hover:bg-[#F5F2ED] hover:border-[#D4AF37]/30 transition-all shadow-sm font-medium"
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-[#E8F0E6] border-[#D1E0CF]' 
                  : 'bg-white border-[#E5E1D8]'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-[#5A6B5D]" />
                ) : (
                  <ZenMasterSVG className="w-7 h-7" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm border transition-all relative overflow-hidden ${
                  msg.role === 'user'
                    ? 'bg-[#F5F2ED] text-[#4A4439] border-[#E5E1D8] rounded-tr-none'
                    : 'bg-white text-[#4A4439] border-[#E5E1D8] rounded-tl-none'
                }`}>
                  {/* Subtle Paper Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                  
                  <div className="relative z-10 markdown-body markdown-light prose prose-slate prose-sm max-w-none !space-y-3 !text-[15px] !leading-relaxed !text-[#4A4439]">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        img: ({ src, alt }) => {
                          const realSrc = getPalmImageSrc(src || '');
                          return (
                            <div className="my-4 rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-md">
                              <img 
                                src={realSrc} 
                                alt={alt} 
                                className="w-full h-auto object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {alt && (
                                <div className="bg-[#F5F2ED] px-4 py-2 text-[10px] text-[#8C8475] font-bold uppercase tracking-widest text-center border-t border-[#E5E1D8]">
                                  {alt}
                                </div>
                              )}
                            </div>
                          );
                        },
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-4 rounded-xl border border-[#E5E1D8] bg-[#F9F7F2]">
                            <table className="min-w-full divide-y divide-[#E5E1D8]">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-2 bg-[#F5F2ED] text-left text-[10px] font-bold text-[#8C8475] uppercase tracking-wider">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-2 text-sm text-[#4A4439] border-t border-[#E5E1D8]">
                            {children}
                          </td>
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className={`text-[9px] font-bold uppercase tracking-tighter opacity-40 px-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E5E1D8] flex items-center justify-center shadow-sm">
                <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
              </div>
              <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-[#E5E1D8] shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#D4AF37]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#D4AF37]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#F5F2ED]/50 border-t border-[#E5E1D8] relative z-10">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi Thầy về vận mệnh của con..."
            className="w-full bg-white border border-[#E5E1D8] rounded-[1.5rem] py-4 pl-6 pr-14 text-sm !text-[#4A4439] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all font-serif placeholder:text-[#8C8475]/40 shadow-sm"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#4A4439] text-white rounded-2xl flex items-center justify-center disabled:opacity-20 disabled:grayscale transition-all shadow-lg active:scale-95 hover:bg-[#2C2821]"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-[#8C8475]/60 text-center mt-4 font-medium uppercase tracking-widest">
          Lời Thầy dạy là kim chỉ nam, vạn sự tùy duyên
        </p>
      </div>
    </div>
  );
};
