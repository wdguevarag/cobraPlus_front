import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtrosService {

  private apiUrl = SERVER_URL + 'ws_seguridad/ws_General.php';
  private apiUrlCreditos = SERVER_URL + 'ws_creditos/ws_General.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';
  //10
  constructor(private http: HttpClient) { }

  getClientesTransferirExistentes(clientId: number, asesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlCreditos}?codOpe=GCTExis&clientId=${clientId}&asesorId=${asesorId}&empresaID=${this.empresaID}`);
  }
}
