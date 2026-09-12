/**
 * Case formatting styles for rupee words.
 */
export type WordCase = 'title' | 'upper' | 'lower' | 'sentence';

/**
 * Scale formatting style for amounts exceeding Crores:
 * - 'indian': Uses traditional Vedic Indian scale (Arab, Kharab, Neel, Padma, Shankh).
 * - 'crore': Uses aggregated Crores scale (e.g., 'One Hundred Crore', 'One Lakh Crore').
 */
export type ScaleFormat = 'indian' | 'crore';

/**
 * Configuration options for `toRupeeWords`.
 */
export interface RupeeWordsOptions {
  /**
   * Casing style for output words.
   * - 'title': "Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only"
   * - 'upper': "RUPEES ONE LAKH FIFTY THOUSAND TWO HUNDRED FORTY-FIVE AND FIFTY PAISE ONLY"
   * - 'lower': "rupees one lakh fifty thousand two hundred forty-five and fifty paise only"
   * - 'sentence': "Rupees one lakh fifty thousand two hundred forty-five and fifty paise only"
   * @default 'title'
   */
  case?: WordCase;

  /**
   * Whether to include the currency prefix ("Rupees" or "Rupee").
   * @default true
   */
  showCurrency?: boolean;

  /**
   * Whether to append "Only" at the end of the text.
   * Standard for Indian banking cheques and GST invoices to prevent tampering.
   * @default true
   */
  showOnly?: boolean;

  /**
   * If true, converts a pure number to Indian words without currency names ("Rupees", "Paise") or "Only".
   * E.g. `150000` -> `"One Lakh Fifty Thousand"`.
   * @default false
   */
  numberOnly?: boolean;

  /**
   * Currency name in singular.
   * @default 'Rupee'
   */
  currencySingular?: string;

  /**
   * Currency name in plural.
   * @default 'Rupees'
   */
  currencyPlural?: string;

  /**
   * Fractional currency name in singular.
   * @default 'Paisa'
   */
  fractionalSingular?: string;

  /**
   * Fractional currency name in plural.
   * @default 'Paise'
   */
  fractionalPlural?: string;

  /**
   * Conjunction word between Rupee and Paise parts.
   * @default 'and'
   */
  decimalConnector?: string;

  /**
   * Prefix for negative amounts.
   * @default 'Minus'
   */
  negativePrefix?: string;

  /**
   * Whether to use singular currency name ("Rupee") when amount is exactly 1.
   * If false, defaults to "Rupees" as per standard banking cheque notation.
   * @default false
   */
  useSingular?: boolean;

  /**
   * Scale format for very large numbers beyond Crore.
   * - 'indian': Uses Arab, Kharab, Neel, Padma, Shankh (Default)
   * - 'crore': Expresses large numbers in terms of Crores (e.g. "One Lakh Crore")
   * @default 'indian'
   */
  scale?: ScaleFormat;
}

/**
 * Configuration options for `toIndianWords` (pure number converter).
 */
export type IndianWordsOptions = Omit<RupeeWordsOptions, 'showCurrency' | 'showOnly' | 'numberOnly'>;
