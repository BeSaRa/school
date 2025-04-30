import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseCrudService } from "@/abstracts/base-crud-service";

import { School } from "@/models/school";
import { CastResponseContainer } from "cast-response";

@CastResponseContainer({
  $default: {
    model: () => School,
  },
})
@Injectable({
  providedIn: "root",
})
export class SchoolService extends BaseCrudService<School> {
  override serviceName: string = "schoolService";
  override getUrlSegment(): string {
    return this.urlService.URLS.SCHOOLS;
  }
}
