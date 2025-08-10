import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Contact } from "@/models/contact";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";
import { map, Observable } from "rxjs";

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
  loadAsLookups(): Observable<{ value: number; label: string }[]> {
    return this.load().pipe(
      map((res: any) =>
        res.contacts.map((item: Contact) => ({
          value: item.id,
          label: item.contact,
        }))
      )
    );
  }
}
