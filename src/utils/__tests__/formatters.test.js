import { formatCurrency, formatPercent, formatDate, formatNumber } from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    test('should format positive numbers as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(500000)).toBe('$500,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    test('should handle very large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    test('should round to 2 decimal places', () => {
      expect(formatCurrency(1234.567)).toBe('$1,234.57');
      expect(formatCurrency(1234.561)).toBe('$1,234.56');
    });
  });

  describe('formatPercent', () => {
    test('should format decimal as percentage', () => {
      expect(formatPercent(0.075)).toBe('7.50%');
      expect(formatPercent(0.06)).toBe('6.00%');
      expect(formatPercent(0.125)).toBe('12.50%');
    });

    test('should handle zero and negative values', () => {
      expect(formatPercent(0)).toBe('0.00%');
      expect(formatPercent(-0.05)).toBe('-5.00%');
    });

    test('should round to 2 decimal places', () => {
      expect(formatPercent(0.07525)).toBe('7.53%');
      expect(formatPercent(0.07521)).toBe('7.52%');
    });
  });

  describe('formatDate', () => {
    test('should format date as MM/YYYY', () => {
      const date = new Date(2024, 11, 15); // December 15, 2024
      expect(formatDate(date)).toBe('12/2024');
    });

    test('should handle different months', () => {
      const jan = new Date(2025, 0, 1); // January 1, 2025
      const july = new Date(2025, 6, 15); // July 15, 2025
      expect(formatDate(jan)).toBe('01/2025');
      expect(formatDate(july)).toBe('07/2025');
    });
  });

  describe('formatNumber', () => {
    test('should format numbers with commas', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(500)).toBe('500');
    });

    test('should handle decimal places when specified', () => {
      expect(formatNumber(1234.567, 2)).toBe('1,234.57');
      expect(formatNumber(1000, 2)).toBe('1,000.00');
      expect(formatNumber(1234.1, 2)).toBe('1,234.10');
    });

    test('should handle zero and negative numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-1234)).toBe('-1,234');
      expect(formatNumber(-1234.56, 2)).toBe('-1,234.56');
    });
  });
});