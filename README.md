# Kanso CareOps Platform

Kanso is a production-grade clinical operations platform designed to streamline administrative workflows, patient intake, and resource management for modern medical practices. Built with a focus on visual elegance and functional efficiency, it provides a comprehensive suite of tools for healthcare providers.

## Core Features

### Onboarding and Organization
- Multi-step clinical setup wizard.
- Integrated organization management via Clerk.
- Dynamic timezone and workspace configuration.

### Appointment Management
- Automated booking engine with clinical buffer times and capacity limits.
- Real-time dashboard for schedule monitoring.
- Detailed appointment records including patient profiles and timing.

### Clinical Intake Systems
- Integrated post-booking form automation.
- Dynamic field responses captured for provider review.
- Mobile-optimized public intake pages aligned with clinical branding.

### Resource and Inventory Tracking
- Multi-item inventory management system.
- Low-stock and expiry alerts.
- Resource allocation logic for services.

### Clinical Communication
- Shared inbox for patient messaging (Email and SMS).
- Real-time alerts and operational workspace feed.

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Database: PostgreSQL (Prisma ORM)
- Authentication: Clerk
- Styling: Tailwind CSS (Kanso Zen Aesthetic)
- UI Components: Radix UI / shadcn/ui
- Form Handling: React Hook Form / Zod
- Notifications: Sonner / Resend

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A PostgreSQL database instance (e.g., Neon Tech)
- Clerk, Resend, and Twilio accounts

### Local Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd careops-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see `.env.example` or list below):
   Create a `.env` file in the root directory.

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The following environment variables are required for full functionality:

### Database
- DATABASE_URL: Your PostgreSQL connection string.

### Authentication (Clerk)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_CLERK_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_SIGN_UP_URL
- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

### Communication
- RESEND_API_KEY: For email automation.
- TWILIO_ACCOUNT_SID: For SMS notifications.
- TWILIO_AUTH_TOKEN: For SMS notifications.
- TWILIO_PHONE_NUMBER: Your Twilio sender number.

## Deployment

This platform is optimized for deployment on Vercel.

1. Connect your GitHub repository to Vercel.
2. Configure the environment variables in the Vercel dashboard.
3. Ensure the `DATABASE_URL` points to a production PostgreSQL instance.
4. The build command is `npm run build`.

## Project Structure

- /app: Next.js App Router pages and layouts.
- /components: Reusable UI and feature-specific components.
- /lib: Shared utilities, database client, and server actions.
- /prisma: Database schema and migrations.
- /public: Static assets and icons.

## License

This project is licensed under the MIT License.
