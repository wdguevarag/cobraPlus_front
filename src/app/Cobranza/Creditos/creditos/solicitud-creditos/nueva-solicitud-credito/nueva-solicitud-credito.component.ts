import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ClienteService } from 'src/app/Services/clientes.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';
import { CreditoService } from 'src/app/Services/creditos.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/theme/shared/components/error-modal/error-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-solicitud-credito',
  templateUrl: './nueva-solicitud-credito.component.html',
  styleUrls: ['./nueva-solicitud-credito.component.scss']
})
export class NuevaSolicitudCreditoComponent implements OnInit {
  clientes: any[] = [];
  asesores: any[] = [];
  clienteCtrl = new FormControl();
  tipoSolicitud: string;
  asesorSeleccionado: number = 0;
  clienteSeleccionado: any;
  evaluacionActiva: any;

  clientesFiltrados = [...this.clientes];
  clienteFiltro: string = '';

  creditosClienteData: any[] = [];
  selectedTab = 0;

  creditosClienteColumns: any[] = [
    { header: 'ID', field: 'ID', show: true },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  // Definición de tabs
  SolicitudTabs = [{ title: 'SOLICITUD' }, { title: 'CLIENTE' }, { title: 'EVALUACIÓN' }];

  filteredClientes: Observable<any[]>;
  opcionesTipoSolicitud: { value: string; label: string }[] = [];
  solicitudValor: string;
  estadoCredito: string;
  deudaActiva: number;
  singleClienteIdSolicitud: number;
  creditoVigente: string;
  idCreditoAnterior: number = 0;
  singleEvaluacionIdSolicitud: number;

  constructor(
    private clienteService: ClienteService,
    public GrupoDeDatoService: GrupoDeDatoService,
    private usuarioService: UsuarioService,
    private creditoService: CreditoService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router
  ) {}

  filtrarClientes() {
    this.clientesFiltrados = this.clientes.filter((cliente) =>
      `${cliente.Nombres} ${cliente.Apellido_Paterno} ${cliente.Apellido_Materno}`.toLowerCase().includes(this.clienteFiltro.toLowerCase())
    );
  }

  displayFn(cliente: any): string {
    return cliente ? `${cliente.Nombres} ${cliente.Apellido_Paterno} ${cliente.Apellido_Materno}` : '';
  }

  onCambiarATabEvaluacion() {
    this.selectedTab = 2;
  }

  // Cargamos todos los clientes y asesores
  ngOnInit(): void {
    this.clienteService.getClientes().subscribe((clientes) => {
      this.clientes = clientes;
      console.log('clientes', clientes);
    });
  }

  cambiarATabSolicitud() {
    this.selectedTab = 0; // índice del tab "SOLICITUD"
  }

  onClienteChange(clienteId: number): void {
    //Validar si la información del cliente se ha llenado correctamente
    this.clienteService.validateClientInformation(clienteId).subscribe((response) => {
      if (response[0].COD === '0') {
        this.dialog.open(ErrorDialogComponent, {
          data: { message: `${response[0].Observacion}` }
        });
        this.router.navigate([`/creditos/mantenimiento/cliente/single-cliente/${clienteId}`]);
      }
    });

    this.clienteService.getCreditoPendienteByIdCliente(clienteId).subscribe((response) => {
      console.log(response);

      // if (response.length > 0 && response[0].length > 0) {
      //     console.log("test");
      //     this.solicitudValor = response[0][0].Estado_Deuda;
      // } else {
      //     this.solicitudValor = "0"; // O cualquier valor por defecto
      //     console.log("test1");
      // }

      if (response.length > 0 && response[0].length > 0) {
        const ultimoCredito = response[0][0];
        if (ultimoCredito.Tipo_Solicitud === 'Refinanciacion') {
          this.dialog
            .open(ErrorDialogComponent, {
              data: { message: 'Este Cliente tiene un Credito activo tipo ' + ultimoCredito.Tipo_Solicitud + ' con ID:' + ultimoCredito.ID }
            })
            .afterClosed()
            .subscribe(() => {
              window.history.back(); 
            });
          return;
        }

        this.solicitudValor = ultimoCredito.Estado_Deuda;
      } else {
        this.solicitudValor = '0';
      }

      if (response.length > 1 && response[1].length > 0) {
        this.creditoVigente = response[1][0].COD;
        this.deudaActiva = response[1][0].Prestamo_Actual;
        this.idCreditoAnterior = response[1][0].ID;
        this.estadoCredito = 'SOLICITADO';
        console.log('test2');
      } else {
        this.creditoVigente = '0'; // O cualquier valor por defecto
        this.deudaActiva = response?.[0]?.[0]?.Prestamo_Actual ?? 0.0;
        this.idCreditoAnterior = response[0][0].ID;
        console.log('test3');
        this.estadoCredito = 'SOLICITADO';
        if (response[0][0].Prestamo_Actual < 1 || response[0][0].Estado_Deuda == 1) {
          this.estadoCredito = 'NUEVO';
          console.log('test4');
        }
      }

      // Forzar la actualización del componente
      this.cdRef.detectChanges();
    });

    this.clienteService.getClienteById(clienteId).subscribe((cliente) => {
      console.log('Detalle del cliente:', cliente);
      this.clienteSeleccionado = cliente;
      this.singleClienteIdSolicitud = cliente.ID;
      if (this.clienteSeleccionado) {
        this.clienteService.getEvaluacionesByCliente(this.clienteSeleccionado.ID).subscribe({
          next: (evaluaciones) => {
            this.evaluacionActiva = evaluaciones.find((eva) => eva.Estado == '1') || { ID: 0 };
            console.log('Evaluación ID:', this.evaluacionActiva.ID);
            this.singleEvaluacionIdSolicitud = this.evaluacionActiva.ID;
          },
          error: (err) => {
            console.error('Error al obtener evaluaciones:', err);
            this.evaluacionActiva = { ID: 0 };
          }
        });

        this.creditoService.getCreditosByCliente(this.clienteSeleccionado.ID).subscribe({
          next: (creditos) => {
            this.creditosClienteData = creditos;
          },
          error: (err) => {
            console.error('Error al obtener CREDITOS DEL cliente:', err);
          }
        });
      }

      this.cdRef.detectChanges();
    });
  }
}
