import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, take, throwError } from 'rxjs';
import { SuccessMessage } from 'src/app/common/messages';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { BookCategory } from 'src/app/store/model';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {
  categoryForm: FormGroup | any;
  category: BookCategory | any;
  innerLoading = true;

  constructor(private service: CategoriesService,
    public dialogRef: MatDialogRef<CategoryCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.categoryForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
      ])
    });

    this.innerLoading = false;
  }

  onCreate() {
    this.innerLoading = true;
    this.category = this.categoryForm.value;
    this.service.createCategory(this.category)
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
    this.service.snackBarToast(SuccessMessage.CATEGORY_CREATED);
  }

  onCancel() {
    this.dialogRef.close();    
  }

}
