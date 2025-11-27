# Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel is made by the Next.js team and offers the easiest deployment experience.

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/jayjosephent/this-or-that.git
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/login with your GitHub account

3. **Click "Add New Project"**

4. **Import your repository** from GitHub

5. **Configure the project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

6. **Click "Deploy"** - Vercel will automatically:
   - Install dependencies
   - Build your app
   - Deploy it to a live URL

7. **Your app will be live at:** `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts** - it will ask you to:
   - Link to existing project or create new
   - Confirm settings
   - Deploy

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

## Alternative: Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Go to [netlify.com](https://netlify.com)** and sign up/login

3. **Click "Add new site" → "Import an existing project"**

4. **Connect to GitHub** and select your repository

5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

6. **Click "Deploy site"**

## Important Notes

### Custom Brackets Storage
- Custom brackets are stored in **localStorage** (browser storage)
- This means:
  - ✅ Each user's custom brackets are saved in their browser
  - ❌ Custom brackets won't sync across devices
  - ❌ If user clears browser data, custom brackets are lost

### Future Enhancement (Optional)
If you want custom brackets to persist across devices, you'll need to:
- Add a database (e.g., Supabase, Firebase, or Vercel Postgres)
- Create API routes to save/load brackets
- Add user authentication

### Environment Variables
Currently, your app doesn't require any environment variables. If you add features that need them (like API keys), you can add them in:
- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Environment Variables

## Post-Deployment

After deployment, you can:
- **Custom Domain:** Add your own domain in Vercel/Netlify settings
- **Automatic Deployments:** Every push to main branch auto-deploys
- **Preview Deployments:** Pull requests get preview URLs automatically

## Troubleshooting

### Build Fails
- Check that `npm run build` works locally first
- Review build logs in Vercel/Netlify dashboard
- Ensure all dependencies are in `package.json`

### App Works Locally But Not Online
- Check browser console for errors
- Verify all API calls use relative paths (not `localhost`)
- Check that localStorage is available (it should be in browsers)

## Need Help?

- **Vercel Docs:** https://nextjs.org/docs/deployment
- **Vercel Support:** https://vercel.com/support
- **Next.js Deployment:** https://nextjs.org/docs/deployment



