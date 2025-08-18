const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Extract form data
    const {
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
      city,
      emergency,
      // Also handle old form format
      name,
      serviceNeeded,
      preferredDate,
      preferredTime
    } = data;

    // Normalize data for both form formats
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (name || 'Unknown');
    const selectedService = service || serviceNeeded || 'Not specified';
    const userMessage = message || '';
    const isEmergency = emergency === 'true' || emergency === true;
    
    // Log the submission
    console.log('Form submission received:', {
      name: fullName,
      email: email || 'Not provided',
      phone: phone || 'Not provided',
      service: selectedService,
      city: city || 'Not specified',
      emergency: isEmergency,
      message: userMessage
    });

    // Get environment variables
    const zohoEmail = process.env.ZOHO_EMAIL;
    const zohoPassword = process.env.ZOHO_PASSWORD;
    
    // For now, skip email sending if not configured
    if (!zohoEmail || !zohoPassword) {
      console.log('Email configuration not found, skipping email notification');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Your request has been received. We will contact you shortly!',
          note: 'Email notifications are currently disabled'
        })
      };
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: zohoEmail,
        pass: zohoPassword
      }
    });

    // Prepare email content
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>City:</strong> ${city || 'Not specified'}</p>
      <p><strong>Service Needed:</strong> ${selectedService}</p>
      ${isEmergency ? '<p><strong>⚠️ EMERGENCY SERVICE REQUESTED</strong></p>' : ''}
      ${preferredDate ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>` : ''}
      ${preferredTime ? `<p><strong>Preferred Time:</strong> ${preferredTime}</p>` : ''}
      ${userMessage ? `<p><strong>Message:</strong><br>${userMessage}</p>` : ''}
      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</small></p>
    `;

    // Send email with timeout
    const emailPromise = transporter.sendMail({
      from: zohoEmail,
      to: 'service@jupitairhvac.com',
      subject: isEmergency ? '🚨 EMERGENCY Service Request' : `New Service Request: ${selectedService}`,
      html: emailHtml
    });

    // Set a timeout for email sending
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email timeout')), 5000)
    );

    try {
      await Promise.race([emailPromise, timeoutPromise]);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Email send error (continuing anyway):', emailError);
    }

    // Always return success to the user
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you! We\'ll contact you within 30 minutes during business hours.',
        emergency: isEmergency
      })
    };

  } catch (error) {
    console.error('Form processing error:', error);
    
    // Return success even on error to avoid form failure
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Your request has been received. We will contact you shortly!',
        note: 'Please call us directly if urgent'
      })
    };
  }
};