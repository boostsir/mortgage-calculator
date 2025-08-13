import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

export function AmortizationTable({ schedule }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!schedule || !schedule.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
        aria-expanded={isOpen}
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Complete Amortization Schedule</h3>
          <p className="text-sm text-gray-600">({schedule.length} payments)</p>
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="transition-all duration-300 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Payment #</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Principal</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((payment, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">{payment.paymentNumber}</td>
                  <td className="py-2 px-3 text-right">{formatCurrency(payment.principalPayment)}</td>
                  <td className="py-2 px-3 text-right">{formatCurrency(payment.interestPayment)}</td>
                  <td className="py-2 px-3 text-right">{formatCurrency(payment.remainingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
}