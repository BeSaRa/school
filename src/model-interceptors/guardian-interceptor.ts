import { Guardian } from "@/models/guardian";
import { ModelInterceptorContract } from "cast-response";

export class GuardianInterceptor implements ModelInterceptorContract<Guardian> {
  send(model: Partial<Guardian>): Partial<Guardian> {
    return model;
  }

  receive(model: Guardian): Guardian {
    return model;
  }
}
