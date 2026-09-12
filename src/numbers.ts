export const ONES: readonly string[] = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

export const TENS: readonly string[] = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

/**
 * Traditional Indian numbering scale denominations:
 * - 10^3: Thousand
 * - 10^5: Lakh
 * - 10^7: Crore
 * - 10^9: Arab
 * - 10^11: Kharab
 * - 10^13: Neel
 * - 10^15: Padma
 * - 10^17: Shankh
 * - 10^19: Maha Shankh
 */
export const INDIAN_SCALES: readonly string[] = [
  '',
  'Thousand',
  'Lakh',
  'Crore',
  'Arab',
  'Kharab',
  'Neel',
  'Padma',
  'Shankh',
  'Maha Shankh',
];

/**
 * Converts a number from 0 to 99 into words with hyphenation (e.g. Twenty-One, Forty-Five).
 */
export function convertUpTo99(n: number): string {
  if (n < 20) {
    return ONES[n] ?? '';
  }
  const tens = Math.floor(n / 10);
  const units = n % 10;
  const tensWord = TENS[tens] ?? '';
  if (units === 0) {
    return tensWord;
  }
  return `${tensWord}-${ONES[units]}`;
}

/**
 * Converts a number from 0 to 999 into words (e.g. Two Hundred Forty-Five).
 */
export function convertUpTo999(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rem = n % 100;

  if (hundreds > 0) {
    const hWord = `${ONES[hundreds]} Hundred`;
    if (rem > 0) {
      return `${hWord} ${convertUpTo99(rem)}`;
    }
    return hWord;
  }

  return convertUpTo99(rem);
}
