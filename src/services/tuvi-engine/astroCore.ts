import { CHI_INDEX } from "./palaceEngine";
import { getElement } from "./napam";
import { CAN } from "./canchi";

export const ELEMENT_MAP: Record<string, string> = {
  "Kim": "Kim tứ cục",
  "Mộc": "Mộc tam cục",
  "Thủy": "Thủy nhị cục",
  "Hỏa": "Hỏa lục cục",
  "Thổ": "Thổ ngũ cục"
};

export const TRUONG_SINH = [
  "Trường sinh", "Mộc dục", "Quan đới", "Lâm quan", "Đế vượng",
  "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"
];

/**
 * Xác định Cục (Ngũ hành cục) dựa trên Can năm và vị trí cung Mệnh
 */
export function calcCuc(yearCan: string, menhChi: string) {
  // 1. Tìm Can của cung Mệnh (Khởi Dần)
  const startCanIndex = {
    "Giáp": 2, "Kỷ": 2, // Bính Dần
    "Ất": 4, "Canh": 4, // Mậu Dần
    "Bính": 6, "Tân": 6, // Canh Dần
    "Đinh": 8, "Nhâm": 8, // Nhâm Dần
    "Mậu": 0, "Quý": 0  // Giáp Dần
  }[yearCan] || 0;

  const chiIdx = CHI_INDEX[menhChi];
  // Cung Dần là index 2. Khoảng cách từ Dần đến menhChi:
  const offset = (chiIdx - 2 + 12) % 12;
  const menhCan = CAN[(startCanIndex + offset) % 10];

  // 2. Lấy hành của Nap Am (menhCan, menhChi)
  const element = getElement(menhCan, menhChi);
  
  return ELEMENT_MAP[element] || "Thổ ngũ cục";
}

export function calcTruongSinh(cuc: string, gender: string, yearCan: string) {
  const startPos: Record<string, number> = {
    "Thủy nhị cục": 8, // Thân
    "Mộc tam cục": 11, // Hợi
    "Kim tứ cục": 5,   // Tỵ
    "Thổ ngũ cục": 8,  // Thân
    "Hỏa lục cục": 2   // Dần
  };

  const cucBase = cuc.split(' ')[0] + " " + cuc.split(' ')[1];
  let pos = startPos[cucBase] || 2;
  
  const isDuongNam = (yearCan === "Giáp" || yearCan === "Bính" || yearCan === "Mậu" || yearCan === "Canh" || yearCan === "Nhâm") && gender === "Nam";
  const isAmNu = !isDuongNam && gender === "Nữ";
  const isThuan = isDuongNam || isAmNu;

  const result: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    const idx = isThuan ? (pos + i) % 12 : (pos - i + 12) % 12;
    result[CHI_INDEX[Object.keys(CHI_INDEX)[idx]]] = TRUONG_SINH[i];
  }
  
  // Trả về map từ Chi index sang vòng Trường sinh
  const finalMap: Record<string, string> = {};
  Object.keys(CHI_INDEX).forEach(chi => {
    finalMap[chi] = result[CHI_INDEX[chi]];
  });
  return finalMap;
}

export function calcStars(cuc: string, day: number, yearCan: string, yearChi: string, month: number, hourChi: string) {
  const cucValue = parseInt(cuc.match(/\d+/)?.[0] || "2", 10);
  const chiList = Object.keys(CHI_INDEX);
  const stars: Record<string, string[]> = {};
  chiList.forEach(chi => stars[chi] = []);

  // 1. Vị trí Tử Vi (Công thức chuẩn)
  let k = 0;
  while ((day + k) % cucValue !== 0) {
    k++;
  }
  const x = (day + k) / cucValue;
  let tuViPos = 0;
  if (k % 2 === 0) {
    tuViPos = (x + k + 2) % 12;
  } else {
    tuViPos = (x - k + 2 + 12) % 12;
  }
  
  // 14 Chính Tinh
  const tuViGroup = ["Tử Vi", "Thiên Cơ", "", "Thái Dương", "Vũ Khúc", "Thiên Đồng", "", "", "Liêm Trinh"];
  tuViGroup.forEach((star, i) => {
    if (star) {
      const pos = (tuViPos - i + 12) % 12;
      stars[chiList[pos]].push(star);
    }
  });

  const thienPhuPos = (12 - tuViPos + 4) % 12;
  const thienPhuGroup = ["Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Thất Sát", "", "", "", "Phá Quân"];
  thienPhuGroup.forEach((star, i) => {
    if (star) {
      const pos = (thienPhuPos + i) % 12;
      stars[chiList[pos]].push(star);
    }
  });

  // 2. Phụ Tinh theo Năm (Can Năm)
  const locTonTable: Record<string, number> = {
    "Giáp": 2, "Ất": 3, "Bính": 5, "Đinh": 6, "Mậu": 5, "Kỷ": 6, "Canh": 8, "Tân": 9, "Nhâm": 11, "Quý": 0
  };
  const locTonPos = locTonTable[yearCan];
  if (locTonPos !== undefined) {
    stars[chiList[locTonPos]].push("Lộc Tồn");
    stars[chiList[(locTonPos + 1) % 12]].push("Kình Dương");
    stars[chiList[(locTonPos - 1 + 12) % 12]].push("Đà La");
  }

  // 3. Phụ Tinh theo Tháng
  const taPhuPos = (2 + month + 12) % 12; // Dần + Month
  const huuBatPos = (10 - month + 12) % 12; // Tuất - Month
  stars[chiList[taPhuPos]].push("Tả Phù");
  stars[chiList[huuBatPos]].push("Hữu Bật");

  // 4. Phụ Tinh theo Giờ
  const hourIdx = CHI_INDEX[hourChi];
  const vanXuongPos = (10 - hourIdx + 12) % 12; // Tuất - Hour
  const vanKhucPos = (2 + hourIdx + 12) % 12; // Thìn + Hour (Wait, Thìn is 4)
  // Standard rules:
  // Văn Xương: Tuất (10) nghịch đến giờ sinh
  // Văn Khúc: Thìn (4) thuận đến giờ sinh
  const vxPos = (10 - hourIdx + 12) % 12;
  const vkPos = (4 + hourIdx) % 12;
  stars[chiList[vxPos]].push("Văn Xương");
  stars[chiList[vkPos]].push("Văn Khúc");

  const diaKhongPos = (11 - hourIdx + 12) % 12; // Hợi nghịch đến giờ
  const diaKiepPos = (11 + hourIdx) % 12; // Hợi thuận đến giờ
  stars[chiList[diaKhongPos]].push("Địa Không");
  stars[chiList[diaKiepPos]].push("Địa Kiếp");

  // 5. Hỏa Tinh, Linh Tinh (Simplified rules)
  // Hỏa Tinh: Dần Ngọ Tuất khởi tại Sửu (1), Thân Tý Thìn khởi tại Dần (2), Tỵ Dậu Sửu khởi tại Mão (3), Hợi Mão Mùi khởi tại Dậu (9)
  const hoaTinhStart: Record<string, number> = {
    "Dần": 1, "Ngọ": 1, "Tuất": 1,
    "Thân": 2, "Tý": 2, "Thìn": 2,
    "Tỵ": 3, "Dậu": 3, "Sửu": 3,
    "Hợi": 9, "Mão": 9, "Mùi": 9
  };
  const htStart = hoaTinhStart[yearChi] || 1;
  const htPos = (htStart + hourIdx) % 12;
  stars[chiList[htPos]].push("Hỏa Tinh");

  return stars;
}
