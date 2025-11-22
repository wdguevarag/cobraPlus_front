import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  private apiUrlSolicitarCreditos = SERVER_URL + 'ws_creditos/ws_Credito.php';

  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // GET

  getCreditosAndDataClient(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrlSolicitarCreditos}?codOpe=ODCC&empresaID=${empresaID}`);
  }



  getCreditosAndDataClientByIdCredito(creditoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlSolicitarCreditos}?codOpe=ODCCID&creditoId=${creditoId}`);
  }

  getCreditosClientCastigo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlSolicitarCreditos}?codOpe=OCCCastigo&empresaID=${this.empresaID}`);
  }
  
  // Servicio para anular un crédito (cambia Estado_Anulado de 0 a 1)
  anularCredito(creditoId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams()
      .set('codOpe', 'ANCREDITO')
      .set('credito_id', creditoId.toString());
    
    return this.http.post(this.apiUrlSolicitarCreditos, body.toString(), { headers });
  }

  // Servicio para aprobar un crédito (cambia Estado_Anulado de 0 a 1)
  aprobarCredito(creditoId: number, clienteId: number, fechaDesembolso: string, prestamo: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams()
      .set('codOpe', 'APCREDITO')
      .set('credito_id', creditoId.toString())
      .set('cliente_id', clienteId.toString())
      .set('fechaDesembolso', fechaDesembolso.toString())
      .set('prestamo', prestamo.toString())
      .set('fechaSistema', this.fechaSistema);
    
    return this.http.post(this.apiUrlSolicitarCreditos, body.toString(), { headers });
  }

    // GET: obtener créditos por firmar (todos)
  getCreditosPorFirmar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCPFIR&empresaID=${this.empresaID}`);
  }

  // GET: obtener créditos por firmar por cliente ID
  getCreditosPorFirmarByCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCPFIRID&clienteId=${clienteId}`);
  }


  // GET: obtener créditos por firmar (todos)
  getCreditosFirmados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCFIR&empresaID=${this.empresaID}`);
  }

  // GET: obtener créditos por firmar por cliente ID
  getCreditosFirmadosByCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCFIRID&clienteId=${clienteId}`);
  }
  
  insertarCreditoConCronograma(
    clienteId: number,
    tipo_solicitud: string,
    estado_credito: number,
    destino: string,
    prestamo: number,
    prestamoActual: number,
    periodicidad: string,
    nroPeriodos: number,
    tipoPeriodoGracia: string,
    nroPeriodoGracia: number,
    fechaDesembolso: string,
    fechaInicio: string,
    fechaFinal: string,
    gastoMensual: number,
    temOficial: number,
    teaOficial: number,
    cronograma: any[],
    estado_aval: number,
    familiarId: number,
    asesorId: number,
    idCreditoAnterior: number
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  
    // Paso 1: Insertar el Cronograma
    const bodyCronograma = new HttpParams()
      .set('codOpe', 'ICRONOGRAMA')
      .set('clienteId', clienteId.toString())
      .set('cronograma', JSON.stringify(cronograma));
  
    return this.http.post(`${this.apiUrlSolicitarCreditos}?codOpe=ICRONOGRAMA`, bodyCronograma.toString(), { headers }).pipe(
      map((response: any) => {
        console.log('Respuesta del Cronograma:', response);
        return response.Cronograma_ID;
      }),
      switchMap((cronogramaId: number) => {
        if (!cronogramaId) {
          return throwError(() => new Error('Error: Cronograma_ID no definido'));
        }
  
        // Paso 2: Crear el Crédito
        const bodyCredito = new HttpParams()
          .set('codOpe', 'ICREDITO')
          .set('clienteId', clienteId.toString())
          .set('cronogramaId', cronogramaId.toString())
          .set('tipo_solicitud', tipo_solicitud)
          .set('estado_credito', estado_credito.toString())
          .set('destino', destino)
          .set('prestamo', prestamo.toString())
          .set('prestamoActual', prestamoActual.toString())
          .set('periodicidad', periodicidad)
          .set('nroPeriodos', nroPeriodos.toString())
          .set('tipoPeriodoGracia', tipoPeriodoGracia)
          .set('nroPeriodoGracia', nroPeriodoGracia.toString())
          .set('fechaDesembolso', fechaDesembolso)
          .set('fechaInicio', fechaInicio)
          .set('fechaFinal', fechaFinal)
          .set('gastoMensual', gastoMensual.toString())
          .set('temOficial', temOficial.toString())
          .set('teaOficial', teaOficial.toString())
          .set('estado_aval', estado_aval.toString())
          .set('familiarId', familiarId.toString())
          .set('asesorId', asesorId.toString())
          .set('fechaSistema', this.fechaSistema);
  
        return this.http.post(`${this.apiUrlSolicitarCreditos}?codOpe=ICREDITO`, bodyCredito.toString(), { headers }).pipe(
          map((creditoResponse: any) => {
            console.log('Respuesta del Crédito:', creditoResponse);
            return creditoResponse.Credito_ID;
          }),
          switchMap((creditoId: number) => {
            if (!creditoId) {
              return throwError(() => new Error('Error: Credito_ID no definido'));
            }
  
            if (tipo_solicitud === 'Refinanciacion') {
              // Paso 3: Crear la Refinanciación
              const bodyRefinanciacion = new HttpParams()
                .set('codOpe', 'IREFINANCIACION')
                .set('clienteId', clienteId.toString())
                .set('creditoId', creditoId.toString())
                .set('creditoIdAnterior', idCreditoAnterior.toString())
                .set('estadoRefinanciacion', '0')
                .set('fechaSistema', this.fechaSistema);
    
              return this.http.post(`${this.apiUrlSolicitarCreditos}?codOpe=IREFINANCIACION`, bodyRefinanciacion.toString(), { headers }).pipe(
                map((refResponse: any) => {
                  console.log('Respuesta de Refinanciación:', refResponse);
                  return refResponse;
                })
              );
            }
    
            if (tipo_solicitud === 'Ampliacion') {
              // Paso 3: Ajustes Ampliación
              const bodyRefinanciacion = new HttpParams()
                .set('codOpe', 'ICAMPLIACION')
                .set('clienteId', clienteId.toString())
                .set('creditoId', creditoId.toString())
                .set('creditoIdAnterior', idCreditoAnterior.toString())
                .set('fechaSistema', this.fechaSistema);

              return this.http.post(`${this.apiUrlSolicitarCreditos}?codOpe=ICAMPLIACION`, bodyRefinanciacion.toString(), { headers }).pipe(
                map((refResponse: any) => {
                  console.log('Respuesta de Ampliacion:', refResponse);
                  return refResponse;
                })
              );
            }
    
            return of(creditoId);
          })
        );
      }),
      catchError(error => {
        console.error('Error en la solicitud:', error);
        return throwError(() => error);
      })
    );
  }

  // JULIO FUNCIONES
  private apiUrl = SERVER_URL + 'ws_servicios/ws_Creditos.php';
  private apiUrlGeneral = SERVER_URL + 'ws_creditos/ws_General.php';

  // GET: obtener todos los créditos
  getCreditos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OC&empresaID=${this.empresaID}`);
  }

  // GET: obtener todos los créditos
  getCreditosTransferenciaUsuarioOficina(credito_id: number): Observable<any> {
    const params = { codOpe: 'ODCDesembolso', credito_id: credito_id };
    return this.http.get<any>(this.apiUrlSolicitarCreditos, { params });
  }

  // GET: obtener credito por ID
  getCreditoById(ID: number): Observable<any> {
    const params = { codOpe: 'OCID', ID: ID.toString() };
    return this.http.get<any>(this.apiUrl, { params });
  }
  
  // POST: castigar crédito (operación CC)
  createCastigarReestablecerCredito(creditoId: number, valor: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams()
      .set('codOpe', 'CCCOR')
      .set('credito_id', creditoId)
      .set('valor', valor);
    
    console.log('Parámetros enviados (castigo):', body.toString());
    return this.http.post(this.apiUrlGeneral, body.toString(), { headers });
  }

  // POST: restablecer crédito (operación RC)
  restablecerCredito(creditoId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams()
      .set('codOpe', 'RC')
      .set('credito_id', creditoId.toString());
    
    console.log('Parámetros enviados (restablecer):', body.toString());
    return this.http.post(this.apiUrl, body.toString(), { headers });
  }

  // GET: obtener créditos por firmar (todos)
  getCreditosFirmas(): Observable<any[]> {
    const empresaID = localStorage.getItem('empresa_id') || '';
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCFIR&empresaID=${empresaID}`);
  }

  


  getCreditosByCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=OCCID&clienteId=${clienteId}`);
  }
  
}
