import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteCompraService {



  private apiUrl = SERVER_URL + 'ws_creditos/ws_Consulta.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  getComprobantes(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCC&empresaID=${empresaID}`);
  }


  getComprobanteById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OCCID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  createComprobante(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CCC');
      formData.append('fechaSistema', this.fechaSistema);
      formData.append('empresaID', this.empresaID);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CCC')
        .set('fechaSistema', this.fechaSistema)
        .set('empresaID', this.empresaID);
        
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editComprobante(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ECC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'ECC');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  getUsuariosFic(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLU`);
  }

  getUsuariosFicById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OUFICID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }
}