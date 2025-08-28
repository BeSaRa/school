import { Injectable } from "@angular/core";
import { BaseCrudService } from "@/abstracts/base-crud-service";

import { School } from "@/models/school";
import { CastResponseContainer } from "cast-response";
import { Observable } from "rxjs";
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
  loadClassRoomsAsLookups(schoolId: number, branchId: number): Observable<LookupItem[]> {
    return this.loadAsLookups("classrooms", undefined, `schools/${schoolId}/branches/${branchId}/classrooms/lookup`);
  }
}
