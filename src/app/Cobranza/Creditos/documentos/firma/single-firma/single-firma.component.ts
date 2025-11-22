import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// Environments
import { PAGE_URL } from 'src/environments/environment';

// Services
import { CreditoService } from 'src/app/Services/creditos.service';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { DocumentosCreditosService } from 'src/app/Services/documentos_creditos.service';
import { PdfGeneratorService } from 'src/app/Services/pdf-generator/pdf-generator.service';
import { GeneralInputFileComponent } from 'src/app/theme/shared/components/general-input-file/general-input-file.component';
import { SignatureInputComponent } from 'src/app/theme/shared/components/signature-input/signature-input.component';
import { GeneralUploadInputImgComponent } from 'src/app/theme/shared/components/general-upload-input-img/general-upload-input-img.component';


@Component({
  selector: 'app-single-firma',
  templateUrl: './single-firma.component.html',
  styleUrls: ['./single-firma.component.scss']
})
export class SingleFirmaComponent implements OnInit {
  // Configuración inicial
  page_url = PAGE_URL;
  public isLoading: boolean = false;
  popupVisible: boolean = false;





  // Datos principales
  clienteID: number | null = null;
  creditoPorFirmarID: number | null = null;
  creditoPorFirmar: any;
  clienteData: any;
  currentUser: any;

  // Documentos y firma
  documentosCreditoPorFirmar: any[] = [];


  // Firma cliente
  clienteSignatureFile: File | null = null;
  @ViewChild('fileInputCliente') fileInputCliente!: GeneralUploadInputImgComponent;
  @ViewChild('signatureInputCliente') signatureInputCliente!: SignatureInputComponent;

  // Firma avalista
  avalSignatureFile: File | null = null;
  @ViewChild('fileInputAval') fileInputAval!: GeneralUploadInputImgComponent;
  @ViewChild('signatureInputAval') signatureInputAval!: SignatureInputComponent;

  
  activeTabCliente: string = 'SUBIR FIRMA';
  activeTabAval: string = 'SUBIR FIRMA';
  
  isFadingOutCliente = false;
  isFadingOutAval = false;

  pendingTabCliente: string | null = null;
  pendingTabAval: string | null = null;



  // Configuración de tabs
  tipoFirmaTabs = [
    { title: 'SUBIR FIRMA' },
    { title: 'DIBUJAR FIRMA' }
  ];

  constructor(
    private clienteService: ClienteService,
    private creditoService: CreditoService,
    private documentosCreditosService: DocumentosCreditosService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private pdfService: PdfGeneratorService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }


  get tieneAvalista(): boolean {
    return this.creditoPorFirmar?.Estado_Aval == '1';
  }

  private loadInitialData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      this.clienteID = +params['clienteId'];
      this.creditoPorFirmarID = +params['creditoId'];

