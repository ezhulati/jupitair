/**
 * Enterprise Performance Optimization Module
 * Implements advanced performance patterns for instant loading
 */

// Resource Hints Manager
export class ResourceHints {
  private static instance: ResourceHints;
  private preconnectedDomains = new Set<string>();
  private prefetchedResources = new Set<string>();

  static getInstance(): ResourceHints {
    if (!ResourceHints.instance) {
      ResourceHints.instance = new ResourceHints();
    }
    return ResourceHints.instance;
  }

  // Preconnect to critical third-party domains
  preconnect(origin: string): void {
    if (this.preconnectedDomains.has(origin)) return;
    
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    this.preconnectedDomains.add(origin);
  }

  // DNS prefetch for external domains
  dnsPrefetch(origin: string): void {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = origin;
    document.head.appendChild(link);
  }

  // Prefetch critical resources
  prefetch(url: string): void {
    if (this.prefetchedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = this.getResourceType(url);
    document.head.appendChild(link);
    
    this.prefetchedResources.add(url);
  }

  // Preload critical resources
  preload(url: string, as: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }

  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      js: 'script',
      css: 'style',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      webp: 'image',
      avif: 'image',
      woff2: 'font',
      woff: 'font',
    };
    return typeMap[extension || ''] || 'fetch';
  }
}

// Lazy Loading Manager
export class LazyLoader {
  private static instance: LazyLoader;
  private imageObserver?: IntersectionObserver;
  private iframeObserver?: IntersectionObserver;

  static getInstance(): LazyLoader {
    if (!LazyLoader.instance) {
      LazyLoader.instance = new LazyLoader();
    }
    return LazyLoader.instance;
  }

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Image lazy loading with blur-up effect
    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.imageObserver?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    // Iframe lazy loading
    this.iframeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target as HTMLIFrameElement;
            if (iframe.dataset.src) {
              iframe.src = iframe.dataset.src;
              delete iframe.dataset.src;
            }
            this.iframeObserver?.unobserve(iframe);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (!src) return;

    // Create a new image to load
    const tempImg = new Image();
    
    tempImg.onload = () => {
      // Add loaded class for animation
      img.classList.add('loaded');
      
      // Set the actual image sources
      if (src) img.src = src;
      if (srcset) img.srcset = srcset;
      
      // Clean up data attributes
      delete img.dataset.src;
      delete img.dataset.srcset;
    };

    // Start loading
    if (srcset) tempImg.srcset = srcset;
    tempImg.src = src;
  }

  observeImages(): void {
    if (!this.imageObserver) return;
    
    document.querySelectorAll('img[data-src]').forEach((img) => {
      this.imageObserver?.observe(img);
    });
  }

  observeIframes(): void {
    if (!this.iframeObserver) return;
    
    document.querySelectorAll('iframe[data-src]').forEach((iframe) => {
      this.iframeObserver?.observe(iframe);
    });
  }

  // Load images within a specific container
  loadImagesInContainer(container: HTMLElement): void {
    container.querySelectorAll('img[data-src]').forEach((img) => {
      this.loadImage(img as HTMLImageElement);
    });
  }
}

// Critical CSS Manager
export class CriticalCSS {
  private static instance: CriticalCSS;
  private loadedStyles = new Set<string>();

  static getInstance(): CriticalCSS {
    if (!CriticalCSS.instance) {
      CriticalCSS.instance = new CriticalCSS();
    }
    return CriticalCSS.instance;
  }

  // Load non-critical CSS asynchronously
  loadCSS(href: string, media = 'all'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedStyles.has(href)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print'; // Load without blocking
      
      link.onload = () => {
        link.media = media; // Apply styles after load
        this.loadedStyles.add(href);
        resolve();
      };
      
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }

  // Inline critical CSS
  inlineCSS(css: string): void {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Service Worker Manager
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration?: ServiceWorkerRegistration;

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(swPath = '/sw.js'): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      this.registration = await navigator.serviceWorker.register(swPath, {
        scope: '/',
      });

      // Check for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            this.notifyUpdate();
          }
        });
      });

      // Check for updates periodically
      setInterval(() => {
        this.registration?.update();
      }, 60000); // Check every minute

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private notifyUpdate(): void {
    // Implement update notification UI
    if (confirm('A new version is available. Reload to update?')) {
      window.location.reload();
    }
  }

  // Clear all caches
  async clearCache(): Promise<void> {
    if (!('caches' in window)) return;
    
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
  }
}

// Web Vitals Monitoring
export class WebVitals {
  private static instance: WebVitals;
  private metrics: Record<string, number> = {};

