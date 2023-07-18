import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessMessage } from 'src/app/common/messages';
import { OrdersService } from 'src/app/services/admin-services/orders.service';
import { Orders } from 'src/app/store/model';

@Component({
  selector: 'app-order-delete',
  templateUrl: './order-delete.component.html',
  styleUrls: ['./order-delete.component.scss']
})
export class OrderDeleteComponent implements OnInit {
  order: Orders | any;
  orderId: number | undefined;
  innerLoading = true;

  constructor(private service: OrdersService,
    public dialogRef: MatDialogRef<OrderDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    
    this.innerLoading = false;
  }

  onDelete() {
    this.innerLoading = true;
    this.service.deleteOrderById(this.data.orderId).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.ORDER_DELETED);
      this.dialogRef.close('confirm');
    });
  }

  onCancel() {
    this.dialogRef.close();    
  }
}