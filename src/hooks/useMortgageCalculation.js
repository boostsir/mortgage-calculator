import { useMemo } from 'react';
import Decimal from 'decimal.js';
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

    // Convert percentage inputs to dollar amounts using Decimal for precision
    const homePriceDecimal = new Decimal(homePrice);
    const downPaymentDollars = downPaymentType === 'percent' 
      ? new Decimal(downPayment).div(100).mul(homePriceDecimal).toNumber()
      : downPayment;

    // Property tax is always in percentage
    const propertyTaxDollars = new Decimal(propertyTax).div(100).mul(homePriceDecimal).toNumber();

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

    // Calculate monthly components using Decimal for precision
    const monthlyPropertyTax = new Decimal(propertyTaxDollars).div(12);
    const monthlyHomeInsurance = new Decimal(homeInsurance).div(12);
    const monthlyHoaFee = new Decimal(hoaFee);

    // Calculate total monthly payment
    const totalMonthlyPayment = new Decimal(mortgageResults.monthlyPayment)
      .plus(pmi)
      .plus(monthlyPropertyTax)
      .plus(monthlyHomeInsurance)
      .plus(monthlyHoaFee);

    // Create breakdown object
    const breakdown = {
      principal: mortgageResults.monthlyPayment,
      propertyTax: monthlyPropertyTax.toDecimalPlaces(2).toNumber(),
      homeInsurance: monthlyHomeInsurance.toDecimalPlaces(2).toNumber(),
      hoaFee: monthlyHoaFee.toNumber(),
      pmi: pmi
    };

    return {
      monthlyPayment: mortgageResults.monthlyPayment,
      totalMonthlyPayment: totalMonthlyPayment.toDecimalPlaces(2).toNumber(),
      totalInterest: mortgageResults.totalInterest,
      totalPayments: mortgageResults.totalPayments,
      amortizationSchedule,
      payoffDate: mortgageResults.payoffDate,
      pmi,
      breakdown
    };
  }, [homePrice, downPayment, downPaymentType, interestRate, loanTerm, propertyTax, homeInsurance, hoaFee]);
}