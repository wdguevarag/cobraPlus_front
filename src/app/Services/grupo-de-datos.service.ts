import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoDeDatoService {


  private apiUrl = SERVER_URL + 'ws_creditos/ws_Parametro.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // Método GET existente
  getGrupoDatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLGD&empresaID=${this.empresaID}`);  /* tratar de cambiarlo a CodOpe OGD para seguir con la convencion*/
  }

  getGrupoDatosById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OGDID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getDetalleGrupoDatos(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OLDGD')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getDetalleGrupoDatosById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'ODGDID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Nuevo método POST
  createGrupoDatos(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CGD');
      formData.append('fechaSistema', this.fechaSistema);
      formData.append('empresaID', this.empresaID);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CGD')
        .set('fechaSistema', this.fechaSistema)
        .set('empresaID', this.empresaID);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  createDetalleGrupoDatos(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CDGD');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CDGD')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editGrupoDatos(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EGD');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EGD');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editDetalleGrupoDatos(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EDGD');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EDGD');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }
}
