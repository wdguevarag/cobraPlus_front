import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {

  private apiUrl = SERVER_URL + 'ws_seguridad/ws_Aplicacion.php';

  constructor(private http: HttpClient) { }

  // GET
  getAplicaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OA`);
  }

  getAplicacionById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OAID')
      .set('ID', ID.toString());  
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST
  createAplicacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CA');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CA');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editAplicacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EA');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EA');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  // ROLES ASIGNADOS A APLICACION

  // GET

  getRolesByAplicacion(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'ORIDA')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }



  // POST

  editRolesStatus(formData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new HttpParams().set('codOpe', 'ARAIDA');
    Object.keys(formData).forEach(key => {
      params = params.append(key, formData[key]);
    });
    return this.http.post(this.apiUrl, params.toString(), { headers });
  }

}
