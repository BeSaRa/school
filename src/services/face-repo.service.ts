import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UrlService } from "./url.service";
import { FaceRepoResponse, LabelSubmission, Student, UnknownFace, UnknownFaceGroup } from "@/types/face-repo.types";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class FaceRepoService {
  private urlService = inject(UrlService);
  private http = inject(HttpClient);

  private _faceRepos = signal<FaceRepoResponse>({} as FaceRepoResponse);
  private _unknownFaces = signal<UnknownFace[]>([]);
  private _currentFaceIndex = signal<number>(0);
  private _students = signal<Student[]>([]);

  readonly faceRepos = this._faceRepos.asReadonly();
  readonly unknownFaces = this._unknownFaces.asReadonly();
  readonly currentFaceIndex = this._currentFaceIndex.asReadonly();
  readonly students = this._students.asReadonly();

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

  loadUnknowns() {
    return this.http
      .get<{ unknown: UnknownFaceGroup[] }>(`${this.getUrlSegment()}unknown`, {
        params: { photo_ret_type: "data_url" },
      })
      .pipe(
        map((response) => {
          const groups = response.unknown || [];
          const flatFaces = groups.flatMap((g) => g.unknownStudentsRepos || []);
          this._unknownFaces.set(flatFaces);
          this._currentFaceIndex.set(0);
        })
      );
  }

  loadStudents(classId?: string) {
    const options = classId ? { params: { class_id: classId } } : {};

    return this.http.get<{ students: Student[] }>(`${this.getUrlSegment()}students`, options).pipe(
      map((res) => {
        this._students.set(res.students || []);
      })
    );
  }

  submitLabel(label: LabelSubmission) {
    return this.http.post(`${this.getUrlSegment()}label`, label);
  }

  nextFace() {
    const currentIndex = this._currentFaceIndex();
    if (currentIndex < this._unknownFaces().length - 1) {
      this._currentFaceIndex.set(currentIndex + 1);
    }
  }

  previousFace() {
    const currentIndex = this._currentFaceIndex();
    if (currentIndex > 0) {
      this._currentFaceIndex.set(currentIndex - 1);
    }
  }
}
