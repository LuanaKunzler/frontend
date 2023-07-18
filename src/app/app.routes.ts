import { GPageNotFoundComponent } from './g-page-not-found/g-page-not-found.component';
import { Routes } from '@angular/router';

const AppRoutes: Routes = [
{ path: 'not-found', component: GPageNotFoundComponent, data: { message: 'Page not found!' } },
{
path: 'account',
loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
},
{
path: 'cart',
loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
},
{
path: 'checkout',
loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule)
},
{
path: 'faq',
loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
},
{
path: 'admin',
loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
},
{ path: '**', redirectTo: '/not-found' }
];

export default AppRoutes;