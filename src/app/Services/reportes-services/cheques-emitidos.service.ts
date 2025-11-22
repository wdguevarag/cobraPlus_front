import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChequesEmitidosService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php'

  constructor(private http: HttpClient) {}

  getChequesEmitidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLCHE`)
  }
}
