import React from 'react';

export function InputForm({ values, onChange, errors = {} }) {
  const handleInputChange = (field, value) => {
    // Convert to number if it's a valid number, otherwise pass as string
    const numValue = parseFloat(value);
    const finalValue = isNaN(numValue) ? value : numValue;
    onChange(field, finalValue);
  };

  const getDownPaymentEquivalent = () => {
    const { homePrice, downPayment, downPaymentType } = values;
    
    if (!homePrice || !downPayment) return null;
    
    if (downPaymentType === 'percent') {
      // Show dollar equivalent
      const dollarAmount = (parseFloat(homePrice) * parseFloat(downPayment)) / 100;
      return `$${dollarAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    } else {
      // Show percentage equivalent
      const percentage = (parseFloat(downPayment) / parseFloat(homePrice)) * 100;
      return `${percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1)}%`;
    }
  };

  const handleTypeToggle = (field, type) => {
    onChange(field, type);
  };

  const renderTypeToggle = (currentType, onTypeChange) => {
    return (
      <div className="flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => onTypeChange('dollar')}
          className={`px-3 py-2 text-sm font-medium border border-r-0 rounded-l-md ${
            currentType === 'dollar'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          $
        </button>
        <button
          type="button"
          onClick={() => onTypeChange('percent')}
          className={`px-3 py-2 text-sm font-medium border rounded-r-md ${
            currentType === 'percent'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          %
        </button>
      </div>
    );
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
              Down Payment ({values.downPaymentType === 'percent' ? '%' : '$'}) *
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <input
                  id="downPayment"
                  type="number"
                  step={values.downPaymentType === 'percent' ? '0.1' : '1000'}
                  value={values.downPayment || ''}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  className={getInputClassName('downPayment')}
                  placeholder={values.downPaymentType === 'percent' ? '20' : '100,000'}
                />
              </div>
              <div className="flex-shrink-0">
                {renderTypeToggle(
                  values.downPaymentType || 'dollar',
                  (type) => handleTypeToggle('downPaymentType', type)
                )}
              </div>
            </div>
            {errors.downPayment && (
              <p className="text-red-600 text-sm mt-1">{errors.downPayment}</p>
            )}
            {getDownPaymentEquivalent() && (
              <p className="text-gray-600 text-sm mt-1">
                {getDownPaymentEquivalent()}
              </p>
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
                Property Tax (% Annual)
              </label>
              <input
                id="propertyTax"
                type="number"
                step="0.01"
                value={values.propertyTax || ''}
                onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                className={getInputClassName('propertyTax')}
                placeholder="1.6"
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