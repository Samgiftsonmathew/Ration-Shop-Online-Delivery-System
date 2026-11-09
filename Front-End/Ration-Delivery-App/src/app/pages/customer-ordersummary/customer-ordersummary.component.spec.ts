import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrdersummaryComponent } from './customer-ordersummary.component';

describe('CustomerOrdersummaryComponent', () => {
  let component: CustomerOrdersummaryComponent;
  let fixture: ComponentFixture<CustomerOrdersummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerOrdersummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrdersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
