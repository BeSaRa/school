import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { UserInterceptor } from "@/model-interceptors/user-interceptor";
import { UserService } from "@/services/user.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new UserInterceptor();

@InterceptModel({ send, receive })
export class User extends BaseCrudModel<User, UserService> {
  override $$__service_name__$$: string = "UserService";
  email!: string;
  password!: string;
  fullName!: string;
  isActive!: boolean;
  role!: string;
}
