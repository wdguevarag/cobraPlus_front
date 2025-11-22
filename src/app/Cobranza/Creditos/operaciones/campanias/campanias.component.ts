import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaniasService } from '../../../../Services/campanias.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-campanias',
  templateUrl: './campanias.component.html',
  styleUrls: ['./campanias.component.scss']
})
export class CampaniasComponent implements OnInit {
  Title: string = "Campañas";
  TotalClientes: number = 15;
  MontoTotal: number = 2400.50;

  campaniasTabs = [
    { title: 'TABLA' },
    { title: 'RESUMEN CAMPAÑA' },
    { title: 'BUSCAR CLIENTE APTO' },
  ];

  campaniasColumns = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Nombre_Cliente', field: 'Nombre_Cliente' },
    { header: 'Monto', field: 'Monto' },
    { header: 'Fecha_Oferta', field: 'Fecha_Oferta' , noNumeric: true  },
    { header: 'Nombre_Asesor', field: 'Nombre_Asesor' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  campaniasData: any;
  campaniasDataAll: any;
  asesores: string[] = [];
  asesoresResumen: { id: number; nombre: string }[] = [];
  ordenAscendente: boolean = true;
  ordenCampaniasAprobadas: boolean = true;

  resumenCampaniaData: any;
  porcentajeHPV: number = 0;
  porcentajeAsesor: number = 0;
  totalClientes: number = 0;




  searchQuery: string = '';
  clientesFiltrados: any[] = [];



  currentUser: any;


  constructor(
    private router: Router,
    private campaniasService: CampaniasService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.campaniasService.getCampanias().subscribe(data => {
      this.campaniasDataAll = data;
      this.campaniasData = data.filter (item => item.Estado_Anulado !== '1');
      this.updateTotales(); // Actualización dinámica de los totales
      this.asesores = Array.from(new Set(data.map((campania: any) => campania.Cliente_Asesor_Nombre + ' ' + campania.Cliente_Asesor_Apellido)));
      
      const asesoresMap: any = {};
      data.forEach((campania: any) => {
        if (!asesoresMap[campania.Cliente_Asesor_ID]) {
          asesoresMap[campania.Cliente_Asesor_ID] = {
            id: campania.Cliente_Asesor_ID,
            nombre: campania.Cliente_Asesor_Nombre
          };
        }
      });
      this.asesoresResumen = Object.values(asesoresMap);
    });
  }
  
  updateTotales(): void {
    if (this.campaniasData && this.campaniasData.length > 0) {
      this.TotalClientes = this.campaniasData.length;
      this.MontoTotal = this.campaniasData.reduce((sum: number, campania: any) => {
        return sum + Number(campania.Monto);
      }, 0);
    } else {
      this.TotalClientes = 0;
      this.MontoTotal = 0;
    }
  }

  filtrarPorAsesor(seleccion: string): void {
    if (!seleccion) {
      this.campaniasData = [...this.campaniasDataAll];
    } else {
      this.campaniasData = this.campaniasDataAll.filter((campania: any) =>
        (campania.Cliente_Asesor_Nombre + ' ' + campania.Cliente_Asesor_Apellido).toLowerCase() === seleccion.toLowerCase()
      );
    }
    this.updateTotales();
  }


  ordenarPorMonto(): void {
    if (this.campaniasData && this.campaniasData.length) {
      this.campaniasData.sort((a, b) => 
        this.ordenAscendente ? Number(b.Monto) - Number(a.Monto) : Number(a.Monto) - Number(b.Monto)
      );
      this.ordenAscendente = !this.ordenAscendente;
      // No hace falta actualizar, puesto que el número de campañas no cambia,
      // pero si requieres que se actualicen en algún otro proceso, la puedes llamar
      this.updateTotales();
    }
  }
  

  filtrarCampaniasAprobadas(): void {
    if (!this.campaniasDataAll) return;
    this.campaniasData = this.ordenCampaniasAprobadas
      ? this.campaniasDataAll.filter(c => c.Estado == '1' && c.Estado_Anulado !== '1')
      : [...this.campaniasDataAll];
    this.ordenCampaniasAprobadas = !this.ordenCampaniasAprobadas;
    this.updateTotales();
  }
  

  filtrarResumenPorAsesor(asesorID: string): void {
    if (!asesorID) {
      this.resumenCampaniaData = null;
      this.totalClientes = 0;
      this.porcentajeHPV = 0;
      this.porcentajeAsesor = 0;
      return;
    }

    const id = Number(asesorID);
    this.campaniasService.getResumenCampañaById(id).subscribe(data => {
      this.resumenCampaniaData = data;

      const numHPV = +data.Asesor_Clientes_Numero || 0;
      const numAsesor = +data.Asesor_Clientes_Numero || 0;

      this.totalClientes = numHPV + numAsesor;
      this.porcentajeHPV = this.totalClientes > 0 ? (numHPV / this.totalClientes) * 100 : 0;
      this.porcentajeAsesor = this.totalClientes > 0 ? (numAsesor / this.totalClientes) * 100 : 0;
    });
  }

  // Método para anular campaña: previene múltiples clicks y cambia la opacidad del botón mientras se carga
  anularCampania(campania: any): void {
    if (campania.isAnulando) {
      return;
    }
    campania.isAnulando = true;
    console.log('Anulando campaña:', campania.ID);
    this.campaniasService.anularCampania(campania.ID).subscribe(
      response => {
        console.log('Respuesta del servicio:', response);
        campania.isAnulando = false;
        this.ngOnInit()
      },
      error => {
        console.error('Error al anular campaña:', error);
        campania.isAnulando = false;
      }
    );
  }



  // Función para filtrar clientes
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.buscarClienteApto(inputElement.value);
  }

