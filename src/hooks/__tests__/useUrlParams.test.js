import { renderHook, act } from '@testing-library/react';
import { useUrlParams } from '../useUrlParams';

// Mock window.location
const mockLocation = {
  search: '',
  pathname: '/',
  href: 'http://localhost:3000/',
  origin: 'http://localhost:3000'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock history.pushState
const mockPushState = jest.fn();
Object.defineProperty(window.history, 'pushState', {
  value: mockPushState,
  writable: true
});

describe('useUrlParams', () => {
  beforeEach(() => {
    mockPushState.mockClear();
    mockLocation.search = '';
    mockLocation.href = 'http://localhost:3000/';
  });

  test('should parse URL parameters correctly', () => {
    mockLocation.search = '?price=500000&down=100000&rate=7.5&term=30&tax=8000&insurance=1200&hoa=200';

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.params).toEqual({
      homePrice: 500000,
      downPayment: 100000,
      interestRate: 7.5,
      loanTerm: 30,
      propertyTax: 8000,
      homeInsurance: 1200,
      hoaFee: 200
    });
  });

  test('should return empty object when no params', () => {
    mockLocation.search = '';

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.params).toEqual({});
  });

  test('should handle partial parameters', () => {
    mockLocation.search = '?price=400000&down=80000&rate=6.0';

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.params).toEqual({
      homePrice: 400000,
      downPayment: 80000,
      interestRate: 6.0
    });
  });

  test('should update URL when updateParams is called', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updateParams({
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 5.5,
        loanTerm: 30
      });
    });

    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      '/?price=300000&down=60000&rate=5.5&term=30'
    );
  });

  test('should generate shareable URL', () => {
    const { result } = renderHook(() => useUrlParams());

    const shareableUrl = result.current.generateShareableUrl({
      homePrice: 250000,
      downPayment: 50000,
      interestRate: 4.5,
      loanTerm: 15,
      propertyTax: 3000,
      homeInsurance: 800,
      hoaFee: 100
    });

    expect(shareableUrl).toBe(
      'http://localhost:3000/?price=250000&down=50000&rate=4.5&term=15&tax=3000&insurance=800&hoa=100'
    );
  });

  test('should skip zero values in URL generation', () => {
    const { result } = renderHook(() => useUrlParams());

    const shareableUrl = result.current.generateShareableUrl({
      homePrice: 400000,
      downPayment: 80000,
      interestRate: 6.0,
      loanTerm: 30,
      propertyTax: 0,
      homeInsurance: 0,
      hoaFee: 0
    });

    expect(shareableUrl).toBe(
      'http://localhost:3000/?price=400000&down=80000&rate=6&term=30'
    );
  });

  test('should handle invalid or missing values gracefully', () => {
    mockLocation.search = '?price=invalid&down=&rate=6.0&term=abc';

    const { result } = renderHook(() => useUrlParams());

    expect(result.current.params).toEqual({
      interestRate: 6.0
    });
  });
});