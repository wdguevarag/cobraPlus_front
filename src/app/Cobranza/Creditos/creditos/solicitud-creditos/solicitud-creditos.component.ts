import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreditoService } from '../../../../Services/creditos.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/theme/shared/components/error-modal/error-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, mergeMap, Observable, of, throwError } from 'rxjs';
import { PdfGeneratorService } from 'src/app/Services/pdf-generator/pdf-generator.service';
import { DocumentosCreditosService } from 'src/app/Services/documentos_creditos.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { RefinanciacionService } from 'src/app/Services/refinanciacion.service';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';

@Component({
  selector: 'app-solicitud-creditos',
  templateUrl: './solicitud-creditos.component.html',
  styleUrl: './solicitud-creditos.component.scss'
})
export class SolicitudCreditosComponent {

  solicitudesCreditoData: any[] = [];
  filtro: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  isVerCreditoDisabled = false;
  isAnularCreditoDisabled = false;
  isAprobarCreditoDisabled = false;
  currentUser: any;
  creditoActual: any;

  constructor(
    private router: Router, 
    private creditoService: CreditoService, 
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private documentosCreditosService: DocumentosCreditosService,
    private pdfService: PdfGeneratorService,
    private authService: AuthService,

    private refinanciacionService: RefinanciacionService, // nuevo
    private cuotaCronogramaService: CuotasCronogramaService // nuevo

  ) {

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });


    this.creditoService.getCreditosAndDataClient().subscribe(creditoService => {
      this.solicitudesCreditoData = creditoService;
      console.log(this.solicitudesCreditoData);
    });
  }

  onRowClick(event: { idCredito: string, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.idCredito);
    this.router.navigate([`/creditos/consulta/consulta-credito/single-consulta-credito`, event.idCredito]);
  }

  // Redirigir a la consulta de crédito con un timeout de 3s
  verCredito(idCredito: string) {
    if (this.isVerCreditoDisabled) return; // Evita múltiples clics
    this.isVerCreditoDisabled = true;

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: { message: 'Cargando información del crédito...' }
    });

    setTimeout(() => {
      dialogRef.close(); // Cerrar el modal después de 3 segundos
      this.router.navigate([`/creditos/consulta/consulta-credito/single-consulta-credito`, idCredito]);
      this.isVerCreditoDisabled = false; // Reactivar el botón después de la navegación
    }, 3000);
  }

  // // Cambiar el estado a Anulado (1)
  // anularCredito(idCredito: number) {
  //   if (this.isAnularCreditoDisabled) return;
  //   this.isAnularCreditoDisabled = true;
  
  //   this.dialog.open(ErrorDialogComponent, {
  //     data: { message: '¿Estás seguro de anular el crédito?' }
  //   }).afterClosed().subscribe((confirmed) => {
  //     if (confirmed) {
  //       this.creditoService.anularCredito(idCredito).subscribe(response => {
  //         console.log(response);
  //         window.location.reload();
  //       }, error => {
  //         console.error("Error al conectar con el servicio", error);
  //       });
  //     }
  //     this.isAnularCreditoDisabled = false;
  //   });
  // }



  anularCredito(idCredito: number) {
    if (this.isAnularCreditoDisabled) return;
    this.isAnularCreditoDisabled = true;

    const credito = this.solicitudesCreditoData.find(c => c.ID == idCredito);

    if (credito?.Tipo_Solicitud === 'Refinanciacion') {
      // Buscar la data de refinanciación
      this.refinanciacionService.getRefinanciacionDataTable().subscribe(refinanciaciones => {
        const refinancion = refinanciaciones.find(r => r.Credito_ID == idCredito);

        if (!refinancion) {
          console.error('No se encontró la refinanciación correspondiente.');
          this.isAnularCreditoDisabled = false;
          return;
        }

        this.dialog.open(ErrorDialogComponent, {
          data: { message: '¿Estás seguro de anular la refinanciación?' }
        }).afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.cuotaCronogramaService.anularCreditoRefinanciacion(
              Number(refinancion.Credito_ID_Anterior),
              Number(refinancion.Credito_ID),
              Number(refinancion.ID)
            ).subscribe(response => {
              console.log(response);
            }, error => {
              console.error("Error al anular la refinanciación", error);
            });
          }

          this.isAnularCreditoDisabled = false;
        });

      }, error => {
        console.error("Error al obtener las refinanciaciones", error);
        this.isAnularCreditoDisabled = false;
      });

    } else {
      // Lógica normal
      this.dialog.open(ErrorDialogComponent, {
        data: { message: '¿Estás seguro de anular el crédito?' }
      }).afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.creditoService.anularCredito(idCredito).subscribe(response => {
            console.log(response);
            window.location.reload();
          }, error => {
            console.error("Error al conectar con el servicio", error);
          });
        }
        this.isAnularCreditoDisabled = false;
      });
    }
  }

  aprobarCredito(idCredito: number, idCliente: number, fechaDesembolso: string, prestamo: number) {
    if (this.isAprobarCreditoDisabled) return;
    this.isAprobarCreditoDisabled = true;

    this.dialog.open(ErrorDialogComponent, {
      data: { message: '¿Deseas aprobar este crédito?' }
    }).afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        this.isAprobarCreditoDisabled = false;
        return;
      }

      // Obtener el crédito directamente desde la data local
      const credito = this.solicitudesCreditoData.find(c => c.ID == idCredito);

      const aprobar = () => {
        this.creditoService.aprobarCredito(idCredito, idCliente, fechaDesembolso, prestamo).subscribe(response => {
          console.log(response);
          window.location.reload();
        }, error => {
          console.error("Error al conectar con el servicio", error);
        }, () => {
          this.isAprobarCreditoDisabled = false;
        });
      };

      if (credito?.Tipo_Solicitud === 'Refinanciacion') {
        this.crearDocumentosSinFirmar(credito).subscribe({
          next: () => aprobar(),
          error: err => {
            console.error("Error al crear documentos", err);
            this.isAprobarCreditoDisabled = false;
          }
        });
      } else {
        aprobar();
      }
    });
  }

  get solicitudesFiltradas() {
    return this.solicitudesCreditoData
      .filter(solicitud =>
        solicitud.Estado_Credito !== '1' &&
        solicitud.Estado_Anulado !== '1' &&
        solicitud.Estado_Deuda !== '1' &&
        (
          solicitud.Tipo_Solicitud !== 'Refinanciacion' ||
          solicitud.Estado_Aprobado !== '1'
        )
      )
      .filter(solicitud =>
        Object.values(solicitud).some(value =>
          value.toString().toLowerCase().includes(this.filtro.toLowerCase())
        )
      )
      .sort((a, b) => new Date(b.Fecha_Desembolso).getTime() - new Date(a.Fecha_Desembolso).getTime());
  }

  get totalPaginas() {
    return Math.ceil(this.solicitudesFiltradas.length / this.itemsPorPagina);
  }

  get solicitudesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.solicitudesFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }


  private crearDocumentosSinFirmar(credito: any): Observable<any> {
    const Empresa_ID = this.currentUser.Empresa_ID;
    const Cliente_ID = credito.ID_Cliente;
    const Credito_ID = credito.ID;
    const pdfAval = credito.Estado_Aval === '1' ? 'SI' : 'NO';
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


