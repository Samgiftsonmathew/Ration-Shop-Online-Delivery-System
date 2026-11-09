import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SubadminComponent } from './pages/subadmin/subadmin.component';

import { CustomerInfoComponent } from './pages/customer-info/customer-info.component';
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
import { LoginComponent } from './pages/login/login.component';
import { CustomerOrderhistoryComponent } from './pages/customer-orderhistory/customer-orderhistory.component';
import { SubadminDeliverymanComponent } from './pages/subadmin-deliveryman/subadmin-deliveryman.component';
import { SubadminDeliverymandetailsComponent } from './pages/subadmin-deliverymandetails/subadmin-deliverymandetails.component';
import { CustomerOrdersummaryComponent } from './pages/customer-ordersummary/customer-ordersummary.component';
import { SubadminOrderItemsComponent } from './pages/subadmin-order-items/subadmin-order-items.component';
import { authGuard } from './auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
 { path: 'subadmin/dashboard', component: SubadminComponent ,canActivate: [authGuard]},
  { path: 'customer/dashboard', component: DashboardComponent,canActivate: [authGuard] },
  {path:'subadmin/customers',component:CustomerInfoComponent,canActivate: [authGuard]},
   { path: 'customers/info/:id', component: CustomerDetailsComponent,canActivate: [authGuard] },
   {path:'',component:LoginComponent},
  { path: 'customer/order_history', component: CustomerOrderhistoryComponent,canActivate: [authGuard] },
  { path: 'subadmin/deliveryman', component:SubadminDeliverymanComponent,canActivate: [authGuard] },
  { path: 'subadmin/deliveryman/1', component: SubadminDeliverymandetailsComponent,canActivate: [authGuard] },
  { path: 'customer/order_summary', component: CustomerOrdersummaryComponent ,canActivate: [authGuard]},
  { path: 'subadmin/orders', component:SubadminOrderItemsComponent ,canActivate: [authGuard]},
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
