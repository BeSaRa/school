import { Injectable } from "@angular/core";
import { BaseCrudService } from "@/abstracts/base-crud-service";

import { School } from "@/models/school";
import { CastResponseContainer } from "cast-response";
import { map, Observable } from "rxjs";
import { SchoolBranch } from "@/models/school-branch";
import { Staff } from "@/models/staff";
import { LookupItem } from "./lookup.service";

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
  loadStaffsAsLookups(): Observable<LookupItem[]> {
    return this.loadAsLookups("staffs", undefined, "schools/staff/lookup");
  }
  loadBranchesAsLookup(schoolId: number): Observable<LookupItem[]> {
    return this.loadAsLookups("branches", undefined, `schools/${schoolId}/branches/lookup`);
  }
}
