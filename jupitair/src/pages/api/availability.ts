import type { APIRoute } from 'astro';
import { ZohoCalendarAPI } from '../../lib/zoho-calendar.js';

export const prerender = false;

interface TimeSlot {
  value: string;
  label: string;
  startHour: number;
  endHour: number;
}

const TIME_SLOTS: TimeSlot[] = [
  { value: "8:00 AM - 10:00 AM", label: "8:00 AM - 10:00 AM", startHour: 8, endHour: 10 },
  { value: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM", startHour: 10, endHour: 12 },
  { value: "12:00 PM - 2:00 PM", label: "12:00 PM - 2:00 PM", startHour: 12, endHour: 14 },
  { value: "2:00 PM - 4:00 PM", label: "2:00 PM - 4:00 PM", startHour: 14, endHour: 16 },
  { value: "4:00 PM - 6:00 PM", label: "4:00 PM - 6:00 PM", startHour: 16, endHour: 18 }
];

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const serviceType = url.searchParams.get('service');
    
    if (!date) {
      return new Response(JSON.stringify({ 
        error: 'Date parameter is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if Zoho Calendar is configured
    const zohoClientId = import.meta.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = import.meta.env.ZOHO_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = import.meta.env.ZOHO_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN;

    if (!zohoClientId || !zohoClientSecret || !zohoRefreshToken) {
      // If Zoho Calendar isn't configured, return all slots as available
      return new Response(JSON.stringify({
        date,
        availableSlots: TIME_SLOTS,
        note: 'Calendar integration not configured - all slots shown'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
    const selectedDate = new Date(date);
    
    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return new Response(JSON.stringify({
        date,
        availableSlots: [],
        message: 'Cannot book appointments in the past'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if it's a weekend (assuming business operates Mon-Sat)
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) { // Sunday
      return new Response(JSON.stringify({
        date,
        availableSlots: [],
        message: 'Emergency service only on Sundays - please call (940) 390-5676'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Adjust available hours for Saturday (8 AM - 4 PM)
    let availableSlots = [...TIME_SLOTS];
    if (dayOfWeek === 6) { // Saturday
      availableSlots = availableSlots.filter(slot => slot.endHour <= 16);
    }

    // Check availability for each time slot
    const availableChecks = await Promise.all(
      availableSlots.map(async (slot) => {
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(slot.startHour, 0, 0, 0);
        
        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(slot.endHour, 0, 0, 0);

        try {
          const isAvailable = await zohoCalendar.checkAvailability(
            startDateTime.toISOString(),
            endDateTime.toISOString()
          );
          
          return {
            ...slot,
            available: isAvailable
          };
        } catch (error) {
          console.error(`Error checking availability for ${slot.label}:`, error);
          // Default to available if check fails
          return {
            ...slot,
            available: true
          };
        }
      })
    );

    // Filter to only available slots
    const finalAvailableSlots = availableChecks.filter(slot => slot.available);

    // Add buffer time logic for emergency services
    if (serviceType === 'emergency') {
      const now = new Date();
      const isToday = selectedDate.getTime() === now.getTime();
      
      if (isToday) {
        const currentHour = now.getHours();
        // For emergency services, need at least 1 hour notice
        const emergencySlots = finalAvailableSlots.filter(slot => 
          slot.startHour >= currentHour + 1
        );
        
        return new Response(JSON.stringify({
          date,
          availableSlots: emergencySlots,
          message: emergencySlots.length === 0 ? 
            'For immediate emergency service, please call (940) 390-5676' :
            'Emergency slots available today'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      date,
      serviceType,
      availableSlots: finalAvailableSlots,
      totalSlots: availableSlots.length,
      businessHours: dayOfWeek === 6 ? '8:00 AM - 4:00 PM' : '8:00 AM - 6:00 PM'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Availability check error:', error);
    
    // Return all slots as available if there's an error
    return new Response(JSON.stringify({
      error: 'Unable to check availability',
      availableSlots: TIME_SLOTS,
      note: 'All slots shown due to availability check error'
    }), {
      status: 200, // Return 200 so form still works
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { date, timeSlot, serviceType, duration = 2 } = data;

    if (!date || !timeSlot) {
      return new Response(JSON.stringify({ 
        error: 'Date and time slot are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find the selected time slot
    const selectedSlot = TIME_SLOTS.find(slot => slot.value === timeSlot);
    if (!selectedSlot) {
      return new Response(JSON.stringify({ 
        error: 'Invalid time slot' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const zohoClientId = import.meta.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = import.meta.env.ZOHO_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = import.meta.env.ZOHO_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN;

    if (!zohoClientId || !zohoClientSecret || !zohoRefreshToken) {
      return new Response(JSON.stringify({
        available: true,
        note: 'Calendar integration not configured'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
    const selectedDate = new Date(date);
    
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(selectedSlot.startHour, 0, 0, 0);
    
    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(selectedSlot.startHour + duration, 0, 0, 0);

    const isAvailable = await zohoCalendar.checkAvailability(
      startDateTime.toISOString(),
      endDateTime.toISOString()
    );

    return new Response(JSON.stringify({
      available: isAvailable,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      message: isAvailable ? 
        'Time slot is available' : 
        'Time slot is no longer available. Please select another time.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Availability validation error:', error);
    
    return new Response(JSON.stringify({
      available: true,
      note: 'Unable to verify availability - booking allowed'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};