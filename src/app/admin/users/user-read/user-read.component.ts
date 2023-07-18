import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/store/model';
import { UsersService } from 'src/app/services/admin-services/users.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-read',
  templateUrl: './user-read.component.html',
  styleUrls: ['./user-read.component.scss'],
})
export class UserReadComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<User>;

  pageOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  totalElements = 0;

  users: User[] = [];

  displayedColumns = [
    'id',
    'name',
    'email',
    'address',
    'phone',
    'role',
    'emailVerified',
    'status',
    'registrationDate',
    'socialProvider',
    'action',
  ];

  constructor(private service: UsersService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getUsers();
  }

  getUsers(): void {
    const sortDirection = 'desc';
    const sortField = 'registrationDate';

    this.service
      .getUsers(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((users) => {
        this.dataSource.data = users.content;
        this.totalElements = users.totalElements;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getSocialProviderLabel(socialProvider: string): string {
    switch (socialProvider) {
      case 'GOOGLE':
        return 'Google';
      case 'USER':
        return 'Usuário';
      case 'ADMIN':
        return 'Administrador';
      default:
        return '';
    }
  }

  getRoleLabel(roles: any[]): string {
    const roleNames = roles.map((role) => {
      if (role.name.includes('ROLE_ADMIN')) {
        return 'Administrador';
      } else if (role.name.includes('ROLE_USER')) {
        return 'Usuário';
      } else {
        return role.name;
      }
    });
    return roleNames.join(' / ');
  }

  openDeleteModal(userId: number) {
    const dialogRef: MatDialogRef<UserDeleteComponent> = this.dialog.open(
      UserDeleteComponent,
      {
        height: '150px',
        width: '350px',
        panelClass: 'custom-dialog-class',
        data: { userId },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.getUsers();
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

    this.dataSource.data.forEach((user) => {
      const rowData: any[] = [
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.email,
        `${user.address}${user.city ? ', ' + user.city : ''}${
          user.state ? ', ' + user.state : ''
        }${user.country ? ', ' + user.country : ''}${
          user.zip ? ', CEP: ' + user.zip : ''
        }`,
        user.phone,
        this.getRoleLabel(user.roles),
        user.emailVerified ? 'Sim' : 'Não',
        user.enabled ? 'Sim' : 'Não',
        user.registrationDate,
        this.getSocialProviderLabel(user.socialProvider),
      ];
      data.push(rowData);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelData: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fileName: string = 'user_report.xlsx';

    const excelURL: string = window.URL.createObjectURL(excelData);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = excelURL;
    link.download = fileName;
    link.click();
  }

  translateColumn(column: string): string {
    const columnTranslations: { [key: string]: string } = {
      id: 'ID',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      email: 'Email',
      address: 'Endereço',
      city: 'Cidade',
      state: 'Estado',
      country: 'País',
      zip: 'CEP',
      phone: 'Telefone',
      role: 'Permissões',
      emailVerified: 'Verificado',
      enabled: 'Status',
      registrationDate: 'Data de Registro',
      socialProvider: 'Criado por',
    };

    return columnTranslations[column] || column;
  }
}
