import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { Sesion } from '../../../core/interface/sesion.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { ResponseApiSesion } from '../../../core/interface/response-api-sesion';

@Injectable({
  providedIn: 'root'
})
export class AuthUsuarioService {

  private readonly baseUrl: string = environment.API_URL + "usuario/"
  private http = inject(HttpClient)
  private router = inject(Router)
  private tokenService = inject(TokenService)

  private _currentUser = signal<Sesion|null>(null)//señal que almacena el usuario actual


  // Propiedad computada que expone el usuario actual al mundo exterior
  public currentUser = computed(() => this._currentUser())

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  //Metodo para redirigir el usuario segun su Rol
  public redirectBasedOnRole(): void {
    const usuario = this._currentUser();
    if (!usuario) {
      this.router.navigate(['/inicio'])//si no hay usuario, redirige al inicio
      return;
    }

    if (usuario.rolDescripcion === 'Administrador') {
      this.router.navigate(['/dashboard']);
    } else if (usuario.rolDescripcion === 'Empleado') {
      this.router.navigate(['/venta'])
    } else {
      this.router.navigate(['401'])//rol no reconocido
    }
  }

  //metodo para establecer el usuario actual, guarda el token en el tokenService (Cookies)
  private setAuthentication(user: Sesion, token: string): boolean{
    this._currentUser.set(user)
    this.tokenService.saveToken(token)
    return true
  }


  login(correo: string, clave: string): Observable<'invalid-credentials' | 'server-error' | 'user-inactive' | 'success'> {
    const url = `${this.baseUrl}IniciarSesion`;
    const body = { correo, clave };

    return this.http.post<ResponseApiSesion>(url, body)
      .pipe(
        map(response => {
          if (response.status && response.value) {
            const { value: user } = response;
            const { token } = user;
            this.setAuthentication(user, token); // Establece la autenticación
            return 'success' as const;
          } else {
            return 'invalid-credentials' as const;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error("Error en la autenticación:", error);

          // Verifica si el error es porque las credenciales son incorrectas
          if (error.status === 400 && error.error?.msg === "Credenciales incorrectas") {
            return of('invalid-credentials' as const);
          }

          // Verifica si el error es porque el usuario está inactivo
          if (error.status === 403 && error.error?.msg === "Usuario inactivo, no puede iniciar sesión") {
            return of('user-inactive' as const);
          }

          // Redirige a la página de error en caso de error del servidor
          this.router.navigate(['/error500']);
          return of('server-error' as const);
        })
      );
  }


  // Método para verificar el estado de autenticación
  checkAuthStatus(): Observable<boolean> {

    const url = `${this.baseUrl}VerificarSesion`
    const token = this.tokenService.getToken();

    if (!token) {
      this.logout();//cierra la sesion si no hay token
      return of(false)
    }

    const headers = new HttpHeaders()
    .set( 'Authorization', `Bearer ${token}` )

    return this.http.get<ResponseApiSesion>(url, { headers })//establece la autenticacion
      .pipe(
        map( response => {
          if ( response.status && response.value ) {
            const { value: user } = response
            const { token } = user
            return this.setAuthentication(user, token)//establece la autenticacion
          }
          return false
        }),
        catchError( () => {
          this.logout()//cierra la sesion
          return of(false)
        })
      )
    }

    logout(){
      this.tokenService.removeToken()//elimina el token
      this._currentUser.set(null)//limpia el usuari actaul
    }
}
