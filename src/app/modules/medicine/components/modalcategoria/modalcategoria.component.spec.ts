import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcategoriaComponent } from './modalcategoria.component';

describe('ModalcategoriaComponent', () => {
  let component: ModalcategoriaComponent;
  let fixture: ComponentFixture<ModalcategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalcategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalcategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
