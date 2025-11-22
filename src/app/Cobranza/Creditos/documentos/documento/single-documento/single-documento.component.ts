import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PAGE_URL } from 'src/environments/environment';
import { CreditoService } from 'src/app/Services/creditos.service';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { DocumentosCreditosService } from 'src/app/Services/documentos_creditos.service';
import { PdfGeneratorService } from 'src/app/Services/pdf-generator/pdf-generator.service'; // Añadido
import { mergeMap } from 'rxjs/operators'; // Añadido

@Component({
  selector: 'app-single-documento',
  templateUrl: './single-documento.component.html',
  styleUrls: ['./single-documento.component.scss']
})
export class SingleDocumentoComponent implements OnInit {




  @Input() type: 'normal' | 'view' = 'normal';
  @Input() clienteIDInput: number | null = null;
  @Input() creditoIDInput: number | null = null;

  page_url = PAGE_URL;

  clienteID: number | null = null;
  creditoID: number | null = null;

  creditoData: any;
  clienteData: any;

  currentUser: any;

  documentosCreditoFirmado: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private creditoService: CreditoService,
    private documentosCreditosService: DocumentosCreditosService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private pdfService: PdfGeneratorService // Añadido
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (this.type === 'normal') {

      this.route.params.subscribe(params => {
        this.clienteID = +params['clienteId'];
        this.creditoID = +params['creditoId'];
        this.loadData();
      });
    } else if (this.type === 'view') {

      this.clienteID = this.clienteIDInput;
      this.creditoID = this.creditoIDInput;
      this.loadData();
    }
  }

  private loadData(): void {
    console.log('Iniciando carga de datos...');
    
    if (this.clienteID) {
      console.log('Cargando datos del cliente ID:', this.clienteID);
      this.clienteService.getClienteById(this.clienteID).subscribe(cliente => {
        this.clienteData = cliente;
        console.log('Datos del cliente cargados:', cliente);
      });
    }

    if (this.creditoID) {
      console.log('Cargando datos del crédito ID:', this.creditoID);
      this.creditoService.getCreditosFirmas().subscribe(creditos => {
        this.creditoData = creditos.find(item => item.ID == this.creditoID);
        console.log('Datos del crédito encontrados:', this.creditoData);
        this.obtenerDocumentosCredito();
      });
    }
  }

  obtenerDocumentosCredito(): void {
    console.log('Obteniendo documentos para crédito ID:', this.creditoData?.ID);
    
    if (this.creditoData?.ID) {
      this.documentosCreditosService.getDocumentos(this.creditoData.ID).subscribe({
        next: (res: any) => {
          console.log('Respuesta de documentos:', res);
          if (res?.Documentos) {
            this.documentosCreditoFirmado = res.Documentos;
            console.log('Documentos existentes:', this.documentosCreditoFirmado);
            this.verificarGenerarCartaNoAdeudo();
          }
        },
        error: err => console.error('Error al obtener documentos:', err)
      });
    }
  }


  

  private verificarGenerarCartaNoAdeudo(): void {
    console.log('Verificando estado de deuda...');
    console.log('Estado_Deuda:', this.creditoData?.Estado_Deuda);
  
    if (this.creditoData?.Estado_Deuda !== '1') {
      console.log('El crédito no está saldado. No se genera carta.');
      return;
    }
  
    console.log('El crédito está saldado. Verificando existencia de carta...');
    const existeCarta = this.documentosCreditoFirmado.some(
      doc => doc.Tipo_Documento === 'CARTA-DE-NO-ADEUDO'
    );
    console.log('¿Ya existe la carta?:', existeCarta);
  
    if (!existeCarta) {
      console.log('Iniciando generación de carta...');
      this.generarYSubirCarta();
    }
  }
  

  

  private generarYSubirCarta(): void {
    console.log('Preparando datos para la carta...');
    const datos = {
      clienteID: this.clienteData?.ID,
      creditoID: this.creditoData?.ID,
      monto: this.creditoData?.Monto,
      fechaDesembolso: this.creditoData?.Fecha_Desembolso,
      nombreCliente: `${this.clienteData?.Nombres} ${this.clienteData?.Apellido_Paterno}`,
      dniCliente: this.clienteData?.Documento
    };
    console.log('Datos para la carta:', datos);

    console.log('Solicitando generación de PDF...');
    this.pdfService.getPdf(
      datos.clienteID,
      datos.creditoID,
      'sin-firma',
      'CARTA-DE-NO-ADEUDO',
      'NO'
    ).pipe(
      mergeMap((pdfBlob: Blob) => {
        const formData = new FormData();
        formData.append('Empresa_ID', this.currentUser.Empresa_ID.toString());
        formData.append('Cliente_ID', datos.clienteID.toString());
        formData.append('Credito_ID', datos.creditoID.toString());
        formData.append('Tipo_Documento', 'CARTA-DE-NO-ADEUDO');
        formData.append('Estado', '1');
        formData.append('Documento', new File([pdfBlob], `Carta_No_Adeudo_${Date.now()}.pdf`, {
          type: 'application/pdf'
        }));

        // Versión corregida sin iteración
        console.log('FormData preparado:', {
          Empresa_ID: this.currentUser.Empresa_ID,
          Cliente_ID: datos.clienteID,
          Credito_ID: datos.creditoID,
          Tipo_Documento: 'CARTA-DE-NO-ADEUDO',
          Estado: '1',
          Documento: `Carta_No_Adeudo_${Date.now()}.pdf`
        });

        return this.documentosCreditosService.createDocumento(formData);
      })
    ).subscribe({
      next: () => {
        console.log('Documento subido exitosamente');
        this.obtenerDocumentosCredito();
      },
      error: (err) => {
        console.error('Error en el proceso completo:', err);
        console.error('Detalles del error:', {
          message: err.message,
          status: err.status,
          error: err.error
        });
      }
    });
}



}
