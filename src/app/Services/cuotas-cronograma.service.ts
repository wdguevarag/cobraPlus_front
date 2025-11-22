import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuotasCronogramaService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Cronograma.php';

  constructor(private http: HttpClient) { }

  // GET

  getCuotaCronogramaByCreditIdAndEstadoCronograma(id_credito: number, estado_cronograma: number): Observable<any> {
    const params = { codOpe: 'OCCronograma', id_credito: id_credito, estado_cronograma: estado_cronograma };
    return this.http.get<any>(this.apiUrl, { params });
  }

  getCreditoCronogramaByFecha(fechaPago: string, credito_id: number, valor: number): Observable<any> {
    const params = { codOpe: 'OCCBFecha', fechaPago: fechaPago, credito_id: credito_id, valor: valor };
    return this.http.get<any>(this.apiUrl, { params });
  }

  getKardexCronogramaByCreditoId(id_credito: number): Observable<any> {
    const params = { codOpe: 'OCKardex', id_credito: id_credito };
    return this.http.get<any>(this.apiUrl, { params });
  }

  getInfoDesembolsoCronograma(id_credito: number): Observable<any> {
    const params = { codOpe: 'ODDCronograma', id_credito: id_credito };
    return this.http.get<any>(this.apiUrl, { params });
  }

  getEstadoCuentaCronogramaByCreditoId(id_credito: number): Observable<any> {
    const params = { codOpe: 'OCECuenta', id_credito: id_credito };
    return this.http.get<any>(this.apiUrl, { params });
  }

  getClienteSolicitudRefinanciacion(id_refinanciacion: number): Observable<any[]> {
    const params = { codOpe: 'OCSREFINANCI', id_refinanciacion: id_refinanciacion.toString() };
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getClienteSolicitudCronograma(id_cronograma: number): Observable<any[]> {
    const params = { codOpe: 'OCSCRONOGR', id_cronograma: id_cronograma };
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  anularCreditoRefinanciacion(id_credito_anterior: number, id_credito_actual: number, id_refinanciacion: number): Observable<any[]> {
    const params = { codOpe: 'ACREFINANCI', id_credito_anterior: id_credito_anterior, id_credito_actual: id_credito_actual, id_refinanciacion: id_refinanciacion };
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
