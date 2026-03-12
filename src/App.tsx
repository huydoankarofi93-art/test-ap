import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserData, PalmImages, ReadingState, ChatMessage } from './types';
import { InputForm } from './components/InputForm';
import { PalmUpload } from './components/PalmUpload';
import { ReadingResult } from './components/ReadingResult';
import { DivinationForm } from './components/DivinationForm';
import { PrayerWheel } from './components/PrayerWheel';
import { SpiritualClock } from './components/SpiritualClock';
import { generateReadingStream, generateChatResponse } from './services/gemini';
import { generateTuViChart } from './services/tuvi-engine/tuviChart';
import { UserGuide } from './components/UserGuide';
import { Almanac } from './components/Almanac';
import { SacredBackground } from './components/SacredBackground';
import BackgroundParticles from './components/BackgroundParticles';
import { History } from './components/History';
import { SpiritualMediumPage } from './components/SpiritualMediumPage';
import { getHexagramFromLines, HEXAGRAMS, calculateMaiHoaFromTime } from './constants/iching';
import { PROVINCES } from './constants/provinces';
import { trimToLastSentence, ensureCompleteSentence } from './utils/text';
import { 
  Sparkles, 
  ShieldCheck,
  Loader2, 
  Plus,
  ScrollText, 
  LayoutGrid, 
  User, 
  Baby, 
  CalendarRange, 
  CalendarDays, 
  Fingerprint, 
  Compass, 
  ArrowRight,
  Home,
  RefreshCw,
  ChevronLeft,
  History as HistoryIcon,
  BookOpen,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false);
  const [isPrayerWheelOpen, setIsPrayerWheelOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMediumshipOpen, setIsMediumshipOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('performance_mode') === 'low';
    }
    return false;
  });
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [state, setState] = useState<ReadingState>(() => {
    const defaultState: ReadingState = {
      step: 'landing',
      userData: {
        fullName: '',
        fatherName: '',
        motherName: '',
        fatherBirthYear: '',
        motherBirthYear: '',
        babyName: '',
        babyGender: 'Nam',
        birthDate: '',
        birthTime: '',
        gender: 'Nam',
        birthPlace: '',
        currentPlace: '',
        residenceStatus: 'undetermined',
        hasConfirmedAccuracy: false,
        readingType: 'full',
        readingMode: 'basic',
        selectedMethods: ['tuvi'],
        divinationFocus: 'general',
        divinationUrgency: 'medium',
        divinationMethod: 'auto',
        familyStatus: {
          hasSpouse: false,
          isDivorced: false,
          isUndetermined: true,
          hasChildren: false,
          childrenStatus: 'noChildren',
          numSons: 0,
          numDaughters: 0,
          totalChildren: 0,
          useTotalCount: false
        }
      },
      palmImages: {
        primary: [],
        secondary: [],
      },
      result: null,
      error: null,
      sessionTotalTokens: 0,
      chatState: {
        messages: [],
        isThinking: false
      }
    };

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_memory');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...defaultState, userData: { ...defaultState.userData, ...parsed } };
        } catch (e) {
          console.error("Failed to parse user memory", e);
        }
      }
    }
    return defaultState;
  });

  // Persist user memory
  useEffect(() => {
    if (state.userData.fullName || state.userData.birthDate) {
      localStorage.setItem('user_memory', JSON.stringify(state.userData));
    }
  }, [state.userData]);

  const handleStartOfflineAnalysis = (userData: UserData) => {
    if (userData.readingType === 'divination' && userData.divinationHexagram) {
      const hex = HEXAGRAMS[userData.divinationHexagram];
      const analysis = hex.analysis;
      
      let content = `
# LUẬN GIẢI THIÊN CƠ (TRA CỨU NHANH)

Chào con, Ta là Thiên Sư. Con đã rút được thẻ số **${hex.number}**: **${hex.name}**.

**Ý nghĩa:** ${hex.meaning}

**Lời dạy của Cổ nhân:**
> "${hex.description}"

${hex.tuongTinh ? `**Tướng Tinh:** ${hex.tuongTinh.char} (${hex.tuongTinh.animal})` : ''}

---

## CHI TIẾT LUẬN GIẢI (OFFLINE)

`;

      if (analysis) {
        content += `
### 💼 Sự Nghiệp & Công Danh
${analysis.career}

### 🏥 Sức Khỏe
${analysis.health}

### 🏠 Gia Đình & Con Cái
**Gia đình:** ${analysis.family}
**Con cái:** ${analysis.children}

### 💰 Tiền Bạc & Tài Lộc
${analysis.wealth}

### 🌟 Công Danh
${analysis.fame}

---

### ✅ Những Việc Nên Làm
${analysis.todo}

### ❌ Những Việc Cần Tránh
${analysis.avoid}
`;
      }

      content += `
---
*Lưu ý: Đây là bộ giải mã chung từ thư viện Kinh Dịch. Để có cái nhìn sâu sắc và cá nhân hóa hơn dựa trên bản mệnh của con, hãy chọn "Luận Chuyên Sâu".*
      `;
      
      setState(prev => ({
        ...prev,
        result: content,
        step: 'result',
        isGenerating: false,
        error: null,
        userData
      }));
    }
  };

  const handleStartAnalysis = useCallback(async (userData?: UserData, palmImages?: PalmImages, skipValidation = false) => {
    if (state.isGenerating) return;
    
    const finalUserData = { 
      ...(userData || state.userData),
      readingMode: (userData || state.userData).readingMode || ((userData || state.userData).readingType === 'full' ? 'basic' : 'full')
    };
    const finalPalmImages = palmImages || state.palmImages;

    // Reliability Check: Validate inputs strictly
    if (!skipValidation) {
      if (!finalUserData.fullName && finalUserData.readingType !== 'palm') {
        setState(prev => ({ ...prev, error: 'Vui lòng nhập đầy đủ Họ Tên để thỉnh ý Thiên Cơ.' }));
        return;
      }
    }

    // Divination Spam Protection / Caching
    if (finalUserData.readingType === 'divination' && finalUserData.divinationQuestion) {
      const cacheKey = `divination_cache_${btoa(unescape(encodeURIComponent(finalUserData.divinationQuestion.trim().toLowerCase())))}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { timestamp, result } = JSON.parse(cached);
          const twentyFourHours = 24 * 60 * 60 * 1000;
          if (Date.now() - timestamp < twentyFourHours) {
            setState(prev => ({ 
              ...prev, 
              result: result,
              step: 'result',
              error: null
            }));
            return;
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }
    }

    setState(prev => ({ 
      ...prev, 
      userData: finalUserData,
      palmImages: finalPalmImages,
      step: 'analyzing', 
      isGenerating: true,
      error: null, 
      result: '',
      analysisStatus: 'Đang khởi tạo kết nối tâm linh...'
    }));

    // Generate Tu Vi Chart for full reading or dedicated Tu Vi reading
    let tuviChart;
    if ((finalUserData.readingType === 'full' || finalUserData.readingType === 'tuvi') && finalUserData.birthDate && finalUserData.birthTime) {
      const birthDate = new Date(finalUserData.birthDate);
      const hour = parseInt(finalUserData.birthTime.split(':')[0], 10);
      
      const province = PROVINCES.find(p => p.id === finalUserData.birthPlace);
      const isNorth = province ? province.isNorth : false;
                      
      try {
        tuviChart = generateTuViChart(
          finalUserData.fullName || 'Ẩn danh',
          birthDate.getFullYear(),
          birthDate.getMonth() + 1,
          birthDate.getDate(),
          hour,
          finalUserData.gender,
          isNorth
        );
        // Update state with chart once generated
        setState(prev => ({ ...prev, tuviChart }));
      } catch (e) {
        console.error("Tu Vi Chart Generation Error:", e);
        // We continue but without the chart if it fails
      }
    }

    // Status update sequence for reliability feel
    const statuses = [
      'Đang khởi tạo kết nối tâm linh...',
      'Đang đối soát dữ liệu Bát Tự...',
      'Đang lập lá số Tử Vi Đẩu Số...',
      'Đang thấu thị Ngũ Hành bản mệnh...',
      'Đang chiêm nghiệm Thiên Cơ...',
      'Đang kiến giải vận trình...',
      'Đang hoàn thiện bài luận giải...'
    ];

    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setState(prev => ({ ...prev, analysisStatus: statuses[statusIdx] }));
        statusIdx++;
      }
    }, 1500);

    try {
      // Get history for Karma Pattern analysis
      const history = JSON.parse(localStorage.getItem('reading_history') || '[]');
      const historyContext = history.length > 0 
        ? `\n\nLịch sử các lần luận giải trước (để phân tích Karma Pattern):\n${history.map((h: any, i: number) => `Lần ${i+1}: ${h.summary}`).join('\n')}`
        : '';

      let fullText = '';
      let lastUpdate = Date.now();
      const UPDATE_INTERVAL = 150; // Update UI every 150ms to prevent re-render loops

      const stream = generateReadingStream(finalUserData, finalPalmImages, 1, historyContext, tuviChart, "", skipValidation);
      
      for await (const chunk of stream) {
        if (chunk === "__CLEAR_STREAM__") {
          fullText = '';
          setState(prev => ({ ...prev, result: '' }));
          continue;
        }
        if (chunk.startsWith("__TOKEN_USAGE__:")) {
          try {
            const jsonStr = chunk.substring("__TOKEN_USAGE__:".length);
            const usage = JSON.parse(jsonStr);
            setState(prev => ({ 
              ...prev, 
              tokenUsage: {
                promptTokens: usage.promptTokenCount,
                candidatesTokens: usage.candidatesTokenCount,
                totalTokens: usage.totalTokenCount
              },
              sessionTotalTokens: (prev.sessionTotalTokens || 0) + usage.totalTokenCount
            }));
          } catch (e) {
            console.error("Failed to parse token usage", e);
          }
          continue;
        }
        if (chunk) {
          fullText += chunk;
          
          // Throttle updates
          const now = Date.now();
          if (now - lastUpdate > UPDATE_INTERVAL) {
            setState(prev => ({ 
              ...prev, 
              result: fullText,
              step: prev.step === 'analyzing' ? 'result' : prev.step 
            }));
            lastUpdate = now;
          }
        }
      }

      // Final update to ensure everything is rendered
      clearInterval(statusInterval);
      const finalResult = ensureCompleteSentence(fullText);
      setState(prev => ({ 
        ...prev, 
        result: finalResult,
        isGenerating: false,
        step: 'result',
        analysisStatus: undefined
      }));

      // Save to history (limit to last 3)
      if (fullText && finalUserData.readingType === 'full') {
        const newHistory = [{
          date: new Date().toISOString(),
          summary: trimToLastSentence(fullText, 500)
        }, ...history].slice(0, 3);
        localStorage.setItem('reading_history', JSON.stringify(newHistory));
      }

      // Save to backend
      if (fullText) {
        try {
          await fetch('/api/readings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: crypto.randomUUID(),
              fullName: finalUserData.fullName || 'Ẩn danh',
              readingType: finalUserData.readingType,
              content: fullText,
              tuviChart: tuviChart
            })
          });
        } catch (e) {
          console.error("Failed to save to backend", e);
        }
      }

      // Cache successful divination result
      if (finalUserData.readingType === 'divination' && finalUserData.divinationQuestion && fullText) {
        const cacheKey = `divination_cache_${btoa(unescape(encodeURIComponent(finalUserData.divinationQuestion.trim().toLowerCase())))}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          result: fullText
        }));
      }
    } catch (err: any) {
      console.error(err);
      clearInterval(statusInterval);
      setState(prev => ({ 
        ...prev, 
        step: 'input', 
        error: err.message || 'Có lỗi xảy ra trong quá trình luận giải. Vui lòng thử lại sau.',
        isGenerating: false,
        analysisStatus: undefined
      }));
    }
  }, [state.isGenerating, state.userData, state.palmImages]);

  const handleUserDataChange = useCallback((userData: UserData) => {
    setState(prev => ({ ...prev, userData }));
  }, []);

  const handlePalmImagesChange = useCallback((palmImages: PalmImages) => {
    setState(prev => ({ ...prev, palmImages }));
  }, []);

  const handleClearChat = () => {
    setState(prev => ({
      ...prev,
      chatState: {
        ...prev.chatState,
        messages: []
      }
    }));
  };

  const handleSendMessage = async (message: string) => {
    if (!state.result) return;

    const userMessage: ChatMessage = { 
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString()
    };
    
    // 1. Validate input (Pre-check to avoid unnecessary AI calls)
    const trimmed = message.trim();
    const isRepetitive = /(.)\1{5,}/.test(trimmed); // e.g. "aaaaaa"
    const words = trimmed.split(/\s+/);
    const isNonsense = words.length === 1 && trimmed.length > 15 && !trimmed.includes(' ');
    const isTooShort = trimmed.length < 3;
    
    // Check for common "junk" patterns
    const junkPatterns = [/^[asdfghjkl]+$/i, /^[1234567890]+$/];
    const isJunk = junkPatterns.some(p => p.test(trimmed));

    if (isTooShort || isRepetitive || isNonsense || isJunk) {
      const fallbackMessage: ChatMessage = {
        role: 'model',
        content: `Thầy chưa rõ ý con muốn hỏi gì. Con vui lòng viết rõ ràng hơn để Thầy có thể kiến giải chính xác nhé.
        
**Con có thể hỏi về:**
• Công việc của tôi năm nay thế nào?
• Bao giờ tôi đổi việc?
• Tình duyên sắp tới ra sao?
• Sức khỏe và tài lộc có gì biến động?`,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        chatState: {
          ...prev.chatState,
          messages: [...prev.chatState.messages, userMessage, fallbackMessage],
          isThinking: false
        }
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      chatState: {
        ...prev.chatState,
        messages: [...prev.chatState.messages, userMessage],
        isThinking: true
      }
    }));

    try {
      const responseStream = generateChatResponse(
        state.userData,
        state.palmImages,
        state.result,
        [...state.chatState.messages, userMessage],
        state.tuviChart
      );

      let fullResponse = '';
      
      // Add a placeholder message for the AI response
      const aiPlaceholder: ChatMessage = {
        role: 'model',
        content: '',
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        chatState: {
          ...prev.chatState,
          messages: [...prev.chatState.messages, aiPlaceholder]
        }
      }));

      for await (const chunk of responseStream) {
        fullResponse += chunk;
        setState(prev => {
          const newMessages = [...prev.chatState.messages];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: fullResponse
            };
          }
          return {
            ...prev,
            chatState: {
              ...prev.chatState,
              messages: newMessages
            }
          };
        });
      }

      const finalResponse = ensureCompleteSentence(fullResponse);
      setState(prev => {
        const newMessages = [...prev.chatState.messages];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: finalResponse
          };
        }
        return {
          ...prev,
          chatState: {
            ...prev.chatState,
            messages: newMessages,
            isThinking: false
          }
        };
      });
    } catch (error) {
      console.error('Chat error:', error);
      setState(prev => ({
        ...prev,
        chatState: {
          ...prev.chatState,
          isThinking: false
        }
      }));
    }
  };

  const confirmExit = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowExitConfirm(false);
  };

  const cancelExit = () => {
    setPendingAction(null);
    setShowExitConfirm(false);
  };

  const handleReset = () => {
    const resetAction = () => {
      // Clear all local storage to ensure no data is retained
      localStorage.clear();
      
      // Reset state to absolute initial values
      setState({
        step: 'landing',
        userData: {
          fullName: '',
          fatherName: '',
          motherName: '',
          fatherBirthYear: '',
          motherBirthYear: '',
          babyName: '',
          babyGender: 'Nam',
          birthDate: '',
          birthTime: '',
          gender: 'Nam',
          birthPlace: '',
          currentPlace: '',
          residenceStatus: 'undetermined',
          hasConfirmedAccuracy: false,
          readingType: 'full',
          readingMode: 'basic',
          selectedMethods: ['tuvi'],
          divinationFocus: 'general',
          divinationUrgency: 'medium',
          divinationMethod: 'auto',
          familyStatus: {
            hasSpouse: false,
            isDivorced: false,
            isUndetermined: true,
            hasChildren: false,
            childrenStatus: 'noChildren',
            numSons: 0,
            numDaughters: 0,
            totalChildren: 0,
            useTotalCount: false
          }
        },
        palmImages: {
          primary: [],
          secondary: [],
        },
        result: null,
        error: null,
        sessionTotalTokens: 0,
        chatState: {
          messages: [],
          isThinking: false
        }
      });

      // Optional: Force a page reload to ensure a completely fresh environment
      window.location.reload();
    };

    if (state.step === 'result' || state.step === 'input' || state.step === 'palm') {
      setPendingAction(() => resetAction);
      setShowExitConfirm(true);
    } else {
      resetAction();
    }
  };

  const handleNextFromInput = useCallback((latestData: UserData) => {
    const isFullReading = latestData.readingType === 'full';
    const selectedMethods = latestData.selectedMethods || ['tuvi'];
    const needsPalm = isFullReading 
      ? selectedMethods.includes('palm') 
      : ['palm', 'villa', 'seven_killings'].includes(latestData.readingType);

    if (needsPalm) {
      setState(prev => ({ ...prev, step: 'palm', userData: latestData }));
    } else {
      handleStartAnalysis(latestData);
    }
  }, [handleStartAnalysis]);

  const handleNextFromDivination = useCallback((latestData: UserData) => {
    handleStartAnalysis(latestData);
  }, [handleStartAnalysis]);

  const handleNextFromPalm = useCallback((latestPalmImages: PalmImages, skip: boolean) => {
    handleStartAnalysis(undefined, latestPalmImages, skip);
  }, [handleStartAnalysis]);
  const handleSelectHistory = useCallback((record: any) => {
    setState(prev => ({
      ...prev,
      result: record.content,
      isGenerating: false,
      tuviChart: record.tuviChart ? JSON.parse(record.tuviChart) : undefined,
      step: 'result',
      userData: {
        ...prev.userData,
        fullName: record.fullName,
        readingType: record.readingType
      }
    }));
    setIsHistoryOpen(false);
  }, []);

  const handleUpgrade = useCallback(() => {
    handleStartAnalysis({ ...state.userData, readingMode: 'full' }, state.palmImages, true);
  }, [handleStartAnalysis, state.userData, state.palmImages]);

  const handleHome = () => {
    const homeAction = () => {
      setState(prev => ({ ...prev, step: 'landing', result: null }));
    };

    if (state.step === 'result') {
      setPendingAction(() => homeAction);
      setShowExitConfirm(true);
    } else {
      homeAction();
    }
  };

  const handleBack = () => {
    const backAction = () => {
      if (state.step === 'result') {
        setState(prev => ({ ...prev, step: 'input' }));
      } else if (state.step === 'palm') {
        setState(prev => ({ ...prev, step: 'input' }));
      } else if (state.step === 'analyzing') {
        setState(prev => ({ ...prev, step: 'input' }));
      } else if (state.step === 'input') {
        setState(prev => ({ ...prev, step: 'landing' }));
      }
    };

    if (state.step === 'result') {
      setPendingAction(() => backAction);
      setShowExitConfirm(true);
    } else {
      backAction();
    }
  };

  const togglePerformanceMode = () => {
    setPerformanceMode(prev => {
      const newValue = !prev;
      localStorage.setItem('performance_mode', newValue ? 'low' : 'normal');
      return newValue;
    });
  };

  return (
    <div className={`min-h-screen selection:bg-accent/30 selection:text-white overflow-x-hidden bg-paper ${performanceMode ? 'low-perf' : ''}`}>
      {/* Dynamic Background Particles */}
      <BackgroundParticles lowPerf={performanceMode} />

      {/* Sacred Background with Buddha & Sanskrit */}
      <SacredBackground lowPerf={performanceMode} />

      {/* Global Navigation Controls */}
      {state.step !== 'landing' && (
        <div className="fixed top-4 left-4 md:top-6 md:left-6 z-[100] flex items-center gap-2 md:gap-3">
          <button 
            onClick={handleHome}
            className="group relative flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-full text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95"
            title="Thoát về Trang Chủ"
          >
            <div className="absolute inset-0 bg-red-500/5 rounded-full animate-pulse" />
            <Home size={18} className="md:w-5 md:h-5 relative z-10" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] relative z-10">Thoát</span>
          </button>
          
          <button 
            onClick={handleBack}
            className="p-2 md:p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-2xl"
            title="Quay Lại"
          >
            <ChevronLeft size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      )}

      {state.step === 'landing' && (
        <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="p-2 md:p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl text-gold/60 hover:text-gold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-2xl group"
            title="Cẩm Nang Sử Dụng"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="md:w-5 md:h-5" />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block">Cẩm Nang</span>
            </div>
          </button>

          <button 
            onClick={togglePerformanceMode}
            className={`p-2 md:p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl transition-all shadow-2xl group ${performanceMode ? 'text-emerald-400' : 'text-white/40'}`}
            title={performanceMode ? "Chế độ Hiệu năng: Thấp (Tiết kiệm)" : "Chế độ Hiệu năng: Cao"}
          >
            <div className="flex items-center gap-2">
              <Compass size={18} className={`md:w-5 md:h-5 ${performanceMode ? '' : 'animate-spin-slow'}`} />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                {performanceMode ? 'Tiết Kiệm' : 'Hiệu Năng'}
              </span>
            </div>
          </button>
        </div>
      )}

      {state.step !== 'divination' && (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 md:gap-3">
          <button 
            onClick={handleReset}
            className="p-2 md:p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-2xl"
            title="Làm Mới Dữ Liệu"
          >
            <div className="flex items-center gap-2">
              <Loader2 size={18} className={`md:w-5 md:h-5 ${state.step === 'analyzing' ? 'animate-spin' : ''}`} />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block">Làm Mới</span>
            </div>
          </button>
        </div>
      )}

      {/* Decorative Floating Elements */}
      {state.step !== 'divination' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none opacity-20">
        {/* Constellation Background */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="1" fill="white" />
          <circle cx="250" cy="220" r="1" fill="white" />
          <circle cx="300" cy="180" r="1" fill="white" />
          <line x1="200" y1="200" x2="250" y2="220" stroke="white" strokeWidth="0.2" />
          <line x1="250" y1="220" x2="300" y2="180" stroke="white" strokeWidth="0.2" />
          
          <circle cx="800" cy="700" r="1" fill="white" />
          <circle cx="850" cy="750" r="1" fill="white" />
          <circle cx="820" cy="800" r="1" fill="white" />
          <line x1="800" y1="700" x2="850" y2="750" stroke="white" strokeWidth="0.2" />
          <line x1="850" y1="750" x2="820" y2="800" stroke="white" strokeWidth="0.2" />
        </svg>

        {/* Vertical Rails */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="writing-mode-vertical text-[10px] uppercase tracking-[0.5em] text-gold/40 font-bold">
            Tinh Hoa Mệnh Lý • Thiên Cơ Bất Khả Lộ
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="writing-mode-vertical text-[10px] uppercase tracking-[0.5em] text-gold/40 font-bold">
            Trí Tuệ Cổ Nhân • Hiểu Mệnh Kiến Tạo
          </div>
        </div>

        <div className="absolute top-[15%] left-[10%] text-gold">
          <Sparkles size={40} />
        </div>
        <div className="absolute top-[25%] right-[15%] text-accent">
          <ScrollText size={32} />
        </div>
        <div className="absolute bottom-[20%] left-[15%] text-gold/40">
          <div className="w-12 h-12 border border-gold/20 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-gold rounded-full" />
          </div>
        </div>
      </div>
      )}

      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <PrayerWheel isOpen={isPrayerWheelOpen} onClose={() => setIsPrayerWheelOpen(false)} />
      
      {/* Global Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelExit}
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
                    onClick={confirmExit}
                    className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-2xl text-red-400 font-bold uppercase tracking-widest transition-all"
                  >
                    Thoát & Xóa Dữ Liệu
                  </button>
                  <button
                    onClick={cancelExit}
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

      <AnimatePresence>
        {isAlmanacOpen && <Almanac onClose={() => setIsAlmanacOpen(false)} />}
      </AnimatePresence>
      {isHistoryOpen && <History onSelect={handleSelectHistory} onClose={() => setIsHistoryOpen(false)} />}

      {/* Header - Only show on landing */}
      {state.step === 'landing' && (
        <header className="relative pt-12 md:pt-20 2xl:pt-32 pb-8 md:pb-12 2xl:pb-20 px-4 text-center space-y-4 md:space-y-6 2xl:space-y-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl 2xl:max-w-6xl opacity-10 pointer-events-none">
            <SpiritualClock />
          </div>

          <div className="inline-flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-accent font-medium text-sm shadow-2xl">
              <Sparkles size={14} className="text-gold" />
              <span className="tracking-[0.2em] md:tracking-[0.3em] 2xl:tracking-[0.5em] text-[8px] md:text-[10px] 2xl:text-xs font-bold text-white/60 uppercase">Tinh Hoa Mệnh Lý • Trí Tuệ Cổ Nhân</span>
            </div>

            {/* Gender Toggle on Landing */}
            <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              {(['Nam', 'Nữ'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => handleUserDataChange({ ...state.userData, gender: g })}
                  className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    state.userData.gender === g
                      ? 'bg-accent text-white shadow-lg'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 md:space-y-5 2xl:space-y-8">
            <h1 className="text-4xl sm:text-7xl md:text-8xl 2xl:text-[10rem] font-display font-bold text-white tracking-tighter leading-tight">
              Thiên Mệnh <span className="gold-gradient-text italic font-serif">Ký</span>
            </h1>
            <div className="flex items-center justify-center gap-3 md:gap-6 2xl:gap-10">
              <div className="h-px w-8 sm:w-12 md:w-24 2xl:w-48 bg-gradient-to-r from-transparent to-gold/40" />
              <p className="text-white/40 max-w-xl 2xl:max-w-3xl mx-auto text-sm sm:text-xl md:text-2xl 2xl:text-4xl font-serif italic tracking-wide">
                "Biết mệnh để an nhiên, hiểu vận để kiến tạo"
              </p>
              <div className="h-px w-8 sm:w-12 md:w-24 2xl:w-48 bg-gradient-to-l from-transparent to-gold/40" />
            </div>
          </div>
        </header>
      )}

      <main className={`container mx-auto px-4 pb-32 relative ${state.step !== 'landing' && state.step !== 'divination' ? 'pt-24 2xl:pt-32' : ''}`}>
        {state.step === 'landing' && (
          <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-[90rem] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 2xl:gap-8">
              {[
                { id: 'full', label: 'Bản Mệnh', icon: LayoutGrid, desc: 'Tử Vi, Bát Tự, Chỉ Tay & Tên', color: 'bg-accent', tooltip: 'Luận giải toàn diện cuộc đời kết hợp đa phương pháp cổ truyền và hiện đại.' },
                { id: 'yearly_horoscope', label: 'Tử Vi Năm', icon: CalendarRange, desc: 'Vận hạn chi tiết theo năm', color: 'bg-amber-600', tooltip: 'Luận giải Tử Vi hàng năm, xem sao chiếu mệnh, hạn tam tai, thái tuế và vận trình chi tiết.' },
                { id: 'tuvi', label: 'Lá Số Tử Vi', icon: Plus, desc: 'Lập lá số & Luận giải chi tiết', color: 'bg-blue-700', tooltip: 'Lập lá số Tử Vi Đẩu Số theo giờ sinh chính xác, phân tích 12 cung mệnh.' },
                { id: 'yearly', label: 'Vận Năm', icon: CalendarRange, desc: 'Xem vận hạn năm 2027, 2028...', color: 'bg-indigo-600', tooltip: 'Dự báo chi tiết các biến động về công danh, tài lộc và sức khỏe trong năm.' },
                { id: 'name', label: 'Tính Danh', icon: User, desc: 'Họ Tên & Ngày Giờ Sinh', color: 'bg-gold', tooltip: 'Phân tích năng lượng từ họ tên, tìm sự tương quan giữa danh tự và mệnh cục.' },
                { id: 'baby_name', label: 'Đặt Tên Con', icon: Baby, desc: 'Theo tên Bố Mẹ', color: 'bg-emerald-600', tooltip: 'Tư vấn tên gọi hợp phong thủy, bổ khuyết ngũ hành và gắn kết tình thân gia đình.' },
                { id: 'numerology', label: 'Thần Số Học', icon: Sparkles, desc: 'Giải mã mật mã linh hồn', color: 'bg-cyan-600', tooltip: 'Khám phá bản thân qua các con số định mệnh dựa trên ngày sinh và họ tên.' },
                { id: 'divination', label: 'Gieo Quẻ', icon: Sparkles, desc: 'Kinh Dịch Chiêm Bốc', color: 'bg-purple-600', tooltip: 'Thỉnh quẻ Kinh Dịch để tìm lời giải cho những vướng mắc, quyết định quan trọng.' },
                { id: 'monthly', label: 'Vận Tháng', icon: CalendarRange, desc: 'Xem vận hạn Lưu Nguyệt', color: 'bg-blue-600', tooltip: 'Theo dõi dòng chảy vận khí theo từng tháng để chủ động trong mọi kế hoạch.' },
                { id: 'daily', label: 'Vận Ngày', icon: CalendarDays, desc: 'Chọn ngày lành, giờ tốt', color: 'bg-teal-600', tooltip: 'Xem chi tiết vận hạn từng ngày, chọn giờ hoàng đạo để khởi sự hanh thông.' },
                { id: 'almanac', label: 'Lịch Vạn Sự', icon: CalendarDays, desc: 'Tra cứu ngày lành, tháng tốt', color: 'bg-orange-600', tooltip: 'Lịch vạn niên chi tiết, xem ngày hoàng đạo, giờ tốt và các việc nên làm/kiêng kỵ.' },
                { id: 'palm', label: 'Chỉ Tay', icon: Fingerprint, desc: 'Luận giải Sinh, Trí, Tâm & Vận mệnh', color: 'bg-rose-600', tooltip: 'Giải mã bản đồ số phận in trên lòng bàn tay qua các đường chỉ tay chính và phụ.' },
                { id: 'villa', label: 'Góc Biệt Thự', icon: Home, desc: 'Chữa lành & Tâm lý Phái Nữ', color: 'bg-pink-600', tooltip: 'Không gian riêng tư dành cho phái đẹp, thấu hiểu và chữa lành tâm hồn qua lăng kính mệnh lý.' },
                { id: 'seven_killings', label: 'Thất Sát', icon: Compass, desc: 'Chiến lược & Tầm nhìn dài hạn', color: 'bg-red-700', tooltip: 'Phân tích thế trận cuộc đời, định hướng chiến lược thăng tiến và vượt qua nghịch cảnh.' },
                { id: 'history', label: 'Lịch Sử', icon: HistoryIcon, desc: 'Xem lại các bản luận cũ', color: 'bg-slate-700', tooltip: 'Truy cập kho lưu trữ các bản luận giải đã thực hiện để chiêm nghiệm lại.' },
                { id: 'prayer_wheel', label: 'Kinh Luân', icon: RotateCcw, desc: 'Xoay chuyển luân hồi, tích đức', color: 'bg-amber-700', tooltip: 'Nghi thức tâm linh giúp thanh tịnh tâm hồn, tích lũy phước báu và hóa giải nghiệp lực.' },
              ].filter(type => {
                if (type.id === 'villa') return state.userData.gender === 'Nữ';
                return true;
              }).map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    if (type.id === 'divination') {
                      setState(prev => ({ 
                         ...prev, 
                         step: 'divination', 
                         userData: { ...prev.userData, readingType: 'divination' } 
                       }));
                    } else if (type.id === 'almanac') {
                      setIsAlmanacOpen(true);
                    } else if (type.id === 'prayer_wheel') {
                      setIsPrayerWheelOpen(true);
                    } else if (type.id === 'history') {
                      setIsHistoryOpen(true);
                    } else {
                      setState(prev => ({ 
                        ...prev, 
                        step: 'input', 
                        userData: { ...prev.userData, readingType: type.id as any } 
                      }));
                    }
                  }}
                  className="group relative p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] text-left space-y-4 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${type.color}/10 blur-3xl rounded-full -z-10 group-hover:scale-150 transition-transform duration-700`} />
                  
                  {/* Tooltip/Detailed Desc on Hover - Refined to be less intrusive */}
                  <div className="absolute inset-x-0 bottom-0 bg-paper/95 backdrop-blur-xl p-6 border-t border-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0 z-20">
                    <p className="text-gold font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-2">{type.label}</p>
                    <p className="text-white/80 text-[10px] leading-relaxed italic">"{type.tooltip}"</p>
                  </div>

                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${type.color}/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <type.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-display font-bold text-white group-hover:text-gold transition-colors">{type.label}</h3>
                    <p className="text-xs text-white/40 mt-1 leading-tight">{type.desc}</p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-white/20 group-hover:text-white uppercase tracking-widest">
                    Khám phá ngay <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {state.step === 'input' && (
          <div className="max-w-5xl 2xl:max-w-7xl mx-auto">
            <InputForm 
              data={state.userData} 
              onChange={handleUserDataChange}
              onNext={handleNextFromInput}
            />
          </div>
        )}

        {state.step === 'divination' && (
          <div className="min-h-screen bg-paper flex flex-col relative z-[60]">
            {/* Divination Header */}
            <header className="sticky top-0 z-[70] p-6 flex items-center justify-between border-b border-white/5 bg-paper/80 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Kinh Dịch Chiêm Bốc</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Thiên Cơ Hiển Lộ • Tâm Thành Tất Ứng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsGuideOpen(true)}
                  className="px-6 py-2 rounded-full border border-gold/20 text-[10px] font-bold text-gold/60 uppercase tracking-widest hover:bg-gold/5 transition-all flex items-center gap-2"
                >
                  <BookOpen size={14} />
                  Cẩm Nang
                </button>
                <button 
                  onClick={handleHome}
                  className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Thoát Nghi Thức
                </button>
              </div>
            </header>

            <div className="flex-1 p-6">
              <DivinationForm 
                data={state.userData} 
                onChange={handleUserDataChange}
                onNext={handleNextFromDivination}
                onOfflineNext={handleStartOfflineAnalysis}
              />
            </div>
          </div>
        )}

        {state.step === 'palm' && (
          <div className="max-w-5xl 2xl:max-w-7xl mx-auto">
            {state.error && (
              <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center">
                {state.error}
              </div>
            )}
            <PalmUpload 
              userData={state.userData}
              images={state.palmImages}
              onChange={handlePalmImagesChange}
              onUserDataChange={handleUserDataChange}
              onBack={() => setState(prev => ({ ...prev, step: 'input' }))}
              onNext={handleNextFromPalm}
            />
          </div>
        )}

        {state.step === 'analyzing' && (
          <div className="max-w-4xl mx-auto text-center py-20 md:py-32 space-y-16 relative">
            <div className="relative h-64 md:h-96 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0.2, 0.5, 0.2], 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full" 
              />
              
              {/* Lighting Effect Layers */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-[300px] h-[300px] bg-gold/10 rounded-full blur-[80px]"
                />
                <motion.div 
                  animate={{ 
                    rotate: 360 
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[400px] h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent blur-sm"
                />
                <motion.div 
                  animate={{ 
                    rotate: -360 
                  }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute h-[400px] w-[2px] bg-gradient-to-b from-transparent via-gold/20 to-transparent blur-sm"
                />
              </div>

              {/* Sacred Cross with Glow */}
              <div className="relative z-10 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(212, 175, 55, 0.2)",
                      "0 0 60px rgba(212, 175, 55, 0.5)",
                      "0 0 20px rgba(212, 175, 55, 0.2)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute w-32 h-32 md:w-48 md:h-48 bg-accent/5 rounded-full blur-2xl" 
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative"
                >
                  <Plus size={80} className="md:w-32 md:h-32 text-gold filter drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" strokeWidth={1.5} />
                  
                  {/* Inner Glow */}
                  <motion.div 
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-1 h-1 bg-white rounded-full blur-[2px]" />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-8 relative z-30">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-display font-bold gold-gradient-text tracking-widest uppercase">Đang chiêm nghiệm...</h2>
                <div className="h-1 w-48 bg-white/5 mx-auto rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-full w-full bg-gold/40" 
                  />
                </div>
              </div>

              <div className="max-w-lg mx-auto h-20 flex flex-col items-center justify-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={state.analysisStatus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white/60 italic font-serif text-lg md:text-xl tracking-wide"
                  >
                    {state.analysisStatus || 'Đang thấu thị thiên cơ, kiến giải mệnh lý...'}
                  </motion.p>
                </AnimatePresence>
                
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Hệ thống đang đối soát dữ liệu tin cậy</span>
                </div>
              </div>

              {/* Token Usage while analyzing */}
              {state.tokenUsage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex flex-col gap-1 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/40"
                >
                  <div className="flex items-center justify-center gap-4">
                    <span>Thiên Cơ: {state.tokenUsage.promptTokens.toLocaleString()}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>Kiến Giải: {state.tokenUsage.candidatesTokens.toLocaleString()}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-gold/60">Tổng: {state.tokenUsage.totalTokens.toLocaleString()}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {state.step === 'result' && state.result && (
          <div className="max-w-5xl 2xl:max-w-7xl mx-auto space-y-8">
            <ReadingResult 
              content={state.result} 
              onReset={handleReset} 
              tuviChart={state.tuviChart}
              palmImages={state.palmImages}
              userData={state.userData}
              tokenUsage={state.tokenUsage}
              sessionTotalTokens={state.sessionTotalTokens}
              isGenerating={state.isGenerating}
              onUpgrade={handleUpgrade}
            />
            
            {!state.isGenerating && (
              <div className="pb-20 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMediumshipOpen(true)}
                  className="group relative px-12 py-6 bg-gradient-to-br from-red-950 to-black border border-red-500/30 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ef444422_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                      <Sparkles size={32} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-display font-bold text-white tracking-[0.2em] uppercase">Thỉnh Ý Thanh Đồng</h3>
                      <p className="text-[10px] text-red-400/60 font-bold uppercase tracking-widest mt-1">Gặp gỡ Bề Trên • Khai mở Thiên Cơ</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {state.step === 'result' && !isMediumshipOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMediumshipOpen(true)}
            className="fixed bottom-8 right-8 z-[150] w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-600 to-red-950 rounded-3xl shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-white border border-red-400/30 group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <Sparkles size={32} className="group-hover:animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-[10px] font-bold text-black animate-bounce">
              !
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMediumshipOpen && (
          <SpiritualMediumPage 
            userData={state.userData}
            palmImages={state.palmImages}
            initialReading={state.result || ''}
            chatMessages={state.chatState.messages}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isThinking={state.chatState.isThinking}
            onClose={() => setIsMediumshipOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 text-center text-white/20 text-sm tracking-[0.2em] uppercase font-bold">
        <p>© 2026 Thiên Mệnh Ký. Tinh hoa Mệnh lý • Trí tuệ Cổ nhân.</p>
      </footer>
    </div>
  );
}
