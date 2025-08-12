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
- Create React App or Vite
- npm/yarn package manager

**Core Libraries:**
- `mortgage-js` for calculations
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

### Development Commands

Run tests: `npm test`
Start development: `npm start`
Build production: `npm run build`

### TDD Workflow Example

```javascript
// 1. RED - Write failing test
test('should calculate monthly payment correctly', () => {
  const result = calculateMonthlyPayment(500000, 100000, 7.5, 30);
  expect(result.monthlyPayment).toBe(2797.19);
});

// 2. GREEN - Write minimal code to pass
function calculateMonthlyPayment(homePrice, downPayment, rate, term) {
  // Minimal implementation using mortgage-js
  return { monthlyPayment: 2797.19 };
}

// 3. REFACTOR - Improve implementation
function calculateMonthlyPayment(homePrice, downPayment, rate, term) {
  const mortgage = require('mortgage-js');
  // Full implementation
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