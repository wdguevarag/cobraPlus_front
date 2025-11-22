// cuadre-diario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';
import { AuthService } from '../Common/Auth.service';

export interface CuadrePorFecha {
  fecha: string;
  usuario_monto: number;
  depositos_banco: number;
  desembolso_transferencia_asesor: number;
  desembolso_efectivo: number;
  pagos_efectivo: number;
  pagos_banco: number;
}

export interface CuadreUsuario {
  usuario: string;
  datos: CuadrePorFecha[];
}

@Injectable({
  providedIn: 'root'
})
export class CuadreDiarioService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_Reporte.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCuadreDiario(): Observable<CuadreUsuario[]> {
    const empresaID = this.authService.currentUserValue?.Empresa_ID || '';
    const usuarioID = this.authService.currentUserValue?.ID || '';

    return this.http.get<CuadreUsuario[]>(
      `${this.apiUrl}?codOpe=OLCDIAR&Empresa_ID=${empresaID}&Usuario_ID=${usuarioID}`
    );
  }
}
