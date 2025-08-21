import { Injectable } from "@angular/core";
import { CastResponseContainer } from "cast-response";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { Guardian } from "@/models/guardian";

@CastResponseContainer({ $default: { model: () => Guardian } })
@Injectable({ providedIn: "root" })
export class GuardianService extends BaseCrudService<Guardian> {
  override serviceName = "GuardianService";

  getUrlSegment(): string {
    return this.urlService.URLS.GUARDIANS;
  }
}
