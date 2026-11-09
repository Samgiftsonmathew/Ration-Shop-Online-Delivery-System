import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css'],
})
export class CustomerCreateComponent implements OnInit {
  form!: FormGroup;
  regions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: CustomerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      smartcardNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      cardType: ['PHH', Validators.required],
      createdDate: [this.formatDateForInput(new Date()), Validators.required],
      address: ['', Validators.required],
      regionId: [null, Validators.required], // binds to dropdown
    });

    this.loadRegions();
  }

  private loadRegions() {
    this.service.getRegions().subscribe({
      next: (data) => (this.regions = data),
      error: (err) => console.error('❌ Failed to load regions:', err),
    });
  }

  private formatDateForInput(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  submit(): void {
    if (this.form.valid) {
      const customerData = {
        ...this.form.value,
        role: 'USER', // auto add
      };

      this.service.addCustomer(customerData).subscribe({
        next: () => {
          console.log('✅ Customer created successfully');
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          console.error('❌ Failed to create customer:', err);
        },
      });
    } else {
      this.form.markAllAsTouched();
      console.warn('❌ Form is invalid');
    }
  }

  backToList() {
    this.router.navigate(['/customers']);
  }
}
