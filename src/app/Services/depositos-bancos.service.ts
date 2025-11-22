import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepositosBancosService {
  
  private apiUrl = SERVER_URL + 'ws_creditos/ws_Operacion.php';

  get fechaSistema(): string {
    return localStorage.getItem('fechaSistemaStorage') || '';
  }

  get empresaID(): string {
    return localStorage.getItem('empresa_id') || '';
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {}


  // getDepositosBancos(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLDB&empresaID=${this.empresaID}`);
  // }

  getDepositosBancos(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    const usuarioID = this.authService.currentUserValue?.ID || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLDB&empresaID=${empresaID}&usuarioID=${usuarioID}`);
  }

  getDepositosBancosporId(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'ODDBID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  createDepositoBancos(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CND');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CND')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  updateDepositoBancos(ID: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('codOpe', 'ACTDEP')
      .set('ID', ID.toString());

    console.log('Parámetros enviados:', body.toString());  // Para depuración
    return this.http.post(this.apiUrl, body.toString(), { headers });
  }
}
