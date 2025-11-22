import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = SERVER_URL + 'ws_seguridad/ws_Empresa.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) {}

  // GET

  getEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OE`);
  }

  getEmpresaById(ID: number): Observable<any> {
    let params = new HttpParams().set('codOpe', 'OEID').set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST

  createEmpresa(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CE');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CE');
      Object.keys(formData).forEach((key) => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editEmpresa(formData: FormData): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EE');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EE');
      Object.keys(formData).forEach((key) => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  getFirmaBase64(empresaID: string): Observable<string> {
    const params = new HttpParams().set('codOpe', 'OIEM').set('ID', empresaID);

    return this.http.get<{ icodError: string; firmaBase64: string }>(this.apiUrl, { params }).pipe(
      map((resp) => {
        if (resp.icodError !== '0') {
          throw new Error('No se pudo obtener la firma de la empresa');
        }
        return resp.firmaBase64;
      })
    );
  }
}
