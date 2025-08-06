export class Patterns {
  /** English letters (A-Z, a-z), optional spaces */
  static readonly ENGLISH_ONLY = /^[A-Za-z\s]+$/;

  /** English letters and numbers */
  static readonly ENGLISH_ALPHANUMERIC = /^[A-Za-z0-9\s]+$/;

  /** Email format (simplified) */
  static readonly EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /** Phone number (digits only, 10–15 digits) */
  static readonly PHONE = /^\d{10,15}$/;

  /** Only Arabic letters (with optional spaces) */
  static readonly ARABIC_ONLY = /^[\u0600-\u06FF\s]+$/;

  /** English and Arabic letters only (with optional spaces) */
  static readonly EN_AR_LETTERS = /^[A-Za-z\u0600-\u06FF\s]+$/;

  /**
   * Username pattern:
   * - Allows English letters (A-Z, a-z)
   * - Allows numbers (0-9)
   * - Allows underscore (_)
   * - No spaces or special characters
   * - Length: 4 to 20 characters
   */
  static readonly USERNAME = /^[a-zA-Z0-9_]{4,20}$/;

  /**
   * Password pattern:
   * - Minimum 8 characters
   * - At least one lowercase letter (a-z)
   * - At least one uppercase letter (A-Z)
   * - At least one digit (0-9)
   * - Allows special characters (@$!%*?&)
   * - No spaces
   */
  static readonly PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
}
