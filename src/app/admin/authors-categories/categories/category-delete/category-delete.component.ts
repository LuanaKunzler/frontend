import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessMessage } from 'src/app/common/messages';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { BookCategory } from 'src/app/store/model';

@Component({
  selector: 'app-category-delete',
  templateUrl: './category-delete.component.html',
  styleUrls: ['./category-delete.component.scss']
})
export class CategoryDeleteComponent implements OnInit {

  category: BookCategory | any;
  innerLoading = true;

  constructor(private service: CategoriesService,
    public dialogRef: MatDialogRef<CategoryDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.innerLoading = false;
  }

  onDelete() {
    this.innerLoading = true;
    this.service.deleteCategoryById(this.data.id).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.CATEGORY_DELETED);
      this.dialogRef.close('confirm');
    });
  }

  onCancel() {
    this.dialogRef.close();    
  }
}
