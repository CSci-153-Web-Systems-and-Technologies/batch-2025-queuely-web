# Queuely Web

A modern, real-time Queue Management System (QMS) designed to streamline service operations, reduce wait times, and enhance customer experience. Built with Next.js, Supabase, and TypeScript, Queuely offers both admin and user interfaces for seamless ticket creation and service management.

## ✨ Features

- **Real-time Queue Status**: Users see their live position, estimated wait time, and service time updates.
- **Admin Dashboard**: Manage tickets, view real-time statistics (volume, completed services, average wait time), and control the queue flow.
- **Automated Queue Rules**: Toggle Auto-Advance (automatically call next customer after service complete) and Auto-Rollback (place skipped/no-show tickets at the end of the line).
- **Dynamic Metrics**: Wait time calculations are based on the administrator-configured average service time.
- **Role-Based Access**: Secure separation of Admin and User dashboards via database roles.
- **Responsive Design**: Works perfectly on mobile devices for both staff and customers.
- **Secure Authentication**: Uses Supabase Auth for user and admin login.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS with Radix/shadcn/ui components
- **Data Visualization**: Recharts
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- Git installed on your machine

## 🛠️ Installation

1. **Clone the repository**
   `bash
git clone https://github.com/YourRepoName/batch-2025-queuely-web.git
cd batch-2025-queuely-web
`

2. **Install dependencies**
   `bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   `
3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   `env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
`
4. **Supabase Setup**

Queuely requires three main tables: users, queues, and tickets.

1. Table Definitions
   This block creates the three main tables: users, queues, and tickets.

```SQL

-- =======================================================================
-- 1. USERS TABLE (User Profiles & Roles)
-- =======================================================================
CREATE TABLE public.users (
user_id UUID REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
email TEXT UNIQUE NOT NULL,
role TEXT NOT NULL DEFAULT 'user', -- Defines access level: 'user' or 'admin'
first_name TEXT,
last_name TEXT,
preferred_name TEXT,
avatar_url TEXT
);

-- =======================================================================
-- 2. QUEUES TABLE (Global Configuration)
-- =======================================================================
-- Note: This table should typically only contain one row.
CREATE TABLE public.queues (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
name TEXT NOT NULL DEFAULT 'Main Service Queue',
avg_service_time INTEGER NOT NULL DEFAULT 5, -- Used for metric calculation
max_capacity INTEGER,
maintenance_mode BOOLEAN DEFAULT FALSE,
auto_advance BOOLEAN DEFAULT FALSE, -- Auto-call next person upon service completion
auto_rollback BOOLEAN DEFAULT FALSE -- Put skipped person back to waiting
);

-- =======================================================================
-- 3. TICKETS TABLE (Queue Data)
-- =======================================================================
CREATE TABLE public.tickets (
ticket_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
ticket_number SERIAL, -- Auto-incrementing, user-facing number
user_id UUID REFERENCES auth.users(id),
queue_id UUID REFERENCES public.queues(id) ON DELETE CASCADE NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
completed_at TIMESTAMP WITH TIME ZONE,
status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'serving', 'completed', 'cancelled'
is_priority BOOLEAN DEFAULT FALSE
); 2. Initial Configuration
You must run this once to create the core configuration row, which your application relies on for the queue_id.
```

```SQL

-- Insert the initial required configuration row
INSERT INTO public.queues (name, avg_service_time) VALUES ('Customer Service Desk', 5); 3. Row Level Security (RLS) Policies
These policies are critical for application security and functionality.

SQL

-- Enable RLS on custom tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- CRITICAL POLICY: Allow new users to create their own profile row
CREATE POLICY "allow_user_self_insert"
ON "public"."users"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS for Queues (Admin/Auth users can read the global config)
CREATE POLICY "authenticated_can_read_queues"
ON "public"."queues"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);
```

## 🏃‍♂️ Running the Application

1. **Start the development server**

   ```bash
   npm run dev

   # or

   yarn dev

   # or

   pnpm dev
   ```

2. **Open your browser**

   1. Start the development server

      ```Bash

      npm run dev
      ```

   2. Open your browser Navigate to http://localhost:3000

## 📖 Usage

### For Admin/Staff:

1. **Log In**: Use an account that has been manually set to role: 'admin' in the public.users table.
2. **Configure**: Visit /dashboard/settings to set avg_service_time, max_capacity, and queue rules.
3. **Manage Queue**: Access the Queue Management panel to process customers and adjust priorities.
4. **View Analytics**: Monitor performance via the main /dashboard page.

### For Users:

1. **Access Session**: Scan QR code or visit the session URL
2. **Submit Questions**: Enter your name (optional) and question
3. **Real-time Feedback**: See confirmation when questions are submitted

## 📁 Project Structure

```
batch-2025-queuely-web/
├── app/
│   ├── (auth)/             # Login/Signup pages
│   ├── (user)/             # User Dashboard (Home)
│   ├── (admin)/            # Admin Dashboard, Queue Management, Settings
│   └── layout.tsx
├── components/             # Reusable UI components
├── lib/
│   └── supabase/           # Supabase client initialization
├── utils/
│   └── queue-service.ts    # Core queue logic (metrics, join/leave, callNext)
├── types/
└── public/
```

## 🔧 Configuration

### Environment Variables

| Variable                        | Description                     | Required |
| ------------------------------- | ------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL       | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key     | Yes      |
| `NEXT_PUBLIC_BASE_URL`          | Base URL for QR code generation | Yes      |

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KaelNierras/class-qa-board)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
