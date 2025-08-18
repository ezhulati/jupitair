# Zoho Calendar Integration Setup

This guide explains how to set up Zoho Calendar integration for automatic appointment booking when customers submit service requests.

## Overview

When a customer submits a service request through the contact form, the system will:
1. Send notification emails to both customer and business
2. Create a calendar event in your Zoho Calendar
3. Send calendar invites to the customer
4. Set up automatic reminders (24 hours and 1 hour before appointment)

## Prerequisites

1. A Zoho account with Calendar access
2. Zoho Developer Console access to create OAuth apps

## Step 1: Create Zoho OAuth Application

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Add Client" and select "Server-based Applications"
3. Fill in the application details:
   - **Client Name**: Jupitair HVAC Calendar Integration
   - **Homepage URL**: https://jupitairhvac.com
   - **Authorized Redirect URIs**: https://jupitairhvac.com/oauth/callback
4. Note down the **Client ID** and **Client Secret**

## Step 2: Generate Refresh Token

### 🚀 Easy Method: Use the Setup Helper

Visit your setup helper page: **`/oauth/setup`** (e.g., `http://localhost:4321/oauth/setup` or `https://jupitairhvac.com/oauth/setup`)

This interactive helper will:
- Generate the authorization URL for you
- Handle the OAuth callback automatically  
- Show you the exact curl command to run
- Guide you through each step

### Manual Method (Alternative)

1. **Authorization URL**: Navigate to this URL in your browser (replace YOUR_CLIENT_ID):
   ```
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCalendar.calendar.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=https://jupitairhvac.com/oauth/callback
   ```

2. **Authorize the app**: You'll be redirected to Zoho login. After logging in, authorize the application.

3. **Get the code**: After authorization, you'll be redirected to your callback page at `/oauth/callback` which will display the authorization code.

4. **Exchange code for tokens**: Make a POST request to:
   ```
   POST https://accounts.zoho.com/oauth/v2/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=authorization_code&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=https://jupitairhvac.com/oauth/callback&code=YOUR_AUTHORIZATION_CODE
   ```

5. **Save the refresh token**: From the response, save the `refresh_token` value.

### Method 2: Using cURL

```bash
# Step 1: Get authorization code by visiting the URL in browser
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=https://jupitairhvac.com/oauth/callback&code=YOUR_AUTHORIZATION_CODE"
```

## Step 3: Configure Environment Variables

Add these variables to your `.env` file:

```bash
# Zoho Calendar API Configuration
ZOHO_CLIENT_ID=your_actual_client_id
ZOHO_CLIENT_SECRET=your_actual_client_secret  
ZOHO_REFRESH_TOKEN=your_actual_refresh_token
```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Submit a test service request through the contact form

3. Check your Zoho Calendar - a new appointment should appear

4. Check the console logs for any errors

## Scopes Required

The integration requires the following Zoho Calendar scope:
- `ZohoCalendar.calendar.ALL` - Full access to calendar events

## Features Included

### Automatic Event Creation
- **Event Title**: "HVAC Service: [Customer Name]"
- **Description**: Includes service type, property details, customer contact info
- **Location**: Customer's service address
- **Duration**: 2 hours by default
- **Attendees**: Customer is automatically invited
- **Reminders**: Email reminders sent 24 hours and 1 hour before appointment

### Time Slot Handling
The system parses customer's preferred time slots:
- "8:00 AM - 10:00 AM" → Event starts at 8:00 AM
- "10:00 AM - 12:00 PM" → Event starts at 10:00 AM  
- "anytime" → Event starts at 8:00 AM (default)

### Emergency Requests
Emergency service requests are clearly marked in the calendar event description with "⚠️ EMERGENCY SERVICE REQUEST"

## Troubleshooting

### Common Issues

1. **401 Unauthorized Error**
   - Check that your Client ID, Client Secret, and Refresh Token are correct
   - Ensure the refresh token hasn't expired (they last 1 year)

2. **403 Forbidden Error**
   - Verify that your OAuth app has the correct scopes
   - Check that the Zoho account has Calendar access

3. **Calendar events not appearing**
   - Check console logs for API errors
   - Verify the time zone is set correctly (America/Chicago)
   - Ensure the calendar isn't filtering out events

### Debug Mode

To enable debug logging, check the browser console and server logs after form submission. Look for:
- "Zoho Calendar event created successfully"
- Any error messages from the Zoho API

## Security Notes

1. **Never commit credentials**: Keep your .env file out of version control
2. **Use environment variables**: All Zoho credentials should be server-side only
3. **Refresh token security**: Treat refresh tokens like passwords
4. **Rate limiting**: Zoho APIs have rate limits - the integration handles retries

## Optional: Availability Checking

The integration includes a method to check calendar availability before booking:

```javascript
const isAvailable = await zohoCalendar.checkAvailability(
  startDateTime, 
  endDateTime
);
```

This can be used to implement real-time availability checking in the future.

## Support

If you encounter issues:
1. Check the Zoho API Console for your application status
2. Review the server logs for detailed error messages  
3. Ensure your Zoho account has Calendar permissions
4. Verify all environment variables are set correctly

## API Documentation

- [Zoho Calendar API](https://www.zoho.com/calendar/help/api/)
- [Zoho OAuth 2.0](https://www.zoho.com/accounts/protocol/oauth.html)