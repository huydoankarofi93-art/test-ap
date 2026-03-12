import { TuViChart } from './services/tuvi-engine/tuviChart';

export type Gender = 'Nam' | 'Nữ';
export type BabyGender = 'Nam' | 'Nữ' | 'Cả hai';
export type HeritageMode = 'traditional' | 'semi_traditional' | 'destiny_optimized';

export type ReadingType = 'full' | 'yearly' | 'monthly' | 'daily' | 'name' | 'baby_name' | 'divination' | 'palm' | 'seven_killings' | 'tuvi' | 'yearly_horoscope' | 'numerology' | 'villa';

export type DivinationMethod = 'auto' | 'coins' | 'question' | 'click' | 'sticks' | 'lookup';

export type DivinationFocus = 
  | "career"
  | "wealth"
  | "love"
  | "health"
  | "family"
  | "relocation"
  | "legal"
  | "general";

export type ResidenceStatus = 'temporary' | 'permanent' | 'undetermined';

export type ReadingMode = 'basic' | 'full';
export type AnalysisMethod = 'tuvi' | 'palm' | 'elements' | 'numerology';

export interface UserData {
  fullName: string;
  fatherName?: string;
  motherName?: string;
  fatherBirthYear?: string;
  motherBirthYear?: string;
  babyName?: string;
  babyGender?: BabyGender;
  birthDate: string;
  birthTime: string;
  gender: Gender;
  birthPlace: string;
  currentPlace: string;
  residenceStatus?: ResidenceStatus;
  hasConfirmedAccuracy: boolean;
  readingType: ReadingType;
  heritageMode?: HeritageMode;
  targetDate?: string; // For daily/monthly
  // Divination specific
  divinationMethod?: DivinationMethod;
  divinationFocus?: DivinationFocus;
  divinationQuestion?: string;
  divinationUrgency?: 'low' | 'medium' | 'high';
  divinationCoins?: number[][]; // 6 tosses, each toss is 3 coins (0 for tail, 1 for head)
  divinationStick?: number; // 1-64 or 1-100
  divinationHexagram?: number; // 1-64
  divinationMovingLine?: number; // 1-6
  divinationTime?: string; // ISO string of the casting time
  divinationIsCastDone?: boolean;
  palmAssessment?: {
    handShape?: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
    handColor?: 'Hồng nhuận' | 'Tím tái' | 'Vàng đục' | 'Trắng bệch';
    wristLines?: '1 ngấn' | '2 ngấn' | '3 ngấn' | 'Đứt đoạn';
    thickness?: 'Dày' | 'Mỏng' | 'Vừa';
    boneStructure?: 'To' | 'Nhỏ' | 'Vừa';
    joints?: 'Nổi' | 'Phẳng';
    fingerSegments?: 'Dài' | 'Ngắn' | 'Cân đối';
    curvature?: 'Thẳng' | 'Cong';
  };
  // Social Benchmark Layer
  socialBenchmark?: {
    incomeRange?: 'Thấp' | 'Trung bình' | 'Khá' | 'Cao' | 'Rất cao';
    careerStage?: 'Sinh viên' | 'Mới đi làm' | 'Chuyên viên' | 'Quản lý' | 'Lãnh đạo' | 'Nghỉ hưu';
    assetLevel?: 'Chưa có' | 'Cơ bản' | 'Khá' | 'Tích lũy tốt' | 'Thịnh vượng';
    maritalStatus?: 'Độc thân' | 'Đã kết hôn' | 'Ly hôn' | 'Góa';
  };
  familyStatus?: {
    hasSpouse: boolean;
    isDivorced: boolean;
    isUndetermined?: boolean;
    hasChildren: boolean;
    childrenStatus?: 'hasChildrenDetailed' | 'hasChildrenTotal' | 'noChildren' | 'undetermined';
    numSons: number;
    numDaughters: number;
    totalChildren?: number;
    useTotalCount?: boolean;
  };
  readingMode?: ReadingMode;
  selectedMethods?: AnalysisMethod[];
}

export interface PalmImage {
  data: string;
  label?: string;
}

export interface PalmImages {
  primary: PalmImage[]; // Array of palm images with optional labels
  secondary: PalmImage[]; // Array of palm images with optional labels
}

export interface PalmLine {
  id: string;
  name: string;
  points: [number, number][]; // [x, y] coordinates (0-1000)
  meaning: string;
  color?: string;
}

export interface PalmAnalysisData {
  palm_lines: PalmLine[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isThinking: boolean;
}

export interface ReadingState {
  step: 'landing' | 'input' | 'palm' | 'analyzing' | 'result' | 'divination';
  userData: UserData;
  palmImages: PalmImages;
  result: string | null;
  isGenerating?: boolean;
  error: string | null;
  tuviChart?: TuViChart;
  skipPalmValidation?: boolean;
  chatState: ChatState;
  tokenUsage?: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
  sessionTotalTokens?: number;
  analysisStatus?: string;
}
