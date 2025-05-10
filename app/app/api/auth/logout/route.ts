import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        // Get the session from the request
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(auth.sessionCookieName)?.value;
        
        if (!sessionId) {
            return NextResponse.json({ message: "No active session" }, { status: 200 });
        }

        // Invalidate the session
        await auth.invalidateSession(sessionId);
        
        // Create response and clear the session cookie
        const response = NextResponse.json({ message: "Logged out successfully" });
        
        // Clear the session cookie
        response.cookies.delete(auth.sessionCookieName);
        
        return response;
    } catch (e) {
        console.error("Logout error:", e);
        return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 });
    }
} 