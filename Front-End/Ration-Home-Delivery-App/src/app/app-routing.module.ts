import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { CustomerInfoComponent } from './pages/customer-info/customer-info.component';
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
const routes: Routes = [
  {path:" ",component:DashboardComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:'info',component:CustomerInfoComponent},
  {path: 'customers/1', component: CustomerDetailsComponent },
  {path: '', component: LoginComponent}]





@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
