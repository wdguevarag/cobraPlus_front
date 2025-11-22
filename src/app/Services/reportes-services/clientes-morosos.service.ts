import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';
import { AuthService } from '../Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesMorososService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {}

  getClientesMorosos(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    const usuarioID = this.authService.currentUserValue?.ID || '';

    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLCM&Empresa_ID=${empresaID}&Usuario_ID=${usuarioID}`);
  }
}
