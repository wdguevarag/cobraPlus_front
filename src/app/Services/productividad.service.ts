import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductividadService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Indicador.php';
  empresaID: string = localStorage.getItem('empresa_id') || ''; 

  constructor(private http: HttpClient) {}


// Metodos de Julio


  getAnalistas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OA&Empresa_ID=${this.empresaID}`);
  }


  getProductividadAnalistaClientes(
    Analista_ID: number | null, 
    Fecha: string | null, 
    TipoCliente: 'R' | 'N'
  ): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OPAC')
      .set('Empresa_ID', this.empresaID) // Incluye directamente el Empresa_ID
      .set('TipoCliente', TipoCliente); // Tipo de cliente

    if (Analista_ID !== null) {
      params = params.set('Analista_ID', Analista_ID.toString());
    }

    if (Fecha && Fecha.trim() !== '') {
      params = params.set('Fecha', Fecha);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }


  getProductividadAnalistaData(
    Analista_ID?: number | null,
    Fecha?: string | null,
    TipoCliente?: 'R' | 'N'
  ): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OPAD')
      .set('Empresa_ID', this.empresaID)
      .set('TipoCliente', TipoCliente || '');

    if (Analista_ID != null) {
      params = params.set('Analista_ID', Analista_ID.toString());
    }

    if (Fecha && Fecha.trim() !== '') {
      params = params.set('Fecha', Fecha);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }


  getProductividadAnalistaGrafico(
    Analista_ID?: number | null,
    Fecha?: string | null,
    TipoCliente?: 'R' | 'N'
  ): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OPAG')
      .set('Empresa_ID', this.empresaID)
      .set('TipoCliente', TipoCliente || '');

    if (Analista_ID != null) {
      params = params.set('Analista_ID', Analista_ID.toString());
    }

    if (Fecha && Fecha.trim() !== '') {
      params = params.set('Fecha', Fecha);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }



}
