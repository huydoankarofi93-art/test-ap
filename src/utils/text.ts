/**
 * Trims text to the last complete sentence within a maximum length.
 * Ensures the output doesn't end mid-sentence.
 */
export function trimToLastSentence(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  
  // Find the last sentence-ending punctuation
  const lastDot = trimmed.lastIndexOf(".");
  const lastExclamation = trimmed.lastIndexOf("!");
  const lastQuestion = trimmed.lastIndexOf("?");
  const lastNewline = trimmed.lastIndexOf("\n");
  
  const lastEnd = Math.max(lastDot, lastExclamation, lastQuestion, lastNewline);
  
  if (lastEnd > maxLength * 0.5) {
    return trimmed.slice(0, lastEnd + 1).trim();
  }
  
  // Fallback if no punctuation found in the last half of the trimmed text
  return trimmed.trim() + "...";
}

/**
 * Checks if a text ends with proper punctuation. 
 * If not, it attempts to trim to the last sentence or adds an ellipsis.
 */
export function ensureCompleteSentence(text: string): string {
  if (!text) return text;
  const trimmed = text.trim();
  
  // Common ending characters for a complete response
  const validEndings = [".", "!", "?", "}", "]", ")", '"', "'", "。", "！", "？"];
  const lastChar = trimmed.slice(-1);
  
  if (validEndings.includes(lastChar)) return trimmed;
  
  // If it ends with a markdown header or list item, it might be okay but let's be safe
  if (trimmed.endsWith("**") || trimmed.endsWith("__") || trimmed.endsWith("`")) return trimmed;

  // Find the last sentence-ending punctuation
  const lastDot = trimmed.lastIndexOf(".");
  const lastExclamation = trimmed.lastIndexOf("!");
  const lastQuestion = trimmed.lastIndexOf("?");
  
  const lastEnd = Math.max(lastDot, lastExclamation, lastQuestion);
  
  // If we found a punctuation mark relatively close to the end, trim to it
  if (lastEnd !== -1 && lastEnd > trimmed.length * 0.8) {
    return trimmed.slice(0, lastEnd + 1);
  }
  
  // Otherwise, just add an ellipsis to indicate it was cut off
  return trimmed + "...";
}
