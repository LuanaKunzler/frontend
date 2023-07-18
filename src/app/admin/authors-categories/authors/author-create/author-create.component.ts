import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, take, throwError } from 'rxjs';
import { SuccessMessage } from 'src/app/common/messages';
import { AuthorsService } from 'src/app/services/admin-services/authors.service';
import { Author } from 'src/app/store/model';

@Component({
  selector: 'app-author-create',
  templateUrl: './author-create.component.html',
  styleUrls: ['./author-create.component.scss']
})
export class AuthorCreateComponent implements OnInit {
  authorForm: FormGroup | any;
  author: Author | any;
  innerLoading = true;

  constructor(private service: AuthorsService,
    public dialogRef: MatDialogRef<AuthorCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.authorForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
      ])
    });

    this.innerLoading = false;
  }

  onCreate() {
    this.innerLoading = true;
    this.author = this.authorForm.value;
    this.service.createAuthor(this.author)
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
    this.service.snackBarToast(SuccessMessage.AUTHOR_CREATED);
  }

  onCancel() {
    this.dialogRef.close();    
  }
}
