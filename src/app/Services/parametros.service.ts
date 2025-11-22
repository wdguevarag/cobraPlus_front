import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ParametroService {


  private apiUrl = SERVER_URL + 'ws_creditos/ws_Parametro.php';

  constructor(private http: HttpClient) { }

  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';
  // Método GET existente
  getParametros(): Observable<any[]> {
    console.log("getParametrosServiceEmpresaID", this.empresaID);
    console.log("getParametrosFechaSistema", this.fechaSistema);
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLP&empresaID=${this.empresaID}`);  /* tratar de cambiarlo a CodOpe OP para seguir con la convencion*/
  }

  // Nuevo método POST
  createParametro(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CP');
      formData.append('fechaSistema', this.fechaSistema);
      formData.append('empresaID', this.empresaID);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CP')
        .set('fechaSistema', this.fechaSistema)
        .set('empresaID', this.empresaID);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // Método GET para obtener un parametro por ID
  getParametroById(ID: number): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OPID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  //Metodo POST para editar un parametro (operacion EP)
  editParametro(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EP');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EP');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }
}
