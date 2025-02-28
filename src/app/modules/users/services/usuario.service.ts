import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../../../core/interface/response.-api';
import { Usuario } from '../../../core/interface/usuario.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi:string = environment.API_URL + "Usuario/"

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardar(request: Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  editar(request: Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`,request)
  }

  actualizarEstado(id: number, esActivo: number): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}ActualizarEstado/${id}`, { esActivo });
  }

  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
