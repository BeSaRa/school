import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { UserInterceptor } from "@/model-interceptors/user-interceptor";
import { UserService } from "@/services/user.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new UserInterceptor();

@InterceptModel({ send, receive })
export class User extends BaseCrudModel<User, UserService> {
  override $$__service_name__$$: string = "UserService";
  nameEn!: string;
  nameAr!: string;
  isActive!: boolean;
  isDeleted!: boolean;
  dateOfBirth!: string;
  gender!: boolean;
  username!: string;
  createdBy!: number;
  contact!: string;
  personalAgentName!: string;
}
