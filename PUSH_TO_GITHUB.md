# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `this-or-that` (or your preferred name)
3. Description: "Bracket tournament app"
4. Choose **Public** or **Private**
5. **DO NOT** check "Add a README file" or any other options
6. Click **"Create repository"**

## Step 2: Copy Your Repository URL

After creating the repo, GitHub will show you a URL like:
```
https://github.com/YOUR_USERNAME/this-or-that.git
```

**Copy this URL** - you'll need it in the next step.

## Step 3: Run These Commands

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 4: Verify

1. Go to your GitHub repository page
2. You should see all your files there!
3. ✅ Ready to deploy to Vercel

## Troubleshooting

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### "Authentication failed"
- Use a Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### "Permission denied"
- Make sure the repository name matches exactly
- Check you have write access to the repo

