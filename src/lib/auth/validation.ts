/**
 * Authentication Input Validation & Sanitization Helpers
 */

export type NameValidationResult = {
  isValid: boolean;
  error?: string;
};

export function validateName(name: string): NameValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: "Name is required." };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "Name must contain at least 2 characters." };
  }
  if (trimmed.length > 80) {
    return { isValid: false, error: "Name cannot exceed 80 characters." };
  }
  return { isValid: true };
}

export type EmailValidationResult = {
  isValid: boolean;
  error?: string;
};

export function validateEmail(email: string): EmailValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: "Email is required." };
  }
  // Robust email pattern check preventing abc, abc@, @gmail.com, test@gmail
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Enter a valid email address." };
  }
  return { isValid: true };
}

export type PasswordChecks = {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
};

export type PasswordValidationResult = {
  isValid: boolean;
  checks: PasswordChecks;
  error?: string;
};

export function validatePassword(password: string): PasswordValidationResult {
  const checks: PasswordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isValid = checks.length && checks.uppercase && checks.lowercase && checks.number;

  let error: string | undefined = undefined;
  if (!checks.length) {
    error = "Password must be at least 8 characters long.";
  } else if (!checks.uppercase) {
    error = "Password must contain at least one uppercase letter.";
  } else if (!checks.lowercase) {
    error = "Password must contain at least one lowercase letter.";
  } else if (!checks.number) {
    error = "Password must contain at least one number.";
  }

  return { isValid, checks, error };
}

export type ConfirmPasswordValidationResult = {
  isValid: boolean;
  error?: string;
};

export function validateConfirmPassword(password: string, confirmPassword: string): ConfirmPasswordValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match." };
  }
  return { isValid: true };
}

/**
 * Sanitizes redirect URLs to ensure only internal relative application paths are allowed.
 * Prevents open-redirect vulnerabilities.
 */
export function sanitizeReturnTo(target?: string | null, fallback = "/dashboard"): string {
  if (!target) return fallback;
  const trimmed = target.trim();
  // Must start with '/' and not '//' or '/\' to avoid scheme-relative or protocol bypasses
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return trimmed;
  }
  return fallback;
}
