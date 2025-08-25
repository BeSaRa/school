import { GetNamesContract, NamesContract } from "@/contracts/get-names-contract";
import { LocalService } from "@/services/local.service";
import { ServiceRegistry } from "@/services/service-registry";
import { AbstractConstructorType, ConstructorType } from "@/types/constructor-type";
import { SupportedLanguage } from "@/types/localization.types";

type CanGetNames = ConstructorType<GetNamesContract> & AbstractConstructorType<GetNamesContract>;

export function GetNamesMixin<T extends AbstractConstructorType<object>>(base: T): CanGetNames & T;
export function GetNamesMixin<T extends ConstructorType<object>>(base: T): CanGetNames & T {
  return class CanGetNames extends base implements GetNamesContract {
    nameAr!: string;
    nameEn!: string;

    constructor(...args: any[]) {
      super(...args);
    }

    getLocalService(): LocalService {
      try {
        return ServiceRegistry.get<LocalService>("LocalService");
      } catch {
        return new LocalService();
      }
    }

    getNames(): string {
      const localService = this.getLocalService();
      if (!localService) {
        return this.nameEn ?? "";
      }
      const code = localService.getCurrentLanguage() as SupportedLanguage;
      const propName = "name" + code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
      return (this[propName as keyof NamesContract] as string) ?? this.nameEn ?? "";
    }
  };
}
