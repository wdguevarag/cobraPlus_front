import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiroNegocioService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Parametro.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // GET: obtener todas las Condonaciones
  getGirosNegocio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OGN`);
  }

}