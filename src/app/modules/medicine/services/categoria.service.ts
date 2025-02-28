import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

//interfaces
import { ResponseApi } from '../../../core/interface/response.-api';
import { Categoria } from '../../../core/interface/categoria.intercafe';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlApi: string = environment.API_URL + "Categoria/"

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
    .pipe(
      catchError((error) => {
        console.error('Error al obtener la lista de las categorias')
        return of({ status:false, msg: 'Error al obtenr la lista', value: null})
      })
    )
  }

  guardar(request: Categoria):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,request)
    .pipe(
      catchError((error) => {
        console.error('Error al guardar categoria')
        return of({ status: false, msg:'Error al guardar categoria', value: null})
      })
    )
  }


}

