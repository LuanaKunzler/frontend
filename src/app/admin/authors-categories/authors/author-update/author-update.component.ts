import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessMessage } from 'src/app/common/messages';
import { AuthorsService } from 'src/app/services/admin-services/authors.service';
import { Author } from 'src/app/store/model';

@Component({
  selector: 'app-author-update',
  templateUrl: './author-update.component.html',
  styleUrls: ['./author-update.component.scss']
})
export class AuthorUpdateComponent implements OnInit {
  innerLoading = true;
  updateAuthorForm: FormGroup;
  author: Author | any;

  constructor(
    private service: AuthorsService, public dialogRef: MatDialogRef<AuthorUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateAuthorForm = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {    
    this.service.getAuthorById(this.data.id).subscribe((author) => {
      this.author = author;

      this.updateAuthorForm.patchValue({
        name: author.name
      });

      this.innerLoading = false;
    });
  }

  onUpdate(): void {
    this.innerLoading = true;
    this.author = this.updateAuthorForm.value;
    this.service.updateAuthor(this.data.id, this.author)
    .subscribe(() => {
      this.innerLoading = false;
      this.snackBarToast();
      this.dialogRef.close('save');
    });
  }

  snackBarToast() {
    this.service.snackBarToast(SuccessMessage.AUTHOR_UPDATED);
  }

  onCancel() {
    this.dialogRef.close();    
  }

}
