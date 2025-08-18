import { SchoolBranch } from "@/models/school-branch";
import { ModelInterceptorContract } from "cast-response";

export class SchoolBranchInterceptor implements ModelInterceptorContract<SchoolBranch> {
  send(model: Partial<SchoolBranch>): Partial<SchoolBranch> {
    return model;
  }

  receive(model: SchoolBranch): SchoolBranch {
    return model;
  }
}
