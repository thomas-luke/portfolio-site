---
title: "Deployment"
date: "2025-05-30"
tags: ["deployment", "github-pages", "technical"]
---

# Deployment

This [[about:::portfolio website]] is designed to deploy easily to GitHub Pages.

## Prerequisites

Before deploying, ensure you have:
- ✅ Node.js installed (v18+)
- ✅ Git repository initialized
- ✅ GitHub repository created
- ✅ All markdown files in `public/notes/`

## Deployment Steps

### 1. Initial Setup

```bash
# Install dependencies (one time)
npm install

# Test locally
npm run dev
```

### 2. GitHub Repository

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

### 3. Enable GitHub Pages

1. Go to repository **Settings**
2. Navigate to **Pages** section
3. Set **Source** to "GitHub Actions"
4. The [[github-workflow:::GitHub Actions workflow]] will handle the rest

### 4. Automatic Deployment

Every push to `main` branch will:
- ✅ Install dependencies
- ✅ Build the static site
- ✅ Deploy to GitHub Pages
- ✅ Update your live site

## Configuration

The [[technical-details:::Next.js configuration]] includes:

```javascript
// next.config.js
module.exports = {
  output: 'export',        // Static site generation
  trailingSlash: true,     // GitHub Pages compatibility
  images: { unoptimized: true } // Static images
}
```

## Custom Domain (Optional)

To use a custom domain:

1. Add `CNAME` file to `public/` directory
2. Configure DNS settings with your provider
3. Update repository settings

## Build Process

The build process:
1. **Parses** all markdown files
2. **Generates** static HTML pages
3. **Processes** wiki-style links
4. **Builds** the complete site to `/out` directory

## Troubleshooting

**Build failing?**
- Check that all [[wiki-links:::wiki-style links]] reference existing notes
- Ensure markdown frontmatter is valid YAML
- Verify no broken dependencies

**Links not working?**
- Confirm note files exist in `public/notes/`
- Check file naming conventions (lowercase, hyphens)
- Validate link syntax: `[[note-id]]` or `[[note-id:::Display Text]]`

See: [[technical-details:::Technical implementation]] | [[what-im-working-on:::Current progress]]
