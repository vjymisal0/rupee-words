import { ONES } from './numbers.js';
import type { WordCase } from './types.js';

export interface ParsedAmount {
  isNegative: boolean;
  integerStr: string;
  rawDecimalStr: string;
  paise: number;
}

/**
 * Adds 1 to an arbitrarily large non-negative integer string.
 */
export function addOneToString(numStr: string): string {
  let carry = 1;
  const digits = numStr.split('').map(Number);
  for (let i = digits.length - 1; i >= 0; i--) {
    const sum = (digits[i] ?? 0) + carry;
    digits[i] = sum % 10;
    carry = Math.floor(sum / 10);
    if (carry === 0) break;
  }
  if (carry > 0) {
    digits.unshift(carry);
  }
  return digits.join('');
}

/**
 * Converts decimal digits into words (e.g. "50" -> "Point Five Zero").
 */
export function toDecimalWords(decStr: string): string {
  if (!decStr) return '';
  const words = decStr
    .split('')
    .map((d) => ONES[Number(d)] ?? '')
    .join(' ');
  return `Point ${words}`;
}

/**
 * Applies letter casing according to the specified WordCase.
 */
export function applyCase(text: string, wordCase: WordCase): string {
  switch (wordCase) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'sentence':
      if (text.length === 0) return text;
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'title':
    default:
      return text;
  }
}

/**
 * Validates and parses a number or string amount into normalized integer and paise components.
 */
export function cleanAndParseAmount(amount: number | string): ParsedAmount {
  if (amount === null || amount === undefined) {
    throw new TypeError('Amount must be a number or string');
  }

  let str: string;
  let isNegative = false;

  if (typeof amount === 'number') {
    if (Number.isNaN(amount)) {
      throw new RangeError('Amount cannot be NaN');
    }
    if (!Number.isFinite(amount)) {
      throw new RangeError('Amount must be finite');
    }
    if (amount < 0) {
      isNegative = true;
      str = String(Math.abs(amount));
    } else {
      str = String(amount);
    }
  } else if (typeof amount === 'string') {
    str = amount.trim();
    if (str === '') {
      throw new TypeError('Amount cannot be empty');
    }
    // Remove formatting commas
    str = str.replace(/,/g, '');

    // Validate number format (e.g. "123", "123.45", ".45", "-123.45", "+123")
    const match = /^([+-])?(?:\d+(?:\.\d*)?|\.\d+)$/.exec(str);
    if (!match) {
      throw new TypeError(`Invalid number format: "${amount}"`);
    }

    if (match[1] === '-') {
      isNegative = true;
    }
    // Remove leading sign
    str = str.replace(/^[+-]/, '');
  } else {
    throw new TypeError('Amount must be a number or string');
  }

  // Split integer and decimal parts
  const parts = str.split('.');
  let intPart = (parts[0] || '0').replace(/^0+/, '') || '0';
  const decPart = parts[1] || '';

  // Calculate paise (0 - 99) with standard 2-decimal rounding
  let paise = 0;
  if (decPart.length === 1) {
    paise = parseInt(decPart + '0', 10);
  } else if (decPart.length === 2) {
    paise = parseInt(decPart, 10);
  } else if (decPart.length > 2) {
    const base2 = parseInt(decPart.slice(0, 2), 10);
    const thirdDigit = parseInt(decPart[2]!, 10);
    const rounded = thirdDigit >= 5 ? base2 + 1 : base2;
    if (rounded === 100) {
      paise = 0;
      intPart = addOneToString(intPart);
    } else {
      paise = rounded;
    }
  }

  // If both integer and paise are 0, amount is zero (not negative)
  if (intPart === '0' && paise === 0) {
    isNegative = false;
  }

  return {
    isNegative,
    integerStr: intPart,
    rawDecimalStr: decPart,
    paise,
  };
}
