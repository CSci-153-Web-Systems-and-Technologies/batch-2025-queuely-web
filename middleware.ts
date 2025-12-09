// /src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr'; // Required for secure server-side client

// Define the paths that require admin access
const ADMIN_PATHS = ['/dashboard', '/queue-management', '/settings', '/admin'];

/**
 * Reads the user's role from the JWT, or returns null if not signed in.
 * This function MUST be securely implemented on the server/edge environment.
 */
async function getUserRole(request: NextRequest): Promise<string | null> {
    // 1. Create a Supabase client configured for the Middleware/Edge environment
    // This is the secure way to access the session on the server/edge.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => request.cookies.get(name)?.value,
                set: () => {}, // Set/update cookies are handled separately, not needed here
                remove: () => {},
            },
        }
    );

    // 2. Get the current user session (this automatically decodes the JWT)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null; // Not authenticated
    }

    // 3. Fetch the role from the 'users' table using the user's ID
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

    return profile?.role || 'user'; // Default to 'user' if role isn't found
}

export async function middleware(request: NextRequest) {
    // ... (Your implementation code here)
    const { pathname } = request.nextUrl;
    
    const ADMIN_PATHS = ['/dashboard', '/queue-management', '/settings', '/admin'];
    const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path));

    if (isAdminPath) {
        const userRole = await getUserRole(request);
        
        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    return NextResponse.next();
}
// Configuration to define which paths the middleware should run on.
export const config = {
    matcher: [
        // Run middleware on all paths except static files and API routes
        '/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password).*)',
    ],
};