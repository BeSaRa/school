import { GeneralInterceptorContract } from "cast-response";

export class GeneralInterceptor implements GeneralInterceptorContract {
  send(model: Partial<any>): Partial<any> {
    console.log("GeneralInterceptor send called", model); // Log here
    delete model["$$__service_name__$$"];
    return model;
  }

  receive(model: any) {
    console.log("GeneralInterceptor receive called", model); // Log here
    return model;
  }
}
