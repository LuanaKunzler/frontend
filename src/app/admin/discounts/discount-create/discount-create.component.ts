import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, take, throwError } from 'rxjs';
import { SuccessMessage } from 'src/app/common/messages';
import { DiscountsService } from 'src/app/services/admin-services/discounts.service';
import { Discount } from 'src/app/store/model';

@Component({
  selector: 'app-discount-create',
  templateUrl: './discount-create.component.html',
  styleUrls: ['./discount-create.component.scss']
})
export class DiscountCreateComponent implements OnInit {
  discountForm: FormGroup | any;
  discount: Discount | any;
  innerLoading = true;

  constructor(private service: DiscountsService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<DiscountCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.discountForm = new FormGroup({
      code: new FormControl(null, [
        Validators.required,
      ]),
      discountPercent: new FormControl(null, [
        Validators.required
      ]),
      status: new FormControl(null, [Validators.required]),
    });

    this.innerLoading = false;
  }

  onCreate() {
    this.innerLoading = true;
    this.discount = this.discountForm.value;
    this.service.createDiscount(this.discount)
    .pipe(
      take(1),
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
    .subscribe(() => {
      this.innerLoading = false;
      this.snackBarToast();
      this.dialogRef.close('save');
    });
  }

  snackBarToast() {
    this.service.snackBarToast(SuccessMessage.DISCOUNT_CREATED);
  }

  onCancel() {
    this.dialogRef.close();    
  }
}
