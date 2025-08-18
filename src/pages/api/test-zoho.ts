import type { APIRoute } from 'astro';
import { ZohoCalendarAPI } from '../../lib/zoho-calendar.js';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Check if Zoho Calendar is configured
    const zohoClientId = import.meta.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = import.meta.env.ZOHO_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = import.meta.env.ZOHO_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN;

    const status = {
      configured: false,
      hasClientId: !!zohoClientId,
      hasClientSecret: !!zohoClientSecret,
      hasRefreshToken: !!zohoRefreshToken,
      calendars: null,
      testAvailability: null,
      error: null
    };

    if (!zohoClientId || !zohoClientSecret || !zohoRefreshToken) {
      status.error = 'Missing Zoho Calendar credentials. Please set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN environment variables.';
      
      return new Response(JSON.stringify(status), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    status.configured = true;

    try {
      const zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
      
      // Test 1: List calendars
      try {
        const calendars = await zohoCalendar.listCalendars();
        status.calendars = calendars;
      } catch (error) {
        status.calendars = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }

      // Test 2: Check availability for tomorrow at 10 AM
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        
        const endTime = new Date(tomorrow);
        endTime.setHours(12, 0, 0, 0);

        const isAvailable = await zohoCalendar.checkAvailability(
          tomorrow.toISOString(),
          endTime.toISOString()
        );

        status.testAvailability = {
          date: tomorrow.toISOString(),
          endDate: endTime.toISOString(),
          available: isAvailable
        };
      } catch (error) {
        status.testAvailability = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }

    } catch (error) {
      status.error = error instanceof Error ? error.message : 'Unknown error occurred';
    }

    return new Response(JSON.stringify(status, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Test Zoho error:', error);
    
    return new Response(JSON.stringify({
      error: 'An error occurred while testing Zoho integration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};