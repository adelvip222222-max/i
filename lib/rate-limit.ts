// Rate limiting utility for API routes
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const key = `${identifier}`;

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + this.config.interval,
      };
      return { success: true, remaining: this.config.uniqueTokenPerInterval - 1 };
    }

    if (store[key].count >= this.config.uniqueTokenPerInterval) {
      return { success: false, remaining: 0 };
    }

    store[key].count++;
    return {
      success: true,
      remaining: this.config.uniqueTokenPerInterval - store[key].count,
    };
  }
}

// Pre-configured rate limiters
export const apiLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60, // 60 requests per minute
});

export const authLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 login attempts per 15 minutes
});

export const contactLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 3, // 3 contact form submissions per hour
});
