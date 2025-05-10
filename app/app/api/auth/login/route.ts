import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }
        if (!password || typeof password !== "string") {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const lowercasedEmail = email.toLowerCase();

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: lowercasedEmail }
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Create new session
        const session = await auth.createSession(user.id, {});

        // Set session cookie
        cookies().set(auth.sessionCookieName, session.id, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        // Return success with user (excluding sensitive data)
        const { id, email: userEmail, createdAt, updatedAt } = user;
        return NextResponse.json({
            user: { id, email: userEmail, createdAt, updatedAt },
            message: "Login successful"
        });

    } catch (e: unknown) {
        console.error("Login error:", e);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
} 