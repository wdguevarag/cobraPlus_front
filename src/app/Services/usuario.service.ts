import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = SERVER_URL + 'ws_seguridad/ws_Usuario.php';
  private usuarioActivo = new BehaviorSubject<any | null>(null);
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';


  constructor(private http: HttpClient) { }


  login(email: string, contrasena: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new HttpParams()
      .set('codOpe', 'LOGIN')
      .set('Email', email)
      .set('Contrasena', contrasena);

    return this.http.post(this.apiUrl, params.toString(), { headers });
  }


// OBTENER LISTA DE USUARIOS

  obtenerUsuarios(): Observable<any[]> {
    const usuarioID = localStorage.getItem('user_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OLU&usuarioID=${usuarioID}`);
  }


 

  // GET

  cerrarDia(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=CDia&empresaId=${empresaId}`);
  }

  getFechaCierre(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=GFCierre&empresaId=${empresaId}`);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OU`);
  }
 
  getUsuarioById(ID: number): Observable<any> {
    const params = { codOpe: 'OUID', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }
  getUsuarioByRolId(rol_id: number): Observable<any> {
    const params = { codOpe: 'OURID', rol_id: rol_id.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }


 // POST


  createUsuario(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CU');
      formData.append('empresaID', this.empresaID);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CU')
        .set('empresaID', this.empresaID);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  editUsuario(formData: FormData): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EU');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EU');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  // Documentos del Usuario

  // GET

  getDocumentosByUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?codOpe=ODID&Usuario_ID=${usuarioId}`);
  }
    

  // POST

  createDocumento(formData: FormData): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CD');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CD');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  getAccesosByUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?codOpe=OAU&Usuario_ID=${usuarioId}`);
  }









// FUNCION PARA USUARIOS ASESORES

  getUsuariosAsesores(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OA&empresaID=${empresaID}`);
  }




  // FUNCIONES PARA USUARIO CON ROL DEL ASESOR

  // Obtener todas las cuentas de un asesor (por Asesor_ID)
  getCuentasAsesores(): Observable<any> {
    const params = new HttpParams()
      .set('codOpe', 'OACUG')
      .set('empresaID', this.empresaID);
    return this.http.get<any>(this.apiUrl, { params });
  }


  // Obtener todas las cuentas de un asesor (por Asesor_ID)
  getCuentasAsesor(Asesor_ID: number): Observable<any> {
    const params = new HttpParams()
      .set('codOpe', 'OACUID')
      .set('Usuario_ID', Asesor_ID.toString())
      .set('empresaID', this.empresaID);
    return this.http.get<any>(this.apiUrl, { params });
  }





  // Crear una cuenta de asesor
  createCuentaAsesor(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CACU');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CACU');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados (createCuentaAsesor):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // Editar una cuenta de asesor
  editCuentaAsesor(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EACU');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EACU');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados (editCuentaAsesor):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }




    // FUNCIONES PARA USUARIO CON ROL DEL ASESOR

  // Obtener todas las comentarios de un asesor (por Asesor_ID)
  getComentariosAsesor(Asesor_ID: number): Observable<any> {
    const params = new HttpParams()
      .set('codOpe', 'OACOMA')
      .set('Asesor_ID', Asesor_ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtener una comentario de asesor por ID (comentario individual)
  getComentarioAsesorById(ID: number): Observable<any> {
    const params = new HttpParams()
      .set('codOpe', 'OACOMID')
      .set('ID', ID.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }



  // Crear una comentario de asesor
  createComentarioAsesor(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CACOM');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CACOM');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados (createComentarioAsesor):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // Editar una comentario de asesor
  editComentarioAsesor(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EACOM');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EACOM');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parametros enviados (editComentarioAsesor):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


}
