import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { UserInterceptor } from "@/model-interceptors/user-interceptor";
import { UserService } from "@/services/user.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new UserInterceptor();

@InterceptModel({ send, receive })
export class User extends BaseCrudModel<User, UserService> {
  override $$__service_name__$$: string = "UserService";

  schoolId!: number;
  role!: string;
  description!: string;
  isSystemRole!: boolean;
  dateOfBirth!: string;
  gender!: "male" | "female";
  username!: string;
  isActive!: boolean;
  isDeleted!: boolean;
  password!: string;
  contactId!: number;
  personalAgentName?: string;
}
