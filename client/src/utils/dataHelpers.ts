/**
 * dataHelpers.ts - Data transformation utilities
 * Prevents "string as boolean" crashes on Android/iOS native bridge
 */

/**
 * Strictly parses a value to boolean.
 * Returns true ONLY if value is boolean `true` or string `"true"`.
 * Returns false for everything else including `"false"`, `0`, `undefined`, `null`, etc.
 * 
 * This prevents the Android crash: "java.lang.String cannot be cast to java.lang.Boolean"
 * which occurs when Boolean("false") returns true (non-empty string is truthy).
 * 
 * @param value - Any value to parse
 * @returns boolean - Strict boolean result
 * 
 * @example
 * parseBoolean(true)       // true
 * parseBoolean("true")     // true
 * parseBoolean("TRUE")     // true
 * parseBoolean(false)      // false
 * parseBoolean("false")    // false ← This is the key fix! Boolean("false") would return true
 * parseBoolean("FALSE")    // false
 * parseBoolean(undefined)  // false
 * parseBoolean(null)       // false
 * parseBoolean(0)          // false
 * parseBoolean(1)          // false
 * parseBoolean("")         // false
 * parseBoolean("random")   // false
 */
export function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
}

/**
 * Safely converts a value to a number with a fallback default.
 * 
 * @param value - Any value to parse
 * @param defaultValue - Fallback if parsing fails (default: 0)
 * @returns number - Parsed number or default
 * 
 * @example
 * parseNumber("42")        // 42
 * parseNumber(42)          // 42
 * parseNumber("invalid")   // 0
 * parseNumber(null, 10)    // 10
 */
export function parseNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Safely converts a value to a string.
 * 
 * @param value - Any value to convert
 * @param defaultValue - Fallback if value is null/undefined (default: '')
 * @returns string - String representation
 * 
 * @example
 * parseString("hello")     // "hello"
 * parseString(42)          // "42"
 * parseString(null)        // ""
 * parseString(undefined)   // ""
 */
export function parseString(value: unknown, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Clamps a number between min and max values.
 * 
 * @param value - The number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns number - Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a price with currency symbol.
 * 
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns string - Formatted price
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    SEK: 'kr',
    TRY: '₺',
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Truncates text to a maximum length with ellipsis.
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns string - Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
