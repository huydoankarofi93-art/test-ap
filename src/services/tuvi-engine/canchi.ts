const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export function getYearCanChi(year: number) {
  const can = CAN[(year + 6) % 10];
  const chi = CHI[(year + 8) % 12];
  return { can, chi };
}

export function getMonthCanChi(yearCan: string, month: number) {
  // Công thức tính Can của tháng dựa trên Can của năm
  const startCanIndex = {
    "Giáp": 2, "Kỷ": 2, // Bính Dần
    "Ất": 4, "Canh": 4, // Mậu Dần
    "Bính": 6, "Tân": 6, // Canh Dần
    "Đinh": 8, "Nhâm": 8, // Nhâm Dần
    "Mậu": 0, "Quý": 0  // Giáp Dần
  }[yearCan] || 0;

  const can = CAN[(startCanIndex + month - 1) % 10];
  const chi = CHI[(month + 1) % 12]; // Tháng 1 là Dần (index 2)
  return { can, chi };
}

export function getHourCanChi(dayCan: string, hour: number) {
  // Giờ Tý bắt đầu từ 23h hôm trước đến 1h hôm sau
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  const startCanIndex = {
    "Giáp": 0, "Kỷ": 0, // Giáp Tý
    "Ất": 2, "Canh": 2, // Bính Tý
    "Bính": 4, "Tân": 4, // Mậu Tý
    "Đinh": 6, "Nhâm": 6, // Canh Tý
    "Mậu": 8, "Quý": 8  // Nhâm Tý
  }[dayCan] || 0;

  const can = CAN[(startCanIndex + hourIndex) % 10];
  const chi = CHI[hourIndex];
  return { can, chi };
}

export { CAN, CHI };
