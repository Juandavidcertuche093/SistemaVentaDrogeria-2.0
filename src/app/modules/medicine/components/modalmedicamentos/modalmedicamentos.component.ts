import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//angular/material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

//interfaces
import {Categoria} from '../../../../core/interface/categoria.intercafe';
import {Medicamento} from '../../../../core/interface/medicamento.interface';
import { UtilidadService } from '../../../../services/utilidad.service';

//servicios
import { MedicamentoService } from '../../services/medicamento.service';
import { CategoriaService } from '../../services/categoria.service';

import moment from 'moment';

//Define el formato de fecha que se usará en el componente (DD/MM/YYYY).
export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}


@Component({
  selector: 'app-modalmedicamentos',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule
  ],
  templateUrl: './modalmedicamentos.component.html',
  styleUrl: './modalmedicamentos.component.scss',
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS},
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] } // Si usas Moment.js
  ]
})
export class ModalmedicamentosComponent {

  //PROPIEDADES
  formularioMedicamento: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategoria: Categoria[] = []//nos muestra las lista de las catgorias que se obtinen desde la base de datos

  constructor(
    private modalActual: MatDialogRef<ModalmedicamentosComponent>,
    @Inject(MAT_DIALOG_DATA) public datosMedicamento: Medicamento,
    private fb: FormBuilder,
    private categoriaServicio: CategoriaService,
    private medicamentoServicio: MedicamentoService,
    private utilidadServicio: UtilidadService
  ){
    this.formularioMedicamento = this.fb.nonNullable.group({
      nombre:['', [Validators.required]],
      idCategoria:['', [Validators.required]],
      stock:['', [Validators.required]],
      precio:['', [Validators.required]],
      esActivo:['1', [Validators.required]],
      fechaVencimiento:['', [Validators.required]],
      especificaciones:['', [Validators.required]],
    });
    if (this.datosMedicamento != null && this.datosMedicamento != undefined){
      this.tituloAccion = 'Editar';
      this,this.botonAccion = 'Actualizar';
    }
    //traemos las lista de las categorias
    this.categoriaServicio.lista()
    .subscribe({
      next:(data) => {
        if (data.status)
          this.listaCategoria = data.value
      },
      error: (e) => {}
    })
  }

  //si hay un medicamento en datosMedicamento (modo edición), se cargan los valores actuales del medicamento
  ngOnInit(): void {
    if(this.datosMedicamento !== null && this.datosMedicamento !== undefined)

      this.formularioMedicamento.patchValue({
        nombre: this.datosMedicamento.nombre,
        idCategoria: this.datosMedicamento.idCategoria,
        stock: this.datosMedicamento.stock,
        precio: this.datosMedicamento.precio,
        esActivo: this.datosMedicamento.esActivo,
        // fechaVencimiento: this.datosMedicamento.fechaVencimiento,
        fechaVencimiento: moment(this.datosMedicamento.fechaVencimiento, 'DD/MM/YYYY').toDate(), // Convierte el string a Date
        especificaciones: this.datosMedicamento.especificaciones
      });
  }

  guardarEditar_Medicamento(){
    //logica para crear y actualizar el medicamento
    const fechaVenc = this.formularioMedicamento.value.fechaVencimiento instanceof moment
    ? this.formularioMedicamento.value.fechaVencimiento.format('DD/MM/YYYY')
    : moment(this.formularioMedicamento.value.fechaVencimiento).format('DD/MM/YYYY'); // Convierte Date a string

    const _medicamento: Medicamento = {
      idMedicamento: this.datosMedicamento == null ? 0: this.datosMedicamento.idMedicamento,
      nombre: this.formularioMedicamento.value.nombre,
      idCategoria: this.formularioMedicamento.value.idCategoria,
      descripcionCategoria: "",// lo puedes dejar vacío si no se requiere
      stock: this.formularioMedicamento.value.stock,
      precio: this.formularioMedicamento.value.precio,
      esActivo: parseInt(this.formularioMedicamento.value.esActivo),
      fechaVencimiento: fechaVenc,// Aquí la fecha convertida a string
      especificaciones: this.formularioMedicamento.value.especificaciones
    }
    if (this.datosMedicamento == null) {
      //logica para creara medicamentos
      this.medicamentoServicio.guardar(_medicamento)
      .subscribe({
        next:(data) => {
          if (data.status) {
            this.utilidadServicio.mostrarAlerta('El medicamento se registro','Exito')
            this.modalActual.close('true')
          } else
            this.utilidadServicio.mostrarAlerta(data.msg,'Error')
        },
        error:(e) => {
          this.utilidadServicio.mostrarAlerta("Ocurrió un error al guardar el medicamento.", "Error");
        }
      })
    } else
      //logica para actualizar productos
      this.medicamentoServicio.editar(_medicamento)
      .subscribe({
        next:(data) => {
          if (data.status) {
            this.utilidadServicio.mostrarAlerta('El medicamento fue actualizado','Exito')
            this.modalActual.close('true')
          } else
            this.utilidadServicio.mostrarAlerta('No se pudo actualizar el medicamento','Error')
        },
        error:(e) => {}
      })
  }

}
