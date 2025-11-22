import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RefinanciacionService } from '../../../../Services/refinanciacion.service';
import { CuotasCronogramaService } from '../../../../Services/cuotas-cronograma.service';
import { ClienteService } from '../../../../Services/clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/theme/shared/components/error-modal/error-dialog.component';
import { CreditoService } from 'src/app/Services/creditos.service';
import { forkJoin, mergeMap, Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { PdfGeneratorService } from 'src/app/Services/pdf-generator/pdf-generator.service';
import { DocumentosCreditosService } from 'src/app/Services/documentos_creditos.service';


@Component({
  selector: 'app-refinanciacion',
  templateUrl: './refinanciacion.component.html',
  styleUrl: './refinanciacion.component.scss'
})
export class RefinanciacionComponent {

  refinancionData: any[] = [];
  filtro: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  isAnularRefinanciacionDisabled = false;
  currentUser: any;


  constructor(
    private router: Router, 
    private refinanciacionService: RefinanciacionService, 
    private cuotaCronogramaService: CuotasCronogramaService, 
    private creditoService: CreditoService, 
    public dialog: MatDialog ,
        
    private pdfService: PdfGeneratorService,
    private documentosCreditosService: DocumentosCreditosService,
    private authService: AuthService
  ) {

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.refinanciacionService.getRefinanciacionDataTable().subscribe(refinanciones => {
      this.refinancionData = refinanciones.filter(ref => 
        ref.Credito_Estado_Aprobado === '0' 
         &&  ref.Credito_Estado_Anulado ==='0'
      );
    });

  }

  
  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/creditos/creditos/refinanciacion/single-refinanciacion`, event.id]);
  }
  
  get totalPaginas() {
    const refinanciacionesFiltradas = this.refinancionData.filter(ref =>
      ref.Cliente?.toLowerCase().includes(this.filtro.toLowerCase())
    );
    return Math.ceil(refinanciacionesFiltradas.length / this.itemsPorPagina);
  }

  get refinanciacionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;

    const refinanciacionesFiltradas = this.refinancionData.filter(ref =>
      ref.Cliente?.toLowerCase().includes(this.filtro.toLowerCase())
    );

    return refinanciacionesFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }


  aprobarCredito(idCredito: number, idCliente: number, fechaDesembolso: string, prestamo: number) {
    this.dialog.open(ErrorDialogComponent, {
      data: { message: '¿Deseas aprobar este crédito?' }
    }).afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      // Buscar la fila completa en refinancionData
      const refinancion = this.refinancionData.find(r => r.Credito_ID == idCredito);
      if (!refinancion) {
        console.error('No se encontró la refinanciación con ese ID');
        return;
      }

      this.crearDocumentosSinFirmar({
        ID: refinancion.Credito_ID,
        ID_Cliente: refinancion.Cliente_ID,
        Estado_Aval: refinancion.Credito_Estado_Aval ?? '0' 
      }).subscribe({
        next: () => {
          // Una vez creados los documentos, aprobar el crédito
          this.creditoService.aprobarCredito(idCredito, idCliente, fechaDesembolso, prestamo).subscribe({
            next: (response) => {
              console.log(response);
              window.location.reload();
            },
            error: (error) => {
              console.error("Error al aprobar el crédito", error);
            }
          });
        },
        error: (err) => {
          console.error("Error al crear documentos sin firma", err);
        }
      });
    });
  }


  anularRefinanciacion(idRefinanciacion: string, idCreditoActual: string, idCreditoAnterior:string) {
    if (this.isAnularRefinanciacionDisabled) return;
    this.isAnularRefinanciacionDisabled = true;
  
    this.dialog.open(ErrorDialogComponent, {
      data: { message: '¿Estás seguro de anular la refinanciacion?' }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.cuotaCronogramaService.anularCreditoRefinanciacion(Number(idCreditoAnterior), Number(idCreditoActual), Number(idRefinanciacion)).subscribe(response => {
          console.log(response);
          window.location.reload();
        }, error => {
          console.error("Error al conectar con el servicio", error);
        });
      }
      this.isAnularRefinanciacionDisabled = false;
    });
  }

  verRefinanciacion(idRefinanciacion: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: { message: 'Cargando información...' }
    });

    setTimeout(() => {
      dialogRef.close(); 
      this.router.navigate([`/creditos/credito/refinanciacion/single-refinanciacion`, idRefinanciacion]);
    }, 3000);
  }



  private crearDocumentosSinFirmar(credito: any): Observable<any> {
    const Empresa_ID = this.currentUser.Empresa_ID;
    const Cliente_ID = credito.ID_Cliente;
    const Credito_ID = credito.ID;
    const pdfAval = credito.Credito_Estado_Aval === '1' ? 'SI' : 'NO';
    const tiposDoc = ['CONTRATO', 'PRESTAMO', 'PAGARE', 'CALENDARIO', 'TRANSFERENCIA'];

    return forkJoin(tiposDoc.map(td =>
      this.pdfService.getPdf(Cliente_ID, Credito_ID, 'sin-firma', td, pdfAval).pipe(
        mergeMap(blob => {
          const file = new File([blob], `${td}.pdf`, { type: 'application/pdf' });
          const fd = new FormData();
          fd.append('Empresa_ID', Empresa_ID);
          fd.append('Cliente_ID', Cliente_ID);
          fd.append('Credito_ID', Credito_ID);
          fd.append('Tipo_Documento', td);
          fd.append('Estado', '0');
          fd.append('Documento', file);
          return this.documentosCreditosService.createDocumento(fd);
        })
      )
    ));
  }




}


