import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

//angular Material
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DialogModule} from '@angular/cdk/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

//compoenente modal
import {ModalmedicamentosComponent} from '../../components/modalmedicamentos/modalmedicamentos.component';
import {ModalcategoriaComponent} from '../../components/modalcategoria/modalcategoria.component'

//interface
import { Medicamento } from '../../../../core/interface/medicamento.interface';

//servicios
import { MedicamentoService } from '../../services/medicamento.service';
import { UtilidadService } from '../../../../services/utilidad.service';
import Swal from 'sweetalert2';

//PrimeNG
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-medicine-page',
  imports: [
    MatTableModule,
    CdkTableModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatMomentDateModule,
    TableModule,
    BadgeModule,
    ButtonModule
  ],
  templateUrl: './medicine-page.component.html',
  styleUrl: './medicine-page.component.scss'
})
export class MedicinePageComponent implements OnInit, AfterViewInit {

  columnaTabla: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado','fechavencimineto','especificaciones','acciones'];
  dataInicio:Medicamento[]=[];
  dataListaMedicamentos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private medicamentoServicio: MedicamentoService,
    private utilidadServicio: UtilidadService
  ){}

  obtenerMedicamentos(){
    this.medicamentoServicio.lista()
    .subscribe({
      next:(data) => {
        if(data.status)
          this.dataListaMedicamentos.data = data.value;
        else
        this.utilidadServicio.mostrarAlerta('No se encontraron datos','Ooops!')
      },
      error:(e)=>{}
    })
  }

  ngOnInit(): void {
    this.obtenerMedicamentos();
  }

  //en esta parte crearemos la paginacion con este evento (AfterViewInit)
  ngAfterViewInit(): void {
    this.dataListaMedicamentos.paginator = this.paginacionTabla
  }

  //metodo para filtrar
  aplicarFiltroTabla(event: Event, dt: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filterGlobal(filterValue, 'contains');
  }

  //metodo para el valor del stock
  getStockClass(stock: number): string {
    if (stock > 10) return 'stock-alto';
    if (stock > 0) return 'stock-bajo';
    return '';
  }

  //metodo para el modal de crear pmedicamento
  nuevoMedicamento(){
    this.dialog.open(ModalmedicamentosComponent,{
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true')this.obtenerMedicamentos();
    });
  }

  //metodo para el modal de actualizar medicamento
  editarMedicamento(producto:Medicamento){
    this.dialog.open(ModalmedicamentosComponent,{
      disableClose:true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true')this.obtenerMedicamentos();
    });
  }

  //metodo para el modal de crear categoria
  nuevaCategoria(){
    this.dialog.open(ModalcategoriaComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true')this.obtenerMedicamentos();
    })
  }

  //metodo para elimainar un usuario
  eliminarMedicamento(producto:Medicamento){
    //libreria de alertas personalizadas
    Swal.fire({
      title:'¿Desea eliminar el Medicamento',
      text: producto.nombre,
      icon:'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton:true,
      cancelButtonColor: '#d33',
      cancelButtonText:'No, volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this.medicamentoServicio.eliminar(producto.idMedicamento)
        .subscribe({
          next:(data) => {
            if(data.status){
              this.utilidadServicio.mostrarAlerta("El medicamento fue eliminado","Listo!");
              this.obtenerMedicamentos();
            }else
            this.utilidadServicio.mostrarAlerta("No se pudo eliminar el medicamento","Error");
          },
          error:(e) => {}
        })
      }
    })
  }

}
