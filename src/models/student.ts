import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { StudentInterceptor } from "@/model-interceptors/student-interceptor";
import { StudentService } from "@/services/student.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new StudentInterceptor();

@InterceptModel({ send, receive })
export class Student extends BaseCrudModel<Student, StudentService> {
  override $$__service_name__$$ = "StudentService";
  studentNo!: string;
  academicLevelId!: number;
  branchId!: number;
  personId!: number;
}
