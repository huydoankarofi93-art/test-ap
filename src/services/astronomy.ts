import { Solar, Lunar, I18n } from 'lunar-typescript';
import { PROVINCES } from '../constants/provinces';
import { translateGanZhi } from '../utils/lunar-vn';

// Set language to Vietnamese if supported, or use custom mapping
// lunar-typescript doesn't have native Vietnamese but we can map the outputs

export interface CanChi {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export interface SolarTermInfo {
  name: string;
  time: string;
}

export interface AstronomicalData {
  solarDate: string;
  lunarDate: string;
  canChi: CanChi;
  solarTerm: string;
  localSolarTime: string;
  elementalBalance: Record<string, number>;
}

/**
 * Normalizes birth time based on local longitude.
 * Standard time is usually based on a specific meridian (e.g., GMT+7 for Vietnam).
 * Real solar time depends on the exact longitude.
 * Formula: Local Solar Time = Standard Time + (Local Longitude - Standard Meridian Longitude) * 4 minutes
 */
export function getLocalSolarTime(date: Date, longitude: number, standardMeridian: number = 105): Date {
  const diffMinutes = (longitude - standardMeridian) * 4;
  const localTime = new Date(date.getTime() + diffMinutes * 60000);
  return localTime;
}

/**
 * Mapping of major Vietnamese cities to their longitudes.
 */
const CITY_LONGITUDES: Record<string, number> = {
  'AG': 105.1167,
  'BR': 107.0843,
  'BG': 106.2000,
  'BK': 105.8481,
  'BL': 105.7167,
  'BN': 106.0667,
  'BT': 106.3833,
  'BD': 109.2194,
  'BI': 106.6500,
  'BP': 106.8833,
  'BH': 108.1046,
  'CM': 105.1500,
  'CT': 105.7469,
  'CB': 106.2500,
  'DA': 108.2022,
  'DL': 108.0383,
  'DN': 107.6833,
  'DB': 103.0167,
  'DO': 106.8167,
  'DT': 105.6333,
  'GL': 108.0000,
  'HG': 104.9833,
  'HD': 106.3167,
  'HP': 106.6881,
  'HN': 105.8342,
  'HT': 105.8833,
  'HA': 105.9167,
  'HB': 105.3333,
  'HY': 106.0667,
  'KH': 109.1967,
  'KG': 105.0833,
  'KT': 108.0000,
  'LC': 103.9667,
  'LD': 108.4397,
  'LS': 106.7500,
  'LO': 103.9667,
  'LA': 106.4000,
  'ND': 106.1683,
  'NA': 105.6813,
  'NB': 105.9833,
  'NT': 108.1046,
  'PT': 105.2167,
  'PY': 109.2194,
  'QB': 106.6167,
  'QN': 108.3333,
  'QI': 108.8000,
  'QU': 107.0667,
  'QT': 107.1833,
  'ST': 105.9667,
  'SL': 103.9167,
  'TN': 106.1000,
  'TB': 106.3333,
  'TY': 105.8481,
  'TH': 105.7765,
  'TT': 107.5909,
  'TG': 106.3667,
  'HC': 106.6602,
  'TV': 106.3333,
  'TQ': 105.2167,
  'VL': 105.9667,
  'VP': 105.6000,
  'YB': 104.8833,
  'HGI': 105.4667,
  // Consolidated IDs (34-province plan)
  'TQ_NEW': 105.1000,
  'LO_NEW': 104.4000,
  'TY_NEW': 105.9500,
  'PT_NEW': 105.4000,
  'BN_NEW': 106.4500,
  'HY_NEW': 106.2000,
  'HP_NEW': 106.6881,
  'NB_NEW': 105.9500,
  'QT_NEW': 107.1833,
  'DA_NEW': 108.2022,
  'QI_NEW': 108.8000,
  'GL_NEW': 108.0000,
  'KH_NEW': 109.1967,
  'LD_NEW': 108.4397,
  'DL_NEW': 108.0383,
  'HC_NEW': 106.6602,
  'DO_NEW': 106.8167,
  'TN_NEW': 106.1000,
  'CT_NEW': 105.7469,
  'VL_NEW': 105.9667,
  'DT_NEW': 105.6333,
  'CM_NEW': 105.1500,
  'AG_NEW': 105.1167,
  'HUE_NEW': 107.5909,
};

/**
 * Gets longitude for a given place name or ID.
 * Falls back to 105.0 if not found.
 */
export function getLongitude(place: string): number {
  if (!place) return 105.0;
  
  // Try ID match
  if (CITY_LONGITUDES[place]) return CITY_LONGITUDES[place];
  
  // Try fuzzy match with province names
  for (const p of PROVINCES) {
    if (place.toLowerCase().includes(p.name.toLowerCase()) || (p.oldName && place.toLowerCase().includes(p.oldName.toLowerCase()))) {
      return CITY_LONGITUDES[p.id] || 105.0;
    }
  }
  
  return 105.0;
}

/**
 * Fetches accurate coordinates from Nominatim API.
 */
export async function fetchCoordinates(place: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

export function calculateAstronomy(date: Date, longitude: number = 105): AstronomicalData {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const canChi: CanChi = {
    year: translateGanZhi(lunar.getYearInGanZhi()),
    month: translateGanZhi(lunar.getMonthInGanZhi()),
    day: translateGanZhi(lunar.getDayInGanZhi()),
    hour: translateGanZhi(lunar.getTimeInGanZhi()),
  };

  const solarTerm = lunar.getJieQi();

  // Basic elemental balance calculation based on Can Chi
  // This is a simplified version for the "Scoring Module"
  const elements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
  const balance: Record<string, number> = {
    'Kim': 0, 'Mộc': 0, 'Thủy': 0, 'Hỏa': 0, 'Thổ': 0
  };

  // Map GanZhi to elements (simplified)
  const ganElements: Record<string, string> = {
    'Giáp': 'Mộc', 'Ất': 'Mộc',
    'Bính': 'Hỏa', 'Đinh': 'Hỏa',
    'Mậu': 'Thổ', 'Kỷ': 'Thổ',
    'Canh': 'Kim', 'Tân': 'Kim',
    'Nhâm': 'Thủy', 'Quý': 'Thủy'
  };

  const zhiElements: Record<string, string> = {
    'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc',
    'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ',
    'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
  };

  [canChi.year, canChi.month, canChi.day, canChi.hour].forEach(gz => {
    // gz is now translated "Gan Zhi" (e.g., "Bính Ngọ")
    const parts = gz.split(' ');
    const gan = parts[0];
    const zhi = parts[1];
    if (ganElements[gan]) balance[ganElements[gan]] += 1;
    if (zhiElements[zhi]) balance[zhiElements[zhi]] += 1;
  });

  return {
    solarDate: solar.toFullString(),
    lunarDate: lunar.toFullString(),
    canChi,
    solarTerm,
    localSolarTime: getLocalSolarTime(date, longitude).toLocaleTimeString(),
    elementalBalance: balance
  };
}
