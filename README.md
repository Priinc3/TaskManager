# TaskFlow - Task Management & Reminders

A modern task management system with intelligent reminders, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- ✅ **Task Management**: Create, edit, delete, and organize tasks
- 📋 **Multiple Views**: List view, calendar view (Kanban coming soon)
- 🔔 **Smart Reminders**: Set reminders with n8n integration for notifications
- 🏷️ **Categories & Tags**: Organize tasks with custom categories
- ✓ **Subtasks**: Break down tasks into smaller checklist items
- 🌙 **Dark Mode**: Beautiful dark/light theme toggle
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🔐 **Authentication**: Secure login with Supabase Auth

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State**: Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Notifications**: n8n workflows
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- n8n instance (optional, for reminders)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration: `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and anon key from Settings > API

### 3. Configure Environment

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
N8N_API_KEY=your-secure-api-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Setting Up n8n for Reminders

See [docs/n8n-workflow.md](docs/n8n-workflow.md) for detailed instructions on setting up the reminder notification workflow.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── tasks/            # Task-related components
│   └── layout/           # Layout components
├── lib/                   # Utilities and configurations
│   └── supabase/         # Supabase client setup
├── store/                 # Zustand state management
└── hooks/                 # Custom React hooks
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `N8N_API_KEY`

## License

MIT
