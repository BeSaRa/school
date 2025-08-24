import { Course } from "@/models/course";
import { ModelInterceptorContract } from "cast-response";

export class CourseInterceptor implements ModelInterceptorContract<Course> {
  send(model: Partial<Course>): Partial<Course> {
    return model;
  }

  receive(model: Course): Course {
    return model;
  }
}
