import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { signal, computed } from "@angular/core";
import { FaceRepository } from "@/types/face-repo.types";
import { DialogService } from "./dialog.service";
import { UrlService } from "./url.service";

@Injectable({ providedIn: "root" })
export class FaceRepoService {
  serviceName: string = "UserService";
  private readonly dialogService = inject(DialogService);
  private http = inject(HttpClient);
  private urlService = inject(UrlService);

  private readonly _repos = signal<FaceRepository[]>([]);
  readonly repos = computed(() => this._repos());

  getUrlSegment(): string {
    return this.urlService.URLS.FACE_REPOSITORY;
  }

  loadRepos() {
    this.http.get<FaceRepository[]>(`${this.getUrlSegment}`).subscribe({
      next: (data) => this._repos.set(data),
      error: (err) =>
        this.dialogService.error(
          "Error Loading Repositories",
          "Failed to load face repositories. Please try again later."
        ),
    });
  }
}
