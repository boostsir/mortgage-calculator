import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResultsSummary } from '../ResultsSummary';

describe('ResultsSummary', () => {
  const mockResults = {
    monthlyPayment: 2796.86,
    totalMonthlyPayment: 3500.25,
    totalInterest: 606868.89,
    totalPayments: 1006868.89,
    payoffDate: new Date('2054-08-12')
  };

  test('should display monthly payment', () => {
    render(<ResultsSummary results={mockResults} />);
    expect(screen.getByText('$2,796.86')).toBeInTheDocument();
  });

  test('should display total monthly payment', () => {
    render(<ResultsSummary results={mockResults} />);
    expect(screen.getByText('$3,500.25')).toBeInTheDocument();
  });

  test('should display total interest', () => {
    render(<ResultsSummary results={mockResults} />);
    expect(screen.getByText('$606,868.89')).toBeInTheDocument();
  });

  test('should display total payments', () => {
    render(<ResultsSummary results={mockResults} />);
    expect(screen.getByText('$1,006,868.89')).toBeInTheDocument();
  });

  test('should display payoff date', () => {
    render(<ResultsSummary results={mockResults} />);
    expect(screen.getByText('08/2054')).toBeInTheDocument();
  });

  test('should show loading state when results are null', () => {
    render(<ResultsSummary results={null} />);
    expect(screen.getByText(/enter values/i)).toBeInTheDocument();
  });

  test('should use proper Tailwind styling', () => {
    render(<ResultsSummary results={mockResults} />);
    const container = screen.getByRole('region');
    expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
  });
});