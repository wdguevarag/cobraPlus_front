import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CondonacionService {

  private apiUrl = SERVER_URL + 'ws_servicios/ws_Condonaciones.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // GET: obtener todas las Condonaciones
  getCondonaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OC&empresaID=${this.empresaID}`);
  }

  getCondonacionesCredito(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCCC&empresaID=${this.empresaID}`);
  }

  // GET: obtener Condonaciones por ID
  getCondonacionById(ID: number): Observable<any> {
    const params = new HttpParams().set('codOpe', 'OCID').set('Condonacion_ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // GET: obtener Condonaciones por ID de Crédito
  getCondonacionCreditoById(ID: number): Observable<any> {
    const params = new HttpParams().set('codOpe', 'OCCCID').set('Condonacion_ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear Condonacion
  createCondonacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CC')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


    // POST: crear Condonacion
  editCondonacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  aprobarCondonacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'APC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'APC')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  anularCondonacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ANC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'ANC')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

}

