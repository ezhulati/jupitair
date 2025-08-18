/**
 * Analytics and tracking utilities for Jupitair HVAC
 * Includes Google Analytics 4 (GA4) and Google Tag Manager (GTM) setup
 */

// Analytics configuration
export const analyticsConfig = {
  gtmId: process.env.GTM_ID || 'GTM-XXXXXXX', // Replace with actual GTM ID
  ga4Id: process.env.GA4_ID || 'G-XXXXXXXXXX', // Replace with actual GA4 ID
  hotjarId: process.env.HOTJAR_ID || '0000000', // Replace with actual Hotjar ID
  debug: process.env.NODE_ENV === 'development'
};

// Google Tag Manager initialization
export function initializeGTM() {
  if (typeof window === 'undefined') return;
  
  // GTM script injection
  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${analyticsConfig.gtmId}`;
  document.head.appendChild(gtmScript);
  
  // GTM dataLayer initialization
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
  
  if (analyticsConfig.debug) {
    console.log('GTM initialized with ID:', analyticsConfig.gtmId);
  }
}

// Google Analytics 4 initialization
export function initializeGA4() {
  if (typeof window === 'undefined') return;
  
  // GA4 script injection
  const ga4Script = document.createElement('script');
  ga4Script.async = true;
  ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4Id}`;
  document.head.appendChild(ga4Script);
  
  // GA4 configuration
  (window as any).gtag = (window as any).gtag || function() {
    ((window as any).gtag.q = (window as any).gtag.q || []).push(arguments);
  };
  (window as any).gtag('js', new Date());
  (window as any).gtag('config', analyticsConfig.ga4Id, {
    page_title: document.title,
    page_location: window.location.href
  });
  
  if (analyticsConfig.debug) {
    console.log('GA4 initialized with ID:', analyticsConfig.ga4Id);
  }
}

// Hotjar initialization for user behavior tracking
export function initializeHotjar() {
  if (typeof window === 'undefined') return;
  
  (window as any).hj = (window as any).hj || function() {
    ((window as any).hj.q = (window as any).hj.q || []).push(arguments);
  };
  (window as any)._hjSettings = { hjid: analyticsConfig.hotjarId, hjsv: 6 };
  
  const hotjarScript = document.createElement('script');
  hotjarScript.async = true;
  hotjarScript.src = `https://static.hotjar.com/c/hotjar-${analyticsConfig.hotjarId}.js?sv=6`;
  document.head.appendChild(hotjarScript);
  
  if (analyticsConfig.debug) {
    console.log('Hotjar initialized with ID:', analyticsConfig.hotjarId);
  }
}

// Event tracking interfaces
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface ConversionEvent {
  event_name: string;
  value?: number;
  currency?: string;
  service_type?: string;
  city?: string;
  phone_number?: string;
  form_type?: string;
}

export interface PhoneCallEvent {
  phone_number: string;
  call_type: 'header' | 'footer' | 'emergency' | 'service_page' | 'city_page';
  page_location: string;
  service_context?: string;
  city_context?: string;
}

// Enhanced event tracking functions
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  
  // Send to GA4
  if ((window as any).gtag) {
    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });
  }
  
  // Send to GTM dataLayer
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'custom_event',
      event_action: event.action,
      event_category: event.category,
      event_label: event.label,
      event_value: event.value,
      ...event.custom_parameters
    });
  }
  
  if (analyticsConfig.debug) {
    console.log('Event tracked:', event);
  }
}

// Phone call tracking
export function trackPhoneCall(event: PhoneCallEvent) {
  trackEvent({
    action: 'phone_call',
    category: 'engagement',
    label: event.call_type,
    custom_parameters: {
      phone_number: event.phone_number,
      call_type: event.call_type,
      page_location: event.page_location,
      service_context: event.service_context,
      city_context: event.city_context
    }
  });
  
  // Track as conversion
  trackConversion({
    event_name: 'phone_call_initiated',
    service_type: event.service_context,
    city: event.city_context,
    phone_number: event.phone_number
  });
}

// Form submission tracking
export function trackFormSubmission(formType: string, formData: Record<string, any>) {
  trackEvent({
    action: 'form_submission',
    category: 'conversion',
    label: formType,
    custom_parameters: {
      form_type: formType,
      city: formData.city,
      service: formData.service,
      emergency: formData.emergency || false
    }
  });
  
  // Track as conversion
  trackConversion({
    event_name: 'form_submission',
    form_type: formType,
    service_type: formData.service,
    city: formData.city
  });
}

