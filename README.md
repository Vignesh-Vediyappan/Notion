# Notion-Style Web App

A modern, responsive Notion-style web application built with Next.js, React, Tailwind CSS, and Supabase.

## Features

✅ **Authentication** - Login/signup/logout via Supabase Auth  
✅ **Page Management** - Create, edit, and organize pages  
✅ **Hierarchical Structure** - Support for nested pages with parent-child relationships  
✅ **Markdown Editor** - Rich text editing with live preview  
✅ **Auto-save** - Automatic saving with manual save option  
✅ **Dark/Light Mode** - Toggle between themes  
✅ **Real-time Sync** - Live updates using Supabase realtime  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Modern UI** - Clean, intuitive interface inspired by Notion  

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **Markdown**: react-markdown with syntax highlighting
- **Icons**: Lucide React
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone <repository-url>
cd notion-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL to create the tables and policies

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Schema

The app uses a simple but powerful schema:

```sql
CREATE TABLE pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  content text,
  parent_id uuid references pages(id),
  created_at timestamp with time zone default now()
);
```

### Key Features:

- **User Isolation**: Each user can only see their own pages
- **Hierarchical Structure**: Pages can have parent-child relationships
- **Automatic Timestamps**: Created date is automatically set
- **Cascade Deletion**: Deleting a parent page removes all children

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── workspace/         # Main workspace page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects)
├── components/            # React components
│   ├── providers/         # Context providers
│   ├── ui/                # UI components
│   ├── Editor.tsx         # Markdown editor
│   └── Sidebar.tsx        # Page navigation sidebar
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── useTheme.ts        # Theme management hook
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client and helpers
├── types/                 # TypeScript type definitions
│   └── database.ts        # Database types
└── database-schema.sql    # Database setup script
```

## Features in Detail

### Authentication
- Email/password authentication via Supabase
- Automatic session management
- Protected routes
- User-specific data isolation

### Page Management
- Create new pages with the "+ Add Page" button
- Hierarchical page structure with expandable/collapsible tree
- Edit page titles and content
- Delete pages (with cascade deletion for children)

### Markdown Editor
- Live preview toggle
- Syntax highlighting for code blocks
- Support for GitHub Flavored Markdown
- Auto-save functionality (2-second delay)
- Manual save option

### Real-time Features
- Live page updates across browser tabs
- Real-time collaboration ready (can be extended)
- Optimistic UI updates

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile
- Touch-friendly interface
- Adaptive layouts for different screen sizes

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Adding New Features

1. **New Pages**: Add routes in the `app/` directory
2. **Components**: Create reusable components in `components/`
3. **Hooks**: Add custom hooks in `hooks/`
4. **Database**: Update schema in `database-schema.sql` and types in `types/database.ts`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

Built with ❤️ using Next.js, React, and Supabase 