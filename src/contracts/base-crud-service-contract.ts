import { Observable } from "rxjs";
import { OptionsContract } from "@/contracts/options-contract";
import { LookupItem } from "@/services/lookup.service";

export interface BaseCrudServiceContract<Model, PrimaryKeyType = number> {
  getUrlSegment(): string;

  load(options?: OptionsContract, customLoadPath?: string): Observable<Model[]>;

  loadAsLookups(responseKey: string, options?: OptionsContract, customLoadLookupsPath?: string): Observable<LookupItem[]>;

  create(model: Model, customPath?: string): Observable<Model>;

  update(model: Model, customPath?: string): Observable<Model>;

  delete(id: PrimaryKeyType): Observable<Model>;

  getById(id: PrimaryKeyType): Observable<Model>;
}
