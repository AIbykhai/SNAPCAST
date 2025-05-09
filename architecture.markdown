# Architecture Overview

## Project Structure

### Documentation Files
- `PRD.markdown`: Product Requirements Document detailing features, user stories, and requirements
- `implementation-plan.markdown`: Step-by-step implementation guide for Phase 1
- `progress.markdown`: Tracks implementation progress and completed steps
- `architecture.markdown`: This file - documents system architecture and file purposes

### Configuration Files
- `package.json`: Node.js project configuration and dependencies
- `package-lock.json`: Locked versions of dependencies for consistent installations
- `playwright.config.ts`: Playwright testing framework configuration
- `.gitignore`: Specifies files and directories to be ignored by Git
- `.env.local`: Environment variables for local development (gitignored)
- `.env.local.template`: Template for required environment variables

### Environment Management
- Local Development:
  - `.env.local` contains sensitive configuration
  - Never committed to Git (listed in .gitignore)
  - Required for local development and testing
- Production:
  - Environment variables managed in Vercel dashboard
  - Encrypted and secure
  - Environment-specific configurations supported

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
- Node.js-based project
- TypeScript support
- Playwright for testing
- Git for version control
- Environment-based configuration

### Deployment (Planned)
- Vercel deployment configuration pending
- Will support automatic deployments from main branch
- Will include preview deployments for pull requests
- Environment variables managed through Vercel dashboard
