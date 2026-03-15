# ShiftSync — Frontend

Next.js frontend for the ShiftSync multi-location staff scheduling platform.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + shadcn-style components (Radix UI)
- **TanStack Query (React Query)** for API state and caching
- **Socket.IO client** for real-time updates

## Setup

1. Copy environment file and set backend URL:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:

   - `NEXT_PUBLIC_API_URL` — backend API base (e.g. `http://localhost:4000/api`)
   - `NEXT_PUBLIC_WS_URL` — backend URL for Socket.IO (e.g. `http://localhost:4000`)

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Default redirect is to `/schedule`; unauthenticated users are sent to `/login`.

## Structure

- **`src/app`** — App Router: root layout, (auth) and (dashboard) route groups, pages for login, schedule, swaps, notifications, analytics, on-duty, settings.
- **`src/components`** — `ui/` (Button, Input, Card, Label), `layout/` (Header, Sidebar, NotificationCenter), `shared/` (DataTable, DateRangePicker, TimezoneDisplay).
- **`src/features`** — Feature modules: scheduling, users, notifications, analytics, auth (components and types).
- **`src/hooks`** — useAuth, useSocket, useRealtimeSchedule; React Query hooks (useShifts, useAssignments, useSwapRequests, useDrops, useNotifications, useLocations, useAnalytics).
- **`src/services`** — API client and endpoint helpers (auth, shifts, swaps, notifications, locations, analytics).
- **`src/lib`** — utils (cn, formatDate, formatTime, formatHours, toLocationTime), design-tokens, socket client.
- **`src/store`** — AuthProvider (React Context) for auth state.
- **`src/types`** — Shared TypeScript types (User, Shift, Location, etc.).

## Auth & RBAC

- Login at `/login` (POST `/auth/login`). JWT is stored in `localStorage` (key `accessToken`).
- Dashboard routes are protected: if not authenticated, redirect to `/login`.
- Sidebar shows Users link only for role `ADMIN`. Role-based UI can be extended per backend RBAC.

## Real-time

- `useSocket()` connects to the backend Socket.IO server with the current token and exposes `on`/`emit`.
- `useRealtimeSchedule()` invalidates React Query caches on events: `schedule:updated`, `shift:assigned`, `swap:stateChange`, `drop:claimed`, `notification`.

## Deployment (Vercel)

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` to your deployed backend in Vercel environment variables.
