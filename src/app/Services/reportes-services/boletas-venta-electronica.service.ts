import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletasVentasElectronicasService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(private http: HttpClient) {}

  getBoletasVentasElectronicas(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLBE&Empresa_ID=${empresaID}`);
  }
}
