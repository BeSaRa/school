import { User } from "@/models/user";
import { ModelInterceptorContract } from "cast-response";

export class UserInterceptor implements ModelInterceptorContract<User> {
  send(model: Partial<User>): Partial<User> {
    return model;
  }

  receive(model: User): User {
    return model;
  }
}