      this.loadClienteData();
      this.loadCreditoData();
    });
  }

  private loadClienteData(): void {
    if (this.clienteID) {
      this.clienteService.getClienteById(this.clienteID).subscribe(cliente => {
        this.clienteData = cliente;
      });
    }
  }

  private loadCreditoData(): void {
    if (this.creditoPorFirmarID) {
      this.creditoService.getCreditosFirmas().subscribe(creditos => {
        this.creditoPorFirmar = creditos.find(item => item.ID == this.creditoPorFirmarID);
        this.obtenerDocumentosCredito();
      });
    }
  }

  obtenerDocumentosCredito(): void {
    this.documentosCreditosService.getDocumentos(this.creditoPorFirmar.ID).subscribe({
      next: (res: any) => {
        if (res?.Documentos) {
          this.documentosCreditoPorFirmar = res.Documentos;
        }
      },
      error: err => console.error('Error al obtener documentos:', err)
    });
  }





  cambiarTab(tabTitle: string, tipo: 'cliente' | 'aval'): void {
    if (tipo === 'cliente' && this.activeTabCliente !== tabTitle) {
      this.isFadingOutCliente = true;
      this.pendingTabCliente = tabTitle;

      setTimeout(() => {
        this.activeTabCliente = this.pendingTabCliente!;
        this.pendingTabCliente = null;
        this.isFadingOutCliente = false;
        this.clienteSignatureFile = null;

        if (this.activeTabCliente === 'SUBIR FIRMA' && this.signatureInputCliente) {
          this.signatureInputCliente.clearCanvas();
        }

        if (this.activeTabCliente === 'DIBUJAR FIRMA' && this.fileInputCliente) {
          this.fileInputCliente.cancelCrop();
        }
      }, 400);
    }

    if (tipo === 'aval' && this.activeTabAval !== tabTitle) {
      this.isFadingOutAval = true;
      this.pendingTabAval = tabTitle;

      setTimeout(() => {
        this.activeTabAval = this.pendingTabAval!;
        this.pendingTabAval = null;
        this.isFadingOutAval = false;
        this.avalSignatureFile = null;

        if (this.activeTabAval === 'SUBIR FIRMA' && this.signatureInputAval) {
          this.signatureInputAval.clearCanvas();
        }

        if (this.activeTabAval === 'DIBUJAR FIRMA' && this.fileInputAval) {
          this.fileInputAval.cancelCrop();
        }
      }, 400);
    }
  }

    


  onFileSelected(file: File, tipo: 'cliente' | 'aval'): void {
    if (tipo === 'cliente') {
      this.clienteSignatureFile = file;
    } else {
      this.avalSignatureFile = file;
    }
  }


  private convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

 
  

  firmarDocumentos(): void {
    if (!this.clienteSignatureFile) return;

    this.isLoading = true;
    const empresaId = this.currentUser.Empresa_ID;
    const clienteId = this.clienteData.ID;
    const creditoId = this.creditoPorFirmar.ID;

    this.convertFileToBase64(this.clienteSignatureFile).then(firmaClienteBase64 => {
      // Si el crédito requiere firma de aval
      if (this.creditoPorFirmar.Estado_Aval === '1' && this.avalSignatureFile) {
        this.convertFileToBase64(this.avalSignatureFile).then(firmaAvalBase64 => {
          this.processDocumentSigning(empresaId, clienteId, creditoId, firmaClienteBase64, firmaAvalBase64);
        }).catch(error => {
          console.error('Error en conversión de firma del aval:', error);
          this.handleSigningError();
        });
      } else {
        // Solo firma cliente
        this.processDocumentSigning(empresaId, clienteId, creditoId, firmaClienteBase64);
      }
    }).catch(error => {
      console.error('Error en conversión de firma del cliente:', error);
      this.handleSigningError();
    });
  }

  private processDocumentSigning(
    empresaId: number,
    clienteId: number,
    creditoId: number,
    firmaBase64: string,
    firmaAvalBase64?: string
  ): void {
    this.documentosCreditosService.getDocumentos(creditoId).subscribe({
      next: (res: any) => {
        const documentos = res?.Documentos || [];

        const requests = this.createUpdateRequests(
          documentos,
          empresaId,
          clienteId,
          creditoId,
          firmaBase64,
          firmaAvalBase64
        );

        if (requests.length > 0) {
          this.executeUpdateRequests(requests);
        } else {
          this.handleNoDocuments();
        }
      },
      error: err => this.handleDocumentFetchError(err)
    });
  }

  private createUpdateRequests(
    documentos: any[],
    empresaId: number,
    clienteId: number,
    creditoId: number,
    firmaBase64: string,
    firmaAvalBase64?: string
  ) {
    return documentos.map(doc => {
      return this.pdfService.getPdf(
        clienteId,
        creditoId,
        'con-firma',
        doc.Tipo_Documento,
        this.creditoPorFirmar.Estado_Aval == 1 ? 'SI' : 'NO',
        firmaBase64,
        firmaAvalBase64 // puede ser undefined
      ).pipe(
        mergeMap((blob: Blob) => {
          const pdfFile = new File([blob], `${doc.Tipo_Documento}.pdf`, { type: 'application/pdf' });
          const formData = new FormData();
          formData.append('ID', doc.ID);
          formData.append('Empresa_ID', empresaId.toString());
          formData.append('Cliente_ID', clienteId.toString());
          formData.append('Credito_ID', creditoId.toString());
          formData.append('Tipo_Documento', doc.Tipo_Documento);
          formData.append('Estado', '1');
          formData.append('Documento', pdfFile);
          formData.append('Imagen_Firma', firmaBase64);

          // Agregar firma de aval solo si existe
          if (firmaAvalBase64) {
            formData.append('Imagen_Firma_Aval', firmaAvalBase64);
          }

          return this.documentosCreditosService.editDocumento(formData);
        })
      );
    });
  }










  private executeUpdateRequests(requests: any[]): void {
    forkJoin(requests).subscribe({
      next: () => this.handleSigningSuccess(),
      error: err => this.handleSigningError(err)
    });
  }

  private handleSigningSuccess(): void {
    console.log('Documentos firmados exitosamente');
    this.popupVisible = true;
    this.isLoading = false;
  }

  private handleSigningError(error?: any): void {
    console.error('Error en firma de documentos:', error);
    alert('Error al firmar los documentos');
    this.location.back();
    this.isLoading = false;
  }

  private handleNoDocuments(): void {
    console.log('No hay documentos para firmar');
    this.isLoading = false;
  }

  private handleDocumentFetchError(error: any): void {
    console.error('Error obteniendo documentos:', error);
    this.isLoading = false;
  }

  redirectToAnotherPage(): void {
    this.location.back();
  }
}

