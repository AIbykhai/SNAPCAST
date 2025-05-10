# Architecture Overview

## Project Structure

### Documentation Files
- `PRD.markdown`: Product Requirements Document detailing features, user stories, and requirements
- `implementation-plan.markdown`: Step-by-step implementation guide for Phase 1
- `progress.markdown`: Tracks implementation progress and completed steps
- `architecture.markdown`: This file - documents system architecture and file purposes

### Configuration Files
- `package.json`: Node.js project configuration and dependencies for the root project
- `package-lock.json`: Locked versions of dependencies for consistent installations
- `playwright.config.ts`: Playwright testing framework configuration
- `.gitignore`: Specifies files and directories to be ignored by Git
- `app/`: Contains the Next.js application
  - `package.json`: Next.js application dependencies and scripts
  - `.env.local`: Environment variables for local development (gitignored)
  - `.env.local.template`: Template for required environment variables
  - `prisma/`: Database schema and migrations
    - `schema.prisma`: Prisma schema defining database models and relationships

### Environment Management
- Local Development:
  - `app/.env.local` contains sensitive configuration for the Next.js application
  - Never committed to Git (listed in .gitignore as `app/.env*.local`)
  - Required for local development and testing
  - Variables include:
    - DATABASE_URL: PostgreSQL connection string
      - **Note:** If your PostgreSQL password contains special characters (e.g., `#`, `@`, `!`), you must URL-encode them in the `DATABASE_URL`. For example, `#` becomes `%23` and `@` becomes `%40`. This ensures Prisma and other clients can parse the connection string correctly.
    - OPENAI_API_KEY: OpenAI API key
    - DEEPSEEK_API_KEY: Deepseek API key
    - JWT_SECRET: Secret for JWT token generation
    - NEXT_PUBLIC_API_URL: Backend API URL
    - AUTH0_DOMAIN: Auth0 domain (for Phase 2)
    - AUTH0_CLIENT_ID: Auth0 client ID (for Phase 2)
- Production:
  - Environment variables managed in Vercel dashboard
  - Encrypted and secure
  - Environment-specific configurations supported
  - Root Directory set to `app/` in Vercel settings

### Database Schema
- User Model:
  - Primary key: id (CUID)
  - Fields: email (unique), password_hash, timestamps
  - Relationships: has many BrandProfiles and Posts
- BrandProfile Model:
  - Primary key: id (CUID)
  - Fields: user_id (foreign key), name, description, tone, target_audience, timestamps
  - Relationships: belongs to User, has many Posts
  - Index: user_id for performance
- Post Model:
  - Primary key: id (CUID)
  - Fields: user_id, brand_profile_id, content, platform, status, scheduled_at, timestamps
  - Relationships: belongs to User and BrandProfile, has many ScheduledPosts
  - Index: user_id for performance
- ScheduledPost Model:
  - Primary key: id (CUID)
  - Fields: post_id, scheduled_time, platform, status, timestamps
  - Relationships: belongs to Post
  - Index: scheduled_time for performance

### API Structure
- Authentication Routes:
  - POST /api/auth/register: User registration with password hashing
  - POST /api/auth/login: User authentication with JWT token generation
- Security Features:
  - Password hashing using bcrypt
  - JWT token-based authentication
  - 30-minute session timeout
  - Rate limiting (100 requests/user/hour)

### Testing
- `tests-examples/`: Contains example test files and test utilities
- `snapcast/`: Contains project-specific test files
- `.github/workflows/playwright.yml`: GitHub Actions workflow for automated testing

## Key Components

### Testing Infrastructure
- Uses Playwright for end-to-end testing
- Configured with TypeScript for type safety
- Includes example tests for reference
- Automated testing via GitHub Actions

### Development Environment
- Node.js-based project with unified structure
- TypeScript support
- Playwright for testing
- Git for version control
- Environment-based configuration
- Next.js application in `app/` subdirectory
- Root-level scripts for running the application:
  - `npm run dev:app`: Starts Next.js development server
  - Other scripts run from the `app/` directory

### Deployment (Planned)
- Vercel deployment configuration pending
- Will support automatic deployments from main branch
- Will include preview deployments for pull requests
- Environment variables managed through Vercel dashboard
- Root Directory set to `app/` in Vercel settings

## Authentication System

### Overview
The application uses Lucia Auth for authentication, providing a secure and flexible authentication system with session-based authentication. Lucia Auth was chosen for its modern approach to authentication in Next.js applications, its TypeScript support, and its integration with Prisma.

### Components

#### 1. Auth Library (`app/lib/auth.ts`)
- Configures Lucia Auth with Prisma adapter
- Sets up session cookie management
- Defines user attributes to expose from sessions
- Provides TypeScript type definitions

#### 2. Authentication Endpoints
- **Register** (`app/app/api/auth/register/route.ts`): Handles user registration, creates user records and password keys
- **Login** (`app/app/api/auth/login/route.ts`): Authenticates users and creates sessions
- **Logout** (`app/app/api/auth/logout/route.ts`): Invalidates user sessions

#### 3. Middleware (`app/middleware.ts`)
- Protects routes by validating session cookies
- Redirects unauthenticated users to login page
- Allows public access to login, registration, and static assets

#### 4. Server Authentication Utilities (`app/lib/server-auth.ts`)
- `getCurrentUser()`: Gets the current authenticated user in server components
- `requireAuth()`: Enforces authentication for protected routes
- `redirectIfAuthenticated()`: Prevents authenticated users from accessing login/register pages

### Database Models
- **User**: Stores user information
- **Key**: Stores authentication credentials (email/password)
- **Session**: Stores active user sessions

### Authentication Flow
1. User registers with email/password
2. Credentials are validated and password is hashed
3. User record and key are created in the database
4. User logs in with email/password
5. Credentials are validated against stored hash
6. Session is created and session cookie is set
7. Protected routes check session validity through middleware
8. User logs out, invalidating the session

### Security Considerations
- Passwords are hashed using bcrypt
- Generic error messages prevent information leakage
- Session cookies are HTTP-only and secure in production
- CSRF protection through session validation

### Notes on Authentication Implementation (2025)
- The `User` model now stores password hashes directly in the `passwordHash` field. The `Key` table is no longer used for password authentication.
- API routes for login, register, and logout are located in `app/app/api/auth/` and are implemented using the latest Next.js 14+ cookies API (async/await required).
- All session management (set/delete) is handled via the new cookies API. See the API route files for up-to-date usage.
- If you encounter migration issues (e.g., required fields with nulls), see the troubleshooting section in `progress.markdown` for step-by-step solutions.
- The logout button in the UI must POST to `/api/auth/logout` and redirect to `/login` after logout.
- Always regenerate the Prisma client after schema changes.
