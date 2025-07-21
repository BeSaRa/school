import { Subject } from "@/models/subject";
import { ModelInterceptorContract } from "cast-response";

export class SubjectInterceptor implements ModelInterceptorContract<Subject> {
  send(model: Partial<Subject>): Partial<Subject> {
    return model;
  }

  receive(model: Subject): Subject {
    return model;
  }
}
