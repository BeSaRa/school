// lookup.service.ts
import { Injectable } from "@angular/core";
import { LocalService } from "./local.service";
import { LangKeysContract } from "@/types/localization.types";

export interface LookupItem {
  value: string;
  label: keyof LangKeysContract;
}

export interface LookupMap {
  religious_affiliation: LookupItem[];
  education_level: LookupItem[];
  school_type: LookupItem[];
  gender: LookupItem[];
  visionProvider: LookupItem[];
  storageProvider: LookupItem[];
  role: LookupItem[];
}

@Injectable({ providedIn: "root" })
export class LookupService {
  lookups: LookupMap;

  constructor(private localService: LocalService) {
    this.lookups = {
      religious_affiliation: [
        { value: "catholic", label: "religious_affiliation_catholic" },
        { value: "islamic", label: "religious_affiliation_islamic" },
        { value: "christian", label: "religious_affiliation_christian" },
        { value: "jewish", label: "religious_affiliation_jewish" },
        { value: "other", label: "religious_affiliation_other" },
      ],
      education_level: [
        { value: "all", label: "education_level_all" },
        { value: "elementary", label: "education_level_elementary" },
        { value: "middle", label: "education_level_middle" },
        { value: "secondary", label: "education_level_secondary" },
        { value: "higher", label: "education_level_higher" },
      ],
      school_type: [
        { value: "public", label: "school_type_public" },
        { value: "private", label: "school_type_private" },
        { value: "international", label: "school_type_international" },
        { value: "religious", label: "school_type_religious" },
        { value: "independent", label: "school_type_independent" },
      ],
      gender: [
        { value: "boys", label: "gender_boys" },
        { value: "girls", label: "gender_girls" },
        { value: "mixed", label: "gender_mixed" },
      ],
      visionProvider: [
        { value: "azure", label: "azure" },
        { value: "custom", label: "custom" },
      ],
      storageProvider: [
        { value: "azure", label: "azure" },
        { value: "local", label: "local" },
      ],
      role: [
        { value: "student", label: "role_student" },
        { value: "supervisor", label: "role_supervisor" },
        { value: "teacher", label: "role_teacher" },
        { value: "superuser", label: "role_superuser" },
      ],
    };
  }
}
