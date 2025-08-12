Based on my search of GitHub and npm, here's the updated project specification with the requested changes and available tools:

# US Mortgage Calculator - Updated Project Specification

## Project Overview

Build a pure frontend mortgage calculator web application specifically designed for US homebuyers using **React and Tailwind CSS**. The application should provide comprehensive mortgage breakdown calculations with shareable results via URL parameters.

## Target Users

- US homebuyers and homeowners
- Real estate professionals
- Financial advisors
- Anyone exploring mortgage options in the US market

## Technical Stack

- **Frontend Framework**: React (with functional components and hooks)
- **Styling**: Tailwind CSS
- **Language**: JavaScript only (NO TypeScript)
- **Build Tool**: Vite (preferred) or Next.js
- **Package Manager**: npm or yarn

## Available Libraries to Consider

Based on GitHub research, consider using these existing tools:

### Mortgage Calculation Libraries

1. **mortgage-js** (npm): Simple mortgage calculator written in Javascript. Determine total monthly payment. Calculate entire payment schedule with principal and interest
2. **financejs** (npm): A JavaScript library for financial calculations. Finance.js makes it easy to incorporate common financial calculations into your application. The library is built on pure JavaScript without any dependencies
3. **@iamniel/mortgage-calculator** (npm): This is simple property mortage calculator library. The calculus behind mortgage payments is complicated, but the Mortgage Calculator makes this math problem quick and easy

### Recommended Approach

Use **mortgage-js** as the core calculation engine since it accounts for property tax, homeowner insurance and private mortgage insurance which are essential for US mortgages.

## Core Features

### Input Fields

- **Home Price** (required): Total property value in USD
- **Down Payment** (required): Amount or percentage, with automatic PMI calculation if <20%
- **Loan Term** (required): Default 30 years, options for 10, 15, 20, 25, 30 years
- **Interest Rate** (required): Annual interest rate as percentage
- **Property Tax** (optional): Annual property tax amount or percentage of home value
- **Home Insurance** (optional): Annual homeowner's insurance cost
- **HOA Fee** (optional): Monthly homeowner association fee
- **PMI** (auto-calculated): Private Mortgage Insurance if down payment <20%

### Calculation Engine

- Use mortgage-js library for core calculations
- Calculate monthly Principal & Interest (P&I)
- Calculate PITI (Principal, Interest, Taxes, Insurance)
- Calculate total monthly payment including all fees
- Generate complete amortization schedule
- Calculate total interest paid over loan term
- Calculate loan-to-value ratio (LTV)

### Primary Results Display

Show prominently using Tailwind CSS styling:

- **Monthly Payment** (P&I only)
- **Total Monthly Payment** (including taxes, insurance, HOA, PMI)
- **Total Interest Paid** (over entire loan term)
- **Total of Payments** (principal + interest)
- **Payoff Date**

### Monthly Payment Breakdown (Collapsible)

**Implementation**: Hidden by default with Tailwind CSS `hidden` class, toggle with React state

```jsx
// Component state for visibility
const [showBreakdown, setShowBreakdown] = useState(false);

// Tailwind classes for collapsible section
className={`transition-all duration-300 ${showBreakdown ? 'block' : 'hidden'}`}
```

Display breakdown in collapsible section:

```
Principal & Interest: $1,234
Property Tax: $400
Home Insurance: $150
PMI: $100
HOA Fee: $200
────────────────────
Total Monthly: $2,084
```

### Monthly Amortization Schedule (Collapsible)

**Implementation**: Hidden by default, expandable table showing:

- **Payment #** (1, 2, 3...)
- **Payment Date** (MM/YYYY)
- **Monthly Payment** (fixed amount)
- **Principal** (portion going to principal)
- **Interest** (portion going to interest)
- **Remaining Balance**

**Tailwind Implementation**:

- Use Tailwind table classes: `table-auto`, `w-full`, `border-collapse`
- Responsive design with `overflow-x-auto` for mobile
- Hover effects with `hover:bg-gray-50`
- Collapsible with React state management

Table features:

- Sortable columns (React implementation)
- Search/filter by payment number or date
- Highlight key milestones (when principal > interest)
- Export to CSV option (pure JavaScript)

