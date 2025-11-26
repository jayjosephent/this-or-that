# Testing Cross-Device Syncing

## Quick Test Steps

### Step 1: Check if Supabase is Set Up

1. Check if you have a `.env.local` file in your project root
2. Open it and verify it has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

**If you don't have this file yet:**
- Follow `SUPABASE_SETUP.md` first to set up Supabase
- Then come back here

### Step 2: Start Your Dev Server

```bash
npm run dev
```

### Step 3: Test Authentication

1. Go to `http://localhost:3000/admin`
2. You should see a yellow banner saying "Sign in to sync brackets across devices!"
3. Click "Sign In to Sync"
4. Click "Sign Up" tab
5. Enter:
   - Email: `test@example.com` (or any email)
   - Password: `test123` (at least 6 characters)
6. Click "Sign Up"
7. You should see your email in the top right corner

### Step 4: Create a Test Bracket

1. Click "+ Create New Bracket"
2. Select "Top 8 Bracket"
3. Enter 8 test options (one per line):
   ```
   Option 1
   Option 2
   Option 3
   Option 4
   Option 5
   Option 6
   Option 7
   Option 8
   ```
4. Click "Continue"
5. Review and click "Continue" again
6. Skip starting options (or select 1-2)
7. Enter name: "Test Bracket"
8. Click "Save Bracket"
9. You should see "Bracket saved successfully!"

### Step 5: Verify It's in Supabase

1. Go to [supabase.com](https://supabase.com) and log in
2. Open your project
3. Go to **Table Editor** → **custom_brackets**
4. You should see your "Test Bracket" in the table!
5. Check that it has:
   - Your bracket name
   - Your user_id
   - The 8 options
   - Mode: 8

### Step 6: Test Syncing (Simulate Another Device)

1. Open a **new incognito/private browser window**
2. Go to `http://localhost:3000/admin`
3. Click "Sign In to Sync"
4. Sign in with the same email/password you used before
5. You should see your "Test Bracket" in the list!
6. This simulates accessing from another device

### Step 7: Test on Main Bracket Page

1. Go back to `http://localhost:3000` (main bracket page)
2. Open the category dropdown
3. You should see "Test Bracket" in the list!
4. Select it and use it - it should work perfectly

## What to Look For

✅ **Working correctly:**
- Can sign up/sign in
- Brackets save after clicking "Save Bracket"
- Brackets appear in Supabase table
- Brackets appear in dropdown on main page
- Can see brackets after signing in from "another device"

❌ **Not working:**
- "Failed to fetch brackets" errors
- Brackets don't appear in Supabase
- Can't sign up/sign in
- Brackets disappear after refresh

## Troubleshooting

### "Failed to fetch brackets from API"
- Check `.env.local` file exists and has correct values
- Restart dev server: `npm run dev`
- Check browser console (F12) for specific errors

### "Unauthorized" errors
- Make sure you're signed in (check top right of admin page)
- Try signing out and back in

### Brackets not in Supabase
- Check you ran the SQL schema (see SUPABASE_SETUP.md Step 5)
- Verify the `custom_brackets` table exists in Table Editor
- Check browser console for errors

### Can't sign up
- Make sure password is at least 6 characters
- Check email format is valid
- Check browser console for errors

## Success Checklist

- [ ] Can sign up for account
- [ ] Can sign in
- [ ] Can create a bracket
- [ ] Bracket appears in Supabase database
- [ ] Bracket appears in main page dropdown
- [ ] Can see bracket after signing in from "another device" (incognito)
- [ ] Can edit/delete brackets
- [ ] Changes sync immediately

Once all these work, your syncing is fully functional! 🎉

