const GAN_MAP: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý'
};

const ZHI_MAP: Record<string, string> = {
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
  '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi'
};

const YI_JI_MAP: Record<string, string> = {
  '祭祀': 'Tế tự', '祈福': 'Cầu phúc', '求嗣': 'Cầu tự', '开光': 'Khai quang',
  '塑绘': 'Tô vẽ', '斋醮': 'Chay tiếu', '订盟': 'Đính hôn', '纳采': 'Nạp thái',
  '嫁娶': 'Cưới hỏi', '进人口': 'Thêm người', '纳财': 'Nạp tài', '开市': 'Khai trương',
  '立券': 'Lập khế ước', '交易': 'Giao dịch', '纳畜': 'Nạp súc', '牧养': 'Chăn nuôi',
  '会亲友': 'Hội họp', '出行': 'Xuất hành', '上梁': 'Thượng lương', '修造': 'Sửa chữa',
  '动土': 'Động thổ', '安床': 'An sàng', '安葬': 'An táng', '破土': 'Phá thổ',
  '启攒': 'Cải táng', '除服': 'Xả tang', '成服': 'Mặc tang', '移徙': 'Dời chỗ',
  '入宅': 'Vào nhà mới', '安门': 'Lắp cửa', '修坟': 'Sửa mộ', '行丧': 'Tổ chức tang lễ',
  '伐木': 'Chặt cây', '作灶': 'Làm bếp', '做灶': 'Làm bếp', '掘井': 'Đào giếng',
  '栽种': 'Trồng trọt', '理发': 'Cắt tóc', '沐浴': 'Tắm gội', '整手足甲': 'Cắt móng tay chân',
  '解除': 'Giải trừ', '扫舍': 'Quét dọn', '开柱眼': 'Mở cửa', '谢土': 'Tạ thổ',
  '入殓': 'Nhập liệm', '移柩': 'Di quan', '破屋': 'Phá nhà', '坏垣': 'Dỡ tường',
  '求医': 'Khám bệnh', '治病': 'Chữa bệnh', '针灸': 'Châm cứu', '拆卸': 'Tháo dỡ',
  '合帐': 'Làm màn', '冠笄': 'Lễ trưởng thành', '经络': 'Thông mạch', '酝酿': 'Ủ rượu',
  '塞穴': 'Lấp hang', '结网': 'Đan lưới', '畋猎': 'Săn bắn', '取渔': 'Đánh cá',
  '立碑': 'Lập bia', '捕捉': 'Bắt bớ', '裁衣': 'May mặc', '安機械': 'Lắp máy móc',
  '安机械': 'Lắp máy móc', '造仓': 'Làm kho', '开仓': 'Mở kho', '出货财': 'Xuất hàng',
  '修饰垣墙': 'Sửa tường', '平治道涂': 'Làm đường', '修门': 'Sửa cửa',
  '余事勿取': 'Việc khác chớ làm', '诸事不宜': 'Trăm sự đều kỵ', '诸事宜': 'Trăm sự đều tốt',
  '补垣': 'Vá tường', '挂匾': 'Treo biển', '架马': 'Bắc giàn', '作梁': 'Làm xà',
  '开生坟': 'Làm mộ chờ', '合寿木': 'Đóng quan tài', '分居': 'Chia nhà',
  '竖柱': 'Dựng cột', '开渠': 'Khơi mương', '穿井': 'Đào giếng', '筑堤': 'Đắp đê',
  '造车器': 'Làm xe cộ', '问名': 'Hỏi tên', '纳吉': 'Nạp cát', '纳征': 'Nạp trưng',
  '请期': 'Hẹn ngày', '亲迎': 'Rước dâu', '置产': 'Mua nhà đất', '酬神': 'Đền tạ',
  '割蜜': 'Khai mật'
};

const NA_YIN_MAP: Record<string, string> = {
  '海中金': 'Hải Trung Kim', '炉中火': 'Lư Trung Hỏa', '大林木': 'Đại Lâm Mộc',
  '路旁土': 'Lộ Bàng Thổ', '剑锋金': 'Kiếm Phong Kim', '山头火': 'Sơn Đầu Hỏa',
  '涧下水': 'Giản Hạ Thủy', '城头土': 'Thành Đầu Thổ', '白蜡金': 'Bạch Lạp Kim',
  '杨柳木': 'Dương Liễu Mộc', '泉中水': 'Tuyền Trung Thủy', '屋上土': 'Ốc Thượng Thổ',
  '霹雳火': 'Tích Lịch Hỏa', '松柏木': 'Tùng Bách Mộc', '长流水': 'Trường Lưu Thủy',
  '沙中金': 'Sa Trung Kim', '山下火': 'Sơn Hạ Hỏa', '平地木': 'Bình Địa Mộc',
  '壁上土': 'Bích Thượng Thổ', '金箔金': 'Kim Bạch Kim', '覆灯火': 'Phúc Đăng Hỏa',
  '天河水': 'Thiên Hà Thủy', '大驿土': 'Đại Trạch Thổ', '钗钏金': 'Thoa Xuyến Kim',
  '桑柘木': 'Tang Đố Mộc', '大溪水': 'Đại Khê Thủy', '沙中土': 'Sa Trung Thổ',
  '天上火': 'Thiên Thượng Hỏa', '石榴木': 'Thạch Lựu Mộc', '大海水': 'Đại Hải Thủy'
};

export function translateGanZhi(ganZhi: string): string {
  if (!ganZhi) return '';
  let result = [];
  for (const char of ganZhi) {
    result.push(GAN_MAP[char] || ZHI_MAP[char] || char);
  }
  return result.join(' ');
}

export function translateYiJi(term: string): string {
  return YI_JI_MAP[term] || term;
}

export function translateJieQi(term: string): string {
  const JIE_QI_MAP: Record<string, string> = {
    '立春': 'Lập Xuân', '雨水': 'Vũ Thủy', '惊蛰': 'Kinh Trập', '春分': 'Xuân Phân',
    '清明': 'Thanh Minh', '谷雨': 'Cốc Vũ', '立夏': 'Lập Hạ', '小满': 'Tiểu Mãn',
    '芒种': 'Mang Chủng', '夏至': 'Hạ Chí', '小暑': 'Tiểu Thử', '大暑': 'Đại Thử',
    '立秋': 'Lập Thu', '处暑': 'Xử Thử', '白露': 'Bạch Lộ', '秋分': 'Thu Phân',
    '寒露': 'Hàn Lộ', '霜降': 'Sương Giáng', '立冬': 'Lập Đông', '小雪': 'Tiểu Tuyết',
    '大雪': 'Đại Tuyết', '冬至': 'Đông Chí', '小寒': 'Tiểu Hàn', '大寒': 'Đại Hàn'
  };
  return JIE_QI_MAP[term] || term;
}

export function translateZodiac(term: string): string {
  const ZODIAC_MAP: Record<string, string> = {
    '青龙': 'Thanh Long', '明堂': 'Minh Đường', '天刑': 'Thiên Hình', '朱雀': 'Chu Tước',
    '金匮': 'Kim Quỹ', '天德': 'Thiên Đức', '白虎': 'Bạch Hổ', '玉堂': 'Ngọc Đường',
    '天牢': 'Thiên Lao', '玄武': 'Huyền Vũ', '司命': 'Tư Mệnh', '勾陈': 'Câu Trận'
  };
  return ZODIAC_MAP[term] || term;
}

export function translateNaYin(term: string): string {
  return NA_YIN_MAP[term] || term;
}
