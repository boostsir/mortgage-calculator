import React, { useState, useEffect } from 'react';
import { InputForm } from './InputForm';
import { ResultsSummary } from './ResultsSummary';
import { PaymentBreakdown } from './PaymentBreakdown';
import { ShareButton } from './ShareButton';
import { useMortgageCalculation } from '../hooks/useMortgageCalculation';
import { useUrlParams } from '../hooks/useUrlParams';

export function MortgageCalculator() {
  const { params: urlParams, updateParams, generateShareableUrl } = useUrlParams();
  
  const [inputs, setInputs] = useState({
    homePrice: 0,
    downPayment: 0,
    downPaymentType: 'dollar',
    interestRate: 0,
    loanTerm: 0,
    propertyTax: 0,
    homeInsurance: 0,
    hoaFee: 0,
    ...urlParams
  });

  const [errors, setErrors] = useState({});

  const results = useMortgageCalculation(inputs);

  // Update URL when inputs change
  useEffect(() => {
    if (inputs.homePrice && inputs.downPayment && inputs.interestRate && inputs.loanTerm) {
      updateParams(inputs);
    }
  }, [inputs, updateParams]);

  const validateInputs = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'homePrice':
        if (!value || value <= 0) {
          newErrors.homePrice = 'Home price must be greater than 0';
        } else {
          delete newErrors.homePrice;
        }
        break;
      case 'downPayment':
        if (!value || value <= 0) {
          newErrors.downPayment = 'Down payment must be greater than 0';
        } else {
          const downPaymentDollars = inputs.downPaymentType === 'percent' 
            ? (value / 100) * inputs.homePrice 
            : value;
          if (downPaymentDollars >= inputs.homePrice) {
            newErrors.downPayment = inputs.downPaymentType === 'percent' 
              ? 'Down payment percentage must be less than 100%'
              : 'Down payment must be less than home price';
          } else {
            delete newErrors.downPayment;
          }
        }
        break;
      case 'interestRate':
        if (!value || value <= 0) {
          newErrors.interestRate = 'Interest rate must be greater than 0';
        } else if (value > 50) {
          newErrors.interestRate = 'Interest rate seems too high';
        } else {
          delete newErrors.interestRate;
        }
        break;
      case 'loanTerm':
        if (!value || value <= 0) {
          newErrors.loanTerm = 'Loan term is required';
        } else {
          delete newErrors.loanTerm;
        }
        break;
      default:
        // Optional fields don't need validation
        if (value < 0) {
          newErrors[field] = 'Value cannot be negative';
        } else {
          delete newErrors[field];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    // Type fields should remain as strings, numeric fields should be converted to numbers
    let finalValue;
    if (field.includes('Type')) {
      finalValue = value; // Keep type fields as strings
    } else {
      finalValue = value === '' ? 0 : (typeof value === 'string' ? parseFloat(value) || 0 : value);
    }
    
    setInputs(prev => ({
      ...prev,
      [field]: finalValue
    }));

    // Only validate numeric fields
    if (!field.includes('Type')) {
      validateInputs(field, finalValue);
    }
  };

  const hasValidInputs = inputs.homePrice > 0 && inputs.downPayment > 0 && 
                        inputs.interestRate > 0 && inputs.loanTerm > 0 &&
                        Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              US Mortgage Calculator
            </h1>
            <p className="text-gray-600">
              Calculate your monthly mortgage payments with taxes, insurance, and PMI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              <InputForm
                values={inputs}
                onChange={handleInputChange}
                errors={errors}
              />
              
              {hasValidInputs && results.breakdown && (
                <PaymentBreakdown breakdown={results.breakdown} />
              )}
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              <ResultsSummary results={hasValidInputs ? results : null} />
              
              {hasValidInputs && (
                <ShareButton 
                  generateUrl={generateShareableUrl}
                  params={inputs}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}