import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {


  private apiUrl = SERVER_URL + 'ws_servicios/ws_Transferencias.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';
  
  constructor(private http: HttpClient) { }

  // getTransferencias() {
  //   return this.transferencias.asObservable();
  // }





  getTransferencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OT&empresaID=${this.empresaID}`);
  }

  getTransferenciasClientesCreditos(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OTCLICRE&empresaID=${empresaID}`);
  }



    // GET: obtener cliente por ID
  getTransferenciaById(ID: number): Observable<any> {
    const params = { codOpe: 'OTID', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }


  getTransferenciaClienteCreditoById(ID: number): Observable<any> {
    const params = { codOpe: 'OTCLICREID', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }


  // POST

  createTransferencia(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CT')
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CT')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Transferencia Creada:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editTransferencia(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ET');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'ET');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Transferencia EDITADA:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


}




