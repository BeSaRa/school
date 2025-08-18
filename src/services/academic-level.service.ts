import { BaseCrudService } from "@/abstracts/base-crud-service";
import { AcademicLevel } from "@/models/academic-level";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";
import { map, Observable } from "rxjs";

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
  loadAsLookups(): Observable<{ value: number; label: string }[]> {
    return this.load().pipe(
      map((res: any) =>
        res.academicLevels.map((item: AcademicLevel) => ({
          value: item.id,
          label: item.systemNameEn,
        }))
      )
    );
  }
}
