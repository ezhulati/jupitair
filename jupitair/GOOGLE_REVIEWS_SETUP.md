# Google Reviews Integration Setup

Complete guide for setting up automated Google reviews collection for Jupitair HVAC.

## 🚀 Quick Setup

### 1. Google Business Information ✅
- **Place ID**: `ChIJAazsg-twakURAJ2zXUWzH-4`
- **Facebook Page ID**: `100092531284875`
- **Business Phone**: `(940) 390-5676`

### 2. Direct Review Links ✅
- **Write Review**: https://search.google.com/local/writereview?placeid=ChIJAazsg-twakURAJ2zXUWzH-4
- **View Reviews**: https://search.google.com/local/reviews?placeid=ChIJAazsg-twakURAJ2zXUWzH-4
- **Google Maps**: https://www.google.com/maps?place_id=ChIJAazsg-twakURAJ2zXUWzH-4

## 📋 Production Setup

### Step 1: Get Google Places API Key

1. **Go to Google Cloud Console**:
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Create or select a project**:
   - Project name: "Jupitair HVAC Website"
   - Enable billing (required for Places API)

3. **Enable required APIs**:
   ```bash
   # Enable Places API
   https://console.cloud.google.com/apis/library/places-backend.googleapis.com
   
   # Enable Maps JavaScript API (optional, for maps)
   https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
   ```

4. **Create API Key**:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the API key
   - **Restrict the key** (recommended):
     - Application restrictions: HTTP referrers
     - Add your domains: `jupitairhvac.com/*`, `*.jupitairhvac.com/*`
     - API restrictions: Google Places API

### Step 2: Configure Environment Variables

```bash
# Copy the template
cp .env.example .env

# Edit .env and add:
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
GOOGLE_BUSINESS_ID=ChIJAazsg-twakURAJ2zXUWzH-4
```

### Step 3: Test the Integration

```bash
# Test manual reviews fetch
npm run fetch-reviews

# Expected output:
# "Reviews data updated successfully"
# Check src/data/reviews.json for new reviews
```

### Step 4: Set Up Automated Collection

```bash
# Set up daily sync at 6 AM
crontab -e

# Add this line:
0 6 * * * cd /path/to/jupitair && npm run fetch-reviews
```

## 🔧 Advanced Configuration

### Rate Limiting
- **Google Places API**: 1,000 requests/day (free tier)
- **Requests per review fetch**: 1 request
- **Recommended frequency**: Daily (well within limits)

### Review Data Structure
```json
{
  "lastUpdated": "2024-08-17T12:00:00Z",
  "averageRating": 4.9,
  "totalReviews": 127,
  "reviews": [
    {
      "id": "google-1692276000",
      "author": "John D.",
      "rating": 5,
      "date": "2024-08-15",
      "text": "Excellent service! Same-day AC repair...",
      "service": "AC Repair",
      "city": "Frisco",
      "verified": true,
      "source": "google"
    }
  ]
}
```

### Error Handling
The script handles:
- ✅ API key missing (falls back to existing data)
- ✅ API quota exceeded (logs error, continues)
- ✅ Network timeouts (retries once)
- ✅ Invalid responses (validates data structure)
- ✅ Duplicate reviews (prevents re-adding)

## 📊 Monitoring & Analytics

### Tracking Review Collection
```bash
# View logs
tail -f logs/google-reviews.log

# Check review count
node -e "console.log(require('./src/data/reviews.json').totalReviews)"

# Verify API usage (Google Cloud Console)
https://console.cloud.google.com/apis/api/places-backend.googleapis.com/quotas
```

### Key Metrics to Monitor
- **Total Reviews**: Should grow over time
- **Average Rating**: Track changes
- **Review Velocity**: New reviews per month
- **API Usage**: Stay within quotas
- **Error Rate**: Should be near 0%

## 🎯 Conversion Optimization

### Review Display Strategy
- ✅ **Homepage**: Latest 3 reviews (mixed sources)
- ✅ **Service Pages**: Relevant service reviews
- ✅ **City Pages**: Location-specific reviews
- ✅ **Contact Page**: High-rated testimonials

### Review Collection Tactics
- ✅ **Direct Links**: Easy one-click review submission
- ✅ **Email Follow-ups**: Post-service review requests
- ✅ **QR Codes**: On service trucks and invoices
- ✅ **Social Proof**: Display review count prominently

## 🔒 Security & Compliance

### API Key Security
- ✅ **Environment Variables**: Never commit keys to git
- ✅ **Referrer Restrictions**: Limit to your domains
- ✅ **API Restrictions**: Only enable needed APIs
- ✅ **Regular Rotation**: Update keys quarterly

### Review Data Privacy
- ✅ **Public Data Only**: Reviews are already public
- ✅ **No PII Storage**: Only display names and content
- ✅ **GDPR Compliance**: Right to removal supported
- ✅ **Local Storage**: Reviews stored in JSON files

## 📱 Mobile Optimization

### Review Display
- **Cards**: Stack vertically on mobile
- **Pagination**: Show 3 reviews, load more button
- **Touch-friendly**: Large tap targets for review links
- **Fast Loading**: Lazy load review images

### Review Collection
- **QR Codes**: Easy mobile scanning
- **SMS Links**: Direct review URLs via text
- **Mobile-First**: Review forms optimized for mobile
- **Social Sharing**: One-tap sharing of positive reviews

## 🚨 Troubleshooting

### Common Issues

**No reviews fetched**:
```bash
# Check API key
curl "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJAazsg-twakURAJ2zXUWzH-4&fields=reviews&key=YOUR_API_KEY"

# Check quotas
echo "Check: https://console.cloud.google.com/apis/api/places-backend.googleapis.com/quotas"
```

**API quota exceeded**:
```bash
# Upgrade to paid plan or reduce frequency
# Current: 1 request/day = 365 requests/year (well within free tier)
```

**Old reviews not updating**:
```bash
# Clear cache and refetch
rm src/data/reviews.json
npm run fetch-reviews
```

**Build errors**:
```bash
# Check imports
grep -r "reviews.json" src/
# Ensure file exists and has valid JSON
```

## 📞 Support

### Google APIs Support
- **Documentation**: https://developers.google.com/maps/documentation/places
- **Support**: https://developers.google.com/maps/support
- **Community**: https://stackoverflow.com/questions/tagged/google-places-api

### Jupitair Integration Support
- **Check logs**: `logs/google-reviews.log`
- **Test manually**: `npm run fetch-reviews`
- **Validate JSON**: `jsonlint src/data/reviews.json`

---

**Last Updated**: August 17, 2024  
**Place ID**: ChIJAazsg-twakURAJ2zXUWzH-4  
**Status**: Production Ready ✅