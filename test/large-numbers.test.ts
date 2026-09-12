import { describe, it, expect } from 'vitest';
import { toRupeeWords, toIndianWords } from '../src/index.js';

describe('toRupeeWords - Indian numbering system scale (Crore, Arab, Kharab, Shankh)', () => {
  it('should convert Crores (10^7)', () => {
    expect(toRupeeWords(10000000)).toBe('Rupees One Crore Only');
    expect(toRupeeWords('10000000')).toBe('Rupees One Crore Only');
    expect(toRupeeWords(500000000)).toBe('Rupees Fifty Crore Only');
  });

  it('should convert Arab (10^9)', () => {
    // 1 Arab = 100 Crore = 1,00,00,00,000
    expect(toRupeeWords('1000000000')).toBe('Rupees One Arab Only');
    expect(toRupeeWords('25000000000')).toBe('Rupees Twenty-Five Arab Only');
  });

  it('should convert Kharab (10^11)', () => {
    // 1 Kharab = 100 Arab = 10,000 Crore = 1,00,00,00,00,000
    expect(toRupeeWords('100000000000')).toBe('Rupees One Kharab Only');
    expect(toRupeeWords('7000000000000')).toBe('Rupees Seventy Kharab Only');
  });

  it('should convert Neel (10^13)', () => {
    expect(toRupeeWords('10000000000000')).toBe('Rupees One Neel Only');
  });

  it('should convert Padma (10^15)', () => {
    expect(toRupeeWords('1000000000000000')).toBe('Rupees One Padma Only');
  });

  it('should convert Shankh (10^17)', () => {
    expect(toRupeeWords('100000000000000000')).toBe('Rupees One Shankh Only');
    expect(toRupeeWords('9900000000000000000')).toBe('Rupees Ninety-Nine Shankh Only');
    expect(toRupeeWords('990000000000000000')).toBe('Rupees Nine Shankh Ninety Padma Only');
  });

  it('should convert Maha Shankh (10^19)', () => {
    expect(toRupeeWords('10000000000000000000')).toBe('Rupees One Maha Shankh Only');
  });

  it('should accurately convert complex multi-denomination amounts', () => {
    // 1 Arab, 23 Crore, 45 Lakh, 67 Thousand, 8 Hundred 90
    // 1,23,45,67,890
    const str = '1234567890';
    expect(toRupeeWords(str)).toBe(
      'Rupees One Arab Twenty-Three Crore Forty-Five Lakh Sixty-Seven Thousand Eight Hundred Ninety Only'
    );
  });

  it('should support alternative scale="crore" for business and budget reporting', () => {
    // 1,00,00,00,000 in crore scale is "One Hundred Crore"
    expect(toRupeeWords('1000000000', { scale: 'crore' })).toBe('Rupees One Hundred Crore Only');

    // 1,00,000 Crore (10^12)
    expect(toIndianWords('1000000000000', { scale: 'crore' })).toBe('One Lakh Crore');
  });

  it('should handle arbitrarily large string amounts without JS float precision loss', () => {
    const huge = '9999999999999999999999.50';
    const words = toRupeeWords(huge);
    expect(words).toContain('Rupees');
    expect(words).toContain('Fifty Paise Only');
    expect(words).not.toContain('NaN');
    expect(words).not.toContain('undefined');
  });
});
