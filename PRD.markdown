# Product Requirements Document

## 1. Product Overview

An AI‑powered SaaS platform for traditional small businesses (local F&B, boutique hotels, lifestyle brands) that automates the end‑to‑end content ideation and publishing workflow:

- Crawl trending topics & competitors' posts
- Suggest relevant content angles
- Generate brand‑voice–compliant copy
- Repurpose and schedule across multiple channels

## 2. Goals & Objectives

- **Time saved:** Reduce content prep from hours to a minutes
- **Cost reduction:** Replace 1–2 junior hires with a single subscription
- **Engagement lift:** Deliver measurable 30% uplift in reach and interactions
- **Consistency:** Maintain on‑brand voice across all posts and platforms

## 3. Target Users

Owners/managers of small cafés, family‑run restaurants, boutique hotels, lifestyle studios with <$1M ARR, non‑technical, budget‑conscious, seeking efficiency and growth.

## 4. User Stories

- As a café owner, I want to import a competitor's Facebook page URL, so I can see trending topics in my niche.
- As a marketing lead, I want the system to suggest three content angles per trend, so I don't start from a blank page.
- As a social manager, I want to save my personal brand profile, so every generated post matches my tone.
- As a hotel marketer, I want to publish to Facebook, Instagram, and Linkedin with one click, so I avoid manual formatting.
- As a founder, I want a dashboard showing post performance, so I can prove ROI.

## 5. Functional Requirements

### 5.1 AI Account Analyst (Second Screen)

- **Account Analysis**
  - Input: Single URL field for social media account (Facebook, LinkedIn, X, Instagram, TikTok)
  - Analysis output per post (most recent 10-20 posts):
    - Title/Main message
    - Hook (opening lines)
    - Content theme categorization (e.g. storytelling, listicle, how-to)
    - Performance metrics (reach, engagement rate)
  - Interactive features:
    - Click-to-generate: Each analyzed post can be clicked to use as inspiration in section 5.4
    - Sort by: reach, engagement rate, theme
  - Reset/New Analysis: Clear button to analyze a new account

- **Keyword Trend Analysis** (Phase 2)
  - Move keyword tracking functionality to Phase 2 roadmap due to:
    - Higher API costs for real-time trend monitoring
    - Complex implementation requirements
    - Initial focus on direct competitor analysis provides better ROI

### 5.2 Onboarding Flow: Personal Brand Profiling

1. **Step 1: Introduction**
   - Welcome screen explaining the profiling process and benefits.
   - CTA: "Let's define your brand"

2. **Step 2: Content Import & Selection**
   - Option A: Copy-paste up to 3 of your best existing posts or articles.
   - Option B: Provide a link to your social account (Facebook, Instagram, LinkedIn, X).
   - If Option B: display up to 10 recent posts with checkboxes for selection.
   - User selects 3 pieces that best represent their brand voice.
   - User types unique vocabulary list with on-brand words and phrases in a text box.

3. **Step 3: Profile Generation & Confirmation**
   - AI analyzes selected to generate a Personal Brand Profile:
     - Brand Voice
     - Suggested unique vocabulary list
   - User reviews and edits any attribute before saving.

**Post‑Onboarding Redirect:** Upon completion, user is immediately taken to Section 5.3 AI Content Creator screen.

### 5.3 AI Content Creator (Initial Screen)

#### Dashboard Header
- Welcome message displaying user's profile name
- Key metrics display:
  - Recent Posts (Last 30 days with % change)
  - Total Engagement (Likes, comments, shares with % change)
  - Audience Growth (New followers with % change)
  - Content Queue (Number of scheduled posts)

#### Content Creation Flow
1. **Primary Input Box**
   - Large text area with placeholder "What's on your mind today?"
   - Supports direct typing or paste functionality

2. **Theme Selection**
   - Dropdown menu "Choose a Saved Theme" with options:
     - Storytelling: Narrative-driven posts that connect emotionally
     - How-to Guide: Step-by-step instructional content
     - Case Study: Success stories and results showcase
     - Quick Tips: Bite-sized, actionable advice
     - News: Updates and trend analysis
     - Q&A Format: Educational question-and-answer style
     - Product Showcase: Highlight features and benefits
     - Customer Stories: Testimonials and user experiences
     - Event Promotion: Announcements and invitations

