import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApiSesion } from '../../core/interface/response-api-sesion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private urlApi:string = environment.API_URL + "Medicamento/";

  private http = inject(HttpClient)

  constructor() { }

  // Llama al backend para obtener medicamentos con stock bajo
  btenerMedicamentosConStockBajo(stockMinimo: number = 10): Observable<ResponseApiSesion[]> {
    return this.http.get<ResponseApiSesion[]>(`${this.urlApi}MedicamentosStockBajo`, {
      params: { stockMinimo: stockMinimo }
    });
  }
}

