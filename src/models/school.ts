import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { InterceptModel } from "cast-response";
import { SchoolService } from "@/services/school.service";
import { SchoolInterceptor } from "@/model-interceptors/school.interceptor";

const { send, receive } = new SchoolInterceptor();

@InterceptModel({ send, receive })
export class School extends BaseCrudModel<School, SchoolService> {
  override $$__service_name__$$: string = "SchoolService";

  name!: string;
  educationLevel!: "all" | "primary" | "secondary";

  schoolType!: {
    category: "public" | "private";
    gender: "boys" | "girls" | "mixed";
    religiousAffiliation: string;
    id: number;
  };

  location!: {
    country: string;
    city: string;
    area: string;
    street: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    id: number;
  };

  contact!: {
    phone: string;
    email: string;
    website: string;
    id: number;
  };

  systemConfiguration!: {
    visionProvider: "azure" | "aws" | "google" | "none";
    storageProvider: "local" | "cloud";
    cameras: any[]; // TODO: Replace with Camera[] when camera model is defined
    timezone: string;
    id: number;
  };
}
