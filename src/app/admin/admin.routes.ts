import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './users/users.component';
import { AdminAuthGuard } from '../services/admin-guard.service';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserUpdateComponent } from './users/user-update/user-update.component';
import { UserDeleteComponent } from './users/user-delete/user-delete.component';
import { DiscountUpdateComponent } from './discounts/discount-update/discount-update.component';
import { DiscountCreateComponent } from './discounts/discount-create/discount-create.component';
import { DiscountDeleteComponent } from './discounts/discount-delete/discount-delete.component';
import { AuthorsCategoriesComponent } from './authors-categories/authors-categories.component';
import { CategoriesComponent } from './authors-categories/categories/categories.component';
import { AuthorsComponent } from './authors-categories/authors/authors.component';
import { CategoryCreateComponent } from './authors-categories/categories/category-create/category-create.component';
import { CategoryUpdateComponent } from './authors-categories/categories/category-update/category-update.component';
import { CategoryDeleteComponent } from './authors-categories/categories/category-delete/category-delete.component';
import { AuthorCreateComponent } from './authors-categories/authors/author-create/author-create.component';
import { AuthorUpdateComponent } from './authors-categories/authors/author-update/author-update.component';
import { AuthorDeleteComponent } from './authors-categories/authors/author-delete/author-delete.component';
import { OrderUpdateComponent } from './orders/order-update/order-update.component';
import { ReportViewComponent } from './reports/report-view/report-view.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { ProductUpdateComponent } from './products/product-update/product-update.component';
import { ProductDeleteComponent } from './products/product-delete/product-delete.component';

const AdminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    canActivateChild: [AdminAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'authors&categories', component: AuthorsCategoriesComponent },
      { path: 'authors&categories/categories', component: CategoriesComponent },
      { path: 'authors&categories/categories/create', component: CategoryCreateComponent },
      { path: 'authors&categories/categories/update/:id', component: CategoryUpdateComponent },
      { path: 'authors&categories/categories/delete/:id', component: CategoryDeleteComponent },
      { path: 'authors&categories/authors', component: AuthorsComponent },
      { path: 'authors&categories/authors/create', component: AuthorCreateComponent },
      { path: 'authors&categories/authors/update/:id', component: AuthorUpdateComponent },
      { path: 'authors&categories/authors/delete/:id', component: AuthorDeleteComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'discounts', component: DiscountsComponent },
      { path: 'discounts/create', component: DiscountCreateComponent },
      { path: 'discounts/update/:id', component: DiscountUpdateComponent },
      { path: 'discounts/delete/:id', component: DiscountDeleteComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/update/:id', component: OrderUpdateComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/create', component: ProductCreateComponent },
      { path: 'products/update/:id', component: ProductUpdateComponent },
      { path: 'products/delete/:id', component: ProductDeleteComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'reports/reportView', component: ReportViewComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/create', component: UserCreateComponent },
      { path: 'users/update/:id', component: UserUpdateComponent },
      { path: 'users/delete/:id', component: UserDeleteComponent }
    ],
  },
];

export default AdminRoutes;