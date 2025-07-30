import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { SourceInterceptor } from "@/model-interceptors/source-interceptor";
import { SourceService } from "@/services/source.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new SourceInterceptor();

@InterceptModel({ send, receive })
export class Source extends BaseCrudModel<Source, SourceService> {
  override $$__service_name__$$ = "SourceService";
  source!: string;
  sourceType!: "path" | "index";
  nameEn!: string;
  nameAr!: string;
}
