import Decimal from 'decimal.js';

export function calculateMonthlyPayment({ homePrice, downPayment, interestRate, loanTerm }) {
  const loanAmount = new Decimal(homePrice).minus(downPayment);
  const monthlyRate = new Decimal(interestRate).div(100).div(12);
  const numberOfPayments = loanTerm * 12;
  
  // Calculate monthly payment using standard mortgage formula
  // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  const onePlusRate = monthlyRate.plus(1);
  const onePlusRatePowN = onePlusRate.pow(numberOfPayments);
  
  const monthlyPayment = loanAmount
    .mul(monthlyRate.mul(onePlusRatePowN))
    .div(onePlusRatePowN.minus(1));
  
  const totalPayments = monthlyPayment.mul(numberOfPayments);
  const totalInterest = totalPayments.minus(loanAmount);
  
  const payoffDate = new Date();
  payoffDate.setFullYear(payoffDate.getFullYear() + loanTerm);
  
  return {
    monthlyPayment: monthlyPayment.toDecimalPlaces(2).toNumber(),
    totalLoanAmount: loanAmount.toNumber(),
    totalPayments: totalPayments.toDecimalPlaces(2).toNumber(),
    totalInterest: totalInterest.toDecimalPlaces(2).toNumber(),
    payoffDate
  };
}

export function calculatePMI(homePrice, downPayment) {
  const homePriceDecimal = new Decimal(homePrice);
  const downPaymentDecimal = new Decimal(downPayment);
  const loanAmount = homePriceDecimal.minus(downPaymentDecimal);
  const loanToValue = loanAmount.div(homePriceDecimal);
  
  // No PMI if down payment is 20% or more
  if (loanToValue.lte(0.8)) {
    return 0;
  }
  
  // Standard PMI calculation: 0.5-1% of loan amount annually
  // Using 0.6% annually, divided by 12 for monthly
  const annualPMI = loanAmount.mul(0.006);
  const monthlyPMI = annualPMI.div(12);
  return monthlyPMI.toDecimalPlaces(2).toNumber();
}

export function calculateAmortizationSchedule({ homePrice, downPayment, interestRate, loanTerm }) {
  const loanAmount = new Decimal(homePrice).minus(downPayment);
  const monthlyRate = new Decimal(interestRate).div(100).div(12);
  const numberOfPayments = loanTerm * 12;
  
  // Calculate monthly payment using the same formula as above
  const onePlusRate = monthlyRate.plus(1);
  const onePlusRatePowN = onePlusRate.pow(numberOfPayments);
  
  const monthlyPayment = loanAmount
    .mul(monthlyRate.mul(onePlusRatePowN))
    .div(onePlusRatePowN.minus(1));
  
  const schedule = [];
  let remainingBalance = loanAmount;
  
  for (let i = 0; i < numberOfPayments; i++) {
    const interestPayment = remainingBalance.mul(monthlyRate);
    const principalPayment = monthlyPayment.minus(interestPayment);
    remainingBalance = Decimal.max(0, remainingBalance.minus(principalPayment));
    
    schedule.push({
      paymentNumber: i + 1,
      principalPayment: principalPayment.toDecimalPlaces(2).toNumber(),
      interestPayment: interestPayment.toDecimalPlaces(2).toNumber(),
      remainingBalance: remainingBalance.toDecimalPlaces(2).toNumber()
    });
  }
  
  return schedule;
}