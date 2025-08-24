import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { CastResponse, CastResponseContainer } from "cast-response";

import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Subject } from "@/models/subject";
import { OptionsContract } from "@/contracts/options-contract";

@CastResponseContainer({
  $default: {
    model: () => Subject,
  },
})
@Injectable({
  providedIn: "root",
})
export class SubjectService extends BaseCrudService<Subject> {
  override serviceName = "SubjectService";

  getUrlSegment(): string {
    return this.urlService.URLS.SUBJECTS;
  }

  @CastResponse()
  override load(options?: OptionsContract): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.getUrlSegment(), {
      params: new HttpParams({
        fromObject: options as any,
      }),
    });
  }
}
