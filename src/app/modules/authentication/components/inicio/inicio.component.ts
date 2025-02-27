import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'auth-inicio',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  private dialog = inject(MatDialog)

  //metodo para abrir el modal
  loginUsuario(){
    this.dialog.open(ModalLoginComponent, {
      disableClose: false
    }).afterClosed()
    .subscribe( result => {
      // console.log('el modal se cerro con resultado:',result);
    })
  }

}
