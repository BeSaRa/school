import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { SubjectInterceptor } from "@/model-interceptors/subject-interceptor";
import { SubjectService } from "@/services/subject.service";

import { InterceptModel } from "cast-response";

const { send, receive } = new SubjectInterceptor();

@InterceptModel({ send, receive })
export class Subject extends BaseCrudModel<Subject, SubjectService> {
  override $$__service_name__$$ = "SubjectService";
  nameEn!: string;
  nameAr!: string;
  createdBy!: number;
}
