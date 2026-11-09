import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminOrderItemsComponent } from './subadmin-order-items.component';

describe('SubadminOrderItemsComponent', () => {
  let component: SubadminOrderItemsComponent;
  let fixture: ComponentFixture<SubadminOrderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubadminOrderItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubadminOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
