import React, { useState } from 'react';
import { TuViChart } from '../services/tuvi-engine/tuviChart';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, ScrollText, Star, Fingerprint, ExternalLink, Sparkles, Flame, ShieldCheck, Compass, User, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface Props {
  chart: TuViChart;
  userData: any;
  content?: string;
  isGenerating?: boolean;
  palmImages?: {
    primary: { data: string; label?: string }[];
    secondary: { data: string; label?: string }[];
  } | null;
  systemData?: {
    palm_features: Array<{
      id: string;
      label: string;
      description: string;
      bbox: number[];
      image_ref: string;
    }>;
    cross_reference: Array<{
      palace: string;
      evidence_ids: string[];
      analysis: string;
    }>;
  };
}

const ELEMENT_COLORS: Record<string, string> = {
  "Thủy": "text-black",
  "Kim": "text-gray-500",
  "Hỏa": "text-red-600",
  "Mộc": "text-green-600",
  "Thổ": "text-orange-500",
};

const getStarElement = (star: string): string => {
  const name = star.split(' ')[0];
  const waterStars = ["Thái Âm", "Thiên Đồng", "Thiên Tướng", "Văn Khúc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ", "Thiên Hỷ", "Hồng Loan", "Thanh Long", "Lưu Hà", "Hữu Bật", "Đà La", "Địa Võng", "Trực Phù", "Bệnh Phù", "Phục Binh", "Tham Lang", "Cự Môn"];
  const metalStars = ["Vũ Khúc", "Thất Sát", "Kình Dương", "Văn Xương", "Đường Phù", "Tấu Thư", "Bạch Hổ", "Kiếp Sát", "Quốc Ấn", "Phá Quân"];
  const fireStars = ["Thái Dương", "Liêm Trinh", "Hỏa Tinh", "Linh Tinh", "Thiên Khôi", "Thiên Việt", "Thiên Mã", "Hỷ Thần", "Phượng Các", "Giải Thần", "Địa Không", "Địa Kiếp", "Thiên Không", "Đào Hoa", "Thiên La", "Quan Phù", "Đại Hao", "Tiểu Hao"];
  const woodStars = ["Thiên Cơ", "Hóa Lộc", "Thiên Phúc", "Thiên Quan", "Lộc Tồn", "Bác Sỹ", "Thiên Giải", "Địa Giải", "Thiên Trù"];
  const earthStars = ["Tử Vi", "Thiên Phủ", "Thiên Lương", "Tả Phụ", "Long Trì", "Thiên Thọ", "Cô Thần", "Quả Tú", "Thiên Hình", "Thiên Khốc", "Thiên Hư", "Tang Môn", "Điếu Khách", "Tuế Phá"];

  if (waterStars.includes(name)) return "Thủy";
  if (metalStars.includes(name)) return "Kim";
  if (fireStars.includes(name)) return "Hỏa";
  if (woodStars.includes(name)) return "Mộc";
  if (earthStars.includes(name)) return "Thổ";
  return "Kim";
};

const getPalaceColor = (chi: string): string => {
  const map: Record<string, string> = {
    "Tý": "Thủy", "Hợi": "Thủy",
    "Sửu": "Thổ", "Thìn": "Thổ", "Mùi": "Thổ", "Tuất": "Thổ",
    "Dần": "Mộc", "Mão": "Mộc",
    "Tỵ": "Hỏa", "Ngọ": "Hỏa",
    "Thân": "Kim", "Dậu": "Kim"
  };
  return ELEMENT_COLORS[map[chi]] || "text-black";
};

