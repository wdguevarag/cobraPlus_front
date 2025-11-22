import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DesembolsoService {

  // private apiUrl = SERVER_URL + 'ws_creditos/ws_Operacion.php';

  // constructor(private http: HttpClient) { }

  // getDesembolsos(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLDP`);
  // }


  private apiUrl = SERVER_URL + 'ws_servicios/ws_Desembolsos.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';
  

  constructor(private http: HttpClient) { }


  getDesembolsos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OD&empresaID=${this.empresaID}`);
  }

  getDesembolsosClientesCreditos(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=ODCLICRE&empresaID=${empresaID}`);
  }



  getDesembolsoById(ID: number): Observable<any> {
    const params = { codOpe: 'ODID', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }


  getDesembolsoClienteCreditoById(ID: number): Observable<any> {
    const params = { codOpe: 'ODCLICREID', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }




  getDesembolsoActualAnterior(ID: number): Observable<any> {
    const params = { codOpe: 'ODAA', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }




  // POST

  createDesembolso(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CD')
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CD')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Transferencia Creada:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editDesembolso(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ED');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'ED');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Transferencia EDITADA:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


}




