import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SubadminComponent } from './pages/subadmin/subadmin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
import { CustomerInfoComponent } from './pages/customer-info/customer-info.component';
import { LoginComponent } from './pages/login/login.component';



import { CustomerOrdersummaryComponent } from './pages/customer-ordersummary/customer-ordersummary.component';
import { SubadminOrderItemsComponent } from './pages/subadmin-order-items/subadmin-order-items.component';
import { SubadminNavComponent } from './pages/subadmin-nav/subadmin-nav.component';
import { CustomerNavComponent } from './pages/customer-nav/customer-nav.component';
import { SubadminDeliverymandetailsComponent } from './pages/subadmin-deliverymandetails/subadmin-deliverymandetails.component';
import { SubadminDeliverymanComponent } from './pages/subadmin-deliveryman/subadmin-deliveryman.component';
import { CustomerOrderhistoryComponent } from './pages/customer-orderhistory/customer-orderhistory.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  
  declarations: [
    AppComponent,
    DashboardComponent,
    SubadminComponent,
    CustomerDetailsComponent,
    CustomerInfoComponent,
    LoginComponent,
    DashboardComponent,
    CustomerOrdersummaryComponent,
    SubadminOrderItemsComponent,
    SubadminNavComponent,
    CustomerNavComponent,
    SubadminDeliverymandetailsComponent,
    SubadminDeliverymanComponent,
    CustomerOrderhistoryComponent,
    NotFoundComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,       
    RouterModule,
    
    
    HttpClientModule     
  ],

   exports: [SubadminNavComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

