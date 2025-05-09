# Implementation Plan for Phase 1

---

## 1. Initialize Git & Vercel Project

InitializeGitRepository()
  // Create Git repo in project folder
  // Commit v0.dev UI code
  // Set up .gitignore with .env.local, node_modules, etc.
Test: assert(git status == clean && initial commit exists)

ConnectToVercel()
  // Import Git repo in Vercel dashboard
  // Configure automatic deployments from main branch
  // Set up preview deployments for PRs
Test: onPush(main) -> vercelBuildStatus == success

---

## 2. Configure Environment Management

CreateEnvFile()
  // Add .env.local (gitignored)
  // Define required variables:
  // - DATABASE_URL
  // - OPENAI_API_KEY
  // - JWT_SECRET
  // - NEXT_PUBLIC_API_URL
  // - AUTH0_DOMAIN (for Phase 2)
  // - AUTH0_CLIENT_ID (for Phase 2)
Test: vercelEnvPull() populates .env.local

SetVercelEnvVars()
  // In Vercel Settings, add keys matching .env.local
  // Configure environment-specific variables
Test: deploy -> process.env.OPENAI_API_KEY is defined without errors

---

## 3. Provision & Connect Database

ProvisionDatabase()
  // Choose hosted Postgres (recommended for JSON support)
  // Update DATABASE_URL in .env.local
  // Configure connection pooling
Test: dbClient.connect(DATABASE_URL) succeeds

SetupORMAndMigrations()
  // Initialize Prisma
  // Define models:
  // - User (id, email, passwordHash, name, role, subscriptionTier, subscriptionStatus, createdAt, updatedAt)
  //   - subscriptionTier: enum ['free', 'plus'] (Phase 1)
  //   - subscriptionStatus: enum ['active', 'canceled', 'past_due']
  // - Usage (id, userId, featureKey, periodStart, count) with composite index
  //   - featureKey: enum ['ai_generation', 'scheduling', 'analytics']
  //   - count: tracks usage against plus tier limits (100 posts/month)
  // - BrandProfile (id, userId, name, voiceSummary, createdAt)
  // - Vocabulary (id, brandProfileId, term, type)
  // - ScheduledPost (id, userId, copy, imageURL, datetime, platform)
  // - DailyMetrics (userId, date, posts, reach, engagement)
  // - MonthlyMetrics (userId, month, ...)
  // Run initial migration
  // Define service layer:
  // - AIService (handles DeepSeek V3 and gpt-4o-mini integration)
  // - AnalyticsService (handles metrics aggregation)
  // - SchedulingService (handles post scheduling)
  // - BrandProfileService (handles profile management)
Test: database has all required tables with proper indexes

---

## 4. Implement Authentication

InstallAuthLibrary()
  // Add Auth0 (not NextAuth.js)
  // Configure session and User model
  // Set up email/password authentication
  // Prepare for Phase 2 OAuth integration
Test: GET /api/auth/session returns JSON session object

WireAuthUI()
  // Connect login/signup forms to auth endpoints
  // Implement role-based access control
  // Set up subscription tier checks
Test: userCanRegister() && userCanLogin() && sessionCookieExists()

---

## 5. Personal Brand Profiling Endpoints

API_ImportFromSocial(url)
  // Receive social account URL
  // Fetch last 10 posts
  // Implement rate limiting per subscription tier
Test: response.length == 10

API_PasteContent(postsArray)
  // Receive up to 3 text blobs
  // Store in profiling record
  // Track usage in Usage table
Test: return profilingId and status OK

API_GenerateProfile(postIds, vocabulary)
  // Load prompt template from /ai/prompts/brand-profile.md
  // Call DeepSeek V3 with fallback to gpt-4o-mini
  // Return voiceSummary and vocabularySuggestions
  // Cache identical prompts for X hours
  // Track usage against plus tier limits
Test: response has keys voiceSummary and vocabularySuggestions

---

## 6. AI Account Analyst Endpoint

API_AnalyzeAccount(url)
  // Scrape or mock 10 posts
  // For each, call OpenAI to categorize and score
  // Implement circuit breaker for social media APIs
Test: response items each have title, hook, theme, reach, engagementRate

WireUseAsInspiration()
  // On UI button click, prefill Creator input with selected post
  // Handle language-specific content
Test: creatorInput.value == selectedPost.text

---

## 7. AI Content Creator Endpoint

API_GenerateCopy(prompt, theme, platform)
  // Call DeepSeek V3 with fallback to gpt-4o-mini
  // Implement rate limiting and quota checks
  // Track usage against plus tier limits (100 posts/month)
  // Return generatedCopy
Test: response.generatedCopy is non-empty string

WireGenerateButton()
  // UI calls API_GenerateCopy
  // Display result in preview panel
  // Handle loading states and errors
Test: previewPanel.text == generatedCopy

---

## 8. Scheduling & Persistence

DefineScheduledPostModel()
  // ORM schema with all required fields
  // Add indexes for common queries
  // Implement soft delete
Test: table 'ScheduledPost' exists with proper indexes

API_CreateSchedule(scheduledPost)
  // Save record
  // Handle image upload and processing:
  // - Generate three sizes (thumb, post, full)
  // - Compress to 60-70% quality
  // - Store with proper naming convention
Test: DB contains scheduledPost.id

API_GetSchedules(userId)
  // Return future scheduled posts
  // Implement pagination
  // Handle timezone conversion
Test: response matches DB entries for userId

WireCalendarAndList()
  // Calendar and list fetch API_GetSchedules
  // Implement real-time updates
  // Handle timezone display
Test: newlyCreatedPost appears in calendar and list

---

## 9. Analytics Back-end

API_GetAnalyticsSummary(userId, dateRange)
  // Aggregate from pre-computed DailyMetrics/MonthlyMetrics
  // Handle timezone conversion
  // Implement caching for common queries
Test: response has all four metrics

API_GetAnalyticsPosts(filters)
  // Return paginated posts with metrics
  // Implement efficient filtering
  // Handle data retention (365 days for daily, 5 years for monthly)
Test: response array items have reach, likes, comments, shares

WireAnalyticsUI()
  // Summary cards call API_GetAnalyticsSummary
  // Table calls API_GetAnalyticsPosts
  // Implement real-time updates
Test: UI updates on filter change

---

## 10. Finalize & Deploy

ConfigureCI()
  // Set up GitHub Actions
  // Configure lint & build checks
  // Add performance testing for AI endpoints
  // Set up Playwright for E2E tests
  // Test subscription tier limits
Test: PR with errors -> CI fails

SmokeTestProduction()
  // Test end-to-end flows on prod domain
  // Verify plus tier features and limits
  // Check internationalization
  // Validate analytics aggregation
Test: all core flows complete without error

AnnounceLaunch()
  // Notify team with prod URL and roadmap
  // Set up monitoring alerts:
  // - Error: 5xx > 1% for 1 minute
  // - Warning: 4xx > 5% for 5 minutes
  // - Latency: P95 > 3s for 10 minutes
Test: teamCanAccessAndVerify() == true
