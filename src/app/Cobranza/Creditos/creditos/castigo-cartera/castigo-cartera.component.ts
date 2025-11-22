import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { CreditoService } from 'src/app/Services/creditos.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-castigo-cartera',
  templateUrl: './castigo-cartera.component.html',
  styleUrls: ['./castigo-cartera.component.scss']
})
export class CastigoCarteraComponent implements OnInit {
  currentUser: any;

  creditosData: any[] = [];
  filteredCreditos: any[] = [];
  castigoData: any[] = [];
  castigadosData: any[] = [];

  selectedAnalista: string = '';
  selectedCliente: string = '';

  analistas: any[] = [];
  clientes: any[] = [];

  creditosColumns = [
    { header: 'Cod. Credito', field: 'ID', show: true },
    { header: 'Cliente', field: 'Cliente' },
    { header: 'Préstamo', field: 'Prestamo' },
    { header: 'Saldo Capital', field: 'Prestamo_Actual' },
    { header: 'Asesor', field: 'Asesor' },
    { header: 'Días Atraso', field: 'Atraso_Prox_Cuota' },
    { header: 'Fecha Pago', field: 'Fecha_Pago_Formateado' , noNumeric: true  }
  ];

  constructor(
    private creditoService: CreditoService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.getAnalistas();
    this.getCreditos();
  }


  // Obtiene analistas a través de UsuarioService
  getAnalistas(): void {
    this.usuarioService.getUsuariosAsesores().subscribe(response => {
      this.analistas = response;
    }, error => {
      console.error('Error al obtener analistas', error);
    });
  }

  // Obtiene créditos y los separa en disponibles y castigados
  getCreditos(): void {
    this.creditoService.getCreditosClientCastigo().subscribe(response => {
      // Créditos disponibles: donde Castigado no es '1'
      this.creditosData = response.filter(credito => credito.Estado_Castigado !== '1');
      // Créditos castigados: donde Castigado es '1'
      this.castigadosData = response.filter(credito => credito.Estado_Castigado == '1')
        .map(credito => ({ ...credito, selected: false }));
      this.applyFilters();
    }, error => {
      console.error('Error al obtener créditos', error);
    });
  }

  // Obtiene clientes y los filtra según el analista seleccionado
  getClientesFiltered(): void {
    this.clienteService.getClientes().subscribe(response => {
      if (this.selectedAnalista) {
        this.clientes = response.filter(cliente => cliente.Asesor_ID.toString() === this.selectedAnalista);
      } else {
        this.clientes = response;
      }
    }, error => {
      console.error('Error al obtener clientes', error);
    });
  }

  // Aplica los filtros de analista y cliente a los créditos disponibles
  applyFilters(): void {
    this.filteredCreditos = this.creditosData.filter(credito => {
      const analistaMatch = this.selectedAnalista ? (credito.Asesor_ID.toString() === this.selectedAnalista) : true;
      const clienteMatch = this.selectedCliente ? (credito.ID_Cliente.toString() === this.selectedCliente) : true;
      return analistaMatch && clienteMatch;
    });
  }

  // Al cambiar la selección del analista
  onAnalistaChange(): void {
    this.selectedCliente = '';
    this.getClientesFiltered();
    this.applyFilters();
  }

  // Al cambiar la selección del cliente
  onClienteChange(): void {
    this.applyFilters();
  }

  // Mueve un crédito de la tabla de disponibles a la tabla "Castigo"
  moveToCastigo(credito: any): void {
    this.creditosData = this.creditosData.filter(item => item.ID !== credito.ID);
    this.applyFilters();
    this.castigoData.push(credito);
  }

  // Devuelve un crédito de la tabla "Castigo" a la lista de disponibles
  moveToCreditos(credito: any): void {
    this.castigoData = this.castigoData.filter(item => item.ID !== credito.ID);
    this.creditosData.push(credito);
    this.applyFilters();
  }

  popupVisible = false;
  popupMessage = '';

  showPopup(message: string): void {
    this.popupMessage = message;
    this.popupVisible = true;
  }

  closePopup(): void {
    this.popupVisible = false;
  }

  castigarCreditos(): void {
    if (this.castigoData.length === 0) {
      this.showPopup("No hay créditos seleccionados para castigar.");
      return;
    }
    if (this.castigoData.length > 1) {
      this.showPopup("Solo puede Castigar un credito al mismo tiempo");
      return;
    }
    this.castigoData.forEach(credito => {
      this.creditoService.createCastigarReestablecerCredito(credito.ID, 1)
        .subscribe(response => {
          if (response.length > 0 && response[0].codError === '0') {
            this.showPopup(`El crédito fue castigado correctamente, Credito ID: ${credito.ID}`);
          } else {
            this.showPopup(`Error al castigar el crédito, Credito ID: ${credito.ID}`);
          }
        }, error => {
          console.error(`Error al castigar crédito ${credito.ID}`, error);
          this.showPopup(`Error al castigar crédito ${credito.ID}`);
        });
    });
    this.castigoData = [];
    this.getCreditos();
  }

  restablecer(): void {
    const selectedCredits = this.castigadosData.filter(credito => credito.selected);
    if (selectedCredits.length === 0) {
      this.showPopup("No se han seleccionado créditos para restablecer.");
      return;
    }
    selectedCredits.forEach(credito => {
      this.creditoService.createCastigarReestablecerCredito(credito.ID, 0)
        .subscribe(response => {
          if (response.length > 0 && response[0].codError === '0') {
            this.showPopup(`El crédito fue reestablecido correctamente, Credito ID: ${credito.ID}`);
          } else {
            this.showPopup(`Error al reestablecer el crédito, Credito ID: ${credito.ID}`);
          }
          this.castigadosData = this.castigadosData.filter(c => c.ID !== credito.ID);
          this.creditosData.push(credito);
          this.applyFilters();
        }, error => {
          console.error(`Error al restablecer crédito ${credito.ID}`, error);
          this.showPopup(`Error al restablecer crédito ${credito.ID}`);
        });
    });
  }

}
