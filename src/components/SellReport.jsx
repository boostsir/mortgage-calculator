import React from 'react';
import Decimal from 'decimal.js';
import { formatCurrency } from '../utils/formatters';

export function SellReport({ inputs, results }) {
  const {
    homePrice,
    downPayment,
    downPaymentType = 'dollar',
    soldAtMonths = 0,
    avgYearlyReturn = 0,
    closingFeePercent = 0,
  } = inputs;

  if (!results || !results.amortizationSchedule || soldAtMonths <= 0 || avgYearlyReturn <= 0) {
    return null;
  }

  // Compute selling price using average yearly return compounded by months/12
  const price = new Decimal(homePrice);
  const growthFactor = new Decimal(1).plus(new Decimal(avgYearlyReturn).div(100));
  const sellingPrice = price.mul(growthFactor.pow(new Decimal(soldAtMonths).div(12)));

  // Determine remaining balance at soldAtMonths (cap within schedule bounds)
  const schedule = results.amortizationSchedule;
  const index = Math.min(Math.max(1, Math.floor(soldAtMonths)), schedule.length) - 1;
  const remainingBalance = new Decimal(schedule[index]?.remainingBalance ?? 0);

  // Down payment dollars
  const downPaymentDollars = downPaymentType === 'percent'
    ? new Decimal(downPayment).div(100).mul(price)
    : new Decimal(downPayment);

  // Cash from sale (as specified): selling price - remaining balance
  const cashFromSale = sellingPrice.minus(remainingBalance);

  // Total cash invested: down payment + total monthly outflow * months + closing fee
  const closingFee = sellingPrice.mul(new Decimal(closingFeePercent).div(100));
  const monthlyOutflow = new Decimal(
    (results.totalMonthlyPayment ?? results.monthlyPayment) || 0
  );
  const totalCashInvested = downPaymentDollars
    .plus(monthlyOutflow.mul(soldAtMonths))
    .plus(closingFee);

  // Average monthly cost: (invested - cashFromSale) / months
  const avgMonthlyCost = totalCashInvested.minus(cashFromSale).div(soldAtMonths);

  const items = [
    { label: 'Projected Selling Price', value: formatCurrency(sellingPrice.toDecimalPlaces(2).toNumber()) },
    { label: 'Cash From Sale', value: formatCurrency(cashFromSale.toDecimalPlaces(2).toNumber()) },
    { label: 'Total Cash Invested', value: formatCurrency(totalCashInvested.toDecimalPlaces(2).toNumber()) },
    { label: 'Avg Monthly Cost', value: formatCurrency(avgMonthlyCost.toDecimalPlaces(2).toNumber()) },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6" role="region" aria-label="Sell Report">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sell Report</h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.label}</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
