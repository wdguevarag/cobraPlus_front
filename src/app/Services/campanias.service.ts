import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaniasService {


  private apiUrl = SERVER_URL + 'ws_servicios/ws_Campanias.php';

  empresaID: string = localStorage.getItem('empresa_id') || '';


  constructor(private http: HttpClient) { }


  getCampanias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OC&empresaID=${this.empresaID}`);
  }

  getCampaniaById(ID: number): Observable<any> {
    const params = new HttpParams().set('codOpe', 'OCID').set('Campania_ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getResumenCampañaById(ID: number): Observable<any> {
    const params = new HttpParams().set('codOpe', 'ORCID').set('Campania_ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }



  // ANULAR CAMPAÑA

  anularCampania(ID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const body = new HttpParams()
      .set('codOpe', 'AC')
      .set('Campania_ID', ID.toString());
    
    return this.http.post<any>(this.apiUrl, body.toString(), { headers });
  }

  revertirAnulacion(ID: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const body = new HttpParams()
      .set('codOpe', 'RAC')
      .set('Campania_ID', ID.toString());
    
    return this.http.post<any>(this.apiUrl, body.toString(), { headers });
  }

  editarCampania(
    ID: number, 
    Monto: number, 
    Asesor_ID: number, 
    Fecha_Oferta: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const body = new HttpParams()
      .set('codOpe', 'EC')
      .set('Campania_ID', ID.toString())
      .set('Monto', Monto.toString())
      .set('Estado', 1)
      .set('Asesor_Valido', Asesor_ID.toString())
      .set('Fecha_Oferta', Fecha_Oferta); // Enviar fecha en DD-MM-YYYY
  
    return this.http.post<any>(this.apiUrl, body.toString(), { headers });
  }
  

}
