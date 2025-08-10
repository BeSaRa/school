import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { InterceptModel } from "cast-response";
import { SchoolService } from "@/services/school.service";
import { SchoolInterceptor } from "@/model-interceptors/school.interceptor";
import { Contact } from "./contact";
import { AcademicLevel } from "./academic-level";
import { ClassRoom, SchoolBranch } from "@/types/face-repo.types";

const interceptor = new SchoolInterceptor();
export const send = interceptor.send.bind(interceptor);
export const receive = interceptor.receive.bind(interceptor);
@InterceptModel({ send, receive })
export class School extends BaseCrudModel<School, SchoolService> {
  override $$__service_name__$$: string = "SchoolService";

  category!: "public" | "private" | "international" | "religious" | "independent";
  nameEn!: string;
  nameAr!: string;
  isActive!: boolean;
  isDeleted!: boolean;
  contact!: Contact;
  academicLevels!: AcademicLevel[];
  branches!: SchoolBranch[];
  classrooms!: ClassRoom[];
}
