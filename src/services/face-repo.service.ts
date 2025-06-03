import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "./url.service";
import { FaceRepoResponse } from "@/types/face-repo.types";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class FaceRepoService {
  private urlService = inject(UrlService);
  private http = inject(HttpClient);
  private _faceRepos = signal<FaceRepoResponse>({} as FaceRepoResponse);
  readonly faceRepos = this._faceRepos.asReadonly();

  getUrlSegment(): string {
    return this.urlService.URLS.FACE_REPO;
  }

  loadFaceRepos(photo_ret_type: string = "data_url") {
    return this.http
      .get<FaceRepoResponse>(`${this.getUrlSegment()}`, {
        params: { photo_ret_type },
      })
      .pipe(
        map((data) => {
          this._faceRepos.set(data);
        })
      );
  }
}
