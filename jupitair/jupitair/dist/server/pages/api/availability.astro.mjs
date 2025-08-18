import { Z as ZohoCalendarAPI } from '../../chunks/zoho-calendar_CzyPEIqo.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const TIME_SLOTS = [
  { value: "8:00 AM - 10:00 AM", label: "8:00 AM - 10:00 AM", startHour: 8, endHour: 10 },
  { value: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM", startHour: 10, endHour: 12 },
  { value: "12:00 PM - 2:00 PM", label: "12:00 PM - 2:00 PM", startHour: 12, endHour: 14 },
  { value: "2:00 PM - 4:00 PM", label: "2:00 PM - 4:00 PM", startHour: 14, endHour: 16 },
  { value: "4:00 PM - 6:00 PM", label: "4:00 PM - 6:00 PM", startHour: 16, endHour: 18 }
];
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const serviceType = url.searchParams.get("service");
    if (!date) {
      return new Response(JSON.stringify({
        error: "Date parameter is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const zohoClientId = undefined                               || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = undefined                                   || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = undefined                                   || process.env.ZOHO_REFRESH_TOKEN;
    if (!zohoClientId || !zohoClientSecret || !zohoRefreshToken) {
      return new Response(JSON.stringify({
        date,
        availableSlots: TIME_SLOTS,
        note: "Calendar integration not configured - all slots shown"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
    const selectedDate = new Date(date);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return new Response(JSON.stringify({
        date,
        availableSlots: [],
        message: "Cannot book appointments in the past"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) {
      return new Response(JSON.stringify({
        date,
        availableSlots: [],
        message: "Emergency service only on Sundays - please call (940) 390-5676"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    let availableSlots = [...TIME_SLOTS];
    if (dayOfWeek === 6) {
      availableSlots = availableSlots.filter((slot) => slot.endHour <= 16);
    }
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
          return {
            ...slot,
            available: true
          };
        }
      })
    );
    const finalAvailableSlots = availableChecks.filter((slot) => slot.available);
    if (serviceType === "emergency") {
      const now = /* @__PURE__ */ new Date();
      const isToday = selectedDate.getTime() === now.getTime();
      if (isToday) {
        const currentHour = now.getHours();
        const emergencySlots = finalAvailableSlots.filter(
          (slot) => slot.startHour >= currentHour + 1
        );
        return new Response(JSON.stringify({
          date,
          availableSlots: emergencySlots,
          message: emergencySlots.length === 0 ? "For immediate emergency service, please call (940) 390-5676" : "Emergency slots available today"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({
      date,
      serviceType,
      availableSlots: finalAvailableSlots,
      totalSlots: availableSlots.length,
      businessHours: dayOfWeek === 6 ? "8:00 AM - 4:00 PM" : "8:00 AM - 6:00 PM"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return new Response(JSON.stringify({
      error: "Unable to check availability",
      availableSlots: TIME_SLOTS,
      note: "All slots shown due to availability check error"
    }), {
      status: 200,
      // Return 200 so form still works
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { date, timeSlot, serviceType, duration = 2 } = data;
    if (!date || !timeSlot) {
      return new Response(JSON.stringify({
        error: "Date and time slot are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const selectedSlot = TIME_SLOTS.find((slot) => slot.value === timeSlot);
    if (!selectedSlot) {
      return new Response(JSON.stringify({
        error: "Invalid time slot"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const zohoClientId = undefined                               || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = undefined                                   || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = undefined                                   || process.env.ZOHO_REFRESH_TOKEN;
    if (!zohoClientId || !zohoClientSecret || !zohoRefreshToken) {
      return new Response(JSON.stringify({
        available: true,
        note: "Calendar integration not configured"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
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
      message: isAvailable ? "Time slot is available" : "Time slot is no longer available. Please select another time."
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Availability validation error:", error);
    return new Response(JSON.stringify({
      available: true,
      note: "Unable to verify availability - booking allowed"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
