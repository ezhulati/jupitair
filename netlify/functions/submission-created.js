// This function runs automatically when a form is submitted
exports.handler = async (event) => {
  // Parse the form submission
  const { payload } = JSON.parse(event.body);
  
  // Extract form fields
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    zip,
    propertyType,
    service,
    preferredDate,
    preferredTime,
    message,
    emergency
  } = payload.data;

  // Determine if it's an emergency
  const isEmergency = emergency === 'yes' || emergency === true;
  
  // Create subject line
  const subject = isEmergency 
    ? `🚨 EMERGENCY Service Request from ${firstName} ${lastName}`
    : `Service Request from ${firstName} ${lastName}`;

  // Format the email body (you can make this as pretty as you want)
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${isEmergency ? '<div style="background: #dc2626; color: white; padding: 10px; text-align: center; font-weight: bold;">🚨 EMERGENCY SERVICE REQUEST 🚨</div>' : ''}
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1f2937; margin-top: 0;">New Service Request</h2>
        
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <h3 style="color: #374151; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>

        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <h3 style="color: #374151; margin-top: 0;">Service Details</h3>
          <p><strong>Property Type:</strong> ${propertyType}</p>
          <p><strong>Service Needed:</strong> ${service}</p>
          <p><strong>Preferred Date:</strong> ${preferredDate}</p>
          <p><strong>Preferred Time:</strong> ${preferredTime}</p>
        </div>

        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <h3 style="color: #374151; margin-top: 0;">Location</h3>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>ZIP:</strong> ${zip}</p>
        </div>

        ${message ? `
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <h3 style="color: #374151; margin-top: 0;">Additional Message</h3>
          <p>${message}</p>
        </div>
        ` : ''}

        ${isEmergency ? `
        <div style="background: #fef2f2; border: 2px solid #dc2626; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="color: #dc2626; font-weight: bold; margin: 0;">⚠️ This customer needs immediate assistance!</p>
          <p style="margin: 5px 0;">Priority response required - after hours fees may apply.</p>
        </div>
        ` : ''}
      </div>
    </div>
  `;

  // Here you would send the email using a service like SendGrid, Mailgun, etc.
  // For now, this just logs it
  console.log('Email Subject:', subject);
  console.log('Email Body:', emailBody);

  // You could also send this to a webhook, Zapier, or email service here

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Notification processed' })
  };
};