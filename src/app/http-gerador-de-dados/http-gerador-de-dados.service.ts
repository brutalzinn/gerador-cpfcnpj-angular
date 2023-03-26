import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IReceitaWS } from '../receitaws.intefaces';
import { Observable } from 'rxjs';
import { FiltroSocio } from '../filtrosocio.enum';

@Injectable({
  providedIn: 'root'
})
export class HttpGeradorDeDadosService {

  constructor(private http: HttpClient){

  }
  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: environment.apiKey
  })
};
  obterDadosReceitaWS(filtrosocio: FiltroSocio, normalizado: boolean) : Observable<IReceitaWS> {
    return this.http.get<IReceitaWS>(`${environment.baseUrl}/obterCNPJValido/${filtrosocio}/Aleatorio/${normalizado}`, this.httpOptions);
  }

}
