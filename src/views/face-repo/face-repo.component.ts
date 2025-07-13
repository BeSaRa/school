import { FaceRepoService } from "@/services/face-repo.service";
import { LocalService } from "@/services/local.service";
import { FaceRepoResponse, Student } from "@/types/face-repo.types";
import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { map, Observable } from "rxjs";
import { IconService } from "../../services/icon.service";

@Component({
  selector: "app-face-repo",
  imports: [CommonModule, IconService],
  templateUrl: "./face-repo.component.html",
})
export class FaceRepoComponent implements OnInit {
  readonly faceRepoService = inject(FaceRepoService);
  localService = inject(LocalService);
  classes$!: Observable<FaceRepoResponse["classes"]>;
  searchQuery = signal<string>("");
  selectedStudent = signal<Student | null>(null);
  activeTab = signal<"face_repository" | "student_identification">("face_repository");
  selectedImage = signal<string | null>(null);

  ngOnInit(): void {
    this.faceRepoService.loadUnknowns().subscribe();
    this.faceRepoService.loadStudents().subscribe();
    this.classes$ = this.faceRepoService.loadFaceRepos().pipe(map(() => this.faceRepoService.faceRepos().classes));
  }

  currentFace = computed(() => {
    const faces = this.faceRepoService.unknownFaces();
    const index = this.faceRepoService.currentFaceIndex();
    return faces[index];
  });

  filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const students = this.faceRepoService.students();

    if (!Array.isArray(students) || !students.length) return [];

    return students.filter((student) => student.studentNo.toLowerCase().includes(query) || student.personalInfo.nameEn.toLowerCase().includes(query) || student.personalInfo.nameAr.includes(query));
  });

  progress = computed(() => {
    const total = this.faceRepoService.unknownFaces().length;
    const current = this.faceRepoService.currentFaceIndex() + 1;
    return `${this.localService.locals().face} ${current} ${this.localService.locals().of} ${total}`;
  });

  constructor() {
    effect(() => {
      this.currentFace();
      this.selectedStudent.set(null);
    });
  }

  async confirmLabel() {
    const student = this.selectedStudent();
    const face = this.currentFace();

    if (!student || !face) return;

    try {
      await this.faceRepoService
        .submitLabel({
          studentNo: student.studentNo,
          photoName: face.photoName,
        })
        .toPromise();

      this.faceRepoService.nextFace();
    } catch (error) {
      console.error("Failed to submit label:", error);
    }
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  selectStudent(student: Student) {
    this.selectedStudent.set(student);
  }

  openImageModal(photo: string) {
    this.selectedImage.set(photo);
  }

  closeImageModal() {
    this.selectedImage.set(null);
  }

  previousFace() {
    this.faceRepoService.previousFace();
  }

  nextFace() {
    this.faceRepoService.nextFace();
  }
}
