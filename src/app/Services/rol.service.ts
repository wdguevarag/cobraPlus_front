import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable , map} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = SERVER_URL + 'ws_seguridad/ws_Rol.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // GET

  getRoles(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OR&empresaID=${empresaID}`);
  }


  getRolById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?codOpe=ORID&ID=${id}`).pipe(
      map((rol: any) => ({
        ...rol,
        accesos: rol.Accesos ? JSON.parse(rol.Accesos) : []
      }))
    );
  }
  


  // POST

  createRol(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CR');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CR');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editRol(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ER');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'ER');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  // ROL - ACCESOS


  getAccesosByRolId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OARID&ID=${id}`);
  }
  






  agregarAcceso(rolId: number, acceso: {Acceso_ID: number, Modulo_ID: number, Aplicacion_ID: number}): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
          .set('codOpe', 'ERA')  // Era = Editar Rol - Agregar Acceso.
          .set('ID', rolId.toString())
          .set('Acceso', JSON.stringify(acceso));  // Enviamos el objeto acceso en formato JSON.
      console.log('Parametros agregar acceso:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
  }
  
  removerAcceso(rolId: number, accesoId: number): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
          .set('codOpe', 'ERR')  // Err = Editar Rol - Remover Acceso.
          .set('ID', rolId.toString())
          .set('Acceso_ID', accesoId.toString());
      console.log('Parametros remover acceso:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
  }


}


  // // USARIOS POR ROL
  // getUsuariosByRol(ID: number): Observable<any> {
  //   let params = new HttpParams()
  //     .set('codOpe', 'OLUIDR')
  //     .set('ID', ID.toString());
  //   return this.http.get<any>(this.apiUrl, { params });
  // }

  // editUsuarioStatus(formData: any): Observable<any> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  //   let params = new HttpParams().set('codOpe', 'AUAR');
  //   Object.keys(formData).forEach(key => {
  //     params = params.append(key, formData[key]);
  //   });
  //   return this.http.post(this.apiUrl, params.toString(), { headers });
  // }

  // // ACCESOS POR ROL

  // getAccesosByRol(ID: number): Observable<any> {
  //   let params = new HttpParams()
  //     .set('codOpe', 'OLAIDR')
  //     .set('ID', ID.toString());
  //   return this.http.get<any>(this.apiUrl, { params });
  // }

  // editAccesoStatus(formData: any): Observable<any> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  //   let params = new HttpParams().set('codOpe', 'AACAR');
  //   Object.keys(formData).forEach(key => {
  //     params = params.append(key, formData[key]);
  //   });
  //   return this.http.post(this.apiUrl, params.toString(), { headers });
  // }