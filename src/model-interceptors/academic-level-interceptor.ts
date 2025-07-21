import { AcademicLevel } from "@/models/academic-level";
import { ModelInterceptorContract } from "cast-response";

export class AcademicLevelInterceptor implements ModelInterceptorContract<AcademicLevel> {
  send(model: Partial<AcademicLevel>): Partial<AcademicLevel> {
    return model;
  }

  receive(model: AcademicLevel): AcademicLevel {
    return model;
  }
}