  static getInstance(): WebVitals {
    if (!WebVitals.instance) {
      WebVitals.instance = new WebVitals();
    }
    return WebVitals.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.observeMetrics();
    }
  }

  private observeMetrics(): void {
    // Observe Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      this.reportMetric('LCP', this.metrics.lcp);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Observe First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.reportMetric('FID', this.metrics.fid);
      });
    }).observe({ type: 'first-input', buffered: true });

    // Observe Cumulative Layout Shift
    let clsValue = 0;
    let clsEntries: any[] = [];
    
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = clsEntries[0];
          const lastSessionEntry = clsEntries[clsEntries.length - 1];
          
          if (entry.startTime - lastSessionEntry?.startTime < 1000 &&
              entry.startTime - firstSessionEntry?.startTime < 5000) {
            clsEntries.push(entry);
            clsValue += entry.value;
          } else {
            clsEntries = [entry];
            clsValue = entry.value;
          }
        }
      }
      this.metrics.cls = clsValue;
      this.reportMetric('CLS', this.metrics.cls);
    }).observe({ type: 'layout-shift', buffered: true });

    // First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('FCP', this.metrics.fcp);
          paintObserver.disconnect();
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });

    // Time to Interactive
    this.measureTTI();
  }

  private measureTTI(): void {
    if ('PerformanceLongTaskTiming' in window) {
      const observer = new PerformanceObserver((list) => {
        const perfEntries = list.getEntries();
        // Logic to calculate TTI based on long tasks
        const lastLongTask = perfEntries[perfEntries.length - 1];
        this.metrics.tti = lastLongTask.startTime + lastLongTask.duration;
        this.reportMetric('TTI', this.metrics.tti);
      });
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private reportMetric(name: string, value: number): void {
    // Send to analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${value.toFixed(2)}ms`);
    }
  }

  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }
}

// Adaptive Loading based on network and device
export class AdaptiveLoading {
  private static instance: AdaptiveLoading;
  private connectionType: string = 'unknown';
  private saveData: boolean = false;
  private deviceMemory: number = 8;
  private hardwareConcurrency: number = 4;

  static getInstance(): AdaptiveLoading {
    if (!AdaptiveLoading.instance) {
      AdaptiveLoading.instance = new AdaptiveLoading();
    }
    return AdaptiveLoading.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.detectCapabilities();
    }
  }

  private detectCapabilities(): void {
    // Network Information API
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;
    
    if (connection) {
      this.connectionType = connection.effectiveType || 'unknown';
      this.saveData = connection.saveData || false;
      
      // Listen for connection changes
      connection.addEventListener('change', () => {
        this.connectionType = connection.effectiveType;
        this.saveData = connection.saveData;
        this.adaptContent();
      });
    }

    // Device Memory API
    if ('deviceMemory' in navigator) {
      this.deviceMemory = (navigator as any).deviceMemory;
    }

    // Hardware Concurrency
    if ('hardwareConcurrency' in navigator) {
      this.hardwareConcurrency = navigator.hardwareConcurrency;
    }
  }

  private adaptContent(): void {
    const root = document.documentElement;
    
    // Adapt based on connection
    if (this.connectionType === 'slow-2g' || this.connectionType === '2g' || this.saveData) {
      root.classList.add('reduced-data');
      this.loadLowQualityImages();
      this.disableAnimations();
    } else if (this.connectionType === '3g') {
      root.classList.add('moderate-data');
      this.loadMediumQualityImages();
    } else {
      root.classList.remove('reduced-data', 'moderate-data');
      this.loadHighQualityImages();
    }

    // Adapt based on device capabilities
    if (this.deviceMemory < 4 || this.hardwareConcurrency < 4) {
      root.classList.add('low-end-device');
      this.reduceComplexity();
    }
  }

  private loadLowQualityImages(): void {
    document.querySelectorAll('img[data-src-low]').forEach((img: any) => {
      img.src = img.dataset.srcLow;
    });
  }

  private loadMediumQualityImages(): void {
    document.querySelectorAll('img[data-src-medium]').forEach((img: any) => {
      img.src = img.dataset.srcMedium || img.dataset.src;
    });
  }

  private loadHighQualityImages(): void {
    document.querySelectorAll('img[data-src]').forEach((img: any) => {
      img.src = img.dataset.src;
    });
  }

  private disableAnimations(): void {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }

  private reduceComplexity(): void {
    // Disable parallax effects
    document.querySelectorAll('.parallax').forEach((el) => {
      el.classList.remove('parallax');
    });

    // Reduce particle effects
    document.querySelectorAll('.particles').forEach((el) => {
      el.remove();
    });
  }

  shouldLoadHighQuality(): boolean {
    return this.connectionType === '4g' && !this.saveData && this.deviceMemory >= 4;
  }

  shouldReduceMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
           this.connectionType === 'slow-2g' ||
           this.connectionType === '2g' ||
           this.saveData;
  }
}

// Initialize performance optimizations
export function initializePerformance(): void {
  // Initialize resource hints
  const resourceHints = ResourceHints.getInstance();
  resourceHints.preconnect('https://fonts.googleapis.com');
  resourceHints.preconnect('https://www.googletagmanager.com');
  resourceHints.dnsPrefetch('https://www.google-analytics.com');

  // Initialize lazy loading
  const lazyLoader = LazyLoader.getInstance();
  lazyLoader.observeImages();
  lazyLoader.observeIframes();

  // Initialize service worker
  const swManager = ServiceWorkerManager.getInstance();
  swManager.register('/sw.js');

  // Initialize web vitals monitoring
  WebVitals.getInstance();

  // Initialize adaptive loading
  AdaptiveLoading.getInstance();

  // Optimize requestIdleCallback for non-critical tasks
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Load non-critical CSS
      const criticalCSS = CriticalCSS.getInstance();
      criticalCSS.loadCSS('/styles/non-critical.css');
    });
  }
}