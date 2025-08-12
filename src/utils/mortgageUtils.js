import mortgage from 'mortgage-js';

export function calculateMonthlyPayment({ homePrice, downPayment, interestRate, loanTerm }) {
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  // Calculate monthly payment using standard mortgage formula
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const totalPayments = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayments - loanAmount;
  
  const payoffDate = new Date();
  payoffDate.setFullYear(payoffDate.getFullYear() + loanTerm);
  
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalLoanAmount: loanAmount,
    totalPayments: Math.round(totalPayments * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    payoffDate
  };
}

export function calculatePMI(homePrice, downPayment) {
  const loanToValue = (homePrice - downPayment) / homePrice;
  
  // No PMI if down payment is 20% or more
  if (loanToValue <= 0.8) {
    return 0;
  }
  
  // Standard PMI calculation: 0.5-1% of loan amount annually
  // Using 0.6% annually, divided by 12 for monthly
  const loanAmount = homePrice - downPayment;
  const annualPMI = loanAmount * 0.006;
  return Math.round((annualPMI / 12) * 100) / 100;
}

export function calculateAmortizationSchedule({ homePrice, downPayment, interestRate, loanTerm }) {
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const schedule = [];
  let remainingBalance = loanAmount;
  
  for (let i = 0; i < numberOfPayments; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
    
    schedule.push({
      paymentNumber: i + 1,
      principalPayment: Math.round(principalPayment * 100) / 100,
      interestPayment: Math.round(interestPayment * 100) / 100,
      remainingBalance: Math.round(remainingBalance * 100) / 100
    });
  }
  
  return schedule;
}