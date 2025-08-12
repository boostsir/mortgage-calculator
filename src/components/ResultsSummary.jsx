import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export function ResultsSummary({ results }) {
  if (!results || !results.monthlyPayment) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" role="region" aria-label="Results Summary">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Results</h2>
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">Enter values above to see your mortgage calculations</p>
        </div>
      </div>
    );
  }

  const resultItems = [
    {
      label: 'Monthly Payment (P&I)',
      value: formatCurrency(results.monthlyPayment),
      description: 'Principal and Interest only'
    },
    {
      label: 'Total Monthly Payment',
      value: formatCurrency(results.totalMonthlyPayment),
      description: 'Including taxes, insurance, and fees'
    },
    {
      label: 'Total Interest Paid',
      value: formatCurrency(results.totalInterest),
      description: 'Over the life of the loan'
    },
    {
      label: 'Total of Payments',
      value: formatCurrency(results.totalPayments),
      description: 'Principal + Interest'
    },
    {
      label: 'Payoff Date',
      value: formatDate(results.payoffDate),
      description: 'When your loan will be paid off'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6" role="region" aria-label="Results Summary">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Results</h2>
      
      <div className="space-y-4">
        {resultItems.map((item, index) => (
          <div key={index} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.label}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
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