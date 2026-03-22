# Deploy to GitHub Pages Guide

This guide will help you deploy your personal website to GitHub Pages.

## Prerequisites

- GitHub account (username: `ariwijaya-dev`)
- Git installed on your machine
- Node.js 22+ installed

## Deployment Steps

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Repository name: `personal-website`
5. Set to **Public** (required for GitHub Pages free tier)
6. **Do NOT** initialize with README, .gitignore, or license
7. Click **Create repository**

### 2. Initialize Git and Push

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Personal website"

# Rename branch to master (if needed)
git branch -M master

# Add remote repository
git remote add origin https://github.com/ariwijaya-dev/personal-website.git

# Push to GitHub
git push -u origin master
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/ariwijaya-dev/personal-website
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**, select **GitHub Actions** (NOT "Deploy from a branch")
5. The workflow will automatically run on the next push

### 4. Trigger Deployment

The deployment workflow will automatically run when you push to the `master` branch.
If you just pushed your code, check the **Actions** tab to see the deployment progress.

### 5. Access Your Website

Once the deployment is complete (usually takes 1-2 minutes), your website will be available at:

**https://ariwijaya-dev.github.io/personal-website/**

## Configuration Files

The following files have been automatically configured:

### `astro.config.mjs`
- `site`: Set to `https://ariwijaya-dev.github.io`
- `base`: Set to `/personal-website`

### `.github/workflows/deploy.yml`
- Automated deployment workflow
- Triggers on push to `master` branch
- Builds with Node.js 22
- Deploys to GitHub Pages

## Making Updates

To update your website:

1. Make changes to your files
2. Commit and push to GitHub:

```bash
git add .
git commit -m "Your commit message"
git push
```

3. The deployment will automatically start
4. Check the **Actions** tab to monitor progress

## Custom Domain (Optional)

If you want to use a custom domain:

1. In your repository, go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `ariwijaya.com`)
3. Update your DNS records with your domain provider
4. Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://ariwijaya.com', // Your custom domain
  base: '/', // Remove the base path for custom domains
  // ... rest of config
});
```

## Troubleshooting

### Deployment Failed

1. Check the **Actions** tab for error logs
2. Ensure `package.json` has the `build` script
3. Verify Node.js version is 22+

### 404 Not Found

1. Wait a few minutes after deployment
2. Check the URL is correct: `https://ariwijaya-dev.github.io/personal-website/`
3. Ensure GitHub Pages is enabled in Settings

### Styles Not Loading

1. Clear your browser cache
2. Check the base path in `astro.config.mjs` matches your repo name
3. Verify files are building correctly locally with `npm run build`

## Local Testing

Before pushing to GitHub, test your build locally:

```bash
# Build the site
npm run build

# Preview the production build
npm run preview
```

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Create production build
npm run build
```

## Next Steps

1. ✅ Repository created and pushed
2. ✅ GitHub Pages enabled
3. ✅ First deployment successful
4. 🎝 Customize your content
5. 📊 Add analytics (optional)
6. 🔗 Share your website!

## Support

If you encounter issues:

- Check GitHub Actions logs
- Review [Astro deployment docs](https://docs.astro.build/en/guides/deploy/github-pages/)
- Visit [GitHub Pages documentation](https://docs.github.com/en/pages)
