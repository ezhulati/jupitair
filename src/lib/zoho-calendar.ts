import axios from 'axios';

interface ZohoCalendarEvent {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  attendeeEmail: string;
  attendeeName: string;
  timeZone?: string;
}

interface ZohoTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

class ZohoCalendarAPI {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private accessToken: string | null = null;
  private baseUrl = 'https://calendar.zoho.com/api/v1';

  constructor(clientId: string, clientSecret: string, refreshToken: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
        params: {
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token'
        }
      });

      const data: ZohoTokenResponse = response.data;
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error refreshing Zoho access token:', error);
      throw new Error('Failed to refresh Zoho access token');
    }
  }

  async createCalendarEvent(eventData: ZohoCalendarEvent): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      // Convert to ISO 8601 format for Zoho
      const startDate = new Date(eventData.startDateTime);
      const endDate = new Date(eventData.endDateTime);

      const eventPayload = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        dateandtime: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          timezone: eventData.timeZone || 'America/Chicago'
        },
        attendees: [
          {
            email: eventData.attendeeEmail,
            name: eventData.attendeeName,
            status: 'needs-action'
          }
        ],
        reminders: [
          {
            action: 'email',
            trigger: '1440' // 24 hours before
          },
          {
            action: 'email', 
            trigger: '60' // 1 hour before
          }
        ]
      };

      const response = await axios.post(
        `${this.baseUrl}/calendars/primary/events`,
        eventPayload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating Zoho calendar event:', error);
      
      // Check if it's an authentication error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Reset access token and try once more
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
              timezone: eventData.timeZone || 'America/Chicago'
            },
            attendees: [
              {
                email: eventData.attendeeEmail,
                name: eventData.attendeeName,
                status: 'needs-action'
              }
            ],
            reminders: [
              {
                action: 'email',
                trigger: '1440' // 24 hours before
              },
              {
                action: 'email', 
                trigger: '60' // 1 hour before
              }
            ]
          };

          const retryResponse = await axios.post(
            `${this.baseUrl}/calendars/primary/events`,
            eventPayload,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          return retryResponse.data;
        } catch (retryError) {
          console.error('Error creating Zoho calendar event on retry:', retryError);
          throw new Error('Failed to create calendar event after token refresh');
        }
      }
      
      throw new Error('Failed to create Zoho calendar event');
    }
  }

  async listCalendars(): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(`${this.baseUrl}/calendars`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error listing Zoho calendars:', error);
      throw new Error('Failed to list calendars');
    }
  }

  async checkAvailability(startDateTime: string, endDateTime: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();

      // Use the correct Zoho Calendar API endpoint for checking free/busy
      const response = await axios.get(
        `${this.baseUrl}/calendars/primary/events`,
        {
          params: {
            timeMin: new Date(startDateTime).toISOString(),
            timeMax: new Date(endDateTime).toISOString(),
            orderBy: 'startTime',
            singleEvents: true
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if there are any events that overlap with the requested time
      const events = response.data.events || [];
      
      const requestStart = new Date(startDateTime).getTime();
      const requestEnd = new Date(endDateTime).getTime();
      
      for (const event of events) {
        if (!event.start || !event.end) continue;
        
        const eventStart = new Date(event.start.dateTime || event.start.date).getTime();
        const eventEnd = new Date(event.end.dateTime || event.end.date).getTime();
        
        // Check for overlap: event starts before request ends AND event ends after request starts
        if (eventStart < requestEnd && eventEnd > requestStart) {
          console.log(`Conflict found with event: ${event.summary} (${event.start.dateTime} - ${event.end.dateTime})`);
          return false; // Time slot is not available
        }
      }
      
      // No conflicts found
      return true;
    } catch (error) {
      console.error('Error checking availability:', error);
      
      // Check if it's a 401 error and retry once with fresh token
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
                orderBy: 'startTime',
                singleEvents: true
              },
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
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
          console.error('Error checking availability on retry:', retryError);
          return true; // Allow booking if we can't verify
        }
      }
      
      // Return true as fallback - better to allow booking than block it
      return true;
    }
  }
}

export { ZohoCalendarAPI, type ZohoCalendarEvent };