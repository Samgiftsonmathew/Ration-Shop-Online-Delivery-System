import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersTabComponent } from './components/dashboard/orders-tab/orders-tab.component';
import { HistoryTabComponent } from './components/dashboard/history-tab/history-tab.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'orders', component: OrdersTabComponent },
      { path: 'history', component: HistoryTabComponent },
      { path: 'order-details/:id', component: OrderDetailsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
