export enum PhotoType {
  PATH = "path",
  BASE64 = "base64",
  DATA_URL = "dataUrl",
}

export interface FaceRepoResponse {
  classes: {
    class_no: string;
    student_repos: {
      person_no: string;
      photos: PhotoType[];
    }[];
    teacher_repos?: {
      person_no: string;
      photos: PhotoType[];
    }[];
  }[];
}
