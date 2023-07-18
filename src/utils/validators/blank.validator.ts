import { AbstractControl, FormGroup } from '@angular/forms';

export function checkIfBlankValidator(control: AbstractControl): { [s: string]: boolean } | null {
  if (control.value !== null && control.value.trim() !== control.value && control.value.trim() === '') {
    return { blank: true };
  }
  return null;
}

export function notBlankValidator(control: AbstractControl): { [s: string]: boolean } | null {
  // checks if the field is null or has an empty value in it.
  if (control.value === null || control.value.trim() === '') {
    return { blank: true };
  }
  return null;
}
