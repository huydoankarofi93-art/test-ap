import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Sparkles, X } from 'lucide-react';

interface PalmArea {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  meaning: string;
  type: 'line' | 'mount';
}

const PALM_AREAS: PalmArea[] = [
  {
    id: 'life_line',
    name: 'Life Line',
    vietnameseName: 'Đường Sinh Đạo',
    description: 'Bắt đầu từ giữa ngón trỏ và ngón cái, vòng quanh gò Kim Tinh.',
    meaning: 'Phản chiếu sức khỏe, sinh lực, tuổi thọ và những biến cố lớn trong đời sống thể chất.',
    type: 'line'
  },
  {
    id: 'head_line',
    name: 'Head Line',
    vietnameseName: 'Đường Trí Đạo',
    description: 'Nằm ngang giữa lòng bàn tay, dưới đường Tâm đạo.',
    meaning: 'Đại diện cho trí tuệ, khả năng tư duy, sự tập trung và tâm lý học vấn.',
    type: 'line'
  },
  {
    id: 'heart_line',
    name: 'Heart Line',
    vietnameseName: 'Đường Tâm Đạo',
    description: 'Đường nằm ngang phía trên cùng của lòng bàn tay.',
    meaning: 'Biểu thị đời sống tình cảm, các mối quan hệ, lòng trắc ẩn và sức khỏe tim mạch.',
    type: 'line'
  },
  {
    id: 'fate_line',
    name: 'Fate Line',
    vietnameseName: 'Đường Vận Mệnh',
    description: 'Đường thẳng đứng chạy từ cổ tay lên phía các ngón tay.',
    meaning: 'Chỉ ra những tác động bên ngoài, sự nghiệp, định hướng và những thay đổi lớn về vận số.',
    type: 'line'
  },
  {
    id: 'sun_line',
    name: 'Sun Line',
    vietnameseName: 'Đường Thái Dương',
    description: 'Đường thẳng đứng nằm dưới ngón áp út.',
    meaning: 'Liên quan đến danh tiếng, sự thành công, tài năng nghệ thuật và sự giàu có.',
    type: 'line'
  },
  {
    id: 'marriage_line',
    name: 'Marriage Line',
    vietnameseName: 'Đường Hôn Nhân',
    description: 'Các đường ngắn nằm ở cạnh bàn tay, dưới ngón út.',
    meaning: 'Phản ánh các mối quan hệ nghiêm túc, hôn nhân và đời sống gia đình.',
    type: 'line'
  },
  {
    id: 'mount_jupiter',
    name: 'Mount of Jupiter',
    vietnameseName: 'Gò Mộc Tinh',
    description: 'Nằm dưới gốc ngón trỏ.',
    meaning: 'Đại diện cho tham vọng, quyền lực, khả năng lãnh đạo và lòng tự trọng.',
    type: 'mount'
  },
  {
    id: 'mount_saturn',
    name: 'Mount of Saturn',
    vietnameseName: 'Gò Thổ Tinh',
    description: 'Nằm dưới gốc ngón giữa.',
    meaning: 'Liên quan đến sự kiên nhẫn, trách nhiệm, tính kỷ luật và sự cô độc.',
    type: 'mount'
  },
  {
    id: 'mount_apollo',
    name: 'Mount of Apollo',
    vietnameseName: 'Gò Thái Dương',
    description: 'Nằm dưới gốc ngón áp út.',
    meaning: 'Biểu thị sự sáng tạo, niềm vui, sự thành đạt và khiếu thẩm mỹ.',
    type: 'mount'
  },
  {
    id: 'mount_mercury',
    name: 'Mount of Mercury',
    vietnameseName: 'Gò Thủy Tinh',
    description: 'Nằm dưới gốc ngón út.',
    meaning: 'Đại diện cho giao tiếp, kinh doanh, trí thông minh và khả năng thích ứng.',
    type: 'mount'
  },
  {
    id: 'mount_venus',
    name: 'Mount of Venus',
    vietnameseName: 'Gò Kim Tinh',
    description: 'Phần thịt dày dưới gốc ngón cái.',
    meaning: 'Liên quan đến tình yêu, đam mê, sức sống và sự quyến rũ.',
    type: 'mount'
  },
  {
    id: 'mount_moon',
    name: 'Mount of Moon',
    vietnameseName: 'Gò Thái Âm',
    description: 'Nằm ở phần dưới của lòng bàn tay, đối diện gò Kim Tinh.',
    meaning: 'Biểu thị trí tưởng tượng, trực giác, sự nhạy cảm và những chuyến đi xa.',
    type: 'mount'
  }
];

interface Props {
  onAreaClick?: (area: PalmArea) => void;
}

