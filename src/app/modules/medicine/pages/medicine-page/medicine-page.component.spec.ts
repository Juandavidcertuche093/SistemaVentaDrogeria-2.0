import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinePageComponent } from './medicine-page.component';

describe('MedicinePageComponent', () => {
  let component: MedicinePageComponent;
  let fixture: ComponentFixture<MedicinePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicinePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
