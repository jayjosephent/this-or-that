# Supabase Setup Guide - Cross-Device Bracket Syncing

This guide will walk you through setting up Supabase so your custom brackets sync across all devices.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub (recommended) or email
4. Create a new organization (or use default)
5. Click "New Project"

## Step 2: Create Your Project

1. **Project Name:** Enter a name (e.g., "this-or-that")
2. **Database Password:** Create a strong password (save this somewhere safe!)
3. **Region:** Choose the closest region to your users
4. **Pricing Plan:** Select "Free" (perfect for getting started)
5. Click "Create new project"
6. Wait 2-3 minutes for your project to be created

## Step 3: Get Your API Keys

1. Once your project is ready, go to **Settings** (gear icon) → **API**
2. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

3. Copy both of these - you'll need them in the next step

## Step 4: Set Environment Variables

1. In your project root, create a file called `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace `your-project-url-here` with your Project URL
3. Replace `your-anon-key-here` with your anon/public key

**Important:** Never commit `.env.local` to git! It's already in `.gitignore`

## Step 5: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Open the file `supabase-schema.sql` from your project
4. Copy the entire contents
5. Paste it into the SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

## Step 6: Verify the Table

1. Go to **Table Editor** (left sidebar)
2. You should see a table called `custom_brackets`
3. Click on it to see the structure:
   - `id` (text)
   - `user_id` (uuid)
   - `name` (text)
   - `mode` (integer)
   - `options` (text array)
   - `must_start` (text array)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## Step 7: Test Locally

1. Make sure your `.env.local` file is set up correctly
2. Restart your dev server:
   ```bash
   npm run dev
   ```
3. Go to `http://localhost:3000/admin`
4. Click "Sign In to Sync"
5. Create an account with email/password
6. Create a custom bracket
7. It should save to Supabase!

## Step 8: Deploy to Vercel

When deploying to Vercel, you need to add your environment variables:

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
4. Make sure they're set for **Production**, **Preview**, and **Development**
5. Redeploy your app (or it will auto-deploy on next push)

## How It Works

- **Authentication:** Users sign up/sign in with email and password
- **Data Storage:** Custom brackets are stored in Supabase database
- **Row Level Security:** Each user can only see/edit their own brackets
- **Sync:** Brackets automatically sync across all devices when user is logged in
- **Fallback:** If user is not logged in, brackets use localStorage (local only)

## Troubleshooting

### "Failed to fetch brackets from API"
- Check that your `.env.local` file has the correct values
- Make sure you restarted your dev server after adding env variables
- Check browser console for specific error messages

### "Unauthorized" errors
- User needs to be logged in to save brackets
- Check that authentication is working (try signing in/out)

### Database errors
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that the table `custom_brackets` exists in Table Editor
- Verify Row Level Security policies are enabled

### Brackets not syncing
- Make sure user is logged in on both devices
- Check that both devices are using the same Supabase project
- Verify environment variables are set correctly on both

## Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) ensures users can only access their own data
- Never commit your `.env.local` file to git
- The database password is only needed for direct database access (not for the app)

## Next Steps

Once set up, users can:
1. Sign up for an account
2. Create custom brackets
3. Access their brackets from any device
4. Edit/delete brackets (changes sync automatically)

Your brackets will now sync across all devices! 🎉



