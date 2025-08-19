// Secure logging utility for production
export const logger = {
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, data);
    }
    // In production, could send to monitoring service like Sentry
  },
  
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, data);
    }
    // In production, send to monitoring service
  },
  
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(`[ERROR] ${message}`, error);
    }
    // In production, always send critical errors to monitoring
    // Could integrate with Sentry, New Relic, etc.
  },
  
  // Security-focused logging - never logs sensitive data
  security: (message: string, metadata?: { ip?: string, userAgent?: string, timestamp?: string }) => {
    const sanitizedData = {
      timestamp: metadata?.timestamp || new Date().toISOString(),
      ip: metadata?.ip ? metadata.ip.substring(0, 10) + '***' : 'unknown',
      userAgent: metadata?.userAgent?.substring(0, 50) + '...' || 'unknown'
    };
    
    if (import.meta.env.DEV) {
      console.log(`[SECURITY] ${message}`, sanitizedData);
    }
    
    // In production, always send security events to monitoring
  }
};