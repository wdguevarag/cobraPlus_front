import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresosFinancierosService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getIngresosFinancieros(fechaInicio?: string, fechaFin?: string, oficina?: string): Observable<any[]> {
    const empresaID = this.authService.currentUserValue?.Empresa_ID || '';
    let params = `?codOpe=OLIF&Empresa_ID=${empresaID}`;

    if (fechaInicio) {
      params += `&Fecha_Inicio=${fechaInicio}`;
    }
    if (fechaFin) {
      params += `&Fecha_Final=${fechaFin}`;
    }
    if (oficina) {
      params += `&Oficina_Nombre=${encodeURIComponent(oficina)}`;
    }

    return this.http.get<any[]>(`${this.apiUrl}${params}`);
  }
}
