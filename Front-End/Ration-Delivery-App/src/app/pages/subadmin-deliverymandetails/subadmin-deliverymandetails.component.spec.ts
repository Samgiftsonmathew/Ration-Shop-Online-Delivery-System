import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminDeliverymandetailsComponent } from './subadmin-deliverymandetails.component';

describe('SubadminDeliverymandetailsComponent', () => {
  let component: SubadminDeliverymandetailsComponent;
  let fixture: ComponentFixture<SubadminDeliverymandetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubadminDeliverymandetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubadminDeliverymandetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
