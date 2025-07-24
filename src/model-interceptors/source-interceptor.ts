import { Source } from "@/models/source";
import { ModelInterceptorContract } from "cast-response";

export class SourceInterceptor implements ModelInterceptorContract<Source> {
  send(model: Partial<Source>): Partial<Source> {
    return model;
  }

  receive(model: Source): Source {
    return model;
  }
}
