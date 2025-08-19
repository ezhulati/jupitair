import type { APIRoute } from 'astro';
import { ZohoCalendarAPI } from '../../lib/zoho-calendar.js';

export const prerender = false;

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  service: string;
  address: string;
  city: string;
  notes?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: BookingRequest = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'date', 'timeSlot', 'service', 'address', 'city'];
    for (const field of requiredFields) {
      if (!data[field as keyof BookingRequest]) {
        return new Response(JSON.stringify({ 
          error: `${field} is required` 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Parse the time slot
    const timeSlotMatch = data.timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!timeSlotMatch) {
      return new Response(JSON.stringify({ 
        error: 'Invalid time slot format' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate start and end times
    let startHour = parseInt(timeSlotMatch[1]);
    const startMinutes = parseInt(timeSlotMatch[2]);
    const isPM = timeSlotMatch[3] === 'PM';
    
    if (isPM && startHour !== 12) {
      startHour += 12;
    } else if (!isPM && startHour === 12) {
      startHour = 0;
    }

    const startDateTime = new Date(data.date);
    startDateTime.setHours(startHour, startMinutes, 0, 0);
    
    // Default duration is 2 hours
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 2);

    // Check if Zoho Calendar is configured
    const zohoClientId = import.meta.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = import.meta.env.ZOHO_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = import.meta.env.ZOHO_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN;

    let calendarEventId = null;
    let calendarError = null;

    if (zohoClientId && zohoClientSecret && zohoRefreshToken) {
      try {
        const zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
        
        // First check availability one more time
        const isAvailable = await zohoCalendar.checkAvailability(
          startDateTime.toISOString(),
          endDateTime.toISOString()
        );

        if (!isAvailable) {
          return new Response(JSON.stringify({ 
            error: 'This time slot is no longer available. Please select another time.' 
          }), { 
            status: 409,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Create the calendar event
        const eventData = {
          title: `${data.service} - ${data.name}`,
          description: `
Service: ${data.service}
Customer: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}, ${data.city}
${data.notes ? `Notes: ${data.notes}` : ''}
          `.trim(),
          location: `${data.address}, ${data.city}, TX`,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          attendeeEmail: data.email,
          attendeeName: data.name,
          timeZone: 'America/Chicago'
        };

        const calendarResult = await zohoCalendar.createCalendarEvent(eventData);
        calendarEventId = calendarResult.id || calendarResult.eventId;
      } catch (error) {
        console.error('Error creating calendar event:', error);
        calendarError = error instanceof Error ? error.message : 'Unknown calendar error';
        // Continue with booking even if calendar fails
      }
    }

    // Here you would typically also:
    // 1. Save booking to database
    // 2. Send confirmation email to customer
    // 3. Send notification to business

    const response = {
      success: true,
      message: 'Booking confirmed',
      booking: {
        confirmationNumber: `JH${Date.now().toString(36).toUpperCase()}`,
        name: data.name,
        date: data.date,
        time: data.timeSlot,
        service: data.service,
        address: `${data.address}, ${data.city}`,
        calendarEventId: calendarEventId,
        calendarIntegration: calendarEventId ? 'success' : calendarError ? 'failed' : 'not_configured'
      }
    };

    if (calendarError) {
      response.booking.calendarIntegration = `Note: Calendar event creation failed (${calendarError}), but your booking is confirmed.`;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Booking error:', error);
    
    return new Response(JSON.stringify({
      error: 'An error occurred while processing your booking. Please try again or call us at (940) 390-5676.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};