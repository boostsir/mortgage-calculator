# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Claude Development Guidelines

## Development Approach

**STRICTLY FOLLOW TEST-DRIVEN DEVELOPMENT (TDD)**

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests green

Never write production code without a failing test first.

## Language Requirements

**NO TYPESCRIPT** - Use pure JavaScript only (.js and .jsx files)

## Project Context

### US Mortgage Calculator Web Application

**Tech Stack:**
- React (functional components + hooks)
- Tailwind CSS
- JavaScript (NO TypeScript)
- Vite (preferred) or Next.js
- npm/yarn package manager

**Core Libraries:**
- `decimal.js` for high-precision calculations (replaces mortgage-js)
- `qrcode` for sharing functionality

### Key Features to Implement

1. **Input Form Fields:**
   - Home Price (required)
   - Down Payment (required) 
   - Loan Term (required, default 30 years)
   - Interest Rate (required)
   - Property Tax (optional)
   - Home Insurance (optional)
   - HOA Fee (optional)
   - PMI (auto-calculated if down payment <20%)

2. **Calculation Results:**
   - Monthly Payment (P&I)
   - Total Monthly Payment (PITI + fees)
   - Total Interest Paid
   - Total of Payments
   - Payoff Date

3. **Collapsible Sections:**
   - Monthly Payment Breakdown
   - Complete Amortization Schedule

4. **Sharing Features:**
   - URL parameter encoding
   - Copy shareable link
   - QR code generation

### Component Architecture

```
src/
├── components/
│   ├── MortgageCalculator.jsx (main component)
│   ├── InputForm.jsx (all input fields)
│   ├── ResultsSummary.jsx (primary results display)
│   ├── PaymentBreakdown.jsx (collapsible breakdown)
│   ├── AmortizationTable.jsx (collapsible monthly schedule)
│   └── ShareButton.jsx (URL sharing functionality)
├── hooks/
│   ├── useMortgageCalculation.js (mortgage-js integration)
│   └── useUrlParams.js (URL parameter handling)
├── utils/
│   ├── mortgageUtils.js (wrapper for mortgage-js)
│   └── formatters.js (currency, date formatting)
└── App.jsx
```

### Testing Strategy

**Test Files Structure:**
- `__tests__/` folder for each component
- `*.test.js` naming convention
- Use Jest + React Testing Library

**Testing Requirements:**
1. Test all calculation logic thoroughly
2. Test component rendering and interactions
3. Test URL parameter handling
4. Test form validation
5. Test collapsible section behavior

### Styling Guidelines

**Tailwind CSS Classes:**
- Cards: `bg-white rounded-lg shadow-md p-6`
- Buttons: `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded`
- Inputs: `border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`
- Error states: `border-red-500 text-red-600`
- Collapsible: `transition-all duration-300`

## Development Commands

**Common Commands:**
- `npm run dev` - Start Vite development server
- `npm test` - Run Jest tests once
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

**Single Test Execution:**
- `npm test -- --testNamePattern="test name"` - Run specific test
- `npm test -- src/utils/__tests__/mortgageUtils.test.js` - Run specific test file

**Test Coverage:**
- Coverage is configured in jest.config.js and excludes main.jsx and setupTests.js

## Architecture Overview

The application implements a custom mortgage calculation engine using decimal.js for precision instead of mortgage-js. Key architectural decisions:

**Calculation Engine (src/utils/mortgageUtils.js):**
- Uses Decimal.js for all financial calculations to avoid floating-point errors
- Implements standard mortgage formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
- Handles PMI calculation (0.6% annually if LTV > 80%)
- Generates complete amortization schedules

**State Management (src/hooks/useMortgageCalculation.js):**
- Custom hook that memoizes calculations using useMemo
- Handles input validation and type conversion (percentage to dollar amounts)
- Returns complete calculation results including breakdowns

**Precision Handling:**
- All currency values use Decimal.js with 2 decimal places
- Property tax input is percentage-based, converted to annual dollar amount
- Down payment supports both dollar amounts and percentages

## Build Configuration

**Vite Configuration (vite.config.js):**
- Configured for GitHub Pages deployment with base: '/mortgage-calculator/'
- React plugin enabled
- Output directory: 'dist'

**Jest Configuration (jest.config.js):**
- jsdom test environment for React components
- Babel transformation for JSX
- CSS modules mocked with identity-obj-proxy
- Test files in __tests__ folders or *.test.js pattern

**ESLint Configuration:**
- React and React Hooks plugins enabled
- ES6+ syntax support

### TDD Workflow Example

```javascript
// 1. RED - Write failing test
test('should calculate monthly payment correctly', () => {
  const result = calculateMonthlyPayment({
    homePrice: 500000,
    downPayment: 100000,
    interestRate: 7.5,
    loanTerm: 30
  });
  expect(result.monthlyPayment).toBe(2797.19);
});

// 2. GREEN - Write minimal code to pass using Decimal.js
function calculateMonthlyPayment({ homePrice, downPayment, interestRate, loanTerm }) {
  const loanAmount = new Decimal(homePrice).minus(downPayment);
  // Implement mortgage formula with Decimal.js
}
```

## Important Notes

- Always start with tests
- Use functional components with hooks
- Keep components focused and single-responsibility
- Ensure responsive design with Tailwind
- Handle edge cases in calculations
- Validate all user inputs
- Maintain accessibility standards