export const TuViGrid: React.FC<Props> = ({ chart, userData, content = "", isGenerating, palmImages, systemData }) => {
  const [selectedPalace, setSelectedPalace] = useState<{ name: string; chi: string; stars: string[] } | null>(null);
  const [hoveredPalace, setHoveredPalace] = useState<string | null>(null);

  const chiList = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  const getPalaceAtChi = (chi: string) => {
    return Object.entries(chart.palaces).find(([_, c]) => c === chi)?.[0];
  };

  const handlePalaceClick = (chi: string, palaceName?: string) => {
    if (palaceName) {
      const cleanName = palaceName.split(' ')[0].toUpperCase();
      const stars = chart.stars[chi] || [];
      setSelectedPalace({ name: cleanName, chi, stars });
    }
  };

  const getPersonalizedAnnotation = (palaceName: string, stars: string[]) => {
    const name = userData.fullName || "bạn";
    const gender = userData.gender === 'Nam' ? 'anh' : userData.gender === 'Nữ' ? 'chị' : 'bạn';
    const pronoun = userData.gender === 'Nam' ? 'Nam' : userData.gender === 'Nữ' ? 'Nữ' : 'Người';
    
    let prefix = "";
    if (palaceName === "MỆNH") {
      prefix = `Chào ${name}, là một ${pronoun} nhân, đây là cung quan trọng nhất quyết định bản sắc riêng của ${gender}. `;
    } else if (palaceName === "PHU") {
      prefix = `Về chuyện tình duyên và người bạn đời của ${name}: `;
    } else if (palaceName === "TÀI") {
      prefix = `Về đường tài lộc và khả năng quản lý tiền bạc của ${gender}: `;
    } else if (palaceName === "PHỤ") {
      prefix = `Về ơn nghĩa sinh thành và sự hỗ trợ từ cha mẹ dành cho ${gender}: `;
    } else {
      prefix = `Dành cho ${name}, `;
    }

    // Match palace name or common variations
    const palaceVariations: Record<string, string[]> = {
      "MỆNH": ["mệnh", "bản mệnh"],
      "PHỤ": ["phụ mẫu", "cha mẹ"],
      "PHÚC": ["phúc đức", "phúc phận"],
      "ĐIỀN": ["điền trạch", "nhà cửa", "đất đai"],
      "QUAN": ["quan lộc", "sự nghiệp", "công danh"],
      "NÔ": ["nô bộc", "bạn bè", "đồng nghiệp"],
      "THIÊN": ["thiên di", "xuất hành", "đi xa"],
      "TẬT": ["tật ách", "sức khỏe", "bệnh tật"],
      "TÀI": ["tài bạch", "tiền bạc", "tài chính"],
      "TỬ": ["tử tức", "con cái"],
      "PHU": ["phu thê", "hôn nhân", "vợ chồng"],
      "HUYNH": ["huynh đệ", "anh em"]
    };

    const palaceMarkers: Record<string, string> = {
      "MỆNH": "[[CUNG_MENH]]",
      "PHỤ": "[[CUNG_PHU_MAU]]",
      "PHÚC": "[[CUNG_PHUC_DUC]]",
      "ĐIỀN": "[[CUNG_DIEN_TRACH]]",
      "QUAN": "[[CUNG_QUAN_LOC]]",
      "NÔ": "[[CUNG_NO_BOC]]",
      "THIÊN": "[[CUNG_THIEN_DI]]",
      "TẬT": "[[CUNG_TAT_ACH]]",
      "TÀI": "[[CUNG_TAI_BACH]]",
      "TỬ": "[[CUNG_TU_TUC]]",
      "PHU": "[[CUNG_PHU_THE]]",
      "HUYNH": "[[CUNG_HUYNH_DE]]"
    };

    // Extract palace-specific details from content
    const getPalaceBlock = () => {
      if (!content) return [];
      const lines = content.split('\n');
      const marker = palaceMarkers[palaceName];
      const variations = palaceVariations[palaceName] || [palaceName.toLowerCase()];
      
      let startIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        const lLower = l.toLowerCase();
        
        // Check for marker first (highest priority)
        if (marker && l.includes(marker)) {
          startIndex = i;
          break;
        }
        
        // Fallback: Check if line contains palace name and looks like a header
        if (variations.some(v => lLower.includes(v)) && (lLower.includes("cung") || l.startsWith('###') || l.startsWith('**'))) {
          startIndex = i;
          break;
        }
      }
      
      if (startIndex === -1) return [];
      
      const blockLines = [lines[startIndex]];
      for (let i = startIndex + 1; i < lines.length; i++) {
        const l = lines[i];
        const lLower = l.toLowerCase();
        
        // Stop if we hit another marker
        const isAnotherMarker = Object.values(palaceMarkers).some(m => m !== marker && l.includes(m));
        if (isAnotherMarker) break;

        // Stop if we hit another palace header
        const isAnotherPalaceHeader = Object.entries(palaceVariations).some(([pName, pVars]) => {
          if (pName === palaceName) return false;
          const isHeaderFormat = l.startsWith('###') || l.startsWith('**') || l.startsWith('---');
          const isPalaceMention = pVars.some(v => lLower.includes(v));
          return isPalaceMention && (isHeaderFormat || lLower.includes("cung"));
        });
        
        if (isAnotherPalaceHeader) break;
        blockLines.push(lines[i]);
      }
      return blockLines;
    };

    const palaceDetails = getPalaceBlock();

    const influenceLine = palaceDetails.find(l => l.toLowerCase().includes("mức độ ảnh hưởng"));
    const avoidLine = palaceDetails.find(l => l.toLowerCase().includes("điều cần tránh") || l.toLowerCase().includes("lưu ý"));

    // New structured sections extraction
    const extractSection = (title: string) => {
      const index = palaceDetails.findIndex(l => l.toLowerCase().includes(title.toLowerCase()));
      if (index === -1) return null;
      
      const sectionLines = [];
      for (let i = index; i < palaceDetails.length; i++) {
        const line = palaceDetails[i];
        if (i === index) {
          const afterColon = line.replace(new RegExp(`.*${title}:?\\s*`, 'i'), '').trim();
          if (afterColon) sectionLines.push(afterColon);
          continue;
        }
        
        // Stop if we hit the next numbered section (e.g., "2.", "2/", "**2.**")
        if (/^(\*\*|\d+[\.\/])/.test(line.trim())) break;
        
        if (line.toLowerCase().includes("mức độ ảnh hưởng") || line.toLowerCase().includes("điều cần tránh")) break;

        if (line.trim()) sectionLines.push(line.trim());
      }
      
      return sectionLines.join('\n') || null;
    };

    const overview = extractSection("1. Tổng quan");
    const starMeanings = extractSection("2. Ý nghĩa");
    const manifestations = extractSection("3. Biểu hiện");
    const advantages = extractSection("4. Thuận lợi");
    const challenges = extractSection("5. Thử thách");
    const advice = extractSection("6. Lời khuyên");
    
    const hasAnySection = overview || starMeanings || manifestations || advantages || challenges || advice;

    const getStatusInfo = (line?: string) => {
      if (!line) return { label: "Đang Phân Tích", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Info size={14} /> };
      const l = line.toLowerCase();
      if (l.includes("tốt") || l.includes("cát") || l.includes("vượng") || l.includes("hanh thông")) return { label: "Đại Cát", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <Sparkles size={14} /> };
      if (l.includes("xấu") || l.includes("hung") || l.includes("hãm") || l.includes("trắc trở")) return { label: "Cần Thận Trọng", color: "text-red-600 bg-red-50 border-red-100", icon: <Flame size={14} /> };
      return { label: "Bình Hòa", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Info size={14} /> };
    };

    const status = getStatusInfo(influenceLine);

    if (palaceDetails.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          {isGenerating ? (
            <>
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <p className="text-sm font-serif italic text-black/40">Thiên Sư đang thấu thị huyền cơ cho cung này...</p>
              <p className="text-[10px] text-black/20 uppercase tracking-widest">Vui lòng chờ trong giây lát</p>
            </>
          ) : (
            <>
              <ScrollText className="w-8 h-8 text-black/20" />
              <p className="text-sm font-serif italic text-black/40">Thông tin cung này đang được Thiên Sư cập nhật...</p>
              <p className="text-[10px] text-black/20 uppercase tracking-widest">Dữ liệu chưa hiển thị đầy đủ</p>
            </>
          )}
        </div>
      );
    }

    if (!hasAnySection) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 rounded-r-xl flex-1">
              <p className="font-bold text-blue-900 text-sm leading-relaxed">{prefix}</p>
            </div>
            <div className={`px-4 py-2 rounded-2xl border ${status.color} flex flex-col items-center justify-center min-w-[100px] shadow-sm`}>
              {status.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{status.label}</span>
            </div>
          </div>
          
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="text-xs text-gray-400 font-medium">Thiên Sư đang soạn thảo chi tiết cho cung {palaceName}...</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div className="markdown-body markdown-light text-sm leading-relaxed text-justify">
                <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {palaceDetails.join('\n')}
                </Markdown>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 rounded-r-xl flex-1">
            <p className="font-bold text-blue-900 text-sm leading-relaxed">{prefix}</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border ${status.color} flex flex-col items-center justify-center min-w-[100px] shadow-sm`}>
            {status.icon}
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{status.label}</span>
          </div>
        </div>

        {overview && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <ScrollText size={16} />
              <h5 className="text-xs font-bold uppercase tracking-widest text-blue-900">Phân tích Tổng quan</h5>
            </div>
            <div className="markdown-body markdown-light text-sm leading-relaxed text-justify">
              <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{overview}</Markdown>
            </div>
          </div>
        )}

        {starMeanings && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <Star size={16} />
              <h5 className="text-xs font-bold uppercase tracking-widest text-amber-900">Luận giải Tinh tú</h5>
            </div>
            <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50 markdown-body markdown-light text-sm leading-relaxed">
              <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{starMeanings}</Markdown>
            </div>
          </div>
        )}

        {manifestations && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-600">
              <User size={16} />
              <h5 className="text-xs font-bold uppercase tracking-widest text-purple-900">Biểu hiện thực tế</h5>
            </div>
            <div className="bg-purple-50/30 p-4 rounded-2xl border border-purple-100/50">
              <p className="text-sm text-gray-800 leading-relaxed italic">"{manifestations}"</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advantages && (
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <Sparkles size={14} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900">Thuận lợi</p>
              </div>
              <div className="markdown-body markdown-light text-xs leading-relaxed">
                <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{advantages}</Markdown>
              </div>
            </div>
          )}
          {challenges && (
            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-2">
              <div className="flex items-center gap-2 text-orange-600">
                <Flame size={14} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-900">Thử thách</p>
              </div>
              <div className="markdown-body markdown-light text-xs leading-relaxed">
                <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{challenges}</Markdown>
              </div>
            </div>
          )}
        </div>

        {advice && (
          <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200/50 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck size={18} />
              <h5 className="text-xs font-bold uppercase tracking-widest text-white">Lời khuyên Thiên Sư</h5>
            </div>
            <div className="markdown-body text-sm text-blue-50 leading-relaxed font-medium">
              <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{advice}</Markdown>
            </div>
          </div>
        )}

        {influenceLine && (
          <div className="bg-white/50 p-4 rounded-2xl border border-gray-100 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mức độ ảnh hưởng</p>
            <p className="text-sm text-gray-800 leading-relaxed">{influenceLine.replace(/.*mức độ ảnh hưởng:?\s*/i, '').trim()}</p>
          </div>
        )}

        {avoidLine && (
          <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldCheck size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Điều cần tránh & Lưu ý</p>
            </div>
            <p className="text-sm text-red-900 leading-relaxed italic">{avoidLine.replace(/.*(điều cần tránh|lưu ý):?\s*/i, '').trim()}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info size={12} />
              Ghi chú:
            </p>
            <p className="text-[11px] text-blue-800 italic leading-relaxed">
              "Kết quả phân tích trên được Thiên Sư tổng hợp từ sự phối hợp của các tinh tú tọa thủ, xung chiếu và tam hợp trong mệnh cục của con."
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-1 md:p-4 bg-white border border-gray-300 shadow-2xl overflow-hidden text-black font-sans relative">
      <div className="grid grid-cols-4 gap-0 border border-gray-400 aspect-[4/5] md:aspect-square relative">
        {/* Row 1 */}
        {[5, 6, 7, 8].map(chiIdx => (
          <PalaceCell 
            key={chiIdx} 
            chi={chiList[chiIdx]} 
            palace={getPalaceAtChi(chiList[chiIdx])} 
            isThan={chart.than === chiList[chiIdx]}
            truongSinh={chart.truongSinh[chiList[chiIdx]]} 
            stars={chart.stars[chiList[chiIdx]]} 
            daiHan={chart.daiHan[chiList[chiIdx]]}
            tieuHan={chart.tieuHan[chiList[chiIdx]]}
            isHovered={hoveredPalace === chiList[chiIdx]}
            isSelected={selectedPalace?.chi === chiList[chiIdx]}
            onHover={() => setHoveredPalace(chiList[chiIdx])}
            onLeave={() => setHoveredPalace(null)}
            onClick={() => handlePalaceClick(chiList[chiIdx], getPalaceAtChi(chiList[chiIdx]))}
          />
        ))}
        
        {/* Row 2 */}
        <PalaceCell 
          chi={chiList[4]} 
          palace={getPalaceAtChi(chiList[4])} 
          isThan={chart.than === chiList[4]} 
          truongSinh={chart.truongSinh[chiList[4]]} 
          stars={chart.stars[chiList[4]]} 
          daiHan={chart.daiHan[chiList[4]]} 
          tieuHan={chart.tieuHan[chiList[4]]}
          isHovered={hoveredPalace === chiList[4]}
          isSelected={selectedPalace?.chi === chiList[4]}
          onHover={() => setHoveredPalace(chiList[4])}
          onLeave={() => setHoveredPalace(null)}
          onClick={() => handlePalaceClick(chiList[4], getPalaceAtChi(chiList[4]))}
        />
        
        {/* Thiên Bàn (Center 2x2) */}
        <div className="col-span-2 row-span-2 flex flex-col items-center justify-center p-2 md:p-4 text-center space-y-1 md:space-y-2 relative border border-gray-300 bg-white text-black">
          <AnimatePresence>
            {selectedPalace ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-20 bg-white p-4 flex flex-col items-center justify-center text-center"
              >
                <button 
                  onClick={() => setSelectedPalace(null)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                        <ScrollText size={20} className="text-red-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-bold text-red-600 uppercase tracking-widest leading-none">Cung {selectedPalace.name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Chi tiết cung vị & Tinh tú</p>
                      </div>
                    </div>
                    
                    {/* Palace Preview "Cut-out" */}
                    <div className="w-24 h-24 scale-75 origin-right">
                      <PalaceCell 
                        chi={selectedPalace.chi}
                        palace={selectedPalace.name}
                        isThan={chart.than === selectedPalace.chi}
                        truongSinh={chart.truongSinh[selectedPalace.chi]}
                        stars={selectedPalace.stars}
                        daiHan={chart.daiHan[selectedPalace.chi]}
                        tieuHan={chart.tieuHan[selectedPalace.chi]}
                        isSelected={true}
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-left">
                    {getPersonalizedAnnotation(selectedPalace.name, selectedPalace.stars)}
                  </div>
                  <button 
                    onClick={() => setSelectedPalace(null)}
                    className="mt-6 w-full py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                  >
                    Đóng chú giải
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="relative z-10 w-full space-y-1 md:space-y-2">
            <h2 className="text-red-600 font-serif font-bold text-sm md:text-2xl uppercase tracking-widest leading-tight">Lá số tử vi</h2>
            
            <div className="h-px w-1/2 bg-blue-600 mx-auto my-1 md:my-2" />
            
            <h3 className="text-black font-serif font-bold text-lg md:text-3xl italic leading-none">Thiên Mệnh Ký</h3>
            
            <div className="grid grid-cols-1 gap-y-0 md:gap-y-0.5 text-[8px] md:text-sm text-center pt-1 md:pt-2">
              <div className="flex justify-center gap-2">
                <span className="text-gray-500">Họ tên:</span>
                <span className="font-bold">{chart.fullName}</span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-gray-500">Năm:</span>
                <span className="font-bold">{chart.lunarDate.year} ({chart.yearCanChi.can} {chart.yearCanChi.chi})</span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-gray-500">Tháng:</span>
                <span className="font-bold">{chart.lunarDate.month} ({chart.monthCanChi.can} {chart.monthCanChi.chi})</span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-gray-500">Ngày:</span>
                <span className="font-bold">{chart.lunarDate.day} ({chart.dayCanChi.can} {chart.dayCanChi.chi})</span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-gray-500">Giờ:</span>
                <span className="font-bold">{chart.hourCanChi.chi} ({chart.hourCanChi.can} {chart.hourCanChi.chi})</span>
              </div>
              
              <div className="mt-1 md:mt-2 text-[7px] md:text-xs space-y-0">
                <div className="flex justify-center gap-2">
                  <span className="text-gray-500">Năm xem:</span>
                  <span className="font-bold">{new Date().getFullYear()}, {chart.age} tuổi</span>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="text-gray-500">Âm dương:</span>
                  <span className="font-bold text-red-600">{chart.yinYang}</span>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="text-gray-500">Bản mệnh:</span>
                  <span className="font-bold">{chart.banMenh}</span>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="text-gray-500">Cục:</span>
                  <span className="font-bold">{chart.cuc}</span>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="text-gray-500">Mệnh chủ:</span>
                  <span className="font-bold">{chart.menhChu}</span>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="text-gray-500">Thân chủ:</span>
                  <span className="font-bold">{chart.thanChu}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <PalaceCell 
          chi={chiList[9]} 
          palace={getPalaceAtChi(chiList[9])} 
          isThan={chart.than === chiList[9]} 
          truongSinh={chart.truongSinh[chiList[9]]} 
          stars={chart.stars[chiList[9]]} 
          daiHan={chart.daiHan[chiList[9]]} 
          tieuHan={chart.tieuHan[chiList[9]]}
          isHovered={hoveredPalace === chiList[9]}
          isSelected={selectedPalace?.chi === chiList[9]}
          onHover={() => setHoveredPalace(chiList[9])}
          onLeave={() => setHoveredPalace(null)}
          onClick={() => handlePalaceClick(chiList[9], getPalaceAtChi(chiList[9]))}
        />

        {/* Row 3 */}
        <PalaceCell 
          chi={chiList[3]} 
          palace={getPalaceAtChi(chiList[3])} 
          isThan={chart.than === chiList[3]} 
          truongSinh={chart.truongSinh[chiList[3]]} 
          stars={chart.stars[chiList[3]]} 
          daiHan={chart.daiHan[chiList[3]]} 
          tieuHan={chart.tieuHan[chiList[3]]}
          isHovered={hoveredPalace === chiList[3]}
          isSelected={selectedPalace?.chi === chiList[3]}
          onHover={() => setHoveredPalace(chiList[3])}
          onLeave={() => setHoveredPalace(null)}
          onClick={() => handlePalaceClick(chiList[3], getPalaceAtChi(chiList[3]))}
        />
        <PalaceCell 
          chi={chiList[10]} 
          palace={getPalaceAtChi(chiList[10])} 
          isThan={chart.than === chiList[10]} 
          truongSinh={chart.truongSinh[chiList[10]]} 
          stars={chart.stars[chiList[10]]} 
          daiHan={chart.daiHan[chiList[10]]} 
          tieuHan={chart.tieuHan[chiList[10]]}
          isHovered={hoveredPalace === chiList[10]}
          isSelected={selectedPalace?.chi === chiList[10]}
          onHover={() => setHoveredPalace(chiList[10])}
          onLeave={() => setHoveredPalace(null)}
          onClick={() => handlePalaceClick(chiList[10], getPalaceAtChi(chiList[10]))}
        />

        {/* Row 4 */}
        {[2, 1, 0, 11].map(chiIdx => (
          <PalaceCell 
            key={chiIdx} 
            chi={chiList[chiIdx]} 
            palace={getPalaceAtChi(chiList[chiIdx])} 
            isThan={chart.than === chiList[chiIdx]}
            truongSinh={chart.truongSinh[chiList[chiIdx]]} 
            stars={chart.stars[chiList[chiIdx]]} 
            daiHan={chart.daiHan[chiList[chiIdx]]}
            tieuHan={chart.tieuHan[chiList[chiIdx]]}
            isHovered={hoveredPalace === chiList[chiIdx]}
            isSelected={selectedPalace?.chi === chiList[chiIdx]}
            onHover={() => setHoveredPalace(chiList[chiIdx])}
            onLeave={() => setHoveredPalace(null)}
            onClick={() => handlePalaceClick(chiList[chiIdx], getPalaceAtChi(chiList[chiIdx]))}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-2 md:mt-4 flex flex-wrap justify-center gap-4 text-[8px] md:text-xs border-t pt-2">
        {Object.entries(ELEMENT_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1">
            <div className={`w-3 h-3 md:w-4 md:h-4 ${color.replace('text-', 'bg-')}`} />
            <span className="font-bold">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PalaceCell = React.memo(({ 
  chi, 
  palace, 
  isThan, 
  truongSinh, 
  stars, 
  daiHan, 
  tieuHan,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick
}: { 
  chi: string, 
  palace?: string, 
  isThan?: boolean, 
  truongSinh: string, 
  stars: string[], 
  daiHan: number, 
  tieuHan: string,
  isHovered?: boolean,
  isSelected?: boolean,
  onHover?: () => void,
  onLeave?: () => void,
  onClick?: () => void
}) => {
  // Separate primary and secondary stars
  const primaryStars = stars.slice(0, 2);
  const secondaryStars = stars.slice(2);
  
  // Split secondary stars into two columns
  const leftStars = secondaryStars.filter((_, i) => i % 2 === 0);
  const rightStars = secondaryStars.filter((_, i) => i % 2 !== 0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div 
      onMouseEnter={!isMobile ? onHover : undefined}
      onMouseLeave={!isMobile ? onLeave : undefined}
      onClick={onClick}
      animate={{
        backgroundColor: isSelected ? "#eff6ff" : isHovered ? "#f8fafc" : "#ffffff",
        scale: isHovered && !isMobile ? 1.02 : 1,
        zIndex: isHovered && !isMobile ? 10 : 1
      }}
      transition={{ duration: 0.2 }}
      className={`relative p-1 md:p-2 border border-gray-300 flex flex-col justify-between aspect-square overflow-hidden cursor-pointer transition-shadow text-black ${isHovered && !isMobile ? 'shadow-xl' : ''}`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none z-10" />
      )}

      {/* Header */}
      <div className="flex justify-between items-start leading-none relative z-0">
        <div className="flex flex-col">
          <span className={`text-[8px] md:text-sm font-bold uppercase ${getPalaceColor(chi)}`}>
            {palace || "-"}
          </span>
          {isThan && (
            <span className="text-[7px] md:text-[10px] text-orange-600 font-bold">
              {"<THÂN>"}
            </span>
          )}
        </div>
        <span className="text-[8px] md:text-sm font-bold text-gray-600">{daiHan}</span>
      </div>

      {/* Stars Area */}
      <div className="flex-1 flex flex-col mt-1 relative z-0">
        {/* Primary Stars */}
        <div className="text-center mb-1">
          {primaryStars.map((star, i) => (
            <div key={i} className={`text-[9px] md:text-base font-serif font-bold leading-tight ${ELEMENT_COLORS[getStarElement(star)]}`}>
              {star.toUpperCase()}
            </div>
          ))}
          {primaryStars.length === 0 && <div className="text-[7px] md:text-[10px] text-gray-300 italic">Vô chính diệu</div>}
        </div>

        {/* Secondary Stars Columns */}
        <div className="grid grid-cols-2 gap-x-1 text-[6px] md:text-[10px] leading-tight">
          <div className="flex flex-col items-start">
            {leftStars.map((star, i) => (
              <span key={i} className={`${ELEMENT_COLORS[getStarElement(star)]} whitespace-nowrap`}>{star}</span>
            ))}
          </div>
          <div className="flex flex-col items-end text-right">
            {rightStars.map((star, i) => (
              <span key={i} className={`${ELEMENT_COLORS[getStarElement(star)]} whitespace-nowrap`}>{star}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end text-[6px] md:text-[10px] text-gray-500 font-medium mt-auto border-t border-gray-100 pt-0.5 relative z-0">
        <div className="flex flex-col">
          <span>ĐV.TẬT</span>
          <span>{truongSinh}</span>
        </div>
        <div className="flex flex-col items-end">
          <span>LN.{palace?.split(' ')[0] || "TỬ"}</span>
          <span className="font-bold">{chi}</span>
        </div>
      </div>
    </motion.div>
  );
});
