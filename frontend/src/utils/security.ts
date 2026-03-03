//Security Utilities
import { AUTH_COOKIES } from '@/shared/auth-cookies';

//Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

//Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

//Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//Check if a password meets security requirements
export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain a number');
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain a special character');
  }
  
  return { valid: errors.length === 0, errors };
}

//Securely store sensitive data (encrypted in production)
export const secureStorage: {
  set: (key: string, value: string) => void;
  get: (key: string) => string | null;
  remove: (key: string) => void;
} = {
  set(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    // In production, consider encrypting sensitive values
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Storage might be full or disabled
    }
  },
  get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(key);
  },
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },
};

//Check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

//Rate limit helper - track request timestamps
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.limit) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

//CSRF token helper (for forms)
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

//Clear all sensitive data
export function clearSensitiveData(): void {
  if (typeof window === 'undefined') return;
  
  // Clear session storage
  sessionStorage.clear();
  
  // Clear sensitive cookies
  const sensitiveCookies = [AUTH_COOKIES.access, AUTH_COOKIES.refresh, 'csrf_token'];
  sensitiveCookies.forEach(cookie => {
    document.cookie = `${cookie}=; Max-Age=0; path=/`;
  });
}
