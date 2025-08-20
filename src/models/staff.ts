import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { InterceptModel } from "cast-response";
import { User } from "./user";
import { School } from "./school";
import { SchoolBranch } from "./school-branch";
import { StaffInterceptor } from "@/model-interceptors/staff-interceptor";
import { StaffService } from "@/services/staff.service";

const interceptor = new StaffInterceptor();
export const send = interceptor.send.bind(interceptor);
export const receive = interceptor.receive.bind(interceptor);

@InterceptModel({ send, receive })
export class Staff extends BaseCrudModel<Staff, StaffService> {
  override $$__service_name__$$: string = "StaffService";

  role!: string;
  title!: string;
  employeeNo!: string;
  specialization!: string;
  supervisor!: boolean;
  personId!: number;
  personalInfo!: User;
  school!: School;
  schoolBranch!: SchoolBranch[];
}
