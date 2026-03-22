# Deploy to GitHub Pages Guide

This guide will help you deploy your personal website to GitHub Pages using a **GitHub User Site**.

## Prerequisites

- GitHub account (username: `ariwijaya-dev`)
- Git installed on your machine
- Node.js 22+ installed

## Deployment Steps

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. **Repository name must be exactly:** `ariwijaya-dev.github.io` (for user sites)
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
git remote add origin https://github.com/ariwijaya-dev/ariwijaya-dev.github.io.git

# Push to GitHub
git push -u origin master
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/ariwijaya-dev/ariwijaya-dev.github.io
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**, select **GitHub Actions** (NOT "Deploy from a branch")
5. The workflow will automatically run on the next push

### 4. Trigger Deployment

The deployment workflow will automatically run when you push to the `master` branch.
If you just pushed your code, check the **Actions** tab to see the deployment progress.

### 5. Access Your Website

Once the deployment is complete (usually takes 1-2 minutes), your website will be available at:

**https://ariwijaya-dev.github.io/**

Note: User sites are served from the root URL (no `/personal-website` path needed)

## Configuration Files

### `astro.config.mjs`
```javascript
export default defineConfig({
  site: 'https://ariwijaya-dev.github.io',
  base: '/', // User sites use root path
  // ... rest of config
});
```

### `.github/workflows/deploy.yml`
- Automated deployment workflow
- Triggers on push to `master` branch
- Builds with Node.js 22
- Deploys to GitHub Pages

## GitHub User Site vs Project Site

### User Site (Current Configuration)
- **Repository name:** `username.github.io`
- **URL:** `https://username.github.io/`
- **Base path:** `/`
- **Best for:** Personal portfolio, blog, main website

### Project Site
- **Repository name:** Any name
- **URL:** `https://username.github.io/repo-name/`
- **Base path:** `/repo-name`
- **Best for:** Specific projects, demos

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

If you want to use a custom domain (e.g., `ariwijaya.com`):

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. In your repository, go to **Settings** → **Pages**
3. Under **Custom domain**, enter your domain
4. Add DNS records at your domain registrar:

```
# For root domain (ariwijaya.com)
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

# For www subdomain
Type: CNAME
Name: www
Value: ariwijaya-dev.github.io
```

5. Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://ariwijaya.com', // Your custom domain
  base: '/', // Still use root path
  // ... rest of config
});
```

6. Wait for DNS propagation (can take 24-48 hours, usually faster)

## Troubleshooting

### Deployment Failed

1. Check the **Actions** tab for error logs
2. Ensure `package.json` has the `build` script
3. Verify Node.js version is 22+
4. Check that all dependencies are in `package.json`

### 404 Not Found

1. Wait a few minutes after deployment (can take up to 10 minutes)
2. Check the URL is correct: `https://ariwijaya-dev.github.io/`
3. Ensure GitHub Pages is enabled in Settings
4. Verify the workflow completed successfully in Actions tab

### Styles Not Loading

1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check the base path in `astro.config.mjs` is `/`
3. Verify files are building correctly locally with `npm run build`
4. Check browser console for errors

### Images Not Showing

1. Ensure image paths are correct
2. Check that images are in the `public/` folder
3. Verify image references don't include `public/` in the path

## Local Testing

Before pushing to GitHub, test your build locally:

```bash
# Build the site
npm run build

# Preview the production build
npm run preview

# Visit http://localhost:4321
```

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build (localhost:4321)
npm run preview

# Check for outdated dependencies
npm outdated

# Update dependencies
npm update
```

## Environment Variables (Optional)

If you need to use environment variables:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add your secrets
4. Access them in your code using `import.meta.env.SECRET_NAME`

## Performance Tips

1. **Optimize Images:** Use WebP format, compress images
2. **Lazy Load:** Consider lazy loading images below the fold
3. **Minify:** Astro automatically minifies HTML, CSS, and JS
4. **CDN:** GitHub Pages has built-in CDN

## Analytics (Optional)

### Add Google Analytics

1. Create a Google Analytics account
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to `src/layouts/BaseLayout.astro`:

```astro
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script define:vars={{ GA_ID: 'G-XXXXXXXXXX' }}>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_ID);
</script>
```

## Security Best Practices

1. **Keep dependencies updated:** `npm audit fix`
2. **Don't commit sensitive data:** Use environment variables
3. **Enable branch protection:** Protect `master` branch
4. **Review workflow permissions:** Only grant necessary permissions

## Next Steps

1. ✅ Repository created and pushed
2. ✅ GitHub Pages enabled
3. ✅ First deployment successful
4. 🎝 Customize your content
5. 📊 Add analytics (optional)
6. 🔗 Set up custom domain (optional)
7. 📧 Add contact form (optional)
8. 📝 Add blog section (optional)

## Support Resources

- [Astro Documentation](https://docs.astro.build/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Web.dev Performance Guide](https://web.dev/)

## Quick Reference

**Repository URL:** https://github.com/ariwijaya-dev/ariwijaya-dev.github.io
**Website URL:** https://ariwijaya-dev.github.io/
**Settings:** https://github.com/ariwijaya-dev/ariwijaya-dev.github.io/settings/pages
**Actions:** https://github.com/ariwijaya-dev/ariwijaya-dev.github.io/actions