## Sharing Functionality

### URL Parameter Encoding

Generate shareable URLs with all input parameters encoded:

```
https://yourdomain.com/?price=500000&down=100000&rate=7.5&term=30&tax=8000&insurance=1200&hoa=200
```

### Share Features

- One-click copy shareable link (React + Navigator.clipboard API)
- QR code generation for mobile sharing (use qrcode.js library)
- **Removed**: Social media sharing buttons
- **Removed**: Email sharing with pre-filled subject/body

## Component Architecture

### React Component Structure

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

## Tailwind CSS Implementation

### Design System

- Use Tailwind's built-in color palette
- Responsive design with mobile-first approach
- Custom components using `@apply` directive for reusable styles
- Focus on accessibility with proper contrast ratios

### Key UI Elements

- **Cards**: `bg-white rounded-lg shadow-md p-6`
- **Buttons**: `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded`
- **Inputs**: `border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`
- **Collapsible sections**: Smooth transitions with `transition-all duration-300`

## User Experience Requirements

### Input Validation

- Real-time validation with React state
- Use Tailwind classes for error states: `border-red-500 text-red-600`
- Helpful error messages with proper typography

### Interaction Patterns

- Auto-calculation on input change (useEffect hooks)
- Smooth collapsible sections with Tailwind transitions
- Loading states for complex calculations
- Hover states using Tailwind hover variants
- Keyboard navigation support

## Data Handling

### State Management

- React useState for component state
- Custom hooks for mortgage calculations
- URL synchronization with React Router (optional) or manual URL manipulation
- **Removed**: Local storage for user preferences to keep it simple

### React Hooks Strategy

```jsx
// Main calculation hook
const useMortgageCalculation = (inputs) => {
  const [results, setResults] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  useEffect(() => {
    if (
      inputs.homePrice &&
      inputs.downPayment &&
      inputs.interestRate &&
      inputs.loanTerm
    ) {
      // Use mortgage-js library here
      const calculator = mortgageJs.createMortgageCalculator();
      // Set calculator properties and compute results
    }
  }, [inputs]);

  return { results, amortizationSchedule };
};
```

## Testing Strategy

### Test-Driven Development (TDD)

**STRICTLY FOLLOW TDD APPROACH:**

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests green

Never write production code without a failing test first.

### Test Files Structure

- `__tests__/` folder for each component
- `*.test.js` naming convention
- Use Jest + React Testing Library

### Testing Requirements

1. Test all calculation logic thoroughly
2. Test component rendering and interactions
3. Test URL parameter handling
4. Test form validation
5. Test collapsible section behavior

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

## Development Setup

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "mortgage-js": "^0.1.2",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

### Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Custom colors for mortgage calculator theme
    },
  },
  plugins: [],
};
```

### Development Commands

```bash
# Run tests
npm test

# Start development server
npm start

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages (manual)
npm run build && npm run deploy
```

### Vite Configuration for GitHub Pages

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mortgage-calculator/', // Replace with your repo name
  build: {
    outDir: 'dist'
  }
})
```

## Deployment to GitHub Pages

### Automatic Deployment with GitHub Actions

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --watchAll=false
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v5
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Manual Deployment Setup

Add to `package.json` scripts:

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

### Repository Settings

1. Go to your GitHub repository settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"
4. Your app will be available at: `https://yourusername.github.io/mortgage-calculator/`

## Removed Features

- **PWA capabilities**: Not needed for this project
- **Social media sharing buttons**: Removed as requested
- **Email sharing with pre-filled content**: Removed as requested

## Success Metrics

- User engagement (time on page, return visits)
- Share functionality usage
- Mobile vs desktop usage patterns
- Most commonly used input combinations
- Calculation completion rates

## Deliverables

- Fully functional React application with Tailwind CSS
- Responsive design across all devices
- Complete amortization calculation engine using existing libraries
- URL-based sharing system
- Component-based architecture for maintainability
- Testing suite for calculation accuracy (Jest + React Testing Library)

This specification leverages existing proven mortgage calculation libraries while building a modern React + Tailwind CSS interface that meets your specific requirements for US mortgage calculations with collapsible monthly breakdowns.
