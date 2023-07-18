import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/services/admin-services/orders.service';
import { Orders } from 'src/app/store/model';
import { getLocaleDate } from 'src/utils/date';
import * as XLSX from 'xlsx';
import { OrderDeleteComponent } from '../order-delete/order-delete.component';

@Component({
  selector: 'app-order-read',
  templateUrl: './order-read.component.html',
  styleUrls: ['./order-read.component.scss'],
})
export class OrderReadComponent implements AfterViewInit, OnInit {
  orders: Orders[] = [];
  dataSource: MatTableDataSource<Orders>;
  displayedColumns = [
    'id',
    'shipName',
    'date',
    'status',
    'totalPrice',
    'discount',
    'action',
  ];
  pageOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: OrdersService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Orders>();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getOrders();
  }

  getOrders(): void {
    const sortDirection = 'desc';
    const sortField = 'date';

    this.service
      .getOrders(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((orders) => {
        this.dataSource.data = orders.content;
        this.totalElements = orders.totalElements;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  openDeleteModal(orderId: number) {
    const dialogRef: MatDialogRef<OrderDeleteComponent> = this.dialog.open(
      OrderDeleteComponent,
      {
        height: '150px',
        width: '350px',
        panelClass: 'custom-dialog-class',
        data: { orderId },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.getOrders();
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
  
    this.dataSource.data.forEach((order) => {
      const rowData: any[] = [
        order.id,
        order.shipName,
        new Date(order.date).toLocaleDateString(),
        this.formatStatus(order.shipped),
        order.totalPrice,
        order.discount
      ];
      data.push(rowData);
    });
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');
  
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
  
    const excelData: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  
    const fileName: string = 'order_report.xlsx';
  
    const excelURL: string = window.URL.createObjectURL(excelData);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = excelURL;
    link.download = fileName;
    link.click();
  }

  translateColumn(column: string): string {
    const columnTranslations: { [key: string]: string } = {
      id: 'ID',
      shipName: 'Cliente',
      date: 'Data do Pedido',
      status: 'Status',
      totalPrice: 'Preço Total',
      discount: 'Desconto'
    };

    return columnTranslations[column] || column;
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      in_preparation: 'Preparando',
      sent: 'Enviado',
      finished: 'Finalizado',
      canceled: 'Cancelado',
    };

    if (status && statusMap[status.toLowerCase()]) {
      return statusMap[status.toLowerCase()];
    }
    return '';
  }

  convertDate(date: number) {
    return getLocaleDate(date);
  }
}
