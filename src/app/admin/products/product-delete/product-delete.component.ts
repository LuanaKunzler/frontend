import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessMessage } from 'src/app/common/messages';
import { BooksService } from 'src/app/services/admin-services/books.service';
import { Book } from 'src/app/store/model';

@Component({
  selector: 'app-product-delete',
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.scss']
})
export class ProductDeleteComponent implements OnInit {
  product: Book | any;
  productId: number | undefined;
  innerLoading = true;

  constructor(private service: BooksService,
    public dialogRef: MatDialogRef<ProductDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    
    this.innerLoading = false;
  }

  onDelete() {
    this.innerLoading = true;
    this.service.deleteBookById(this.data.productId).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.PRODUCT_DELETED);
      this.dialogRef.close('confirm');
    });
  }

  onCancel() {
    this.dialogRef.close();    
  }
}
