// /src/middleware.ts (Final Recommended Code)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr'; // Necessary import

// Define admin paths (Keep this list accurate)
const ADMIN_PATHS = ['/dashboard', '/queue-management', '/settings', '/admin'];


// The core logic to fetch the role, simplified for reliability
async function getUserRole(request: NextRequest): Promise<string | null> {
    // Client configuration using cookies from the request
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => request.cookies.get(name)?.value,
                set: () => {}, 
                remove: () => {},
            },
        }
    );

    // Get the actual user object (which contains the ID)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null; // Not authenticated
    }

    // Fetch the role using the secure user ID
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

    return profile?.role || 'user';
}


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // 1. Setup client to handle cookies in the response
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => request.cookies.get(name)?.value,
                // Crucial: This ensures set/remove actions are applied to the request's cookies
                set: (name: string, value: string, options: any) => {
                    request.cookies.set({ name, value, ...options });
                },
                remove: (name: string, options: any) => {
                    request.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // 2. Refresh the session. This is the crucial step that writes cookies 
    // to the request's cookie store if needed.
    const { data: { session } } = await supabase.auth.getSession();
    
    
    // 3. Define the response object
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });


    // 4. Handle authorization if accessing an Admin route
    const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path));

    if (isAdminPath) {
        
        // If unauthenticated, redirect to login
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const userRole = await getUserRole(request);
        
        // If authenticated but wrong role, redirect to user home
        if (userRole !== 'admin') {
            console.warn(`Unauthorized access attempt to ${pathname} by role: ${userRole}`);
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }
    
    // 5. Apply updated cookies to the final response
    // This step forwards the updated session cookies from the request to the response
    // headers, making them available immediately to the client.
    if (session) {
        supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                // Manually set the session to update the cookies in the response
                supabase.auth.setSession(session);
            }
        });
    }

    return response; 
}

export const config = {
    // Ensure that login and signup pages are EXCLUDED from the middleware checks
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password).*)',
    ],
};