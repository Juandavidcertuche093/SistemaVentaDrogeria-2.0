import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//interfaces
import { ResponseApi } from '../../../core/interface/response.-api';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoVentaService {

  private urlApi: string = environment.API_URL + "Medicamento/"

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
}
