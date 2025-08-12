import { useMemo } from 'react';
import { calculateMonthlyPayment, calculateAmortizationSchedule, calculatePMI } from '../utils/mortgageUtils';

export function useMortgageCalculation(inputs) {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTax = 0,
    homeInsurance = 0,
    hoaFee = 0
  } = inputs;

  return useMemo(() => {
    // Validate required inputs
    if (!homePrice || !downPayment || !interestRate || !loanTerm) {
      return {
        monthlyPayment: null,
        totalMonthlyPayment: null,
        totalInterest: null,
        totalPayments: null,
        amortizationSchedule: null,
        payoffDate: null,
        pmi: null,
        breakdown: null
      };
    }

    // Calculate basic mortgage values
    const mortgageResults = calculateMonthlyPayment({
      homePrice,
      downPayment,
      interestRate,
      loanTerm
    });

    // Calculate PMI
    const pmi = calculatePMI(homePrice, downPayment);

    // Calculate amortization schedule
    const amortizationSchedule = calculateAmortizationSchedule({
      homePrice,
      downPayment,
      interestRate,
      loanTerm
    });

    // Calculate monthly components
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    const monthlyHoaFee = hoaFee;

    // Calculate total monthly payment
    const totalMonthlyPayment = 
      mortgageResults.monthlyPayment + 
      pmi + 
      monthlyPropertyTax + 
      monthlyHomeInsurance + 
      monthlyHoaFee;

    // Create breakdown object
    const breakdown = {
      principal: mortgageResults.monthlyPayment,
      propertyTax: Math.round(monthlyPropertyTax * 100) / 100,
      homeInsurance: Math.round(monthlyHomeInsurance * 100) / 100,
      hoaFee: monthlyHoaFee,
      pmi: pmi
    };

    return {
      monthlyPayment: mortgageResults.monthlyPayment,
      totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
      totalInterest: mortgageResults.totalInterest,
      totalPayments: mortgageResults.totalPayments,
      amortizationSchedule,
      payoffDate: mortgageResults.payoffDate,
      pmi,
      breakdown
    };
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, hoaFee]);
}