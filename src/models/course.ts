import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { CourseInterceptor } from "@/model-interceptors/course-interceptor";
import { CourseService } from "@/services/course.service";

import { InterceptModel } from "cast-response";

const { send, receive } = new CourseInterceptor();

@InterceptModel({ send, receive })
export class Course extends BaseCrudModel<Course, CourseService> {
  override $$__service_name__$$ = "CourseService";
  courseNo!: string;
  description!: string;
  subjectId!: number;
  academicLevelId!: number;
  teacherId!: number;
}
