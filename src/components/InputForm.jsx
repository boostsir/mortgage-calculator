import React from 'react';

export function InputForm({ values, onChange, errors = {} }) {
  const handleInputChange = (field, value) => {
    // Convert to number if it's a valid number, otherwise pass as string
    const numValue = parseFloat(value);
    const finalValue = isNaN(numValue) ? value : numValue;
    onChange(field, finalValue);
  };

  const getInputClassName = (field) => {
    const baseClasses = 'border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full';
    const errorClasses = errors[field] ? 'border-red-500' : 'border-gray-300';
    return `${baseClasses} ${errorClasses}`;
  };

  const loanTermOptions = [
    { value: 10, label: '10 years' },
    { value: 15, label: '15 years' },
    { value: 20, label: '20 years' },
    { value: 25, label: '25 years' },
    { value: 30, label: '30 years' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mortgage Calculator</h2>
      
      <div className="space-y-4">
        {/* Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="homePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Home Price *
            </label>
            <input
              id="homePrice"
              type="number"
              value={values.homePrice || ''}
              onChange={(e) => handleInputChange('homePrice', e.target.value)}
              className={getInputClassName('homePrice')}
              placeholder="500,000"
            />
            {errors.homePrice && (
              <p className="text-red-600 text-sm mt-1">{errors.homePrice}</p>
            )}
          </div>

          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment *
            </label>
            <input
              id="downPayment"
              type="number"
              value={values.downPayment || ''}
              onChange={(e) => handleInputChange('downPayment', e.target.value)}
              className={getInputClassName('downPayment')}
              placeholder="100,000"
            />
            {errors.downPayment && (
              <p className="text-red-600 text-sm mt-1">{errors.downPayment}</p>
            )}
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%) *
            </label>
            <input
              id="interestRate"
              type="number"
              step="0.01"
              value={values.interestRate || ''}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              className={getInputClassName('interestRate')}
              placeholder="7.5"
            />
            {errors.interestRate && (
              <p className="text-red-600 text-sm mt-1">{errors.interestRate}</p>
            )}
          </div>

          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term *
            </label>
            <select
              id="loanTerm"
              value={values.loanTerm || ''}
              onChange={(e) => handleInputChange('loanTerm', e.target.value)}
              className={getInputClassName('loanTerm')}
            >
              <option value="">Select term</option>
              {loanTermOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.loanTerm && (
              <p className="text-red-600 text-sm mt-1">{errors.loanTerm}</p>
            )}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Costs (Optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="propertyTax" className="block text-sm font-medium text-gray-700 mb-1">
                Property Tax (Annual)
              </label>
              <input
                id="propertyTax"
                type="number"
                value={values.propertyTax || ''}
                onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                className={getInputClassName('propertyTax')}
                placeholder="8,000"
              />
              {errors.propertyTax && (
                <p className="text-red-600 text-sm mt-1">{errors.propertyTax}</p>
              )}
            </div>

            <div>
              <label htmlFor="homeInsurance" className="block text-sm font-medium text-gray-700 mb-1">
                Home Insurance (Annual)
              </label>
              <input
                id="homeInsurance"
                type="number"
                value={values.homeInsurance || ''}
                onChange={(e) => handleInputChange('homeInsurance', e.target.value)}
                className={getInputClassName('homeInsurance')}
                placeholder="1,200"
              />
              {errors.homeInsurance && (
                <p className="text-red-600 text-sm mt-1">{errors.homeInsurance}</p>
              )}
            </div>

            <div>
              <label htmlFor="hoaFee" className="block text-sm font-medium text-gray-700 mb-1">
                HOA Fee (Monthly)
              </label>
              <input
                id="hoaFee"
                type="number"
                value={values.hoaFee || ''}
                onChange={(e) => handleInputChange('hoaFee', e.target.value)}
                className={getInputClassName('hoaFee')}
                placeholder="200"
              />
              {errors.hoaFee && (
                <p className="text-red-600 text-sm mt-1">{errors.hoaFee}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}