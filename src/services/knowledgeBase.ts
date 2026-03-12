
export interface KnowledgeSnippet {
  id: string;
  category: 'tuvi' | 'palm' | 'numerology' | 'divination' | 'general';
  content: string;
  tags: string[];
}

export const KNOWLEDGE_BASE: KnowledgeSnippet[] = [
  {
    id: 'tv-1',
    category: 'tuvi',
    content: 'Trong Tử Vi, cung Mệnh là cung quan trọng nhất, chủ về bản thể, tư tưởng và vận mệnh gốc của một người. Các sao tọa thủ tại Mệnh quyết định tính cách và năng lực bẩm sinh.',
    tags: ['cung mệnh', 'tử vi', 'bản mệnh']
  },
  {
    id: 'tv-2',
    category: 'tuvi',
    content: 'Cung Thân thể hiện hành động và xu hướng thay đổi của con người sau tuổi 30. Nếu Mệnh tốt Thân xấu thì tiền vận hanh thông nhưng hậu vận vất vả, ngược lại Mệnh xấu Thân tốt thì hậu vận sẽ phát đạt.',
    tags: ['cung thân', 'hậu vận', 'tử vi']
  },
  {
    id: 'palm-1',
    category: 'palm',
    content: 'Đường Sinh Đạo (Life Line) không chỉ nói về tuổi thọ mà còn thể hiện sức sống, năng lượng và các biến cố lớn về thể chất. Một đường sinh đạo đậm, rõ nét và không đứt đoạn cho thấy sức khỏe tốt.',
    tags: ['sinh đạo', 'chỉ tay', 'sức khỏe']
  },
  {
    id: 'palm-2',
    category: 'palm',
    content: 'Đường Trí Đạo (Head Line) thể hiện khả năng tư duy, sự tập trung và trí tuệ. Nếu đường này dài và hơi cong xuống gò Nguyệt, người đó có thiên hướng nghệ thuật và trí tưởng tượng phong phú.',
    tags: ['trí đạo', 'tư duy', 'chỉ tay']
  },
  {
    id: 'num-1',
    category: 'numerology',
    content: 'Số Chủ Đạo (Life Path Number) được tính bằng tổng các con số trong ngày tháng năm sinh. Nó đại diện cho bài học chính mà linh hồn cần học hỏi trong kiếp sống này.',
    tags: ['số chủ đạo', 'thần số học', 'sứ mệnh']
  },
  {
    id: 'div-1',
    category: 'divination',
    content: 'Kinh Dịch dựa trên 64 quẻ, mỗi quẻ gồm 6 hào. Quẻ Chủ thể hiện trạng thái hiện tại, Quẻ Biến thể hiện xu hướng tương lai sau khi các hào động thay đổi.',
    tags: ['kinh dịch', 'quẻ chủ', 'quẻ biến']
  },
  {
    id: 'gen-1',
    category: 'general',
    content: 'Triết lý "Đức năng thắng số" nhấn mạnh rằng hành động thiện nguyện và tu dưỡng tâm tính có thể cải thiện vận mệnh, làm giảm nhẹ các tai ách được dự báo trong lá số.',
    tags: ['đức năng thắng số', 'cải vận', 'triết lý']
  }
];
