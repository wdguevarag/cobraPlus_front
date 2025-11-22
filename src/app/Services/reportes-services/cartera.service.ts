import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(private http: HttpClient) {}

  getCartera(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLCAR&Empresa_ID=${empresaID}`);
  }
}
