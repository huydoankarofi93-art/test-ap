import { CHI } from "./canchi";

const PALACES = [
  "Mệnh",
  "Phụ mẫu",
  "Phúc đức",
  "Điền trạch",
  "Quan lộc",
  "Nô bộc",
  "Thiên di",
  "Tật ách",
  "Tài bạch",
  "Tử tức",
  "Phu thê",
  "Huynh đệ"
];

const CHI_INDEX: Record<string, number> = {
  "Tý": 0, "Sửu": 1, "Dần": 2, "Mão": 3, "Thìn": 4, "Tỵ": 5,
  "Ngọ": 6, "Mùi": 7, "Thân": 8, "Dậu": 9, "Tuất": 10, "Hợi": 11
};

/**
 * An cung Mệnh và Thân
 * Mệnh = Tháng sinh + Giờ sinh (ngược chiều kim đồng hồ từ Dần)
 * Thân = Tháng sinh + Giờ sinh (thuận chiều kim đồng hồ từ Dần)
 */
export function calcMenhThan(month: number, hourChi: string) {
  const startPos = 2; // Dần
  const hourIdx = CHI_INDEX[hourChi];
  
  // Mệnh: Dần là tháng 1, đi ngược chiều kim đồng hồ
  const menhIdx = (startPos + (month - 1) - hourIdx + 12) % 12;
  
  // Thân: Dần là tháng 1, đi thuận chiều kim đồng hồ
  const thanIdx = (startPos + (month - 1) + hourIdx) % 12;

  return { menhIdx, thanIdx };
}

export function buildPalaces(menhIndex: number) {
  const result: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    const palace = PALACES[i];
    // Các cung an nghịch chiều kim đồng hồ từ Mệnh
    const pos = (menhIndex - i + 12) % 12;
    result[palace] = CHI[pos];
  }
  return result;
}

export { PALACES, CHI_INDEX };
