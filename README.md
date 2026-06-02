# Employee Management Client (React + Vite)

React client for a .NET Web API backend (TPH polymorphic employees).

## Tech stack

- React (Vite)
- React Query (`@tanstack/react-query`) for fetching/caching/infinite scroll
- Axios for HTTP
- Tailwind CSS for styling

## Setup

Install dependencies:

```bash
npm i
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Backend URL / environment

By default the app calls:

- `https://localhost:7069`

Override with:

- `VITE_API_BASE_URL` (in `.env.local`)

Example `.env.local`:

```bash
VITE_API_BASE_URL=https://localhost:7069
```

## HTTPS + CORS notes (common local dev issues)

- If you use a self-signed dev certificate in ASP.NET, the browser may block requests.
  - Fix: open the API URL once in the browser and trust the certificate (or use a trusted dev cert).
- CORS must be enabled on the **backend** for your Vite origin (e.g. `http://localhost:5173`).
  - Frontend code cannot “force” CORS compliance; it can only make requests that the server must allow.

## API assumptions

The client assumes these routes (adjust in `src/api/employees.js` if your backend differs):

- `GET /api/Employee?pageNumber=1&pageSize=12` → `EmployeeResponseDto[]` (or `{ items: [] }`)
- `POST /api/Employee` with `EmployeeCreateDto`
- `DELETE /api/Employee/{id}`

## Polymorphic DTO rules (create)

Role enum integers (sent in POST payload):

- `0 = ProjectManager`
- `1 = Developer`
- `2 = QA`
- `3 = TeamLead`

Conditional fields (the form enforces these):

- role `1` (Developer) → `numberOfReports`
- role `2` (QA) → `bugsFound`
- role `0` or `3` → `yearlyBonus`

