import { Solar, Lunar } from 'lunar-typescript';

export interface Hexagram {
  number: number;
  name: string;
  meaning: string;
  description: string;
  tuongTinh?: {
    char: string;
    animal: string;
  };
  analysis: {
    career: string;
    health: string;
    family: string;
    wealth: string;
    children: string;
    fame: string;
    todo: string;
    avoid: string;
  };
}

export const HEXAGRAMS: Record<number, Hexagram> = {
  1: { 
    number: 1, name: "Thuần Càn", meaning: "Trời", description: "Cương kiện, hanh thông. Thời điểm khởi đầu đại cát.", 
    tuongTinh: { char: "龍", animal: "Rồng (Long)" },
    analysis: {
      career: "Sự nghiệp đang ở thời kỳ hưng thịnh, có nhiều cơ hội thăng tiến lớn. Khả năng lãnh đạo được phát huy tối đa.",
      health: "Sức khỏe dồi dào, tinh thần phấn chấn. Tuy nhiên cần chú ý các bệnh về đầu và huyết áp do làm việc quá sức.",
      family: "Gia đạo yên vui, có tôn ti trật tự. Người cha hoặc người trụ cột có vai trò quan trọng.",
      wealth: "Tài lộc dồi dào, đầu tư có lãi lớn. Tiền bạc hanh thông, không lo thiếu thốn.",
      children: "Con cái thông minh, có chí tiến thủ, sau này dễ thành đạt và có địa vị xã hội.",
      fame: "Công danh rạng rỡ, được nhiều người nể trọng. Tiếng tăm vang xa.",
      todo: "Nên quyết đoán, tự tin thực hiện các kế hoạch lớn. Giữ vững chính đạo.",
      avoid: "Tránh kiêu ngạo, độc đoán. Không nên coi thường người khác khi đang ở đỉnh cao."
    }
  },
  2: { 
    number: 2, name: "Thuần Khôn", meaning: "Đất", description: "Nhu thuận, bao dung. Nên kiên trì, theo sau người dẫn dắt.", 
    tuongTinh: { char: "牛", animal: "Trâu (Ngưu)" },
    analysis: {
      career: "Phù hợp với vai trò hỗ trợ, thực thi hơn là dẫn đầu. Sự kiên trì và nhu thuận sẽ mang lại thành công.",
      health: "Sức khỏe ổn định nhưng cần chú ý hệ tiêu hóa và các bệnh mãn tính.",
      family: "Gia đình hòa thuận, ấm êm. Người mẹ có vai trò giữ lửa và kết nối các thành viên.",
      wealth: "Tiền bạc ổn định, tích lũy dần dần. Không nên mạo hiểm đầu tư lớn vào lúc này.",
      children: "Con cái hiếu thảo, ngoan ngoãn, biết vâng lời cha mẹ.",
      fame: "Công danh bình ổn, được đồng nghiệp tin tưởng nhờ sự tận tụy và khiêm nhường.",
      todo: "Nên kiên nhẫn, lắng nghe ý kiến người khác. Làm việc thiện tích đức.",
      avoid: "Tránh tranh giành vị trí dẫn đầu. Không nên nóng nảy hay cưỡng cầu kết quả nhanh chóng."
    }
  },
  3: { 
    number: 3, name: "Thủy Lôi Truân", meaning: "Gian nan", description: "Vạn sự khởi đầu nan. Cần kiên nhẫn tích lũy nội lực.", 
    tuongTinh: { char: "豬", animal: "Lợn (Trư)" },
    analysis: {
      career: "Giai đoạn đầu khó khăn, nhiều trắc trở. Cần tìm người giúp đỡ hoặc cố vấn có kinh nghiệm.",
      health: "Cảm thấy mệt mỏi, áp lực. Chú ý các bệnh về thận hoặc hệ thần kinh.",
      family: "Gia đạo có chút xáo trộn, cần sự thấu hiểu và kiên nhẫn để giải quyết mâu thuẫn.",
      wealth: "Tiền bạc eo hẹp, chi tiêu cần tính toán kỹ. Chưa phải lúc để bung vốn kinh doanh.",
      children: "Con cái cần được quan tâm, định hướng kỹ lưỡng vì đang trong giai đoạn hình thành nhân cách.",
      fame: "Công danh chưa rõ ràng, còn nhiều mây mờ che phủ. Cần thời gian để khẳng định mình.",
      todo: "Nên giữ vững ý chí, tích lũy kiến thức và tìm kiếm sự hỗ trợ từ quý nhân.",
      avoid: "Tránh nôn nóng, bỏ cuộc giữa chừng. Không nên mạo hiểm khi chưa hiểu rõ vấn đề."
    }
  },
  4: { 
    number: 4, name: "Sơn Thủy Mông", meaning: "Non nớt", description: "Cần học hỏi, tìm kiếm sự chỉ dẫn từ người đi trước.", 
    tuongTinh: { char: "狗", animal: "Chó (Cẩu)" },
    analysis: {
      career: "Còn thiếu kinh nghiệm, dễ mắc sai lầm. Cần tìm thầy giỏi để học hỏi và rèn luyện thêm.",
      health: "Sức khỏe bình thường nhưng tinh thần đôi khi hoang mang, thiếu định hướng.",
      family: "Con cái hoặc thành viên trẻ trong nhà cần được giáo dục nghiêm túc và đúng phương pháp.",
      wealth: "Tiền bạc ở mức trung bình. Dễ bị lừa gạt do thiếu hiểu biết về tài chính.",
      children: "Con cái đang tuổi ăn tuổi học, cần sự nghiêm khắc và yêu thương đúng mực.",
      fame: "Công danh còn mờ nhạt. Cần khiêm tốn học hỏi để xây dựng nền tảng vững chắc.",
      todo: "Nên cầu học, lắng nghe lời khuyên của bậc tiền bối. Giữ tâm thế cầu thị.",
      avoid: "Tránh tự phụ, cho rằng mình đã biết hết. Không nên lặp lại những sai lầm cũ."
    }
  },
  5: { 
    number: 5, name: "Thủy Thiên Nhu", meaning: "Chờ đợi", description: "Thời cơ chưa tới. Hãy kiên nhẫn, chuẩn bị kỹ lưỡng.", 
    tuongTinh: { char: "鼠", animal: "Chuột (Thử)" },
    analysis: {
      career: "Đang ở thế chờ đợi thời cơ. Không nên vội vàng nhảy việc hay triển khai dự án mới.",
      health: "Cần nghỉ ngơi, bồi bổ cơ thể. Chú ý các bệnh về máu hoặc hệ tuần hoàn.",
      family: "Gia đình cần sự bình tĩnh, cùng nhau chờ đợi tin vui hoặc giải quyết vấn đề tồn đọng.",
      wealth: "Tiền bạc ổn định nhưng chưa có sự đột phá. Nên tiết kiệm để chuẩn bị cho kế hoạch lớn.",
      children: "Con cái cần được dạy tính kiên nhẫn và biết chờ đợi thành quả từ sự nỗ lực.",
      fame: "Công danh đang bị trì hoãn. Hãy coi đây là thời gian để rèn luyện bản lĩnh.",
      todo: "Nên thư giãn, giữ tinh thần lạc quan và chuẩn bị mọi nguồn lực sẵn sàng.",
      avoid: "Tránh nôn nóng, làm liều. Không nên lo lắng thái quá về tương lai."
    }
  },
  6: { 
    number: 6, name: "Thiên Thủy Tụng", meaning: "Tranh chấp", description: "Dễ xảy ra bất hòa. Nên nhường nhịn, tránh kiện tụng.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Dễ xảy ra tranh chấp quyền lợi, bất đồng với cấp trên hoặc đồng nghiệp. Công việc bị đình trệ.",
      health: "Căng thẳng thần kinh, dễ mất ngủ. Chú ý các bệnh do stress gây ra.",
      family: "Gia đạo bất hòa, lời qua tiếng lại. Cần sự bao dung để tránh đổ vỡ.",
      wealth: "Tiền bạc dễ bị hao tổn do kiện tụng hoặc tranh chấp. Không nên cho vay mượn lúc này.",
      children: "Con cái dễ bướng bỉnh, khó bảo. Cần dùng tình cảm để cảm hóa thay vì dùng bạo lực.",
      fame: "Công danh bị ảnh hưởng bởi điều tiếng, thị phi. Uy tín giảm sút.",
      todo: "Nên nhường nhịn, tìm kiếm sự hòa giải. Xem lại bản thân trước khi trách người.",
      avoid: "Tránh đối đầu gay gắt, kiện tụng kéo dài. Không nên bảo thủ ý kiến cá nhân."
    }
  },
  7: { 
    number: 7, name: "Địa Thủy Sư", meaning: "Quân đội", description: "Cần sự kỷ luật, đoàn kết và người lãnh đạo tài ba.", 
    tuongTinh: { char: "馬", animal: "Ngựa (Mã)" },
    analysis: {
      career: "Công việc đòi hỏi sự tổ chức, kỷ luật cao. Có khả năng điều hành đám đông hoặc quản lý dự án lớn.",
      health: "Sức khỏe tốt nhưng cần chú ý các chấn thương do vận động hoặc tai nạn nghề nghiệp.",
      family: "Gia đình cần có quy tắc, nề nếp. Sự nghiêm khắc của người trụ cột giúp gia đình ổn định.",
      wealth: "Tiền bạc đến từ các công việc có tính tổ chức hoặc kinh doanh theo hệ thống.",
      children: "Con cái có tính kỷ luật, sau này dễ thành công trong môi trường quân đội hoặc quản lý.",
      fame: "Công danh thăng tiến nhờ khả năng lãnh đạo và sự quyết đoán.",
      todo: "Nên giữ kỷ luật, đoàn kết mọi người và tin tưởng vào người dẫn dắt tài đức.",
      avoid: "Tránh lạm quyền, độc đoán. Không nên gây chia rẽ nội bộ."
    }
  },
  8: { 
    number: 8, name: "Thủy Địa Tỷ", meaning: "Gắn kết", description: "Hợp tác, tương trợ. Tìm kiếm đồng minh cùng chí hướng.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Thời điểm tốt để hợp tác, liên kết kinh doanh. Sự hỗ trợ từ đồng nghiệp mang lại thành công lớn.",
      health: "Sức khỏe tốt, tinh thần vui vẻ nhờ các mối quan hệ xã hội tốt đẹp.",
      family: "Gia đình sum vầy, hòa thuận. Anh em, họ hàng tương trợ lẫn nhau.",
      wealth: "Tiền bạc hanh thông nhờ sự hợp tác. Có lộc từ bạn bè hoặc đối tác.",
      children: "Con cái hòa đồng, có nhiều bạn tốt và được mọi người yêu mến.",
      fame: "Công danh rộng mở nhờ sự ủng hộ của đám đông và uy tín cá nhân.",
      todo: "Nên mở lòng hợp tác, tìm kiếm những người cùng chí hướng để cùng phát triển.",
      avoid: "Tránh sống cô độc, ích kỷ. Không nên nghi ngờ lòng tốt của người khác vô căn cứ."
    }
  },
  9: { 
    number: 9, name: "Phong Thiên Tiểu Súc", meaning: "Tích lũy nhỏ", description: "Sức mạnh còn yếu. Nên tích tiểu thành đại, chờ thời.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Công việc có tiến triển nhưng chậm. Chưa thể thực hiện những thay đổi lớn hay bứt phá.",
      health: "Sức khỏe ổn định nhưng cần chú ý các bệnh về đường hô hấp hoặc dị ứng thời tiết.",
      family: "Gia đạo bình an, có những niềm vui nhỏ. Cần sự nhẫn nại trong giao tiếp vợ chồng.",
      wealth: "Tiền bạc tích lũy được từng chút một. Không nên mong cầu giàu sang nhanh chóng.",
      children: "Con cái ngoan nhưng đôi khi thiếu quyết đoán, cần được rèn luyện bản lĩnh.",
      fame: "Công danh ở mức trung bình, đang trong giai đoạn xây dựng uy tín.",
      todo: "Nên kiên trì tích lũy, làm tốt những việc nhỏ trước mắt. Giữ thái độ hòa nhã.",
      avoid: "Tránh nóng vội, phô trương thanh thế khi thực lực chưa đủ. Không nên tham lớn."
    }
  },
  10: { 
    number: 10, name: "Thiên Trạch Lý", meaning: "Lễ nghĩa", description: "Cẩn trọng trong hành xử. Đi trên băng mỏng, cần khéo léo.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Môi trường làm việc đầy rẫy hiểm nguy hoặc áp lực từ cấp trên. Cần khéo léo trong ứng xử.",
      health: "Cảm thấy bất an, lo lắng. Chú ý các bệnh về tim mạch hoặc huyết áp.",
      family: "Gia đình cần giữ lễ nghĩa, kính trên nhường dưới để tránh xung đột không đáng có.",
      wealth: "Tiền bạc có nhưng khó giữ. Cần cẩn trọng trong các giao dịch tài chính lớn.",
      children: "Con cái cần được dạy về lễ nghĩa và cách đối nhân xử thế khôn ngoan.",
      fame: "Công danh có sự thăng tiến nhưng đi kèm với nhiều rủi ro. Cần giữ mình trong sạch.",
      todo: "Nên cẩn trọng trong lời nói và hành động. Giữ đúng lễ nghĩa và đạo đức nghề nghiệp.",
      avoid: "Tránh kiêu ngạo, thách thức người có quyền thế. Không nên làm việc khuất tất."
    }
  },
  11: { 
    number: 11, name: "Địa Thiên Thái", meaning: "Thịnh vượng", description: "Trời đất giao hòa. Vạn sự hanh thông, đại cát đại lợi.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Sự nghiệp thăng tiến rực rỡ, mọi việc đều thuận lợi. Có sự hỗ trợ từ cấp trên và sự đồng lòng của cấp dưới.",
      health: "Sức khỏe dồi dào, tinh thần sảng khoái. Vạn sự như ý giúp tâm trạng luôn vui vẻ.",
      family: "Gia đình hạnh phúc, con cái hiếu thảo. Mọi mâu thuẫn đều được hóa giải.",
      wealth: "Tài lộc dồi dào, tiền bạc tự tìm đến. Đầu tư kinh doanh đều mang lại lợi nhuận cao.",
      children: "Con cái thành đạt, mang lại niềm tự hào cho gia đình.",
      fame: "Công danh rạng rỡ, uy tín vang xa. Được mọi người kính trọng.",
      todo: "Nên tranh thủ thời cơ để thực hiện các kế hoạch lớn. Giúp đỡ người khác để tích phúc.",
      avoid: "Tránh chủ quan, lãng phí. Không nên quên đi những lúc khó khăn mà sinh ra kiêu ngạo."
    }
  },
  12: { 
    number: 12, name: "Thiên Địa Bỉ", meaning: "Bế tắc", description: "Âm dương cách trở. Nên thu mình, giữ vững đạo đức.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Công việc gặp nhiều bế tắc, tiểu nhân quấy phá. Mọi kế hoạch đều khó thành hiện thực.",
      health: "Sức khỏe suy giảm, dễ mắc các bệnh về tiêu hóa hoặc tâm bệnh do lo âu.",
      family: "Gia đạo bất hòa, các thành viên thiếu sự thấu hiểu. Dễ xảy ra ly tán hoặc xa cách.",
      wealth: "Tiền bạc khó khăn, dễ bị hao tài tốn của. Nên thắt chặt chi tiêu.",
      children: "Con cái gặp trắc trở trong học hành hoặc cuộc sống. Cần sự kiên nhẫn đồng hành.",
      fame: "Công danh mờ mịt, uy tín bị ảnh hưởng bởi những lời đồn thổi ác ý.",
      todo: "Nên ẩn mình chờ thời, giữ vững đạo đức. Kiên nhẫn vượt qua giai đoạn khó khăn.",
      avoid: "Tránh tranh chấp, làm liều. Không nên tin tưởng quá mức vào người lạ."
    }
  },
  13: { 
    number: 13, name: "Thiên Hỏa Đồng Nhân", meaning: "Hòa đồng", description: "Đoàn kết là sức mạnh. Mở lòng hợp tác với mọi người.", 
    tuongTinh: { char: "騾", animal: "Lừa (La)" },
    analysis: {
      career: "Thành công nhờ sự đoàn kết và hợp tác. Phù hợp với các công việc cộng đồng hoặc làm việc nhóm.",
      health: "Sức khỏe tốt, tinh thần lạc quan nhờ sự kết nối với mọi người xung quanh.",
      family: "Gia đình hòa thuận, anh em đoàn kết. Có sự tương trợ lẫn nhau giữa các thành viên.",
      wealth: "Tiền bạc ổn định, có lộc từ các dự án chung hoặc sự giúp đỡ của bạn bè.",
      children: "Con cái hòa đồng, có khả năng giao tiếp tốt và được nhiều người yêu mến.",
      fame: "Công danh thăng tiến nhờ sự ủng hộ của tập thể và uy tín cá nhân.",
      todo: "Nên mở rộng các mối quan hệ, làm việc nhóm và giữ thái độ công bằng, chính trực.",
      avoid: "Tránh chia rẽ, ích kỷ. Không nên làm việc đơn độc khi cần sự phối hợp."
    }
  },
  14: { 
    number: 14, name: "Hỏa Thiên Đại Hữu", meaning: "Sở hữu lớn", description: "Thời kỳ sung túc. Nên khiêm tốn, chia sẻ thành quả.", 
    tuongTinh: { char: "雞", animal: "Gà (Kê)" },
    analysis: {
      career: "Sự nghiệp đạt đến đỉnh cao, nắm giữ vị trí quan trọng. Có quyền lực và tầm ảnh hưởng lớn.",
      health: "Sức khỏe dồi dào nhưng cần chú ý các bệnh về mắt hoặc hệ thần kinh do làm việc cường độ cao.",
      family: "Gia đình sung túc, giàu sang. Con cái được hưởng nền giáo dục tốt nhất.",
      wealth: "Tài sản dồi dào, tiền bạc dư dả. Có nhiều nguồn thu nhập lớn.",
      children: "Con cái thông minh, có khí chất lãnh đạo và dễ đạt được thành công lớn.",
      fame: "Công danh rạng rỡ, được xã hội công nhận và kính nể.",
      todo: "Nên khiêm tốn, dùng tài sản làm việc thiện. Giúp đỡ những người khó khăn hơn.",
      avoid: "Tránh kiêu căng, xa hoa lãng phí. Không nên cậy thế ép người."
    }
  },
  15: { 
    number: 15, name: "Địa Sơn Khiêm", meaning: "Khiêm tốn", description: "Lùi một bước tiến ba bước. Khiêm nhường mang lại phúc đức.", 
    tuongTinh: { char: "鼠", animal: "Chuột (Thử)" },
    analysis: {
      career: "Thành công bền vững nhờ thái độ khiêm tốn. Được cấp trên tin tưởng và cấp dưới kính trọng.",
      health: "Sức khỏe ổn định, tâm hồn thanh thản. Ít gặp áp lực tinh thần.",
      family: "Gia đạo yên vui nhờ sự nhường nhịn và thấu hiểu giữa các thành viên.",
      wealth: "Tiền bạc ổn định, tích lũy vững chắc. Không có sự đột biến nhưng rất bền lâu.",
      children: "Con cái ngoan ngoãn, hiếu thảo và có đức tính khiêm nhường.",
      fame: "Công danh thầm lặng nhưng vững chắc. Uy tín được xây dựng từ thực lực.",
      todo: "Nên giữ thái độ khiêm tốn trong mọi việc. Làm việc thiện một cách âm thầm.",
      avoid: "Tránh phô trương, tự mãn. Không nên tranh giành hào quang với người khác."
    }
  },
  16: { 
    number: 16, name: "Lôi Địa Dự", meaning: "Vui vẻ", description: "Hào hứng, chuẩn bị. Nên lập kế hoạch rõ ràng cho tương lai.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Công việc có nhiều niềm vui và sự hứng khởi. Phù hợp với các lĩnh vực nghệ thuật, giải trí.",
      health: "Tinh thần phấn chấn giúp sức khỏe cải thiện. Tuy nhiên cần tránh vui chơi quá đà.",
      family: "Gia đình tràn ngập tiếng cười, có nhiều buổi tụ họp, tiệc tùng vui vẻ.",
      wealth: "Tiền bạc hanh thông, có lộc bất ngờ. Tuy nhiên dễ chi tiêu hoang phí vào việc vui chơi.",
      children: "Con cái năng động, có năng khiếu nghệ thuật và mang lại niềm vui cho cha mẹ.",
      fame: "Công danh thăng tiến nhờ sự nhiệt huyết và khả năng truyền cảm hứng.",
      todo: "Nên lập kế hoạch chi tiết cho tương lai. Tận hưởng niềm vui nhưng không quên nhiệm vụ.",
      avoid: "Tránh ham vui quên mình, lười biếng. Không nên chủ quan trước những dấu hiệu bất ổn."
    }
  },
  17: { 
    number: 17, name: "Trạch Lôi Tùy", meaning: "Thuận theo", description: "Tùy cơ ứng biến. Thuận theo tự nhiên sẽ gặp may mắn.", 
    tuongTinh: { char: "馬", animal: "Ngựa (Mã)" },
    analysis: {
      career: "Thành công nhờ biết lắng nghe và đi theo người dẫn đường giỏi. Tùy cơ ứng biến với thị trường.",
      health: "Sức khỏe bình thường nhưng cần chú ý các bệnh về chân hoặc hệ vận động.",
      family: "Gia đình hòa thuận nhờ biết lắng nghe và tôn trọng ý kiến của nhau.",
      wealth: "Tiền bạc ổn định, có lộc từ việc đi theo xu hướng hoặc hợp tác với người mạnh hơn.",
      children: "Con cái biết vâng lời, dễ thích nghi với môi trường mới.",
      fame: "Công danh thăng tiến nhờ sự linh hoạt và khả năng kết giao rộng rãi.",
      todo: "Nên thuận theo tự nhiên, lắng nghe ý kiến của bậc tiền bối. Giữ thái độ cầu thị.",
      avoid: "Tránh bảo thủ, cố chấp. Không nên cưỡng cầu những việc không thuộc về mình."
    }
  },
  18: { 
    number: 18, name: "Sơn Phong Cổ", meaning: "Sửa chữa", description: "Có sự hư hỏng cần chấn chỉnh. Dũng cảm thay đổi cái cũ.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc đang gặp vấn đề tồn đọng từ quá khứ. Cần dũng cảm cải tổ và thay đổi phương pháp.",
      health: "Chú ý các bệnh mãn tính hoặc di truyền. Cần thay đổi thói quen sinh hoạt xấu.",
      family: "Gia đạo có những mâu thuẫn ngầm cần được giải quyết triệt để. Chỉnh đốn nề nếp gia đình.",
      wealth: "Tiền bạc gặp khó khăn do những sai lầm cũ. Cần cơ cấu lại tài chính cá nhân.",
      children: "Con cái cần được uốn nắn kịp thời để tránh những thói hư tật xấu.",
      fame: "Công danh bị đình trệ do những sai sót trong quá khứ. Cần nỗ lực để lấy lại uy tín.",
      todo: "Nên dũng cảm đối mặt với sai lầm, sửa chữa những gì đã hỏng. Đổi mới tư duy.",
      avoid: "Tránh bao che lỗi lầm, lười thay đổi. Không nên để vấn đề kéo dài thêm."
    }
  },
  19: { 
    number: 19, name: "Địa Trạch Lâm", meaning: "Tiến đến", description: "Cơ hội đang tới gần. Cần hành động quyết đoán, kịp thời.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Cơ hội thăng tiến đang đến rất gần. Cần chủ động nắm bắt và thể hiện năng lực.",
      health: "Sức khỏe tốt, tràn đầy năng lượng để thực hiện các kế hoạch mới.",
      family: "Gia đình đón nhận tin vui, có sự gia tăng về thành viên hoặc tài sản.",
      wealth: "Tài lộc đang tăng trưởng, đầu tư bắt đầu có kết quả khả quan.",
      children: "Con cái có những bước tiến bộ vượt bậc trong học tập và cuộc sống.",
      fame: "Công danh rộng mở, uy tín ngày càng được củng cố.",
      todo: "Nên hành động quyết đoán, nắm bắt thời cơ. Giữ thái độ chân thành với mọi người.",
      avoid: "Tránh do dự, thiếu tự tin. Không nên để cơ hội trôi qua một cách đáng tiếc."
    }
  },
  20: { 
    number: 20, name: "Phong Địa Quan", meaning: "Quan sát", description: "Xem xét kỹ lưỡng trước khi hành động. Học hỏi từ thực tế.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Giai đoạn cần quan sát, học hỏi kinh nghiệm. Phù hợp với các công việc nghiên cứu, tư vấn.",
      health: "Sức khỏe ổn định nhưng cần chú ý các bệnh về thần kinh hoặc thị lực.",
      family: "Cần quan tâm đến tâm tư tình cảm của các thành viên. Làm gương cho con cái noi theo.",
      wealth: "Tiền bạc ở mức trung bình. Nên quan sát thị trường kỹ lưỡng trước khi đầu tư.",
      children: "Con cái có khả năng quan sát tốt, cần được định hướng để phát triển tư duy sâu sắc.",
      fame: "Công danh thăng tiến nhờ sự sáng suốt và tầm nhìn xa trông rộng.",
      todo: "Nên điềm tĩnh quan sát, học hỏi từ thực tế. Giữ tâm thế khách quan.",
      avoid: "Tránh hành động vội vàng khi chưa hiểu rõ vấn đề. Không nên phán xét hời hợt."
    }
  },
  21: { 
    number: 21, name: "Hỏa Lôi Phệ Hạp", meaning: "Cắn kết", description: "Vượt qua trở ngại. Cần sự công minh, quyết liệt xử lý.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc gặp nhiều trở ngại hoặc sự cạnh tranh không lành mạnh. Cần quyết liệt loại bỏ những nhân tố xấu.",
      health: "Chú ý các bệnh về răng miệng, họng hoặc hệ tiêu hóa. Cần sự can thiệp y tế dứt điểm.",
      family: "Gia đình có những hiểu lầm cần được làm sáng tỏ. Cần sự công bằng trong cách hành xử.",
      wealth: "Tiền bạc gặp khó khăn do các rào cản pháp lý hoặc tranh chấp. Cần giải quyết dứt điểm nợ nần.",
      children: "Con cái cần được rèn luyện tính trung thực và dũng cảm đối mặt với sai lầm.",
      fame: "Công danh thăng tiến sau khi vượt qua được những thử thách cam go.",
      todo: "Nên quyết đoán, công minh và dứt khoát trong mọi việc. Loại bỏ những gì cản trở.",
      avoid: "Tránh do dự, bao che cho cái xấu. Không nên để vấn đề tồn đọng quá lâu."
    }
  },
  22: { 
    number: 22, name: "Sơn Hỏa Bí", meaning: "Trang sức", description: "Vẻ ngoài hào nhoáng. Chú trọng thực chất bên trong hơn.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Công việc có vẻ ngoài tốt đẹp nhưng bên trong còn nhiều thiếu sót. Cần chú trọng vào chất lượng thực tế.",
      health: "Sức khỏe bình thường nhưng cần chú ý chăm sóc vẻ ngoài và tinh thần.",
      family: "Gia đình chú trọng lễ nghi, hình thức. Cần bồi đắp thêm tình cảm chân thành bên trong.",
      wealth: "Tiền bạc ổn định, có lộc từ các công việc liên quan đến thẩm mỹ, nghệ thuật.",
      children: "Con cái có năng khiếu nghệ thuật, ưa hình thức. Cần dạy trẻ biết quý trọng giá trị thực.",
      fame: "Công danh có sự khởi sắc nhờ hình ảnh cá nhân tốt. Cần bồi dưỡng thêm năng lực thực tế.",
      todo: "Nên chỉnh chu vẻ ngoài nhưng không quên trau dồi nội lực. Giữ thái độ hòa nhã.",
      avoid: "Tránh phô trương thái quá, sống ảo. Không nên đánh giá người khác qua vẻ bề ngoài."
    }
  },
  23: { 
    number: 23, name: "Sơn Địa Bác", meaning: "Tan rã", description: "Thế yếu, bị tiểu nhân hãm hại. Nên giữ mình, chờ qua hạn.", 
    tuongTinh: { char: "騾", animal: "Lừa (La)" },
    analysis: {
      career: "Sự nghiệp gặp vận hạn xấu, dễ bị sa thải hoặc mất chức. Tiểu nhân quấy phá khắp nơi.",
      health: "Sức khỏe suy kiệt, dễ mắc bệnh nặng. Cần nghỉ ngơi và điều trị tích cực.",
      family: "Gia đạo bất ổn, có sự rạn nứt hoặc phản bội. Cần bình tĩnh để giữ gìn những gì còn lại.",
      wealth: "Tiền bạc hao hụt nghiêm trọng. Tránh đầu tư hay cho vay mượn trong thời gian này.",
      children: "Con cái dễ bị lôi kéo vào những việc xấu. Cần sự giám sát chặt chẽ từ cha mẹ.",
      fame: "Công danh sụp đổ, uy tín bị hủy hoại. Cần nhẫn nhịn chờ thời cơ phục hồi.",
      todo: "Nên thu mình, giữ vững đạo đức và kiên nhẫn chờ đợi vận hạn qua đi.",
      avoid: "Tránh đối đầu trực tiếp với kẻ xấu. Không nên mạo hiểm làm bất cứ việc gì lớn."
    }
  },
  24: { 
    number: 24, name: "Địa Lôi Phục", meaning: "Hồi phục", description: "Ánh sáng trở lại. Khởi đầu mới sau thời kỳ tăm tối.", 
    tuongTinh: { char: "雞", animal: "Gà (Kê)" },
    analysis: {
      career: "Công việc bắt đầu có dấu hiệu khởi sắc trở lại sau thời gian đình trệ. Cơ hội mới đang mở ra.",
      health: "Sức khỏe dần hồi phục sau khi ốm đau. Tinh thần bắt đầu phấn chấn trở lại.",
      family: "Gia đình hòa giải được những mâu thuẫn cũ. Có sự sum họp hoặc tin vui về người thân.",
      wealth: "Tiền bạc bắt đầu lưu thông trở lại. Có những nguồn thu nhỏ nhưng ổn định.",
      children: "Con cái có sự tiến bộ, bắt đầu nhận ra lỗi lầm và sửa đổi.",
      fame: "Công danh bắt đầu được khôi phục. Uy tín dần được lấy lại.",
      todo: "Nên bắt đầu các kế hoạch mới một cách thận trọng. Giữ tâm thế lạc quan.",
      avoid: "Tránh nóng vội, làm quá sức ngay lập tức. Không nên lặp lại những thói quen xấu cũ."
    }
  },
  25: { 
    number: 25, name: "Thiên Lôi Vô Vọng", meaning: "Chân thực", description: "Sống đúng với lương tâm. Tránh tham vọng phi thực tế.", 
    tuongTinh: { char: "鼠", animal: "Chuột (Thử)" },
    analysis: {
      career: "Công việc cần sự chân thực, không nên dùng thủ đoạn. Thành công đến từ sự nỗ lực tự nhiên.",
      health: "Sức khỏe ổn định nếu sống điều độ. Tránh những lo âu vô cớ gây hại cho tâm trí.",
      family: "Gia đình cần sự chân thành, không giấu giếm. Mọi việc nên để thuận theo tự nhiên.",
      wealth: "Tiền bạc đủ dùng, không nên tham cầu những khoản lợi bất chính.",
      children: "Con cái cần được dạy tính trung thực và sống đúng với bản chất của mình.",
      fame: "Công danh bền vững nhờ uy tín thực chất. Không nên chạy theo hư danh.",
      todo: "Nên sống chân thành, làm việc đúng lương tâm. Chấp nhận thực tại.",
      avoid: "Tránh tham vọng viển vông, làm việc khuất tất. Không nên lo lắng về những việc chưa xảy ra."
    }
  },
  26: { 
    number: 26, name: "Sơn Thiên Đại Súc", meaning: "Tích lũy lớn", description: "Nội lực thâm hậu. Thời điểm để thực hiện hoài bão lớn.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Sự nghiệp có nền tảng vững chắc. Thời điểm chín muồi để triển khai các dự án quy mô lớn.",
      health: "Sức khỏe dồi dào, nội lực thâm hậu. Có khả năng chịu đựng áp lực công việc cao.",
      family: "Gia đình giàu có, có truyền thống tốt đẹp. Con cái được thừa hưởng nền tảng vững chắc.",
      wealth: "Tài sản tích lũy lớn, tiền bạc dư dả. Đầu tư dài hạn mang lại lợi nhuận cực cao.",
      children: "Con cái có chí hướng lớn, được đầu tư giáo dục bài bản và dễ thành đạt.",
      fame: "Công danh rạng rỡ, có vị thế vững chắc trong xã hội.",
      todo: "Nên thực hiện những hoài bão lớn. Tiếp tục trau dồi kiến thức và đức độ.",
      avoid: "Tránh lãng phí nguồn lực. Không nên dừng lại khi đang có đà phát triển tốt."
    }
  },
  27: { 
    number: 27, name: "Sơn Lôi Di", meaning: "Nuôi dưỡng", description: "Chú trọng sức khỏe và lời ăn tiếng nói. Tự lực cánh sinh.", 
    tuongTinh: { char: "馬", animal: "Ngựa (Mã)" },
    analysis: {
      career: "Công việc liên quan đến nuôi dưỡng, giáo dục hoặc cung cấp dịch vụ thiết yếu rất thuận lợi.",
      health: "Cần chú trọng chế độ ăn uống và lời ăn tiếng nói. Tránh các bệnh về đường tiêu hóa.",
      family: "Gia đình cần sự quan tâm, chăm sóc lẫn nhau về cả vật chất lẫn tinh thần.",
      wealth: "Tiền bạc đủ dùng cho các nhu cầu thiết yếu. Nên tự lực cánh sinh thay vì trông chờ người khác.",
      children: "Con cái cần được nuôi dưỡng đúng cách, cả về thể chất lẫn tâm hồn.",
      fame: "Công danh thăng tiến nhờ sự tận tụy và khả năng chăm sóc, giúp đỡ người khác.",
      todo: "Nên chú ý lời ăn tiếng nói, ăn uống điều độ. Tự mình nỗ lực vươn lên.",
      avoid: "Tránh nói lời thị phi, ăn uống quá độ. Không nên ỷ lại vào sự giúp đỡ của người khác."
    }
  },
  28: { 
    number: 28, name: "Trạch Phong Đại Quá", meaning: "Quá tải", description: "Áp lực cực lớn. Cần sự dũng cảm và quyết sách phi thường.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc đang ở tình trạng quá tải, áp lực đè nặng. Cần sự dũng cảm để thay đổi cục diện.",
      health: "Sức khỏe suy giảm do làm việc quá sức. Chú ý các bệnh về xương khớp hoặc cột sống.",
      family: "Gia đình đang gánh vác những trách nhiệm quá lớn. Cần sự đoàn kết để vượt qua khó khăn.",
      wealth: "Tiền bạc gặp áp lực lớn, chi tiêu vượt quá khả năng. Cần cơ cấu lại tài chính gấp.",
      children: "Con cái đang chịu áp lực học tập hoặc kỳ vọng quá lớn từ cha mẹ. Cần được giải tỏa.",
      fame: "Công danh đang ở thế chông chênh. Cần một quyết định táo bạo để giữ vững vị thế.",
      todo: "Nên dũng cảm thay đổi, đưa ra những quyết sách phi thường. Tìm kiếm sự hỗ trợ.",
      avoid: "Tránh cố chấp giữ những gì đã quá tải. Không nên làm việc quá sức chịu đựng."
    }
  },
  29: { 
    number: 29, name: "Thuần Khảm", meaning: "Nước", description: "Hiểm họa trùng trùng. Cần giữ vững niềm tin, kiên trì vượt khó.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Sự nghiệp gặp nhiều hiểm nguy, cạm bẫy. Mọi việc đều trắc trở và khó khăn chồng chất.",
      health: "Sức khỏe yếu, dễ mắc các bệnh về thận, hệ bài tiết hoặc tâm thần phân liệt.",
      family: "Gia đạo gặp nhiều sóng gió, lo âu. Cần sự bình tĩnh và tin tưởng lẫn nhau.",
      wealth: "Tiền bạc bế tắc, dễ bị lừa gạt hoặc mất mát lớn. Tuyệt đối không đầu tư mạo hiểm.",
      children: "Con cái gặp nhiều thử thách trong cuộc sống. Cần sự bảo bọc và chỉ dẫn sát sao.",
      fame: "Công danh bị vùi dập, uy tín xuống thấp. Cần giữ vững niềm tin vào chính nghĩa.",
      todo: "Nên kiên trì, giữ vững niềm tin và đạo đức. Học cách thích nghi với hoàn cảnh khó khăn.",
      avoid: "Tránh hoang mang, bỏ cuộc. Không nên tin vào những lời hứa hẹn hão huyền."
    }
  },
  30: { 
    number: 30, name: "Thuần Ly", meaning: "Lửa", description: "Sáng suốt, bám trụ. Cần sự bền bỉ và gắn kết với chính đạo.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Công việc đòi hỏi sự sáng suốt và khả năng bám trụ. Phù hợp với các lĩnh vực văn hóa, giáo dục.",
      health: "Chú ý các bệnh về mắt, tim mạch hoặc chứng nóng trong người. Cần giữ tâm thái bình thản.",
      family: "Gia đình cần sự ấm áp và gắn kết. Người phụ nữ có vai trò quan trọng trong việc giữ lửa.",
      wealth: "Tiền bạc ổn định nhưng dễ bị tiêu tán vào những việc không cần thiết. Cần sự tỉnh táo.",
      children: "Con cái thông minh, sáng sủa nhưng đôi khi nóng nảy, cần được rèn luyện tính kiên nhẫn.",
      fame: "Công danh rạng rỡ nhờ tài năng và sự sáng suốt. Được mọi người công nhận.",
      todo: "Nên giữ sự sáng suốt, bám trụ vào những giá trị tốt đẹp. Trau dồi kiến thức.",
      avoid: "Tránh nóng nảy, vội vàng. Không nên tách rời khỏi tập thể hoặc chính đạo."
    }
  },
  31: { 
    number: 31, name: "Trạch Sơn Hàm", meaning: "Giao cảm", description: "Tình cảm chân thành. Sự chân thành lay động lòng người.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc thuận lợi nhờ sự giao thiệp tốt và lòng chân thành. Phù hợp với các ngành dịch vụ, tư vấn, ngoại giao.",
      health: "Sức khỏe tốt, tinh thần sảng khoái. Cảm xúc thăng hoa giúp cơ thể tràn đầy sức sống.",
      family: "Gia đình hạnh phúc, vợ chồng đồng lòng. Có sự thấu hiểu và chia sẻ sâu sắc.",
      wealth: "Tiền bạc hanh thông, có lộc từ các mối quan hệ tình cảm hoặc sự giúp đỡ của người thân.",
      children: "Con cái tình cảm, hiếu thảo và biết quan tâm đến người khác.",
      fame: "Công danh thăng tiến nhờ sự yêu mến và tin tưởng của mọi người.",
      todo: "Nên sống chân thành, mở lòng với mọi người. Lắng nghe tiếng nói của con tim.",
      avoid: "Tránh giả dối, vụ lợi trong tình cảm. Không nên để cảm xúc lấn át lý trí quá mức."
    }
  },
  32: { 
    number: 32, name: "Lôi Sơn Hằng", meaning: "Bền vững", description: "Kiên định mục tiêu. Sự bền bỉ là chìa khóa của thành công.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Sự nghiệp ổn định và phát triển bền vững. Cần kiên định với con đường đã chọn, tránh thay đổi xoành xoạch.",
      health: "Sức khỏe tốt nhờ duy trì thói quen sinh hoạt điều độ. Chú ý các bệnh về cơ bắp hoặc dây chằng.",
      family: "Gia đạo bền vững, vợ chồng chung thủy. Sự ổn định là nền tảng của hạnh phúc gia đình.",
      wealth: "Tiền bạc tích lũy vững chắc. Đầu tư dài hạn sẽ mang lại kết quả tốt đẹp.",
      children: "Con cái có tính kiên trì, nhẫn nại và có sự phát triển ổn định.",
      fame: "Công danh thăng tiến chậm nhưng chắc chắn. Uy tín được khẳng định qua thời gian.",
      todo: "Nên kiên trì với mục tiêu, giữ vững lập trường. Duy trì những thói quen tốt.",
      avoid: "Tránh thay đổi thất thường, đứng núi này trông núi nọ. Không nên nôn nóng bứt phá."
    }
  },
  33: { 
    number: 33, name: "Thiên Sơn Độn", meaning: "Ẩn lui", description: "Rút lui chiến thuật. Tránh đối đầu trực tiếp khi thế yếu.", 
    tuongTinh: { char: "騾", animal: "Lừa (La)" },
    analysis: {
      career: "Thời điểm nên rút lui hoặc tạm dừng các dự án lớn. Tránh đối đầu với thế lực mạnh hoặc tiểu nhân.",
      health: "Cần nghỉ ngơi, tĩnh dưỡng. Tránh làm việc quá sức hoặc tham gia các hoạt động mạo hiểm.",
      family: "Gia đình cần sự yên tĩnh. Nên tạm lánh những tranh chấp thị phi bên ngoài.",
      wealth: "Tiền bạc nên giữ kỹ, tránh đầu tư mạo hiểm. Bảo toàn vốn là ưu tiên hàng đầu.",
      children: "Con cái cần được bảo vệ khỏi những tác động tiêu cực từ môi trường xung quanh.",
      fame: "Công danh đang ở thế thoái trào. Nên ẩn mình để bảo toàn danh tiếng.",
      todo: "Nên rút lui đúng lúc, tìm nơi yên tĩnh để chiêm nghiệm. Giữ khoảng cách với kẻ xấu.",
      avoid: "Tránh cố chấp tiến lên khi thế yếu. Không nên tranh giành quyền lợi lúc này."
    }
  },
  34: { 
    number: 34, name: "Lôi Thiên Đại Tráng", meaning: "Thịnh vượng lớn", description: "Sức mạnh dồi dào. Tránh cậy thế làm liều, cần sự chừng mực.", 
    tuongTinh: { char: "雞", animal: "Gà (Kê)" },
    analysis: {
      career: "Sự nghiệp đang ở thời kỳ cực thịnh, sức mạnh dồi dào. Có khả năng bứt phá mạnh mẽ.",
      health: "Sức khỏe sung mãn, tràn đầy năng lượng. Tuy nhiên cần tránh vận động quá mạnh gây chấn thương.",
      family: "Gia đình hưng vượng, có uy thế trong vùng. Cần giữ sự chừng mực để tránh kiêu ngạo.",
      wealth: "Tài lộc dồi dào, tiền bạc hanh thông. Có nhiều cơ hội làm giàu lớn.",
      children: "Con cái giỏi giang, mạnh mẽ và có chí hướng lớn.",
      fame: "Công danh rạng rỡ, uy tín lừng lẫy. Được nhiều người nể sợ.",
      todo: "Nên dùng sức mạnh vào việc chính nghĩa. Giữ thái độ chừng mực, khiêm tốn.",
      avoid: "Tránh cậy thế ép người, làm liều. Không nên phô trương sức mạnh thái quá."
    }
  },
  35: { 
    number: 35, name: "Hỏa Địa Tấn", meaning: "Tiến bộ", description: "Sự nghiệp thăng tiến. Hãy giữ vững đạo đức khi thành công.", 
    tuongTinh: { char: "鼠", animal: "Chuột (Thử)" },
    analysis: {
      career: "Sự nghiệp thăng tiến nhanh chóng như mặt trời mọc. Được cấp trên tin dùng và giao trọng trách.",
      health: "Sức khỏe tốt, tinh thần minh mẫn. Có nhiều niềm vui trong công việc và cuộc sống.",
      family: "Gia đạo yên vui, đón nhận nhiều tin mừng. Sự nghiệp của các thành viên đều có bước tiến.",
      wealth: "Tài lộc hanh thông, tiền bạc tăng trưởng rõ rệt. Có lộc từ sự thăng tiến.",
      children: "Con cái học hành tiến bộ, đạt được nhiều thành tích cao.",
      fame: "Công danh rạng rỡ, uy tín ngày càng cao. Được xã hội trọng vọng.",
      todo: "Nên nỗ lực hết mình, giữ vững đạo đức nghề nghiệp. Chia sẻ niềm vui với mọi người.",
      avoid: "Tránh kiêu ngạo khi thành công. Không nên quên đi những người đã giúp đỡ mình."
    }
  },
  36: { 
    number: 36, name: "Địa Hỏa Minh Di", meaning: "U tối", description: "Tài năng bị vùi dập. Nên ẩn mình, giữ sáng suốt bên trong.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Công việc gặp nhiều khó khăn, tài năng không được trọng dụng. Dễ bị tiểu nhân hãm hại hoặc chèn ép.",
      health: "Sức khỏe suy giảm, dễ mắc các bệnh về mắt hoặc tim mạch. Tinh thần u uất.",
      family: "Gia đạo gặp nhiều chuyện buồn lo. Cần sự nhẫn nại để vượt qua giai đoạn tăm tối.",
      wealth: "Tiền bạc khó khăn, dễ bị hao tổn. Nên giữ gìn tài sản cẩn thận.",
      children: "Con cái gặp trắc trở, cần sự bảo bọc và động viên từ cha mẹ.",
      fame: "Công danh bị vùi dập, uy tín bị ảnh hưởng nghiêm trọng. Cần nhẫn nhịn giữ mình.",
      todo: "Nên ẩn mình chờ thời, giữ sự sáng suốt bên trong. Kiên nhẫn chịu đựng gian khổ.",
      avoid: "Tránh phô trương tài năng lúc này. Không nên đối đầu trực tiếp với kẻ ác."
    }
  },
  37: { 
    number: 37, name: "Phong Hỏa Gia Nhân", meaning: "Người nhà", description: "Gia đạo hòa thuận. Chỉnh đốn việc nhà trước khi làm việc lớn.", 
    tuongTinh: { char: "馬", animal: "Ngựa (Mã)" },
    analysis: {
      career: "Công việc ổn định nhờ sự hậu thuẫn vững chắc từ gia đình. Phù hợp với kinh doanh gia đình.",
      health: "Sức khỏe tốt, tâm hồn bình an bên người thân. Chú ý các bệnh về hệ tiêu hóa.",
      family: "Gia đình hòa thuận, hạnh phúc. Mọi thành viên đều làm tròn bổn phận của mình.",
      wealth: "Tiền bạc ổn định, tích lũy tốt. Tài chính gia đình được quản lý chặt chẽ.",
      children: "Con cái ngoan ngoãn, hiếu thảo và biết giúp đỡ cha mẹ việc nhà.",
      fame: "Công danh thăng tiến nhờ uy tín cá nhân và sự ủng hộ của gia đình.",
      todo: "Nên chỉnh đốn việc nhà, quan tâm đến người thân. Giữ vững nề nếp gia phong.",
      avoid: "Tránh bỏ bê gia đình vì công việc. Không nên để người ngoài can thiệp quá sâu vào việc nhà."
    }
  },
  38: { 
    number: 38, name: "Hỏa Trạch Khuê", meaning: "Chia rẽ", description: "Bất đồng quan điểm. Tìm kiếm điểm chung trong sự khác biệt.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc gặp nhiều bất đồng, mâu thuẫn với đối tác hoặc đồng nghiệp. Khó tìm được tiếng nói chung.",
      health: "Sức khỏe bình thường nhưng tinh thần căng thẳng do xung đột. Chú ý các bệnh về mắt.",
      family: "Gia đình có sự chia rẽ, bất hòa. Anh em, vợ chồng dễ xảy ra tranh cãi.",
      wealth: "Tiền bạc khó khăn do sự thiếu thống nhất trong đầu tư hoặc quản lý tài chính.",
      children: "Con cái có cá tính mạnh, dễ xung đột với cha mẹ. Cần sự khéo léo trong giáo dục.",
      fame: "Công danh bị ảnh hưởng bởi những bất đồng và sự thiếu đoàn kết.",
      todo: "Nên tìm kiếm điểm chung, giữ thái độ hòa nhã. Chấp nhận sự khác biệt.",
      avoid: "Tránh tranh cãi gay gắt, chia rẽ nội bộ. Không nên cố chấp áp đặt ý kiến cá nhân."
    }
  },
  39: { 
    number: 39, name: "Thủy Sơn Kiển", meaning: "Gian nan", description: "Đường đi trắc trở. Nên dừng lại xem xét, tìm người giúp đỡ.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Sự nghiệp gặp nhiều trở ngại, đường đi đầy chông gai. Mọi kế hoạch đều bị đình trệ.",
      health: "Sức khỏe yếu, dễ gặp tai nạn hoặc chấn thương ở chân. Tinh thần mệt mỏi.",
      family: "Gia đạo gặp nhiều khó khăn, lo âu. Cần sự đồng lòng của các thành viên để vượt qua.",
      wealth: "Tiền bạc bế tắc, dễ bị hao tài. Tránh đầu tư mạo hiểm hoặc đi xa làm ăn lúc này.",
      children: "Con cái gặp nhiều trắc trở trong học tập hoặc cuộc sống. Cần sự hỗ trợ từ cha mẹ.",
      fame: "Công danh bị đình trệ, uy tín giảm sút. Cần kiên nhẫn chờ thời.",
      todo: "Nên dừng lại xem xét tình hình, tìm kiếm sự giúp đỡ từ quý nhân. Tu dưỡng bản thân.",
      avoid: "Tránh nôn nóng tiến lên khi gặp trở ngại. Không nên đi vào con đường hiểm trở."
    }
  },
  40: { 
    number: 40, name: "Lôi Thủy Giải", meaning: "Giải tỏa", description: "Khó khăn qua đi. Nên bao dung, giải quyết dứt điểm nợ nần.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Khó khăn trong công việc bắt đầu được giải tỏa. Mọi vướng mắc dần được tháo gỡ.",
      health: "Sức khỏe cải thiện rõ rệt, tinh thần nhẹ nhõm. Mọi bệnh tật dần tan biến.",
      family: "Gia đình hòa giải được những mâu thuẫn cũ. Không khí gia đình trở nên ấm áp hơn.",
      wealth: "Tiền bạc bắt đầu hanh thông. Nên giải quyết dứt điểm các khoản nợ cũ.",
      children: "Con cái vượt qua được giai đoạn khó khăn, bắt đầu có những bước tiến mới.",
      fame: "Công danh bắt đầu khởi sắc trở lại. Uy tín dần được khôi phục.",
      todo: "Nên bao dung, tha thứ cho lỗi lầm của người khác. Giải quyết dứt điểm các tồn đọng.",
      avoid: "Tránh khơi lại chuyện cũ, gây thêm mâu thuẫn. Không nên lơ là khi khó khăn vừa qua."
    }
  },
  41: { 
    number: 41, name: "Sơn Trạch Tổn", meaning: "Bớt đi", description: "Chấp nhận thiệt thòi trước mắt để nhận lợi ích lâu dài.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc đòi hỏi sự hy sinh lợi ích ngắn hạn để xây dựng nền tảng lâu dài. Nên bớt đi những dự án không hiệu quả.",
      health: "Cần tiết chế trong ăn uống và sinh hoạt. Bớt đi những thói quen xấu để cải thiện sức khỏe.",
      family: "Gia đình cần sự nhường nhịn, bớt đi cái tôi cá nhân để giữ gìn hòa khí.",
      wealth: "Tiền bạc có sự hao hụt nhất định nhưng là sự đầu tư đúng đắn cho tương lai. Chấp nhận thiệt thòi trước mắt.",
      children: "Con cái cần được dạy tính tiết kiệm và biết hy sinh vì người khác.",
      fame: "Công danh thăng tiến nhờ sự chân thành và tinh thần cống hiến, không vụ lợi.",
      todo: "Nên chấp nhận thiệt thòi, làm việc thiện tích đức. Tiết chế ham muốn cá nhân.",
      avoid: "Tránh tham lam lợi ích nhỏ trước mắt. Không nên cố chấp giữ những gì không còn phù hợp."
    }
  },
  42: { 
    number: 42, name: "Phong Lôi Ích", meaning: "Thêm vào", description: "Cơ hội phát triển. Nên tranh thủ thời cơ, làm việc thiện.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Sự nghiệp đang trên đà phát triển mạnh mẽ. Có nhiều cơ hội để mở rộng kinh doanh hoặc thăng tiến.",
      health: "Sức khỏe dồi dào, tràn đầy năng lượng. Tinh thần phấn chấn giúp cơ thể khỏe mạnh.",
      family: "Gia đình đón nhận nhiều tin vui, tài sản gia tăng. Có sự hỗ trợ đắc lực từ người thân.",
      wealth: "Tài lộc dồi dào, tiền bạc hanh thông. Đầu tư vào lúc này mang lại lợi nhuận cao.",
      children: "Con cái có những bước tiến bộ vượt bậc, mang lại niềm vui và tự hào cho gia đình.",
      fame: "Công danh rạng rỡ, uy tín ngày càng được củng cố và lan tỏa.",
      todo: "Nên tranh thủ thời cơ để phát triển. Làm việc thiện để duy trì vận may lâu dài.",
      avoid: "Tránh chủ quan, lười biếng khi đang gặp vận tốt. Không nên ích kỷ chỉ biết lợi mình."
    }
  },
  43: { 
    number: 43, name: "Trạch Thiên Quải", meaning: "Quyết liệt", description: "Cần sự dứt khoát. Loại bỏ cái xấu một cách công minh.", 
    tuongTinh: { char: "騾", animal: "Lừa (La)" },
    analysis: {
      career: "Cần sự dứt khoát trong việc loại bỏ những nhân sự kém cỏi hoặc các phương pháp làm việc cũ kỹ.",
      health: "Chú ý các bệnh về huyết áp hoặc hệ thần kinh do căng thẳng. Cần quyết liệt thay đổi lối sống.",
      family: "Gia đình cần sự minh bạch, dứt khoát trong việc giải quyết các vấn đề tồn đọng.",
      wealth: "Tiền bạc hanh thông sau khi giải quyết xong các tranh chấp hoặc nợ nần cũ.",
      children: "Con cái cần được dạy tính quyết đoán và dũng cảm bảo vệ lẽ phải.",
      fame: "Công danh thăng tiến nhờ sự chính trực và quyết sách dứt khoát.",
      todo: "Nên hành động công minh, dứt khoát. Loại bỏ cái xấu một cách triệt để.",
      avoid: "Tránh do dự, nhu nhược. Không nên dùng thủ đoạn tiểu nhân để đạt mục đích."
    }
  },
  44: { 
    number: 44, name: "Thiên Phong Cấu", meaning: "Gặp gỡ", description: "Cuộc gặp bất ngờ. Cẩn trọng với những cám dỗ nhất thời.", 
    tuongTinh: { char: "雞", animal: "Gà (Kê)" },
    analysis: {
      career: "Gặp gỡ những đối tác mới hoặc cơ hội bất ngờ. Cần cẩn trọng xem xét kỹ trước khi hợp tác.",
      health: "Sức khỏe bình thường nhưng cần chú ý các bệnh lây nhiễm hoặc ảnh hưởng từ môi trường.",
      family: "Gia đình có những cuộc gặp gỡ bất ngờ. Cẩn trọng với những mối quan hệ ngoài luồng.",
      wealth: "Tiền bạc có lộc bất ngờ nhưng khó giữ. Dễ bị hao tổn vào những việc không chính đáng.",
      children: "Con cái dễ bị ảnh hưởng bởi bạn bè xấu hoặc những cám dỗ bên ngoài.",
      fame: "Công danh có sự thay đổi bất ngờ. Cần tỉnh táo để không bị cuốn vào những thị phi.",
      todo: "Nên cẩn trọng trong các mối quan hệ mới. Giữ vững lập trường và đạo đức.",
      avoid: "Tránh sa đà vào cám dỗ, những cuộc vui nhất thời. Không nên tin người quá vội vàng."
    }
  },
  45: { 
    number: 45, name: "Trạch Địa Tụy", meaning: "Tụ họp", description: "Đoàn kết, sum vầy. Cần sự chuẩn bị chu đáo cho các sự kiện lớn.", 
    tuongTinh: { char: "鼠", animal: "Chuột (Thử)" },
    analysis: {
      career: "Công việc đòi hỏi sự đoàn kết, tập hợp sức mạnh đám đông. Phù hợp với các sự kiện lớn, hội thảo.",
      health: "Sức khỏe tốt nhờ tinh thần vui vẻ khi được ở bên cạnh mọi người. Chú ý các bệnh lây qua đường hô hấp.",
      family: "Gia đình sum họp, đoàn viên. Có nhiều buổi tiệc tùng, lễ hội vui vẻ.",
      wealth: "Tiền bạc hanh thông nhờ sự đóng góp, góp vốn của nhiều người. Tài chính dồi dào.",
      children: "Con cái hòa đồng, thích tham gia các hoạt động tập thể và có nhiều bạn bè.",
      fame: "Công danh thăng tiến nhờ sự ủng hộ của số đông và uy tín trong cộng đồng.",
      todo: "Nên chuẩn bị chu đáo cho các kế hoạch lớn. Gắn kết mọi người xung quanh.",
      avoid: "Tránh chia rẽ, sống tách biệt. Không nên chủ quan khi mọi việc đang thuận lợi."
    }
  },
  46: { 
    number: 46, name: "Địa Phong Thăng", meaning: "Thăng tiến", description: "Tiến bước vững chắc. Tìm kiếm sự hỗ trợ từ người có quyền thế.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Sự nghiệp thăng tiến không ngừng. Được quý nhân giúp đỡ và có nhiều cơ hội để thể hiện năng lực.",
      health: "Sức khỏe tốt, tinh thần phấn chấn. Cơ thể tràn đầy sinh lực để vươn lên.",
      family: "Gia đạo yên vui, địa vị gia đình trong xã hội ngày càng được nâng cao.",
      wealth: "Tài lộc tăng trưởng bền vững. Tiền bạc hanh thông, đầu tư có lãi.",
      children: "Con cái có chí tiến thủ, đạt được nhiều thành công và sự nghiệp thăng tiến.",
      fame: "Công danh rạng rỡ, uy tín ngày càng cao. Được nhiều người nể trọng.",
      todo: "Nên nỗ lực vươn lên, tìm kiếm sự chỉ dẫn của người giỏi. Giữ thái độ khiêm tốn.",
      avoid: "Tránh kiêu ngạo khi thành công. Không nên quên đi gốc rễ và những người đã hỗ trợ mình."
    }
  },
  47: { 
    number: 47, name: "Trạch Thủy Khốn", meaning: "Khốn cùng", description: "Bị vây hãm, bế tắc. Giữ vững ý chí, lời nói không bằng hành động.", 
    tuongTinh: { char: "馬", animal: "Ngựa (Mã)" },
    analysis: {
      career: "Công việc rơi vào tình trạng bế tắc, bị vây hãm bởi khó khăn tài chính hoặc nhân sự.",
      health: "Sức khỏe suy kiệt, dễ mắc bệnh do lo âu và thiếu hụt dinh dưỡng. Tinh thần mệt mỏi.",
      family: "Gia đạo gặp nhiều khó khăn, thiếu thốn. Cần sự đồng lòng để vượt qua giai đoạn khốn cùng.",
      wealth: "Tiền bạc cạn kiệt, nợ nần chồng chất. Tuyệt đối không vay mượn thêm lúc này.",
      children: "Con cái chịu nhiều thiệt thòi, cần sự động viên và bảo bọc từ cha mẹ.",
      fame: "Công danh sụp đổ, lời nói không còn trọng lượng. Cần nhẫn nhịn giữ vững ý chí.",
      todo: "Nên giữ vững niềm tin, làm nhiều hơn nói. Kiên nhẫn chờ đợi thời cơ giải vây.",
      avoid: "Tránh than vãn, oán trách số phận. Không nên tin vào những lời hứa hão huyền."
    }
  },
  48: { 
    number: 48, name: "Thủy Phong Tỉnh", meaning: "Cái giếng", description: "Nguồn lực vô tận. Chú trọng tu dưỡng bản thân, phục vụ cộng đồng.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc ổn định, mang tính phục vụ cộng đồng cao. Cần chú trọng vào việc đào tạo và phát triển nhân sự.",
      health: "Sức khỏe ổn định nhưng cần chú ý vệ sinh ăn uống và nguồn nước.",
      family: "Gia đình là nơi nương tựa vững chắc cho mọi thành viên. Cần giữ gìn truyền thống tốt đẹp.",
      wealth: "Tiền bạc ổn định, đủ dùng. Nguồn thu đến từ những công việc mang tính bền vững.",
      children: "Con cái được nuôi dưỡng tốt, có tâm hồn nhân hậu và biết giúp đỡ người khác.",
      fame: "Công danh thầm lặng nhưng có tầm ảnh hưởng sâu rộng trong cộng đồng.",
      todo: "Nên tu dưỡng bản thân, chia sẻ nguồn lực với mọi người. Giữ gìn các giá trị cốt lõi.",
      avoid: "Tránh bỏ bê việc tu dưỡng, lãng phí nguồn lực. Không nên sống ích kỷ chỉ biết mình."
    }
  },
  49: { 
    number: 49, name: "Trạch Hỏa Cách", meaning: "Cải cách", description: "Thay đổi triệt để. Thời điểm để lột xác, làm mới hoàn toàn.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Thời điểm để thay đổi hoàn toàn phương pháp làm việc hoặc chuyển sang lĩnh vực mới. Cần sự dũng cảm.",
      health: "Cần thay đổi thói quen sinh hoạt cũ để cải thiện sức khỏe. Có thể thực hiện các cuộc phẫu thuật nếu cần.",
      family: "Gia đình có những thay đổi lớn về nề nếp hoặc nơi ở. Cần sự đồng thuận của mọi thành viên.",
      wealth: "Tiền bạc có sự biến động lớn do thay đổi phương thức kinh doanh. Đầu tư vào cái mới mang lại lợi nhuận.",
      children: "Con cái có những thay đổi tích cực về tư duy và hành động. Cần được định hướng đúng đắn.",
      fame: "Công danh thăng tiến nhờ sự đổi mới và khả năng thích nghi với thời đại.",
      todo: "Nên dũng cảm thay đổi, làm mới bản thân và công việc. Giữ chữ tín trong quá trình cải cách.",
      avoid: "Tránh bảo thủ, níu kéo cái cũ đã lỗi thời. Không nên thay đổi khi chưa có sự chuẩn bị kỹ."
    }
  },
  50: { 
    number: 50, name: "Hỏa Phong Đỉnh", meaning: "Cái đỉnh", description: "Sự vững chãi, thành tựu. Cần người tài đức để duy trì vận thế.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Sự nghiệp đạt đến độ chín muồi, vững chãi như kiềng ba chân. Có thành tựu lớn và vị thế cao.",
      health: "Sức khỏe tốt, nội lực thâm hậu. Chú ý các bệnh về hệ tiêu hóa do tiệc tùng nhiều.",
      family: "Gia đình sung túc, có địa vị và uy tín. Con cái được thừa hưởng nền tảng giáo dục tốt.",
      wealth: "Tài lộc dồi dào, tiền bạc dư dả. Có nhiều nguồn thu nhập ổn định và lớn.",
      children: "Con cái tài năng, có đức độ và dễ đạt được những vị trí cao trong xã hội.",
      fame: "Công danh rạng rỡ, uy tín lừng lẫy. Được mọi người tin tưởng và kính nể.",
      todo: "Nên trọng dụng người tài, giữ vững đức độ. Tiếp tục cống hiến cho xã hội.",
      avoid: "Tránh kiêu ngạo, lạm quyền. Không nên quên đi những người đã đồng hành cùng mình."
    }
  },
  51: { 
    number: 51, name: "Thuần Lôi", meaning: "Sấm", description: "Biến động bất ngờ. Giữ bình tĩnh trước những cú sốc lớn.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc có những biến động bất ngờ, gây sốc. Cần sự bình tĩnh để xử lý tình huống khẩn cấp.",
      health: "Chú ý các bệnh về tim mạch, thần kinh hoặc chấn thương do tai nạn bất ngờ.",
      family: "Gia đình có những tin tức gây chấn động. Cần sự điềm tĩnh của người trụ cột để ổn định tình hình.",
      wealth: "Tiền bạc biến động mạnh. Có thể có lộc bất ngờ nhưng cũng dễ mất mát nhanh chóng.",
      children: "Con cái năng động, đôi khi nghịch ngợm quá mức gây ra những rắc rối bất ngờ.",
      fame: "Công danh có sự thay đổi đột ngột. Uy tín có thể bị thử thách bởi những sự cố bất ngờ.",
      todo: "Nên giữ bình tĩnh, tu dưỡng tâm tính. Chuẩn bị tinh thần cho những thay đổi lớn.",
      avoid: "Tránh hoảng loạn, làm liều. Không nên chủ quan trước những dấu hiệu cảnh báo."
    }
  },
  52: { 
    number: 52, name: "Thuần Sơn", meaning: "Núi", description: "Dừng lại, tĩnh lặng. Giữ tâm bất biến giữa dòng đời vạn biến.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Công việc nên dừng lại để xem xét, không nên tiến thêm. Phù hợp với việc nghiên cứu, tu tập.",
      health: "Cần sự tĩnh lặng, nghỉ ngơi tuyệt đối. Chú ý các bệnh về lưng, cột sống hoặc hệ xương khớp.",
      family: "Gia đình cần sự yên tĩnh, bớt đi những tranh cãi. Mỗi người nên tự nhìn nhận lại bản thân.",
      wealth: "Tiền bạc ổn định nhưng không có sự tăng trưởng. Nên giữ tiền kỹ, tránh đầu tư lúc này.",
      children: "Con cái có xu hướng hướng nội, cần được tôn trọng không gian riêng tư.",
      fame: "Công danh dừng lại ở mức hiện tại. Nên hài lòng với những gì đang có.",
      todo: "Nên giữ tâm tĩnh lặng, dừng mọi hành động vội vàng. Suy ngẫm về cuộc đời.",
      avoid: "Tránh nôn nóng, cưỡng cầu tiến bộ. Không nên tham gia vào những việc ồn ào thị phi."
    }
  },
  53: { 
    number: 53, name: "Phong Sơn Tiệm", meaning: "Tiến dần", description: "Dục tốc bất đạt. Tiến bước chậm rãi nhưng chắc chắn.", 
    tuongTinh: { char: "騾", animal: "Lừa (La)" },
    analysis: {
      career: "Sự nghiệp thăng tiến từng bước một. Cần sự kiên nhẫn và tuân thủ đúng quy trình.",
      health: "Sức khỏe cải thiện dần dần. Cần duy trì chế độ tập luyện và ăn uống bền bỉ.",
      family: "Gia đình hạnh phúc bền vững nhờ sự vun đắp từng ngày. Có hỷ tín về hôn nhân hoặc con cái.",
      wealth: "Tiền bạc tăng trưởng chậm nhưng chắc chắn. Tích tiểu thành đại.",
      children: "Con cái phát triển ổn định, học hành tiến bộ theo thời gian.",
      fame: "Công danh thăng tiến nhờ uy tín được xây dựng lâu dài và vững chắc.",
      todo: "Nên kiên nhẫn, làm việc có kế hoạch và đúng trình tự. Giữ vững đạo đức.",
      avoid: "Tránh dục tốc bất đạt, làm tắt. Không nên nôn nóng muốn có kết quả ngay lập tức."
    }
  },
  54: { 
    number: 54, name: "Lôi Trạch Quy Muội", meaning: "Thiếu nữ", description: "Sai lầm trong khởi đầu. Cẩn trọng trong các mối quan hệ.", 
    tuongTinh: { char: "雞", animal: "Gà (Kê)" },
    analysis: {
      career: "Công việc khởi đầu không thuận lợi hoặc sai vị trí. Dễ gặp rắc rối trong các mối quan hệ công sở.",
      health: "Chú ý các bệnh về hệ sinh sản hoặc các bệnh do tâm lý bất ổn gây ra.",
      family: "Gia đạo có những rắc rối về tình cảm, dễ có người thứ ba xen vào hoặc hôn nhân không môn đăng hộ đối.",
      wealth: "Tiền bạc khó khăn, dễ bị hao tổn vào những việc không chính đáng hoặc do tình cảm chi phối.",
      children: "Con cái dễ có những hành động bộc phát, thiếu suy nghĩ. Cần sự định hướng kỹ lưỡng.",
      fame: "Công danh gặp trắc trở, uy tín bị ảnh hưởng bởi những mối quan hệ không minh bạch.",
      todo: "Nên cẩn trọng trong mọi quyết định khởi đầu. Xem lại các mối quan hệ cá nhân.",
      avoid: "Tránh hành động theo cảm tính, mù quáng. Không nên vội vàng kết hôn hoặc hợp tác làm ăn."
    }
  },
  55: { 
    number: 55, name: "Lôi Hỏa Phong", meaning: "Thịnh vượng", description: "Đỉnh cao của thành công. Nên tỉnh táo, tránh kiêu ngạo.", 
    tuongTinh: { char: "鼠", animal: "Chuột (Thử)" },
    analysis: {
      career: "Sự nghiệp đạt đến đỉnh cao rực rỡ, quyền lực và tài lộc đầy đủ. Có tầm ảnh hưởng lớn.",
      health: "Sức khỏe tốt nhưng cần chú ý các bệnh về mắt hoặc tim mạch do làm việc quá sức.",
      family: "Gia đình sung túc, giàu sang và có uy thế. Có nhiều tin vui và sự kiện lớn.",
      wealth: "Tài lộc dồi dào, tiền bạc dư dả. Có nhiều nguồn thu nhập lớn và bất ngờ.",
      children: "Con cái thành đạt, mang lại vinh quang cho dòng họ.",
      fame: "Công danh rạng rỡ, uy tín lừng lẫy. Được xã hội tôn vinh.",
      todo: "Nên tỉnh táo giữ vững thành quả. Chia sẻ tài lộc và giúp đỡ mọi người.",
      avoid: "Tránh kiêu ngạo, chủ quan. Không nên quên rằng thịnh cực tất suy."
    }
  },
  56: { 
    number: 56, name: "Hỏa Sơn Lữ", meaning: "Lữ khách", description: "Sống xa nhà, bất ổn. Cần sự khiêm nhường, thích nghi nhanh.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Công việc thường xuyên phải đi xa, công tác hoặc thay đổi môi trường làm việc liên tục.",
      health: "Dễ mắc các bệnh khi đi xa hoặc do thay đổi thời tiết. Chú ý an toàn khi di chuyển.",
      family: "Gia đình có người đi xa hoặc bản thân phải sống xa nhà. Tình cảm dễ bị ngăn cách.",
      wealth: "Tiền bạc đủ dùng cho các chuyến đi. Không nên đầu tư lớn vào những nơi không ổn định.",
      children: "Con cái có xu hướng thích khám phá, sống tự lập sớm và thường xuyên đi xa.",
      fame: "Công danh có sự thăng tiến ở nơi xa xứ. Uy tín được xây dựng từ sự thích nghi.",
      todo: "Nên khiêm nhường, thích nghi nhanh với môi trường mới. Cẩn trọng trong lời nói.",
      avoid: "Tránh gây gổ với người bản địa hoặc đồng nghiệp mới. Không nên phô trương tài sản khi đi xa."
    }
  },
  57: { 
    number: 57, name: "Thuần Phong", meaning: "Gió", description: "Thâm nhập, nhu thuận. Hành động nhẹ nhàng nhưng hiệu quả sâu.", 
    tuongTinh: { char: "馬", animal: "Ngựa (Mã)" },
    analysis: {
      career: "Công việc tiến triển nhờ sự khéo léo và khả năng thâm nhập thị trường sâu sắc. Phù hợp với tư vấn, marketing.",
      health: "Chú ý các bệnh về đường hô hấp, phong thấp hoặc các bệnh lây qua gió.",
      family: "Gia đình cần sự nhẹ nhàng, thấu hiểu. Lời nói dịu dàng có sức mạnh gắn kết lớn.",
      wealth: "Tiền bạc hanh thông nhờ sự khéo léo trong giao dịch. Có lộc từ những nguồn nhỏ nhưng đều đặn.",
      children: "Con cái ngoan ngoãn, tinh tế và có khả năng cảm thụ tốt.",
      fame: "Công danh thăng tiến nhờ uy tín được xây dựng từ sự nhu thuận và khéo léo.",
      todo: "Nên hành động nhẹ nhàng, kiên trì thâm nhập mục tiêu. Lắng nghe ý kiến chuyên gia.",
      avoid: "Tránh nóng nảy, dùng vũ lực. Không nên thiếu quyết đoán khi thời cơ đến."
    }
  },
  58: { 
    number: 58, name: "Thuần Trạch", meaning: "Đầm", description: "Vui vẻ, trao đổi. Sự chân thành mang lại niềm vui chung.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Công việc liên quan đến giao tiếp, thuyết trình hoặc đàm phán rất thuận lợi. Mang lại niềm vui cho đối tác.",
      health: "Sức khỏe tốt, tinh thần lạc quan. Chú ý các bệnh về phổi hoặc hệ hô hấp.",
      family: "Gia đình tràn ngập tiếng cười, các thành viên thường xuyên chia sẻ và tâm sự với nhau.",
      wealth: "Tiền bạc hanh thông nhờ khả năng thuyết phục và các mối quan hệ tốt đẹp.",
      children: "Con cái vui vẻ, hoạt bát và có khiếu ăn nói, ngoại giao.",
      fame: "Công danh thăng tiến nhờ sự yêu mến của mọi người và khả năng truyền đạt tuyệt vời.",
      todo: "Nên sống vui vẻ, chân thành trao đổi với mọi người. Giữ vững chính đạo trong lời nói.",
      avoid: "Tránh nói lời dua nịnh, thị phi. Không nên ham vui quá đà mà quên nhiệm vụ."
    }
  },
  59: { 
    number: 59, name: "Phong Thủy Hoán", meaning: "Tan tác", description: "Hóa giải mâu thuẫn. Dùng lòng thành để gắn kết lại sự chia rẽ.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Công việc gặp sự chia rẽ nội bộ hoặc tan rã nhóm. Cần người có tâm đức để gắn kết lại.",
      health: "Chú ý các bệnh về máu, hệ tuần hoàn hoặc tâm bệnh do lo âu kéo dài.",
      family: "Gia đạo có sự xa cách hoặc bất hòa. Cần dùng tình cảm chân thành để hóa giải mâu thuẫn.",
      wealth: "Tiền bạc dễ bị tiêu tán, hao hụt. Nên dùng tiền vào việc thiện hoặc cứu giúp người khác.",
      children: "Con cái dễ có tâm lý muốn thoát ly gia đình. Cần sự quan tâm và định hướng đúng đắn.",
      fame: "Công danh bị ảnh hưởng bởi sự chia rẽ. Cần nỗ lực để lấy lại niềm tin của mọi người.",
      todo: "Nên dùng lòng thành để hóa giải hận thù, gắn kết mọi người. Làm việc thiện tích đức.",
      avoid: "Tránh ích kỷ, hẹp hòi. Không nên để sự chia rẽ kéo dài gây hậu quả nghiêm trọng."
    }
  },
  60: { 
    number: 60, name: "Thủy Trạch Tiết", meaning: "Tiết chế", description: "Biết điểm dừng. Sự chừng mực mang lại sự ổn định lâu dài.", 
    tuongTinh: { char: "虎", animal: "Hổ (Hổ)" },
    analysis: {
      career: "Công việc cần sự chừng mực, biết điểm dừng. Không nên tham vọng quá lớn vượt quá khả năng.",
      health: "Cần tiết chế trong ăn uống, sinh hoạt và cảm xúc. Giữ gìn sức khỏe bằng sự điều độ.",
      family: "Gia đình cần có quy tắc và sự tiết chế trong chi tiêu cũng như hành xử.",
      wealth: "Tiền bạc ổn định nhờ biết tiết kiệm và chi tiêu hợp lý. Tránh lãng phí vô ích.",
      children: "Con cái cần được dạy tính tiết chế và biết hài lòng với những gì mình có.",
      fame: "Công danh vững chắc nhờ sự chừng mực và uy tín trong cách hành xử.",
      todo: "Nên sống điều độ, biết đủ là hạnh phúc. Giữ vững các nguyên tắc đạo đức.",
      avoid: "Tránh xa hoa lãng phí, tham lam vô độ. Không nên phá bỏ những quy tắc tốt đẹp."
    }
  },
  61: { 
    number: 61, name: "Phong Trạch Trung Phu", meaning: "Trung thực", description: "Lòng tin tuyệt đối. Sự chân thành có thể lay động cả trời đất.", 
    tuongTinh: { char: "羊", animal: "Dê (Dương)" },
    analysis: {
      career: "Thành công nhờ uy tín tuyệt đối và lòng trung thực. Được đối tác và đồng nghiệp tin tưởng hoàn toàn.",
      health: "Sức khỏe tốt, tâm hồn thanh thản nhờ sống ngay thẳng, không hổ thẹn.",
      family: "Gia đình hạnh phúc, tin tưởng lẫn nhau tuyệt đối. Sự chân thành là sợi dây gắn kết bền vững.",
      wealth: "Tiền bạc hanh thông nhờ uy tín trong kinh doanh. Có lộc từ sự tin cậy của khách hàng.",
      children: "Con cái trung thực, ngoan ngoãn và có nhân cách tốt đẹp.",
      fame: "Công danh rạng rỡ, uy tín vang xa nhờ đức tính trung thực và lòng nhân hậu.",
      todo: "Nên giữ vững lòng tin, sống chân thành với mọi người. Làm việc đúng với lương tâm.",
      avoid: "Tránh giả dối, thất hứa. Không nên nghi ngờ người tốt vô căn cứ."
    }
  },
  62: { 
    number: 62, name: "Lôi Sơn Tiểu Quá", meaning: "Vượt nhỏ", description: "Nên làm việc nhỏ, tránh việc lớn. Cẩn trọng trong từng chi tiết.", 
    tuongTinh: { char: "獺", animal: "Rái cá (Thát)" },
    analysis: {
      career: "Chỉ nên thực hiện những việc nhỏ, chi tiết. Tránh triển khai các dự án lớn hoặc mạo hiểm lúc này.",
      health: "Sức khỏe bình thường nhưng cần chú ý các bệnh vặt hoặc chấn thương nhẹ.",
      family: "Gia đình cần sự quan tâm đến những việc nhỏ nhặt hằng ngày. Giữ thái độ khiêm nhường.",
      wealth: "Tiền bạc ổn định, có những khoản thu nhỏ. Tránh đầu tư lớn hoặc vay mượn nhiều.",
      children: "Con cái cần được rèn luyện tính cẩn thận, tỉ mỉ trong học tập và cuộc sống.",
      fame: "Công danh ở mức trung bình. Uy tín được xây dựng từ việc hoàn thành tốt những nhiệm vụ nhỏ.",
      todo: "Nên cẩn trọng trong từng chi tiết, làm tốt việc nhỏ. Giữ thái độ khiêm tốn, nhún nhường.",
      avoid: "Tránh tham vọng việc lớn, phô trương thanh thế. Không nên bay cao quá khả năng."
    }
  },
  63: { 
    number: 63, name: "Thủy Hỏa Ký Tế", meaning: "Đã xong", description: "Thành công rực rỡ. Cần đề phòng sự suy thoái sau đỉnh cao.", 
    tuongTinh: { char: "騾", animal: "Lừa (La)" },
    analysis: {
      career: "Sự nghiệp đã đạt đến mục tiêu đề ra, thành công rực rỡ. Cần duy trì và bảo vệ thành quả.",
      health: "Sức khỏe tốt nhưng cần chú ý các dấu hiệu suy giảm sau thời kỳ đỉnh cao.",
      family: "Gia đình viên mãn, hạnh phúc. Mọi việc đều đã đi vào nề nếp ổn định.",
      wealth: "Tiền bạc dồi dào, tài chính ổn định. Cần có kế hoạch bảo toàn tài sản cho tương lai.",
      children: "Con cái đã trưởng thành, thành đạt và có cuộc sống ổn định.",
      fame: "Công danh rạng rỡ, uy tín ở mức cao nhất. Được mọi người công nhận và kính trọng.",
      todo: "Nên giữ vững thành quả, đề phòng những rủi ro tiềm ẩn. Tiếp tục tu dưỡng đạo đức.",
      avoid: "Tránh chủ quan, lơ là khi đã thành công. Không nên ngủ quên trên chiến thắng."
    }
  },
  64: { 
    number: 64, name: "Hỏa Thủy Vị Tế", meaning: "Chưa xong", description: "Hy vọng phía trước. Cần sự cẩn trọng ở bước cuối cùng.", 
    tuongTinh: { char: "雞", animal: "Gà (Kê)" },
    analysis: {
      career: "Công việc sắp hoàn thành nhưng vẫn còn những bước cuối cùng quan trọng. Cần sự tập trung cao độ.",
      health: "Sức khỏe đang dần hồi phục, cần tiếp tục duy trì chế độ chăm sóc để đạt kết quả tốt nhất.",
      family: "Gia đình đang hướng tới sự ổn định, cần thêm một chút nỗ lực và thấu hiểu để hoàn thiện.",
      wealth: "Tiền bạc đang bắt đầu hanh thông, hy vọng về những khoản thu lớn phía trước.",
      children: "Con cái đang trong giai đoạn chuyển mình quan trọng, cần sự định hướng và hỗ trợ cuối cùng.",
      fame: "Công danh đang rộng mở phía trước. Cần giữ vững phong độ để đạt được vị thế mong muốn.",
      todo: "Nên kiên trì đến cùng, cẩn trọng ở những bước cuối. Giữ vững niềm hy vọng.",
      avoid: "Tránh bỏ cuộc khi sắp đến đích, chủ quan ở phút chót. Không nên nóng vội kết thúc."
    }
  },
};

