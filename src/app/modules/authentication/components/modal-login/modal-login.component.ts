import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthUsuarioService } from '../../services/auth-usuario.service';
import { faPen, faEye, faEyeSlash, faUser, faUserCircle, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { UtilidadService } from '../../../../services/utilidad.service';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';

import { Router } from '@angular/router';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-modal-login',
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.scss'
})
export class ModalLoginComponent {

  formulariLogin: FormGroup;
  showPassword = false;
  mostrarLoading:boolean=false;

  faPen = faPen;
  faEye = faEye;
  faUser = faUser
  faEyeSlash = faEyeSlash;
  faUserCircle = faUserCircle;
  faUserMd = faUserMd

  constructor(
    private modalActual: MatDialogRef<ModalLoginComponent>,
    private fb: FormBuilder,
    private authusuarioService: AuthUsuarioService,
    private utilidadServicio: UtilidadService,
    private router: Router
  ){
    this.formulariLogin = this.fb.nonNullable.group({
      email:    ['juancho@google.com', [Validators.required, Validators.email] ],
      password: ['123456', [ Validators.required, Validators.minLength(6)] ]
    })
  }

  login() {
    if (this.formulariLogin.invalid) {
      return;
    }

    this.mostrarLoading = true;
    const { email, password } = this.formulariLogin.value;

    this.authusuarioService.login(email, password)
      .subscribe((result) => {
        this.mostrarLoading = false;

        switch (result) {
          case 'invalid-credentials':
            this.utilidadServicio.mostrarAlerta(
              "Nombre o contraseña incorrectos. Por favor, verifique sus credenciales e inténtelo nuevamente.",
              "Oops"
            );
            break;

          case 'user-inactive':
            Swal.fire({
              title: "Cuenta Inactiva",
              text: "Su cuenta está desactivada. Por favor, contacte al administrador.",
              icon: "info"
            });
            break;

          case 'server-error':
            this.modalActual.close(); // Cierra el modal si hay error de servidor
            break;

          case 'success':
            this.authusuarioService.redirectBasedOnRole(); // Redirige según el rol
            this.modalActual.close('success'); // Cierra el modal con éxito
            break;
        }
      });
  }

}
