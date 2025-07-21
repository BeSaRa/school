import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Student } from "@/models/student";

@CastResponseContainer({ $default: { model: () => Student } })
@Injectable({ providedIn: "root" })
export class StudentService extends BaseCrudService<Student> {
  override serviceName = "StudentService";

  getUrlSegment(): string {
    return this.urlService.URLS.STUDENTS;
  }
}
