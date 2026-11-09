import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderhistoryComponent } from './customer-orderhistory.component';

describe('CustomerOrderhistoryComponent', () => {
  let component: CustomerOrderhistoryComponent;
  let fixture: ComponentFixture<CustomerOrderhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerOrderhistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrderhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
