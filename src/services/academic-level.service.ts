import { BaseCrudService } from "@/abstracts/base-crud-service";
import { AcademicLevel } from "@/models/academic-level";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";

@CastResponseContainer({
  $default: {
    model: () => AcademicLevel,
  },
})
@Injectable({
  providedIn: "root",
})
export class AcademicLevelService extends BaseCrudService<AcademicLevel> {
  override serviceName: string = "AcademicLevelService";

  getUrlSegment(): string {
    return this.urlService.URLS.ACADEMIC_LEVEL;
  }
}
