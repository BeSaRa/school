import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Source } from "@/models/source";

@CastResponseContainer({ $default: { model: () => Source } })
@Injectable({ providedIn: "root" })
export class SourceService extends BaseCrudService<Source> {
  override serviceName = "SourceService";

  getUrlSegment(): string {
    return this.urlService.URLS.SOURCES;
  }
}
