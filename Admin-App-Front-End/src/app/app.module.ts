import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { ProductsComponent } from './pages/products/products.component';
import { SubAdminsListComponent } from './pages/subadminlist/subadminlist.component';
import { DeliveryManComponent } from './pages/delivery-man/delivery-man.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { CustomerDetailComponent } from './pages/customer/customer-detail/customer-detail.component';
import { CustomerEditComponent } from './pages/customer/customer-edit/customer-edit.component';
import { CustomerCreateComponent } from './pages/customer/customer-create/customer-create.component';
import { CustomerListComponent } from './pages/customer/customer-list/customer-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    SubAdminsListComponent,
    DeliveryManComponent,
    CustomerListComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CustomerCreateComponent,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),

    // Standalone components go here:
    DashboardComponent,
    LoginComponent,
    CustomerDetailComponent,
    CustomerEditComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
