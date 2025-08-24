import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { GuardianInterceptor } from "@/model-interceptors/guardian-interceptor";
import { GuardianService } from "@/services/guardian.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new GuardianInterceptor();

@InterceptModel({ send, receive })
export class Guardian extends BaseCrudModel<Guardian, GuardianService> {
  override $$__service_name__$$ = "GuardianService";
  relation!: string;
  dateOfBirth!: string;
  gender!: string;
  username!: string;
  password!: string;
  isDeleted!: boolean;
  isActive!: boolean;
  contactId!: number;
}
