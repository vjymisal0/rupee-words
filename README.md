# rupee-words

[![npm version](https://img.shields.io/npm/v/rupee-words.svg?color=cb3837&style=flat-square)](https://www.npmjs.com/package/rupee-words)
[![CI](https://github.com/vjymisal0/rupee-words/actions/workflows/ci.yml/badge.svg)](https://github.com/vjymisal0/rupee-words/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/rupee-words?color=success&style=flat-square)](https://bundlephobia.com/package/rupee-words)
[![types](https://img.shields.io/badge/types-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg?style=flat-square)](https://www.npmjs.com/package/rupee-words)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/vjymisal0/rupee-words/pulls)

> **Zero-dependency, ultra-fast number-to-words converter tailored for the Indian numbering system and Indian Rupee financial invoicing (GST invoices, cheques, receipts, e-commerce).**

Converts currency amounts and numbers into standard Indian English words adhering to Reserve Bank of India (RBI) cheque norms, Indian Banking standards, and GST (Goods and Services Tax) invoice conventions.

---

## ✨ Features

- 🇮🇳 **Indian Numbering Scale**: Native support for **Lakhs**, **Crores**, **Arab**, **Kharab**, **Neel**, **Padma**, **Shankh**, and **Maha Shankh**.
- 🧮 **Arbitrarily Large Numbers**: Supports `string` inputs to completely avoid JavaScript IEEE 754 float precision loss on massive numbers.
- 🧾 **GST & Cheque Compliant**: Formats as standard banking convention: `"Rupees ... Only"` with fractional Paise.
- 🪙 **Accurate Paise Handling**: Accurately formats single-digit paise (`.05` -> `"Five Paise Only"`), double-digit paise (`.50` -> `"Fifty Paise Only"`), and fractional rounding (`99.999` -> `"Rupees One Hundred Only"`).
- 🔠 **Multiple Case Formats**: Supports `'title'`, `'upper'`, `'lower'`, and `'sentence'` casing.
- ➖ **Negative Numbers**: Financial negative / credit note amounts (`"Minus Rupees ..."` or configurable).
- ⚡ **Zero Dependencies & Lightweight**: Under 3 KB minzipped, zero runtime dependencies.
- 📦 **Dual ESM & CommonJS**: Full tree-shaking support with first-class TypeScript declarations (`.d.ts` and `.d.cts`).

---

## 📦 Installation

```bash
npm install rupee-words
```

Or using your favorite package manager:

```bash
pnpm add rupee-words
# or
yarn add rupee-words
# or
bun add rupee-words
```

---

## 🚀 Quick Start

### ESM / TypeScript
```typescript
import { toRupeeWords } from 'rupee-words';

console.log(toRupeeWords(150245.50));
// "Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only"
```

### CommonJS
```javascript
const { toRupeeWords } = require('rupee-words');

console.log(toRupeeWords('150245.50'));
// "Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only"
```

---

## 💡 Practical Examples

### 1. Indian GST Tax Invoicing

Standard Indian tax invoices require the total payable amount in words at the bottom of the invoice:

```typescript
import { toRupeeWords } from 'rupee-words';

interface InvoiceSummary {
  subtotal: number;
  cgst: number; // 9%
  sgst: number; // 9%
}

function generateInvoiceFooter(summary: InvoiceSummary) {
  const total = summary.subtotal + summary.cgst + summary.sgst;
  const amountInWords = toRupeeWords(total);

  return {
    grandTotal: total.toFixed(2),
    amountInWords, // e.g. "Rupees Twenty-One Thousand Seven Hundred Seventy-One Only"
  };
}

console.log(generateInvoiceFooter({ subtotal: 18450, cgst: 1660.50, sgst: 1660.50 }));
// {
//   grandTotal: "21771.00",
//   amountInWords: "Rupees Twenty-One Thousand Seven Hundred Seventy-One Only"
// }
```

### 2. Bank Cheque Writing

Physical cheque leaves in India usually have the word **"Rupees / रुपये"** pre-printed on the line. You can disable the prefix with `{ showCurrency: false }`:

```typescript
import { toRupeeWords } from 'rupee-words';

// ₹7,50,000 for a supplier cheque
const chequeText = toRupeeWords(750000, { showCurrency: false });
console.log(chequeText);
// "Seven Lakh Fifty Thousand Only"
```

### 3. Pure Indian Number-to-Words (`numberOnly` or `toIndianWords`)

When writing reports, count of units, or non-currency quantities in the Indian numbering system:

```typescript
import { toIndianWords } from 'rupee-words';

console.log(toIndianWords(150000));
// "One Lakh Fifty Thousand"

console.log(toIndianWords(12345678));
// "One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred Seventy-Eight"
```

### 4. Decimal Paise Handling

Accurately formats decimal fractions and avoids awkward phrases like `"Zero Rupees and Five Paise"`:

```typescript
toRupeeWords('.05');
// "Five Paise Only"

toRupeeWords('.50');
// "Fifty Paise Only"

toRupeeWords('0.01');
// "One Paisa Only"  (singular 'Paisa')

toRupeeWords('1.01');
// "Rupees One and One Paisa Only"

toRupeeWords(0);
// "Zero Rupees Only"
```

### 5. Large Denominations (Crore, Arab, Kharab, Shankh)

Supports the traditional Indian numbering scale:

```typescript
// 1 Crore (10^7)
toRupeeWords(10000000);
// "Rupees One Crore Only"

// 1 Arab (10^9) = 100 Crore
toRupeeWords('1000000000');
// "Rupees One Arab Only"

// 1 Kharab (10^11) = 10,000 Crore
toRupeeWords('100000000000');
// "Rupees One Kharab Only"

// 1 Shankh (10^17)
toRupeeWords('100000000000000000');
// "Rupees One Shankh Only"
```

#### Modern Budget / Business Scale (`scale: 'crore'`)
For Union Budget speeches and corporate financial statements that express large numbers in repeated Crores (e.g., "One Hundred Crore" or "One Lakh Crore"):

```typescript
toRupeeWords('1000000000', { scale: 'crore' });
// "Rupees One Hundred Crore Only"

toIndianWords('1000000000000', { scale: 'crore' });
// "One Lakh Crore"
```

### 6. Letter Casing

```typescript
const amount = 150245.50;

// Default: 'title'
toRupeeWords(amount, { case: 'title' });
// "Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only"

// All Upper Case (common in export shipping bills and customs declarations)
toRupeeWords(amount, { case: 'upper' });
// "RUPEES ONE LAKH FIFTY THOUSAND TWO HUNDRED FORTY-FIVE AND FIFTY PAISE ONLY"

// Lower Case
toRupeeWords(amount, { case: 'lower' });
// "rupees one lakh fifty thousand two hundred forty-five and fifty paise only"

// Sentence Case
toRupeeWords(amount, { case: 'sentence' });
// "Rupees one lakh fifty thousand two hundred forty-five and fifty paise only"
```

### 7. Negative Values (Credit Notes / Refunds)

```typescript
toRupeeWords(-150245.50);
// "Minus Rupees One Lakh Fifty Thousand Two Hundred Forty-Five and Fifty Paise Only"

toRupeeWords(-500, { negativePrefix: 'Negative' });
// "Negative Rupees Five Hundred Only"
```

---

## ⚙️ Options Reference

`toRupeeWords(amount, options)` accepts the following options:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `case` | `'title' \| 'upper' \| 'lower' \| 'sentence'` | `'title'` | Casing style for the output words. |
| `showCurrency` | `boolean` | `true` | Whether to include the currency prefix (`"Rupees"` or `"Rupee"`). |
| `showOnly` | `boolean` | `true` | Whether to append `"Only"` at the end (standard cheque/invoice tamper prevention). |
| `numberOnly` | `boolean` | `false` | If `true`, returns pure number in Indian words without `"Rupees"`, `"Paise"`, or `"Only"`. |
| `scale` | `'indian' \| 'crore'` | `'indian'` | Scale beyond Crore: `'indian'` (Arab, Kharab, Shankh) or `'crore'` (One Hundred Crore, One Lakh Crore). |
| `useSingular` | `boolean` | `false` | If `true`, uses singular `"Rupee"` when the whole rupee amount is `1`. |
| `negativePrefix` | `string` | `'Minus'` | Prefix word for negative monetary amounts. |
| `currencySingular` | `string` | `'Rupee'` | Custom singular currency name. |
| `currencyPlural` | `string` | `'Rupees'` | Custom plural currency name. |
| `fractionalSingular` | `string` | `'Paisa'` | Custom singular fractional currency name. |
| `fractionalPlural` | `string` | `'Paise'` | Custom plural fractional currency name. |
| `decimalConnector` | `string` | `'and'` | Conjunction word connecting Rupees and Paise. |

---

## ⚡ Performance & Benchmarks

`rupee-words` is built from scratch for high-throughput fintech pipelines, web servers, and client applications.

- **Zero runtime dependencies**: Minimal footprint, zero supply-chain risk.
- **Fast string algorithms**: Avoids heavy BigInt conversions or regular expression overhead during number chunking.
- **Sub-microsecond conversions**: Processes over **500,000+ conversions per second** on modern V8 engines.

---

## 🛡️ Error Handling

The library provides robust input validation:

```typescript
import { toRupeeWords } from 'rupee-words';

toRupeeWords('');           // Throws TypeError: Amount cannot be empty
toRupeeWords('abc');        // Throws TypeError: Invalid number format: "abc"
toRupeeWords(NaN);          // Throws RangeError: Amount cannot be NaN
toRupeeWords(Infinity);     // Throws RangeError: Amount must be finite
toRupeeWords(null as any);  // Throws TypeError: Amount must be a number or string
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/vjymisal0/rupee-words/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the [MIT License](./LICENSE). Copyright (c) 2026 Vijay Misal.

## API

The primary API converts numeric amounts to Indian numbering-system words, including lakhs and crores. See the exported TypeScript declarations for the complete signature.

## Limitations

This package formats values locally; it does not perform currency conversion, tax calculation, or financial validation.
