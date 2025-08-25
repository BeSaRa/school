import { LocalService } from "@/services/local.service";

export interface NamesContract {
  nameAr: string;
  nameEn: string;
}

export interface GetNamesContract extends NamesContract {
  getNames(): string;

  getLocalService(): LocalService;
}
