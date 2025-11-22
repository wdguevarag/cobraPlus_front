import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AsignacionMetasService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Indicador.php';
  empresaID: string = localStorage.getItem('empresa_id') || ''; 

  constructor(private http: HttpClient) { }

  // POST: crear Meta


    getMetaAnalista(
      Analista_ID: number | null, 
      Fecha: string | null, 
      TipoMeta: 'S' | 'M'
    ): Observable<any> {
      let params = new HttpParams()
        .set('codOpe', 'OMA')
        .set('Empresa_ID', this.empresaID) 
        .set('TipoMeta', TipoMeta); 

      if (Analista_ID !== null) {
        params = params.set('Analista_ID', Analista_ID.toString());
      }

      if (Fecha && Fecha.trim() !== '') {
        params = params.set('Fecha', Fecha);
      }

      return this.http.get<any>(this.apiUrl, { params });
    }




  createMeta(formData: any): Observable<any> {
    // En ws_Clientes.php, definimos "CC" para crear_cliente
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CM');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CM')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  getMetaActualAnalista(
    Analista_ID: number | null, 
    // Fecha: string | null, 
    TipoMeta: 'S' | 'M'
  ): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OMAA')
      .set('Empresa_ID', this.empresaID) 
      .set('TipoMeta', TipoMeta); 

    if (Analista_ID !== null) {
      params = params.set('Analista_ID', Analista_ID.toString());
    }

    // if (Fecha && Fecha.trim() !== '') {
    //   params = params.set('Fecha', Fecha);
    // }

    return this.http.get<any>(this.apiUrl, { params });
  }


  editMeta(formData: any): Observable<any> {
    // En ws_Clientes.php, definimos "CC" para crear_cliente
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EM');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EM')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

}


