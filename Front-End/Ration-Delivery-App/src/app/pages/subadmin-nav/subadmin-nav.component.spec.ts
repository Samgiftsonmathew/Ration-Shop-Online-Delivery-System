import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminNavComponent } from './subadmin-nav.component';

describe('SubadminNavComponent', () => {
  let component: SubadminNavComponent;
  let fixture: ComponentFixture<SubadminNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubadminNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubadminNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
