import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Timetable } from "@/models/timetable";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";

@CastResponseContainer({
  $default: {
    model: () => Timetable,
  },
})
@Injectable({
  providedIn: "root",
})
export class TimetableService extends BaseCrudService<Timetable> {
  override serviceName = "TimetableService";

  getUrlSegment(): string {
    return this.urlService.URLS.TIMETABLE;
  }
}
