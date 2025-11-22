import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class CondonacionService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCondonaciones(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    const usuarioID = this.authService.currentUserValue?.ID || '';

    const url = `${this.apiUrl}?codOpe=OLC&Empresa_ID=${empresaID}&Usuario_ID=${usuarioID}`;
    return this.http.get<any[]>(url);
  }
}
