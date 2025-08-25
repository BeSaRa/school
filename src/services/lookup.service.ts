import { ClonerMixin } from "@/mixins/cloner-mixin";
import { GetNamesMixin } from "@/mixins/get-names-mixin";
import { Injectable } from "@angular/core";

export class LookupItem extends ClonerMixin(GetNamesMixin(class {})) {
  id!: string | number;

  constructor(id: string | number, nameEn: string, nameAr: string) {
    super();
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
  }
}

const lookupKeys = ["religious_affiliation", "school_type", "gender", "visionProvider", "storageProvider", "role", "contact_type", "education_type", "source_type", "relation_options"] as const;
type LookupKeys = (typeof lookupKeys)[number];

@Injectable({ providedIn: "root" })
export class LookupService {
  lookups: Record<LookupKeys, LookupItem[]> = {} as any;

  private rawLookups: Record<LookupKeys, { id: string | number; nameEn: string; nameAr: string }[]> = {
    religious_affiliation: [
      { id: "catholic", nameEn: "Catholic", nameAr: "كاثوليكي" },
      { id: "islamic", nameEn: "Islamic", nameAr: "إسلامي" },
      { id: "christian", nameEn: "Christian", nameAr: "مسيحي" },
      { id: "jewish", nameEn: "Jewish", nameAr: "يهودي" },
      { id: "other", nameEn: "Other", nameAr: "أخرى" },
    ],
    school_type: [
      { id: "public", nameEn: "Public", nameAr: "حكومي" },
      { id: "private", nameEn: "Private", nameAr: "خاص" },
      { id: "international", nameEn: "International", nameAr: "دولي" },
      { id: "religious", nameEn: "Religious", nameAr: "ديني" },
      { id: "independent", nameEn: "Independent", nameAr: "مستقل" },
    ],
    gender: [
      { id: "male", nameEn: "Male", nameAr: "ذكر" },
      { id: "female", nameEn: "Female", nameAr: "أنثى" },
    ],
    visionProvider: [
      { id: "azure", nameEn: "Azure", nameAr: "أزور" },
      { id: "custom", nameEn: "Custom", nameAr: "مخصص" },
    ],
    storageProvider: [
      { id: "azure", nameEn: "Azure", nameAr: "أزور" },
      { id: "local", nameEn: "Local", nameAr: "محلي" },
    ],
    role: [
      { id: "student", nameEn: "Student", nameAr: "طالب" },
      { id: "supervisor", nameEn: "Supervisor", nameAr: "مشرف" },
      { id: "teacher", nameEn: "Teacher", nameAr: "معلم" },
      { id: "superuser", nameEn: "Superuser", nameAr: "مدير النظام" },
    ],
    contact_type: [
      { id: "email", nameEn: "Email", nameAr: "بريد إلكتروني" },
      { id: "mobile", nameEn: "Mobile", nameAr: "جوال" },
      { id: "phone", nameEn: "Phone", nameAr: "هاتف" },
      { id: "website", nameEn: "Website", nameAr: "موقع إلكتروني" },
    ],
    education_type: [
      { id: "elementry", nameEn: "Elementary", nameAr: "ابتدائي" },
      { id: "middle", nameEn: "Middle", nameAr: "إعدادي" },
      { id: "secondary", nameEn: "Secondary", nameAr: "ثانوي" },
      { id: "higher", nameEn: "Higher", nameAr: "جامعي" },
    ],
    source_type: [
      { id: "path", nameEn: "Path", nameAr: "مسار" },
      { id: "index", nameEn: "Index", nameAr: "فهرس" },
    ],
    relation_options: [
      { id: "father", nameEn: "Father", nameAr: "أب" },
      { id: "mother", nameEn: "Mother", nameAr: "أم" },
      { id: "grandfather", nameEn: "Grandfather", nameAr: "جد" },
      { id: "grandmother", nameEn: "Grandmother", nameAr: "جدة" },
      { id: "uncle", nameEn: "Uncle", nameAr: "عم/خال" },
      { id: "aunt", nameEn: "Aunt", nameAr: "عمة/خالة" },
      { id: "brother", nameEn: "Brother", nameAr: "أخ" },
      { id: "sister", nameEn: "Sister", nameAr: "أخت" },
      { id: "guardian", nameEn: "Guardian", nameAr: "ولي أمر" },
      { id: "other", nameEn: "Other", nameAr: "أخرى" },
    ],
  };

  constructor() {
    const createItems = (items: { id: string | number; nameEn: string; nameAr: string }[]) => items.map((i) => new LookupItem(i.id, i.nameEn, i.nameAr));

    for (const key of lookupKeys) {
      this.lookups[key] = createItems(this.rawLookups[key] || []);
    }
  }
}
