# ASX Company Comparison Dashboard

## Overview

This project extends the original ASX Company Information Dashboard into
a scalable multi-stock comparison tool designed to solve a real user
pain point: inefficient comparison across multiple browser tabs.

Rather than implementing every possible feature, this project focuses on
solving the core comparison problem cleanly and sustainably.

------------------------------------------------------------------------

# 1️⃣ Problem Understanding

From the business case, the core issue is:

Users inefficiently compare stocks across multiple tabs and struggle to
identify meaningful differences.

The real goal is: - Reduce cognitive load - Improve clarity - Keep UX
simple - Avoid feature bloat - Maintain clean architecture

------------------------------------------------------------------------

# 2️⃣ Core Product Philosophy

## Priority #1: Build the Comparison Engine Properly

The stock comparison feature is the highest priority.

Instead of shipping a hard-coded "2-stock comparison" MVP, I
deliberately:

-   Architected comparison logic to support multiple stocks dynamically
-   Avoided technical debt from shortcuts
-   Ensured structure is readable, maintainable, and extensible

It is better to build the core correctly once than rebuild it twice.

------------------------------------------------------------------------

# 3️⃣ UX Decisions & Trade-offs

## Refresh Functionality

As a real user, I would want: - A way to refresh data - Clear
performance visibility

So I implemented: - Refresh mechanism - State-aware UI that preserves
compared tickers

## Highlighting Best / Worst Performers

"Best" depends on the metric.

Instead of enforcing a single ranking logic, I added:

-   Highest badge per metric
-   Lowest badge per metric

This allows: - Objective comparison - User-driven interpretation -
Transparent metric-based evaluation

------------------------------------------------------------------------

# 4️⃣ Why I Skipped Some Features

## Visual Comparison Tools

The API does not provide historical data.

Without historical endpoints, chart overlays would require mocked or
speculative logic. Therefore, visual comparison tools were intentionally
skipped.

## Saved Comparisons

Saved comparisons require: - Authentication - Persistent storage -
Backend complexity

Given time constraints and assignment scope, this was considered out of
scope.

------------------------------------------------------------------------

# 5️⃣ Technical Architecture

## Separation of Concerns

-   api.ts → external data fetching
-   route.ts → server proxy
-   Comparison logic → pure data transformation
-   UI → presentation only

## Dynamic Structure

Instead of hardcoding:

stockA stockB

I implemented:

StockData[]

This allows scaling without refactoring.

------------------------------------------------------------------------

# 6️⃣ Minimum Viable Scope

Included: - Multi-stock comparison - Side-by-side metrics - Extreme
value highlighting - Refresh capability - Clean responsive layout

Excluded: - Charts - Authentication - Saved sets

------------------------------------------------------------------------

# 7️⃣ Future Improvements

-   Historical price integration for charts
-   Saved comparison sets with login
-   Custom metric prioritization
-   Data caching with SWR or React Query

------------------------------------------------------------------------

# Setup

```
pnpm install
pnpm dev
```
or
```
npm install
npm run dev
```

Environment variables:

```
NEXT_PUBLIC_API_BASE_URL=https://public.investorhub.com
API_KEY=your_key_here
```
------------------------------------------------------------------------

# Final Reflection

This project demonstrates product thinking, architectural discipline,
and prioritization under constraints.

If extended, it can grow without rewriting core logic --- that was the
goal.
