import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

// import { CustomerComponent } from './pages/customer/customer.component';

import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerInfoComponent } from './pages/customer-info/customer-info.component';
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';

import { CommonModule } from '@angular/common';
@NgModule({

  declarations: [
    AppComponent,
    CustomerComponent,
    CustomerInfoComponent,
    CustomerDetailsComponent,
    DashboardComponent,
    LoginComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
