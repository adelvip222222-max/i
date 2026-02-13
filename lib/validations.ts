// Validation utilities

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Remove all spaces and special characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Support multiple country formats:
  // Egypt: +20XXXXXXXXXX or 20XXXXXXXXXX or 01XXXXXXXXX (11 digits starting with 01)
  // Saudi: +966XXXXXXXXX or 966XXXXXXXXX or 05XXXXXXXX (10 digits starting with 05)
  // International: +XXXXXXXXXXX (at least 10 digits)
  
  // Egyptian format
  const egyptRegex = /^(\+?20|0)?1[0-9]{9}$/;
  // Saudi format
  const saudiRegex = /^(\+?966|0)?5[0-9]{8}$/;
  // General international format (10-15 digits)
  const internationalRegex = /^\+?[0-9]{10,15}$/;
  
  return egyptRegex.test(cleanPhone) || saudiRegex.test(cleanPhone) || internationalRegex.test(cleanPhone);
}

export function isValidURL(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitize input to prevent XSS attacks
 * Removes HTML tags, scripts, and dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags and dangerous characters
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, '') // Remove data:text/html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .trim();
  
  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
  
  return sanitized;
}

/**
 * Sanitize HTML content while preserving safe formatting
 * Use for rich text content like posts and comments
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') return '';
  
  // Remove dangerous tags and attributes
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
  
  // Limit length
  if (clean.length > 50000) {
    return clean.substring(0, 50000);
  }
  
  return clean;
}

/**
 * Escape special characters for safe display
 */
export function escapeHTML(text: string): string {
  if (typeof text !== 'string') return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate and sanitize username
 */
export function sanitizeUsername(username: string): string {
  if (typeof username !== 'string') return '';
  
  // Only allow alphanumeric, Arabic, spaces, and basic punctuation
  return username
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s\-_]/g, '')
    .trim()
    .substring(0, 50);
}

/**
 * Prevent SQL/NoSQL injection in search queries
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  
  // Remove MongoDB operators and special characters
  return query
    .replace(/[${}]/g, '') // Remove MongoDB operators
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s\-_]/g, '') // Only allow safe characters
    .trim()
    .substring(0, 100);
}

export function validateMessageForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'الاسم يجب أن يكون حرفين على الأقل';
  }
  
  if (data.name && data.name.length > 100) {
    errors.name = 'الاسم طويل جداً';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'البريد الإلكتروني غير صحيح';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'رقم الهاتف غير صحيح';
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = 'الموضوع يجب أن يكون 3 أحرف على الأقل';
  }
  
  if (data.subject && data.subject.length > 200) {
    errors.subject = 'الموضوع طويل جداً';
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'الرسالة يجب أن تكون 10 أحرف على الأقل';
  }
  
  if (data.message && data.message.length > 5000) {
    errors.message = 'الرسالة طويلة جداً';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate post content
 */
export function validatePostContent(title: string, content: string): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!title || title.trim().length < 5) {
    errors.title = 'العنوان يجب أن يكون 5 أحرف على الأقل';
  }
  
  if (title && title.length > 200) {
    errors.title = 'العنوان طويل جداً';
  }

  if (!content || content.trim().length < 20) {
    errors.content = 'المحتوى يجب أن يكون 20 حرف على الأقل';
  }
  
  if (content && content.length > 50000) {
    errors.content = 'المحتوى طويل جداً';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate comment content
 */
export function validateComment(content: string, guestName?: string): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!content || content.trim().length < 2) {
    errors.content = 'التعليق يجب أن يكون حرفين على الأقل';
  }
  
  if (content && content.length > 1000) {
    errors.content = 'التعليق طويل جداً';
  }
  
  if (guestName !== undefined) {
    if (!guestName || guestName.trim().length < 2) {
      errors.guestName = 'الاسم يجب أن يكون حرفين على الأقل';
    }
    
    if (guestName && guestName.length > 50) {
      errors.guestName = 'الاسم طويل جداً';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
