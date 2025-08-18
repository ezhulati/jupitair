/**
 * Check if current time is during after-hours (7pm - 7am CST)
 * Returns true if $250 emergency fee applies
 */
export function isAfterHours(): boolean {
  const now = new Date();
  
  // Convert to CST/CDT (Central Time)
  const centralTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Chicago"}));
  const hours = centralTime.getHours();
  
  // After hours: 7pm (19:00) to 7am (07:00)
  return hours >= 19 || hours < 7;
}

/**
 * Get formatted after-hours message
 */
export function getAfterHoursMessage(): string {
  if (isAfterHours()) {
    return "$250 after-hours fee applies";
  }
  return "";
}

/**
 * Get formatted price with after-hours fee if applicable
 */
export function getEmergencyPrice(basePrice: number = 149): string {
  if (isAfterHours()) {
    return `$${basePrice} + $250 after-hours fee`;
  }
  return `$${basePrice}`;
}

/**
 * Initialize after-hours detection on page load
 * Adds 'after-hours' class to body and updates elements
 */
export function initAfterHoursDetection() {
  if (typeof window === 'undefined') return;
  
  const updateAfterHoursStatus = () => {
    const afterHours = isAfterHours();
    
    // Update body class
    document.body.classList.toggle('after-hours', afterHours);
    
    // Update all emergency CTAs
    const emergencyElements = document.querySelectorAll('[data-emergency-cta]');
    emergencyElements.forEach(element => {
      const originalText = element.getAttribute('data-original-text') || element.textContent;
      
      if (!element.getAttribute('data-original-text')) {
        element.setAttribute('data-original-text', originalText || '');
      }
      
      if (afterHours) {
        // Add after-hours indicator
        const badge = element.querySelector('.after-hours-badge');
        if (!badge && element instanceof HTMLElement) {
          const span = document.createElement('span');
          span.className = 'after-hours-badge inline-block ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-semibold';
          span.textContent = '+$250 after 7pm';
          element.appendChild(span);
        }
      } else {
        // Remove after-hours indicator
        const badge = element.querySelector('.after-hours-badge');
        if (badge) {
          badge.remove();
        }
      }
    });
    
    // Update phone number links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      if (link.hasAttribute('data-emergency')) {
        const tooltip = link.querySelector('.after-hours-tooltip');
        if (afterHours && !tooltip) {
          const span = document.createElement('span');
          span.className = 'after-hours-tooltip absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50';
          span.textContent = '$250 after-hours fee applies';
          link.classList.add('relative');
          link.appendChild(span);
          
          // Hide tooltip after 3 seconds
          setTimeout(() => {
            span.style.opacity = '0';
            setTimeout(() => span.remove(), 300);
          }, 3000);
        }
      }
    });
  };
  
  // Initial check
  updateAfterHoursStatus();
  
  // Re-check every minute
  setInterval(updateAfterHoursStatus, 60000);
  
  // Also update on visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateAfterHoursStatus();
    }
  });
}