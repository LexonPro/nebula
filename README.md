# Nebula Habit Tracker

A modern bullet-journal and spreadsheet-inspired habit tracker built with React 19, TypeScript, Tailwind CSS, Zustand, and Supabase.

---

## Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/LexonPro/nebula.git
cd nebula
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the Database Migration
In your Supabase project dashboard, navigate to the **SQL Editor** and run the contents of [`supabase-setup.sql`](./supabase-setup.sql) to create the `habits` and `entries` tables with Row Level Security (RLS).

---

## Enabling Google OAuth (3 Steps)

To allow users to log in with Google, you need to enable the Google Provider in Supabase:

1. **Create OAuth Credentials in Google Cloud Console:**
   * Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   * Create an **OAuth 2.0 Client ID** (Application type: *Web application*).
   * Under **Authorized redirect URIs**, add your Supabase project callback URL:
     ```
     https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback
     ```
   * Save and copy the **Client ID** and **Client Secret**.

2. **Enable Google Provider in Supabase:**
   * Open your [Supabase Dashboard](https://supabase.com/dashboard).
   * Navigate to **Authentication** > **Providers** > **Google**.
   * Toggle **Enable Google provider** to ON.
   * Paste your **Client ID** and **Client Secret**.
   * Under **URL Configuration**, ensure your site URL (e.g., `http://localhost:5173` or your production domain) is added.

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Click **Sign In** and **Continue with Google**.

