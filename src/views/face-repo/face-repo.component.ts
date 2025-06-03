import { FaceRepoService } from "@/services/face-repo.service";
import { FaceRepoResponse } from "@/types/face-repo.types";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-face-repo",
  imports: [CommonModule],
  templateUrl: "./face-repo.component.html",
})
export class FaceRepoComponent implements OnInit {
  private readonly faceRepoService = inject(FaceRepoService);
  classes$!: Observable<FaceRepoResponse["classes"]>;

  ngOnInit(): void {
    this.classes$ = this.faceRepoService
      .loadFaceRepos()
      .pipe(map(() => this.faceRepoService.faceRepos().classes));
  }
  selectedImage: string | null = null;

  openImageModal(photo: string) {
    this.selectedImage = photo;
  }

  closeImageModal() {
    this.selectedImage = null;
  }
}
