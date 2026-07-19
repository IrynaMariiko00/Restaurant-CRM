# Restaurant CRM

Frontend for a restaurant CRM: guest QR entry at the table, staff authentication with role-based access, and employee profile management. Built with React 19, TypeScript, and Vite.

## Features

- **Guest flow** — QR scan screen with camera access and table-scoped guest app route (`/table/:tableId`)
- **Staff auth** — login, logout, forgot-password flow; cookie-based sessions via Axios (`withCredentials`)
- **Role-based routing** — protected staff area and admin-only routes (`waiter` / `admin`)
- **Employee profile** — view/edit name, email, phone; avatar upload with validation
- **Theming** — light/dark mode with CSS variables
- **i18n** — Ukrainian and English (i18next + language detection)
- **API layer** — Axios client with Vite proxy in development

## Tech Stack

| Area | Tools |
|------|--------|
| UI | React 19, TypeScript, Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4, Sass/SCSS |
| HTTP | Axios |
| i18n | i18next, react-i18next |
| Tooling | ESLint, Prettier, React Compiler |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & run

```bash
npm install
npm run dev
```

The app starts at `http://localhost:5173`. In development, API calls are proxied to the backend (see `vite.config.ts`).

### Environment

Copy `.env.example` to `.env`:

```env
# Production / preview — backend base URL
VITE_API_URL=https://your-api.example.com

# Development — leave empty to use the Vite proxy
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Project Structure

```
src/
├── api/           # Axios client and API modules
├── apps/
│   ├── guest/     # QR scan, guest layout & welcome
│   ├── staff/     # Staff app, employee profile
│   └── admin/     # Admin dashboard shell
├── components/    # Shared auth/UI building blocks
├── context/       # Auth & theme providers
├── pages/         # Login, forgot password, welcome
├── shared/        # i18n, validation
└── ui/            # Reusable UI primitives
```

## License

Private project.
