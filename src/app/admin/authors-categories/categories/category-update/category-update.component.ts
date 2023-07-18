import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessMessage } from 'src/app/common/messages';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { BookCategory } from 'src/app/store/model';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {
  innerLoading = true;
  updateCategoryForm: FormGroup;
  category: BookCategory | any;

  constructor(
    private service: CategoriesService, public dialogRef: MatDialogRef<CategoryUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateCategoryForm = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {    
    this.service.getCategoryById(this.data.id).subscribe((category) => {
      this.category = category;

      this.updateCategoryForm.patchValue({
        name: category.name
      });

      this.innerLoading = false;
    });
  }

  onUpdate(): void {
    this.innerLoading = true;
    this.category = this.updateCategoryForm.value;
    this.service.updateCategory(this.data.id, this.category)
    .subscribe(() => {
      this.innerLoading = false;
      this.snackBarToast();
      this.dialogRef.close('save');
    });
  }

  snackBarToast() {
    this.service.snackBarToast(SuccessMessage.CATEGORY_UPDATED);
  }

  onCancel() {
    this.dialogRef.close();    
  }

}
