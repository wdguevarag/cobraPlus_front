import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseNegativeService {
  private apiUrl = SERVER_URL + 'ws_creditos/ws_Oficialia.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  getRegistros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLBN&empresaID=${this.empresaID}`);
  }

  createRegistro(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'RPBN');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'RPBN')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }



  private apiUrl2 = SERVER_URL + 'ws_servicios/ws_Base_Negativa.php';


  getBaseNegativas(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl2}?codOpe=OBNG&Empresa_ID=${empresaID}`);
  }


  getBaseNegativaById(ID: number): Observable<any> {
    const params = new HttpParams().set('codOpe', 'OBNID').set('id', ID.toString());
    return this.http.get<any>(this.apiUrl2, { params });
  }



  createBaseNegativa(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CBN')
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl2, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CBN')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Transferencia Creada:', params.toString());
      return this.http.post(this.apiUrl2, params.toString(), { headers });
    }
  }



  
  levantarBaseNegativa(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'LBN')
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl2, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'LBN')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Transferencia Creada:', params.toString());
      return this.http.post(this.apiUrl2, params.toString(), { headers });
    }
  }



}
