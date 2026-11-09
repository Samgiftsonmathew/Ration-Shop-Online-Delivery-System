import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminDeliverymanComponent } from './subadmin-deliveryman.component';

describe('SubadminDeliverymanComponent', () => {
  let component: SubadminDeliverymanComponent;
  let fixture: ComponentFixture<SubadminDeliverymanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubadminDeliverymanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubadminDeliverymanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
