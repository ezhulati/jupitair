import { Z as ZohoCalendarAPI } from '../../chunks/zoho-calendar_CzyPEIqo.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  try {
    const zohoClientId = undefined                               || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = undefined                                   || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = undefined                                   || process.env.ZOHO_REFRESH_TOKEN;
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
      status.error = "Missing Zoho Calendar credentials. Please set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN environment variables.";
      return new Response(JSON.stringify(status), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    status.configured = true;
    try {
      const zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
      try {
        const calendars = await zohoCalendar.listCalendars();
        status.calendars = calendars;
      } catch (error) {
        status.calendars = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
      try {
        const tomorrow = /* @__PURE__ */ new Date();
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
        status.testAvailability = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    } catch (error) {
      status.error = error instanceof Error ? error.message : "Unknown error occurred";
    }
    return new Response(JSON.stringify(status, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Test Zoho error:", error);
    return new Response(JSON.stringify({
      error: "An error occurred while testing Zoho integration",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
