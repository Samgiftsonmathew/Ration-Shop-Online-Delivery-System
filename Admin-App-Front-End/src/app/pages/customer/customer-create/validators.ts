import { AbstractControl, ValidationErrors } from '@angular/forms';

export function tenDigitValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  const isValid = /^\d{10}$/.test(value);
  return isValid ? null : { tenDigits: true };
}