// Service page engagement tracking
export function trackServicePageView(serviceName: string, cityName?: string) {
  trackEvent({
    action: 'service_page_view',
    category: 'engagement',
    label: serviceName,
    custom_parameters: {
      service_name: serviceName,
      city_name: cityName,
      page_type: cityName ? 'city_service' : 'service'
    }
  });
}

// Emergency service tracking
export function trackEmergencyServiceRequest(method: 'phone' | 'form', context: string) {
  trackEvent({
    action: 'emergency_service_request',
    category: 'conversion',
    label: method,
    value: 1,
    custom_parameters: {
      request_method: method,
      context: context,
      timestamp: new Date().toISOString()
    }
  });
  
  // Track as high-value conversion
  trackConversion({
    event_name: 'emergency_service_request',
    value: 100, // Assign high value to emergency requests
    currency: 'USD'
  });
}

// Conversion tracking
export function trackConversion(event: ConversionEvent) {
  if (typeof window === 'undefined') return;
  
  // Send to GA4 as conversion event
  if ((window as any).gtag) {
    (window as any).gtag('event', event.event_name, {
      value: event.value,
      currency: event.currency || 'USD',
      service_type: event.service_type,
      city: event.city,
      phone_number: event.phone_number,
      form_type: event.form_type
    });
  }
  
  // Send to GTM dataLayer
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'conversion',
      conversion_event: event.event_name,
      conversion_value: event.value,
      conversion_currency: event.currency || 'USD',
      service_type: event.service_type,
      city: event.city
    });
  }
  
  if (analyticsConfig.debug) {
    console.log('Conversion tracked:', event);
  }
}

// Page view tracking
export function trackPageView(page: { title: string; path: string; city?: string; service?: string }) {
  if (typeof window === 'undefined') return;
  
  // Send to GA4
  if ((window as any).gtag) {
    (window as any).gtag('config', analyticsConfig.ga4Id, {
      page_title: page.title,
      page_location: window.location.href,
      page_path: page.path,
      city: page.city,
      service: page.service
    });
  }
  
  // Send to GTM dataLayer
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'page_view',
      page_title: page.title,
      page_path: page.path,
      city: page.city,
      service: page.service
    });
  }
}

// Scroll depth tracking
export function initializeScrollTracking() {
  if (typeof window === 'undefined') return;
  
  let scrollDepths = [25, 50, 75, 90];
  let trackedDepths: number[] = [];
  
  function calculateScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    scrollDepths.forEach(depth => {
      if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
        trackedDepths.push(depth);
        trackEvent({
          action: 'scroll_depth',
          category: 'engagement',
          label: `${depth}%`,
          value: depth
        });
      }
    });
  }
  
  let throttleTimer: NodeJS.Timeout | null = null;
  window.addEventListener('scroll', () => {
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
      calculateScrollDepth();
      throttleTimer = null;
    }, 500);
  });
}

// Time on page tracking
export function initializeTimeTracking() {
  if (typeof window === 'undefined') return;
  
  const startTime = Date.now();
  const timeThresholds = [30, 60, 120, 300]; // seconds
  const trackedTimes: number[] = [];
  
  const interval = setInterval(() => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    
    timeThresholds.forEach(threshold => {
      if (timeOnPage >= threshold && !trackedTimes.includes(threshold)) {
        trackedTimes.push(threshold);
        trackEvent({
          action: 'time_on_page',
          category: 'engagement',
          label: `${threshold}s`,
          value: threshold
        });
      }
    });
    
    // Stop tracking after 10 minutes
    if (timeOnPage >= 600) {
      clearInterval(interval);
    }
  }, 10000); // Check every 10 seconds
  
  // Track time on page when user leaves
  window.addEventListener('beforeunload', () => {
    const finalTime = Math.round((Date.now() - startTime) / 1000);
    trackEvent({
      action: 'session_duration',
      category: 'engagement',
      label: 'page_exit',
      value: finalTime
    });
  });
}

