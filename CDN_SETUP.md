# Mulberry Symbols CDN Setup

## Overview

This guide explains how to set up a CDN for the Mulberry symbols used in the AAC application.

## Current Implementation

The app is now configured to load symbols from: `https://pardeepdhingra.github.io/mulberry-symbols-cdn/`

## Setup Steps

### 1. Create GitHub Pages Repository

1. Go to [GitHub](https://github.com) and create a new repository named `mulberry-symbols-cdn`
2. Make it public
3. Clone it to your local machine

### 2. Upload SVG Files

```bash
# Clone the repository
git clone https://github.com/pardeepdhingra/mulberry-symbols-cdn.git
cd mulberry-symbols-cdn

# Copy all SVG files from the AAC project
cp -r ../AAC/assets/EN-symbols/* .

# Add and commit files
git add .
git commit -m "Add Mulberry symbols for AAC application"

# Push to GitHub
git push origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"

### 4. Wait for Deployment

GitHub Pages will take a few minutes to deploy your site. You can check the status in the "Pages" section.

### 5. Test the CDN

Once deployed, you can test by visiting:

- `https://pardeepdhingra.github.io/mulberry-symbols-cdn/hello.svg`
- `https://pardeepdhingra.github.io/mulberry-symbols-cdn/apple.svg`

## Symbol Mapping

The app uses the following mapping for symbols:

### Greetings

- `hello` → `hello.svg`
- `goodbye` → `goodbye.svg`
- `thank-you` → `thank_you.svg`
- `please` → `please.svg`
- `happy-birthday` → `happy_birthday.svg`
- `i-love-you` → `i_love_you.svg`

### Food & Drink

- `food` → `food.svg`
- `hungry` → `hungry.svg`
- `water` → `water.svg`
- `milk` → `milk.svg`
- `apple` → `apple.svg`
- `banana` → `banana.svg`
- And many more...

## Fallback System

If a symbol fails to load from the CDN, the app will:

1. Show a loading indicator (⏳)
2. Try to load the SVG from the CDN
3. If that fails, show a colorful emoji fallback
4. If no emoji is available, show the text label

## Benefits of CDN Approach

- ✅ **Lightweight**: App bundle is much smaller
- ✅ **Scalable**: Easy to add new symbols
- ✅ **Fast**: CDN provides fast loading
- ✅ **Reliable**: Multiple fallback options
- ✅ **Maintainable**: Symbols can be updated independently

## Troubleshooting

### If symbols don't load:

1. Check if GitHub Pages is enabled and deployed
2. Verify the URL format: `https://pardeepdhingra.github.io/mulberry-symbols-cdn/[filename].svg`
3. Check if the SVG files are in the repository
4. Ensure the repository is public

### If you want to use a different CDN:

1. Update the `CDN_BASE_URL` in `src/utils/symbolMapping.ts`
2. Update the URL in `src/components/SvgSymbol.tsx`

## Alternative CDN Options

- **GitHub Pages** (current): Free, reliable, good for static files
- **Netlify**: Free tier, automatic deployments
- **Vercel**: Free tier, fast global CDN
- **AWS S3 + CloudFront**: Paid, enterprise-grade
- **Cloudflare Pages**: Free, fast, good caching
