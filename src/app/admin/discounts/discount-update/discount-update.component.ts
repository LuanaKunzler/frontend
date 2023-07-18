import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, take, throwError } from 'rxjs';
import { SuccessMessage } from 'src/app/common/messages';
import { DiscountsService } from 'src/app/services/admin-services/discounts.service';
import { Discount } from 'src/app/store/model';

@Component({
  selector: 'app-discount-update',
  templateUrl: './discount-update.component.html',
  styleUrls: ['./discount-update.component.scss'],
})
export class DiscountUpdateComponent implements OnInit {
  innerLoading = true;
  updateDiscountForm: FormGroup;
  discount: Discount | any;

  constructor(
    private service: DiscountsService, public dialogRef: MatDialogRef<DiscountUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateDiscountForm = new FormGroup({
      code: new FormControl(null, [Validators.required]),
      discountPercent: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {    
    this.service.getDiscountById(this.data.id).subscribe((discount) => {
      this.discount = discount;

      this.updateDiscountForm.patchValue({
        code: discount.code,
        discountPercent: discount.discountPercent,
        status: discount.status ? '1' : '0',
      });

      this.innerLoading = false;
    });
  }

  onUpdate(): void {
    this.innerLoading = true;
    this.discount = this.updateDiscountForm.value;
    this.service.updateDiscount(this.data.id, this.discount)
    .subscribe(() => {
      this.innerLoading = false;
      this.snackBarToast();
      this.dialogRef.close('save');
    });
  }

  snackBarToast() {
    this.service.snackBarToast(SuccessMessage.DISCOUNT_UPDATED);
  }

  onCancel() {
    this.dialogRef.close();    
  }
}