export const BINARY_TO_HEXAGRAM: Record<string, number> = {
  "111111": 1, "000000": 2, "100010": 3, "010001": 4, "111010": 5, "010111": 6, "010000": 7, "000010": 8,
  "111011": 9, "110111": 10, "111000": 11, "000111": 12, "101111": 13, "111101": 14, "001000": 15, "000100": 16,
  "100110": 17, "011001": 18, "110000": 19, "000011": 20, "100101": 21, "101001": 22, "000001": 23, "100000": 24,
  "100111": 25, "111001": 26, "100001": 27, "011110": 28, "010010": 29, "101101": 30, "001110": 31, "011100": 32,
  "001111": 33, "111100": 34, "000101": 35, "101000": 36, "101011": 37, "110101": 38, "001010": 39, "010100": 40,
  "110001": 41, "100011": 42, "111110": 43, "011111": 44, "000110": 45, "011000": 46, "010110": 47, "011010": 48,
  "101110": 49, "011101": 50, "100100": 51, "001001": 52, "001011": 53, "110100": 54, "101100": 55, "001101": 56,
  "011011": 57, "110110": 58, "010011": 59, "110010": 60, "110011": 61, "001100": 62, "101010": 63, "010101": 64
};

export function getHexagramFromLines(lines: number[]): Hexagram | null {
  const binary = lines.join('');
  const num = BINARY_TO_HEXAGRAM[binary];
  return num ? HEXAGRAMS[num] : null;
}

