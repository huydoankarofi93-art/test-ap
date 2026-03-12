export interface Province {
  id: string;
  name: string;
  oldName?: string;
  isNorth: boolean;
  isHistorical?: boolean; // Part of the 64-province era (pre-2008)
  isConsolidated?: boolean; // Part of the 34-province era (post-2025)
}

export const PROVINCES: Province[] = [
  // --- 64 Historical Provinces (Pre-2008) ---
  { id: "AG", name: "An Giang", isNorth: false, isHistorical: true },
  { id: "BR", name: "Bà Rịa - Vũng Tàu", isNorth: false, isHistorical: true },
  { id: "BG", name: "Bắc Giang", isNorth: true, isHistorical: true },
  { id: "BK", name: "Bắc Kạn", isNorth: true, isHistorical: true },
  { id: "BL", name: "Bạc Liêu", isNorth: false, isHistorical: true },
  { id: "BN", name: "Bắc Ninh", isNorth: true, isHistorical: true },
  { id: "BT", name: "Bến Tre", isNorth: false, isHistorical: true },
  { id: "BD", name: "Bình Định", isNorth: false, isHistorical: true },
  { id: "BI", name: "Bình Dương", isNorth: false, isHistorical: true },
  { id: "BP", name: "Bình Phước", isNorth: false, isHistorical: true },
  { id: "BH", name: "Bình Thuận", isNorth: false, isHistorical: true },
  { id: "CM", name: "Cà Mau", isNorth: false, isHistorical: true },
  { id: "CT", name: "Cần Thơ", isNorth: false, isHistorical: true },
  { id: "CB", name: "Cao Bằng", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "DA", name: "Đà Nẵng", isNorth: false, isHistorical: true },
  { id: "DL", name: "Đắk Lắk", isNorth: false, isHistorical: true },
  { id: "DN", name: "Đắk Nông", isNorth: false, isHistorical: true },
  { id: "DB", name: "Điện Biên", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "DO", name: "Đồng Nai", isNorth: false, isHistorical: true },
  { id: "DT", name: "Đồng Tháp", isNorth: false, isHistorical: true },
  { id: "GL", name: "Gia Lai", isNorth: false, isHistorical: true },
  { id: "HG", name: "Hà Giang", isNorth: true, isHistorical: true },
  { id: "HD", name: "Hải Dương", isNorth: true, isHistorical: true },
  { id: "HP", name: "Hải Phòng", isNorth: true, isHistorical: true },
  { id: "HN", name: "Hà Nội", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "HTY", name: "Hà Tây", isNorth: true, isHistorical: true },
  { id: "HT", name: "Hà Tĩnh", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "HA", name: "Hà Nam", isNorth: true, isHistorical: true },
  { id: "HB", name: "Hòa Bình", isNorth: true, isHistorical: true },
  { id: "HY", name: "Hưng Yên", isNorth: true, isHistorical: true },
  { id: "KH", name: "Khánh Hòa", isNorth: false, isHistorical: true },
  { id: "KG", name: "Kiên Giang", isNorth: false, isHistorical: true },
  { id: "KT", name: "Kon Tum", isNorth: false, isHistorical: true },
  { id: "LC", name: "Lai Châu", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "LD", name: "Lâm Đồng", isNorth: false, isHistorical: true },
  { id: "LS", name: "Lạng Sơn", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "LO", name: "Lào Cai", isNorth: true, isHistorical: true },
  { id: "LA", name: "Long An", isNorth: false, isHistorical: true },
  { id: "ND", name: "Nam Định", isNorth: true, isHistorical: true },
  { id: "NA", name: "Nghệ An", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "NB", name: "Ninh Bình", isNorth: true, isHistorical: true },
  { id: "NT", name: "Ninh Thuận", isNorth: false, isHistorical: true },
  { id: "PT", name: "Phú Thọ", isNorth: true, isHistorical: true },
  { id: "PY", name: "Phú Yên", isNorth: false, isHistorical: true },
  { id: "QB", name: "Quảng Bình", isNorth: true, isHistorical: true },
  { id: "QN", name: "Quảng Nam", isNorth: false, isHistorical: true },
  { id: "QI", name: "Quảng Ngãi", isNorth: false, isHistorical: true },
  { id: "QU", name: "Quảng Ninh", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "QT", name: "Quảng Trị", isNorth: false, isHistorical: true },
  { id: "ST", name: "Sóc Trăng", isNorth: false, isHistorical: true },
  { id: "SL", name: "Sơn La", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "TN", name: "Tây Ninh", isNorth: false, isHistorical: true },
  { id: "TB", name: "Thái Bình", isNorth: true, isHistorical: true },
  { id: "TY", name: "Thái Nguyên", isNorth: true, isHistorical: true },
  { id: "TH", name: "Thanh Hóa", isNorth: true, isHistorical: true, isConsolidated: true }, // No change in 34 plan
  { id: "TT", name: "Thừa Thiên Huế", isNorth: false, isHistorical: true },
  { id: "TG", name: "Tiền Giang", isNorth: false, isHistorical: true },
  { id: "HC", name: "TP. Hồ Chí Minh", isNorth: false, isHistorical: true },
  { id: "TV", name: "Trà Vinh", isNorth: false, isHistorical: true },
  { id: "TQ", name: "Tuyên Quang", isNorth: true, isHistorical: true },
  { id: "VL", name: "Vĩnh Long", isNorth: false, isHistorical: true },
  { id: "VP", name: "Vĩnh Phúc", isNorth: true, isHistorical: true },
  { id: "YB", name: "Yên Bái", isNorth: true, isHistorical: true },
  { id: "HGI", name: "Hậu Giang", isNorth: false, isHistorical: true },

  // --- 34 Consolidated Provinces (Post-2025) ---
  { id: "TQ_NEW", name: "Tuyên Quang (TQ + Hà Giang)", isNorth: true, isConsolidated: true },
  { id: "LO_NEW", name: "Lào Cai (LC + Yên Bái)", isNorth: true, isConsolidated: true },
  { id: "TY_NEW", name: "Thái Nguyên (TN + Bắc Kạn)", isNorth: true, isConsolidated: true },
  { id: "PT_NEW", name: "Phú Thọ (PT + Vĩnh Phúc + Hòa Bình)", isNorth: true, isConsolidated: true },
  { id: "BN_NEW", name: "Bắc Ninh (BN + Bắc Giang)", isNorth: true, isConsolidated: true },
  { id: "HY_NEW", name: "Hưng Yên (HY + Thái Bình)", isNorth: true, isConsolidated: true },
  { id: "HP_NEW", name: "TP. Hải Phòng (HP + Hải Dương)", isNorth: true, isConsolidated: true },
  { id: "NB_NEW", name: "Ninh Bình (NB + Nam Định + Hà Nam)", isNorth: true, isConsolidated: true },
  { id: "QT_NEW", name: "Quảng Trị (Quảng Bình + Quảng Trị)", isNorth: false, isConsolidated: true },
  { id: "DA_NEW", name: "TP. Đà Nẵng (ĐN + Quảng Nam)", isNorth: false, isConsolidated: true },
  { id: "QI_NEW", name: "Quảng Ngãi (QN + Kon Tum)", isNorth: false, isConsolidated: true },
  { id: "GL_NEW", name: "Gia Lai (GL + Bình Định)", isNorth: false, isConsolidated: true },
  { id: "KH_NEW", name: "Khánh Hòa (KH + Ninh Thuận)", isNorth: false, isConsolidated: true },
  { id: "LD_NEW", name: "Lâm Đồng (LĐ + Bình Thuận + Đắk Nông)", isNorth: false, isConsolidated: true },
  { id: "DL_NEW", name: "Đắk Lắk (ĐL + Phú Yên)", isNorth: false, isConsolidated: true },
  { id: "HC_NEW", name: "TP. Hồ Chí Minh (HCM + Bình Dương + Bà Rịa Vũng Tàu)", isNorth: false, isConsolidated: true },
  { id: "DO_NEW", name: "Đồng Nai (ĐN + Bình Phước)", isNorth: false, isConsolidated: true },
  { id: "TN_NEW", name: "Tây Ninh (TN + Long An)", isNorth: false, isConsolidated: true },
  { id: "CT_NEW", name: "TP. Cần Thơ (CT + Sóc Trăng + Hậu Giang)", isNorth: false, isConsolidated: true },
  { id: "VL_NEW", name: "Vĩnh Long (VL + Bến Tre + Trà Vinh)", isNorth: false, isConsolidated: true },
  { id: "DT_NEW", name: "Đồng Tháp (ĐT + Tiền Giang)", isNorth: false, isConsolidated: true },
  { id: "CM_NEW", name: "Cà Mau (CM + Bạc Liêu)", isNorth: false, isConsolidated: true },
  { id: "AG_NEW", name: "An Giang (AG + Kiên Giang)", isNorth: false, isConsolidated: true },
  { id: "HUE_NEW", name: "TP. Huế (Thừa Thiên Huế)", isNorth: false, isConsolidated: true },
];
