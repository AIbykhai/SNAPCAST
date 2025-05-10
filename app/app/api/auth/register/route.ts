import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
// import { LuciaError } from "lucia"; // LuciaError is not directly exported in v3 for this type of check

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    console.log("Received registration request:", { email });

    if (!email || typeof email !== "string" || email.length < 3) {
        console.log("Invalid email input");
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        console.log("Invalid password input");
        return NextResponse.json(
            { error: "Password must be at least 6 characters long" },
            { status: 400 }
        );
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const lowercasedEmail = email.toLowerCase();

        // Check if user already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: lowercasedEmail }
        });
        console.log("Existing user by email:", existingUserByEmail);

        if (existingUserByEmail) {
            console.log("Email already registered");
            return NextResponse.json(
                { error: "Email already registered" }, 
                { status: 409 }
            );
        }

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                email: lowercasedEmail,
                passwordHash: hashedPassword,
            },
        });
        console.log("User created:", user);

        return NextResponse.json(
            { message: "User created successfully. Please log in." },
            { status: 201 }
        );

    } catch (e: any) {
        console.error("Registration error:", e);
        return NextResponse.json(
            { error: "An unexpected error occurred." }, 
            { status: 500 }
        );
    }
} 