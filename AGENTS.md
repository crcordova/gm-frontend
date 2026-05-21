<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - GM Propiedades Frontend

## Project Overview

- **Name**: GM Propiedades Frontend (MVP2-ready)
- **Purpose**: Marketplace inmobiliario chileno (Chilean real estate marketplace)
- **Stack**: Next.js 16.2.4, React 19.2.4, TypeScript 5.x, Tailwind CSS 4.x, Lucide React
- **Backend**: FastAPI + PostgreSQL running on `http://localhost:8000`
- **Frontend**: Runs on `http://localhost:3000`
- **Language**: Spanish (UI and user-facing messages)

## Critical Rules

1. **Always check Next.js 16 docs in `node_modules/next/dist/docs/` before writing code.** Do not assume standard Next.js 14/15 patterns.
2. **Use TypeScript strictly.** All new code must be typed.
3. **Use Tailwind CSS utility classes.** No custom CSS files unless strictly necessary.
4. **App Router (`src/app/`) is used.** No `pages/` directory.
5. **Respect Server vs Client Components.** Use `'use client'` only when interactivity (state, effects, events) is required.
6. **Files containing JSX MUST use `.tsx` extension.** Next.js 16 + Turbopack fails to parse JSX in `.ts` files. Always use `.tsx` for components, contexts, and providers.
7. **Avoid `Context.Provider` dot notation in JSX.** Assign to a variable first (e.g., `const P = Context.Provider; return <P value={...}>...</P>`) to avoid Turbopack parse errors.

## Directory Structure

```
gm-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout (fonts, metadata, Providers)
│   │   ├── page.tsx             # Home page (Server Component)
│   │   ├── globals.css          # Global styles, palette, custom utilities
│   │   ├── providers.tsx        # Client wrapper for Auth + Analytics providers
│   │   ├── login/
│   │   │   └── page.tsx         # Login/Register page (Client Component)
│   │   ├── buscar/
│   │   │   └── page.tsx         # Search page (Client Component)
│   │   ├── publicar/
│   │   │   └── page.tsx         # Publish page (Client Component)
│   │   └── propiedades/
│   │       └── [id]/
│   │           └── page.tsx     # Detail page (Server Component)
│   ├── components/               # Reusable components
│   │   ├── PropertyCard.tsx     # Property card component
│   │   ├── SearchFilters.tsx    # Filters component
│   │   ├── Navbar.tsx           # Global sticky navbar (responsive, auth-aware)
│   │   ├── Footer.tsx           # Global footer
│   │   └── HeroSection.tsx      # Home hero with CTAs
│   └── lib/                      # Business logic
│       ├── api.ts              # API client + TypeScript types
│       ├── constants.ts        # Constants (PROPERTY_TYPES, CURRENCIES, DEFAULT_OWNER_ID)
│       ├── auth.tsx            # AuthContext + useAuth hook (JWT-ready)
│       └── analytics.tsx       # AnalyticsContext + useAnalytics hook (event tracking)
├── public/                       # Static assets
├── .env.local                    # Environment variables (NEXT_PUBLIC_API_URL)
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

## Key Conventions

### File & Function Naming
- **Components**: `PascalCase.tsx` (e.g., `PropertyCard.tsx`)
- **Utilities / API**: `camelCase.ts` (e.g., `api.ts`, `constants.ts`)
- **Files with JSX (including contexts)**: Must use `.tsx` (e.g., `auth.tsx`, `analytics.tsx`)
- **Pages**: `page.tsx` inside their route folder
- **API functions**: `verbNoun` (e.g., `getProperties`, `createProperty`)

### Styling
- Tailwind CSS utility classes only
- Mobile-first responsive design
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Consistent spacing and colors from the project palette

### Palette (Elegant Teal/Amber/Slate)
| Token | Value | Tailwind Approx |
|-------|-------|-----------------|
| Primary | `#0f766e` | teal-700 |
| Primary Hover | `#115e59` | teal-800 |
| Accent | `#d97706` | amber-600 |
| Accent Hover | `#b45309` | amber-700 |
| Background | `#f8fafc` | slate-50 |
| Surface | `#ffffff` | white |
| Surface Muted | `#f1f5f9` | slate-100 |
| Text Primary | `#0f172a` | slate-900 |
| Text Secondary | `#475569` | slate-600 |
| Text Muted | `#94a3b8` | slate-400 |
| Border | `#e2e8f0` | slate-200 |
| Success | `#059669` | emerald-600 |
| Error | `#dc2626` | red-600 |
| Warning | `#d97706` | amber-600 |

### Typography
- **Display / Headings**: Playfair Display (serif, elegant)
- **Body / UI**: DM Sans (sans-serif, modern)
- Applied via CSS variables `--font-display` and `--font-body`

## Critical Implementation Details

### Authentication (MVP2 Ready)
- `src/lib/auth.tsx` exports `AuthProvider` and `useAuth()` hook.
- Supports login/logout/register with localStorage session persistence.
- **Demo credentials**: `demo@gmpropiedades.cl` / `demo1234`
- JWT-ready: replace the simulated login with real `fetch` to `/api/v1/auth/login` when backend is ready.
- Authenticated user state is available globally via `useAuth()`.

