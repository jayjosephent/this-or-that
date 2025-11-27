import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // During build time or if env vars are missing, provide defaults
  // This prevents build errors but the client won't work until env vars are set
  if (!url || !key) {
    console.warn("Supabase environment variables not set. Using placeholder values.");
    return createBrowserClient(
      url || "https://placeholder.supabase.co",
      key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    );
  }
  
  return createBrowserClient(url, key);
}



