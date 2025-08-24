import { Injectable } from "@angular/core";
import { BaseCrudService } from "@/abstracts/base-crud-service";

import { School } from "@/models/school";
import { CastResponseContainer } from "cast-response";
import { map, Observable } from "rxjs";
import { SchoolBranch } from "@/models/school-branch";
import { Staff } from "@/models/staff";

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
  loadStaffsAsLookups(): Observable<{ value: number; label: string }[]> {
    return this.load(undefined, `schools/staff`).pipe(
      map((res: any) =>
        res.staffs.map((item: Staff) => ({
          value: item.id,
          label: item.personalInfo.nameAr,
        }))
      )
    );
  }
  loadBranchesAsLookup(schoolId: number): Observable<{ value: number; label: string }[]> {
    return this.load(undefined, `schools/${schoolId}/branches`).pipe(
      map((res: any) =>
        res.branches.map((item: SchoolBranch) => ({
          value: item.id,
          label: `${item.country} - ${item.city} - ${item.area}`,
        }))
      )
    );
  }
}