export const InteractivePalmMap: React.FC<Props> = ({ onAreaClick }) => {
  const [hoveredArea, setHoveredArea] = useState<PalmArea | null>(null);
  const [selectedArea, setSelectedArea] = useState<PalmArea | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="space-y-8">
      <div className="relative aspect-[4/3] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/60 backdrop-blur-md shadow-2xl shadow-gold/5 group flex items-center justify-center">
        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex flex-col gap-2">
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-all hover:scale-110"
          >
            <span className="text-lg md:text-xl font-bold">+</span>
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-all hover:scale-110"
          >
            <span className="text-lg md:text-xl font-bold">−</span>
          </button>
          <button 
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-all hover:scale-110"
          >
            <span className="text-[10px] md:text-xs font-bold">R</span>
          </button>
        </div>

        {/* Info Panel Overlay */}
        <AnimatePresence>
          {(hoveredArea || selectedArea) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:top-6 md:right-6 z-20 w-auto md:w-80 p-6 bg-black/90 backdrop-blur-xl border border-gold/40 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <Sparkles size={16} className="text-gold" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-gold uppercase tracking-widest">{(hoveredArea || selectedArea)?.vietnameseName}</h4>
                </div>
                {selectedArea && (
                  <button onClick={() => setSelectedArea(null)} className="text-white/40 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-white/80 font-serif italic mb-3 leading-relaxed">{(hoveredArea || selectedArea)?.description}</p>
              <div className="pt-3 border-t border-white/10 space-y-3">
                <p className="text-[11px] text-white/60 leading-relaxed">
                  <span className="text-gold font-bold uppercase tracking-tighter mr-1">Ý nghĩa:</span>
                  {(hoveredArea || selectedArea)?.meaning}
                </p>
                {selectedArea && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pt-3 border-t border-white/5 space-y-2"
                  >
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest flex items-center gap-2">
                      <Info size={12} /> Luận giải chi tiết
                    </p>
                    <p className="text-[10px] text-white/50 leading-relaxed italic">
                      {selectedArea.id === 'life_line' && "Đường sinh đạo dài, rõ nét thường biểu hiện sức khỏe dồi dào. Nếu có đứt đoạn, có thể là dấu hiệu của những thay đổi lớn về thể chất hoặc môi trường sống."}
                      {selectedArea.id === 'head_line' && "Đường trí đạo sâu và thẳng cho thấy khả năng tập trung cao. Nếu đường này cong xuống gò Thái Âm, bạn là người giàu trí tưởng tượng và sáng tạo."}
                      {selectedArea.id === 'heart_line' && "Đường tâm đạo kết thúc dưới ngón trỏ cho thấy sự lý tưởng hóa trong tình yêu. Nếu kết thúc dưới ngón giữa, bạn thường thực tế và lý trí hơn."}
                      {selectedArea.id === 'fate_line' && "Đường vận mệnh rõ ràng từ sớm cho thấy bạn sớm xác định được mục tiêu cuộc đời. Nếu đường này mờ nhạt, bạn có thể trải qua nhiều nghề nghiệp khác nhau."}
                      {selectedArea.id === 'mount_jupiter' && "Gò Mộc Tinh đầy đặn cho thấy khát vọng vươn lên và khả năng dẫn dắt người khác. Bạn thường có lòng tự trọng cao và khao khát thành công."}
                      {selectedArea.id === 'mount_venus' && "Gò Kim Tinh nảy nở biểu thị sức sống mãnh liệt, lòng nhân ái và sự yêu thích cái đẹp. Bạn thường có sức hút tự nhiên với người xung quanh."}
                      {!['life_line', 'head_line', 'heart_line', 'fate_line', 'mount_jupiter', 'mount_venus'].includes(selectedArea.id) && "Mỗi dấu hiệu trên bàn tay đều mang một thông điệp riêng về nghiệp lực và phước đức. Hãy đối chiếu với bản luận giải AI để thấu hiểu sâu sắc hơn."}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          className={`w-full h-full transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing ${isDragging ? 'transition-none' : ''}`}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg viewBox="0 0 600 250" className="w-full h-full text-gold/10">
            <defs>
              <filter id="glow-palm">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="transparent" />

            {/* Hand Outline Group */}
            <g transform="translate(300, 125) rotate(-90) translate(-100, -150) scale(1.2)">
              {/* Hand Shape */}
              <path 
                d="M50,280 L50,220 C40,200 30,150 35,100 C38,70 45,50 55,45 C65,40 75,60 75,90 L75,40 C75,30 85,25 90,30 C95,35 95,50 95,80 L95,20 C95,10 105,5 110,10 C115,15 115,30 115,75 L115,35 C115,25 125,20 130,25 C135,30 135,45 135,90 L135,140 C135,140 165,145 170,180 C175,215 150,240 120,245 L120,280 L50,280 Z" 
                fill="rgba(166, 124, 82, 0.08)" 
                stroke="var(--color-gold)" 
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />

              {/* Interactive Lines */}
              {[
                { id: 'heart_line', d: "M135,100 Q100,90 60,110" },
                { id: 'head_line', d: "M135,130 Q90,120 55,150" },
                { id: 'life_line', d: "M135,160 Q100,160 85,220" },
                { id: 'fate_line', d: "M105,230 L105,80", dashed: true },
                { id: 'sun_line', d: "M120,140 L120,85", dashed: true },
                { id: 'marriage_line', d: "M135,110 L145,110" }
              ].map(line => (
                <g 
                  key={line.id} 
                  onMouseEnter={() => setHoveredArea(PALM_AREAS.find(a => a.id === line.id) || null)} 
                  onMouseLeave={() => setHoveredArea(null)}
                  onClick={() => {
                    const area = PALM_AREAS.find(a => a.id === line.id);
                    if (area) {
                      setSelectedArea(area);
                      onAreaClick?.(area);
                    }
                  }}
                >
                  {/* Invisible Hit Area */}
                  <path 
                    d={line.d} 
                    fill="none" 
                    stroke="transparent" 
                    strokeWidth="15" 
                    className="cursor-pointer"
                  />
                  {/* Visible Line */}
                  <motion.path 
                    d={line.d} 
                    fill="none" 
                    stroke={(hoveredArea?.id === line.id || selectedArea?.id === line.id) ? "var(--color-copper)" : "var(--color-gold)"}
                    strokeWidth={(hoveredArea?.id === line.id || selectedArea?.id === line.id) ? 4 : 2}
                    strokeDasharray={line.dashed ? "4 2" : "none"}
                    strokeLinecap="round"
                    filter={(hoveredArea?.id === line.id || selectedArea?.id === line.id) && window.innerWidth >= 768 ? "url(#glow-palm)" : "none"}
                    transition={{ duration: 0.3 }}
                  />
                </g>
              ))}

              {/* Interactive Mounts */}
              {[
                { id: 'mount_jupiter', cx: 65, cy: 70 },
                { id: 'mount_saturn', cx: 90, cy: 65 },
                { id: 'mount_apollo', cx: 115, cy: 70 },
                { id: 'mount_mercury', cx: 138, cy: 85 },
                { id: 'mount_moon', cx: 150, cy: 180 },
                { id: 'mount_venus', cx: 60, cy: 180 }
              ].map(mount => (
                <g 
                  key={mount.id} 
                  onMouseEnter={() => window.innerWidth >= 768 && setHoveredArea(PALM_AREAS.find(a => a.id === mount.id) || null)} 
                  onMouseLeave={() => window.innerWidth >= 768 && setHoveredArea(null)}
                  onClick={() => {
                    const area = PALM_AREAS.find(a => a.id === mount.id);
                    if (area) {
                      setSelectedArea(area);
                      onAreaClick?.(area);
                    }
                  }}
                >
                  {/* Invisible Hit Area */}
                  <circle 
                    cx={mount.cx} 
                    cy={mount.cy} 
                    r="15" 
                    fill="transparent" 
                    className="cursor-pointer"
                  />
                  {/* Visible Mount */}
                  <motion.circle 
                    cx={mount.cx} 
                    cy={mount.cy} 
                    r={(hoveredArea?.id === mount.id || selectedArea?.id === mount.id) ? 6 : 3}
                    fill={(hoveredArea?.id === mount.id || selectedArea?.id === mount.id) ? "var(--color-copper)" : "var(--color-gold)"}
                    opacity={(hoveredArea?.id === mount.id || selectedArea?.id === mount.id) ? 0.8 : 0.4}
                    filter={(hoveredArea?.id === mount.id || selectedArea?.id === mount.id) && window.innerWidth >= 768 ? "url(#glow-palm)" : "none"}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Label */}
                  <motion.text 
                    x={mount.cx + 8} 
                    y={mount.cy + 2} 
                    fontSize="5" 
                    fill="var(--color-gold)" 
                    className="font-serif italic pointer-events-none"
                    animate={{ 
                      opacity: (hoveredArea?.id === mount.id || selectedArea?.id === mount.id) ? 1 : 0.4,
                      scale: (hoveredArea?.id === mount.id || selectedArea?.id === mount.id) ? 1.2 : 1
                    }}
                  >
                    {PALM_AREAS.find(a => a.id === mount.id)?.vietnameseName}
                  </motion.text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Bottom Instruction */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-gold/20 backdrop-blur-md rounded-full border border-gold/30 z-10">
          <p className="text-[10px] text-gold font-bold uppercase tracking-widest">
            Nhấn vào các đường chỉ và gò để xem luận giải chi tiết
          </p>
        </div>
      </div>

      {/* Grid of Details (Alternative View) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PALM_AREAS.map(area => (
          <motion.div 
            key={area.id}
            onMouseEnter={() => setHoveredArea(area)}
            onMouseLeave={() => setHoveredArea(null)}
            onClick={() => {
              setSelectedArea(area);
              onAreaClick?.(area);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              (hoveredArea?.id === area.id || selectedArea?.id === area.id)
                ? 'bg-gold/10 border-gold/40 shadow-lg shadow-gold/5' 
                : 'bg-white/[0.02] border-white/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${area.type === 'line' ? 'bg-gold' : 'bg-copper'}`} />
              <h5 className="text-[11px] font-bold text-gold uppercase tracking-wider">{area.vietnameseName}</h5>
            </div>
            <p className="text-[10px] text-white/40 italic leading-snug">{area.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
