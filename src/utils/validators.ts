/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number (Spanish format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+34|0034|34)?[6-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Validate integer
 */
export const isInteger = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num);
};

/**
 * Validate date is not in the future
 */
export const isNotFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date <= now;
};

/**
 * Validate age range
 */
export const isValidAge = (birthDate: string): boolean => {
  const birth = new Date(birthDate);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  return age >= 14 && age <= 120;
};

/**
 * Validate height (cm)
 */
export const isValidHeight = (height: number): boolean => {
  return height >= 100 && height <= 250;
};

/**
 * Validate weight (kg)
 */
export const isValidWeight = (weight: number): boolean => {
  return weight >= 30 && weight <= 300;
};

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
