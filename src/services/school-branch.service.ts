import { BaseCrudService } from "@/abstracts/base-crud-service";
import { SchoolBranch } from "@/models/school-branch";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";
import { map, Observable } from "rxjs";

@CastResponseContainer({
  $default: {
    model: () => SchoolBranch,
  },
})
@Injectable({
  providedIn: "root",
})
export class SchoolBranchService extends BaseCrudService<SchoolBranch> {
  override serviceName: string = "SchoolBranchService";
  override getUrlSegment(): string {
    return this.urlService.URLS.SCHOOLS;
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
