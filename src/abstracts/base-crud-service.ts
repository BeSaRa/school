import { BaseCrudServiceContract } from "@/contracts/base-crud-service-contract";
import { OptionsContract } from "@/contracts/options-contract";
import { map, Observable } from "rxjs";
import { inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UrlService } from "@/services/url.service";
import { CastResponse, HasInterception, InterceptParam } from "cast-response";
import { ServiceContract } from "@/contracts/service-contract";
import { RegisterServiceMixin } from "@/mixins/register-service-mixin";

export abstract class BaseCrudService<Model, PrimaryKey = number> extends RegisterServiceMixin(class {}) implements BaseCrudServiceContract<Model, PrimaryKey>, ServiceContract {
  abstract serviceName: string;

  abstract getUrlSegment(): string;

  protected urlService = inject(UrlService);
  protected http = inject(HttpClient);

  @CastResponse()
  load(options?: OptionsContract, customLoadPath?: string): Observable<Model[]> {
    const customPath = customLoadPath ? this.urlService.addBaseUrl(customLoadPath) : undefined;

    return this.http.get<Model[]>(customPath ?? this.getUrlSegment(), {
      params: new HttpParams({
        fromObject: options as never,
      }),
    });
  }

  @CastResponse()
  @HasInterception
  create(@InterceptParam() model: Model, customPath?: string): Observable<Model> {
    const customCreatePath = customPath ? this.urlService.addBaseUrl(customPath) : undefined;
    return this.http.post<Model>(customCreatePath ?? this.getUrlSegment(), model);
  }

  @CastResponse()
  @HasInterception
  update(@InterceptParam() model: Model, customPath?: string): Observable<Model> {
    const customUpdatePath = customPath ? this.urlService.addBaseUrl(customPath) : undefined;
    return this.http.put<Model>(customUpdatePath ?? this.getUrlSegment(), model);
  }

  @CastResponse()
  delete(id: PrimaryKey): Observable<Model> {
    return this.http.delete<Model>(this.getUrlSegment() + "/" + id);
  }

  @CastResponse()
  getById(id: PrimaryKey): Observable<Model> {
    return this.http.get<Model>(this.getUrlSegment() + "/" + id);
  }

  @CastResponse()
  loadAsLookups(responseKey: string, options?: OptionsContract, customPath?: string): Observable<Model[]> {
    const customLoadLookupsPath = customPath ? this.urlService.addBaseUrl(customPath) : undefined;
    return this.http
      .get<Model[]>(customLoadLookupsPath ?? this.getUrlSegment() + "lookup", {
        params: new HttpParams({
          fromObject: options as never,
        }),
      })
      .pipe(map((response: any) => response?.[responseKey] ?? []));
  }
}
