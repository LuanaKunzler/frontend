import { AbstractControl, FormGroup } from '@angular/forms';

export function passwordMatchCheckValidator(control: AbstractControl): { [s: string]: boolean } | null {
  if (control.value.newPassword !== control.value.newPasswordConfirm) {
    return { noMatch: true };
  }
  return null;
}
