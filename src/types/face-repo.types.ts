import { AcademicLevel } from "@/models/academic-level";

export enum PhotoType {
  PATH = "path",
  BASE64 = "base64",
  DATA_URL = "dataUrl",
}

export interface FaceRepoResponse {
  classes: ClassRepo[];
}

export interface ClassRepo {
  classNo: string;
  studentRepos: StudentRepo[];
  teacherRepos?: TeacherRepo[];
}

export interface StudentRepo {
  student: Student;
  photos: string[];
}

export interface TeacherRepo {
  teacher: Teacher;
  photos: PhotoType[];
}

export interface Student {
  id: number;
  studentNo: string;
  personalInfo: PersonalInfo;
  guardians: any[];
  academicLevel: AcademicLevel;
  school: School;
  schoolBranch: SchoolBranch;
}

export interface PersonalInfo {
  id: number;
  nameEn: string;
  nameAr: string;
  username: string;
  dateOfBirth: string | null;
  gender: string | null;
  personalAgentName: string;
  contact: any;
  createdBy: number;
  isActive: boolean;
  isDeleted: boolean;
}

// export interface AcademicLevel {
//   id: number;
//   educationType: string;
//   systemNameEn: string;
//   systemNameAr: string;
//   levelCode: string;
//   levelOrder: number;
//   createdBy: number;
// }

export interface School {
  id: number;
  category: string;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string | null;
  contact: SchoolContact;
}

export interface SchoolContact {
  id: number;
  type: string;
  contact: string;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface SchoolBranch {
  id: number;
  country: string;
  city: string;
  area: string | null;
  street: string | null;
  latitude: number | null;
  longitude: number | null;
}
export interface ClassRoom {
  id: number;
  classNo: string;
}
export interface Teacher {
  teacherNo: string;
}
export interface LabelSubmission {
  studentNo: string;
  photoName: string;
}
export interface UnknownFaceGroup {
  classNo: string;
  unknownStudentsRepos: UnknownFace[];
}
export interface UnknownFace {
  photoName: string;
  photo: string;
}
