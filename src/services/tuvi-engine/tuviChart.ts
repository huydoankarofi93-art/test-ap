import { Solar, Lunar } from "lunar-javascript";
import { getYearCanChi, CHI, CAN } from "./canchi";
import { calcMenhThan, buildPalaces, CHI_INDEX } from "./palaceEngine";
import { calcCuc, calcTruongSinh, calcStars } from "./astroCore";
import { adjustToStandardTime } from "../../timezone";
import { getNapAm } from "./napam";

export interface TuViChart {
  fullName: string;
  menh: string;
  than: string;
  cuc: string;
  palaces: Record<string, string>;
  truongSinh: Record<string, string>;
  stars: Record<string, string[]>;
  yearCanChi: { can: string; chi: string };
  monthCanChi: { can: string; chi: string };
  dayCanChi: { can: string; chi: string };
  hourCanChi: { can: string; chi: string };
  lunarDate: { day: number; month: number; year: number; isLeap: boolean };
  solarDate: { day: number; month: number; year: number };
  gender: "Nam" | "Nữ";
  yinYang: string;
  banMenh: string;
  menhChu: string;
  thanChu: string;
  age: number;
  daiHan: Record<string, number>;
  tieuHan: Record<string, string>;
}

export function generateTuViChart(
  fullName: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: "Nam" | "Nữ",
  isNorth: boolean = false
): TuViChart {
  // 1. Hiệu chỉnh múi giờ lịch sử
  const birthDate = new Date(year, month - 1, day);
  const { adjustedDate, adjustedHour } = adjustToStandardTime(birthDate, hour, isNorth);

  // 2. Chuyển đổi sang Âm lịch (Lunar) dùng lunar-javascript
  const solar = Solar.fromYmdHms(
    adjustedDate.getFullYear(),
    adjustedDate.getMonth() + 1,
    adjustedDate.getDate(),
    adjustedHour,
    0,
    0
  );
  const lunar = solar.getLunar();

  // 3. Xử lý Giờ Tý (23h-1h) and lấy Can Chi của giờ
  const hourChiIdx = Math.floor((adjustedHour + 1) / 2) % 12;
  const hourChi = CHI[hourChiIdx];
  
  // Tính Can của giờ dựa trên Can của ngày (Phép khởi giờ)
  const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const dayCan = lunar.getDayGan();
  const dayCanIdx = CAN.indexOf(dayCan);
  // Công thức: (DayCanIndex * 2 + HourChiIndex) % 10
  const hourCanIdx = (dayCanIdx * 2 + hourChiIdx) % 10;
  const hourCan = CAN[hourCanIdx];

  // 4. Xử lý Tháng Nhuận (Quy tắc Ngày 15)
  let lunarMonth = lunar.getMonth();
  const isLeap = lunarMonth < 0; 
  const absMonth = Math.abs(lunarMonth);
  const lunarDay = lunar.getDay();

  // Quy tắc Ngày 15: Sinh sau ngày 15 tháng nhuận tính sang tháng sau
  let calculationMonth = absMonth;
  if (isLeap && lunarDay >= 15) {
    calculationMonth = absMonth + 1;
    if (calculationMonth > 12) calculationMonth = 1;
  }

  // 5. Tính toán Mệnh Thân & Cung
  const { menhIdx, thanIdx } = calcMenhThan(calculationMonth, hourChi);
  const palaces = buildPalaces(menhIdx);
  const menhChi = palaces["Mệnh"];
  const thanChi = CHI[thanIdx];
  
  // 6. Tính Cục & Trường Sinh
  const { can: yearCan, chi: yearChi } = getYearCanChi(lunar.getYear());
  const cuc = calcCuc(yearCan, menhChi);
  const truongSinh = calcTruongSinh(cuc, gender, yearCan);
  
  // 7. An Sao (Dùng ngày âm lịch thực tế)
  const stars = calcStars(cuc, lunarDay, yearCan, yearChi, calculationMonth, hourChi);

  // 8. Tính Âm Dương Nam Nữ
  const isDuong = ["Giáp", "Bính", "Mậu", "Canh", "Nhâm"].includes(yearCan);
  const yinYang = `${isDuong ? "Dương" : "Âm"} ${gender}`;

  // 9. Tính Bản Mệnh
  const banMenh = getNapAm(yearCan, yearChi);

  // 10. Mệnh Chủ & Thân Chủ
  const menhChuTable: Record<string, string> = {
    "Tý": "Tham Lang", "Sửu": "Cự Môn", "Dần": "Lộc Tồn", "Mão": "Văn Khúc",
    "Thìn": "Liêm Trinh", "Tỵ": "Vũ Khúc", "Ngọ": "Phá Quân", "Mùi": "Vũ Khúc",
    "Thân": "Liêm Trinh", "Dậu": "Văn Khúc", "Tuất": "Lộc Tồn", "Hợi": "Cự Môn"
  };
  const thanChuTable: Record<string, string> = {
    "Tý": "Linh Tinh", "Sửu": "Thiên Tướng", "Dần": "Thiên Lương", "Mão": "Thiên Đồng",
    "Thìn": "Văn Xương", "Tỵ": "Thiên Cơ", "Ngọ": "Hỏa Tinh", "Mùi": "Thiên Tướng",
    "Thân": "Thiên Lương", "Dậu": "Thiên Đồng", "Tuất": "Văn Xương", "Hợi": "Thiên Cơ"
  };
  const menhChu = menhChuTable[lunar.getYearZhi()] || "Tham Lang";
  const thanChu = thanChuTable[lunar.getYearZhi()] || "Linh Tinh";

  // 11. Tính Đại Hạn
  const cucValue = parseInt(cuc.match(/\d+/)?.[0] || "2", 10);
  const daiHan: Record<string, number> = {};
  const isDuongNam = isDuong && gender === "Nam";
  const isAmNu = !isDuong && gender === "Nữ";
  const isThuan = isDuongNam || isAmNu;

  const chiList = Object.keys(CHI_INDEX);
  const menhPos = CHI_INDEX[menhChi];
  for (let i = 0; i < 12; i++) {
    const pos = isThuan ? (menhPos + i) % 12 : (menhPos - i + 12) % 12;
    daiHan[chiList[pos]] = cucValue + i * 10;
  }

  // 12. Tính Tiểu Hạn (Simplified)
  const tieuHan: Record<string, string> = {};
  const startChiIdx = (CHI_INDEX[lunar.getYearZhi()] + (gender === "Nam" ? 1 : -1) + 12) % 12;
  for (let i = 0; i < 12; i++) {
    const pos = (startChiIdx + i) % 12;
    tieuHan[chiList[pos]] = chiList[i];
  }

  return {
    fullName,
    menh: menhChi,
    than: thanChi,
    cuc,
    palaces,
    truongSinh,
    stars,
    yearCanChi: { can: yearCan, chi: yearChi },
    monthCanChi: { can: CAN[(CAN.indexOf(yearCan) * 2 + 2 + absMonth - 1) % 10], chi: CHI[(absMonth + 1) % 12] },
    dayCanChi: { can: lunar.getDayGan(), chi: lunar.getDayZhi() }, // These might still be Chinese, but let's focus on Year for now
    hourCanChi: { can: hourCan, chi: hourChi },
    lunarDate: { 
      day: lunarDay, 
      month: absMonth, 
      year: lunar.getYear(), 
      isLeap 
    },
    solarDate: {
      day: adjustedDate.getDate(),
      month: adjustedDate.getMonth() + 1,
      year: adjustedDate.getFullYear()
    },
    gender,
    yinYang,
    banMenh,
    menhChu,
    thanChu,
    age: new Date().getFullYear() - year + 1,
    daiHan,
    tieuHan
  };
}
