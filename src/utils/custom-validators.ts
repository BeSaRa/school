import { Patterns } from "@/validators/patterns";
import { ValidatorFn } from "@angular/forms";

export function dependentContactValidator(dependentKey: string): ValidatorFn {
  return (control) => {
    if (!control || !control.parent) return null;

    const dependentControl = control.parent.get([dependentKey]);
    if (!dependentControl) return null;

    const dependentValue = dependentControl.value;
    const currentValue = control.value;
    if (dependentValue === "email") {
      const emailPattern = Patterns.EMAIL;
      return emailPattern.test(currentValue) ? null : { pattern: true };
    }
    if (dependentValue === "website") {
      const emailPattern = Patterns.WEBSITE;
      return emailPattern.test(currentValue) ? null : { pattern: true };
    }
    if (dependentValue === "phone" || dependentValue === "mobile") {
      const phonePattern = Patterns.PHONE;
      return phonePattern.test(currentValue) ? null : { pattern: true };
    }
    return null;
  };
}
