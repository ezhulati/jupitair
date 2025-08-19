/**
 * Centralized business configuration
 * Update phone numbers here for call tracking or changes
 */

export const BUSINESS_CONFIG = {
  // Primary phone number - update here for call tracking
  phone: {
    main: '9403905676', // Raw number for tel: links
    display: '(940) 390-5676', // Formatted for display
    tracking: {
      // Add call tracking numbers by source when needed
      google: '9403905676',
      facebook: '9403905676',
      direct: '9403905676'
    }
  },
  
  // Business hours for smart display
  hours: {
    weekday: { open: '08:00', close: '18:00' },
    saturday: { open: '08:00', close: '16:00' },
    sunday: null, // closed
  },
  
  // Emergency service
  emergency: {
    available: true,
    surcharge: 250,
    afterHoursStart: '19:00',
    afterHoursEnd: '07:00'
  },
  
  // Business details
  name: 'Jupitair HVAC',
  address: {
    street: '5760 Legacy Dr B3-501',
    city: 'Plano',
    state: 'TX',
    zip: '75024'
  }
};

/**
 * Get the appropriate phone number based on context
 */
export function getPhoneNumber(source: 'main' | 'google' | 'facebook' | 'direct' = 'main') {
  return source === 'main' 
    ? BUSINESS_CONFIG.phone.main 
    : BUSINESS_CONFIG.phone.tracking[source] || BUSINESS_CONFIG.phone.main;
}

/**
 * Check if currently during business hours
 */
export function isBusinessHours(): boolean {
  const now = new Date();
  const day = now.getDay();
  const time = now.toTimeString().slice(0, 5);
  
  if (day === 0) return false; // Sunday
  if (day === 6) {
    // Saturday
    return time >= BUSINESS_CONFIG.hours.saturday.open && 
           time < BUSINESS_CONFIG.hours.saturday.close;
  }
  // Weekday
  return time >= BUSINESS_CONFIG.hours.weekday.open && 
         time < BUSINESS_CONFIG.hours.weekday.close;
}

/**
 * Check if currently after hours (emergency rates apply)
 */
export function isAfterHours(): boolean {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  return time >= BUSINESS_CONFIG.emergency.afterHoursStart || 
         time < BUSINESS_CONFIG.emergency.afterHoursEnd;
}