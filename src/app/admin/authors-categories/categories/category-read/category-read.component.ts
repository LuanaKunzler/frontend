import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { BookCategory } from 'src/app/store/model';
import { CategoryDeleteComponent } from '../category-delete/category-delete.component';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryUpdateComponent } from '../category-update/category-update.component';

@Component({
  selector: 'app-category-read',
  templateUrl: './category-read.component.html',
  styleUrls: ['./category-read.component.scss']
})
export class CategoryReadComponent implements AfterViewInit, OnInit {
  categories: BookCategory[] = [];
  dataSource: MatTableDataSource<BookCategory>;
  displayedColumns = [
    'id',
    'name',
    'action'
  ];
  pageOptions = [5, 10, 20];
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: CategoriesService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<BookCategory>();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getCategories();
  }
  
  getCategories(): void {
    const sortDirection = 'asc';
    const sortField = 'name';

    this.service.getCategories(this.pageIndex, this.pageSize, sortDirection, sortField).subscribe((categories) => {
      this.dataSource.data = categories.content;
      this.totalElements = categories.totalElements;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCategories();
  }
  

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  openDeleteModal(id: number) {
    const dialogRef: MatDialogRef<CategoryDeleteComponent> = this.dialog.open(
      CategoryDeleteComponent,
      {
        height: '150px',
        width: '350px',
        panelClass: 'custom-dialog-class',
        data: { id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.getCategories();
      }
    });
  }

  openCreateModal() {
    const dialogRef: MatDialogRef<CategoryCreateComponent> = this.dialog.open(
      CategoryCreateComponent,
      {
        height: '250px',
        width: '400px',
        panelClass: 'custom-dialog-class',
        data: {},
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getCategories();
      }
    });
  }

  openUpdateModal(id: number) {
    const dialogRef: MatDialogRef<CategoryUpdateComponent> = this.dialog.open(
      CategoryUpdateComponent,
      {
        height: '250px',
        width: '400px',
        panelClass: 'custom-dialog-class',
        data: { id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getCategories();
      }
    });
  }

}
