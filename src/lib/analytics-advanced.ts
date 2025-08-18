/**
 * Enterprise Analytics & Heatmap Tracking Module
 * Advanced analytics with custom event tracking, heatmaps, and session recording
 */

declare global {
  interface Window {
    gtag: any;
    dataLayer: any;
    _paq: any;
    hj: any;
    clarity: any;
  }
}

// Enhanced Analytics Manager
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private sessionStartTime: number;
  private pageViewStartTime: number;
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;
  private engagementTime: number = 0;
  private lastActivityTime: number;
  private idleTimer?: NodeJS.Timeout;
  private isEngaged: boolean = true;

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.pageViewStartTime = Date.now();
    this.lastActivityTime = Date.now();
    
    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private initializeTracking(): void {
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseEngagement();
      } else {
        this.resumeEngagement();
      }
    });

    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => this.trackActivity(), { passive: true });
    });

    // Track scroll depth
    window.addEventListener('scroll', this.trackScrollDepth.bind(this), { passive: true });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
    });

    // Track form interactions
    this.trackFormInteractions();

    // Track link clicks
    this.trackLinkClicks();

    // Track errors
    this.trackErrors();

    // Start engagement timer
    this.startEngagementTimer();
  }

  private trackActivity(): void {
    this.lastActivityTime = Date.now();
    
    if (!this.isEngaged) {
      this.resumeEngagement();
    }

    // Reset idle timer
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.idleTimer = setTimeout(() => {
      this.pauseEngagement();
    }, 30000); // 30 seconds of inactivity
  }

  private startEngagementTimer(): void {
    setInterval(() => {
      if (this.isEngaged && !document.hidden) {
        this.engagementTime += 1000;
        
        // Send engagement time every 10 seconds
        if (this.engagementTime % 10000 === 0) {
          this.track('engagement_time', {
            time_seconds: this.engagementTime / 1000,
            page_path: window.location.pathname,
          });
        }
      }
    }, 1000);
  }

  private pauseEngagement(): void {
    this.isEngaged = false;
  }

  private resumeEngagement(): void {
    this.isEngaged = true;
    this.lastActivityTime = Date.now();
  }

  private trackScrollDepth(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    this.scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
    
    if (this.scrollDepth > this.maxScrollDepth) {
      this.maxScrollDepth = this.scrollDepth;
      
      // Track milestone scroll depths
      const milestones = [25, 50, 75, 90, 100];
      milestones.forEach(milestone => {
        if (this.maxScrollDepth >= milestone && this.maxScrollDepth - this.scrollDepth < 5) {
          this.track('scroll_depth', {
            depth_percentage: milestone,
            page_path: window.location.pathname,
          });
        }
      });
    }
  }

  private trackFormInteractions(): void {
    document.addEventListener('focus', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.track('form_field_focus', {
          field_name: target.getAttribute('name') || target.id,
          field_type: target.getAttribute('type') || target.tagName.toLowerCase(),
          form_id: target.closest('form')?.id,
        });
      }
    }, true);

    document.addEventListener('change', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        this.track('form_field_change', {
          field_name: target.getAttribute('name') || target.id,
          field_type: target.getAttribute('type') || target.tagName.toLowerCase(),
          form_id: target.closest('form')?.id,
        });
      }
    }, true);

    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.track('form_submit', {
        form_id: form.id,
        form_name: form.name,
        form_action: form.action,
        form_method: form.method,
      });
    }, true);
  }

  private trackLinkClicks(): void {
    document.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link) {
        const href = link.href;
        const isExternal = href && !href.startsWith(window.location.origin);
        const isDownload = link.hasAttribute('download');
        const isTel = href && href.startsWith('tel:');
        const isEmail = href && href.startsWith('mailto:');

        if (isExternal) {
          this.track('external_link_click', {
            url: href,
            link_text: link.textContent?.trim(),
            link_position: this.getElementPosition(link),
          });
        } else if (isDownload) {
          this.track('download_click', {
            file_url: href,
            file_name: link.getAttribute('download'),
            link_text: link.textContent?.trim(),
          });
        } else if (isTel) {
          this.track('phone_click', {
            phone_number: href.replace('tel:', ''),
            link_position: this.getElementPosition(link),
          });
        } else if (isEmail) {
          this.track('email_click', {
            email_address: href.replace('mailto:', ''),
            link_position: this.getElementPosition(link),
          });
        } else {
          this.track('internal_link_click', {
            url: href,
            link_text: link.textContent?.trim(),
            link_position: this.getElementPosition(link),
          });
        }
      }
    }, true);
  }

  private trackErrors(): void {
    window.addEventListener('error', (e) => {
      this.track('javascript_error', {
        message: e.message,
        filename: e.filename,
        line_number: e.lineno,
        column_number: e.colno,
        error_stack: e.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.track('unhandled_promise_rejection', {
        reason: e.reason,
        promise: e.promise,
      });
    });
  }

  private trackPageExit(): void {
    const timeOnPage = Date.now() - this.pageViewStartTime;
    
    this.track('page_exit', {
      time_on_page_seconds: timeOnPage / 1000,
      max_scroll_depth: this.maxScrollDepth,
      engagement_time_seconds: this.engagementTime / 1000,
      exit_page: window.location.pathname,
    });

    // Send any remaining events
    this.flushEvents();
  }

  private getElementPosition(element: HTMLElement): string {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    if (rect.top < viewportHeight / 3) {
      if (rect.left < viewportWidth / 3) return 'top-left';
      if (rect.left < (2 * viewportWidth) / 3) return 'top-center';
      return 'top-right';
    } else if (rect.top < (2 * viewportHeight) / 3) {
      if (rect.left < viewportWidth / 3) return 'middle-left';
      if (rect.left < (2 * viewportWidth) / 3) return 'middle-center';
      return 'middle-right';
    } else {
      if (rect.left < viewportWidth / 3) return 'bottom-left';
      if (rect.left < (2 * viewportWidth) / 3) return 'bottom-center';
      return 'bottom-right';
    }
  }

  // Public methods
  track(eventName: string, parameters?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      parameters: {
        ...parameters,
        session_id: this.sessionId,
        user_id: this.userId,
        timestamp: Date.now(),
        page_location: window.location.href,
        page_title: document.title,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer,
      },
    };

    this.events.push(event);
    
    // Send to Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, event.parameters);
    }

    // Send to custom endpoint
    this.sendToEndpoint(event);

    // Flush events if buffer is full
    if (this.events.length >= 10) {
      this.flushEvents();
    }
  }

  trackPageView(pagePath?: string): void {
    this.pageViewStartTime = Date.now();
    this.maxScrollDepth = 0;
    this.engagementTime = 0;

    this.track('page_view', {
      page_path: pagePath || window.location.pathname,
      page_search: window.location.search,
      page_hash: window.location.hash,
    });
  }

  trackConversion(conversionType: string, value?: number, currency: string = 'USD'): void {
    this.track('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: currency,
      conversion_id: this.generateSessionId(),
    });
  }

  setUserId(userId: string): void {
    this.userId = userId;
    
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
      });
    }
  }

  private sendToEndpoint(event: AnalyticsEvent): void {
    // Send to custom analytics endpoint
    if (navigator.sendBeacon) {
      const data = JSON.stringify(event);
      navigator.sendBeacon('/api/analytics', data);
    } else {
      // Fallback to fetch
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(event),
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
      }).catch(() => {
        // Store in localStorage if offline
        this.storeOfflineEvent(event);
      });
    }
  }

  private storeOfflineEvent(event: AnalyticsEvent): void {
    const offlineEvents = JSON.parse(localStorage.getItem('offline_events') || '[]');
    offlineEvents.push(event);
    localStorage.setItem('offline_events', JSON.stringify(offlineEvents));
  }

  private flushEvents(): void {
    if (this.events.length === 0) return;

    const events = [...this.events];
    this.events = [];

    // Send batch to endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/batch', JSON.stringify(events));
    }
  }

  // Send offline events when back online
  sendOfflineEvents(): void {
    const offlineEvents = JSON.parse(localStorage.getItem('offline_events') || '[]');
    
    if (offlineEvents.length > 0) {
      fetch('/api/analytics/batch', {
        method: 'POST',
        body: JSON.stringify(offlineEvents),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        localStorage.removeItem('offline_events');
      });
    }
  }
}

