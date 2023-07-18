import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ParametersComponent } from './parameters/parameters.component';
import { ReportsService } from 'src/app/services/admin-services/reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  constructor(
    private service: ReportsService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  openExportModal(reportName: string) {
    const reportParameters: any = {
      periodico_vendas: {
        startDate: null,
        endDate: null,
      },
      vendas_categoria: {
        categoria: '',
        startDate: null,
        endDate: null,
      },
    };
  
    const dialogRef: MatDialogRef<ParametersComponent> = this.dialog.open(
      ParametersComponent,
      {
        height: '300px',
        width: '500px',
        panelClass: 'custom-dialog-class',
        data: {
          reportName,
          reportParameters: reportParameters[reportName],
        },
      }
    );
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        
      }
    });
  }

}
