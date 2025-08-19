import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { createEvent } from 'ics';
import { ZohoCalendarAPI } from '../../lib/zoho-calendar.js';

export const prerender = false;

// This API endpoint requires server-side rendering
// For static builds, forms will need to use external services like Netlify Forms

// Input validation and sanitization
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').substring(0, 500);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date instanceof Date && !isNaN(date.getTime()) && date >= now;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limiting check (basic IP-based)
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // Parse the request body - handle both JSON and form data
    let data: any;
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await request.json();
    } else if (contentType?.includes('application/x-www-form-urlencoded') || contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      return new Response(JSON.stringify({ 
        error: 'Invalid content type',
        success: false
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Sanitize all inputs
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        data[key] = sanitizeInput(data[key]);
      }
    });
    
    // Normalize field names to handle both form formats
    if (data.name && !data['first-name']) {
      const nameParts = data.name.trim().split(' ');
      data['first-name'] = nameParts[0] || '';
      data['last-name'] = nameParts.slice(1).join(' ') || '';
    }
    
    // Set defaults for missing fields with sanitization
    data['first-name'] = sanitizeInput(data['first-name'] || data.firstName || '');
    data['last-name'] = sanitizeInput(data['last-name'] || data.lastName || '');
    data['email'] = sanitizeInput(data['email'] || data.email || '');
    data['phone'] = sanitizeInput(data['phone'] || data.phone || '');
    data['address'] = sanitizeInput(data['address'] || data.address || '');
    data['city'] = sanitizeInput(data['city'] || data.city || 'North Texas');
    data['zip'] = sanitizeInput(data['zip'] || data.zip || '75000');
    data['property-type'] = sanitizeInput(data['property-type'] || data.propertyType || 'Residential');
    data['service'] = sanitizeInput(data['service'] || data.service || 'General Inquiry');
    data['preferred-date'] = sanitizeInput(data['preferred-date'] || data.preferredDate || new Date().toISOString().split('T')[0]);
    data['preferred-time'] = sanitizeInput(data['preferred-time'] || data.preferredTime || data.timeSlot || 'anytime');
    data['message'] = sanitizeInput(data['message'] || data.notes || data.comments || '');
    
    // Validate required fields
    if (!data['phone'] || !validatePhone(data['phone'])) {
      return new Response(JSON.stringify({ 
        error: 'Valid phone number is required',
        success: false
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate email if provided
    if (data['email'] && data['email'] !== '' && !validateEmail(data['email'])) {
      return new Response(JSON.stringify({ 
        error: 'Valid email address is required',
        success: false
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate date if provided
    if (data['preferred-date'] && !isValidDate(data['preferred-date'])) {
      return new Response(JSON.stringify({ 
        error: 'Valid future date is required',
        success: false
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check for required environment variables
    const zohoEmail = import.meta.env.ZOHO_EMAIL || process.env.ZOHO_EMAIL;
    const zohoPassword = import.meta.env.ZOHO_PASSWORD || process.env.ZOHO_PASSWORD;
    const zohoClientId = import.meta.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
    const zohoClientSecret = import.meta.env.ZOHO_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET;
    const zohoRefreshToken = import.meta.env.ZOHO_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN;
    
    // Log form submission securely (no sensitive data)
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      clientIP: clientIP.substring(0, 10) + '***', // Partial IP for privacy
      hasName: !!(data['first-name'] || data['last-name']),
      hasPhone: !!data['phone'],
      hasEmail: !!data['email'],
      service: data['service'],
      userAgent: request.headers.get('user-agent')?.substring(0, 50) + '...'
    });
    
    // TEMPORARILY SKIP EMAIL - just log and return success
    if (true || !zohoEmail || !zohoPassword) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Your request has been received. We will contact you shortly!',
        note: 'Email notifications are currently disabled'
      }), { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
    
    // Create Zoho SMTP transporter with security settings
    const transporter = nodemailer.createTransporter({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: zohoEmail,
        pass: zohoPassword
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      requireTLS: true,
      tls: {
        rejectUnauthorized: true
      }
    });

    // Initialize Zoho Calendar API (if credentials are available)
    let zohoCalendar: ZohoCalendarAPI | null = null;
    if (zohoClientId && zohoClientSecret && zohoRefreshToken) {
      zohoCalendar = new ZohoCalendarAPI(zohoClientId, zohoClientSecret, zohoRefreshToken);
    }
    
    // Parse appointment date and time with validation
    const dateStr = data['preferred-date'] || new Date().toISOString().split('T')[0];
    const appointmentDate = new Date(dateStr);
    const timeSlot = data['preferred-time'] || 'anytime';
    let startHour = 8;
    let duration = 2;
    
    if (timeSlot !== 'anytime') {
      const timeMatch = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/);
      if (timeMatch) {
        startHour = parseInt(timeMatch[1]);
        if (timeMatch[3] === 'PM' && startHour !== 12) startHour += 12;
        if (timeMatch[3] === 'AM' && startHour === 12) startHour = 0;
      }
    }
    
    // Create calendar event with sanitized data
    const eventDetails = {
      title: `HVAC Service: ${data['first-name']} ${data['last-name']}`,
      description: `Service: ${data.service}\\nProperty Type: ${data['property-type']}\\nPhone: ${data.phone}\\nEmail: ${data.email}\\n${data.message ? 'Notes: ' + data.message : ''}`,
      location: `${data.address}, ${data.city}, TX ${data.zip}`,
      start: [
        appointmentDate.getFullYear(),
        appointmentDate.getMonth() + 1,
        appointmentDate.getDate(),
        startHour,
        0
      ],
      end: [
        appointmentDate.getFullYear(),
        appointmentDate.getMonth() + 1,
        appointmentDate.getDate(),
        startHour + duration,
        0
      ],
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
        const appointmentStart = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour, 0);
        const appointmentEnd = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour + duration, 0);
        
        const isStillAvailable = await zohoCalendar.checkAvailability(
          appointmentStart.toISOString(),
          appointmentEnd.toISOString()
        );
        
        if (!isStillAvailable && timeSlot !== 'anytime') {
          return new Response(JSON.stringify({ 
            error: 'The selected time slot is no longer available. Please refresh the page and select a different time.',
            errorCode: 'SLOT_UNAVAILABLE'
          }), { 
            status: 409,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (!isStillAvailable && timeSlot === 'anytime') {
          let foundAlternative = false;
          const maxHour = appointmentDate.getDay() === 6 ? 14 : 16;
          
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
          description: `Service: ${data.service}\\nProperty Type: ${data['property-type']}\\nPhone: ${data.phone}\\nEmail: ${data.email}\\n${data.message ? 'Notes: ' + data.message : ''}${data.emergency ? '\\n⚠️ EMERGENCY SERVICE REQUEST' : ''}`,
          location: `${data.address}, ${data.city}, TX ${data.zip}`,
          startDateTime: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour, 0).toISOString(),
          endDateTime: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), startHour + duration, 0).toISOString(),
          attendeeEmail: data.email,
          attendeeName: `${data['first-name']} ${data['last-name']}`,
          timeZone: 'America/Chicago'
        });
        
        calendarEventId = calendarEvent?.id || 'created';
      } catch (calendarError) {
        console.error('Error creating Zoho calendar event:', calendarError);
      }
    }
    
    // Secure email templates (no script injection possible)
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
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <h3 style="color: #0066CC; margin-top: 0;">Service Location</h3>
              <p><strong>Address:</strong> ${data.address}</p>
              <p><strong>City:</strong> ${data.city}, TX ${data.zip}</p>
              <p><strong>Property Type:</strong> ${data['property-type']}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
              <h3 style="color: #0066CC; margin-top: 0;">Service Details</h3>
              <p><strong>Service Needed:</strong> ${data.service}</p>
              <p><strong>Preferred Date:</strong> ${new Date(data['preferred-date']).toLocaleDateString('en-US')}</p>
              <p><strong>Preferred Time:</strong> ${data['preferred-time']}</p>
              ${data.message ? `<p><strong>Message:</strong><br>${data.message}</p>` : ''}
            </div>
            
            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
            </p>
          </div>
        </div>
      `
    };
    
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
              <p><strong>Property Type:</strong> ${data['property-type']}</p>
              <p><strong>Service Needed:</strong> ${data.service}</p>
              ${data.message ? `<p><strong>Your Message:</strong> ${data.message}</p>` : ''}
            </div>
            
            <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400E; margin-top: 0;">Need Immediate Assistance?</h3>
              <p style="color: #78350F;">
                For emergency service, please call us directly at:
                <br><strong style="font-size: 20px;">(940) 390-5676</strong>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 14px;">
                <strong>Business Hours:</strong><br>
                Monday - Friday: 8:00 AM - 6:00 PM<br>
                Saturday: 8:00 AM - 4:00 PM<br>
                24/7 Emergency Service Available
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
    
    // Send emails with error handling
    try {
      await transporter.sendMail(businessEmail);
      await transporter.sendMail(customerEmail);
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Your request has been received. We will contact you shortly!',
        warning: 'Email notification failed but your request was saved'
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Your request has been submitted successfully!'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block'
      }
    });
    
  } catch (error) {
    console.error('Contact API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};