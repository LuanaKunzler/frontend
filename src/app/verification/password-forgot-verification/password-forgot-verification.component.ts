import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import * as BlankValidators from '../../../utils/validators/blank.validator';
import * as PasswordValidators from '../../../utils/validators/password.validator';
import * as fromApp from '../../store/app.reducers';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/authorization/authorization.actions';
import { catchError, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-password-forgot-verification',
  templateUrl: './password-forgot-verification.component.html',
  styleUrls: ['./password-forgot-verification.component.scss']
})
export class PasswordForgotVerificationComponent implements OnInit, OnDestroy {

  isVerified: boolean;
  authSubscription: Subscription;
  errorAlertVisible = false;
  successAlertVisible = false;

  forgotPasswordResetForm: FormGroup | any;
  passwordForgotToken: string = '';

  constructor(private store: Store<fromApp.AppState>, private route: ActivatedRoute,
    private router: Router, private accountService: AccountService) {
    this.isVerified = false;
    this.authSubscription = new Subscription();
  }

  ngOnInit() {
    this.authSubscription = this.store.select('authorization')
      .pipe(filter(data => data.authenticated))
      .subscribe(data => {
        this.store.dispatch(new AuthActions.SignOut());
      });

    this.forgotPasswordResetForm = new FormGroup({
      newPasswordGroup: new FormGroup({
        newPassword: new FormControl(null, [Validators.required, BlankValidators.checkIfBlankValidator, Validators.minLength(6)]),
        newPasswordConfirm: new FormControl(null, [Validators.required, BlankValidators.checkIfBlankValidator, Validators.minLength(6)])
      }, PasswordValidators.passwordMatchCheckValidator),
    });


    this.passwordForgotToken = this.route.snapshot.queryParams['token'];
    this.accountService.forgotPasswordConfirm(this.passwordForgotToken)
      .pipe(take(1), catchError(error => {
        this.isVerified = false;
        return throwError(() => new Error(error));
      })).subscribe((data) => {
        this.isVerified = true;
      });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onForgotPasswordResetFormSubmit() {
    this.accountService.forgotPasswordReset(
      this.passwordForgotToken,
      this.forgotPasswordResetForm.value.newPasswordGroup.newPassword,
      this.forgotPasswordResetForm.value.newPasswordGroup.newPasswordConfirm
    ).pipe(take(1),
      catchError(error => {
        this.errorAlertVisible = true;
        return throwError(() => new Error(error));
      }))
      .subscribe(res => {
        this.successAlertVisible = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
      }, 5000);
      });
  }
}
