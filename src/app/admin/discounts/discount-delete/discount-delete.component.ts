import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessMessage } from 'src/app/common/messages';
import { DiscountsService } from 'src/app/services/admin-services/discounts.service';
import { Discount } from 'src/app/store/model';

@Component({
  selector: 'app-discount-delete',
  templateUrl: './discount-delete.component.html',
  styleUrls: ['./discount-delete.component.scss']
})
export class DiscountDeleteComponent implements OnInit {

  discount: Discount | any;
  innerLoading = true;

  constructor(private service: DiscountsService, private route: ActivatedRoute, private router: Router,
    public dialogRef: MatDialogRef<DiscountDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.innerLoading = false;
  }

  onDelete() {
    this.innerLoading = true;
    this.service.deleteDiscountById(this.data.id).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.DISCOUNT_DELETED);
      this.dialogRef.close('confirm');
    });
  }

  onCancel() {
    this.dialogRef.close();    
  }

}
