/**
 * Sanitizes user input to prevent prompt injection and ensure data integrity.
 */
export function sanitizeInput(text: string | undefined | null, maxLength: number = 5000): string {
  if (!text) return '';
  
  // 1. Limit length
  let sanitized = text.substring(0, maxLength);
  
  // 2. Remove potentially dangerous characters that could be used for prompt injection
  // We remove backticks, triple quotes, and other common delimiters used in prompts
  sanitized = sanitized.replace(/[`"'{}[\]\\]/g, '');
  
  // 4. Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  return sanitized;
}

/**
 * Validates if a string is a valid name (Vietnamese characters, spaces, no special chars)
 */
export function isValidName(name: string): boolean {
  if (!name) return false;
  // Allows Vietnamese characters, letters, and spaces
  const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
  return nameRegex.test(name) && name.length <= 100;
}

/**
 * Validates birth year
 */
export function isValidYear(year: string): boolean {
  const y = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  return !isNaN(y) && y >= 1900 && y <= currentYear + 10;
}
