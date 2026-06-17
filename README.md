# QA Dashboard & Test Visualisation Tool

A QA test management dashboard built during a one-month frontend internship at Hapticware Intelligence Pvt. Ltd. It visualises test suite health, tracks pass/fail/skip trends over time, and supports uploading external test data via JSON or CSV.

## Live features

- **Authentication** — real login backed by an Express + SQLite API, with passwords hashed via bcrypt and sessions managed with JWT
- **Suite Health Score** — a single 0–100 score weighted by test priority (High = 3x, Medium = 2x, Low = 1x), so critical failures hurt the score more than minor skips
- **Trend visualisation** — a stacked daily chart of passed/failed/skipped runs with a 7-day moving average overlay, plus a donut chart for the overall proportion
- **File upload** — drag-and-drop or browse to upload JSON or CSV test data; validates and normalises inconsistent column names and casing
- **Filtering & search** — live search by name/ID, plus dropdown filters for status, module, and priority
- **Pagination** — 10 rows per page with smart ellipsis for large result sets

## Tech stack

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| Frontend framework | React 18 (Vite)                        |
| Styling            | Tailwind CSS                           |
| Charts             | Chart.js + react-chartjs-2             |
| CSV parsing        | PapaParse                              |
| Backend            | Node.js + Express                      |
| Database           | SQLite (via better-sqlite3)            |
| Auth               | JWT (jsonwebtoken) + bcrypt (bcryptjs) |

## Project structure

```
qa_dashboard/
├── backend/
│   ├── server.js          # Express API: login, register, token verification
│   ├── database.js        # SQLite connection and schema
│   ├── seed.js             # Creates a default demo user
│   └── .env                # JWT secret (not committed)
├── src/
│   ├── components/
│   │   ├── Login.jsx              # Auth screen, calls backend API
│   │   ├── FileUpload.jsx         # Drag-and-drop JSON/CSV upload + validation
│   │   ├── HealthCard.jsx         # Weighted suite health score ring
│   │   ├── StatCards.jsx          # Total tests, pass rate, critical failures
│   │   ├── TrendChart.jsx         # Stacked daily chart + moving average
│   │   ├── StatusDonut.jsx        # Pass/fail/skip proportion donut
│   │   ├── SummaryCards.jsx       # Tests passed, critical
│   │   ├── FilterBar.jsx          # Search + status/module/priority filters
│   │   └── TestTable.jsx          # Paginated table + slide-in detail panel
│   ├── data/
│   │   └── qa-mock-data.json      # Default mock test case data
│   └── App.jsx                     # Top-level state, filtering logic, layout
└── README.md
```

## Running locally

You need two terminals — one for the backend, one for the frontend.

**1. Backend**

```bash
cd backend
npm install
node seed.js        # creates the demo user (run once)
node server.js       # starts the API on http://localhost:4000
```

**2. Frontend**

```bash
npm install
npm run dev           # starts the app on http://localhost:5173
```

## Demo credentials

```
Email:    ved@hapticware.com
Password: password123
```

## How the Suite Health Score is calculated

A plain pass percentage treats every test equally, which hides risk — a failed High-priority test is far more serious than a skipped Low-priority one. The score corrects for this:

```
weight = { High: 3, Medium: 2, Low: 1 }

for each test:
    total_weight += weight[test.priority]
    if test.status == "Passed":
        earned_weight += weight[test.priority]

score = round((earned_weight / total_weight) * 100)
```

| Score range | Verdict         |
| ----------- | --------------- |
| 80–100      | Healthy         |
| 60–79       | Needs attention |
| 0–59        | Critical        |

## Known limitations

- Uploaded file data is held in memory only — refreshing the page reverts to the default mock dataset. Persisting uploads was out of scope for the one-month timeline.
- Authentication currently supports a single hardcoded demo account plus self-registration; there's no password reset flow or email verification.
- The dashboard is optimised for desktop screens; mobile responsiveness was deprioritised in favour of feature completeness.

## What I learned

Building this from scratch surfaced a lot of practical lessons beyond just "how to use React":

- **Library compatibility matters as much as the API.** Recharts looked like the obvious charting choice but had an unresolved CommonJS/ESM conflict with Vite. Switching to Chart.js + manual canvas lifecycle management (via `useRef` and `destroy()` in `useEffect`) was more verbose but far more stable.
- **A metric is only useful if it reflects what actually matters.** A simple pass percentage doesn't distinguish a critical failure from a minor one — the weighted Suite Health Score was a direct response to that gap.
- **Git hygiene compounds.** Staging only the files that actually changed (`git add <path>` instead of `git add .`) and writing conventional commit messages made the project history genuinely easy to review week over week.
- **Real authentication is a different problem than it looks like.** Moving from a fake `localStorage`-only login to a real Express + SQLite + JWT + bcrypt flow meant thinking about password hashing, token expiry, and protected routes areconcepts that don't come up until actually needed.

## Author

Ved Sanap
Frontend Development Intern, Hapticware Intelligence Pvt. Ltd.
May 21 – June 17, 2026