3. **Output Format Selection**
   - Toggle buttons for platform selection:
     - Facebook Post
     - Instagram Caption
     - LinkedIn Update
     - TikTok Script
     - X Post

4. **Generation & Preview**
   - Primary CTA: "Generate" button
   - Secondary text box displays AI-generated suggestion
   - Edit functionality in preview box
   - "Schedule Post" button to proceed to scheduling

### 5.4 Multi-Platform Scheduling (Phase 1)

#### Calendar View
- Monthly calendar interface
- Visual indicators for scheduled posts
- Click date to open scheduling modal

#### Scheduling Modal (Phase 1)
- Date and time picker
- Platform selection (checkboxes for multi-platform posting)
- Post preview with edit capability
- Basic media upload:
  - Single image upload support
  - Multiple image upload (up to 4)
  - Note: Video upload moved to Phase 2

#### Upcoming Posts List
- Chronological list of scheduled posts
- Per post:
  - Date and time
  - Target platform(s)
  - Preview snippet
  - Edit and Delete actions
- "Schedule New Post" CTA button

#### Phase 2 Features (Future Implementation)
- Video upload and processing
- Auto-resize images for different platforms
- Carousel post creation
- Story format support
- Advanced media editing tools

### 5.5 Performance Analytics

#### Dashboard Header (Same as 5.3)
- Key metrics display:
  - Recent Posts (Last 30 days with % change)
  - Total Engagement (Likes, comments, shares with % change)
  - Audience Growth (New followers with % change)
  - Content Queue (Number of scheduled posts)

#### Filter Controls
- Date Range Selector
  - Quick select options: Last 7 days, Last 30 days, Last 90 days, Custom range
  - Custom date picker for precise range selection
- Platform Filter
  - Multi-select dropdown for Facebook, Instagram, LinkedIn, X
  - "Select All" option
  - Note: TikTok analytics moved to Phase 3 due to API limitations

#### Performance Charts (Tabbed Interface) (Phase 2)
1. **Reach & Engagement Tab**
   - Line chart showing daily reach trends
   - Bar chart comparing engagement metrics (likes, comments, shares)
   - Note: Advanced metrics like story views, saves moved to Phase 3

2. **Demographics Tab** (Phase 3)
   - Age distribution pie chart
   - Gender distribution chart
   - Location heat map
   - Note: Requires additional API permissions and data processing

3. **Content Performance Tab**
   - Top performing posts by reach
   - Best performing content themes
   - Engagement rate trends
   - Note: Advanced content analysis features moved to Phase 3

#### Recent Posts List
- Chronological table view of posts with columns:
  - Platform icon
  - Post date/time
  - Content snippet (truncated)
  - Performance metrics:
    - Reach/Views
    - Likes
    - Comments
    - Shares
  - Engagement rate calculation
- Sortable by any column
- Pagination (20 posts per page)
- Note: Advanced sorting and filtering moved to Phase 3

#### Export Functionality (Phase 2)
- "Export to PDF" button in top-right corner
- PDF report includes:
  - Date range and platform filters applied
  - Summary metrics
  - Key charts (as images)
  - Top performing posts list
  - Note: Custom report templates moved to Phase 3

#### Phase 3 Features (Future Implementation)
- Advanced demographic analysis
- Competitor benchmarking
- Custom report templates
- Automated insights generation
- Cross-platform performance comparison
- Video-specific analytics
- Story performance tracking
- Hashtag performance analysis

## 6. Non-Functional Requirements

- **Performance:** Generate up to 10 posts in < 2 minutes
- **Scalability:** Support 1,000+ users with auto‑scaling on Vercel
- **Security & Privacy:** GDPR and local data‑privacy compliance; OAuth for social accounts
- **Localization:** Vietnamese and English interfaces; local date/time formats

## 7. Pricing & Packaging

### Feature Breakdown by Tier

