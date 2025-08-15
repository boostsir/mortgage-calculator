import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputForm } from '../InputForm';

describe('InputForm', () => {
  const defaultProps = {
    values: {
      homePrice: 500000,
      downPayment: 100000,
      downPaymentType: 'dollar', // 'dollar' or 'percent'
      interestRate: 7.5,
      loanTerm: 30,
      propertyTax: 1.6, // always percentage now
      homeInsurance: 1200,
      hoaFee: 200
    },
    onChange: jest.fn(),
    errors: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render all required input fields', () => {
    render(<InputForm {...defaultProps} />);

    expect(screen.getByLabelText(/home price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/down payment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interest rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loan term/i)).toBeInTheDocument();
  });

  test('should render optional input fields', () => {
    render(<InputForm {...defaultProps} />);

    expect(screen.getByLabelText(/property tax/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/home insurance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hoa fee/i)).toBeInTheDocument();
  });

  test('should display correct values in inputs', () => {
    render(<InputForm {...defaultProps} />);

    expect(screen.getByDisplayValue('500000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7.5')).toBeInTheDocument();
    
    // For select element, check if the value is selected
    const loanTermSelect = screen.getByLabelText(/loan term/i);
    expect(loanTermSelect).toHaveValue('30');
  });

  test('should call onChange when input values change', () => {
    const onChange = jest.fn();
    render(<InputForm {...defaultProps} onChange={onChange} />);

    const homePriceInput = screen.getByLabelText(/home price/i);
    fireEvent.change(homePriceInput, { target: { value: '600000' } });

    expect(onChange).toHaveBeenCalledWith('homePrice', 600000);
  });

  test('should display error messages when provided', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        homePrice: 'Home price is required',
        downPayment: 'Down payment must be positive'
      }
    };

    render(<InputForm {...propsWithErrors} />);

    expect(screen.getByText('Home price is required')).toBeInTheDocument();
    expect(screen.getByText('Down payment must be positive')).toBeInTheDocument();
  });

  test('should apply error styling to fields with errors', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        homePrice: 'Error message'
      }
    };

    render(<InputForm {...propsWithErrors} />);

    const homePriceInput = screen.getByLabelText(/home price/i);
    expect(homePriceInput).toHaveClass('border-red-500');
  });

  test('should show loan term options', () => {
    render(<InputForm {...defaultProps} />);

    const loanTermSelect = screen.getByLabelText(/loan term/i);
    expect(loanTermSelect).toBeInTheDocument();

    // Check if common loan terms are available
    fireEvent.mouseDown(loanTermSelect);
    expect(screen.getByText('15 years')).toBeInTheDocument();
    expect(screen.getByText('30 years')).toBeInTheDocument();
  });

  test('should handle numeric inputs correctly', () => {
    const onChange = jest.fn();
    render(<InputForm {...defaultProps} onChange={onChange} />);

    const interestRateInput = screen.getByLabelText(/interest rate/i);
    fireEvent.change(interestRateInput, { target: { value: '6.25' } });

    expect(onChange).toHaveBeenCalledWith('interestRate', 6.25);
  });

  test('should handle empty inputs', () => {
    const onChange = jest.fn();
    render(<InputForm {...defaultProps} onChange={onChange} />);

    const homePriceInput = screen.getByLabelText(/home price/i);
    fireEvent.change(homePriceInput, { target: { value: '' } });

    expect(onChange).toHaveBeenCalledWith('homePrice', '');
  });

  test('should use proper Tailwind CSS classes', () => {
    render(<InputForm {...defaultProps} />);

    const homePriceInput = screen.getByLabelText(/home price/i);
    expect(homePriceInput).toHaveClass(
      'border',
      'border-gray-300',
      'rounded-md',
      'px-3',
      'py-2',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500'
    );
  });

  test('should show down payment type toggle buttons', () => {
    render(<InputForm {...defaultProps} />);

    // Should have $ and % buttons for down payment toggle
    const dollarButtons = screen.getAllByText('$');
    const percentButtons = screen.getAllByText('%');
    
    expect(dollarButtons).toHaveLength(1);
    expect(percentButtons).toHaveLength(1);
  });

  test('should handle down payment type change', () => {
    const onChange = jest.fn();
    render(<InputForm {...defaultProps} onChange={onChange} />);

    const percentButton = screen.getByRole('button', { name: '%' });
    fireEvent.click(percentButton);

    expect(onChange).toHaveBeenCalledWith('downPaymentType', 'percent');
  });

  test('should show correct input labels based on type', () => {
    render(<InputForm {...defaultProps} />);

    expect(screen.getByLabelText(/down payment.*\$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/property tax.*% annual/i)).toBeInTheDocument();
  });

  test('should calculate percentage when type is percent', () => {
    const propsWithPercent = {
      ...defaultProps,
      values: {
        ...defaultProps.values,
        downPaymentType: 'percent',
        downPayment: 20 // 20%
      }
    };

    render(<InputForm {...propsWithPercent} />);

    const downPaymentInput = screen.getByLabelText(/down payment/i);
    expect(downPaymentInput).toHaveValue(20);
  });

  test('should show dollar equivalent when percentage is entered', () => {
    const propsWithPercent = {
      ...defaultProps,
      values: {
        homePrice: 500000,
        downPayment: 20,
        downPaymentType: 'percent'
      }
    };
    
    render(<InputForm {...propsWithPercent} />);
    
    // Should show dollar equivalent ($100,000) when 20% is entered
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  test('should show percentage equivalent when dollar amount is entered', () => {
    const propsWithDollar = {
      ...defaultProps,
      values: {
        homePrice: 500000,
        downPayment: 100000,
        downPaymentType: 'dollar'
      }
    };
    
    render(<InputForm {...propsWithDollar} />);
    
    // Should show percentage equivalent (20%) when $100,000 is entered
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  test('should not show equivalent when home price is not entered', () => {
    const propsWithoutHomePrice = {
      ...defaultProps,
      values: {
        downPayment: 100000,
        downPaymentType: 'dollar'
      }
    };
    
    render(<InputForm {...propsWithoutHomePrice} />);
    
    // Should not show equivalent when home price is missing
    expect(screen.queryByText(/20%/)).not.toBeInTheDocument();
  });

  test('should handle decimal percentages correctly', () => {
    const propsWithDecimal = {
      ...defaultProps,
      values: {
        homePrice: 400000,
        downPayment: 15.5,
        downPaymentType: 'percent'
      }
    };
    
    render(<InputForm {...propsWithDecimal} />);
    
    // Should show dollar equivalent ($62,000) when 15.5% is entered
    expect(screen.getByText('$62,000')).toBeInTheDocument();
  });
});