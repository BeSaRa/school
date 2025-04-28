import { GeneralInterceptorContract } from "cast-response";

/**
 * General interceptor for handling model transformations
 * Provides base functionality for model serialization/deserialization
 */
export class GeneralInterceptor implements GeneralInterceptorContract {
  /**
   * Transforms model data before sending to the server
   * @param model - The model data to transform
   * @returns Transformed model data
   */
  send(model: Partial<any>): Partial<any> {
    return model;
  }

  /**
   * Transforms model data after receiving from the server
   * @param model - The model data to transform
   * @returns Transformed model data
   */
  receive(model: any) {
    return model;
  }
}
