import { ModelInterceptorContract } from "cast-response";
import { School } from "@/models/school";

export class SchoolInterceptor implements ModelInterceptorContract<School> {
  receive(model: School): School {
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

  send(model: Partial<School>): Partial<School> {
    if (!model) return model;

    const sanitizedModel = { ...model };

    // Ensure coordinates are numbers before sending
    if (sanitizedModel.location?.coordinate) {
      sanitizedModel.location.coordinate.latitude = Number(
        sanitizedModel.location.coordinate.latitude
      );
      sanitizedModel.location.coordinate.longitude = Number(
        sanitizedModel.location.coordinate.longitude
      );
    }

    return sanitizedModel;
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
