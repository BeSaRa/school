import { Observable } from "rxjs";
import { OptionsContract } from "@/contracts/options-contract";

export interface BaseCrudServiceContract<Model, PrimaryKeyType = number> {
  getUrlSegment(): string;

  load(options?: OptionsContract, customLoadPath?: string): Observable<Model[]>;

  loadAsLookups(responseKey: string, options?: OptionsContract, customLoadLookupsPath?: string): Observable<Model[]>;

  create(model: Model, customPath?: string): Observable<Model>;

  update(model: Model, customPath?: string): Observable<Model>;

  delete(id: PrimaryKeyType): Observable<Model>;

  getById(id: PrimaryKeyType): Observable<Model>;
}
