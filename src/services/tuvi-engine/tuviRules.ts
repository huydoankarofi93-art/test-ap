import { TuViChart } from "./tuviChart";

export interface TuViInsight {
  category: string;
  feature: string;
  insight: string;
}

export function analyzeTuVi(chart: TuViChart): TuViInsight[] {
  const insights: TuViInsight[] = [];

  // 1. Mệnh (Self)
  const menhStars = chart.stars["Mệnh"] || [];
  if (menhStars.length === 0) {
    insights.push({
      category: "Mệnh cục",
      feature: "Vô Chính Diệu",
      insight: "Mệnh vô chính diệu, cuộc đời linh hoạt, dễ thích nghi nhưng cũng dễ thay đổi môi trường, cần nương tựa vào các sao xung chiếu."
    });
  }

  // 2. Quan Lộc (Career)
  const quanLocStars = chart.stars["Quan Lộc"] || [];
  const hasDiaKhong = quanLocStars.includes("Địa Không");
  const hasDiaKiep = quanLocStars.includes("Địa Kiếp");
  if (hasDiaKhong && hasDiaKiep) {
    insights.push({
      category: "Sự nghiệp",
      feature: "Địa Không + Địa Kiếp",
      insight: "Cung Quan Lộc có Không Kiếp, sự nghiệp dễ có những biến động bất ngờ, thăng trầm thất thường, nên làm các nghề tự do hoặc sáng tạo."
    });
  }

  // 3. Tài Bạch (Wealth)
  const taiBachStars = chart.stars["Tài Bạch"] || [];
  if (taiBachStars.includes("Lộc Tồn") || taiBachStars.includes("Hóa Lộc")) {
    insights.push({
      category: "Tài lộc",
      feature: "Lộc Tồn/Hóa Lộc",
      insight: "Cung Tài Bạch có sao lộc, chủ về tiền bạc dồi dào, có duyên với kinh doanh hoặc được hưởng lộc từ tổ nghiệp."
    });
  }
  if (taiBachStars.includes("Thiên Đồng") && taiBachStars.includes("Cự Môn")) {
    insights.push({
      category: "Tài lộc",
      feature: "Thiên Đồng + Cự Môn",
      insight: "Tài bạch có Đồng Cự, tiền bạc lúc đầu khó khăn, sau mới hanh thông, thường phải vất vả mới có được."
    });
  }

  // 4. Phu Thê (Marriage)
  const phuTheStars = chart.stars["Phu Thê"] || [];
  if (phuTheStars.includes("Cô Thần") || phuTheStars.includes("Quả Tú")) {
    insights.push({
      category: "Hôn nhân",
      feature: "Cô Thần/Quả Tú",
      insight: "Cung Phu Thê có Cô Quả, chủ về sự cô đơn trong tình cảm hoặc kết hôn muộn, vợ chồng đôi khi thiếu sự thấu hiểu."
    });
  }

  // 4. Đại Vận (Current Life Phase)
  // Finding current Dai Van
  const currentYear = new Date().getFullYear();
  const age = currentYear - chart.solarDate.year + 1;
  let currentDaiVanPalace = "";
  for (const [palace, startAge] of Object.entries(chart.daiHan)) {
    if (age >= startAge && age < startAge + 10) {
      currentDaiVanPalace = palace;
      break;
    }
  }

  if (currentDaiVanPalace) {
    const truongSinhAtPalace = chart.truongSinh[currentDaiVanPalace];
    if (truongSinhAtPalace === "Đế Vượng") {
      insights.push({
        category: "Đại vận",
        feature: "Đế Vượng",
        insight: "Đang ở đại vận Đế Vượng, đây là giai đoạn cực thịnh, năng lượng dồi dào, thuận lợi cho việc bứt phá và khẳng định vị thế."
      });
    } else if (truongSinhAtPalace === "Tuyệt") {
      insights.push({
        category: "Đại vận",
        feature: "Tuyệt",
        insight: "Đại vận rơi vào cung Tuyệt, cần cẩn trọng trong các quyết định lớn, nên giữ gìn sức khỏe và tránh đầu tư mạo hiểm."
      });
    }
  }

  // 5. Ngũ Hành (Elements)
  // Simplified logic for elements based on Ban Menh
  insights.push({
    category: "Bản mệnh",
    feature: chart.banMenh,
    insight: `Bản mệnh ${chart.banMenh}, cần chú ý các yếu tố tương sinh tương khắc trong cuộc sống hàng ngày.`
  });

  return insights;
}

export function extractKeyFeatures(chart: TuViChart): any {
  return {
    name: chart.fullName,
    gender: chart.gender,
    age: chart.age,
    yinYang: chart.yinYang,
    banMenh: chart.banMenh,
    menhPalace: chart.menh,
    palaces: Object.entries(chart.palaces).reduce((acc, [name, chi]) => {
      acc[name] = {
        chi,
        stars: chart.stars[name] || [],
        truongSinh: chart.truongSinh[chi]
      };
      return acc;
    }, {} as any),
    insights: analyzeTuVi(chart)
  };
}
