import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { AuthService } from '../Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepositosBancosService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getDepositosBancos(): Observable<any[]> {
    const empresaID = this.authService.currentUserValue?.Empresa_ID || '';
    const usuarioID = this.authService.currentUserValue?.ID || '';

    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLDB&Empresa_ID=${empresaID}&Usuario_ID=${usuarioID}`);
  }
}
