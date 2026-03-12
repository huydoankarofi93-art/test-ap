import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Fingerprint, 
  Coins, 
  User, 
  Baby, 
  Info, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Camera,
  Clock,
  Compass,
  CalendarRange,
  MapPin
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuide = ({ isOpen, onClose }: Props) => {
  const sections = [
    {
      id: 'intro',
      title: 'Hệ Thống Destiny Engine V5',
      icon: Sparkles,
      content: 'Thiên Mệnh Ký V5 là đỉnh cao của sự kết hợp giữa 5 học phái: Tử Vi, Bát Tự, Kinh Dịch, Tướng Tay và Tính Danh Học. Hệ thống sử dụng trí tuệ nhân tạo để đối chiếu đa tầng dữ liệu, mang lại bản luận giải có độ tin cậy và chiều sâu vượt trội. Mọi dữ liệu đều được xử lý theo thời gian thực (Real-time) dựa trên vị trí địa lý và thiên văn học chính xác.'
    },
    {
      id: 'tuvi_chart',
      title: 'Lá Số Tử Vi & Bát Tự',
      icon: Compass,
      content: 'Hệ thống tự động lập lá số Tử Vi với địa bàn 12 cung. AI sẽ phân tích dựa trên Tam phương tứ chính, Ngũ hành cục và vòng Trường sinh để thấu thị gốc mệnh. Lưu ý: Độ chính xác phụ thuộc 90% vào Giờ sinh. Nếu không rõ giờ sinh, hệ thống sẽ chuyển sang chế độ "Chiêm Bốc" để dự đoán.'
    },
    {
      id: 'palm_multivision',
      title: 'Tướng Tay & Kiểm Định Ảnh',
      icon: Fingerprint,
      content: 'Quy tắc "Nam Tả Nữ Hữu" được áp dụng để đối chiếu giữa Tiền định và Hậu vận. Hệ thống có tính năng "Thấu thị ảnh" để kiểm tra chất lượng. Nếu bạn tự tin vào ảnh của mình, có thể sử dụng tùy chọn "Bỏ qua kiểm tra" để bắt đầu luận giải ngay lập tức. Mẹo: Chụp ảnh dưới ánh sáng tự nhiên, không dùng đèn flash để tránh bóng đổ.'
    },
    {
      id: 'ancient_assessment',
      title: 'Cổ Nhân Pháp (Khám Khí)',
      icon: ShieldCheck,
      content: 'Trước khi xem chỉ tay, hãy tự đánh giá về Hình dáng (Thủ hình), Khí sắc và Ngấn cổ tay. Đây là bước cung cấp "dữ liệu thô" cực kỳ quan trọng giúp AI xác định mức độ Phước đức và Căn cơ của bạn, từ đó đưa ra lời khuyên cải vận thực chiến.'
    },
    {
      id: 'divination',
      title: 'Kinh Dịch & Chiêm Bốc',
      icon: Coins,
      subsections: [
        { name: 'Mai Hoa Dịch Số', desc: 'Dựa trên tượng quẻ và thiên thời. Phù hợp xem các việc đang biến động, cần quyết định nhanh.' },
        { name: 'Lục Hào Chánh Pháp', desc: 'Tung 3 đồng xu 6 lần. Đây là phương pháp chi tiết nhất, giúp xác định chính xác Ứng kỳ (Thời điểm xảy ra).' },
        { name: 'Linh Thẻ Chiêm Nghiệm', desc: 'Lắc ống thẻ tìm lời sấm truyền. Phù hợp khi tâm đang loạn, cần lời giáo huấn để định tâm.' },
        { name: 'Tâm Niệm Vấn Đáp', desc: 'Dựa trên ý niệm và số nét chữ. AI sẽ thấu thị nhân duyên ẩn sau câu hỏi của bạn.' }
      ]
    },
    {
      id: 'geography',
      title: 'Địa Khí & Di Cung Hoán Số',
      icon: MapPin,
      content: 'Hệ thống phân tích sự tương tác giữa nơi sinh và nơi ở hiện tại. Nếu bạn đang ở vùng đất khắc mệnh (Thất địa), AI sẽ hướng dẫn cách "Di cung" hoặc sử dụng vật phẩm phong thủy để hóa giải, giúp vận trình hanh thông hơn.'
    },
    {
      id: 'strategy',
      title: 'Chiến Lược Vận Mệnh 360°',
      icon: Zap,
      content: 'Dựa trên tổng điểm vận thế, AI sẽ đề xuất chiến lược: Thu mình dưỡng lực (Defensive) khi vận suy, Tiến chậm chắc (Balanced) khi vận bình, hoặc Thuận thời mở vận (Expansion) để bứt phá đỉnh cao.'
    },
    {
      id: 'sincerity',
      title: 'Nguyên Tắc "Tâm Thành Tất Ứng"',
      icon: Clock,
      content: 'Hãy giữ tâm trí tĩnh lặng, hít thở sâu 3 lần trước khi bắt đầu. Tuyệt đối không xem một việc quá nhiều lần trong ngày (Nghị quẻ bất quá tam) để tránh làm nhiễu loạn thông tin và giảm độ linh ứng của quẻ.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#0a0502]/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(212,175,55,0.1)]"
          >
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <BookOpen size={32} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Cẩm Nang <span className="gold-gradient-text italic font-serif">Thiên Mệnh</span></h2>
                  <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.4em] font-bold mt-1">Hướng Dẫn Sử Dụng Chi Tiết • Trí Tuệ Cổ Nhân</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {sections.map((section, idx) => (
                  <motion.div 
                    key={section.id}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-6 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                        <section.icon size={24} />
                      </div>
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-gold transition-colors">{section.title}</h3>
                    </div>
                    
                    {section.content && (
                      <p className="text-sm text-white/50 leading-relaxed font-serif italic">
                        {section.content}
                      </p>
                    )}

                    {section.subsections && (
                      <div className="grid grid-cols-1 gap-3">
                        {section.subsections.map((sub, sidx) => (
                          <div key={sidx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                            <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">{sub.name}</div>
                            <div className="text-[11px] text-white/40 font-serif italic">{sub.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="h-px w-full bg-gradient-to-r from-gold/20 via-transparent to-transparent opacity-30" />
                  </motion.div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-16 p-8 rounded-[2rem] bg-gold/5 border border-gold/10 text-center space-y-4">
                <Info size={32} className="mx-auto text-gold/40" />
                <p className="text-sm text-white/60 font-serif italic max-w-2xl mx-auto">
                  "Mọi dự báo đều mang tính chất tham khảo và định hướng. Vận mệnh nằm trong tay bạn, trí tuệ cổ nhân chỉ là ngọn đèn soi sáng con đường bạn chọn."
                </p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-center">
              <button 
                onClick={onClose}
                className="px-12 py-4 rounded-full bg-gold text-ink font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                Đã Hiểu Thiên Cơ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
