# Kanso — Clinical Operations Platform

Kanso is a modern, full-stack clinical operations platform that helps  service-based businesses manage bookings, contact form intake, communication, and resource tracking — all from a single, beautiful dashboard.

Built with a "Zen" design philosophy: minimal friction, maximum clarity.

**Live:** [kanso-8obp.vercel.app](https://kanso-8obp.vercel.app)

---

## What It Does

Kanso automates the operational overhead of running a practice. A business owner signs up, configures their services, and gets a public-facing booking page. When a customer books an appointment, Kanso automatically:

1. **Confirms the booking** and sends a confirmation email to the customer.
2. **Notifies the business owner** via email with all the appointment details.
3. **Sends an intake form link** so the customer can fill out pre-visit information.
4. **Logs everything** in a shared inbox for the team to review.

No manual follow-ups. No missed leads.

---

## How It Works — The Flow

### Customer Journey
```
Customer visits public booking page →
  Selects service, date & time →
    Submits booking with contact info →
       Booking created in database
       Confirmation email sent to customer (via Gmail SMTP)
       Notification email sent to business owner
       Intake form link sent to customer
       SMS confirmation sent (if Twilio configured)
```

### Contact Form Flow
```
Customer submits contact form →
  Contact record created →
    Message logged in shared inbox →
       "We received your message" email sent to customer
```

### Business Owner Journey
```
Sign up via Clerk →
  Complete onboarding wizard (8 steps) →
    Configure services, forms, inventory →
      Share public booking link →
        Manage everything from the dashboard
```

---

## Core Features

| Feature | Description |
|---|---|
| **Booking Engine** | Smart availability with buffer times, capacity limits, and day-of-week rules |
| **Automated Emails** | Confirmation, intake form links, and follow-ups — all sent automatically via Gmail SMTP |
| **Clinical Intake Forms** | Dynamic forms linked to services, filled by customers pre-visit |
| **Shared Inbox** | Unified view of all customer conversations (email + SMS) |
| **Inventory Tracking** | Track supplies with low-stock and expiry alerts |
| **Team Management** | Invite staff via Clerk organization — role-based access |
| **Public Pages** | Branded booking widget and contact form for each workspace |
| **Automation Engine** | Event-driven system — triggers emails/SMS on bookings, form submissions, and messages |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL via Neon (Prisma ORM) |
| Authentication | Clerk (Organizations + Multi-tenancy) |
| Email | Nodemailer (Gmail SMTP) |
| Styling | Tailwind CSS (custom Zen aesthetic) |
| UI Components | Radix UI / shadcn/ui |
| Forms | React Hook Form + Zod validation |
| Notifications | Sonner (toast) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g., [Neon](https://neon.tech))
- A [Clerk](https://clerk.com) account
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) for email

### Setup

```bash
# Clone and install
git clone https://github.com/aniket0929/kanso.git
cd careops-platform
npm install

# Configure environment
cp .env.example .env
# Fill in your values (see Environment Variables below)

# Initialize database
npx prisma db push

# Run locally
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# App URL
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Email (Gmail SMTP)
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM_NAME="Kanso"

# SMS (Optional)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
```

---

## Project Structure

```
├── app/
│   ├── (auth)/          # Sign-in / Sign-up pages
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── (onboarding)/    # Onboarding wizard
│   ├── (public)/        # Public booking & contact pages
│   └── api/             # Webhook endpoints
├── components/          # Reusable UI components
├── lib/
│   ├── actions/         # Server Actions (booking, forms, inbox)
│   ├── automation/      # Event-driven automation engine
│   └── services/        # Communication service (email, SMS)
├── prisma/              # Database schema
└── public/              # Static assets
```

---

## Deployment

Optimized for **Vercel**:

1. Connect your GitHub repo to Vercel.
2. Add all environment variables in the Vercel dashboard.
3. Deploy — the build command is `npm run build`.

---

## License

MIT

