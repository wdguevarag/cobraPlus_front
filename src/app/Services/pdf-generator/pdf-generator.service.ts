import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { EmpresaService } from '../empresa.service';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  
  private apiUrl       = SERVER_URL + 'ws_servicios/ws_Generate_Pdf.php';
  private empresaID    = localStorage.getItem('empresa_id') || '';
  
  /** Cacheamos la llamada a OIEM para no pedirla cada vez */
  private firmaEmpresa$ = this.empresaService
    .getFirmaBase64(this.empresaID)
    .pipe(shareReplay(1));

  constructor(
    private http: HttpClient,
    private empresaService: EmpresaService
  ) {}

  /**
   * Genera el PDF con:
   *  - firma del usuario (opcional)
   *  - firma de la empresa (siempre, desde backend)
   */

  getPdf(
    clienteID: number, 
    creditoID: number, 
    type: string, 
    tipoDocumento: string, 
    aval: string,
    imagenFirmaUsuario?: string,
    imagenFirmaAval?: string // <-- nuevo parámetro opcional
  ): Observable<Blob> {
    return this.firmaEmpresa$.pipe(
      switchMap(imagenFirmaEmpresa => {
        const formData = new FormData();
        formData.append('codOpe', 'PDFGEN');
        formData.append('clienteID', clienteID.toString());
        formData.append('creditoID', creditoID.toString());
        formData.append('type', type);
        formData.append('tipoDocumento', tipoDocumento);
        formData.append('aval', aval);

        if (imagenFirmaUsuario) {
          formData.append('Imagen_Firma', imagenFirmaUsuario);
        }

        if (imagenFirmaAval) {
          formData.append('Imagen_Firma_Aval', imagenFirmaAval);
        }

        formData.append('Imagen_Firma_Empresa', imagenFirmaEmpresa);

        return this.http.post(this.apiUrl, formData, { responseType: 'blob' });
      })
    );
  }


}
