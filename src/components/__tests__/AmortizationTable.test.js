import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AmortizationTable } from '../AmortizationTable';

describe('AmortizationTable', () => {
  const mockSchedule = [
    {
      paymentNumber: 1,
      principalPayment: 1130.19,
      interestPayment: 1666.67,
      remainingBalance: 398869.81
    },
    {
      paymentNumber: 2,
      principalPayment: 1132.95,
      interestPayment: 1663.91,
      remainingBalance: 397736.86
    }
  ];

  test('should render without schedule', () => {
    render(<AmortizationTable schedule={null} />);
    expect(screen.queryByText('Complete Amortization Schedule')).not.toBeInTheDocument();
  });

  test('should render collapsed by default', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    
    expect(screen.getByText('Complete Amortization Schedule')).toBeInTheDocument();
    expect(screen.queryByText('Payment #')).not.toBeInTheDocument();
  });

  test('should expand when clicked', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    
    const toggleButton = screen.getByRole('button', { name: /complete amortization schedule/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Payment #')).toBeInTheDocument();
    expect(screen.getByText('Principal')).toBeInTheDocument();
    expect(screen.getByText('Interest')).toBeInTheDocument();
    expect(screen.getByText('Remaining Balance')).toBeInTheDocument();
  });

  test('should display schedule data correctly', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    
    const toggleButton = screen.getByRole('button', { name: /complete amortization schedule/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('$1,130.19')).toBeInTheDocument();
    expect(screen.getByText('$1,666.67')).toBeInTheDocument();
    expect(screen.getByText('$398,869.81')).toBeInTheDocument();
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$1,132.95')).toBeInTheDocument();
    expect(screen.getByText('$1,663.91')).toBeInTheDocument();
    expect(screen.getByText('$397,736.86')).toBeInTheDocument();
  });

  test('should collapse when clicked again', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    
    const toggleButton = screen.getByRole('button', { name: /complete amortization schedule/i });
    
    fireEvent.click(toggleButton);
    expect(screen.getByText('Payment #')).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Payment #')).not.toBeInTheDocument();
  });

  test('should display total number of payments', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    
    expect(screen.getByText('(2 payments)')).toBeInTheDocument();
  });
});