export function calculateMaiHoaFromTime(date: Date): { hexagram: number; movingLine: number } {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  // Year branch number (Tý=1, Sửu=2, ..., Hợi=12)
  const yearZhiIndex = lunar.getYearZhiIndex() + 1; // lunar-typescript is 0-indexed for Tý
  const month = lunar.getMonth();
  const day = lunar.getDay();
  const hourZhiIndex = lunar.getTimeZhiIndex() + 1;

  const upper = ((yearZhiIndex + month + day) % 8) || 8;
  const lower = ((yearZhiIndex + month + day + hourZhiIndex) % 8) || 8;
  const movingLine = ((yearZhiIndex + month + day + hourZhiIndex) % 6) || 6;

  const trigramBinary: Record<number, string> = {
    1: "111", // Càn (1)
    2: "110", // Đoài (2)
    3: "101", // Ly (3)
    4: "100", // Chấn (4)
    5: "011", // Tốn (5)
    6: "010", // Khảm (6)
    7: "001", // Cấn (7)
    8: "000"  // Khôn (8)
  };

  // I Ching lines are 1-6 (bottom to top)
  // Lower trigram is lines 1,2,3
  // Upper trigram is lines 4,5,6
  const binary = trigramBinary[lower] + trigramBinary[upper];
  const hexagramNum = BINARY_TO_HEXAGRAM[binary] || 1;

  return { hexagram: hexagramNum, movingLine };
}
