import { useMemo } from 'react';
import { calculateMonthlyPayment, calculateAmortizationSchedule, calculatePMI } from '../utils/mortgageUtils';

export function useMortgageCalculation(inputs) {
  const {
    homePrice,
    downPayment,
    downPaymentType = 'dollar',
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

    // Convert percentage inputs to dollar amounts
    const downPaymentDollars = downPaymentType === 'percent' 
      ? (downPayment / 100) * homePrice 
      : downPayment;

    // Property tax is always in percentage
    const propertyTaxDollars = (propertyTax / 100) * homePrice;

    // Calculate basic mortgage values
    const mortgageResults = calculateMonthlyPayment({
      homePrice,
      downPayment: downPaymentDollars,
      interestRate,
      loanTerm
    });

    // Calculate PMI
    const pmi = calculatePMI(homePrice, downPaymentDollars);

    // Calculate amortization schedule
    const amortizationSchedule = calculateAmortizationSchedule({
      homePrice,
      downPayment: downPaymentDollars,
      interestRate,
      loanTerm
    });

    // Calculate monthly components
    const monthlyPropertyTax = propertyTaxDollars / 12;
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
  }, [homePrice, downPayment, downPaymentType, interestRate, loanTerm, propertyTax, homeInsurance, hoaFee]);
}