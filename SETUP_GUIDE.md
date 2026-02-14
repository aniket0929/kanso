# CareOps Setup Guide

## 1. Clerk Authentication (Required)

1.  Go to [Clerk Dashboard](https://dashboard.clerk.com/).
2.  Create a new application (e.g., "CareOps").
3.  Enable **Email/Password** and **Google** (optional) authentication.
4.  **Important**: Enable **Organizations** in the Clerk settings. This is required for the platform to work.
5.  Go to **API Keys** in the sidebar.
6.  Copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
7.  Paste them into your `.env` file.

## 2. Environment Variables (.env)

Your `.env` file should look like this:

```env
# Database (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (Do not change these)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## 3. Database Setup

Since we are using SQLite, no external database setup is required for now. The database file `dev.db` will be created automatically in your project folder when you run `npx prisma db push`.

## 4. Running the App

1.  Run `npx prisma db push` to sync the database.
2.  Run `npm run dev` to start the server.
3.  Open `http://localhost:3000`.
