import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExtornoService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getExtornos(): Observable<any[]> {
    const empresaID = this.authService.currentUserValue?.Empresa_ID || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLEXT&Empresa_ID=${empresaID}`);
  }
}
