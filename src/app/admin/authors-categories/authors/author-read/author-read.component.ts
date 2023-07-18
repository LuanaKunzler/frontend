import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthorsService } from 'src/app/services/admin-services/authors.service';
import { Author } from 'src/app/store/model';
import { AuthorDeleteComponent } from '../author-delete/author-delete.component';
import { AuthorCreateComponent } from '../author-create/author-create.component';
import { AuthorUpdateComponent } from '../author-update/author-update.component';

@Component({
  selector: 'app-author-read',
  templateUrl: './author-read.component.html',
  styleUrls: ['./author-read.component.scss'],
})
export class AuthorReadComponent implements AfterViewInit, OnInit {
  authors: Author[] = [];
  dataSource: MatTableDataSource<Author>;
  displayedColumns = ['id', 'name', 'action'];
  pageOptions = [5, 10, 20];
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: AuthorsService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Author>();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getAuthors();
  }

  getAuthors(): void {
    const sortDirection = 'asc';
    const sortField = 'name';

    this.service
      .getAuthors(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((authors) => {
        this.dataSource.data = authors.content;
        this.totalElements = authors.totalElements;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAuthors();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  openDeleteModal(id: number) {
    const dialogRef: MatDialogRef<AuthorDeleteComponent> = this.dialog.open(
      AuthorDeleteComponent,
      {
        height: '150px',
        width: '350px',
        panelClass: 'custom-dialog-class',
        data: { id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.getAuthors();
      }
    });
  }

  openCreateModal() {
    const dialogRef: MatDialogRef<AuthorCreateComponent> = this.dialog.open(
      AuthorCreateComponent,
      {
        height: '250px',
        width: '400px',
        panelClass: 'custom-dialog-class',
        data: {},
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getAuthors();
      }
    });
  }

  openUpdateModal(id: number) {
    const dialogRef: MatDialogRef<AuthorUpdateComponent> = this.dialog.open(
      AuthorUpdateComponent,
      {
        height: '250px',
        width: '400px',
        panelClass: 'custom-dialog-class',
        data: { id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getAuthors();
      }
    });
  }
}
