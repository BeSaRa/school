import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { StudentInterceptor } from "@/model-interceptors/student-interceptor";
import { StudentService } from "@/services/student.service";
import { InterceptModel } from "cast-response";
import { AcademicLevel } from "./academic-level";
import { School } from "./school";
import { SchoolBranch } from "@/types/face-repo.types";

const { send, receive } = new StudentInterceptor();

@InterceptModel({ send, receive })
export class Student extends BaseCrudModel<Student, StudentService> {
  override $$__service_name__$$ = "StudentService";
  studentNo!: string;
  academicLevelId!: number;
  personId!: number;
  personalInfo!: {
    gender: string;
    dateOfBirth: string;
    nameEn: string;
    nameAr: string;
    username: string;
    isActive: boolean;
    isDeleted: boolean;
    personalAgentName: string;
  };
  academicLevel!: AcademicLevel;
  school!: School;
  schoolBranch!: SchoolBranch;
}
