import { describe, it, expect } from 'vitest';
import { toRupeeWords, toIndianWords, rupeeWords } from '../src/index.js';

describe('toRupeeWords - Standard amounts and formatting', () => {
  it('should convert standard amount 150245.50 as specified in prompt', () => {
    const result = toRupeeWords(150245.50);
    expect(result).toBe('Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only');
  });

  it('should convert standard string amount "150245.50"', () => {
    const result = toRupeeWords('150245.50');
    expect(result).toBe('Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only');
  });

  it('should convert single digit amounts', () => {
    expect(toRupeeWords(5)).toBe('Rupees Five Only');
    expect(toRupeeWords(9)).toBe('Rupees Nine Only');
  });

  it('should convert teen amounts', () => {
    expect(toRupeeWords(11)).toBe('Rupees Eleven Only');
    expect(toRupeeWords(14)).toBe('Rupees Fourteen Only');
    expect(toRupeeWords(19)).toBe('Rupees Nineteen Only');
  });

  it('should convert tens amounts', () => {
    expect(toRupeeWords(20)).toBe('Rupees Twenty Only');
    expect(toRupeeWords(50)).toBe('Rupees Fifty Only');
    expect(toRupeeWords(90)).toBe('Rupees Ninety Only');
  });

  it('should convert compound two-digit amounts with hyphenation', () => {
    expect(toRupeeWords(21)).toBe('Rupees Twenty-One Only');
    expect(toRupeeWords(45)).toBe('Rupees Forty-Five Only');
    expect(toRupeeWords(99)).toBe('Rupees Ninety-Nine Only');
  });

  it('should convert hundreds amounts', () => {
    expect(toRupeeWords(100)).toBe('Rupees One Hundred Only');
    expect(toRupeeWords(500)).toBe('Rupees Five Hundred Only');
    expect(toRupeeWords(999)).toBe('Rupees Nine Hundred Ninety-Nine Only');
  });

  it('should convert thousands amounts', () => {
    expect(toRupeeWords(1000)).toBe('Rupees One Thousand Only');
    expect(toRupeeWords(15000)).toBe('Rupees Fifteen Thousand Only');
    expect(toRupeeWords(75050)).toBe('Rupees Seventy-Five Thousand Fifty Only');
  });

  it('should convert lakhs amounts', () => {
    expect(toRupeeWords(100000)).toBe('Rupees One Lakh Only');
    expect(toRupeeWords(2500000)).toBe('Rupees Twenty-Five Lakh Only');
  });

  it('should support rupeeWords alias', () => {
    expect(rupeeWords(150245.50)).toBe(
      'Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });
});

describe('toRupeeWords - Decimal paise handling', () => {
  it('should handle decimal .05 as "Five Paise Only"', () => {
    expect(toRupeeWords('.05')).toBe('Five Paise Only');
    expect(toRupeeWords(0.05)).toBe('Five Paise Only');
  });

  it('should handle decimal .50 as "Fifty Paise Only"', () => {
    expect(toRupeeWords('.50')).toBe('Fifty Paise Only');
    expect(toRupeeWords(0.50)).toBe('Fifty Paise Only');
  });

  it('should handle decimal .5 as "Fifty Paise Only"', () => {
    expect(toRupeeWords('.5')).toBe('Fifty Paise Only');
    expect(toRupeeWords(0.5)).toBe('Fifty Paise Only');
  });

  it('should handle singular paisa (0.01 -> One Paisa Only)', () => {
    expect(toRupeeWords(0.01)).toBe('One Paisa Only');
    expect(toRupeeWords('0.01')).toBe('One Paisa Only');
  });

  it('should handle 1 Rupee with 1 Paisa', () => {
    expect(toRupeeWords(1.01)).toBe('Rupees One and One Paisa Only');
  });

  it('should round fractions with more than 2 decimal digits', () => {
    expect(toRupeeWords('100.505')).toBe('Rupees One Hundred and Fifty-One Paise Only');
    expect(toRupeeWords('100.504')).toBe('Rupees One Hundred and Fifty Paise Only');
    // Rounding 99.999 rolls over to 100
    expect(toRupeeWords('99.999')).toBe('Rupees One Hundred Only');
  });
});

describe('toRupeeWords - Options: case', () => {
  const amount = 150245.50;

  it('should handle case: "title" (default)', () => {
    expect(toRupeeWords(amount, { case: 'title' })).toBe(
      'Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });

  it('should handle case: "upper"', () => {
    expect(toRupeeWords(amount, { case: 'upper' })).toBe(
      'RUPEES ONE LAKH FIFTY THOUSAND TWO HUNDRED FORTY-FIVE AND FIFTY PAISE ONLY'
    );
  });

  it('should handle case: "lower"', () => {
    expect(toRupeeWords(amount, { case: 'lower' })).toBe(
      'rupees one lakh fifty thousand two hundred forty-five and fifty paise only'
    );
  });

  it('should handle case: "sentence"', () => {
    expect(toRupeeWords(amount, { case: 'sentence' })).toBe(
      'Rupees one lakh fifty thousand two hundred forty-five and fifty paise only'
    );
  });
});

describe('toRupeeWords - Options: showCurrency, showOnly, numberOnly', () => {
  const amount = 150245.50;

  it('should omit currency name when showCurrency is false', () => {
    expect(toRupeeWords(amount, { showCurrency: false })).toBe(
      'One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });

  it('should omit "Only" when showOnly is false', () => {
    expect(toRupeeWords(amount, { showOnly: false })).toBe(
      'Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise'
    );
  });

  it('should omit both currency and "Only" when showCurrency & showOnly are false', () => {
    expect(toRupeeWords(amount, { showCurrency: false, showOnly: false })).toBe(
      'One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise'
    );
  });

  it('should convert pure numbers when numberOnly is true', () => {
    expect(toRupeeWords(150000, { numberOnly: true })).toBe('One Lakh Fifty Thousand');
    expect(toRupeeWords('150245.50', { numberOnly: true })).toBe(
      'One Lakh Fifty Thousand Two Hundred Forty-Five Point Five Zero'
    );
  });

  it('toIndianWords helper should return pure number words', () => {
    expect(toIndianWords(150000)).toBe('One Lakh Fifty Thousand');
    expect(toIndianWords(2500000)).toBe('Twenty-Five Lakh');
  });

  it('should support useSingular for exact amount 1', () => {
    expect(toRupeeWords(1)).toBe('Rupees One Only');
    expect(toRupeeWords(1, { useSingular: true })).toBe('Rupee One Only');
  });
});
