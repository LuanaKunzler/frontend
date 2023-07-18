import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/admin-services/users.service';
import { User } from 'src/app/store/model';
import { catchError, take, throwError } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as BlankValidators from '../../../../utils/validators/blank.validator';
import { SuccessMessage } from 'src/app/common/messages';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup | any;
  user: User | any;
  innerLoading = true;
  errorAlertVisible = false;
  successAlertVisible = false;
  emailPattern = '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$';

  constructor(private service: UsersService, private router: Router) {}
  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(52),
      ]),
      firstName: new FormControl(null, [
        Validators.pattern('^[a-zA-Z\\s]+$'),
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(52),
      ]),
      lastName: new FormControl(null, [
        Validators.pattern('^[a-zA-Z\\s]+$'),
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(52),
      ]),
      phone: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.pattern('[0-9]+'),
        Validators.minLength(11),
        Validators.maxLength(12),
      ]),
      address: new FormControl(null, [
        Validators.pattern('[0-9a-zA-Z #,-]+'),
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(240),
      ]),
      city: new FormControl(null, [
        Validators.pattern('^[a-zA-Z\\s]+$'),
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      state: new FormControl(null, [
        Validators.pattern('^[a-zA-Z\\s]+$'),
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(40),
      ]),
      zip: new FormControl(null, [
        Validators.pattern('^[0-9]*$'),
        BlankValidators.checkIfBlankValidator,
        Validators.maxLength(8),
        Validators.minLength(5),
      ]),
      country: new FormControl(null, [
        Validators.pattern('^[a-zA-Z\\s]+$'),
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(40),
      ]),
      role: new FormArray([], Validators.required),
      enabled: new FormControl(null, [Validators.required]),
    });

    this.innerLoading = false;
  }

  createUser(): void {
    this.innerLoading = true;
  
    this.user = this.userForm.value;
  
    this.service
      .createUser(this.user)
      .pipe(
        take(1),
        catchError((error) => {
          this.errorAlertVisible = true;
          return throwError(() => new Error(error));
        })
      )
      .subscribe(() => {
        this.innerLoading = false;
        this.successAlertVisible = true;
        this.snackBarToast();
        this.router.navigate(['/admin/users']);
      });
    }

  snackBarToast() {
    this.service.snackBarToast(SuccessMessage.USER_CREATED);
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }

  toggleRole(role: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const roleFormArray = this.userForm.get('role') as FormArray;
    if (checked) {
      roleFormArray.push(new FormControl(role));
    } else {
      const index = roleFormArray.controls.findIndex(
        (control) => control.value === role
      );
      if (index >= 0) {
        roleFormArray.removeAt(index);
      }
    }
  }
}
