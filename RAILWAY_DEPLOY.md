# Deploy to Railway - Alternative Option

**Note:** Vercel is recommended for Next.js apps, but Railway is also a great option if you prefer it.

## Railway vs Vercel

| Feature | Vercel | Railway |
|---------|--------|---------|
| Next.js Optimization | ✅ Built-in | ⚠️ Manual config |
| Free Tier | ✅ Generous | ✅ $5 credit/month |
| Setup Time | ⚡ 2 minutes | ⚡ 3-5 minutes |
| Auto Deploy | ✅ Yes | ✅ Yes |
| Environment Vars | ✅ Easy | ✅ Easy |

**Recommendation:** Use Vercel for Next.js apps (it's made by the Next.js team)

## Railway Deployment Steps

### Step 1: Push to GitHub
(Same as Vercel - see VERCEL_DEPLOY.md)

### Step 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-detect Next.js**

### Step 3: Add Environment Variables

1. Go to your project → **Variables** tab
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
3. Railway will auto-redeploy

### Step 4: Configure Build Settings

Railway should auto-detect, but verify:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Root Directory:** `./`

### Step 5: Get Your URL

Railway will give you a URL like:
`https://your-app.up.railway.app`

## Railway Specific Notes

- Uses Docker containers
- $5 free credit/month (then pay-as-you-go)
- Good for apps that need databases or background jobs
- Slightly more complex than Vercel for simple Next.js apps

## Recommendation

**Use Vercel** - It's specifically optimized for Next.js and requires zero configuration.

