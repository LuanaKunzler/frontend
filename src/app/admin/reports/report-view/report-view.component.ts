import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ReportsService } from 'src/app/services/admin-services/reports.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
})
export class ReportViewComponent implements OnInit {
  queryParams: any;
  reportUrl: SafeResourceUrl | undefined = undefined;

  constructor(private route: ActivatedRoute, private service: ReportsService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.generateReportPDF();
  }

  generateReportPDF(): void {
    this.route.queryParamMap.subscribe((params) => {
      const reportName = params.get('reportName');
  
      switch (reportName) {
        case 'periodico_vendas': {
          this.generatePeriodicSalesReport(params);
          break;
        }
        case 'vendas_categoria': {
          //this.generateCategorySalesReport(params);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  
  generatePeriodicSalesReport(params: ParamMap): void {
    const start_date = params.get('startDate');
    const end_date = params.get('endDate');
  
      if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
  
        this.service.generatePeriodicSalesReport(startDate, endDate).subscribe(
          (reportData: Blob) => {
            this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(reportData));
          },
          (error: any) => {
            return throwError(() => new Error(error));
          }
        );        
      }
  
  }
  
  /*generateCategorySalesReport(params: ParamMap): void {
    const categoria = params.get('categoria');
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
  
    this.service.generateCategorySalesReport(categoria, startDate, endDate).subscribe(
      (reportData: Blob) => {
        this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(reportData));        
      },
      (error: any) => {
        return throwError(() => new Error(error));
      }
    );
  }*/
  
}
