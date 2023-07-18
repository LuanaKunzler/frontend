import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import AdminRoutes from './admin.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AdminComponent } from './admin.component';
import { AdminHeaderComponent } from './template/admin-header/admin-header.component';
import { AdminSidenavComponent } from './template/admin-sidenav/admin-sidenav.component';
import { AdminFooterComponent } from './template/admin-footer/admin-footer.component';
import { ProductsComponent } from './products/products.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthGuardService } from '../services/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { OrdersComponent } from './orders/orders.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { ReportsComponent } from './reports/reports.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AdminAuthGuard } from '../services/admin-guard.service';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsersService } from '../services/admin-services/users.service';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserReadComponent } from './users/user-read/user-read.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { UserUpdateComponent } from './users/user-update/user-update.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserDeleteComponent } from './users/user-delete/user-delete.component';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { LayoutModule } from '@angular/cdk/layout';
import { DiscountUpdateComponent } from './discounts/discount-update/discount-update.component';
import { DiscountReadComponent } from './discounts/discount-read/discount-read.component';
import { DiscountDeleteComponent } from './discounts/discount-delete/discount-delete.component';
import { DiscountCreateComponent } from './discounts/discount-create/discount-create.component';
import { AuthorsCategoriesComponent } from './authors-categories/authors-categories.component';
import { CategoriesComponent } from './authors-categories/categories/categories.component';
import { AuthorsComponent } from './authors-categories/authors/authors.component';
import { CategoryReadComponent } from './authors-categories/categories/category-read/category-read.component';
import { CategoryCreateComponent } from './authors-categories/categories/category-create/category-create.component';
import { CategoryUpdateComponent } from './authors-categories/categories/category-update/category-update.component';
import { CategoryDeleteComponent } from './authors-categories/categories/category-delete/category-delete.component';
import { AuthorReadComponent } from './authors-categories/authors/author-read/author-read.component';
import { AuthorCreateComponent } from './authors-categories/authors/author-create/author-create.component';
import { AuthorUpdateComponent } from './authors-categories/authors/author-update/author-update.component';
import { AuthorDeleteComponent } from './authors-categories/authors/author-delete/author-delete.component';
import { OrderReadComponent } from './orders/order-read/order-read.component';
import { OrderUpdateComponent } from './orders/order-update/order-update.component';
import { ParametersComponent } from './reports/parameters/parameters.component';
import { ReportViewComponent } from './reports/report-view/report-view.component';
import { OrderDeleteComponent } from './orders/order-delete/order-delete.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { ProductReadComponent } from './products/product-read/product-read.component';
import { ProductUpdateComponent } from './products/product-update/product-update.component';
import { ProductDeleteComponent } from './products/product-delete/product-delete.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminSidenavComponent,
    AdminFooterComponent,
    ProductsComponent,
    DashboardComponent,
    UsersComponent,
    CategoriesComponent,
    AuthorsComponent,
    OrdersComponent,
    DiscountsComponent,
    ReportsComponent,
    UserCreateComponent,
    UserReadComponent,
    UserUpdateComponent,
    UserDeleteComponent,
    DiscountUpdateComponent,
    DiscountReadComponent,
    DiscountDeleteComponent,
    DiscountCreateComponent,
    AuthorsCategoriesComponent,
    CategoryReadComponent,
    CategoryCreateComponent,
    CategoryUpdateComponent,
    CategoryDeleteComponent,
    AuthorReadComponent,
    AuthorCreateComponent,
    AuthorUpdateComponent,
    AuthorDeleteComponent,
    OrderReadComponent,
    OrderUpdateComponent,
    ParametersComponent,
    ReportViewComponent,
    OrderDeleteComponent,
    ProductCreateComponent,
    ProductReadComponent,
    ProductUpdateComponent,
    ProductDeleteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    ReactiveFormsModule,
    NgbModule,
    AlertModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatGridListModule,
    LayoutModule,
    NgxMaskModule.forRoot()
  ],
  exports: [AdminComponent],
  providers: [AuthGuardService, AdminAuthGuard, UsersService],
  bootstrap: [AdminComponent],
})
export class AdminModule {}
