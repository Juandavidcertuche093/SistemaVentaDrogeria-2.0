import { Component, computed, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

//angular/material
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

//interfaces
import { Medicamento } from '../../../../core/interface/medicamento.interface';
import { DetalleVenta } from '../../../../core/interface/detalleVenta.interface';
import { Venta } from '../../../../core/interface/venta.interface';

//servicios
import { VentaService } from '../../services/venta.service';
import { MedicamentoVentaService } from '../../../sales/services/medicamento-venta.service';
import { UtilidadService } from '../../../../services/utilidad.service';
import { AuthUsuarioService } from '../../../authentication/services/auth-usuario.service';

@Component({
  selector: 'app-sales-pages',
  imports: [
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    CdkTableModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './sales-pages.component.html',
  styleUrl: './sales-pages.component.scss'
})
export class SalesPagesComponent implements OnInit {

  //PROPIEDADES Y VARIABLES
  listaMedicamentos: Medicamento[]=[]//almacena la lista de todos los mendicamentos activos y con stock mayor a 0
  listaMedicamentosFiltro: Medicamento[]=[]//almacena lista de mendicamento filtrados segun la busqueda realizada
  listaMedicamentosParaVenta: DetalleVenta[]=[]//contiene la lista medicamentos que se han selecionado para la venta
  bloquearBotonRegistro: boolean = false//se utiliza para deshabilitar el boton de registro de la veta
  medicamentoSeleccionado!: Medicamento//almacena el medicamento que el usuario a seleccionado para agragar a la venta
  tipoPagoDefecto: string = 'Efectivo'
  totalApagar: number = 0


  formularioMedicamentoVenta: FormGroup;
  columnasTabla: string[] = ["medicamento","cantidad","precio","total","accion"];
  datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta);

  //FUNCION QUE NOS SIRVE PARA BUSCAR EL MEDICAMENTO POR SU NOMBRE
  retornaMedicamentosPorFiltro(search: string | Medicamento):Medicamento[]{
    const valorBuscado = typeof search === 'string' ? search.toLocaleLowerCase(): search.nombre.toLocaleLowerCase();
    return this.listaMedicamentos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado))
  }

  constructor(
    private fb: FormBuilder,
    private medicamentosVentaService: MedicamentoVentaService,
    private authusuarioService:  AuthUsuarioService,
    private ventaService: VentaService,
    private utilidadService: UtilidadService
  ){
    this.formularioMedicamentoVenta = this.fb.nonNullable.group({
      medicamento:["",[Validators.required]],
      cantidad:["",[Validators.required]]
    })

    //LISTA DE MEDICAMENTOS ACTIVOS Y CON STOCK MAYOR 0
    this.medicamentosVentaService.lista()
    .subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Medicamento[];
          this.listaMedicamentos = lista.filter(p => p.esActivo == 1 && p.stock > 0)
        }
      },
      error: (e) => {}
    })
    //FILTRAR MEDICAMENTOS POR NOMBRE EN EL FORMUALRIO
    this.formularioMedicamentoVenta.get('medicamento')?.valueChanges
    .subscribe(value => {
      this.listaMedicamentosFiltro = this.retornaMedicamentosPorFiltro(value)
    })

  }

  ngOnInit(): void {
  }

  //METODO PARA MOSTRAR EL NOMBRE DEL MEDICAMENTO SELECCIONADO
  mostrarMedicamento(medicamento: Medicamento): string {
    return medicamento.nombre
  }

  //ASIGNAR EL MEDICAMENTO SELECCIONADO AL OBJETO MEDICAMENTOSELECCIONADO
  medicamentoParaVenta(event: MatAutocompleteSelectedEvent) {
    this.medicamentoSeleccionado = event.option.value as Medicamento; // Asegura que sea del tipo Medicamento
  }

  //METODO PÁRA AGREGAR EL MEDICAMENTO
  agregarMedicamentoParaVenta() {
    const _cantidad: number = this.formularioMedicamentoVenta.value.cantidad;
    const _precio: number = parseFloat(this.medicamentoSeleccionado.precio);
    const _total: number = _cantidad * _precio;

    // Validar si el stock es suficiente
    if (this.medicamentoSeleccionado.stock < _cantidad) {
      this.utilidadService.mostrarAlerta('No hay suficiente stock para este medicamento', 'Oops');
      return;
    }

    // Si el stock es suficiente, proceder a agregar el medicamento a la venta
    this.totalApagar = this.totalApagar + _total;

    this.listaMedicamentosParaVenta.push({
      idMedicamento: this.medicamentoSeleccionado.idMedicamento,
      descripcionMedicamento: this.medicamentoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio),
      totalTexto: String(_total)
    });

    this.datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta);

    // Restablecer el formulario
    this.formularioMedicamentoVenta.patchValue({
      producto: "",
      cantidad: ""
    });
  }

  //ELIMINAR UN MEDICAMENTO DE LISTA DE DE VENTA
  eliminarMendicamento(detalle: DetalleVenta){
    this.totalApagar = this.totalApagar - parseFloat(detalle.totalTexto)
    this.listaMedicamentosParaVenta = this.listaMedicamentosParaVenta.filter(p => p.idMedicamento !== detalle.idMedicamento)

    this.datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta)
  }


  //REGISTRAR LA VENTA
  registrarVenta(){
    if (this.listaMedicamentosParaVenta .length > 0) {
      this.bloquearBotonRegistro = true

      // Obtener información del usuario desde la sesión
      const usuarioSesion = this.authusuarioService.currentUser();
      const idUsuario = usuarioSesion ? usuarioSesion.idUsuario : '';
      const UsuarioDescripcion = usuarioSesion ? usuarioSesion.rolDescripcion : '';

      const request: Venta = {
        tipoPago: this.tipoPagoDefecto,
        totalTexto: String(this.totalApagar.toFixed()),//toFixed() a un número, puedes especificar cuántos dígitos decimales deseas que aparezcan
        IdUsuario: idUsuario, // Incluimos el ID del usuario logueado
        usuarioDescripcion: UsuarioDescripcion, // Incluimos la descripción del usuario (rol)
        detalleventa: this.listaMedicamentosParaVenta
      }

      this.ventaService.registrar(request)
      .subscribe({
        next: (response) => {
          if (response) {
            this.totalApagar = 0.00;
            this.listaMedicamentosParaVenta =[],
            this.datosDetalleVenta = new MatTableDataSource(this.listaMedicamentosParaVenta );

            Swal.fire({
              icon:'success',
              title: "Venta Registrada",
              text: `Numero de venta ${response.value.numDocumento}`
            })
          } else
            this.utilidadService.mostrarAlerta('No se pudo registrar la venta','Oops');
        },
        complete:() => {
          this.bloquearBotonRegistro = false;
        },
        error:(e) => {}
      })
    }
  }

}
