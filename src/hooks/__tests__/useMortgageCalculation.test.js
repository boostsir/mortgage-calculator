import { renderHook, act } from '@testing-library/react';
import { useMortgageCalculation } from '../useMortgageCalculation';

describe('useMortgageCalculation', () => {
  test('should calculate mortgage results when all required inputs are provided', () => {
    const inputs = {
      homePrice: 500000,
      downPayment: 100000,
      interestRate: 7.5,
      loanTerm: 30,
      propertyTax: 8000,
      homeInsurance: 1200,
      hoaFee: 200
    };

    const { result } = renderHook(() => useMortgageCalculation(inputs));

    expect(result.current.monthlyPayment).toBeCloseTo(2796.86, 2);
    expect(result.current.totalMonthlyPayment).toBeGreaterThan(2796.86);
    expect(result.current.totalInterest).toBeCloseTo(606868.89, 1);
    expect(result.current.totalPayments).toBeCloseTo(1006868.89, 1);
    expect(result.current.amortizationSchedule).toHaveLength(360);
    expect(result.current.payoffDate).toBeInstanceOf(Date);
  });

  test('should include PMI when down payment is less than 20%', () => {
    const inputs = {
      homePrice: 500000,
      downPayment: 50000, // 10% down
      interestRate: 6.0,
      loanTerm: 30,
      propertyTax: 0,
      homeInsurance: 0,
      hoaFee: 0
    };

    const { result } = renderHook(() => useMortgageCalculation(inputs));

    expect(result.current.pmi).toBeGreaterThan(0);
    expect(result.current.totalMonthlyPayment).toBeGreaterThan(result.current.monthlyPayment);
  });

  test('should not include PMI when down payment is 20% or more', () => {
    const inputs = {
      homePrice: 500000,
      downPayment: 100000, // 20% down
      interestRate: 6.0,
      loanTerm: 30,
      propertyTax: 0,
      homeInsurance: 0,
      hoaFee: 0
    };

    const { result } = renderHook(() => useMortgageCalculation(inputs));

    expect(result.current.pmi).toBe(0);
  });

  test('should return null when required inputs are missing', () => {
    const inputs = {
      homePrice: 500000,
      downPayment: 0,
      interestRate: 0,
      loanTerm: 0
    };

    const { result } = renderHook(() => useMortgageCalculation(inputs));

    expect(result.current.monthlyPayment).toBe(null);
    expect(result.current.totalMonthlyPayment).toBe(null);
    expect(result.current.amortizationSchedule).toBe(null);
  });

  test('should recalculate when inputs change', () => {
    const initialInputs = {
      homePrice: 400000,
      downPayment: 80000,
      interestRate: 6.0,
      loanTerm: 30,
      propertyTax: 0,
      homeInsurance: 0,
      hoaFee: 0
    };

    const { result, rerender } = renderHook(
      ({ inputs }) => useMortgageCalculation(inputs),
      { initialProps: { inputs: initialInputs } }
    );

    const initialPayment = result.current.monthlyPayment;

    const newInputs = {
      ...initialInputs,
      interestRate: 7.0 // Increase interest rate
    };

    rerender({ inputs: newInputs });

    expect(result.current.monthlyPayment).toBeGreaterThan(initialPayment);
  });

  test('should calculate breakdown correctly', () => {
    const inputs = {
      homePrice: 300000,
      downPayment: 60000,
      interestRate: 5.5,
      loanTerm: 30,
      propertyTax: 3600, // $300/month
      homeInsurance: 1200, // $100/month
      hoaFee: 150 // $150/month
    };

    const { result } = renderHook(() => useMortgageCalculation(inputs));

    expect(result.current.breakdown.principal).toBeCloseTo(result.current.monthlyPayment, 2);
    expect(result.current.breakdown.propertyTax).toBeCloseTo(300, 2);
    expect(result.current.breakdown.homeInsurance).toBeCloseTo(100, 2);
    expect(result.current.breakdown.hoaFee).toBe(150);
    expect(result.current.breakdown.pmi).toBe(0); // 20% down
  });
});