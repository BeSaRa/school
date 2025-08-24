import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Contact } from "@/models/contact";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";

@CastResponseContainer({
  $default: {
    model: () => Contact,
  },
})
@Injectable({
  providedIn: "root",
})
export class ContactService extends BaseCrudService<Contact> {
  override serviceName: string = "ContactService";

  getUrlSegment(): string {
    return this.urlService.URLS.CONTACTS;
  }
}
