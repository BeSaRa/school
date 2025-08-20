import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Staff } from "@/models/staff";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";

@CastResponseContainer({
  $default: {
    model: () => Staff,
  },
})
@Injectable({
  providedIn: "root",
})
export class StaffService extends BaseCrudService<Staff> {
  override serviceName: string = "StaffService";
  override getUrlSegment(): string {
    return this.urlService.URLS.SCHOOLS;
  }
}
