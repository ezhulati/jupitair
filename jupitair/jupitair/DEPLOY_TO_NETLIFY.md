# Deploy Jupitair HVAC to Netlify

## ✅ Build Status: SUCCESS
- **Total Pages Generated**: 90 pages
- **Build Time**: 709ms
- **Output Directory**: `dist/`

## 🚀 Quick Deploy Instructions

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Login to Netlify**:
```bash
netlify login
```

2. **Create new site and deploy**:
```bash
netlify init
# Choose "Create & configure a new project"
# Site name: jupitair-hvac
# Team: Your team
```

3. **Deploy to production**:
```bash
netlify deploy --prod --dir=dist
```

Your site will be live at: `https://jupitair-hvac.netlify.app`

### Option 2: Drag & Drop Deploy

1. Visit https://app.netlify.com/drop
2. Drag the `dist` folder to the browser
3. Your site will be instantly deployed!

### Option 3: GitHub Integration

1. Push this repository to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Jupitair HVAC site"
git remote add origin https://github.com/ezhulati/jupitair.git
git push -u origin main
```

2. In Netlify Dashboard:
   - Click "Import from Git"
   - Choose GitHub
   - Select the `jupitair` repository
   - Build settings will auto-detect from `netlify.toml`

## 📁 What Gets Deployed

### Pages (90 total)
- **Homepage**: `/`
- **City Pages** (8): `/frisco`, `/plano`, `/mckinney`, `/allen`, `/prosper`, `/the-colony`, `/little-elm`, `/addison`
- **Service Pages** (9): `/services/ac-repair`, `/services/heating-repair`, etc.
- **City+Service Pages** (72): All combinations like `/frisco/ac-repair`, `/plano/heating-repair`, etc.

### Assets
- Optimized CSS and JavaScript
- Sitemap (`sitemap-index.xml`)
- Robots.txt
- All static assets

## 🔧 Configuration

The `netlify.toml` file includes:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20
- Security headers
- Caching rules
- Redirects for common URLs
- Lighthouse CI plugin

## 🌐 Custom Domain Setup

After deployment:
1. Go to Site Settings → Domain Management
2. Add custom domain: `jupitairhvac.com`
3. Configure DNS:
   - A Record: Point to Netlify's load balancer
   - CNAME: www → jupitair-hvac.netlify.app

## 📊 Post-Deployment Checklist

- [ ] Verify all 90 pages load correctly
- [ ] Test forms and CTAs
- [ ] Check mobile responsiveness
- [ ] Verify sitemap at `/sitemap-index.xml`
- [ ] Test 404 page handling
- [ ] Check security headers in DevTools
- [ ] Run Lighthouse audit
- [ ] Set up Google Analytics
- [ ] Configure environment variables in Netlify dashboard

## 🔑 Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
GTM_ID=GTM-XXXXXXX
GA4_ID=G-XXXXXXXXXX
BUSINESS_PHONE=(214) 555-HVAC
BUSINESS_EMAIL=contact@jupitairhvac.com
GOOGLE_MAPS_API_KEY=your-key
RECAPTCHA_SITE_KEY=your-key
```

## 📈 Performance Metrics

Expected scores after deployment:
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

## 🆘 Troubleshooting

If deployment fails:
1. Check build logs in Netlify dashboard
2. Verify Node version matches (v20)
3. Ensure all dependencies are in package.json
4. Check for environment variable issues

## 🎉 Success!

Once deployed, your site will be:
- Globally distributed via Netlify CDN
- Automatically SSL-secured
- Optimized for performance
- Ready for North Texas HVAC market domination!

---

**Build Date**: 2024-08-17
**Total Files**: 90 HTML pages + assets
**Framework**: Astro 4.16.18
**Ready for Production**: YES