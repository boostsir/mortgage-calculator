# Repository Guidelines

## Project Structure & Module Organization
- `src/`: App code (React 18).
  - `components/`: UI components in PascalCase (e.g., `MortgageCalculator.jsx`).
  - `hooks/`: Custom hooks (e.g., `useMortgageCalculation.js`).
  - `utils/`: Pure helpers (e.g., `mortgageUtils.js`).
  - `__tests__/`: Co-located tests per area (components, hooks, utils).
- `public/`: Static assets served by Vite.
- `dist/`: Build output (generated).
- Root configs: `vite.config.js`, `jest.config.js`, `eslint.config.js`, `babel.config.js`, `tailwind.config.js`.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Production build to `dist/`.
- `npm run preview`: Preview the built app locally.
- `npm test`: Run Jest test suite once.
- `npm run test:watch`: Run tests in watch mode.
- `npm run lint`: Lint `src/` with ESLint.
- `npm run deploy`: Publish `dist/` to GitHub Pages (`gh-pages`).

## Coding Style & Naming Conventions
- Language: modern ES modules, React function components and hooks.
- Indentation: 2 spaces; keep lines focused and small functions.
- Naming: components in PascalCase (`ResultsSummary.jsx`), variables/functions in camelCase, test files `*.test.js(x)`.
- Linting: ESLint (recommended JS + React + Hooks). Fix issues before committing.

## Testing Guidelines
- Framework: Jest + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`).
- Location: place tests under `src/**/__tests__/` or as `*.test.js(x)` next to code.
- Coverage: core logic in `utils/` and `hooks/` should be covered; add tests with new logic.
- Run: `npm test` or `npm run test:watch` during development.

## Commit & Pull Request Guidelines
- Commits: short, imperative messages (e.g., "Add amortization schedule"). Group related changes.
- PRs: include a concise description, linked issues (e.g., `Closes #12`), and screenshots/GIFs for UI changes.
- Checks: ensure `npm test` and `npm run lint` pass; include notes on any tradeoffs.

## Architecture Notes
- UI: React components + Tailwind CSS.
- Domain: mortgage math in `utils/mortgageUtils.js` using `decimal.js` for precision; business logic accessed via hooks.

## Sell Scenario (Optional)
- Inputs: `soldAtMonths` (months to sell), `avgYearlyReturn` (%), `closingFeePercent` (% of sale price).
- Panel: `SellReport` renders beneath Results when `soldAtMonths > 0` and `avgYearlyReturn > 0`.
- Calculations:
  - Projected Selling Price = `homePrice * (1 + r)^(months/12)` where `r = avgYearlyReturn/100`.
  - Cash From Sale = `Projected Selling Price - Remaining Balance at month` (from amortization schedule).
  - Total Cash Invested = `down payment + Total Monthly Payment * months + closing fee`.
    - Total Monthly Payment includes P&I + PMI + property tax + insurance + HOA.
    - Closing Fee = `Projected Selling Price * (closingFeePercent/100)`.
  - Avg Monthly Cost = `(Total Cash Invested - Cash From Sale) / months`.
 - URL params: `sellMonths`, `avgRet`, `closeFee` map to the above inputs via `useUrlParams`.
