import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = SERVER_URL + 'ws_servicios/ws_Clientes.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // GET: obtener todos los clientes

  getClientes(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OC&empresaID=${empresaID}`);
  }


  // PARA FIC

  getClientesCreditos(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCCR&empresaID=${empresaID}`);
  }



  // PARA TRASLADO DE CARTERA
  getClientesDataTraslado(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCDT&empresaID=${this.empresaID}`);
  }



  

  getClienteFamiliaresById(id_cliente: number): Observable<any[]> {
    const params = { codOpe: 'OCFAMIL', id_cliente: id_cliente.toString() };
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getClientesCreditoPorFirmar(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCCREFIR&empresaID=${empresaID}`);
  }


  getCreditosPorFirmarByClienteId(clienteId: number): Observable<any> {
    const params = new HttpParams()
      .set('codOpe', 'OCCFID')
      .set('Cliente_ID', clienteId.toString());

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getCreditosPorFirmarGeneral(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCCF&empresaID=${empresaID}`);
  }


  getClientesConCredito(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCCRE&empresaID=${this.empresaID}`);
  }

  getCreditoPendienteByIdCliente(id_cliente: number): Observable<any[]> {
    const params = { codOpe: 'OCPENDIENTE', id_cliente: id_cliente.toString() };
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // GET: obtener cliente por ID
  getClienteById(ID: number): Observable<any> {
    const params = { codOpe: 'OCID', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  validateClientInformation(id_cliente: number): Observable<any> {
    const params = { codOpe: 'VCLINFO', id_cliente: id_cliente.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }


  // POST: crear cliente
  createCliente(formData: any): Observable<any> {
    // En ws_Clientes.php, definimos "CC" para crear_cliente
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // POST: editar cliente
  editCliente(formData: any): Observable<any> {
    // En ws_Clientes.php, definimos "EC" para editar_cliente
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EC');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados:', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // CAMBIAR ASESOR
  changeAsesorCliente(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CASE');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'CASE');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados (changeAsesorCliente):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


    // ===================== DOMICILIOS =====================

  // GET: obtener todos los domicilios (general)
  getDomiciliosGeneral(): Observable<any[]> {
    // codOpe=ODG en ws_Clientes.php
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=ODG`);
  }

  // GET: obtener domicilios por Cliente_ID
  getDomiciliosByCliente(clienteId: number): Observable<any> {
    // codOpe=ODC en ws_Clientes.php, enviamos Cliente_ID
    const params = { codOpe: 'ODC', Cliente_ID: clienteId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear domicilio
  createDomicilio(formData: any): Observable<any> {
    // codOpe=CD para crear domicilio
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CD');
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

      console.log('Parámetros enviados (createDomicilio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // POST: editar domicilio
  editDomicilio(formData: any): Observable<any> {
    // codOpe=ED para editar domicilio
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ED');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'ED')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (editDomicilio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


    // ==================== NEGOCIOS ====================
  // GET: obtener todos los negocios (general)
  getNegociosGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=ONG`);
  }

  // GET: obtener negocios por Cliente_ID
  getNegociosByCliente(clienteId: number): Observable<any> {
    const params = { codOpe: 'ONC', Cliente_ID: clienteId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear negocio
  createNegocio(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CN');
      formData.append('fechaSistema', this.fechaSistema);

      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CN')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (createNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // POST: editar negocio
  editNegocio(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EN');
      formData.append('fechaSistema', this.fechaSistema);

      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'EN')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (editNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  
    // ==================== CONTACTOS ====================
  // GET: obtener todos los negocios (general)
  getContactosGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCG`);
  }

  // GET: obtener negocios por Cliente_ID
  getContactosByCliente(clienteId: number): Observable<any> {
    const params = { codOpe: 'OCC', Cliente_ID: clienteId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear negocio
  createContacto(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CCT');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CCT')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (createNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // POST: editar negocio
  editContacto(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ECT');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'ECT');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados (editarContacto):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }



      // ==================== CUENTAS ====================
  // GET: obtener todos los negocios (general)
  getCuentasGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCUG`);
  }

  // GET: obtener negocios por Cliente_ID
  getCuentasByCliente(clienteId: number): Observable<any> {
    const params = { codOpe: 'OCUC', Cliente_ID: clienteId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear negocio

  // POST: crear domicilio
  createCuenta(formData: any): Observable<any> {
    // codOpe=CD para crear domicilio
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CCU');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CCU')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (createDomicilio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }





  // POST: editar negocio
  editCuenta(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ECU');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'ECU');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados (editNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }



        // ==================== RCC ====================
  // GET: obtener todos los negocios (general)
  getRccsGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=ORCG`);
  }

  // GET: obtener negocios por Cliente_ID
  getRccsByCliente(clienteId: number): Observable<any> {
    const params = { codOpe: 'ORCC', Cliente_ID: clienteId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear negocio
  createRcc(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CRCC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CRCC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (createNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // POST: editar negocio
  editRcc(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'ERCC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'ERCC');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados (editNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }


  
        // ==================== DOCUMENTOS ====================
  // GET: obtener todos los negocios (general)
  getDocumentosGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=ODOG`);
  }

  // GET: obtener negocios por Cliente_ID
  getDocumentosByCliente(clienteId: number): Observable<any> {
    const params = { codOpe: 'ODOC', Cliente_ID: clienteId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear negocio
  createDocumento(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CDOC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CDOC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (createNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // POST: editar negocio
  editDocumento(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EDOC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EDOC');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados (editNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }





        // ==================== FAMILIARES ====================
  // GET: obtener todos los negocios (general)
  getFamiliaresGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OFAG`);
  }

  // GET: obtener negocios por Cliente_ID
  getFamiliaresByCliente(clienteId: number): Observable<any> {
    const params = { codOpe: 'OFAC', Cliente_ID: clienteId.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // POST: crear negocio
  createFamiliar(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CFAC');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CFAC')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });

      console.log('Parámetros enviados (createNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }

  // POST: editar negocio
  editFamiliar(formData: any): Observable<any> {
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EFAC');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EFAC');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados (editNegocio):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }



  // ===================== EVALUACIONES =====================


  // POST: crear evaluación
  createEvaluacion(formData: any): Observable<any> {
    // En ws_Clientes.php, definimos "CE" para crear evaluación
    if (formData instanceof FormData) {
      formData.append('codOpe', 'CEVA');
      formData.append('fechaSistema', this.fechaSistema);
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams()
        .set('codOpe', 'CEVA')
        .set('fechaSistema', this.fechaSistema);

      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      
      console.log('Parámetros enviados (createEvaluacion):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }




  // GET: obtener todas las evaluaciones de un cliente
  getEvaluacionesByCliente(clienteId: number): Observable<any[]> {
    const params = { codOpe: 'OEVAG', cliente_id: clienteId.toString() };
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // GET: obtener todas las solicitudes de un cliente
  getSolicitudesByCliente(clienteId: number): Observable<any[]> {
    const params = { codOpe: 'OSLCL', cliente_id: clienteId.toString() };
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // GET: obtener una evaluación específica de un cliente
  getEvaluacionById(clienteId: number, evaluacionId: number): Observable<any> {
    const params = { 
      codOpe: 'OEVAID', 
      cliente_id: clienteId.toString(), 
      evaluacion_id: evaluacionId.toString() 
    };
    return this.http.get<any>(this.apiUrl, { params });
  }


  editEvaluacion(formData: any): Observable<any> {
    // En ws_Clientes.php, definimos "CE" para crear evaluación
    if (formData instanceof FormData) {
      formData.append('codOpe', 'EEVA');
      return this.http.post(this.apiUrl, formData);
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      let params = new HttpParams().set('codOpe', 'EEVA');
      Object.keys(formData).forEach(key => {
        params = params.append(key, formData[key]);
      });
      console.log('Parámetros enviados (createEvaluacion):', params.toString());
      return this.http.post(this.apiUrl, params.toString(), { headers });
    }
  }




}




