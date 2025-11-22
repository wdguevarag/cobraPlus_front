import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordenadasService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Coordenadas.php';

  constructor(private http: HttpClient) { }

  // GET

  getCoordenadasByClientIdAndTypeLocation(id_analista: number, tipo_ubicacion: string): Observable<any> {
    const params = { codOpe: 'OCPUC', id_analista: id_analista, tipo_ubicacion: tipo_ubicacion.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }
}
