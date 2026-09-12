import { describe, it, expect } from 'vitest';
import { toRupeeWords } from '../src/index.js';

describe('GST Invoicing & Cheque writing scenarios', () => {
  it('GST Invoice Item: ₹18,450.00 with 18% GST (₹3,321.00) = ₹21,771.00', () => {
    const totalAmount = 21771.0;
    const words = toRupeeWords(totalAmount);
    expect(words).toBe('Rupees Twenty-One Thousand Seven Hundred Seventy-One Only');
  });

  it('GST Invoice with fractional paise: Subtotal ₹45,210.35 + CGST ₹4,068.93 + SGST ₹4,068.93 = ₹53,348.21', () => {
    const total = '53348.21';
    const words = toRupeeWords(total);
    expect(words).toBe(
      'Rupees Fifty-Three Thousand Three Hundred Forty-Eight and Twenty-One Paise Only'
    );
  });

  it('Cheque with pre-printed "Rupees" word', () => {
    // Physical cheques often have "Rupees" pre-printed, so showCurrency: false is used
    const chequeAmount = 750000; // ₹7,50,000
    const words = toRupeeWords(chequeAmount, { showCurrency: false });
    expect(words).toBe('Seven Lakh Fifty Thousand Only');
  });

  it('Corporate B2B Invoice: ₹1,50,00,000 (1.5 Crore)', () => {
    const words = toRupeeWords('15000000.00');
    expect(words).toBe('Rupees One Crore Fifty Lakh Only');
  });

  it('Export Invoice Upper Case convention', () => {
    const words = toRupeeWords('89450.75', { case: 'upper' });
    expect(words).toBe(
      'RUPEES EIGHTY-NINE THOUSAND FOUR HUNDRED FIFTY AND SEVENTY-FIVE PAISE ONLY'
    );
  });

  it('TDS Deduction / Credit Note Negative Invoice', () => {
    const creditNoteAmount = -4500;
    const words = toRupeeWords(creditNoteAmount);
    expect(words).toBe('Minus Rupees Four Thousand Five Hundred Only');
  });
});
