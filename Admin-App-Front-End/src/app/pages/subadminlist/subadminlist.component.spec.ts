import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminlistComponent } from './subadminlist.component';

describe('SubadminlistComponent', () => {
  let component: SubadminlistComponent;
  let fixture: ComponentFixture<SubadminlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubadminlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubadminlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
