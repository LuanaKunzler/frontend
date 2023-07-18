import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessMessage } from 'src/app/common/messages';
import { AuthorsService } from 'src/app/services/admin-services/authors.service';
import { Author } from 'src/app/store/model';

@Component({
  selector: 'app-author-delete',
  templateUrl: './author-delete.component.html',
  styleUrls: ['./author-delete.component.scss']
})
export class AuthorDeleteComponent implements OnInit {

  author: Author | any;
  innerLoading = true;

  constructor(private service: AuthorsService,
    public dialogRef: MatDialogRef<AuthorDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.innerLoading = false;
  }

  onDelete() {
    this.innerLoading = true;
    this.service.deleteAuthorById(this.data.id).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.AUTHOR_DELETED);
      this.dialogRef.close('confirm');
    });
  }

  onCancel() {
    this.dialogRef.close();    
  }
}
