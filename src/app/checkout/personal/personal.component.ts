import { User } from './../../store/model';
import { OrderState } from './../../store/order/order.reducer';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as OrderActions from '../../store/order/order.actions';
import * as fromApp from '../../store/app.reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as BlankValidators from '../../../utils/validators/blank.validator';
import { AccountService } from '../../services/account.service';
import { take } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  personalForm: FormGroup | any;

  innerLoading = true;


  constructor(private store: Store<fromApp.AppState>, private accountService: AccountService,
    private router: Router, private tokenService: TokenService) {
  }

  ngOnInit() {
    this.store.dispatch(new OrderActions.SetCheckoutStep(0));
    this.personalForm = new FormGroup({
      shipName: new FormControl(null, [Validators.required, BlankValidators.notBlankValidator, Validators.minLength(3), Validators.maxLength(104)]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(15)]),
    });

    this.store.select('order').pipe(take(1)).subscribe((order: OrderState) => {
      if (order.personal) {
        this.personalForm.patchValue({
          shipName: order.personal.shipName,
          phone: order.personal.phone
        });
        this.innerLoading = false;
      } else {
        const token = this.tokenService.getToken();
        this.accountService.getUser(token).pipe(take(1)).subscribe((data: User) => {
          this.personalForm.patchValue({
            shipName: (data.firstName ? data.firstName : '') + ' ' + (data.lastName ? data.lastName : ''),
            phone: data.phone,
          });
          this.innerLoading = false;
        });
      }

    });


  }


  onSubmitOrderForm() {
    const postData = {
      shipName: this.personalForm.value.shipName.trim(),
      phone: this.personalForm.value.phone,
    };
    this.store.dispatch(new OrderActions.PostPersonal(postData));
    this.router.navigate(['/checkout/shipping']);
  }
}
