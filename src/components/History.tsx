import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { History as HistoryIcon, Plus, Calendar, User, ChevronRight, Loader2, Trash2, X } from 'lucide-react';

interface ReadingRecord {
  id: string;
  fullName: string;
  readingType: string;
  content: string;
  tuviChart: string;
  createdAt: string;
}

interface Props {
  onSelect: (record: ReadingRecord) => void;
  onClose: () => void;
}

export const History: React.FC<Props> = ({ onSelect, onClose }) => {
  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch('/api/readings');
        const data = await response.json();
        setReadings(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReadings();
  }, []);

  const getReadingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      full: "Luận giải Bản mệnh",
      yearly: "Vận hạn Năm",
      monthly: "Vận hạn Tháng",
      daily: "Vận hạn Ngày",
      name: "Tính Danh Học",
      baby_name: "Ban danh hậu duệ",
      divination: "Gieo Quẻ Kinh Dịch",
      palm: "Luận giải Tướng Tay",
      seven_killings: "Thất Sát Chiến Lược",
      tuvi: "Lá Số Tử Vi"
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-paper/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl max-h-[80vh] glass-panel overflow-hidden flex flex-col"
      >
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
              <HistoryIcon size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-white">Lịch Sử Luận Giải</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest">Lưu trữ 10 bản luận gần nhất</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white hover:scale-110 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="text-gold animate-spin" size={48} />
              <p className="text-white/40 font-serif italic">Đang truy xuất tàng kinh các...</p>
            </div>
          ) : readings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
              <Plus className="text-white/10" size={80} />
              <div className="space-y-2">
                <p className="text-xl text-white/60 font-serif">Chưa có bản luận nào được lưu lại.</p>
                <p className="text-sm text-white/30">Hãy bắt đầu hành trình khám phá thiên mệnh của bạn.</p>
              </div>
            </div>
          ) : (
            readings.map((reading) => (
              <motion.div
                key={reading.id}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => onSelect(reading)}
                className="p-6 border border-white/5 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-gold group-hover:border-gold/20 transition-all">
                    <Plus size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{reading.fullName}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[10px] text-accent uppercase font-bold tracking-tighter">
                        {getReadingTypeLabel(reading.readingType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(reading.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{reading.fullName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-white/10 group-hover:text-gold transition-all" size={24} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
