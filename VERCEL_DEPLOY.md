# Deploy to Vercel - Step by Step

## Prerequisites

1. ✅ Your code is working locally
2. ✅ Supabase is set up (you have `.env.local` with keys)
3. ✅ You have a GitHub account (free)

## Step 1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready to deploy"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/this-or-that.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "Add New Project"**
4. **Import your GitHub repository:**
   - Find "this-or-that" (or your repo name)
   - Click "Import"
5. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
6. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add these two:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - Make sure they're enabled for **Production**, **Preview**, and **Development**
7. **Click "Deploy"**
8. **Wait 2-3 minutes** for build to complete
9. **Your app is live!** 🎉

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? this-or-that
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Step 3: Your App is Live!

After deployment, you'll get:
- **Production URL:** `https://this-or-that.vercel.app` (or your custom name)
- **Automatic HTTPS**
- **Global CDN**

## Step 4: Automatic Deployments

Every time you push to GitHub:
- ✅ Vercel automatically builds and deploys
- ✅ Pull requests get preview URLs
- ✅ Zero downtime deployments

## Step 5: Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Settings → Domains
3. Add your domain (e.g., `brackets.yourdomain.com`)
4. Follow DNS instructions
5. Wait for SSL certificate (automatic)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Make sure `npm run build` works locally first
- Verify all environment variables are set

### Environment Variables Not Working
- Make sure they're set for **Production** environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### App Works But Can't Sign In
- Verify Supabase environment variables are set in Vercel
- Check Supabase dashboard → Settings → API → CORS
- Add your Vercel domain to allowed origins if needed

## What You Get

✅ **Free Tier Includes:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Global CDN
- Preview deployments for PRs
- Analytics (basic)

✅ **Perfect for:**
- Personal projects
- Small to medium apps
- Production-ready hosting

## Next Steps After Deployment

1. Test your live app
2. Share the URL with others
3. Create custom brackets
4. Test syncing across devices
5. Add a custom domain (optional)

Your bracket app is now live on the internet! 🚀

