# Furniture Quotation & Estimate Calculator

A modern, responsive single-page dashboard for generating cost estimates for a
**Particle Board Furniture Manufacturing** company.

Built with **React + Vite**, **Tailwind CSS**, **Framer Motion** (UI transitions),
and **Lucide React** (icons).

## Features

- **Two-column layout** — input forms on the left, a sticky **Live Quotation Summary**
  on the right that updates in real time.
- Logical input sections: **Material** (particle board + edge banding), **Hardware**
  (dynamic list), **Labor & Machining**, and **Margins & Taxes**.
- **Add / remove hardware** rows dynamically.
- **Reset Form** to clear all inputs.
- **Print / Export to PDF** — hides all controls and formats the summary into a clean
  printable invoice (use your browser's "Save as PDF").
- All business math is isolated in the `useQuotationMath` custom hook.

## Calculation logic

| Step | Formula |
| --- | --- |
| Actual Area | `Required Area + (Required Area × Wastage %)` |
| Board Cost | `Actual Area × Cost per sq.ft.` |
| Edge Cost | `Running Meters × Cost per meter` |
| Hardware Cost | `Σ (Quantity × Unit Price)` |
| Labor Cost | `Actual Area × (Machining + Installation per sq.ft.)` |
| Subtotal | `Board + Edge + Hardware + Labor` |
| Profit Amount | `Subtotal × (Margin / 100)` |
| Pre-Tax Total | `Subtotal + Profit Amount` |
| Tax Amount | `Pre-Tax Total × (Tax / 100)` |
| **Grand Total** | `Pre-Tax Total + Tax Amount` |

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Project structure

```
src/
├─ App.jsx                      # layout + state wiring
├─ constants.js                 # initial state & hardware factory
├─ hooks/useQuotationMath.js    # all calculation logic
├─ utils/format.js             # currency / number formatting
└─ components/
   ├─ QuotationSummary.jsx      # sticky summary + printable invoice
   ├─ ui/                       # Field, SectionCard
   └─ sections/                 # Project, Material, Hardware, Labor, Margins
```
