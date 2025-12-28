# Event Timeline Visualiser

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Directory structure

src/
  app/                      # Next.js routes (App Router)
    layout.tsx
    page.tsx
    (feature)/              # Optional: co-locate feature-specific routes
    api/                    # ONLY route handlers here (Next.js conventions)

  components/
    ui/                     # Reusable UI primitives (buttons, cards, modals)
                            # only reusable building blocks.
    layout/                 # Page or app-level layout components
    features/               # Feature-specific components (optional grouping)
                            # optional: if you have big features, keep their components together.

  lib/                      # Framework-agnostic helpers (formatters, API clients)
                            # general-purpose utilities (date formatting, helper functions, API client setup).
  models/                   # TypeScript types, interfaces, schemas
                            # clear place for TypeScript interfaces, Zod schemas, or Prisma models.
  services/                 # Business logic (API calls, auth logic, etc.)
                            # domain-specific logic (auth service, database queries, feature APIs).
  hooks/                    # Custom React hooks
  store/                    # State management (Zustand, Redux, etc.)
                            # centralizes state if you use Zustand/Redux.
  config/                   # App-wide constants, env configs
                            # avoids sprinkling env vars everywhere.
  utils/                    # Miscellaneous utilities (non-business logic)
  styles/                   # Global CSS, Tailwind configs
  public/                   # Static assets

  tests/                    # Unit/integration tests (if not colocated)


##  Directory Setup

src/
  app/
    (auth)/
      login/
        page.tsx        # The login page UI
    api/
      auth/
        route.ts        # Handles POST login, session creation
        verify/route.ts # Handles code verification
  services/
    authService.ts       # Contains business logic
  lib/
    db.ts                # MongoDB connection helper
  models/
    user.ts
  hooks/
    useAuth.ts           # React hook for auth state
  store/
    authStore.ts         # Zustand/Redux if needed
  components/
    ui/                  # Input, Button, etc.
    auth/                # Auth-specific components

#### Pre-Commit Hooks
After cloning the repository, and running `npm install`, this shall enable pre-commit hooks via the Husky package.
Currently, this executes the lint stage prior to all Git commits made, blocking if there are any lint errors.