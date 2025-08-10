import { Injectable } from "@angular/core";
import { BaseCrudService } from "@/abstracts/base-crud-service";

import { School } from "@/models/school";
import { CastResponseContainer } from "cast-response";
import { map, Observable } from "rxjs";

@CastResponseContainer({
  $default: {
    model: () => School,
  },
})
@Injectable({
  providedIn: "root",
})
export class SchoolService extends BaseCrudService<School> {
  override serviceName: string = "SchoolService";
  override getUrlSegment(): string {
    return this.urlService.URLS.SCHOOLS;
  }
  loadAsLookups(): Observable<{ value: number; label: string }[]> {
    return this.load().pipe(
      map((res: any) =>
        res.schools.map((item: School) => ({
          value: item.id,
          label: item.nameAr,
        }))
      )
    );
  }
}
