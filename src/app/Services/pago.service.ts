import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = SERVER_URL + 'ws_creditos/ws_Operacion.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) {}

  getPagosGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLP&empresaID=${this.empresaID}`);
  }

  
  getPagosPendientes(usuarioID?: number): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    const baseUrl = `${this.apiUrl}?codOpe=OPP&empresaID=${empresaID}`;
    const finalUrl = usuarioID ? `${baseUrl}&usuarioID=${usuarioID}` : baseUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getPagosRealizados(usuarioID?: number): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    const baseUrl = `${this.apiUrl}?codOpe=OPR&empresaID=${empresaID}`;
    const finalUrl = usuarioID ? `${baseUrl}&usuarioID=${usuarioID}` : baseUrl;
    return this.http.get<any[]>(finalUrl);
  }



  getPagosRealizadosExtorno(usuarioID?: number): Observable<any[]> {
    const baseUrl = `${this.apiUrl}?codOpe=OPREX&empresaID=${this.empresaID}`;
    const finalUrl = usuarioID ? `${baseUrl}&usuarioID=${usuarioID}` : baseUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getPagoById(ID: number): Observable<any> {
    let params = new HttpParams().set('codOpe', 'ODP').set('v_ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  configurarPago(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CONFPAG');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CONFPAG');
      Object.keys(formData).forEach((key) => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  createPago(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CNPAG');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CNPAG').set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach((key) => {
        params = params.append(key, formData[key]);
      });

      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  createDepositoEnBanco(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CDEPSPAG');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CDEPSPAG').set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach((key) => {
        params = params.append(key, formData[key]);
      });

      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  getPagosRealizadosById(Credito_ID: number): Observable<any[]> {
    let params = new HttpParams().set('codOpe', 'OLPARE').set('Credito_ID', Credito_ID.toString());
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getDatosPagoRealizado(Pago_ID: number): Observable<any> {
    let params = new HttpParams().set('codOpe', 'ODPARE').set('Pago_ID', Pago_ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }
}
