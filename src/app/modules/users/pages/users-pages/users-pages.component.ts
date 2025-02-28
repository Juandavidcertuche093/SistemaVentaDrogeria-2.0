import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'

//angular material
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
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

//interfaces
import { Usuario } from '../../../../core/interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { UtilidadService } from '../../../../services/utilidad.service';

//componete modoal
import { ModalRegistroComponent } from '../../components/modal-registro/modal-registro.component';


@Component({
  selector: 'app-users-pages',
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
    MatSlideToggleModule
  ],
  templateUrl: './users-pages.component.html',
  styleUrl: './users-pages.component.scss'
})
export class UsersPagesComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescription', 'estado', 'acciones'];
  dataInicio: Usuario[] = []
  datalistaUsuario = new MatTableDataSource(this.dataInicio)
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator

  private dialog = inject(MatDialog)
  private usuarioService = inject(UsuarioService)
  private utiliadService = inject(UtilidadService)

  obtenerUsuarios(){
    this.usuarioService.lista()
    .subscribe({
      next: (data) => {
        if(data.status)
          this.datalistaUsuario.data = data.value;
        else
        this.utiliadService.mostrarAlerta("No se encontraron datos","Ooops!")
      }
    })
  }


  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  //CREAMOS LA PAGINACION CON ESTE EVENTO (ngAfterViewInit)
  ngAfterViewInit(): void {
    this.datalistaUsuario.paginator = this.paginacionTabla
  }

  //METODO PARA FILTRAR
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value
    this.datalistaUsuario.filter = filterValue.trim().toLocaleLowerCase()
  }

  //METODO PARA EL MODAL DE CREAR USUARIO
  nuevoUsuario(){
    this.dialog.open( ModalRegistroComponent,{
      disableClose:true,
    }).afterClosed()
    .subscribe({
      next: (resultado) => {
        if(resultado === 'true')this.obtenerUsuarios()
      }
    })
  }

  //METODO PARA EL MODAL DE ACTUALIZAR USUARIO
  editarUsuario(usuario: Usuario){
    this.dialog.open( ModalRegistroComponent,{
      disableClose:true,
      data: usuario
    }).afterClosed()
    .subscribe({
      next:(resultado) => {
        if(resultado === 'true')this.obtenerUsuarios();
      },
    })
  }

  //METODO PARA CAMBIAR EL ESTADO DEL USURIO
  cambiarEstado(usuario: Usuario) {
    const nuevoEstado = usuario.esActivo === 1 ? 0 : 1;
    this.usuarioService.actualizarEstado(usuario.idUsuario, nuevoEstado)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.utiliadService.mostrarAlerta("Estado actualizado", "Listo!");
            this.obtenerUsuarios();
          } else {
            this.utiliadService.mostrarAlerta("No se pudo actualizar el estado", "Error");
          }
        },
        error: (e) => {
          this.utiliadService.mostrarAlerta("Error al actualizar el estado", "Error");
        }
      });
  }

  //METODO PARA ELIMINAR USUARIO
  eliminarUsuario(usuario: Usuario){
     //libreria de alertas personalizadas
     Swal.fire({
      title:'¿Desea eliminar el usuario',
      text: usuario.nombreCompleto,
      icon:'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton:true,
      cancelButtonColor: '#d33',
      cancelButtonText:'No, volver'
    }).then((resultado) => {

      if (resultado.isConfirmed) {
        this.usuarioService.eliminar(usuario.idUsuario)
        .subscribe({
          next: (data) => {
            if (data.status) {
              this.utiliadService.mostrarAlerta("El usuario fue eliminado","Listo!")
              this.obtenerUsuarios();
            } else
              this.utiliadService.mostrarAlerta("No se pudo eliminar el usuario","Error")
          },
          error:(e) => {}
        })
      }
    })
  }

}
