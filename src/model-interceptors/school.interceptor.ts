import { ModelInterceptorContract } from "cast-response";
import { School } from "@/models/school";
import { GeneralInterceptor } from "@/model-interceptors/general-interceptor";

/**
 * Interceptor for School model data transformation
 * Handles sanitization and formatting of school-related data
 */
export class SchoolInterceptor extends GeneralInterceptor {
  /**
   * Transforms school data after receiving from the server
   * Sanitizes and formats various fields including contact info and coordinates
   * @param model - The school model data to transform
   * @returns Transformed school data
   */
  override receive(model: School): School {
    if (!model) return model;

    // Sanitize basic fields
    if (model.name) {
      model.name = model.name.trim();
    }

    // Handle contact information
    if (model.contact) {
      if (model.contact.email) {
        model.contact.email = model.contact.email.toLowerCase().trim();
      }
      if (model.contact.website) {
        model.contact.website = this.sanitizeUrl(model.contact.website);
      }
      if (model.contact.phone) {
        model.contact.phone = this.sanitizePhone(model.contact.phone);
      }
    }

    // Handle location coordinates
    if (model.location?.coordinate) {
      model.location.coordinate.latitude = Number(
        model.location.coordinate.latitude
      );
      model.location.coordinate.longitude = Number(
        model.location.coordinate.longitude
      );
    }

    return model;
  }

  /**
   * Transforms school data before sending to the server
   * Sanitizes and formats various fields including contact info and coordinates
   * @param model - The school model data to transform
   * @returns Transformed school data
   */
  override send(model: Partial<School>): Partial<School> {
    if (!model) return model;

    const sanitizedModel = { ...model };

    // Sanitize and format basic school information
    if (sanitizedModel.name) {
      sanitizedModel.name = sanitizedModel.name.trim();
    }

    // Format and validate contact information
    if (sanitizedModel.contact) {
      if (sanitizedModel.contact.website) {
        sanitizedModel.contact.website = this.formatWebsite(
          sanitizedModel.contact.website
        );
      }
      if (sanitizedModel.contact.phone) {
        sanitizedModel.contact.phone = this.formatPhoneNumber(
          sanitizedModel.contact.phone
        );
      }
      if (sanitizedModel.contact.email) {
        sanitizedModel.contact.email = sanitizedModel.contact.email
          .toLowerCase()
          .trim();
      }
    }

    // Ensure location coordinates are properly formatted
    if (sanitizedModel.location?.coordinate) {
      sanitizedModel.location.coordinate = {
        ...sanitizedModel.location.coordinate,
        latitude: Number(sanitizedModel.location.coordinate.latitude),
        longitude: Number(sanitizedModel.location.coordinate.longitude),
      };
    }

    return sanitizedModel;
  }

  /**
   * Formats a website URL to ensure it has the proper protocol
   * @param url - The website URL to format
   * @returns Formatted website URL
   */
  private formatWebsite(url: string): string {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  }

  /**
   * Formats a phone number by removing non-numeric characters
   * Preserves the + symbol for international numbers
   * @param phone - The phone number to format
   * @returns Formatted phone number
   */
  private formatPhoneNumber(phone: string): string {
    return phone.replace(/[^\d+]/g, "");
  }

  private sanitizeUrl(url: string): string {
    if (!url) return url;
    url = url.trim().toLowerCase();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    return url;
  }

  private sanitizePhone(phone: string): string {
    if (!phone) return phone;
    // Remove all non-numeric characters except + (for international numbers)
    return phone.replace(/[^\d+]/g, "");
  }
}
