import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FechaSistemaService {

  private apiUrl = SERVER_URL + 'ws_seguridad/ws_Usuario.php';

  constructor(private http: HttpClient) {}



  verificarEstadoCierre(): Observable<{ Cierre_Hecho: boolean }> {
  const empresaId = localStorage.getItem('empresa_id') ?? '';
  const fecha = localStorage.getItem('fechaSistemaStorage') ?? '';

  const params = new HttpParams()
    .set('codOpe', 'CDE')
    .set('Empresa_ID', empresaId)
    .set('Fecha', fecha);

  return this.http
    .get(this.apiUrl, { params })
    .pipe(
      map((response: any) => {
        console.log('Respuesta cruda del backend:', response);

        // Aquí definimos que el cierre está hecho si icodError = -2 y vdesError = true
        const cierreHecho = response?.icodError === "-2" && response?.vdesError === true;

        return { Cierre_Hecho: cierreHecho };
      })
    );
}

  


}



