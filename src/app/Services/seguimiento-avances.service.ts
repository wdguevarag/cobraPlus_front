import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SeguimientoAvancesService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Indicador.php';
  empresaID: string = localStorage.getItem('empresa_id') || ''; 

  constructor(private http: HttpClient) { }

  // POST: crear Meta


    getMetaAvanceAnalista(
        Analista_ID: number | null, 
        Fecha: string | null, 
        TipoMeta: 'S' | 'M'
    ): Observable<any> {
        let params = new HttpParams()
        .set('codOpe', 'OAMA')
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




}


