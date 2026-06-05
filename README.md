# Mini ERP Frontend

Frontend application for the Mini ERP system built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Features

- JWT-based authentication with route protection via middleware
- Dashboard with summary statistics and charts
- Customer management (list, detail)
- Invoice management (list, detail, create, edit)
- Reports page
- Settings page

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/       # Login page
│   └── (dashboard)/        # Protected dashboard routes
│       ├── dashboard/
│       ├── customers/
│       ├── invoices/
│       ├── reports/
│       └── settings/
├── components/
│   ├── layout/             # Header, Sidebar
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── api.ts              # HTTP client with auth
│   ├── auth.ts             # Auth helpers
│   └── utils.ts            # Utility functions
├── middleware.ts            # Route protection
└── types/                  # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running (see [slm-tech-test-be](https://github.com/rifdi12/slm-tech-test-be))

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t mini-erp-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:3001/api mini-erp-frontend
```