### Analytics / Event Tracking (MVP2 Ready)
- `src/lib/analytics.tsx` exports `AnalyticsProvider` and `useAnalytics()` hook.
- Events tracked include: `page_view`, `property_view`, `search_performed`, `filter_applied`, `property_publish_started`, `property_publish_submitted`, `property_publish_success`, `property_publish_error`, `login_attempt`, `login_success`, `login_error`, `register_attempt`, `register_success`, `register_error`, `logout`, `cta_click`, `contact_click`, `favorite_click`.
- In development, events are logged to the console.
- In production, events are sent to `${NEXT_PUBLIC_API_URL}/api/v1/analytics/events` (fire-and-forget).

### IDs are UUIDs (Strings)
The backend uses UUID strings, NOT integer IDs, for properties, owners, etc. The frontend must treat all IDs as strings.
- Example: `123e4567-e89b-12d3-a456-426614174000`

### API Base URL
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```
Always use `NEXT_PUBLIC_` prefix for client-side env vars.

### Default Owner ID (MVP1)
Since there is no authentication in MVP1, a fixed UUID is used:
```typescript
export const DEFAULT_OWNER_ID = '123e4567-e89b-12d3-a456-426614174000';
```
This will be replaced with `user.id` from `useAuth()` in MVP2.

### API Response Formats
- **Properties list**: May be paginated with structure `{ items: Property[] }`.
- **Single Property**: Direct `Property` object.
- **Amenities**: The frontend sends `amenity_keys: string[]` when creating/updating properties. The backend may return `amenities` or `amenity_keys`.

### Location Hierarchy (v2.0 Frontend Ready)
The publish form includes a Region → Province → Comuna selector. It requires these backend endpoints:
```
GET /api/v1/locations/regions/
GET /api/v1/locations/regions/{id}/provinces/
GET /api/v1/locations/provinces/{id}/comunas/
```
If these are missing, the form shows a clear error but still works without the hierarchical selector.

### Amenities Selector (v2.0)
- Frontend fetches amenities from `GET /api/v1/amenities/`
- User selects via checkboxes
- Sent to backend as: `amenity_keys: ["seguridad_24h", "piscina"]`
- `POST /api/v1/properties/` must accept this field.

### Property Types
```typescript
['casa', 'departamento', 'parcela', 'oficina', 'local_comercial', 'bodega', 'sitio']
```

### Currencies
```typescript
['CLP', 'USD', 'UF']
```

## API Client Reference (`src/lib/api.ts`)

Key functions:
- `getProperties(filters?)` - Returns `Property[]` (handles pagination wrapper)
- `getProperty(id)` - Returns `Property`
- `createProperty(data)` - Returns created `Property`
- `createQuote(data)` - Returns created `Quote`
- `getRegions()`, `getProvincesByRegion(id)`, `getComunasByProvince(id)` - Location helpers
- `getAmenities()` - Returns `Amenity[]`
- `formatPrice(price, currency)` - Returns formatted CLP/USD/UF string
- `getPropertyTypeLabel(type)` - Returns Spanish label

## Common Pitfalls to Avoid

1. **Do NOT use integer IDs for properties.** They are UUID strings.
2. **Always verify backend is running on port 8000** before testing frontend.
3. **CORS must allow `http://localhost:3000`** in the backend.
4. **`comuna_id` must exist in the database.** Using invalid IDs causes creation errors.
5. **Do not commit `.env.local`** with real credentials.
6. **Clean `.next` cache** if you see stale behavior or TypeScript errors after major changes:
   ```bash
   rm -rf .next && npm run dev
   ```
7. **Always use `.tsx` for files containing JSX.** Next.js 16 + Turbopack will fail to parse JSX in `.ts` files.

## Quick File Reference

| What | Where |
|------|-------|
| Pages | `src/app/` |
| Reusable Components | `src/components/` |
| API Client & Types | `src/lib/api.ts` |
| Constants | `src/lib/constants.ts` |
| Auth Context & Hook | `src/lib/auth.tsx` |
| Analytics Context & Hook | `src/lib/analytics.tsx` |
| Env Config | `.env.local` |
| Next.js Config | `next.config.ts` |
| Architecture & Details | `ARCHITECTURE.md` |
| Run Instructions | `QUICK_START.md` |

## Testing Notes for Agents

- Home (`/`) and Detail (`/propiedades/[id]`) are **Server Components**.
- Search (`/buscar`), Publish (`/publicar`), and Login (`/login`) are **Client Components**.
- `Navbar`, `Footer`, `HeroSection`, `PropertyCard` are reusable components.
- `AuthProvider` and `AnalyticsProvider` wrap the app in `src/app/providers.tsx`.
- When adding new interactive features, place them in Client Components or create new ones with `'use client'`.
- Always handle the case where the backend is unreachable (the existing pages do this with try/catch and error messages).

## Next Steps / Roadmap (MVP2)

When extending, expected features include:
- JWT Authentication (replace `DEFAULT_OWNER_ID` with real auth)
- Image upload and gallery
- Favorites system
- Intelligent matching using `/api/v1/matching/quote/{quote_id}`

---

**Last updated**: Mayo 2026
