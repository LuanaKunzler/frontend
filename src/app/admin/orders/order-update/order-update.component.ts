import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessMessage } from 'src/app/common/messages';
import { OrdersService } from 'src/app/services/admin-services/orders.service';
import { OrderItems, Orders } from 'src/app/store/model';

@Component({
  selector: 'app-order-update',
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.scss'],
})
export class OrderUpdateComponent implements OnInit {
  updateOrderForm: FormGroup;
  order: Orders | any;
  orderId: number | undefined;
  innerLoading = true;
  emailPattern = '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$';

  constructor(
    private service: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.updateOrderForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      orderId: new FormControl(''),
      title: new FormControl(''),
      longDesc: new FormControl(''),
      isbn: new FormControl(''),
      unitPrice: new FormControl(''),
      amount: new FormControl(''),
      shipName: new FormControl(''),
      shipAddress: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
      country: new FormControl(''),
      discountPercent: new FormControl(''),
      totalPrice: new FormControl(''),
      totalCargoPrice: new FormControl(''),
      date: new FormControl(''),
      shipped: new FormControl(''),
      cargoFirm: new FormControl(''),
      trackingNumber: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));    

    this.service.getOrderById(this.orderId).subscribe((order) => {
      this.order = order;      

      this.updateOrderForm.patchValue({
        name: order.user.firstName + ' ' + order.user.lastName,
        email: order.user.email,
        phone: order.user.phone,
        orderId: order.id,
        title: order.orderDetailList && order.orderDetailList[0].book.title,
        longDesc: order.orderDetailList && order.orderDetailList[0]?.book.longDesc,
        isbn: order.orderDetailList && order.orderDetailList[0]?.book.isbn,
        unitPrice: order.orderDetailList && order.orderDetailList[0]?.book.unitPrice,
        amount: order.orderDetailList && order.orderDetailList[0]?.amount,
        shipName: order.shipName,
        shipAddress: order.shipAddress,
        city: order.city,
        state: order.state,
        zip: order.zip,
        country: order.country,
        discountPercent: order.discount?.discountPercent,
        totalPrice: order.totalPrice,
        totalCargoPrice: order.totalCargoPrice,
        date: order.date,
        shipped: order.shipped,
        cargoFirm: order.cargoFirm,
        trackingNumber: order.trackingNumber,
      });
    });

    this.innerLoading = false;
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      in_preparation: 'Preparando',
      sent: 'Enviado',
      finished: 'Finalizado',
      canceled: 'Cancelado',
    };

    if (status && statusMap[status.toLowerCase()]) {
      return statusMap[status.toLowerCase()];
    }
    return '';
  }

  updateOrder(): void {
    this.innerLoading = true;
    this.order = this.updateOrderForm.value;
    this.service.updateOrder(this.orderId, this.order).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.ORDER_UPDATED);
      this.router.navigate(['admin/orders']);
    });
  }

  cancel(): void {
    this.router.navigate(['admin/orders']);
  }
}
