import { describe, it, expect } from 'vitest';
import { toRupeeWords } from '../src/index.js';

describe('toRupeeWords - Zero and negative handling', () => {
  it('should handle zero number (0)', () => {
    expect(toRupeeWords(0)).toBe('Zero Rupees Only');
  });

  it('should handle zero string ("0")', () => {
    expect(toRupeeWords('0')).toBe('Zero Rupees Only');
  });

  it('should handle zero decimal string ("0.00", ".00", "000")', () => {
    expect(toRupeeWords('0.00')).toBe('Zero Rupees Only');
    expect(toRupeeWords('.00')).toBe('Zero Rupees Only');
    expect(toRupeeWords('000')).toBe('Zero Rupees Only');
  });

  it('should handle zero with showOnly: false', () => {
    expect(toRupeeWords(0, { showOnly: false })).toBe('Zero Rupees');
  });

  it('should handle zero with showCurrency: false', () => {
    expect(toRupeeWords(0, { showCurrency: false })).toBe('Zero Only');
  });

  it('should handle zero with numberOnly: true', () => {
    expect(toRupeeWords(0, { numberOnly: true })).toBe('Zero');
  });

  it('should not mark -0 or "-0.00" as negative', () => {
    expect(toRupeeWords(-0)).toBe('Zero Rupees Only');
    expect(toRupeeWords('-0')).toBe('Zero Rupees Only');
    expect(toRupeeWords('-0.00')).toBe('Zero Rupees Only');
  });

  it('should convert negative amounts as specified in prompt ("Minus Rupees ...")', () => {
    expect(toRupeeWords(-150245.50)).toBe(
      'Minus Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
    expect(toRupeeWords('-150245.50')).toBe(
      'Minus Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });

  it('should convert negative paise only', () => {
    expect(toRupeeWords(-0.50)).toBe('Minus Fifty Paise Only');
    expect(toRupeeWords('-0.05')).toBe('Minus Five Paise Only');
  });

  it('should convert negative integers', () => {
    expect(toRupeeWords(-500)).toBe('Minus Rupees Five Hundred Only');
  });

  it('should support custom negative prefix', () => {
    expect(toRupeeWords(-500, { negativePrefix: 'Negative' })).toBe(
      'Negative Rupees Five Hundred Only'
    );
  });
});

describe('toRupeeWords - Formatting tolerance (commas, spaces, signs)', () => {
  it('should handle Indian comma-formatted strings', () => {
    expect(toRupeeWords('1,50,245.50')).toBe(
      'Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });

  it('should handle Western comma-formatted strings', () => {
    expect(toRupeeWords('150,245.50')).toBe(
      'Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });

  it('should handle leading and trailing whitespace', () => {
    expect(toRupeeWords('   150245.50   ')).toBe(
      'Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });

  it('should handle explicit positive sign', () => {
    expect(toRupeeWords('+150245.50')).toBe(
      'Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only'
    );
  });

  it('should handle numbers starting directly with decimal point', () => {
    expect(toRupeeWords('.75')).toBe('Seventy-Five Paise Only');
    expect(toRupeeWords('+.25')).toBe('Twenty-Five Paise Only');
    expect(toRupeeWords('-.25')).toBe('Minus Twenty-Five Paise Only');
  });
});

describe('toRupeeWords - Error handling & validation', () => {
  it('should throw TypeError on empty string or whitespace-only string', () => {
    expect(() => toRupeeWords('')).toThrow(TypeError);
    expect(() => toRupeeWords('   ')).toThrow(TypeError);
  });

  it('should throw TypeError on non-numeric string', () => {
    expect(() => toRupeeWords('abc')).toThrow(TypeError);
    expect(() => toRupeeWords('12.34.56')).toThrow(TypeError);
    expect(() => toRupeeWords('12a34')).toThrow(TypeError);
  });

  it('should throw RangeError on NaN', () => {
    expect(() => toRupeeWords(NaN)).toThrow(RangeError);
  });

  it('should throw RangeError on Infinity or -Infinity', () => {
    expect(() => toRupeeWords(Infinity)).toThrow(RangeError);
    expect(() => toRupeeWords(-Infinity)).toThrow(RangeError);
  });

  it('should throw TypeError on invalid types like boolean or object', () => {
    expect(() => toRupeeWords(true as unknown as number)).toThrow(TypeError);
    expect(() => toRupeeWords({} as unknown as number)).toThrow(TypeError);
  });

  it('should handle pure decimal in numberOnly mode', () => {
    expect(toRupeeWords('.50', { numberOnly: true })).toBe('Point Five Zero');
    expect(toRupeeWords(-150, { numberOnly: true })).toBe('Minus One Hundred Fifty');
  });

  it('should handle zero thousands/lakhs in crore scale', () => {
    // 10,00,00,000 has 0 thousands and 0 lakhs
    expect(toRupeeWords('100000000', { scale: 'crore' })).toBe('Rupees Ten Crore Only');
  });
});
