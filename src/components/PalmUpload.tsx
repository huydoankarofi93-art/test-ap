import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PalmImages, UserData } from '../types';
import { Camera, Upload, CheckCircle2, AlertCircle, X, Fingerprint, Sparkles, Loader2 } from 'lucide-react';
import { InteractivePalmMap } from './InteractivePalmMap';
import { detectPalm, extractPalmFeatures } from '../services/gemini';

interface Props {
  userData: UserData;
  images: PalmImages;
  onChange: (images: PalmImages) => void;
  onUserDataChange: (data: UserData) => void;
  onNext: (images: PalmImages, skipValidation?: boolean) => void;
  onBack: () => void;
}

export const PalmUpload = React.memo(({ userData, images, onChange, onUserDataChange, onNext, onBack }: Props) => {
  const gender = userData.gender;
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);
  const [dragOverType, setDragOverType] = React.useState<'primary' | 'secondary' | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [showBypass, setShowBypass] = React.useState(false);
  const [skipValidation, setSkipValidation] = React.useState(false);
  const [showAssessment, setShowAssessment] = React.useState(false);

  const zoomOptions = [
    'Sinh đạo (Life Line)',
    'Trí đạo (Head Line)',
    'Tâm đạo (Heart Line)',
    'Vận mệnh (Fate Line)',
    'Thái dương (Sun Line)',
    'Hôn nhân (Marriage Line)',
    'Gò Mộc Tinh',
    'Gò Thổ Tinh',
    'Gò Thái Dương',
    'Gò Thủy Tinh',
    'Gò Kim Tinh',
    'Gò Thái Âm',
    'Ngấn cổ tay (Wrist Lines)',
    'Khác (Other)'
  ];

  const processFiles = async (files: FileList | File[]): Promise<string[]> => {
    setIsProcessing(true);
    try {
      const fileList = Array.from(files).filter(file => file.type.startsWith('image/'));
      const results = await Promise.all(
        fileList.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      return results;
    } catch (error) {
      console.error("Error processing files:", error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'secondary') => {
    const files = e.target.files;
    if (!files) return;
    
    const results = await processFiles(files);
    if (results.length === 0) return;

    const newImages = results.map(data => ({ data }));
    onChange({
      ...images,
      [type]: [...images[type], ...newImages],
    });
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  const updateLabel = (type: 'primary' | 'secondary', index: number, label: string) => {
    const newImages = [...images[type]];
    newImages[index] = { ...newImages[index], label };
    onChange({
      ...images,
      [type]: newImages
    });
  };

  const removeImage = (type: 'primary' | 'secondary', index: number) => {
    onChange({
      ...images,
      [type]: images[type].filter((_, i) => i !== index),
    });
  };

  const clearAll = (type: 'primary' | 'secondary') => {
    onChange({ ...images, [type]: [] });
  };

  const handleDrop = async (e: React.DragEvent, type: 'primary' | 'secondary') => {
    e.preventDefault();
    setDragOverType(null);
    const files = e.dataTransfer.files;
    if (!files) return;

    const results = await processFiles(files);
    if (results.length === 0) return;

    const newImages = results.map(data => ({ data }));
    onChange({
      ...images,
      [type]: [...images[type], ...newImages],
    });
  };

  const handleAssessmentChange = (field: string, value: string) => {
    onUserDataChange({
      ...userData,
      palmAssessment: {
        ...(userData.palmAssessment || {}),
        [field]: value
      }
    });
  };

  const handleAutoDetect = async () => {
    if ((images?.primary?.length || 0) === 0 && (images?.secondary?.length || 0) === 0) return;
    
    setIsAutoDetecting(true);
    setValidationError(null);
    
    try {
      const features = await extractPalmFeatures(images);
      if (!features) throw new Error("Không thể nhận diện đặc điểm.");

      const newImages = {
        primary: [...images.primary],
        secondary: [...images.secondary]
      };

      // Process main lines
      if (features.palm_lines) {
        features.palm_lines.forEach((line: any) => {
          if (line.image_ref) {
            const match = line.image_ref.match(/Tấm (\d+)/);
            if (match) {
              const index = parseInt(match[1]) - 1;
              const isPrimary = line.image_ref.includes('tay chính');
              const target = isPrimary ? newImages.primary : newImages.secondary;
              
              if (target[index] && !target[index].label) {
                target[index].label = line.label;
              }
            }
          }
        });
      }

      // Process features/mounts
      if (features.palm_features) {
        features.palm_features.forEach((feature: any) => {
          if (feature.image_ref) {
            const match = feature.image_ref.match(/Tấm (\d+)/);
            if (match) {
              const index = parseInt(match[1]) - 1;
              const isPrimary = feature.image_ref.includes('tay chính');
              const target = isPrimary ? newImages.primary : newImages.secondary;
              
              if (target[index] && !target[index].label) {
                target[index].label = feature.label;
              }
            }
          }
        });
      }

      onChange(newImages);

      // Process assessment
      const assessmentUpdates: any = {};
      if (features.handShape) assessmentUpdates.handShape = features.handShape;
      if (features.handColor) assessmentUpdates.handColor = features.handColor;
      if (features.wristLines) assessmentUpdates.wristLines = features.wristLines;
      if (features.thickness) assessmentUpdates.thickness = features.thickness;

      if (Object.keys(assessmentUpdates).length > 0) {
        onUserDataChange({
          ...userData,
          palmAssessment: {
            ...(userData.palmAssessment || {}),
            ...assessmentUpdates
          }
        });
      }
    } catch (error) {
      console.error("Auto-detect error:", error);
      setValidationError("Hệ thống thấu thị đang bận hoặc ảnh chưa đủ rõ để tự động nhận diện.");
    } finally {
      setIsAutoDetecting(false);
    }
  };

  const handleNext = async () => {
    if ((images?.primary?.length || 0) === 0) return;
    
    if (skipValidation) {
      onNext(images, true);
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    setShowBypass(false);
    
    try {
      // Validate the first primary image as it's the most critical
      const firstImage = images.primary[0].data;
      const result = await detectPalm(firstImage);
      
      if (result.isPalm && (!result.isClear || !result.isBright || !result.isOriented)) {
        let errorMsg = "Ảnh chưa đạt yêu cầu: ";
        if (!result.isClear) errorMsg += "Bị mờ/nhòe. ";
        if (!result.isBright) errorMsg += "Quá tối. ";
        if (!result.isOriented) {
          errorMsg += "Sai chiều. (Ảnh bị ngược chiều (các ngón tay hướng xuống dưới).). ";
        } else if (result.reason) {
          errorMsg += `(${result.reason})`;
        }
        
        setValidationError(errorMsg);
        setShowBypass(true);
        setIsValidating(false);
        return;
      }

      if (!result.isPalm) {
        setValidationError(`Hệ thống nghi ngờ ảnh này không phải bàn tay: ${result.reason}`);
        setShowBypass(true);
        setIsValidating(false);
        return;
      }
      
      // If all good, proceed
      onNext(images, false);
    } catch (error) {
      console.error("Validation error:", error);
      // Fallback: if validation fails due to API issues, we allow proceeding as requested
      setValidationError("Không thể kiểm tra ảnh lúc này. Vui lòng thử lại.");
      setShowBypass(true);
    } finally {
      setIsValidating(false);
    }
  };

  const primaryLabel = gender === 'Nam' ? 'Tay Trái (Tiền định - Gốc số)' : 'Tay Phải (Tiền định - Gốc số)';
  const secondaryLabel = gender === 'Nam' ? 'Tay Phải (Hậu vận - Thực tại)' : 'Tay Trái (Hậu vận - Thực tại)';
  const primarySubLabel = gender === 'Nam' ? 'Đại diện cho phước đức bẩm sinh, nền tảng số mệnh.' : 'Đại diện cho phước đức bẩm sinh, nền tảng số mệnh.';
  const secondarySubLabel = gender === 'Nam' ? 'Đại diện cho nỗ lực cá nhân, sự thay đổi trong thực tại.' : 'Đại diện cho nỗ lực cá nhân, sự thay đổi trong thực tại.';

  return (
    <div className="max-w-5xl 2xl:max-w-7xl mx-auto space-y-24 md:space-y-32 py-12">
      {/* 1. Primary & Secondary Palm Uploads */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 2xl:gap-24">
          {/* Primary Palm */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <label className="block font-display font-bold text-copper uppercase tracking-widest text-sm">{primaryLabel}</label>
                <p className="text-[10px] text-white/40 italic">{primarySubLabel}</p>
              </div>
              <div className="flex items-center gap-4">
                {(images?.primary?.length || 0) > 0 && (
                  <button 
                    onClick={handleAutoDetect}
                    disabled={isAutoDetecting}
                    className="flex items-center gap-2 text-[10px] font-bold text-gold hover:text-gold/80 uppercase tracking-widest transition-all bg-gold/10 px-3 py-1 rounded-full border border-gold/20 disabled:opacity-50"
                  >
                    {isAutoDetecting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Tự động nhận diện (AI)
                  </button>
                )}
                {(images?.primary?.length || 0) > 0 && (
                  <button 
                    onClick={() => clearAll('primary')}
                    className="text-[10px] font-bold text-copper/60 hover:text-copper uppercase tracking-widest transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>
            <div 
              className={`grid grid-cols-2 gap-4 p-6 rounded-[2.5rem] border-2 border-dashed transition-all min-h-[240px] relative group/dropzone ${
                dragOverType === 'primary' 
                  ? 'border-gold bg-gold/10 scale-[1.02] shadow-2xl shadow-gold/20' 
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOverType('primary'); }}
              onDragLeave={() => setDragOverType(null)}
              onDrop={(e) => handleDrop(e, 'primary')}
            >
              {dragOverType === 'primary' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gold/10 backdrop-blur-sm rounded-[2.5rem] pointer-events-none border-2 border-gold animate-in fade-in zoom-in duration-300">
                  <Upload size={48} className="text-gold animate-bounce" />
                  <span className="text-sm font-bold text-gold uppercase tracking-[0.3em] mt-4">Thả ảnh vào đây</span>
                </div>
              )}
                {images?.primary?.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border-2 border-gold/20 shadow-lg shadow-gold/5">
                    <img src={img.data} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                      <select 
                        value={img.label || ''}
                        onChange={(e) => updateLabel('primary', idx, e.target.value)}
                        className="w-full bg-black/80 text-[10px] text-gold font-bold border border-gold/30 rounded-lg px-2 py-1 outline-none focus:border-gold transition-all"
                      >
                        <option value="">Ảnh chính</option>
                        {zoomOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => removeImage('primary', idx)}
                        className="bg-red-500 text-white p-2 rounded-full shadow-xl transform hover:scale-110 transition-transform"
                        title="Xóa ảnh"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 text-[8px] font-bold text-gold uppercase tracking-widest bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-gold/20">
                      {img.label || `Ảnh #${idx + 1}`}
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => primaryInputRef.current?.click()}
                  className={`aspect-square rounded-2xl border-2 border-dashed border-gold/30 hover:border-gold flex flex-col items-center justify-center bg-white/[0.03] hover:bg-gold/5 hover:shadow-2xl group transition-all ${
                    (images?.primary?.length || 0) === 0 ? 'col-span-2' : ''
                  }`}
                >
                  {isProcessing && dragOverType === 'primary' ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                        <Upload size={32} className="text-gold/60 group-hover:text-gold" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/80">
                        {(images?.primary?.length || 0) === 0 ? 'Tải ảnh lòng bàn tay' : 'Thêm ảnh'}
                      </span>
                      <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Hỗ trợ kéo thả</span>
                    </>
                  )}
                </button>
            </div>
            <input 
              ref={primaryInputRef}
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'primary')} 
            />
          </div>

          {/* Secondary Palm */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <label className="block font-display font-bold text-white/60 uppercase tracking-widest text-sm">
                  {secondaryLabel}
                </label>
                <p className="text-[10px] text-white/40 italic">{secondarySubLabel}</p>
              </div>
              <div className="flex items-center gap-4">
                {(images?.secondary?.length || 0) > 0 && (
                  <button 
                    onClick={handleAutoDetect}
                    disabled={isAutoDetecting}
                    className="flex items-center gap-2 text-[10px] font-bold text-gold hover:text-gold/80 uppercase tracking-widest transition-all bg-gold/10 px-3 py-1 rounded-full border border-gold/20 disabled:opacity-50"
                  >
                    {isAutoDetecting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Tự động nhận diện (AI)
                  </button>
                )}
                {(images?.secondary?.length || 0) > 0 && (
                  <button 
                    onClick={() => clearAll('secondary')}
                    className="text-[10px] font-bold text-copper/60 hover:text-copper uppercase tracking-widest transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>
            <div 
              className={`grid grid-cols-2 gap-4 p-6 rounded-[2.5rem] border-2 border-dashed transition-all min-h-[240px] relative group/dropzone ${
                dragOverType === 'secondary' 
                  ? 'border-gold bg-gold/10 scale-[1.02] shadow-2xl shadow-gold/20' 
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOverType('secondary'); }}
              onDragLeave={() => setDragOverType(null)}
              onDrop={(e) => handleDrop(e, 'secondary')}
            >
              {dragOverType === 'secondary' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gold/10 backdrop-blur-sm rounded-[2.5rem] pointer-events-none border-2 border-gold animate-in fade-in zoom-in duration-300">
                  <Upload size={48} className="text-gold animate-bounce" />
                  <span className="text-sm font-bold text-gold uppercase tracking-[0.3em] mt-4">Thả ảnh vào đây</span>
                </div>
              )}
                {images?.secondary?.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border-2 border-gold/20 shadow-lg shadow-gold/5">
                    <img src={img.data} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                      <select 
                        value={img.label || ''}
                        onChange={(e) => updateLabel('secondary', idx, e.target.value)}
                        className="w-full bg-black/80 text-[10px] text-gold font-bold border border-gold/30 rounded-lg px-2 py-1 outline-none focus:border-gold transition-all"
                      >
                        <option value="">Ảnh chính</option>
                        {zoomOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => removeImage('secondary', idx)}
                        className="bg-red-500 text-white p-2 rounded-full shadow-xl transform hover:scale-110 transition-transform"
                        title="Xóa ảnh"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 text-[8px] font-bold text-gold uppercase tracking-widest bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-gold/20">
                      {img.label || `Ảnh #${idx + 1}`}
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => secondaryInputRef.current?.click()}
                  className={`aspect-square rounded-2xl border-2 border-dashed border-gold/30 hover:border-gold flex flex-col items-center justify-center bg-white/[0.03] hover:bg-gold/5 hover:shadow-2xl group transition-all ${
                    (images?.secondary?.length || 0) === 0 ? 'col-span-2' : ''
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                    <Upload size={32} className="text-gold/60 group-hover:text-gold" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/80">
                    {(images?.secondary?.length || 0) === 0 ? 'Tải ảnh tay đối chiếu' : 'Thêm ảnh'}
                  </span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Hỗ trợ kéo thả</span>
                </button>
            </div>
            <input 
              ref={secondaryInputRef}
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'secondary')} 
            />
          </div>
        </div>

        {/* Action Buttons & Skip Checkbox */}
        <div className="flex flex-col gap-8 pt-8 border-t border-white/5">
          {(images?.primary?.length || 0) > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <label className="flex items-center gap-4 cursor-pointer group bg-white/[0.02] hover:bg-white/[0.05] px-6 py-3 rounded-2xl border border-white/5 hover:border-gold/20 transition-all">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={skipValidation}
                    onChange={(e) => setSkipValidation(e.target.checked)}
                    className="peer appearance-none w-6 h-6 rounded-lg border-2 border-gold/30 bg-black/40 checked:bg-gold checked:border-gold transition-all cursor-pointer"
                  />
                  <CheckCircle2 className="absolute w-4 h-4 text-black opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/40 group-hover:text-gold/80 uppercase tracking-widest transition-colors">
                    Bỏ qua bước kiểm tra ảnh
                  </span>
                  <span className="text-[9px] text-white/20 italic">Tiết kiệm thời gian nếu ảnh đã đạt chuẩn</span>
                </div>
              </label>

              <button
                onClick={() => setShowAssessment(!showAssessment)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest ${
                  showAssessment 
                    ? 'bg-gold/20 border-gold/40 text-gold' 
                    : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
                }`}
              >
                <Sparkles size={16} />
                {showAssessment ? 'Ẩn nhận định sơ bộ' : 'Tự nhận định sơ bộ (Khuyên dùng)'}
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={onBack}
              disabled={isValidating}
              className="flex-1 py-5 md:py-6 rounded-full font-bold uppercase tracking-widest border-2 border-white/10 text-white/30 hover:border-white/20 hover:text-white/60 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Quay Lại
            </button>
            <button
              onClick={handleNext}
              disabled={(images?.primary?.length || 0) === 0 || isValidating}
              className={`flex-[2] btn-spiritual text-xl py-5 md:py-6 uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all ${
                (images?.primary?.length || 0) === 0 || isValidating ? 'opacity-50 grayscale' : ''
              }`}
            >
              {isValidating ? (
                <div className="flex items-center justify-center gap-4">
                  <Loader2 className="animate-spin" />
                  <span>Đang thấu thị ảnh...</span>
                </div>
              ) : (images?.primary?.length || 0) === 0 ? (
                'Cần ít nhất 1 ảnh tay chính'
              ) : skipValidation ? (
                'Luận Giải Ngay'
              ) : (
                'Kiểm Tra & Luận Giải'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Ancient Chinese Palmistry Assessment Section */}
      <AnimatePresence>
        {showAssessment && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-12 border-t border-white/5 space-y-16 overflow-hidden"
          >
            <div className="text-center space-y-6">
              <span className="section-subtitle">Cổ Nhân Pháp</span>
              <div className="inline-flex items-center gap-4 text-gold">
                <Sparkles size={32} />
                <h3 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-widest">Nhận định sơ bộ</h3>
              </div>
              <p className="text-sm md:text-base text-white/40 italic max-w-3xl mx-auto leading-relaxed">
                Cổ nhân xem "Khí - Hình" trước khi xem "Văn". Hãy tự đánh giá để AI thấu thị chính xác hơn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Hand Shape (Ngũ Hành) */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gold uppercase tracking-[0.3em]">1. Hình dáng bàn tay (Thủ hình)</label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { id: 'Kim', label: 'Kim', desc: 'Vuông, dày, chắc' },
                    { id: 'Mộc', label: 'Mộc', desc: 'Dài, thon, gầy' },
                    { id: 'Thủy', label: 'Thủy', desc: 'Mềm, nhiều thịt' },
                    { id: 'Hỏa', label: 'Hỏa', desc: 'Đỏ, gân nổi, nhọn' },
                    { id: 'Thổ', label: 'Thổ', desc: 'Dày, ngắn, thô' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAssessmentChange('handShape', item.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                        userData.palmAssessment?.handShape === item.id
                          ? 'bg-gold/20 border-gold/40 text-gold scale-105 shadow-xl shadow-gold/10'
                          : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[9px] mt-2 opacity-60 text-center leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hand Color (Khí sắc) */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gold uppercase tracking-[0.3em]">2. Khí sắc lòng bàn tay</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'Hồng nhuận', label: 'Hồng', desc: 'Khí huyết tốt' },
                    { id: 'Tím tái', label: 'Tím', desc: 'Huyết ứ' },
                    { id: 'Vàng đục', label: 'Vàng', desc: 'Tỳ vị yếu' },
                    { id: 'Trắng bệch', label: 'Trắng', desc: 'Thiếu khí' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAssessmentChange('handColor', item.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                        userData.palmAssessment?.handColor === item.id
                          ? 'bg-gold/20 border-gold/40 text-gold scale-105 shadow-xl shadow-gold/10'
                          : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[9px] mt-2 opacity-60 text-center leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wrist Lines (Ngấn cổ tay) */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gold uppercase tracking-[0.3em]">3. Ngấn cổ tay (Căn cơ phúc thọ)</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: '1 ngấn', label: '1 Ngấn', desc: 'Phúc trung bình' },
                    { id: '2 ngấn', label: '2 Ngấn', desc: 'Phúc khá' },
                    { id: '3 ngấn', label: '3 Ngấn', desc: 'Phúc thọ tốt' },
                    { id: 'Đứt đoạn', label: 'Đứt', desc: 'Vận lận đận' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAssessmentChange('wristLines', item.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                        userData.palmAssessment?.wristLines === item.id
                          ? 'bg-gold/20 border-gold/40 text-gold scale-105 shadow-xl shadow-gold/10'
                          : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[9px] mt-2 opacity-60 text-center leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Thickness (Độ dày mỏng) */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gold uppercase tracking-[0.3em]">4. Độ dày mỏng bàn tay</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Dày', label: 'Dày dặn', desc: 'Phúc hậu' },
                    { id: 'Vừa', label: 'Vừa phải', desc: 'Cân bằng' },
                    { id: 'Mỏng', label: 'Mỏng manh', desc: 'Vất vả' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAssessmentChange('thickness', item.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                        userData.palmAssessment?.thickness === item.id
                          ? 'bg-gold/20 border-gold/40 text-gold scale-105 shadow-xl shadow-gold/10'
                          : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[9px] mt-2 opacity-60 text-center leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Informational Header (Rules) */}
      <div className="text-center space-y-12 pt-12 border-t border-white/5">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gold/10 text-gold rounded-full text-xs font-bold uppercase tracking-[0.3em] border border-gold/20">
            {gender === 'Nam' ? 'Nam Tả (Trái)' : 'Nữ Hữu (Phải)'}
          </div>
          <div className="space-y-2">
            <span className="section-subtitle">Bản Đồ Số Phận</span>
            <h2 className="section-title">Tướng Tay Chỉ Lộ</h2>
          </div>
        </div>
        
        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 md:p-12 2xl:p-20 rounded-[3rem] 2xl:rounded-[4rem] text-sm 2xl:text-xl text-white/60 space-y-8 border border-white/5 font-serif italic max-w-4xl 2xl:max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <p className="font-bold flex items-center justify-center gap-4 text-gold not-italic uppercase tracking-[0.4em] text-xs md:text-sm 2xl:text-base">
            <AlertCircle size={20} /> Quy tắc ảnh bắt buộc
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-left list-none text-sm md:text-base 2xl:text-lg">
            <li className="flex items-center gap-4 before:content-['◈'] before:text-gold before:text-xs">Rõ toàn bộ lòng bàn tay</li>
            <li className="flex items-center gap-4 before:content-['◈'] before:text-gold before:text-xs">Rõ ngấn cổ tay (vòng cổ tay)</li>
            <li className="flex items-center gap-4 before:content-['◈'] before:text-gold before:text-xs">Không nghiêng, không bóng đổ</li>
            <li className="flex items-center gap-4 before:content-['◈'] before:text-gold before:text-xs">Không nắm tay, không filter</li>
            <li className="md:col-span-2 flex items-center gap-4 before:content-['◈'] before:text-gold before:text-xs text-accent font-medium mt-4">Bạn có thể chọn hoặc kéo thả nhiều ảnh cùng lúc</li>
          </ul>
        </div>
      </div>

      {/* 4. Palm Anatomy Guide */}
      <div className="glass-panel relative overflow-hidden">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-6 text-gold">
            <Fingerprint size={32} />
            <div>
              <span className="section-subtitle mb-1">Cẩm Nang Thấu Thị</span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Sơ đồ giải phẫu bàn tay</h3>
            </div>
          </div>
          <div className="hidden md:block text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Interactive Anatomy Guide</div>
        </div>

        <div className="card-body">
          <InteractivePalmMap 
            onAreaClick={(area) => {
              // No longer scrolling to zoom section, just a guide
            }} 
          />
        </div>
      </div>

      {validationError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 text-red-400 text-sm max-w-2xl mx-auto"
        >
          <AlertCircle className="shrink-0" />
          <div className="flex-1">
            <p>{validationError} Vui lòng chụp lại ảnh rõ nét, đủ sáng và đúng chiều.</p>
            {showBypass && (
              <button 
                onClick={() => onNext(images, true)}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/30 flex items-center gap-2"
              >
                <CheckCircle2 size={14} />
                Xác nhận chấp nhận & Tiếp tục
              </button>
            )}
          </div>
          <button onClick={() => { setValidationError(null); setShowBypass(false); }} className="ml-auto hover:text-white self-start mt-1">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
});
