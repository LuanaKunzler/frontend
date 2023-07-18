import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessMessage } from 'src/app/common/messages';
import { UsersService } from 'src/app/services/admin-services/users.service';
import { User } from 'src/app/store/model';
import * as BlankValidators from '../../../../utils/validators/blank.validator';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent implements OnInit {
  updateUserForm: FormGroup;
  user: User | any;
  userId: number | undefined;
  innerLoading = true;
  errorAlertVisible = false;
  successAlertVisible = false;
  emailPattern = '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$';
  isAdminChecked: boolean = false;
  isUserChecked: boolean = false;
  isEnabled: boolean = false;

  constructor(
    private service: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.updateUserForm = new FormGroup({
      email: new FormControl(null, [Validators.pattern(this.emailPattern)]),
      firstName: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(52),
      ]),
      lastName: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(52),
      ]),
      phone: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(11),
        Validators.maxLength(12),
      ]),
      address: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(240),
      ]),
      city: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      state: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(2),
        Validators.maxLength(40),
      ]),
      zip: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.maxLength(9),
        Validators.minLength(5),
      ]),
      country: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.minLength(2),
        Validators.maxLength(40),
      ]),
      role: new FormArray([]),
      enabled: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getUserById(this.userId).subscribe((user) => {
      this.user = user;

      if (user.roles.some((role) => role.name === 'ROLE_ADMIN')) {
        this.isAdminChecked = true;
      }

      if (user.roles.some((role) => role.name === 'ROLE_USER')) {
        this.isUserChecked = true;
      }

      this.updateUserForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
        enabled: user.enabled ? 'true' : 'false',
        role: user.roles,
      });

      const roleFormArray = this.updateUserForm.get('role') as FormArray;
      user.roles.forEach((role) => {
        roleFormArray.push(new FormControl(role.name));
      });
    });

    this.innerLoading = false;
  }

  updateUser(): void {
    this.innerLoading = true;
    this.user = this.updateUserForm.value;
    this.service.updateUser(this.userId, this.user).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.USER_UPDATED);
      this.router.navigate(['admin/users']);
    });
  }

  cancel(): void {
    this.router.navigate(['admin/users']);
  }

  toggleRole(role: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const roleFormArray = this.updateUserForm.get('role') as FormArray;
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
