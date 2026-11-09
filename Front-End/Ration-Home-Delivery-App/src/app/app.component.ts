import { Component } from '@angular/core';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [DashboardComponent]
})
export class AppComponent {
  title = 'Ration-Home-Delivery-App';
}
