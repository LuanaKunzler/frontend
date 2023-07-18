import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BooksService } from 'src/app/services/admin-services/books.service';
import { Book } from 'src/app/store/model';
import { ProductDeleteComponent } from '../product-delete/product-delete.component';
import * as XLSX from 'xlsx';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { getLocaleDate } from 'src/utils/date';

@Component({
  selector: 'app-product-read',
  templateUrl: './product-read.component.html',
  styleUrls: ['./product-read.component.scss'],
})
export class ProductReadComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Book>;

  pageOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  totalElements = 0;

  books: Book[] = [];

  displayedColumns = [
    'id',
    'isbn',
    'title',
    'bookEdition',
    'category',
    'unitPrice',
    'unitsInStock',
    'sellCount',
    'isActive',
    'dateCreated',
    'action',
  ];

  constructor(
    private service: BooksService,
    public dialog: MatDialog,
    private categoriesService: CategoriesService
  ) {
    this.dataSource = new MatTableDataSource<Book>();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getBooks();
  }

  getBooks(): void {
    const sortDirection = 'desc';
    const sortField = 'dateCreated';

    this.service
      .getBooks(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((users) => {
        this.dataSource.data = users.content;
        this.totalElements = users.totalElements;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBooks();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  openDeleteModal(productId: number) {
    const dialogRef: MatDialogRef<ProductDeleteComponent> = this.dialog.open(
      ProductDeleteComponent,
      {
        height: '150px',
        width: '350px',
        panelClass: 'custom-dialog-class',
        data: { productId },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.getBooks();
      }
    });
  }

  onDownloadExcel(): void {
    const data: any[] = [];

    const headerRow: any[] = this.displayedColumns
    .filter((column) => column !== 'action')
    .map((column) => {
      const translatedColumn = this.translateColumn(column);
      return translatedColumn.charAt(0).toUpperCase() + translatedColumn.slice(1).toLowerCase();
    });
    data.push(headerRow);

    this.dataSource.data.forEach((product) => {
      const rowData: any[] = [
        product.id,
        product.isbn,
        product.title,
        product.bookEdition,
        product.bookCategory,
        product.unitPrice,
        product.unitsInStock,
        product.sellCount ? product.sellCount : '0',
        product.isActive ? 'Sim' : 'Não',
        product.dateCreated
      ];
      data.push(rowData);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelData: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fileName: string = 'product_report.xlsx';

    const excelURL: string = window.URL.createObjectURL(excelData);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = excelURL;
    link.download = fileName;
    link.click();
  }

  translateColumn(column: string): string {
    const columnTranslations: { [key: string]: string } = {
      id: 'ID',
      isbn: 'Isbn',
      title: 'Título',
      bookEdition: 'Edição',
      category: 'Categoria',
      unitPrice: 'Preço Unitário',
      unitsInStock: 'Quantidade',
      sellCount: 'Vendido',
      isActive: 'Status',
      dateCreated: 'Data de Registro'
    };

    return columnTranslations[column] || column;
  }

  convertDate(date: number) {
    return getLocaleDate(date);
  }
}
