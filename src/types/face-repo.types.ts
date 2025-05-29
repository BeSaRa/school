export enum PhotoType {
  PATH = "path",
  BASE64 = "base64",
  DATA_URL = "dataUrl",
}

export interface FaceRepository {
  id: string;
  name: string;
  type: "student" | "teacher";
  photo: PhotoType;
}
