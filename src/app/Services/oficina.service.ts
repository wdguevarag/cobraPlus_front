import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  private apiUrl = SERVER_URL + 'ws_seguridad/ws_Oficina.php';

  constructor(private http: HttpClient) { }


  // GET
  getOficinas(): Observable<any[]> {
    const usuarioID = localStorage.getItem('user_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OO&usuarioID=${usuarioID}`);
  }


  getOficinaById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OOID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST
  createOficina(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CO');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CO');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }
  
  editOficina(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EO');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EO');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  // GET
  getAplicacionesByOficina(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OAAOFI')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST
  editAppStatus(formData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new HttpParams().set('codOpe', 'AEDAA');
    Object.keys(formData).forEach(key => {
      params = params.append(key, formData[key]);
    });
    return this.http.post(this.apiUrl, params.toString(), { headers });
  }
}




