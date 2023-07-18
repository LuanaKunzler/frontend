import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessMessage } from 'src/app/common/messages';
import { UsersService } from 'src/app/services/admin-services/users.service';
import { User } from 'src/app/store/model';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {
  user: User | any;
  userId: number | undefined;
  innerLoading = true;

  constructor(private service: UsersService,
    public dialogRef: MatDialogRef<UserDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    
    this.innerLoading = false;
  }

  onDelete() {
    this.innerLoading = true;
    this.service.deleteUserById(this.data.userId).subscribe(() => {
      this.innerLoading = false;
      this.service.snackBarToast(SuccessMessage.USER_DELETED);
      this.dialogRef.close('confirm');
    });
  }

  onCancel() {
    this.dialogRef.close();    
  }
}
