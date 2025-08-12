import { calculateMonthlyPayment, calculateAmortizationSchedule, calculatePMI } from '../mortgageUtils';

describe('mortgageUtils', () => {
  describe('calculateMonthlyPayment', () => {
    test('should calculate monthly payment correctly for basic mortgage', () => {
      const result = calculateMonthlyPayment({
        homePrice: 500000,
        downPayment: 100000,
        interestRate: 7.5,
        loanTerm: 30
      });
      
      expect(result.monthlyPayment).toBeCloseTo(2796.86, 2);
      expect(result.totalLoanAmount).toBe(400000);
      expect(result.totalPayments).toBeCloseTo(1006868.89, 1);
      expect(result.totalInterest).toBeCloseTo(606868.89, 1);
    });

    test('should handle different loan terms', () => {
      const result = calculateMonthlyPayment({
        homePrice: 400000,
        downPayment: 80000,
        interestRate: 6.0,
        loanTerm: 15
      });
      
      expect(result.monthlyPayment).toBeCloseTo(2700.34, 2);
      expect(result.totalLoanAmount).toBe(320000);
    });

    test('should calculate payoff date correctly', () => {
      const result = calculateMonthlyPayment({
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 5.5,
        loanTerm: 30
      });
      
      const expectedPayoffDate = new Date();
      expectedPayoffDate.setFullYear(expectedPayoffDate.getFullYear() + 30);
      
      expect(result.payoffDate.getFullYear()).toBe(expectedPayoffDate.getFullYear());
    });
  });

  describe('calculatePMI', () => {
    test('should calculate PMI when down payment is less than 20%', () => {
      const pmi = calculatePMI(500000, 50000); // 10% down
      expect(pmi).toBeGreaterThan(0);
      expect(pmi).toBeCloseTo(225, 0); // Approximately $225/month
    });

    test('should return 0 PMI when down payment is 20% or more', () => {
      const pmi = calculatePMI(500000, 100000); // 20% down
      expect(pmi).toBe(0);
    });

    test('should handle edge case of exactly 20% down', () => {
      const pmi = calculatePMI(400000, 80000); // Exactly 20% down
      expect(pmi).toBe(0);
    });
  });

  describe('calculateAmortizationSchedule', () => {
    test('should generate correct amortization schedule', () => {
      const schedule = calculateAmortizationSchedule({
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        loanTerm: 30
      });

      expect(schedule).toHaveLength(360); // 30 years * 12 months
      expect(schedule[0].paymentNumber).toBe(1);
      expect(schedule[0].principalPayment).toBeGreaterThan(0);
      expect(schedule[0].interestPayment).toBeGreaterThan(0);
      expect(schedule[0].remainingBalance).toBeLessThan(240000);
      
      // Last payment should have remaining balance of 0
      expect(schedule[359].remainingBalance).toBeCloseTo(0, 2);
    });

    test('should have decreasing interest and increasing principal over time', () => {
      const schedule = calculateAmortizationSchedule({
        homePrice: 200000,
        downPayment: 40000,
        interestRate: 5.0,
        loanTerm: 30
      });

      // First payment should have more interest than principal
      expect(schedule[0].interestPayment).toBeGreaterThan(schedule[0].principalPayment);
      
      // Later payments should have more principal than interest
      expect(schedule[300].principalPayment).toBeGreaterThan(schedule[300].interestPayment);
    });
  });
});