// Heatmap Tracking
export class HeatmapTracker {
  private static instance: HeatmapTracker;
  private clicks: HeatmapClick[] = [];
  private movements: MouseMovement[] = [];
  private lastMovementTime: number = 0;
  private recordingId: string;
  private isRecording: boolean = false;

  static getInstance(): HeatmapTracker {
    if (!HeatmapTracker.instance) {
      HeatmapTracker.instance = new HeatmapTracker();
    }
    return HeatmapTracker.instance;
  }

  constructor() {
    this.recordingId = this.generateRecordingId();
    
    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  private generateRecordingId(): string {
    return `hm-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private initializeTracking(): void {
    // Track clicks
    document.addEventListener('click', (e) => {
      this.trackClick(e);
    }, true);

    // Track mouse movements (throttled)
    document.addEventListener('mousemove', (e) => {
      this.trackMouseMovement(e);
    }, { passive: true });

    // Track touch events
    document.addEventListener('touchstart', (e) => {
      this.trackTouch(e);
    }, { passive: true });

    // Send data periodically
    setInterval(() => {
      this.sendHeatmapData();
    }, 30000); // Every 30 seconds

    // Send data on page unload
    window.addEventListener('beforeunload', () => {
      this.sendHeatmapData(true);
    });
  }

  private trackClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const click: HeatmapClick = {
      x: e.pageX,
      y: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY,
      timestamp: Date.now(),
      element: this.getElementSelector(target),
      elementText: target.textContent?.trim().substring(0, 100),
      elementType: target.tagName.toLowerCase(),
      pageUrl: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      page: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
    };

    this.clicks.push(click);

    // Send immediately for important clicks
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('form')) {
      this.sendHeatmapData();
    }
  }

  private trackMouseMovement(e: MouseEvent): void {
    const now = Date.now();
    
    // Throttle to max 10 movements per second
    if (now - this.lastMovementTime < 100) return;
    
    this.lastMovementTime = now;

    const movement: MouseMovement = {
      x: e.pageX,
      y: e.pageY,
      timestamp: now,
      pageUrl: window.location.href,
    };

    this.movements.push(movement);

    // Keep only last 100 movements
    if (this.movements.length > 100) {
      this.movements.shift();
    }
  }

  private trackTouch(e: TouchEvent): void {
    const touch = e.touches[0];
    const target = e.target as HTMLElement;

    const touchData: HeatmapClick = {
      x: touch.pageX,
      y: touch.pageY,
      clientX: touch.clientX,
      clientY: touch.clientY,
      timestamp: Date.now(),
      element: this.getElementSelector(target),
      elementText: target.textContent?.trim().substring(0, 100),
      elementType: target.tagName.toLowerCase(),
      pageUrl: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      page: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      isTouch: true,
    };

    this.clicks.push(touchData);
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      if (classes) {
        return `${element.tagName.toLowerCase()}.${classes}`;
      }
    }

    // Build path from parents
    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector = `#${current.id}`;
        path.unshift(selector);
        break;
      }

      const siblings = current.parentElement?.children;
      if (siblings && siblings.length > 1) {
        const index = Array.from(siblings).indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(' > ');
  }

  private sendHeatmapData(immediate: boolean = false): void {
    if (this.clicks.length === 0 && this.movements.length === 0) return;

    const data = {
      recordingId: this.recordingId,
      clicks: [...this.clicks],
      movements: [...this.movements],
      metadata: {
        pageUrl: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    };

    // Clear sent data
    this.clicks = [];
    this.movements = [];

    // Send data
    const endpoint = '/api/heatmap';
    
    if (immediate && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(data));
    } else {
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Store for later if offline
        this.storeOfflineHeatmapData(data);
      });
    }
  }

  private storeOfflineHeatmapData(data: any): void {
    const offlineData = JSON.parse(localStorage.getItem('offline_heatmap') || '[]');
    offlineData.push(data);
    
    // Keep only last 10 batches
    if (offlineData.length > 10) {
      offlineData.shift();
    }
    
    localStorage.setItem('offline_heatmap', JSON.stringify(offlineData));
  }

  startRecording(): void {
    this.isRecording = true;
    this.recordingId = this.generateRecordingId();
  }

  stopRecording(): void {
    this.isRecording = false;
    this.sendHeatmapData(true);
  }
}

// Types
interface AnalyticsEvent {
  name: string;
  parameters: Record<string, any>;
}

interface HeatmapClick {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  timestamp: number;
  element: string;
  elementText?: string;
  elementType: string;
  pageUrl: string;
  viewport: {
    width: number;
    height: number;
  };
  page: {
    width: number;
    height: number;
  };
  isTouch?: boolean;
}

interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  pageUrl: string;
}

// Initialize analytics
export function initializeAnalytics(config?: {
  googleAnalyticsId?: string;
  enableHeatmap?: boolean;
  enableSessionRecording?: boolean;
}): void {
  // Initialize Google Analytics
  if (config?.googleAnalyticsId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.googleAnalyticsId);
  }

  // Initialize custom analytics
  const analytics = AnalyticsManager.getInstance();
  analytics.trackPageView();

  // Initialize heatmap tracking
  if (config?.enableHeatmap) {
    const heatmap = HeatmapTracker.getInstance();
    heatmap.startRecording();
  }

  // Track online/offline status
  window.addEventListener('online', () => {
    analytics.sendOfflineEvents();
  });
}