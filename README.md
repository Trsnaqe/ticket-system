# Ticket System Case 

**Live link**: [vercel](https://ticket-system-wine-theta.vercel.app/)

A Next.js 14 app.

## What this case demonstrates 
- Minimal ticketing UI with authentication and roles (admin, user).
- Mock API implemented via Next.js Route Handlers reading/writing a JSON file (`app/api/_db.ts`).
- Users only see their own requests; admins see all.
- Responsive UI.

## Roles & Access
- **Admin**: can view all requests, update status, and reply to any request.
- **User**: can see only their own requests and reply to those.

Login demo credentials:
- Admin: `admin / admin`
- User: `user1 / password`
- User: `user2 / password`

### How visibility works
- Each request stores a `userId`.
- On every API call, lightweight auth headers are set from the Redux auth state.
- The API filters results by `userId` unless the user `role` is `admin`.
- See `app/api/requests/route.ts` and `app/api/_auth.ts`.

## Prerequisites
- Docker and Docker Compose (recommended)
- Or Node.js 20+ with your preferred package manager (npm, pnpm, or yarn)

## Run with Docker (recommended)
### Using Docker Compose
1. Build and start:
   ```bash
   docker compose up --build
   ```
2. Open: `http://localhost:3000`

### Using Docker CLI directly
1. Build image:
   ```bash
   docker build -t ticket-system .
   ```
2. Run container:
   ```bash
   docker run --name ticket-system-web -p 3000:3000 --rm ticket-system
   ```

## Run locally (terminal method)

Using pnpm (fastest):
```bash
corepack enable && corepack prepare pnpm@latest --activate
pnpm install
pnpm dev
```

Using npm:
```bash
npm install
npm run dev
```

Production locally:
```bash
pnpm build    # or: npm run build

pnpm start    # or: npm run start
```

## Notes
- The Docker image uses Next.js standalone output for a small runtime image.
- App listens on port `3000`.
- Mock persistence is file-based; restart keeps data on local fs during dev.
- Mock auth.


## API endpoints (mock, file-backed)
- GET `/api/requests`
  - Returns all requests for admin; otherwise filters by current `x-user-id`.
- POST `/api/requests`
  - Body: `{ title, description, category }`; `userId` resolved from headers.
- GET `/api/requests/:id`
  - Returns one request if visible to the user.
- PATCH `/api/requests/:id`
  - Update status: `{ status: "open" | "inProgress" | "closed" }`
  - Or add message: `{ message: { content: string } }` (user and timestamps filled server-side)

Headers added by client (from Redux auth):
- `x-user-id`, `x-user-role`, `x-user-name` (see `features/requests/api/requests-api.ts` and `app/api/_auth.ts`).

Data store (mock):
- JSON file managed by `app/api/_db.ts` with helpers for list/get/create/update.
