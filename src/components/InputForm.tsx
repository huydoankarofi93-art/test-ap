import React, { useState, useEffect, useCallback } from 'react';
import { UserData, Gender, ReadingType, BabyGender, DivinationMethod, HeritageMode, ResidenceStatus, AnalysisMethod } from '../types';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, ArrowRight, LayoutGrid, CalendarDays, CalendarRange, Baby, Users, Sparkles, ShieldCheck, History, Zap, AlertCircle, RefreshCw, Heart, UserMinus, Users2, HelpCircle, Home, Plus, Compass, CheckSquare, Square } from 'lucide-react';
import { PROVINCES } from '../constants/provinces';
import { isValidName, isValidYear, sanitizeInput } from '../utils/security';

interface Props {
  data: UserData;
  onChange: (data: UserData) => void;
  onNext: (data: UserData) => void;
}

export const InputForm = React.memo(({ data, onChange, onNext }: Props) => {
  const [localData, setLocalData] = React.useState(data);

  // Sync local data with parent data when parent data changes (e.g. on reset)
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [adminEra, setAdminEra] = useState<'historical' | 'future'>('historical');

  const getFilteredProvinces = () => {
    if (adminEra === 'historical') {
      return PROVINCES.filter(p => p.isHistorical); // 64
    }
    // Future (34)
    return PROVINCES.filter(p => p.isConsolidated);
  };

  const eraLabels = {
    historical: 'Trước 2008 (64 Tỉnh)',
    future: 'Sau 2025 (34 Tỉnh)'
  };

  const cycleEra = () => {
    setAdminEra(prev => (prev === 'historical' ? 'future' : 'historical'));
  };

  const handleLocalChange = useCallback((updates: Partial<UserData>) => {
    setLocalData(prev => {
      const newData = { ...prev, ...updates };
      
      // Handle specific logic for reading types
      if (updates.readingType === 'full' && !newData.selectedMethods) {
        newData.selectedMethods = ['tuvi'];
      }
      if (updates.readingType === 'divination') {
        if (!newData.divinationFocus) newData.divinationFocus = 'general';
        if (!newData.divinationUrgency) newData.divinationUrgency = 'medium';
        if (!newData.divinationMethod) newData.divinationMethod = 'auto';
      }

      return newData;
    });

    // We use a timeout or another mechanism to notify parent with latest data
    // Or better, we compute the next data here and call both
  }, []);

  // Use an effect to notify parent of critical changes
  useEffect(() => {
    const criticalFields: (keyof UserData)[] = [
      'readingType', 'gender', 'babyGender', 'heritageMode', 
      'divinationMethod', 'divinationFocus', 'divinationUrgency', 
      'readingMode', 'familyStatus'
    ];
    
    // We only notify if data actually changed from what parent has
    // and it's one of the critical fields
    const hasCriticalChange = criticalFields.some(field => {
      if (field === 'familyStatus') {
        return JSON.stringify(localData[field]) !== JSON.stringify(data[field]);
      }
      return localData[field] !== data[field];
    });

    if (hasCriticalChange) {
      onChange(localData);
    }
  }, [localData, data, onChange]);

  const handleBlur = useCallback(() => {
    onChange(localData);
  }, [onChange, localData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onChange(localData); // Ensure parent has latest data before proceeding
    
    if (localData.readingType === 'name') {
      if (localData.fullName.trim()) {
        onNext(localData);
      }
      return;
    }
    if (localData.readingType === 'baby_name') {
      if (
        localData.fatherName?.trim() && 
        localData.motherName?.trim() && 
        localData.fatherBirthYear?.trim() && 
        localData.motherBirthYear?.trim() &&
        localData.birthDate &&
        localData.birthPlace
      ) {
        const finalData = { ...localData, heritageMode: localData.heritageMode || 'traditional' };
        onChange(finalData);
        onNext(finalData);
      }
      return;
    }
    if (localData.readingType === 'numerology') {
      if (localData.fullName.trim() && localData.birthDate) {
        onNext(localData);
      }
      return;
    }
    if (localData.readingType === 'divination') {
      if (localData.divinationMethod === 'question' && !localData.divinationQuestion?.trim()) return;
      if (localData.divinationMethod === 'coins' && (localData.divinationCoins?.length || 0) < 6) return;
      if (localData.divinationMethod === 'sticks' && !localData.divinationStick) return;
      
      let finalData = { ...localData };
      // Ensure latest time for auto method
      if (localData.divinationMethod === 'auto') {
        finalData.divinationTime = new Date().toISOString();
      }
      
      onChange(finalData);
      onNext(finalData);
      return;
    }
    if (localData.readingType === 'palm') {
      onNext(localData);
      return;
    }
    if (localData.fullName && localData.birthDate && localData.birthTime && localData.birthPlace) {
      onNext(localData);
    }
  }, [onChange, onNext, localData]);

  const readingTypes: { id: ReadingType; label: string; icon: any; desc: string }[] = [
    { id: 'full', label: 'Bản Mệnh', icon: LayoutGrid, desc: 'Tổng hợp: Tử Vi, Bát Tự, Chỉ Tay & Tính Danh' },
    { id: 'tuvi', label: 'Lá Số Tử Vi', icon: Plus, desc: 'Lập lá số & Luận giải chi tiết' },
    { id: 'yearly_horoscope', label: 'Tử Vi Năm', icon: CalendarRange, desc: 'Chi tiết Sao hạn, Tam Tai, Thái Tuế hàng năm' },
    { id: 'yearly', label: 'Vận Thế Năm', icon: CalendarRange, desc: 'Xu thế Ngũ hành, Tài lộc & Sự nghiệp năm mới' },
    { id: 'name', label: 'Tính Danh', icon: User, desc: 'Phân tích năng lượng từ Họ Tên & Ngày sinh' },
    { id: 'baby_name', label: 'Đặt Tên Con', icon: Baby, desc: 'Tìm tên trợ mệnh cho bé theo tuổi Bố Mẹ' },
    { id: 'monthly', label: 'Vận Tháng', icon: CalendarRange, desc: 'Chi tiết biến động 30 ngày trong tháng' },
    { id: 'daily', label: 'Vận Ngày', icon: CalendarDays, desc: 'Chọn ngày lành, giờ tốt cho việc đại sự' },
    { id: 'numerology', label: 'Thần Số Học', icon: Sparkles, desc: 'Giải mã mật mã linh hồn qua các con số' },
    { id: 'palm', label: 'Chỉ Tay', icon: History, desc: 'Thấu thị thực tại qua lòng bàn tay' },
    { id: 'villa', label: 'Góc Biệt Thự', icon: Home, desc: 'Tâm lý & Chữa lành chuyên sâu cho Phái Nữ' },
    { id: 'seven_killings', label: 'Thất Sát', icon: Compass, desc: 'Chiến lược & Tầm nhìn dài hạn' },
  ];

  const filteredReadingTypes = readingTypes.filter(t => {
    if (t.id === 'villa') return localData.gender === 'Nữ';
    return true;
  });

  const isNameOnly = localData.readingType === 'name' || localData.readingType === 'numerology';
  const isBabyNaming = localData.readingType === 'baby_name';
  const isPalmOnly = localData.readingType === 'palm';
  const isVilla = localData.readingType === 'villa';

  const canProceed = () => {
    if (isPalmOnly) {
      // For palm only, we allow proceeding with just gender, 
      // but we'll show a hint that full info unlocks Master Analysis
      return localData.gender;
    }
    if (isVilla) {
      return (
        localData.fullName?.trim() && 
        isValidName(localData.fullName) &&
        localData.gender === 'Nữ' &&
        localData.birthDate && 
        localData.birthTime && 
        localData.birthPlace?.trim()
      );
    }
    if (isNameOnly) {
      if (localData.readingType === 'numerology') {
        return localData.fullName.trim().length > 0 && isValidName(localData.fullName) && localData.birthDate;
      }
      return localData.fullName.trim().length > 0 && isValidName(localData.fullName);
    }
    if (isBabyNaming) return (
      localData.fatherName?.trim() && 
      isValidName(localData.fatherName) &&
      localData.motherName?.trim() && 
      isValidName(localData.motherName) &&
      localData.fatherBirthYear?.trim() && 
      isValidYear(localData.fatherBirthYear) &&
      localData.motherBirthYear?.trim() && 
      isValidYear(localData.motherBirthYear) &&
      localData.birthDate &&
      localData.birthPlace
    );
    // For full, yearly, monthly, daily, yearly_horoscope, tuvi, seven_killings: require everything
    return (
      localData.fullName?.trim() && 
      isValidName(localData.fullName) &&
      localData.gender &&
      localData.birthDate && 
      localData.birthTime && 
      localData.birthPlace?.trim() && 
      localData.currentPlace?.trim() &&
      (!['yearly', 'monthly', 'daily', 'yearly_horoscope'].includes(localData.readingType) ? true : localData.targetDate)
    );
  };

  const toggleMethod = (method: AnalysisMethod) => {
    const currentMethods = localData.selectedMethods || ['tuvi'];
    let newMethods: AnalysisMethod[];
    
    if (currentMethods.includes(method)) {
      newMethods = currentMethods.filter(m => m !== method);
      if (newMethods.length === 0) newMethods = ['tuvi'];
    } else {
      newMethods = [...currentMethods, method];
    }
    
    handleLocalChange({ selectedMethods: newMethods });
  };

  const analysisMethods: { id: AnalysisMethod; label: string; desc: string }[] = [
    { id: 'tuvi', label: 'Lá Số Tử Vi', desc: 'Mặc định: Phân tích 12 cung & các sao' },
    { id: 'palm', label: 'Xem Chỉ Tay', desc: 'Kết hợp thấu thị qua lòng bàn tay' },
    { id: 'elements', label: 'Phân Tích Ngũ Hành', desc: 'Cân bằng năng lượng Kim-Mộc-Thủy-Hỏa-Thổ' },
    { id: 'numerology', label: 'Thần Số Học', desc: 'Giải mã mật mã họ tên & ngày sinh' },
  ];

  const analysisCombos = [
    { id: 'traditional', label: 'Truyền Thống', methods: ['tuvi'], desc: 'Tập trung sâu vào Tử Vi Đẩu Số' },
    { id: 'holistic', label: 'Toàn Diện', methods: ['tuvi', 'palm', 'elements'], desc: 'Kết hợp Thiên - Địa - Nhân' },
    { id: 'modern', label: 'Hiện Đại', methods: ['tuvi', 'numerology'], desc: 'Sự giao thoa Đông Tây' },
    { id: 'ultimate', label: 'Tối Thượng', methods: ['tuvi', 'palm', 'elements', 'numerology'], desc: 'Thấu thị mọi góc độ mệnh cục' },
  ];

  const applyCombo = (methods: AnalysisMethod[]) => {
    handleLocalChange({ selectedMethods: methods as AnalysisMethod[] });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl 2xl:max-w-7xl mx-auto space-y-4 md:space-y-6 py-4">
      <div className="text-center space-y-2">
        <span className="section-subtitle">Khởi Đầu Hành Trình</span>
        <h2 className="section-title">Thông Tin Luận Giải</h2>
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div className="h-px w-8 md:w-16 bg-gold/10" />
          <p className="text-white/40 italic font-serif text-[10px] md:text-xs max-w-xl mx-auto leading-relaxed">
            {isNameOnly 
              ? '"Danh chính thì ngôn thuận. Hãy cung cấp họ tên đầy đủ để Thiên Mệnh Ký chiêm nghiệm."'
              : isBabyNaming
              ? '"Cái tên là món quà đầu đời. Hãy cung cấp tên của song thân để Thiên Mệnh Ký tìm tên đẹp cho cháu."'
              : isPalmOnly
              ? '"Bàn tay là bản đồ của số phận. Hãy cung cấp ảnh lòng bàn tay rõ nét để Thiên Mệnh Ký thấu thị."'
              : '"Mệnh tại thiên, vận tại nhân. Hãy cung cấp thông tin chính xác để Thiên Mệnh Ký có cái nhìn thấu đáo nhất."'
            }
          </p>
          <div className="h-px w-12 md:w-24 bg-gold/10" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/5 shadow-2xl">
          {filteredReadingTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleLocalChange({ readingType: type.id })}
              className={`flex items-center gap-1.5 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl relative group transition-all hover:scale-[1.02] ${
                localData.readingType === type.id 
                  ? 'bg-accent text-white shadow-2xl shadow-accent/30' 
                  : 'text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              <type.icon size={12} className={`relative z-10 md:w-3.5 md:h-3.5 ${localData.readingType === type.id ? 'text-white' : 'text-gold/60'}`} />
              <span className="relative z-10 font-display font-bold text-[8px] md:text-[10px] uppercase tracking-[0.05em] whitespace-nowrap">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {localData.readingType === 'full' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-2 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="section-subtitle">Gợi Ý Kết Hợp</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-display font-bold text-white uppercase tracking-widest">Gói Luận Giải Khuyên Dùng</h3>
                  <div className="group relative">
                    <HelpCircle size={20} className="text-gold/40 hover:text-gold cursor-help transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 p-6 rounded-3xl bg-[#1A1412] backdrop-blur-xl border border-gold/20 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                      <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-3">Hướng dẫn khuyên dùng</h4>
                      <div className="space-y-3 text-[11px] text-white/70 leading-relaxed font-serif">
                        <p><strong className="text-gold">Truyền Thống:</strong> Phù hợp nếu bạn muốn luận giải kinh điển, tập trung vào các đại vận và tiểu vận.</p>
                        <p><strong className="text-gold">Toàn Diện:</strong> Khuyên dùng cho người muốn thấu hiểu cả "Mệnh" (Tử Vi), "Khí" (Ngũ Hành) và "Thân" (Chỉ Tay).</p>
                        <p><strong className="text-gold">Hiện Đại:</strong> Kết hợp giữa triết học phương Đông và tâm lý học phương Tây qua các con số.</p>
                        <p><strong className="text-gold">Tối Thượng:</strong> Bản luận giải chi tiết nhất, quét sạch mọi góc khuất của số phận.</p>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1A1412] border-r border-b border-gold/20 rotate-45" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/40 italic">Chọn nhanh các tổ hợp phương pháp tối ưu cho từng nhu cầu.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {analysisCombos.map((combo) => {
                const currentMethods = localData.selectedMethods || ['tuvi'];
                const isSelected = combo.methods.length === currentMethods.length && 
                                  combo.methods.every(m => currentMethods.includes(m as AnalysisMethod));
                
                return (
                  <button
                    key={combo.id}
                    type="button"
                    onClick={() => applyCombo(combo.methods as AnalysisMethod[])}
                    className={`flex flex-col p-3 rounded-xl border transition-all duration-500 text-left group relative overflow-hidden ${
                      isSelected
                        ? 'bg-gold/10 border-gold/40 shadow-2xl shadow-gold/10'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className={`p-1 rounded-lg ${isSelected ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40'}`}>
                        <Zap size={12} />
                      </div>
                      {isSelected && <div className="text-[6px] font-bold text-gold uppercase tracking-widest">Đang chọn</div>}
                    </div>
                    <div className={`font-display font-bold text-[10px] uppercase tracking-widest mb-0.5 ${isSelected ? 'text-gold' : 'text-white/60'}`}>
                      {combo.label}
                    </div>
                    <div className="text-[7px] text-white/40 leading-tight group-hover:text-white/60 transition-colors">
                      {combo.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="section-subtitle">Tùy Chọn Phương Pháp</span>
                <h3 className="text-base md:text-lg font-display font-bold text-white uppercase tracking-widest">Thuật Toán Luận Giải</h3>
                <p className="text-[9px] text-white/40 italic">Mặc định sử dụng Tử Vi. Tích chọn thêm để kết hợp đa phương pháp.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {analysisMethods.map((method) => {
              const isSelected = (localData.selectedMethods || ['tuvi']).includes(method.id);
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => toggleMethod(method.id)}
                  className={`flex flex-col p-3 rounded-xl border transition-all duration-500 text-left group relative overflow-hidden ${
                    isSelected
                      ? 'bg-accent/10 border-accent/40 shadow-2xl shadow-accent/10'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-accent/20 text-accent' : 'bg-white/5 text-white/40'}`}>
                      {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                    </div>
                  </div>
                  <div className={`font-display font-bold text-[10px] uppercase tracking-widest mb-0.5 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                    {method.label}
                  </div>
                  <div className="text-[8px] text-white/40 leading-tight group-hover:text-white/60 transition-colors">
                    {method.desc}
                  </div>
                  {isSelected && (
                    <motion.div 
                      layoutId="method-active"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )}

      <div className="min-h-[300px]">
        <div className="glass-panel border-white/5 shadow-2xl relative overflow-hidden">
          {/* Decorative background for the active tab content */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full -z-10" />

          <div className="card-header">
            <h3 className="text-lg md:text-xl font-display font-bold text-white flex items-center gap-3">
              <Sparkles className="text-gold" size={18} />
              {readingTypes.find(t => t.id === localData.readingType)?.label}
              <span className="text-[10px] font-serif italic text-white/30 font-normal ml-auto hidden md:block">
                {readingTypes.find(t => t.id === localData.readingType)?.desc}
              </span>
            </h3>
          </div>

          <div className="card-body">
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-3 md:gap-4 2xl:gap-6">
          {localData.readingType === 'numerology' && (
            <div className="md:col-span-2 2xl:col-span-3 text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles size={14} /> Thần Số Học Pitago
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Giải Mã Mật Mã Linh Hồn</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-sm leading-relaxed">
                Hệ thống sẽ sử dụng Họ Tên và Ngày Sinh của con để tính toán các con số rung động, 
                từ đó thấu thị bản chất tâm hồn, sứ mệnh cuộc đời và những giai đoạn thăng trầm quan trọng.
              </p>
            </div>
          )}
        {isPalmOnly ? (
          <>
            <div className="md:col-span-2 2xl:col-span-3 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <User size={14} className="text-gold" /> Họ Tên (Tùy chọn)
              </label>
              <input
                type="text"
                value={localData.fullName || ''}
                onChange={(e) => handleLocalChange({ fullName: e.target.value })}
                onBlur={handleBlur}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="input-spiritual"
              />
            </div>
            <div className="md:col-span-2 2xl:col-span-3 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <User size={14} className="text-gold" /> Giới Tính
              </label>
              <div className="flex gap-2">
                {(['Nam', 'Nữ'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleLocalChange({ gender: g })}
                    className={`flex-1 py-2 md:py-3 rounded-xl border font-bold transition-all duration-700 hover:scale-[1.02] ${
                      localData.gender === g
                        ? 'bg-accent/20 text-accent border-accent/40 shadow-xl shadow-accent/10'
                        : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 2xl:col-span-3 pt-4 border-t border-white/5">
              <span className="section-subtitle">Thông Tin Bổ Trợ</span>
              <h3 className="text-base md:text-lg font-display font-bold text-white mb-2">Dữ Liệu Mệnh Lý (Tùy chọn)</h3>
              <div className="grid grid-cols-1 2xl:grid-cols-3 gap-2 md:gap-3">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                    <Calendar size={14} className="text-gold" /> Ngày Sinh
                  </label>
                  <input
                    type="date"
                    min="1900-01-01"
                    max={new Date().toISOString().split('T')[0]}
                    value={localData.birthDate || ''}
                    onChange={(e) => handleLocalChange({ birthDate: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual"
                  />
                  <p className="text-[9px] text-white/20 italic font-serif tracking-wide">* Năm sinh bắt buộc 4 chữ số (Ví dụ: 1990)</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                      <MapPin size={14} className="text-gold" /> Nơi Sinh
                    </label>
                    <button 
                      type="button"
                      onClick={cycleEra}
                      className="flex items-center gap-1 text-[9px] font-bold text-gold/60 hover:text-gold transition-colors uppercase tracking-widest"
                    >
                      <RefreshCw size={8} /> {eraLabels[adminEra]}
                    </button>
                  </div>
                  <select
                    value={localData.birthPlace || ''}
                    onChange={(e) => handleLocalChange({ birthPlace: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual appearance-none"
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
            </div>
          </>
        ) : isBabyNaming ? (
          <>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <User size={14} className="text-gold" /> Họ tên Bố
              </label>
              <input
                type="text"
                required
                value={localData.fatherName || ''}
                onChange={(e) => handleLocalChange({ fatherName: sanitizeInput(e.target.value) })}
                onBlur={handleBlur}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="input-spiritual"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <Calendar size={14} className="text-gold" /> Năm sinh Bố
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                pattern="[0-9]{4}"
                maxLength={4}
                value={localData.fatherBirthYear || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLocalChange({ fatherBirthYear: val });
                }}
                onBlur={handleBlur}
                placeholder="Ví dụ: 1985"
                className="input-spiritual"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <User size={14} className="text-gold" /> Họ tên Mẹ
              </label>
              <input
                type="text"
                required
                value={localData.motherName || ''}
                onChange={(e) => handleLocalChange({ motherName: sanitizeInput(e.target.value) })}
                onBlur={handleBlur}
                placeholder="Ví dụ: Trần Thị Bình"
                className="input-spiritual"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <Calendar size={14} className="text-gold" /> Năm sinh Mẹ
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                pattern="[0-9]{4}"
                maxLength={4}
                value={localData.motherBirthYear || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLocalChange({ motherBirthYear: val });
                }}
                onBlur={handleBlur}
                placeholder="Ví dụ: 1988"
                className="input-spiritual"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <Baby size={14} className="text-gold" /> Tên con dự định (Nếu đã có)
              </label>
              <input
                type="text"
                value={localData.babyName || ''}
                onChange={(e) => handleLocalChange({ babyName: sanitizeInput(e.target.value) })}
                onBlur={handleBlur}
                placeholder="Để trống nếu bạn muốn Thiên Mệnh Ký gợi ý tên mới"
                className="input-spiritual"
              />
              <p className="text-[9px] text-white/20 italic font-serif tracking-wide">* Nếu bạn đã chọn được tên, Thiên Mệnh Ký sẽ luận giải xem tên này có hợp với cha mẹ không.</p>
            </div>

            <div className="md:col-span-2 space-y-3 pt-3 border-t border-white/5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <ShieldCheck size={14} className="text-gold" /> Tùy chọn truyền thừa gia tộc
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3">
                {[
                  { id: 'traditional', label: 'Giữ Truyền Thống', desc: 'Giữ 2 tên đệm theo bố' },
                  { id: 'semi_traditional', label: 'Bán Truyền Thống', desc: 'Giữ 1 tên đệm theo bố' },
                  { id: 'destiny_optimized', label: 'Tối Ưu Mệnh', desc: 'Thay đổi toàn bộ đệm' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleLocalChange({ heritageMode: mode.id as HeritageMode })}
                    className={`flex flex-col items-center p-2 md:p-3 rounded-xl border transition-all duration-500 hover:scale-[1.02] ${
                      localData.heritageMode === mode.id
                        ? 'bg-accent/20 text-accent border-accent/40 shadow-xl'
                        : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="font-bold text-xs mb-0.5">{mode.label}</div>
                    <div className="text-[9px] opacity-60 text-center">{mode.desc}</div>
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-white/30 italic font-serif text-center">
                * Hệ thống sẽ phân tích Ngũ Hành, Ngũ Cách và Khí Tổ Tiên để đưa ra mức độ trợ mệnh % và rủi ro xung mệnh %.
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <Baby size={14} className="text-gold" /> Giới Tính Con
              </label>
              <div className="flex gap-2">
                {(['Nam', 'Nữ', 'Cả hai'] as BabyGender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleLocalChange({ babyGender: g })}
                    className={`flex-1 py-2 md:py-3 rounded-xl border font-bold transition-all duration-500 hover:scale-[1.02] ${
                      localData.babyGender === g
                        ? 'bg-accent/20 text-accent border-accent/40 shadow-xl shadow-accent/10'
                        : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {g === 'Nam' ? 'Con Trai' : g === 'Nữ' ? 'Con Gái' : 'Cả Trai & Gái'}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-white/5">
              <span className="section-subtitle">Thời Điểm & Nơi Sinh</span>
              <h3 className="text-base md:text-lg font-display font-bold text-white mb-2">Dự Kiến Chào Đời</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                    <Calendar size={14} className="text-gold" /> Tháng/Năm Sinh Dự Kiến
                  </label>
                  <input
                    type="month"
                    required
                    min={`${new Date().getFullYear() - 1}-01`}
                    max={`${new Date().getFullYear() + 2}-12`}
                    value={localData.birthDate || ''}
                    onChange={(e) => handleLocalChange({ birthDate: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual"
                  />
                  <p className="text-[9px] text-white/20 italic font-serif tracking-wide">* Năm sinh bắt buộc 4 chữ số (Ví dụ: 2024)</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                    <Clock size={14} className="text-gold" /> Giờ Sinh (Tùy chọn)
                  </label>
                  <input
                    type="time"
                    value={localData.birthTime || ''}
                    onChange={(e) => handleLocalChange({ birthTime: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                      <MapPin size={14} className="text-gold" /> Nơi Sinh Dự Kiến
                    </label>
                    <button 
                      type="button"
                      onClick={cycleEra}
                      className="flex items-center gap-1 text-[9px] font-bold text-gold/60 hover:text-gold transition-colors uppercase tracking-widest"
                    >
                      <RefreshCw size={8} /> {eraLabels[adminEra]}
                    </button>
                  </div>
                  <select
                    required
                    value={localData.birthPlace || ''}
                    onChange={(e) => handleLocalChange({ birthPlace: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual appearance-none"
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
            </div>
          </>
        ) : (
          <>
            <div className={`${isNameOnly ? 'md:col-span-2 2xl:col-span-3' : ''} space-y-2`}>
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <User size={14} className="text-gold" /> Họ và Tên
              </label>
              <input
                type="text"
                required
                value={localData.fullName || ''}
                onChange={(e) => handleLocalChange({ fullName: sanitizeInput(e.target.value) })}
                onBlur={handleBlur}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="input-spiritual"
              />
            </div>

            {isNameOnly && (
              <div className="md:col-span-2 2xl:col-span-3 pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] 2xl:text-[10px] font-bold text-gold/40 uppercase tracking-[0.2em] whitespace-nowrap">Thông Tin Bổ Trợ (Để Luận Giải Chính Xác Hơn)</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <User size={14} className="text-gold" /> Giới Tính
              </label>
              <div className="flex gap-2">
                {(['Nam', 'Nữ'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleLocalChange({ gender: g })}
                    className={`flex-1 py-2 md:py-3 rounded-xl border font-bold transition-all duration-500 hover:scale-[1.02] ${
                      localData.gender === g
                        ? 'bg-accent/20 text-accent border-accent/40 shadow-xl shadow-accent/10'
                        : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                <Calendar size={14} className="text-gold" /> Ngày Sinh (Dương Lịch)
              </label>
              <input
                type="date"
                required={!isNameOnly || localData.readingType === 'numerology'}
                min="1900-01-01"
                max={new Date().toISOString().split('T')[0]}
                value={localData.birthDate || ''}
                onChange={(e) => handleLocalChange({ birthDate: e.target.value })}
                onBlur={handleBlur}
                className="input-spiritual"
              />
              <p className="text-[9px] text-white/20 italic font-serif tracking-wide">* Năm sinh bắt buộc 4 chữ số (Ví dụ: 1990)</p>
            </div>

            {!isNameOnly && (
              <>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                    <Clock size={14} className="text-gold" /> Giờ Sinh
                  </label>
                  <input
                    type="time"
                    required={!isNameOnly}
                    value={localData.birthTime || ''}
                    onChange={(e) => handleLocalChange({ birthTime: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                      <MapPin size={14} className="text-gold" /> Nơi Sinh
                    </label>
                    <button 
                      type="button"
                      onClick={cycleEra}
                      className="flex items-center gap-1 text-[9px] font-bold text-gold/60 hover:text-gold transition-colors uppercase tracking-widest"
                    >
                      <RefreshCw size={8} /> {eraLabels[adminEra]}
                    </button>
                  </div>
                  <select
                    required={!isNameOnly}
                    value={localData.birthPlace || ''}
                    onChange={(e) => handleLocalChange({ birthPlace: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual appearance-none"
                  >
                    <option value="" disabled className="bg-paper">Chọn tỉnh thành</option>
                    {getFilteredProvinces().map(p => (
                      <option key={p.id} value={p.id} className="bg-paper">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                      <MapPin size={14} className="text-gold" /> Nơi Ở Hiện Tại
                    </label>
                    <button 
                      type="button"
                      onClick={cycleEra}
                      className="flex items-center gap-1 text-[9px] font-bold text-gold/60 hover:text-gold transition-colors uppercase tracking-widest"
                    >
                      <RefreshCw size={8} /> {eraLabels[adminEra]}
                    </button>
                  </div>
                  <select
                    required={!isNameOnly}
                    value={localData.currentPlace || ''}
                    onChange={(e) => handleLocalChange({ currentPlace: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual appearance-none"
                  >
                    <option value="" disabled className="bg-paper">Chọn tỉnh thành</option>
                    {getFilteredProvinces().map(p => (
                      <option key={p.id} value={p.id} className="bg-paper">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                    <Home size={14} className="text-gold" /> Trạng thái cư trú
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'temporary', label: 'Tạm trú', desc: 'Xa quê làm việc' },
                      { id: 'permanent', label: 'Định cư', desc: 'Ở hẳn' },
                      { id: 'undetermined', label: 'Chưa xác định', desc: 'Mặc định' }
                    ].map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => handleLocalChange({ residenceStatus: status.id as ResidenceStatus })}
                        className={`flex flex-col items-center p-2 rounded-xl border transition-all duration-500 hover:scale-[1.02] ${
                          localData.residenceStatus === status.id
                            ? 'bg-accent/20 text-accent border-accent/40 shadow-xl'
                            : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="font-bold text-[10px] mb-0.5">{status.label}</div>
                        <div className="text-[8px] opacity-60 text-center">{status.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(localData.readingType === 'monthly' || localData.readingType === 'daily' || localData.readingType === 'yearly' || localData.readingType === 'yearly_horoscope') && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                  <CalendarDays size={14} className="text-gold" /> {localData.readingType === 'monthly' ? 'Tháng Muốn Xem' : localData.readingType === 'daily' ? 'Ngày Muốn Xem' : 'Năm Muốn Xem'}
                </label>
                {(localData.readingType === 'yearly' || localData.readingType === 'yearly_horoscope') ? (
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    required
                    value={localData.targetDate || new Date().getFullYear().toString()}
                    onChange={(e) => handleLocalChange({ targetDate: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual"
                  />
                ) : (
                  <input
                    type={localData.readingType === 'monthly' ? 'month' : 'date'}
                    required
                    min="1900-01-01"
                    max="2100-12-31"
                    value={localData.targetDate || ''}
                    onChange={(e) => handleLocalChange({ targetDate: e.target.value })}
                    onBlur={handleBlur}
                    className="input-spiritual"
                  />
                )}
              </div>
            )}
            {(localData.readingType === 'full' || localData.readingType === 'tuvi' || localData.readingType === 'yearly_horoscope') && (
              <div className="md:col-span-2 2xl:col-span-3 pt-4 border-t border-white/5 space-y-4">
                <div className="space-y-1">
                  <span className="section-subtitle">Tình Trạng Gia Đình</span>
                  <h3 className="text-base md:text-lg font-display font-bold text-white">Hiện Trạng Nhân Thân</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {/* Marital Status */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                      <Heart size={14} className="text-gold" /> Tình trạng hôn nhân
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { id: 'single', label: 'Độc thân', icon: User },
                        { id: 'hasSpouse', label: 'Đã kết hôn', icon: Users2 },
                        { id: 'isDivorced', label: 'Đã ly hôn', icon: UserMinus },
                        { id: 'isUndetermined', label: 'Không tiết lộ', icon: HelpCircle }
                      ].map((item) => {
                        const isSingle = !localData.familyStatus?.hasSpouse && !localData.familyStatus?.isDivorced && !localData.familyStatus?.isUndetermined;
                        const isActive = item.id === 'single' ? isSingle : localData.familyStatus?.[item.id as keyof any];
                        
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              const current = localData.familyStatus || { hasSpouse: false, isDivorced: false, isUndetermined: false, hasChildren: false, numSons: 0, numDaughters: 0 };
                              if (item.id === 'single') {
                                handleLocalChange({ 
                                  familyStatus: { ...current, hasSpouse: false, isDivorced: false, isUndetermined: false } 
                                });
                              } else if (item.id === 'isUndetermined') {
                                handleLocalChange({ 
                                  familyStatus: { ...current, hasSpouse: false, isDivorced: false, isUndetermined: !current.isUndetermined } 
                                });
                              } else {
                                handleLocalChange({ 
                                  familyStatus: { 
                                    ...current, 
                                    hasSpouse: item.id === 'hasSpouse' ? !current.hasSpouse : false,
                                    isDivorced: item.id === 'isDivorced' ? !current.isDivorced : false,
                                    isUndetermined: false
                                  } 
                                });
                              }
                            }}
                            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border font-bold transition-all ${
                              isActive
                                ? 'bg-accent/20 text-accent border-accent/40 shadow-lg'
                                : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <item.icon size={12} />
                            <span className="text-[10px]">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Children Status */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                      <Baby size={14} className="text-gold" /> Tình trạng con cái
                    </label>
                    <p className="text-[9px] text-accent/60 italic font-serif mb-1">* Cung cấp hiện trạng giúp AI đối soát và tăng độ chính xác của lời giải.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
                      {[
                        { id: 'hasChildrenDetailed', label: 'Đã có con (Trai/Gái)' },
                        { id: 'hasChildrenTotal', label: 'Đã có con (Tổng số)' },
                        { id: 'noChildren', label: 'Chưa có con' },
                        { id: 'undetermined', label: 'Không tiết lộ' }
                      ].map((item) => {
                        const currentStatus = localData.familyStatus?.childrenStatus || 
                          (localData.familyStatus?.hasChildren ? 'hasChildrenDetailed' : 'noChildren');
                        const isActive = currentStatus === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              const current = localData.familyStatus || { hasSpouse: false, isDivorced: false, hasChildren: false, numSons: 0, numDaughters: 0 };
                              const isHasChildren = item.id === 'hasChildrenDetailed' || item.id === 'hasChildrenTotal';
                              const derivedTotal = (current.numSons || 0) + (current.numDaughters || 0);
                              
                              handleLocalChange({ 
                                familyStatus: { 
                                  ...current, 
                                  hasChildren: isHasChildren,
                                  childrenStatus: item.id as any,
                                  useTotalCount: item.id === 'hasChildrenTotal',
                                  numSons: item.id === 'hasChildrenDetailed' ? current.numSons : 0,
                                  numDaughters: item.id === 'hasChildrenDetailed' ? current.numDaughters : 0,
                                  totalChildren: item.id === 'hasChildrenTotal' ? (current.totalChildren || derivedTotal || 0) : 0
                                } 
                              });
                            }}
                            className={`flex items-center justify-center p-2 rounded-xl border font-bold transition-all ${
                              isActive
                                ? 'bg-accent/20 text-accent border-accent/40 shadow-lg'
                                : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <span className="text-[10px]">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Number of Children */}
                  {(localData.familyStatus?.childrenStatus === 'hasChildrenDetailed' || localData.familyStatus?.childrenStatus === 'hasChildrenTotal') && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                        <Users size={14} className="text-gold" /> Số lượng con
                      </label>

                      {localData.familyStatus?.childrenStatus === 'hasChildrenTotal' ? (
                        <div className="flex items-center justify-center gap-4 p-2 bg-white/[0.02] rounded-xl border border-white/5">
                          <div className="text-[10px] text-white/40 uppercase">Tổng số con</div>
                          <div className="flex items-center gap-3">
                            <button 
                              type="button"
                              onClick={() => {
                                const current = localData.familyStatus!;
                                handleLocalChange({ familyStatus: { ...current, totalChildren: Math.max(0, (current.totalChildren || 0) - 1) } });
                              }}
                              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20"
                            >-</button>
                            <div className="w-6 text-center font-bold text-lg text-gold">{localData.familyStatus.totalChildren || 0}</div>
                            <button 
                              type="button"
                              onClick={() => {
                                const current = localData.familyStatus!;
                                handleLocalChange({ familyStatus: { ...current, totalChildren: (current.totalChildren || 0) + 1 } });
                              }}
                              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20"
                            >+</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="text-[9px] text-white/40 uppercase text-center">Trai</div>
                            <div className="flex items-center gap-1.5">
                              <button 
                                type="button"
                                onClick={() => {
                                  const current = localData.familyStatus!;
                                  handleLocalChange({ familyStatus: { ...current, numSons: Math.max(0, current.numSons - 1) } });
                                }}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20"
                              >-</button>
                              <div className="flex-1 text-center font-bold text-gold text-sm">{localData.familyStatus.numSons}</div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const current = localData.familyStatus!;
                                  handleLocalChange({ familyStatus: { ...current, numSons: current.numSons + 1 } });
                                }}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20"
                              >+</button>
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-[9px] text-white/40 uppercase text-center">Gái</div>
                            <div className="flex items-center gap-1.5">
                              <button 
                                type="button"
                                onClick={() => {
                                  const current = localData.familyStatus!;
                                  handleLocalChange({ familyStatus: { ...current, numDaughters: Math.max(0, current.numDaughters - 1) } });
                                }}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20"
                              >-</button>
                              <div className="flex-1 text-center font-bold text-gold text-sm">{localData.familyStatus.numDaughters}</div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const current = localData.familyStatus!;
                                  handleLocalChange({ familyStatus: { ...current, numDaughters: current.numDaughters + 1 } });
                                }}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20"
                              >+</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
  </div>
</div>

{/* Reading Mode Selection */}
{localData.readingType !== 'divination' && (
  <div className="pt-4 border-t border-white/5 space-y-3">
  <div className="text-center space-y-0.5">
    <span className="section-subtitle">Chế Độ Luận Giải</span>
    <h3 className="text-base md:text-lg font-display font-bold text-white">Chọn Mức Độ Thâm Nhập</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-w-2xl mx-auto">
    <button
      type="button"
      onClick={() => handleLocalChange({ readingMode: 'basic' })}
      className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group ${
        (localData.readingMode || 'basic') === 'basic'
          ? 'bg-white/[0.05] text-white border-white/20 shadow-xl'
          : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Zap size={16} className={(localData.readingMode || 'basic') === 'basic' ? 'text-gold' : 'text-white/20'} />
        <span className="font-bold uppercase tracking-widest text-[10px]">Cơ Bản (Flash)</span>
      </div>
      <p className="text-[8px] text-center leading-tight opacity-60">
        Luận giải nhanh, súc tích (1-2 phút). Tập trung vào các điểm then chốt nhất của bản mệnh.
      </p>
      {(localData.readingMode || 'basic') === 'basic' && (
        <motion.div layoutId="mode-glow" className="absolute inset-0 bg-gold/5 -z-10" />
      )}
    </button>

    <button
      type="button"
      onClick={() => handleLocalChange({ readingMode: 'full' })}
      className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group ${
        localData.readingMode === 'full'
          ? 'bg-accent/10 text-accent border-accent/30 shadow-2xl shadow-accent/10'
          : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className={localData.readingMode === 'full' ? 'text-accent' : 'text-white/20'} />
        <span className="font-bold uppercase tracking-widest text-[10px]">Chuyên Sâu (Pro)</span>
      </div>
      <p className="text-[8px] text-center leading-tight opacity-60">
        Phân tích đa chiều, cực kỳ chi tiết (5-10 phút). Thấu thị toàn bộ 14 cung và các đại vận.
      </p>
      {localData.readingMode === 'full' && (
        <motion.div layoutId="mode-glow" className="absolute inset-0 bg-accent/5 -z-10" />
      )}
    </button>
    </div>
  </div>
)}

<div className="pt-2 space-y-2">
    {!canProceed() && (
      <div className="flex items-center justify-center gap-1.5 text-accent/60 text-[9px] font-bold uppercase tracking-widest animate-pulse">
        <AlertCircle size={12} />
        Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)
      </div>
    )}
    {isPalmOnly && !localData.birthDate && (
      <div className="flex items-center justify-center gap-1.5 text-gold/40 text-[9px] font-bold uppercase tracking-widest">
        <Sparkles size={12} />
        Nhập thêm Ngày giờ sinh & Nơi ở để kích hoạt "Đối Chiếu Đa Phương Pháp"
      </div>
    )}
    <button
      type="submit"
      disabled={!canProceed()}
      className="btn-spiritual w-full text-lg uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-[1.02] active:scale-[0.98] transition-all"
    >
      Tiếp Theo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>�� chi tiết (5-10 phút). Thấu thị toàn bộ 14 cung và các đại vận.
  </div>
    </form>
  );
});
