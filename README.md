# Event Timeline Visualiser

## Technology Stack
- **MongoDB** serves as the application's database, with backend interaction utilising the [Mongoose]("https://mongoosejs.com/") object modelling tool.
- **NextJS** utilised as a full-stack framework, with [React]("https://react.dev/") as the web-library.
- **TypeScript** programming language used throughout the application.

## Running the Project Locally

#### Environmetal Variables
Environmetal variables are required for setup to allow for MongoDB interaction. For reference, a `.env.example` file has been created at the project root.
Developers should create a `.env` file following this example, and update the `MONGODB_URI` to their own connection string.

#### Dependencies Installation
`npm` was utilised as a package manager tool in this project. To install dependencies, from the project root folder `event-timeline-visualiser`:
```bash
npm install
```

#### Database Population
A database population script has been provided in this project. From the project root folder `event-timeline-visualiser` (after installing dependencies):
```bash
npm run populate-data
```

#### Running the Site
From the project root folder `event-timeline-visualiser`:
```bash
npm run dev
```
The site shall then be accessible at [http://localhost:3000](http://localhost:3000).


## Deployment on Vercel


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