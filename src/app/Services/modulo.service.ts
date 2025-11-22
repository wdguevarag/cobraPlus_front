import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private apiUrl = SERVER_URL + 'ws_seguridad/ws_Modulo.php';

  constructor(private http: HttpClient) { }

  // GET

  getModulos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OM`);
  }

  getModuloById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OMID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST

  createModulo(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CM');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CM');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editModulo(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EM');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EM');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


}