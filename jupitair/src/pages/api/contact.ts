import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { createEvent } from 'ics';
import { ZohoCalendarAPI } from '../../lib/zoho-calendar.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    const required = ['first-name', 'last-name', 'email', 'phone', 'address', 'city', 'zip', 'property-type', 'service', 'preferred-date', 'preferred-time'];
    for (const field of required) {
      if (!data[field]) {
        return new Response(JSON.stringify({ 
          error: `Missing required field: ${field}` 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Check for required environment variables
    const zohoEmail = import.meta.env.ZOHO_EMAIL || process.env.ZOHO_EMAIL;
    const zohoPassword = import.meta.env.ZOHO_PASSWORD || process.env.ZOHO_PASSWORD;
    const zohoClientId = import.meta.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = import.meta.env.ZOHO_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = import.meta.env.ZOHO_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN;
    
    if (!zohoEmail || !zohoPassword) {
      console.error('Missing Zoho credentials. Please set ZOHO_EMAIL and ZOHO_PASSWORD in .env file');
      return new Response(JSON.stringify({ 
        error: 'Email service is not configured. Please call us at (940) 390-5676' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: zohoEmail,
        pass: zohoPassword
      }
    });

    // Initialize Zoho Calendar API (if credentials are available)
    let zohoCalendar: ZohoCalendarAPI | null = null;
    if (zohoClientId && zohoClientSecret && zohoRefreshToken) {
      zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
    }
    
    // Parse appointment date and time
    const appointmentDate = new Date(data['preferred-date']);
    const timeSlot = data['preferred-time'];
    let startHour = 8; // Default start time
    let duration = 2; // Default 2 hour appointment
    
    if (timeSlot !== 'anytime') {
      const timeMatch = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/);
      if (timeMatch) {
        startHour = parseInt(timeMatch[1]);
        if (timeMatch[3] === 'PM' && startHour !== 12) startHour += 12;
        if (timeMatch[3] === 'AM' && startHour === 12) startHour = 0;
      }
    }
    
    // Create calendar event
    const startDate = [
      appointmentDate.getFullYear(),
      appointmentDate.getMonth() + 1,
      appointmentDate.getDate(),
      startHour,
      0
    ];
    
    const endDate = [
      appointmentDate.getFullYear(),
      appointmentDate.getMonth() + 1,
      appointmentDate.getDate(),
      startHour + duration,
      0
    ];
    
    const eventDetails = {
      title: `HVAC Service: ${data['first-name']} ${data['last-name']}`,
      description: `Service: ${data.service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\\n` +
                   `Property Type: ${data['property-type'].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\\n` +
                   `Phone: ${data.phone}\\n` +
                   `Email: ${data.email}\\n` +
                   `${data.message ? 'Notes: ' + data.message : ''}`,
      location: `${data.address}, ${data.city}, TX ${data.zip}`,
      start: startDate,
      end: endDate,
      organizer: { name: 'Jupitair HVAC', email: zohoEmail },
      attendees: [
        { name: `${data['first-name']} ${data['last-name']}`, email: data.email }
      ]
    };
    
    const { error: icsError, value: icsContent } = createEvent(eventDetails);
    
    if (icsError) {
      console.error('Error creating calendar event:', icsError);
    }

    // Create Zoho Calendar event with availability check
    let calendarEventId: string | null = null;
    if (zohoCalendar) {
      try {
        // Double-check availability before creating the event
        const appointmentStart = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour, 0);
        const appointmentEnd = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour + duration, 0);
        
        const isStillAvailable = await zohoCalendar.checkAvailability(
          appointmentStart.toISOString(),
          appointmentEnd.toISOString()
        );
        
        if (!isStillAvailable && timeSlot !== 'anytime') {
          // Time slot is no longer available
          return new Response(JSON.stringify({ 
            error: 'The selected time slot is no longer available. Please refresh the page and select a different time.',
            errorCode: 'SLOT_UNAVAILABLE'
          }), { 
            status: 409, // Conflict
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // If "anytime" was selected and the preferred slot isn't available, find the first available slot
        if (!isStillAvailable && timeSlot === 'anytime') {
          console.log('Preferred time slot not available, finding alternative for "anytime" request');
          
          // Try to find an available 2-hour slot during business hours
          let foundAlternative = false;
          const maxHour = appointmentDate.getDay() === 6 ? 14 : 16; // Saturday ends at 4 PM, others at 6 PM
          
          for (let hour = 8; hour <= maxHour; hour++) {
            const altStart = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), hour, 0);
            const altEnd = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), hour + duration, 0);
            
            const altAvailable = await zohoCalendar.checkAvailability(
              altStart.toISOString(),
              altEnd.toISOString()
            );
            
            if (altAvailable) {
              startHour = hour;
              appointmentStart.setHours(hour, 0, 0, 0);
              appointmentEnd.setHours(hour + duration, 0, 0, 0);
              foundAlternative = true;
              console.log(`Found alternative time slot: ${hour}:00`);
              break;
            }
          }
          
          if (!foundAlternative) {
            return new Response(JSON.stringify({ 
              error: 'No available time slots found for the selected date. Please choose a different date or call us at (940) 390-5676',
              errorCode: 'NO_AVAILABILITY'
            }), { 
              status: 409,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        const calendarEvent = await zohoCalendar.createCalendarEvent({
          title: `HVAC Service: ${data['first-name']} ${data['last-name']}`,
          description: `Service: ${data.service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\nProperty Type: ${data['property-type'].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\nPhone: ${data.phone}\nEmail: ${data.email}\n${data.message ? 'Notes: ' + data.message : ''}${data.emergency ? '\n⚠️ EMERGENCY SERVICE REQUEST' : ''}`,
          location: `${data.address}, ${data.city}, TX ${data.zip}`,
          startDateTime: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour, 0).toISOString(),
          endDateTime: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour + duration, 0).toISOString(),
          attendeeEmail: data.email,
          attendeeName: `${data['first-name']} ${data['last-name']}`,
          timeZone: 'America/Chicago'
        });
        
        calendarEventId = calendarEvent?.id || 'created';
        console.log('Zoho Calendar event created successfully:', calendarEventId);
      } catch (calendarError) {
        console.error('Error creating Zoho calendar event:', calendarError);
        // Don't fail the whole request if calendar creation fails
      }
    }
    
    // Email to business owner
    const businessEmail = {
      from: zohoEmail,
      to: import.meta.env.NOTIFICATION_EMAIL || zohoEmail,
      subject: `${data.emergency ? '🚨 EMERGENCY' : 'New'} Service Request - ${data['first-name']} ${data['last-name']}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${data.emergency ? '<div style="background: #DC2626; color: white; padding: 10px; text-align: center; font-weight: bold;">EMERGENCY SERVICE REQUEST</div>' : ''}
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #111827; margin-top: 0;">New Service Request</h2>
            
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <h3 style="color: #0066CC; margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${data['first-name']} ${data['last-name']}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <h3 style="color: #0066CC; margin-top: 0;">Service Location</h3>
              <p><strong>Address:</strong> ${data.address}</p>
              <p><strong>City:</strong> ${data.city}, TX ${data.zip}</p>
              <p><strong>Property Type:</strong> ${data['property-type'].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <h3 style="color: #0066CC; margin-top: 0;">Service Details</h3>
              <p><strong>Service Needed:</strong> ${data.service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p><strong>Preferred Date:</strong> ${new Date(data['preferred-date']).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Preferred Time:</strong> ${data['preferred-time']}</p>
              ${data.message ? `<p><strong>Message:</strong><br>${data.message}</p>` : ''}
              ${data.emergency ? '<p style="color: #DC2626; font-weight: bold;">⚠️ Customer marked this as EMERGENCY</p>' : ''}
            </div>
            
            ${calendarEventId ? `<div style="background: #D1FAE5; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <h3 style="color: #065F46; margin-top: 0;">✅ Calendar Event Created</h3>
              <p style="color: #047857;">This appointment has been added to your Zoho Calendar automatically.</p>
            </div>` : ''}
            
            <div style="background: #EFF6FF; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <h3 style="color: #0066CC; margin-top: 0;">Quick Actions</h3>
              <p>
                <a href="tel:${data.phone}" style="background: #0066CC; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-right: 10px;">Call Customer</a>
                <a href="mailto:${data.email}" style="background: #6B7280; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Email Customer</a>
              </p>
            </div>
            
            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
            </p>
          </div>
        </div>
      `
    };
    
    // Customer confirmation email
    const customerEmail = {
      from: zohoEmail,
      to: data.email,
      subject: 'We Received Your Service Request - Jupitair HVAC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0066CC 0%, #004499 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Jupitair HVAC</h1>
            <p style="color: #E0E7FF; margin-top: 10px;">Professional HVAC Services in North Texas</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #111827;">Thank You, ${data['first-name']}!</h2>
            <p style="color: #4B5563; line-height: 1.6;">
              We've received your service request and will contact you shortly.
              ${data.emergency ? '<strong style="color: #DC2626;">We understand this is an emergency and will prioritize your request.</strong>' : 'Our team typically responds within 1 business hour during regular business hours.'}
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #111827; margin-top: 0;">Your Request Details:</h3>
              <p><strong>Service Address:</strong> ${data.address}, ${data.city}, TX ${data.zip}</p>
              <p><strong>Property Type:</strong> ${data['property-type'].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p><strong>Service Needed:</strong> ${data.service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              ${data.message ? `<p><strong>Your Message:</strong> ${data.message}</p>` : ''}
            </div>
            
            <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400E; margin-top: 0;">Need Immediate Assistance?</h3>
              <p style="color: #78350F;">
                For emergency service, please call us directly at:
                <br><strong style="font-size: 20px;">(940) 390-5676</strong>
              </p>
            </div>
            
            <h3 style="color: #111827;">What Happens Next?</h3>
            <ol style="color: #4B5563; line-height: 1.8;">
              <li>Our service coordinator will review your request</li>
              <li>We'll call you to discuss your needs and schedule service</li>
              <li>A certified technician will arrive at your scheduled time</li>
              <li>We'll provide upfront pricing before any work begins</li>
            </ol>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 14px;">
                <strong>Business Hours:</strong><br>
                Monday - Friday: 8:00 AM - 6:00 PM<br>
                Saturday: 8:00 AM - 4:00 PM<br>
                24/7 Emergency Service Available
              </p>
              <p style="color: #6B7280; font-size: 14px;">
                <strong>Contact Us:</strong><br>
                Phone: (940) 390-5676<br>
                Email: contact@jupitairhvac.com<br>
                5760 Legacy Dr B3-501, Plano, TX 75024
              </p>
            </div>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Jupitair HVAC. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    // Send emails
    await transporter.sendMail(businessEmail);
    await transporter.sendMail(customerEmail);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Your request has been submitted successfully!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Email error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email. Please call us directly at (940) 390-5676'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};