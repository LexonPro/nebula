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

## Local-First Persistence & Optional Cloud Sync

* **Local-First Storage:** All your habits, dates, and check-offs are automatically and permanently saved to `localStorage`. Your progress will never wipe out on page refreshes or browser reopens.
* **Optional Cloud Sync:** If you configure Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`), you can sign in with an email account to sync habits across devices. If unconfigured, the app works 100% offline and locally.

---

## Development

```bash
npm run dev
```


