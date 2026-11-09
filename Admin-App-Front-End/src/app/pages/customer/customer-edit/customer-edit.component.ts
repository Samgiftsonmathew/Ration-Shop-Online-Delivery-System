import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../customer.service';
import { Customer, Region } from '../customer.model';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
})
export class CustomerEditComponent implements OnInit {
  form!: FormGroup;
  customerId!: number;
  cardTypes: string[] = [];
  regions: Region[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomerService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      smartcardNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      cardType: ['PHH', Validators.required],
      createdDate: ['', Validators.required],
      address: ['', Validators.required],
      regionId: [null, Validators.required],
      role: ['USER'],
    });

    this.loadCardTypes();
    this.loadRegions().then(() => this.loadCustomer());
  }

  loadCardTypes(): void {
    this.http
      .get<string[]>('http://192.168.18.49:8080/enums/card-types')
      .subscribe({
        next: (data) => (this.cardTypes = data),
        error: (err) => console.error('❌ Failed to load card types:', err),
      });
  }

  loadRegions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<Region[]>('http://192.168.18.49:8080/regions').subscribe({
        next: (data) => {
          this.regions = data;
          resolve();
        },
        error: (err) => {
          console.error('❌ Failed to load regions:', err);
          reject(err);
        },
      });
    });
  }

  loadCustomer(): void {
    this.service.getCustomerById(this.customerId).subscribe({
      next: (data) => this.initForm(data),
      error: (err) => {
        console.error('❌ Failed to fetch customer:', err);
        this.router.navigate(['/customers']);
      },
    });
  }

  initForm(customer: Customer): void {
    const createdDateFormatted = customer.createdDate
      ? this.formatDateForInput(customer.createdDate)
      : '';

    this.form.patchValue({
      name: customer.name,
      email: customer.email,
      smartcardNo: customer.smartcardNo,
      phone: customer.phone,
      regionId: Number(customer.regionId),
      cardType: customer.cardType,
      address: customer.address,
      createdDate: createdDateFormatted,
      role: 'USER',
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  updateCustomer(): void {
    if (this.form.valid) {
      const updatedData: Customer = {
        ...this.form.value,
        id: this.customerId,
        regionId: Number(this.form.value.regionId),
        role: 'USER',
      };

      this.service.updateCustomer(this.customerId, updatedData).subscribe({
        next: () => {
          console.log('✅ Customer updated');
          this.router.navigate(['/customers']);
        },
        error: (err) => console.error('❌ Failed to update customer:', err),
      });
    } else {
      console.warn('❌ Form is invalid');
    }
  }

  backToList(): void {
    this.router.navigate(['/customers']);
  }
}