// Click tracking for CTAs and important links
export function initializeClickTracking() {
  if (typeof window === 'undefined') return;
  
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    // Track phone number clicks
    if (target.closest('a[href^="tel:"]')) {
      const phoneLink = target.closest('a[href^="tel:"]') as HTMLAnchorElement;
      const phoneNumber = phoneLink.href.replace('tel:', '');
      const context = getClickContext(target);
      
      trackPhoneCall({
        phone_number: phoneNumber,
        call_type: context.type as any,
        page_location: window.location.href,
        service_context: context.service,
        city_context: context.city
      });
    }
    
    // Track service links
    if (target.closest('a[href*="/services/"]')) {
      const serviceLink = target.closest('a[href*="/services/"]') as HTMLAnchorElement;
      const serviceName = serviceLink.href.split('/services/')[1]?.split('/')[0];
      
      trackEvent({
        action: 'service_link_click',
        category: 'navigation',
        label: serviceName,
        custom_parameters: {
          link_text: serviceLink.textContent?.trim(),
          page_location: window.location.href
        }
      });
    }
    
    // Track city links
    if (target.closest('a[href^="/"][href*="/"]') && !target.closest('a[href*="/services/"]')) {
      const cityLink = target.closest('a') as HTMLAnchorElement;
      const cityName = cityLink.href.split('/').filter(Boolean).pop();
      
      if (cityName && ['frisco', 'plano', 'mckinney', 'allen', 'prosper', 'the-colony', 'little-elm', 'addison'].includes(cityName)) {
        trackEvent({
          action: 'city_link_click',
          category: 'navigation',
          label: cityName,
          custom_parameters: {
            link_text: cityLink.textContent?.trim(),
            page_location: window.location.href
          }
        });
      }
    }
    
    // Track CTA button clicks
    if (target.closest('button, .btn-primary, .btn-emergency, .btn-secondary')) {
      const button = target.closest('button, .btn-primary, .btn-emergency, .btn-secondary') as HTMLElement;
      const buttonText = button.textContent?.trim() || 'Unknown';
      const buttonType = button.className.includes('emergency') ? 'emergency' : 
                        button.className.includes('primary') ? 'primary' : 'secondary';
      
      trackEvent({
        action: 'cta_click',
        category: 'conversion',
        label: buttonText,
        custom_parameters: {
          button_type: buttonType,
          page_location: window.location.href
        }
      });
    }
  });
}

// Helper function to determine click context
function getClickContext(element: HTMLElement) {
  const context: any = { type: 'unknown' };
  
  // Check if in header
  if (element.closest('header')) {
    context.type = 'header';
  }
  // Check if in footer
  else if (element.closest('footer')) {
    context.type = 'footer';
  }
  // Check if emergency button
  else if (element.closest('.btn-emergency, .emergency')) {
    context.type = 'emergency';
  }
  // Check if on service page
  else if (window.location.pathname.includes('/services/')) {
    context.type = 'service_page';
    context.service = window.location.pathname.split('/services/')[1]?.split('/')[0];
  }
  // Check if on city page
  else if (window.location.pathname.match(/^\/[a-z-]+$/)) {
    context.type = 'city_page';
    context.city = window.location.pathname.replace('/', '');
  }
  
  return context;
}

// Initialize all tracking
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;
  
  // Initialize tracking platforms
  initializeGTM();
  initializeGA4();
  initializeHotjar();
  
  // Initialize behavior tracking
  setTimeout(() => {
    initializeScrollTracking();
    initializeTimeTracking();
    initializeClickTracking();
  }, 1000);
  
  if (analyticsConfig.debug) {
    console.log('All analytics initialized');
  }
}

// Enhanced local business tracking
export function trackLocalBusinessInteraction(interaction: {
  type: 'hours_viewed' | 'address_clicked' | 'directions_requested' | 'review_viewed';
  location?: string;
  value?: number;
}) {
  trackEvent({
    action: 'local_business_interaction',
    category: 'local_seo',
    label: interaction.type,
    value: interaction.value,
    custom_parameters: {
      interaction_type: interaction.type,
      location: interaction.location
    }
  });
}

// HVAC-specific event tracking
export function trackHVACSpecificEvent(event: {
  type: 'emergency_detected' | 'seasonal_content_viewed' | 'maintenance_reminder_shown' | 'energy_savings_calculated';
  service?: string;
  season?: string;
  temperature?: number;
  value?: number;
}) {
  trackEvent({
    action: 'hvac_specific_event',
    category: 'hvac_engagement',
    label: event.type,
    value: event.value,
    custom_parameters: {
      hvac_event_type: event.type,
      service_type: event.service,
      season: event.season,
      temperature: event.temperature
    }
  });
}