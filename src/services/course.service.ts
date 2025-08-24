import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Course } from "@/models/course";
import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";

@CastResponseContainer({
  $default: {
    model: () => Course,
  },
})
@Injectable({
  providedIn: "root",
})
export class CourseService extends BaseCrudService<Course> {
  override serviceName = "CourseService";

  getUrlSegment(): string {
    return this.urlService.URLS.COURSES;
  }
}
