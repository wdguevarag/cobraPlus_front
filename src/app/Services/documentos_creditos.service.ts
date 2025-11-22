import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DocumentosCreditosService {

  private apiUrl = SERVER_URL + 'ws_servicios/ws_Documentos_Creditos.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // Función para crear un documento
  createDocumento(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CDOC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CDOC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  
  // Función para editar un documento
  editDocumento(formData: FormData): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EDOC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EDOC');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // Función para obtener los documentos asociados a un crédito
  getDocumentos(creditoId: number): Observable<any> {
    const params = { codOpe: 'GCDOC', Credito_ID: creditoId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }
  



}
