# NIL Strategy Planner

A static web app for modeling NIL income structure options across 1-4 years.

## What It Does

- Compares LLC, LLC with retirement, S-Corp, and S-Corp with retirement.
- Models federal income tax, self-employment tax, payroll tax, simplified state tax, LLC admin cost, S-corp admin cost, QBI assumptions, health premium planning, SEP-IRA, Solo 401(k) assumptions, annual personal spending needs, cash needed in the next 10 years, and one-time big purchases by selected year.
- Includes all 50 states plus Washington, D.C. State tax presets use the supplied 2025 single-filer ordinary-income rates, including graduated brackets where provided.
- Recommends S-corp only when it improves after-spending wealth after modeled structure fees and does not create a cash shortfall.
- Defaults to automatic optimization for S-corp salary and retirement strategy, comparing SEP-IRA vs. Solo 401(k), applying plan-specific contribution caps, reducing contributions when spending, 10-year needs, or big purchases require cash, and using the better result.
- Advanced assumptions are off by default, but can model setup costs, local income taxes, state taxable share, federal deduction override, other-state credits, and reasonable salary floor overrides.
- Produces a planning-style memo, comparison table, and strategy checklist.

## Deploying With GitHub And Vercel

1. Upload this folder to a GitHub repository.
2. In Vercel, choose **Add New Project** and import the repository.
3. Framework preset: **Other**.
4. Build command: leave blank.
5. Output directory: leave blank or use `./`.
6. Deploy.

This is a static app. Vercel will serve `index.html` directly.

## Local Preview

Open `index.html` in a browser, or run:

```bash
npm install
npm run dev
```

## Important Disclaimer

This app is for educational planning discussions only. It is not tax, legal, accounting, or investment advice. NIL athletes should consult a qualified tax advisor and attorney before implementing an entity, payroll, retirement, residency, or state sourcing strategy.