#### Freemium
- free of charge
- 5 posts per month
- Single account access
- Basic analytics dashboard
- Community support

#### Plus
- $19/m
- 50 posts per month
- 1 brand profile
- Basic analytics dashboard
- Email support
- Content performance metrics
- Standard post scheduling

#### Pro
- $49/m
- 200 posts per month
- 2 brand profiles
- Advanced analytics suite
- Priority support via email/chat
- Weekly strategy call with our team
- Enhanced post scheduling
- Competitor analysis tools
- Custom brand voice settings

#### Premium
- $99/m
- 600 posts per month
- 5 brand profiles
- Advanced analytics suite
- Priority support via email/chat
- Weekly strategy call with our team
- Enhanced post scheduling
- Competitor analysis tools
- Custom brand voice settings
- Priority feature requests

### Affiliate Program Structure

#### Commission Tiers
- **Launch Phase (First 12 months):** 50% commission on all referred subscriptions
- **Growth Phase (Months 13-24):** 30% commission on all referred subscriptions

#### Affiliate Tools & Support
- White-labeled affiliate dashboard
- Custom tracking links and landing pages
- Automated commission tracking and payouts
- Performance analytics and reporting
- Marketing materials and templates
- Dedicated affiliate support team

#### Affiliate Onboarding
- Automated application process
- Quick-start guide and training materials
- Custom Loom video walkthroughs
- Initial outreach templates
- Performance benchmarks and goals

## 8. Milestones & Roadmap

### Phase 1 (Core Platform)
- AI account analyst
  - Single URL input for social media accounts
  - Post analysis (title, hook, theme, metrics)
  - Interactive click-to-generate features
  - Sort and filter capabilities
- Personal brand profile generation
  - Onboarding flow with content import
  - Brand voice analysis
  - Vocabulary list generation
- AI Content creator
  - Theme selection
  - Single platform support
  - Basic post generation
- Basic scheduling
  - Calendar view
  - Single image upload
  - Basic post scheduling
- Initial analytics
  - Basic metrics dashboard
  - Recent posts tracking
  - Engagement metrics
- Freemium launch

### Phase 2 (Enhanced Features)
- Multi-platform support
  - Cross-platform posting
  - Multiple image upload (up to 4)
  - Platform-specific formatting
- Advanced analytics
  - Performance charts
  - Content performance tracking
  - Export to PDF functionality
- Keyword trend analysis
  - Competitor tracking
  - Trend monitoring
  - Content suggestions
- Voice fingerprinting
  - Brand voice consistency
  - Tone matching
  - Style adaptation
- Affiliate Program Launch
  - Affiliate dashboard development
  - Commission tracking system
  - Automated payout processing
  - Performance analytics
  - Marketing materials creation
- Influencer Outreach
  - B- and C-list creator targeting
  - Custom outreach automation
  - Performance tracking
  - Relationship management

### Phase 3 (Advanced Capabilities)
- Media handling
  - Video upload and processing
  - Carousel post creation
  - Story format support
  - Advanced media editing tools
- Advanced analytics
  - Demographic analysis
  - Competitor benchmarking
  - Custom report templates
  - Cross-platform performance comparison
  - Story performance tracking
  - Hashtag performance analysis
- Campaign features
  - Campaign planner
  - Influencer insights
  - Video-snippet generation

### Phase 4 (Growth & Scale)
- Growth Features
  - Advanced automation
  - AI-powered insights
  - White-label options
  - Enterprise-grade features
- Platform Expansion
  - Additional social media integrations
  - Local platform integrations
  - API marketplace
- Advanced AI Features
  - Predictive analytics
  - Automated content strategy
  - Smart budget allocation

### Future Considerations
- Additional platform integrations
- Advanced AI features
- Custom workflow automation
- Enterprise-grade features

## 9. Success Metrics

- **Adoption:** 500 freemium sign‑ups by month 2
- **Conversion:** 10% freemium → paid within 30 days
- **Engagement:** Average 15% lift in post reach for pilot cohort
- **Retention:** 80%+ 3‑month retention rate among paid users