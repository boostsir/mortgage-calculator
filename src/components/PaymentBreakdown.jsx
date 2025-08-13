import React from 'react';
import { formatCurrency } from '../utils/formatters';

export function PaymentBreakdown({ breakdown }) {
  if (!breakdown) {
    return null;
  }

  const breakdownItems = [
    { label: 'Principal & Interest', value: breakdown.principal },
    { label: 'Property Tax', value: breakdown.propertyTax },
    { label: 'Home Insurance', value: breakdown.homeInsurance },
    { label: 'PMI', value: breakdown.pmi },
    { label: 'HOA Fee', value: breakdown.hoaFee }
  ].filter(item => item.value > 0);

  const total = breakdownItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Monthly Payment Breakdown</h3>
        <span className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</span>
      </div>

      <div className="space-y-3">
        {breakdownItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">{item.label}</span>
            <span className="font-semibold">{formatCurrency(item.value)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 pt-4 border-t-2 border-gray-300 font-bold text-lg">
          <span>Total Monthly Payment</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}