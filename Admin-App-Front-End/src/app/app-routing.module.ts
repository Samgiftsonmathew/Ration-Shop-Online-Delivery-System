import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SubAdminsListComponent } from './pages/subadminlist/subadminlist.component';
import { ProductsComponent } from './pages/products/products.component';
import { CustomerListComponent } from './pages/customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from './pages/customer/customer-detail/customer-detail.component';
import { CustomerEditComponent } from './pages/customer/customer-edit/customer-edit.component';
import { DeliveryManComponent } from './pages/delivery-man/delivery-man.component';
import { CustomerCreateComponent } from './pages/customer/customer-create/customer-create.component';
import { authGuard } from './Services/auth.guard'; // ✅ Import guard

const routes: Routes = [
 { path: 'login', component: LoginComponent },

  // ✅ Protected Routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'subadmin', component: SubAdminsListComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'delivery', component: DeliveryManComponent, canActivate: [authGuard] },

  { path: 'customers/create', component: CustomerCreateComponent, canActivate: [authGuard] },
  { path: 'customers/edit/:id', component: CustomerEditComponent, canActivate: [authGuard] },
  { path: 'customers/:id', component: CustomerDetailComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomerListComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }














// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { LoginComponent } from './pages/login/login.component';
// import { SubAdminsListComponent } from './pages/subadminlist/subadminlist.component';
// import { ProductsComponent } from './pages/products/products.component';
// import { CustomerListComponent } from './pages/customer/customer-list/customer-list.component';
// import { CustomerDetailComponent } from './pages/customer/customer-detail/customer-detail.component';
// import { CustomerEditComponent } from './pages/customer/customer-edit/customer-edit.component';
// import { DeliveryManComponent } from './pages/delivery-man/delivery-man.component';
// import { CustomerCreateComponent } from './pages/customer/customer-create/customer-create.component';
// import { authGuard } from './Services/auth.guard'; // ✅ Import guard

// const routes: Routes = [
//   { path: 'login', component: LoginComponent },

//   // ✅ Protected Routes
//   { path: 'dashboard', component: DashboardComponent},
//   { path: 'subadmin', component: SubAdminsListComponent},
//   { path: 'products', component: ProductsComponent},
//   { path: 'delivery', component: DeliveryManComponent},

//   { path: 'customers/create', component: CustomerCreateComponent},
//   { path: 'customers/edit/:id', component: CustomerEditComponent},
//   { path: 'customers/:id', component: CustomerDetailComponent},
//   { path: 'customers', component: CustomerListComponent},


//   { path: '**', redirectTo: 'login' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
