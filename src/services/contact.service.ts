import { BaseCrudService } from "@/abstracts/base-crud-service";
import { OptionsContract } from "@/contracts/options-contract";
import { Contact } from "@/models/contact";
import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CastResponse, CastResponseContainer } from "cast-response";
import { Observable } from "rxjs";

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
