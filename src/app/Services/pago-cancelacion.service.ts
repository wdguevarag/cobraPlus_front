import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoCancelacionService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Operacion.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  getPagosACancelar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLPP&empresaID=${this.empresaID}`);
  }

  getPagoACancelarById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'ODP')
      .set('v_ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getExtornoByPagoID(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OEXTPAGCAN')
      .set('v_ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  createTransferencia(formData: any): Observable<any> {
    if(formData instanceof FormData) {
      formData.append('codOpe', 'CTSPAC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CTSPAC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  createCancelacionPago(formData: any): Observable<any> {
    if(formData instanceof FormData) {
      formData.append('codOpe', 'CNPAGCAN');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CNPAGCAN')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }
}
