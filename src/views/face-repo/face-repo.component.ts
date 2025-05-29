import { Component, effect, inject } from "@angular/core";
import { FaceRepoService } from "@/services/face-repo.service";

@Component({
  selector: "app-face-repo",
  standalone: true,
  templateUrl: "./face-repo.component.html",
})
export class FaceRepoComponent {
  private service = inject(FaceRepoService);
  readonly repos = this.service.repos;

  constructor() {
    effect(() => {
      this.service.loadRepos();
    });
  }
}
