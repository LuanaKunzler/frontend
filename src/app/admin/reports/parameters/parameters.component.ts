import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  PeriodicoVendasParameters,
  VendasCategoriaParameters,
} from '../report-parameters.model';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { BookCategory } from 'src/app/store/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit {
  reportForm: FormGroup | any;
  categories: BookCategory[] = [];
  pageSize = 10;
  pageIndex = 0;
  reportParameters: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reportName: string },
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<ParametersComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    switch (this.data.reportName) {
      case 'periodico_vendas':
        this.addPeriodicoVendasFields();
        break;
      case 'vendas_categoria':
        this.addVendasCategoriaFields();
        this.loadCategories();
        break;
      default:
        break;
    }
  }

  addPeriodicoVendasFields(): void {
    this.reportForm = new FormGroup({
      startDate: new FormControl(null, [
        Validators.required
      ]),
      endDate: new FormControl(null, [
        Validators.required
      ])
    });
  }

  addVendasCategoriaFields(): void {
    this.reportForm = new FormGroup({
      startDate: new FormControl(null, [
        Validators.required
      ]),
      endDate: new FormControl(null, [
        Validators.required
      ]),
      category: new FormControl(null, [
        Validators.required
      ])
    });
  }

  loadCategories(): void {
    const sortDirection = 'asc';
    const sortField = 'name';

    this.categoriesService
      .getCategories(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((categories) => {
        this.categories = categories.content;
      });
  }

  onGenerateReport(): void {
    const reportParameters = {
      ...this.reportParameters,
      ...this.reportForm.value,
    };
  
    const queryParams: { [key: string]: any } = {
      reportName: this.data.reportName
    };
  
    for (const key in reportParameters) {
      if (reportParameters[key]) {
        queryParams[key] = reportParameters[key];
      }
    }
  
    this.router.navigate(['/admin/reports/reportView'], { queryParams });
    this.dialogRef.close('confirm');
  }
  

  onCancel() {
    this.dialogRef.close();
  }
}
