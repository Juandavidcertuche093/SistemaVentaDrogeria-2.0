import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

//interfaces
import { ResponseApi } from '../../../core/interface/response.-api';
import { Medicamento } from '../../../core/interface/medicamento.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private urlApi: string = environment.API_URL + "Medicamento/"

  private http = inject(HttpClient)

  constructor() { }

  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`).pipe(
      catchError((error) => {
        console.error('Error al obtener la lista de medicamentos:', error);
        return of({ status: false, msg: 'Error al obtener la lista', value: null });
      })
    );
  }

  guardar(request: Medicamento): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request).pipe(
      catchError((error) => {
        console.error('Error al guardar el medicamento:', error);
        return of({ status: false, msg: 'Error al guardar el medicamento', value: null });
      })
    );
  }

  editar(request: Medicamento): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request).pipe(
      catchError((error) => {
        console.error('Error al editar el medicamento:', error);
        return of({ status: false, msg: 'Error al editar el medicamento', value: null });
      })
    );
  }

  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar el medicamento:', error);
        return of({ status: false, msg: 'Error al eliminar el medicamento', value: null });
      })
    );
  }
}
