import { Staff } from "@/models/staff";
import { ModelInterceptorContract } from "cast-response";

export class StaffInterceptor implements ModelInterceptorContract<Staff> {
  send(model: Partial<Staff>): Partial<Staff> {
    delete model.$$__service_name__$$;
    return model;
  }

  receive(model: Staff): Staff {
    return model;
  }
}
