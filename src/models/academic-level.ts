import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { AcademicLevelInterceptor } from "@/model-interceptors/academic-level-interceptor";
import { AcademicLevelService } from "@/services/academic-level.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new AcademicLevelInterceptor();

@InterceptModel({ send, receive })
export class AcademicLevel extends BaseCrudModel<AcademicLevel, AcademicLevelService> {
  override $$__service_name__$$ = "AcademicLevelService";
  educationType!: "elementry" | "middle" | "secondary" | "higher";
  systemNameEn!: string;
  systemNameAr!: string;
  levelCode!: string;
  levelOrder!: number;
  createdBy!: number;
}
