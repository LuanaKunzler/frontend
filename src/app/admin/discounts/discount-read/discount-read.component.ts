import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountsService } from 'src/app/services/admin-services/discounts.service';
import { Discount } from 'src/app/store/model';
import { DiscountDeleteComponent } from '../discount-delete/discount-delete.component';
import * as XLSX from 'xlsx';
import { DiscountCreateComponent } from '../discount-create/discount-create.component';
import { DiscountUpdateComponent } from '../discount-update/discount-update.component';

@Component({
  selector: 'app-discount-read',
  templateUrl: './discount-read.component.html',
  styleUrls: ['./discount-read.component.scss'],
})
export class DiscountReadComponent implements AfterViewInit, OnInit {
  discounts: Discount[] = [];
  dataSource: MatTableDataSource<Discount>;
  displayedColumns = ['id', 'code', 'discountPercent', 'status', 'action'];
  pageOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: DiscountsService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Discount>();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getDiscounts();
  }

  getDiscounts(): void {
    const sortDirection = 'asc';
    const sortField = 'discountPercent';

    this.service
      .getDiscounts(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((discounts) => {
        this.dataSource.data = discounts.content;
        this.totalElements = discounts.totalElements;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getDiscounts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  openDeleteModal(id: number) {
    const dialogRef: MatDialogRef<DiscountDeleteComponent> = this.dialog.open(
      DiscountDeleteComponent,
      {
        height: '150px',
        width: '350px',
        panelClass: 'custom-dialog-class',
        data: { id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.getDiscounts();
      }
    });
  }

  openCreateModal() {
    const dialogRef: MatDialogRef<DiscountCreateComponent> = this.dialog.open(
      DiscountCreateComponent,
      {
        height: '420px',
        width: '530px',
        panelClass: 'custom-dialog-class',
        data: {},
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getDiscounts();
      }
    });
  }

  openUpdateModal(id: number) {
    const dialogRef: MatDialogRef<DiscountUpdateComponent> = this.dialog.open(
      DiscountUpdateComponent,
      {
        height: '420px',
        width: '530px',
        panelClass: 'custom-dialog-class',
        data: { id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.getDiscounts();
      }
    });
  }

  onDownloadExcel(): void {
    const data: any[] = [];

    const headerRow: any[] = this.displayedColumns
      .filter((column) => column !== 'action')
      .map((column) => {
        const translatedColumn = this.translateColumn(column);
        return (
          translatedColumn.charAt(0).toUpperCase() +
          translatedColumn.slice(1).toLowerCase()
        );
      });
    data.push(headerRow);

    this.dataSource.data.forEach((discount) => {
      const rowData: any[] = [
        discount.id,
        discount.code,
        discount.discountPercent,
        discount.status ? 'Ativo' : 'Inativo',
      ];
      data.push(rowData);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Descontos');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelData: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fileName: string = 'discount_report.xlsx';

    const excelURL: string = window.URL.createObjectURL(excelData);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = excelURL;
    link.download = fileName;
    link.click();
  }

  translateColumn(column: string): string {
    const columnTranslations: { [key: string]: string } = {
      id: 'ID',
      code: 'Código',
      discountPercent: 'Porcentagem',
      status: 'Status',
    };

    return columnTranslations[column] || column;
  }
}