  // Función para buscar cliente
  buscarClienteApto(query: string): void {
    if (!query) {
      this.clientesFiltrados = [];
      return;
    }

    // Filtra las campañas que coinciden con el nombre completo del cliente
    this.clientesFiltrados = this.campaniasDataAll.filter((campania: any) =>
      (campania.Cliente_Nombre + ' ' + campania.Cliente_Apellido_Paterno + ' ' + campania.Cliente_Apellido_Materno)
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    // Eliminar duplicados (si hay más de un cliente con el mismo nombre completo)
    this.clientesFiltrados = Array.from(new Set(this.clientesFiltrados.map(cliente =>
      cliente.Cliente_Nombre + ' ' + cliente.Cliente_Apellido_Paterno + ' ' + cliente.Cliente_Apellido_Materno
    )))
    .map(nombreCompleto => this.campaniasDataAll.find(cliente =>
      (cliente.Cliente_Nombre + ' ' + cliente.Cliente_Apellido_Paterno + ' ' + cliente.Cliente_Apellido_Materno) === nombreCompleto
    ));
  }

  seleccionarCliente(cliente: any): void {
    this.searchQuery = cliente.Cliente_Nombre + ' ' + cliente.Cliente_Apellido_Paterno + ' ' + cliente.Cliente_Apellido_Materno;
    this.campaniasData = this.campaniasDataAll.filter(c =>
      c.Cliente_Nombre === cliente.Cliente_Nombre &&
      c.Cliente_Apellido_Materno === cliente.Cliente_Apellido_Materno &&
      c.Cliente_Tipo_Doc_Nombre === cliente.Cliente_Tipo_Doc_Nombre &&
      c.Cliente_Documento === cliente.Cliente_Documento
    );
    this.clientesFiltrados = []; // limpiar sugerencias
    this.updateTotales();
  }


  filtrarPorEstado(estado: string): void {
    if (!this.campaniasDataAll) {
      return;
    }
  
    if (estado === "1") {
      // APROBADA: Estado igual a '1' y no anuladas (Estado_Anulado distinto de '1')
      this.campaniasData = this.campaniasDataAll.filter((campania: any) =>
        campania.Estado === '1' && campania.Estado_Anulado !== '1'
      );
    } else if (estado === "2") {
      // ANULADA: Estado_Anulado igual a '1'
      this.campaniasData = this.campaniasDataAll.filter((campania: any) =>
        campania.Estado_Anulado === '1'
      );
    } else if (estado === "3") {
      // POR VALIDAR: Estado distinto de '1' y no anuladas
      this.campaniasData = this.campaniasDataAll.filter((campania: any) =>
        campania.Estado !== '1' && campania.Estado_Anulado !== '1'
      );
    } else {
      // Si se selecciona una opción "TODOS" u otra no definida, se muestra todo
      this.campaniasData = [...this.campaniasDataAll];
    }
    this.updateTotales();
  }
  
  
  irADetalleCampania(id: number): void {
    this.router.navigate(['/creditos/operacion/campaña/single-campaña', id]);
  }

  showConfirmModal: boolean = false;
  campaniaToAnular: any = null;

  // Llamado desde el botón “Anular”
  showConfirm(campania: any): void {
    this.campaniaToAnular = campania;
    this.showConfirmModal = true;
  }

  // Cierra el popup sin hacer nada
  hideConfirm(): void {
    this.showConfirmModal = false;
    this.campaniaToAnular = null;
  }

  // Confirmación: llama a tu método real y cierra el popup
  confirmAnular(): void {
    if (this.campaniaToAnular) {
      this.anularCampania(this.campaniaToAnular);
    }
    this.hideConfirm();
  }

}
