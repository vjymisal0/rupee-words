import { convertUpTo99, convertUpTo999, INDIAN_SCALES } from './numbers.js';
import type { IndianWordsOptions, RupeeWordsOptions, ScaleFormat } from './types.js';
import {
  applyCase,
  cleanAndParseAmount,
  toDecimalWords,
} from './utils.js';

/**
 * Converts an arbitrary non-negative integer string into Indian numbering words.
 *
 * @param intStr - Non-negative integer string (without sign or decimals).
 * @param scale - 'indian' (Arab, Kharab, Shankh) or 'crore' (repeated Crores).
 */
export function integerStringToWords(intStr: string, scale: ScaleFormat = 'indian'): string {
  let s = intStr.replace(/^0+/, '');
  if (!s || s === '0') {
    return 'Zero';
  }

  const parts: string[] = [];

  // Chunk 0: Hundreds (last 3 digits, e.g. 0-999)
  if (s.length > 0) {
    const take = Math.min(3, s.length);
    const chunkStr = s.slice(-take);
    s = s.slice(0, -take);
    const chunkVal = parseInt(chunkStr, 10);
    if (chunkVal > 0) {
      parts.unshift(convertUpTo999(chunkVal));
    }
  }

  if (scale === 'crore') {
    // Thousands (2 digits)
    if (s.length > 0) {
      const take = Math.min(2, s.length);
      const chunkStr = s.slice(-take);
      s = s.slice(0, -take);
      const chunkVal = parseInt(chunkStr, 10);
      if (chunkVal > 0) {
        parts.unshift(`${convertUpTo99(chunkVal)} Thousand`);
      }
    }
    // Lakhs (2 digits)
    if (s.length > 0) {
      const take = Math.min(2, s.length);
      const chunkStr = s.slice(-take);
      s = s.slice(0, -take);
      const chunkVal = parseInt(chunkStr, 10);
      if (chunkVal > 0) {
        parts.unshift(`${convertUpTo99(chunkVal)} Lakh`);
      }
    }
    // All remaining higher digits are expressed in Crores
    if (s.length > 0) {
      const croreWords = integerStringToWords(s, 'crore');
      parts.unshift(`${croreWords} Crore`);
    }
  } else {
    // Indian scale: Thousand, Lakh, Crore, Arab, Kharab, Neel, Padma, Shankh, Maha Shankh
    let scaleIdx = 1;
    while (s.length > 0 && scaleIdx < INDIAN_SCALES.length) {
      // If at the highest defined scale and more than 2 digits remain, format remainder recursively
      if (scaleIdx === INDIAN_SCALES.length - 1 && s.length > 2) {
        const topWords = integerStringToWords(s, 'indian');
        parts.unshift(`${topWords} ${INDIAN_SCALES[scaleIdx]}`);
        s = '';
        break;
      }
      const take = Math.min(2, s.length);
      const chunkStr = s.slice(-take);
      s = s.slice(0, -take);
      const chunkVal = parseInt(chunkStr, 10);
      if (chunkVal > 0) {
        parts.unshift(`${convertUpTo99(chunkVal)} ${INDIAN_SCALES[scaleIdx]}`);
      }
      scaleIdx++;
    }
  }

  return parts.join(' ');
}

/**
 * Converts a numeric or string monetary amount into words formatted for the Indian Rupee system.
 *
 * @example
 * ```ts
 * toRupeeWords(150245.50);
 * // => "Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only"
 *
 * toRupeeWords('.05');
 * // => "Five Paise Only"
 *
 * toRupeeWords(150000, { numberOnly: true });
 * // => "One Lakh Fifty Thousand"
 * ```
 */
export function toRupeeWords(amount: number | string, options?: RupeeWordsOptions): string {
  const {
    case: wordCase = 'title',
    showCurrency = true,
    showOnly = true,
    numberOnly = false,
    currencySingular = 'Rupee',
    currencyPlural = 'Rupees',
    fractionalSingular = 'Paisa',
    fractionalPlural = 'Paise',
    decimalConnector = 'and',
    negativePrefix = 'Minus',
    useSingular = false,
    scale = 'indian',
  } = options ?? {};

  const parsed = cleanAndParseAmount(amount);

  // Pure number mode (numberOnly = true)
  if (numberOnly) {
    let result: string;
    if (parsed.integerStr === '0' && !parsed.rawDecimalStr) {
      result = 'Zero';
    } else {
      const intWords = integerStringToWords(parsed.integerStr, scale);
      const decWords = parsed.rawDecimalStr ? toDecimalWords(parsed.rawDecimalStr) : '';

      if (parsed.integerStr === '0' && decWords) {
        result = decWords;
      } else if (decWords) {
        result = `${intWords} ${decWords}`;
      } else {
        result = intWords;
      }
    }

    if (parsed.isNegative) {
      result = `${negativePrefix} ${result}`;
    }

    return applyCase(result, wordCase);
  }

  // Currency mode (financial invoicing / cheques)
  // Handle Zero amount
  if (parsed.integerStr === '0' && parsed.paise === 0) {
    let text = showCurrency ? `Zero ${currencyPlural}` : 'Zero';
    if (showOnly) {
      text += ' Only';
    }
    return applyCase(text, wordCase);
  }

  // Handle Paise only (< 1 Rupee)
  if (parsed.integerStr === '0' && parsed.paise > 0) {
    const paiseUnit = parsed.paise === 1 ? fractionalSingular : fractionalPlural;
    let text = `${convertUpTo99(parsed.paise)} ${paiseUnit}`;
    if (parsed.isNegative) {
      text = `${negativePrefix} ${text}`;
    }
    if (showOnly) {
      text += ' Only';
    }
    return applyCase(text, wordCase);
  }

  // Amounts with Rupees (>= 1 Rupee)
  const rupeeWords = integerStringToWords(parsed.integerStr, scale);
  const rupeeUnit = useSingular && parsed.integerStr === '1' ? currencySingular : currencyPlural;

  let text = showCurrency ? `${rupeeUnit} ${rupeeWords}` : rupeeWords;

  if (parsed.paise > 0) {
    const paiseUnit = parsed.paise === 1 ? fractionalSingular : fractionalPlural;
    const paiseText = `${convertUpTo99(parsed.paise)} ${paiseUnit}`;
    text += ` ${decimalConnector} ${paiseText}`;
  }

  if (parsed.isNegative) {
    text = `${negativePrefix} ${text}`;
  }

  if (showOnly) {
    text += ' Only';
  }

  return applyCase(text, wordCase);
}

/**
 * Converts a number or numeric string into Indian words without currency names or "Only".
 *
 * @example
 * ```ts
 * toIndianWords(150000);
 * // => "One Lakh Fifty Thousand"
 *
 * toIndianWords(12345678);
 * // => "One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred Seventy-Eight"
 * ```
 */
export function toIndianWords(amount: number | string, options?: IndianWordsOptions): string {
  return toRupeeWords(amount, {
    ...options,
    numberOnly: true,
  });
}

/**
 * Alias for `toRupeeWords`.
 */
export const rupeeWords = toRupeeWords;
