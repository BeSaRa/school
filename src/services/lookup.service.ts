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
  school_type: LookupItem[];
  gender: LookupItem[];
  visionProvider: LookupItem[];
  storageProvider: LookupItem[];
  role: LookupItem[];
  contact_type: LookupItem[];
  education_type: LookupItem[];
  source_type: LookupItem[];
  relation_options: LookupItem[];
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
      school_type: [
        { value: "public", label: "school_type_public" },
        { value: "private", label: "school_type_private" },
        { value: "international", label: "school_type_international" },
        { value: "religious", label: "school_type_religious" },
        { value: "independent", label: "school_type_independent" },
      ],
      gender: [
        { value: "male", label: "male" },
        { value: "female", label: "female" },
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
      contact_type: [
        { value: "email", label: "email" },
        { value: "mobile", label: "mobile" },
        { value: "phone", label: "phone" },
        { value: "website", label: "website" },
      ],
      education_type: [
        { value: "elementry", label: "elementry" },
        { value: "middle", label: "middle" },
        { value: "secondary", label: "secondary" },
        { value: "higher", label: "higher" },
      ],
      source_type: [
        { value: "path", label: "path" },
        { value: "index", label: "index" },
      ],
      relation_options: [
        { value: "father", label: "father" },
        { value: "mother", label: "mother" },
        { value: "grandfather", label: "grandfather" },
        { value: "grandmother", label: "grandmother" },
        { value: "uncle", label: "uncle" },
        { value: "aunt", label: "aunt" },
        { value: "brother", label: "brother" },
        { value: "sister", label: "sister" },
        { value: "guardian", label: "legal_guardian" },
        { value: "other", label: "other" },
      ],
    };
  }
}
