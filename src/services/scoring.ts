import { AstronomicalData } from './astronomy';
import { UserData } from '../types';

export interface LifeScores {
  career: number;
  careerLabel: string;
  wealth: number;
  wealthLabel: string;
  health: number;
  healthLabel: string;
  love: number;
  loveLabel: string;
  overall: number;
  overallLabel: string;
  lifeProgressIndex?: number;
  lifeProgressLabel?: string;
  confidenceScore?: number;
  confidenceLabel?: string;
  strategyMode?: 'DEFENSIVE' | 'BALANCED' | 'EXPANSION';
  strategyLabel?: string;
}

export function destinyLevel(score: number): string {
  if (score > 85) return "Đại cát";
  if (score > 70) return "Thượng cát";
  if (score > 55) return "Cát";
  if (score > 45) return "Bình";
  if (score > 35) return "Tiểu hung";
  if (score > 20) return "Hung";
  return "Đại hung";
}

export function confidenceLevel(score: number): string {
  if (score > 85) return "Rất cao";
  if (score > 70) return "Cao";
  if (score > 50) return "Trung bình";
  return "Thấp";
}

export function lifeProgressStatus(score: number): string {
  if (score > 85) return "Đang thịnh";
  if (score > 70) return "Đang mở vận";
  if (score > 50) return "Đang tích lũy";
  if (score > 30) return "Đang chuyển vận";
  return "Chưa khai vận";
}

export function strategyLabel(mode: 'DEFENSIVE' | 'BALANCED' | 'EXPANSION'): string {
  const map = {
    'DEFENSIVE': 'Thu mình dưỡng lực',
    'BALANCED': 'Tiến chậm chắc',
    'EXPANSION': 'Thuận thời mở vận'
  };
  return map[mode];
}

export function areaStatus(score: number, area: string): string {
  if (area === 'career') {
    if (score > 70) return "Đang mở vận";
    if (score > 50) return "Có đà phát triển";
    if (score > 35) return "Bình hòa";
    return "Cần kiên nhẫn";
  }
  if (area === 'wealth') {
    if (score > 70) return "Tài lộc dồi dào";
    if (score > 50) return "Đang tích lũy";
    if (score > 35) return "Bình ổn";
    return "Cần thận trọng";
  }
  if (area === 'love') {
    if (score > 70) return "Duyên lành hội tụ";
    if (score > 50) return "Có hỷ sự";
    if (score > 35) return "Bình hòa";
    return "Có thử thách";
  }
  if (area === 'health') {
    if (score > 70) return "Khí huyết sung mãn";
    if (score > 50) return "Tương đối ổn";
    if (score > 35) return "Bình thường";
    return "Cần điều dưỡng";
  }
  return destinyLevel(score);
}

/**
 * Quantitative scoring engine.
 * This calculates baseline scores based on elemental balance and astronomical data.
 * These scores serve as "hard evidence" for the AI to refine.
 */
export function calculateScores(data: AstronomicalData, userData?: UserData): LifeScores {
  const { elementalBalance } = data;
  
  // Logic: A balanced chart is usually better. 
  const elementValues = Object.values(elementalBalance);
  const avg = elementValues.reduce((a, b) => a + b, 0) / elementValues.length;
  const variance = elementValues.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / elementValues.length;
  
  // Balance score (0-100)
  let baseScore = Math.max(0, 100 - variance * 10);

  // --- Refined Weighting Logic ---
  // 1. Identify Dụng Thần (Simplified: The weakest element that balances the chart)
  const sortedElements = Object.entries(elementalBalance).sort((a, b) => a[1] - b[1]);
  const dungThan = sortedElements[0][0];
  const kyThan = sortedElements[sortedElements.length - 1][0];

  // 2. Adjustments
  let adjustments = 0;
  // Dụng thần được bổ (if it has at least some presence)
  if (elementalBalance[dungThan] > 0) adjustments += 5;
  // Kỵ thần vượng (if it's too dominant)
  if (elementalBalance[kyThan] > 3) adjustments -= 5;

  // 3. Area scoring with weights
  const career = Math.min(100, (elementalBalance['Kim'] * 15 + elementalBalance['Hỏa'] * 10 + baseScore * 0.5 + adjustments));
  const wealth = Math.min(100, (elementalBalance['Thổ'] * 15 + elementalBalance['Thủy'] * 10 + baseScore * 0.5 + adjustments));
  const health = Math.min(100, (elementalBalance['Mộc'] * 20 + baseScore * 0.6 + adjustments));
  const love = Math.min(100, (elementalBalance['Hỏa'] * 12 + elementalBalance['Thủy'] * 12 + baseScore * 0.5 + adjustments));

  const overall = (career + wealth + health + love) / 4;

  // Determine Strategy Mode
  let strategyMode: 'DEFENSIVE' | 'BALANCED' | 'EXPANSION' = 'BALANCED';
  if (overall < 40) strategyMode = 'DEFENSIVE';
  else if (overall > 70) strategyMode = 'EXPANSION';

  // --- Life Progress Index (Social Benchmark) ---
  let lifeProgressIndex = 0;
  if (userData?.socialBenchmark) {
    const { incomeRange, careerStage, assetLevel } = userData.socialBenchmark;
    
    const incomeMap = { 'Thấp': 20, 'Trung bình': 40, 'Khá': 60, 'Cao': 80, 'Rất cao': 100 };
    const careerMap = { 'Sinh viên': 10, 'Mới đi làm': 30, 'Chuyên viên': 50, 'Quản lý': 75, 'Lãnh đạo': 95, 'Nghỉ hưu': 60 };
    const assetMap = { 'Chưa có': 10, 'Cơ bản': 30, 'Khá': 60, 'Tích lũy tốt': 85, 'Thịnh vượng': 100 };

    const incomeVal = incomeMap[incomeRange as keyof typeof incomeMap] || 0;
    const careerVal = careerMap[careerStage as keyof typeof careerMap] || 0;
    const assetVal = assetMap[assetLevel as keyof typeof assetMap] || 0;

    lifeProgressIndex = (incomeVal * 0.4 + careerVal * 0.3 + assetVal * 0.3);
  }

  const confidenceScore = 75 + (adjustments * 2); // Base confidence around 75%

  return {
    career: Math.round(career),
    careerLabel: areaStatus(career, 'career'),
    wealth: Math.round(wealth),
    wealthLabel: areaStatus(wealth, 'wealth'),
    health: Math.round(health),
    healthLabel: areaStatus(health, 'health'),
    love: Math.round(love),
    loveLabel: areaStatus(love, 'love'),
    overall: Math.round(overall),
    overallLabel: destinyLevel(overall),
    lifeProgressIndex: lifeProgressIndex > 0 ? Math.round(lifeProgressIndex) : undefined,
    lifeProgressLabel: lifeProgressIndex > 0 ? lifeProgressStatus(lifeProgressIndex) : undefined,
    confidenceScore: Math.round(confidenceScore),
    confidenceLabel: confidenceLevel(confidenceScore),
    strategyMode,
    strategyLabel: strategyLabel(strategyMode)
  };
}
