import axios from 'axios';

class ZohoCalendarAPI {
  clientId;
  clientSecret;
  refreshToken;
  accessToken = null;
  baseUrl = "https://calendar.zoho.com/api/v1";
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
  }
  async getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }
    try {
      const response = await axios.post("https://accounts.zoho.com/oauth/v2/token", null, {
        params: {
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "refresh_token"
        }
      });
      const data = response.data;
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error("Error refreshing Zoho access token:", error);
      throw new Error("Failed to refresh Zoho access token");
    }
  }
  async createCalendarEvent(eventData) {
    try {
      const accessToken = await this.getAccessToken();
      const startDate = new Date(eventData.startDateTime);
      const endDate = new Date(eventData.endDateTime);
      const eventPayload = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        dateandtime: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          timezone: eventData.timeZone || "America/Chicago"
        },
        attendees: [
          {
            email: eventData.attendeeEmail,
            name: eventData.attendeeName,
            status: "needs-action"
          }
        ],
        reminders: [
          {
            action: "email",
            trigger: "1440"
            // 24 hours before
          },
          {
            action: "email",
            trigger: "60"
            // 1 hour before
          }
        ]
      };
      const response = await axios.post(
        `${this.baseUrl}/calendars/primary/events`,
        eventPayload,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Zoho calendar event:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.accessToken = null;
        try {
          const accessToken = await this.getAccessToken();
          const eventPayload = {
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            dateandtime: {
              start: new Date(eventData.startDateTime).toISOString(),
              end: new Date(eventData.endDateTime).toISOString(),
              timezone: eventData.timeZone || "America/Chicago"
            },
            attendees: [
              {
                email: eventData.attendeeEmail,
                name: eventData.attendeeName,
                status: "needs-action"
              }
            ],
            reminders: [
              {
                action: "email",
                trigger: "1440"
                // 24 hours before
              },
              {
                action: "email",
                trigger: "60"
                // 1 hour before
              }
            ]
          };
          const retryResponse = await axios.post(
            `${this.baseUrl}/calendars/primary/events`,
            eventPayload,
            {
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
              }
            }
          );
          return retryResponse.data;
        } catch (retryError) {
          console.error("Error creating Zoho calendar event on retry:", retryError);
          throw new Error("Failed to create calendar event after token refresh");
        }
      }
      throw new Error("Failed to create Zoho calendar event");
    }
  }
  async listCalendars() {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(`${this.baseUrl}/calendars`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error listing Zoho calendars:", error);
      throw new Error("Failed to list calendars");
    }
  }
  async checkAvailability(startDateTime, endDateTime) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseUrl}/calendars/primary/events`,
        {
          params: {
            timeMin: new Date(startDateTime).toISOString(),
            timeMax: new Date(endDateTime).toISOString(),
            orderBy: "startTime",
            singleEvents: true
          },
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      const events = response.data.events || [];
      const requestStart = new Date(startDateTime).getTime();
      const requestEnd = new Date(endDateTime).getTime();
      for (const event of events) {
        if (!event.start || !event.end) continue;
        const eventStart = new Date(event.start.dateTime || event.start.date).getTime();
        const eventEnd = new Date(event.end.dateTime || event.end.date).getTime();
        if (eventStart < requestEnd && eventEnd > requestStart) {
          console.log(`Conflict found with event: ${event.summary} (${event.start.dateTime} - ${event.end.dateTime})`);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error checking availability:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.accessToken = null;
        try {
          const accessToken = await this.getAccessToken();
          const retryResponse = await axios.get(
            `${this.baseUrl}/calendars/primary/events`,
            {
              params: {
                timeMin: new Date(startDateTime).toISOString(),
                timeMax: new Date(endDateTime).toISOString(),
                orderBy: "startTime",
                singleEvents: true
              },
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
              }
            }
          );
          const events = retryResponse.data.events || [];
          const requestStart = new Date(startDateTime).getTime();
          const requestEnd = new Date(endDateTime).getTime();
          for (const event of events) {
            if (!event.start || !event.end) continue;
            const eventStart = new Date(event.start.dateTime || event.start.date).getTime();
            const eventEnd = new Date(event.end.dateTime || event.end.date).getTime();
            if (eventStart < requestEnd && eventEnd > requestStart) {
              return false;
            }
          }
          return true;
        } catch (retryError) {
          console.error("Error checking availability on retry:", retryError);
          return true;
        }
      }
      return true;
    }
  }
}

export { ZohoCalendarAPI as Z };
