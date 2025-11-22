import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExtornoService {
  private apiUrl = SERVER_URL + 'ws_servicios/ws_Extornos.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';

  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

 


  
  extornarDesembolso(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EXD');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EXD')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  extornarDesembolsoAmpliacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EXDA');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EXDA')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }





  extornarTransferencia(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EXTR');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EXTR')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }



  // POST: crear Condonacion
  extornarPagoNormal(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EXPN');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EXPN')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  extornarPagoCancelacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EXPC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EXPC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }



  
  extornarRefinanciacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EXRE');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EXRE')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }



  extornarCondonacion(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EXCO');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EXCO')

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }






  // GET MOMENTANEOS

  getPagosNormal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OPN&empresaID=${this.empresaID}`);
  }
  getPagosCancelacion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OPC&empresaID=${this.empresaID}`);
  }


  getPagoNormalById(ID: number): Observable<any> {
    const params = new HttpParams().set('codOpe', 'OPNID').set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getPagoCancelacionById(ID: number): Observable<any> {
    const params = new HttpParams().set('codOpe', 'OPCID').set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }


  // FUNCION NICOLAS NUEVO PAGO

  
  extornarPago(ID: number, TipoExtorno: string, Comentario: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new HttpParams()
      .set('codOpe', 'EXPN')
      .set('ID', ID.toString())
      .set('Tipo_Extorno', TipoExtorno)
      .set('Comentario', Comentario)

    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }




  // REFINANCIACIONES

  obtenerRefinanciaciones(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    const usuarioID = this.authService.currentUserValue?.ID || '';

    const params = new HttpParams()
      .set('codOpe', 'ORF')
      .set('Empresa_ID', empresaID)
      .set('Usuario_ID', usuarioID);

    return this.http.get<any[]>(this.apiUrl, { params });
  }


}
