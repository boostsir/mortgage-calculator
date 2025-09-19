import { useMemo, useCallback } from 'react';

const PARAM_MAP = {
  price: 'homePrice',
  down: 'downPayment',
  downType: 'downPaymentType',
  rate: 'interestRate',
  term: 'loanTerm',
  tax: 'propertyTax',
  insurance: 'homeInsurance',
  hoa: 'hoaFee',
  sellMonths: 'soldAtMonths',
  avgRet: 'avgYearlyReturn',
  closeFee: 'closingFeePercent'
};

const REVERSE_PARAM_MAP = Object.fromEntries(
  Object.entries(PARAM_MAP).map(([key, value]) => [value, key])
);

export function useUrlParams() {
  const params = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const result = {};

    for (const [urlKey, stateKey] of Object.entries(PARAM_MAP)) {
      const value = urlParams.get(urlKey);
      if (value !== null && value !== '') {
        // Handle type fields as strings
        if (stateKey.includes('Type')) {
          if (value === 'dollar' || value === 'percent') {
            result[stateKey] = value;
          }
        } else {
          // Handle numeric fields
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            result[stateKey] = numValue;
          }
        }
      }
    }

    return result;
  }, []);

  const updateParams = useCallback((newParams) => {
    const searchParams = new URLSearchParams();

    for (const [stateKey, value] of Object.entries(newParams)) {
      const urlKey = REVERSE_PARAM_MAP[stateKey];
      if (urlKey && value !== undefined && value !== null) {
        // Include type fields even if they're not default
        if (stateKey.includes('Type') || (value !== 0 && value !== '')) {
          searchParams.set(urlKey, value.toString());
        }
      }
    }

    const newUrl = window.location.pathname + '?' + searchParams.toString();
    window.history.pushState({}, '', newUrl);
  }, []);

  const generateShareableUrl = useCallback((params) => {
    const searchParams = new URLSearchParams();

    for (const [stateKey, value] of Object.entries(params)) {
      const urlKey = REVERSE_PARAM_MAP[stateKey];
      if (urlKey && value !== undefined && value !== null) {
        // Include type fields even if they're not default
        if (stateKey.includes('Type') || (value !== 0 && value !== '')) {
          searchParams.set(urlKey, value.toString());
        }
      }
    }

    const origin = window.location.origin || 'http://localhost:3000';
    const pathname = window.location.pathname || '/';
    return origin + pathname + '?' + searchParams.toString();
  }, []);

  return {
    params,
    updateParams,
    generateShareableUrl
  };
}
