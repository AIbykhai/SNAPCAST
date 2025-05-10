import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client(); // Revert to minimal config
// The client will automatically pick up AAD_TENANT_ID, AAD_CLIENT_ID, AAD_CLIENT_SECRET, AUTH0_SECRET, APP_BASE_URL from .env.local
// Ensure these are correctly set in your app/.env.local file.
// AUTH0_DOMAIN (or AUTH0_ISSUER_BASE_URL), AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, APP_BASE_URL (or AUTH0_BASE_URL) 