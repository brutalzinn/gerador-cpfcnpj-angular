import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IReceitaWS } from '../receitaws.intefaces';
import { Observable } from 'rxjs';
import { FiltroSituacao, FiltroSocio } from '../filtro.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpGeradorDeDadosService {

  constructor(private http: HttpClient){

  }
  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'ApiKey': environment.envVar.apiKey
  })
  };

  obterDadosReceitaWS(filtrosocio: FiltroSocio, filtroSituacao: FiltroSituacao, normalizado: boolean) : Observable<IReceitaWS> {
    return this.http.get<IReceitaWS>(`${environment.envVar.baseUrl}/obterCNPJValido/${filtrosocio}/${filtroSituacao}/${normalizado}/false`, this.httpOptions);
  }

}
