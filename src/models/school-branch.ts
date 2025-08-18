import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { SchoolBranchInterceptor } from "@/model-interceptors/school-branch-interceptor";
import { SchoolBranchService } from "@/services/school-branch.service";
import { InterceptModel } from "cast-response";

const interceptor = new SchoolBranchInterceptor();
export const send = interceptor.send.bind(interceptor);
export const receive = interceptor.receive.bind(interceptor);
@InterceptModel({ send, receive })
export class SchoolBranch extends BaseCrudModel<SchoolBranch, SchoolBranchService> {
  override $$__service_name__$$: string = "SchoolBranchService";

  country!: string;
  city!: string;
  nameEn!: string;
  nameAr!: string;
  area!: string;
  street!: string;
  latitude!: number;
  longitude!: number;
}
