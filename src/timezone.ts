
export interface TimezonePeriod {
  start: Date;
  end: Date;
  offset: number; // in hours
  description: string;
}

const VIETNAM_TIMEZONE_HISTORY: TimezonePeriod[] = [
  { start: new Date('1900-01-01'), end: new Date('1942-12-31T23:59:59'), offset: 7, description: 'Giờ chuẩn Đông Dương' },
  { start: new Date('1943-01-01'), end: new Date('1945-03-14T23:59:59'), offset: 8, description: 'Ảnh hưởng Nhật Bản' },
  { start: new Date('1945-03-15'), end: new Date('1945-09-08T23:59:59'), offset: 9, description: 'Nhật Bản chiếm đóng' },
  { start: new Date('1945-09-09'), end: new Date('1954-12-31T23:59:59'), offset: 7, description: 'Sau cách mạng tháng 8' },
  { start: new Date('1955-01-01'), end: new Date('1959-12-31T23:59:59'), offset: 7, description: 'Hiệp định Genève' },
  // Miền Nam 1960-1975 là GMT+8, Miền Bắc là GMT+7. 
  // Ở đây ta mặc định theo logic phổ biến hoặc cần user chọn vùng, nhưng tạm thời ưu tiên hiệu chỉnh cho Miền Nam vì hay sai lệch nhất.
  { start: new Date('1960-01-01'), end: new Date('1975-06-12T23:59:59'), offset: 8, description: 'Miền Nam (GMT+8)' },
  { start: new Date('1975-06-13'), end: new Date('2100-12-31'), offset: 7, description: 'Thống nhất toàn quốc' },
];

export function getHistoricalOffset(date: Date, isNorth: boolean = false): number {
  // Nếu là Miền Bắc giai đoạn 1960-1975 thì là GMT+7
  if (isNorth && date >= new Date('1960-01-01') && date <= new Date('1975-06-12')) {
    return 7;
  }

  const period = VIETNAM_TIMEZONE_HISTORY.find(p => date >= p.start && date <= p.end);
  return period ? period.offset : 7;
}

/**
 * Hiệu chỉnh giờ sinh về GMT+7 (Giờ chuẩn Tử Vi Việt Nam hiện đại)
 */
export function adjustToStandardTime(birthDate: Date, birthHour: number, isNorth: boolean = false): { adjustedDate: Date, adjustedHour: number } {
  const currentOffset = getHistoricalOffset(birthDate, isNorth);
  const diff = 7 - currentOffset; // So với GMT+7
  
  const adjustedDate = new Date(birthDate);
  let adjustedHour = birthHour + diff;

  if (adjustedHour < 0) {
    adjustedHour += 24;
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  } else if (adjustedHour >= 24) {
    adjustedHour -= 24;
    adjustedDate.setDate(adjustedDate.getDate() + 1);
  }

  return { adjustedDate, adjustedHour };
}
