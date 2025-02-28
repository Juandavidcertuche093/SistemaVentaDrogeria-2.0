import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalmedicamentosComponent } from './modalmedicamentos.component';

describe('ModalmedicamentosComponent', () => {
  let component: ModalmedicamentosComponent;
  let fixture: ComponentFixture<ModalmedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalmedicamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalmedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
