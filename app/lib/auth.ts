import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "./db"; // Your Prisma client instance

// Adapter for Lucia v3
const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const auth = new Lucia(adapter, {
    sessionCookie: {
        expires: false, // Required for Next.js App Router to extend session duration
        attributes: {
            // set to `true` when using HTTPS. Important for production.
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        // attributes will have DatabaseUserAttributes type
        return {
            // IMPORTANT: define these in `DatabaseUserAttributes` interface below
            email: attributes.email,
            // Example: if you have `name` in your User model and want it on the User object
            // name: attributes.name,
        };
    },
    // sessionExpiresIn: new TimeSpan(30, "d"), // Optional: defaults to 2 weeks
});

export type Auth = typeof auth;

// IMPORTANT! Define Lucia Register interface for type safety
declare module "lucia" {
    interface Register {
        Lucia: typeof auth;
        DatabaseUserAttributes: {
            // Corresponds to the attributes returned by `getUserAttributes`
            // and fields on your Prisma User model.
            email: string;
            // name?: string; // if you included name in getUserAttributes
        };
        // Define if you have custom attributes in your Session model beyond Lucia's defaults
        DatabaseSessionAttributes: {}; 
    }
} 