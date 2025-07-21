import { Student } from "@/models/student";
import { ModelInterceptorContract } from "cast-response";

export class StudentInterceptor implements ModelInterceptorContract<Student> {
  send(model: Partial<Student>): Partial<Student> {
    return model;
  }

  receive(model: Student): Student {
    return model;
  }
}
