
/**
 * Pythagorean Numerology Service
 * Calculates core numbers based on birth date and full name.
 */

const PYTHAGOREAN_MAP: Record<string, number> = {
  'A': 1, 'J': 1, 'S': 1,
  'B': 2, 'K': 2, 'T': 2,
  'C': 3, 'L': 3, 'U': 3,
  'D': 4, 'M': 4, 'V': 4,
  'E': 5, 'N': 5, 'W': 5,
  'F': 6, 'O': 6, 'X': 6,
  'G': 7, 'P': 7, 'Y': 7,
  'H': 8, 'Q': 8, 'Z': 8,
  'I': 9, 'R': 9
};

const VOWELS = ['A', 'E', 'I', 'O', 'U', 'Y'];

/**
 * Reduces a number to a single digit or a master number (11, 22, 33).
 */
function reduceNumber(num: number, allowMaster: boolean = true): number {
  if (allowMaster && [11, 22, 33].includes(num)) {
    return num;
  }
  
  if (num < 10) return num;
  
  const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceNumber(sum, allowMaster);
}

/**
 * Normalizes Vietnamese name (removes accents and converts to uppercase).
 */
function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

export interface NumerologyData {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  attitude: number;
  maturity: number;
}

export function calculateNumerology(fullName: string, birthDate: string): NumerologyData {
  const normalizedName = normalizeName(fullName);
  const dateParts = birthDate.split('-'); // YYYY-MM-DD
  
  if (dateParts.length !== 3) {
    return {
      lifePath: 0,
      expression: 0,
      soulUrge: 0,
      personality: 0,
      birthday: 0,
      attitude: 0,
      maturity: 0
    };
  }

  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[2]);

  // 1. Life Path (Sum of day, month, year reduced separately then summed)
  const reducedDay = reduceNumber(day);
  const reducedMonth = reduceNumber(month);
  const reducedYear = reduceNumber(year);
  const lifePath = reduceNumber(reducedDay + reducedMonth + reducedYear);

  // 2. Expression (All letters)
  let expressionSum = 0;
  for (const char of normalizedName) {
    expressionSum += PYTHAGOREAN_MAP[char] || 0;
  }
  const expression = reduceNumber(expressionSum);

  // 3. Soul Urge (Vowels)
  let soulUrgeSum = 0;
  for (const char of normalizedName) {
    if (VOWELS.includes(char)) {
      soulUrgeSum += PYTHAGOREAN_MAP[char] || 0;
    }
  }
  const soulUrge = reduceNumber(soulUrgeSum);

  // 4. Personality (Consonants)
  let personalitySum = 0;
  for (const char of normalizedName) {
    if (!VOWELS.includes(char)) {
      personalitySum += PYTHAGOREAN_MAP[char] || 0;
    }
  }
  const personality = reduceNumber(personalitySum);

  // 5. Birthday Number
  const birthday = reduceNumber(day, false); // Usually not master

  // 6. Attitude Number (Day + Month)
  const attitude = reduceNumber(day + month);

  // 7. Maturity Number (Life Path + Expression)
  const maturity = reduceNumber(lifePath + expression);

  return {
    lifePath,
    expression,
    soulUrge,
    personality,
    birthday,
    attitude,
    maturity
  };
}
