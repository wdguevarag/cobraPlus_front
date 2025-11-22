import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ClienteService } from '../../../../../Services/clientes.service';
import { PAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-cliente-tabs',
  templateUrl: './cliente-tabs.component.html',
  styleUrls: ['./cliente-tabs.component.scss']
})
export class ClienteTabsComponent implements OnInit {

  @Input() tipo: 'view' | 'edit' = 'view';
  @Input() singleClienteId: number | null = null;
  // Permite que el componente padre delimite qué pestañas mostrar
  @Input() visibleTabIndices: number[] | null = null;
  @Input() singleClienteIdSolicitud?: number;

  singleClienteData: any;

  page_url = PAGE_URL;  
  

  // --- Domicilios ---
  activeDomicilioView: 'list' | 'single' | 'new' = 'list';
  selectedDomicilioId: number | null = null;

  // --- Negocios ---
  activeNegocioView: 'list' | 'single' | 'new' = 'list';
  selectedNegocioId: number | null = null;

  // --- Contactos ---
  activeContactoView: 'list' | 'single' | 'new' = 'list';
  selectedContactoId: number | null = null;

  // --- Cuentas ---
  activeCuentasView: 'list' | 'single' | 'new' = 'list';
  selectedCuentaId: number | null = null;

  // --- RCC ---
  activeRccView: 'list' | 'single' | 'new' = 'list';
  selectedRccId: number | null = null;

  // --- Documentos ---
  activeDocumentosView: 'list' | 'single' | 'new' = 'list';
  selectedDocumentoId: number | null = null;

  // --- Familiares ---
  activeFamiliaresView: 'list' | 'single' | 'new' = 'list';
  selectedFamiliarId: number | null = null;

  // --- Evaluaciones ---
  activeEvaluacionesView: 'list' | 'single' | 'new' = 'list';
  selectedEvaluacionId: number | null = null;

  // Definición de los encabezados de pestañas (0-indexado)
  clientesTabs = [
    { title: 'DOMICILIO' },  // índice 0
    { title: 'NEGOCIO' },    // índice 1
    { title: 'CONTACTO' },   // índice 2
    { title: 'CUENTAS' },    // índice 3
    { title: 'RCCs' },       // índice 4
    { title: 'DOCUMENTOS' }, // índice 5
    { title: 'FAMILIAR' },   // índice 6
    { title: 'EVALUACION' }    // índice 7

  ];

  // Datos y columnas para cada tabla (ya definidos)
  clienteDomiciliosData: any[] = [];
  clienteDomiciliosColumns = [
    { header: 'id', field: 'ID', show: false },
    { header: 'Principal', field: 'Principal', type: 'binario', trueValue: 'Principal', falseValue: 'No Principal' },
//    { header: 'Tipo Zona', field: 'Tipo_Zona' },
    { header: 'Tipo Zona', field: 'Tipo_Zona_Nombre' },
    { header: 'Zona', field: 'Zona' , noNumeric: true},
    { header: 'Dirección', field: 'Direccion' },
    { header: 'Referencia', field: 'Referencia', noNumeric: true },
  ];
 
  clienteNegociosData: any[] = [];
  clienteNegociosColumns = [
    { header: 'id', field: 'ID', show: false },
    { header: 'Principal', field: 'Principal', type: 'binario', trueValue: 'Principal', falseValue: 'No Principal' },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Ubicacion', field: 'Ubicacion' },
    { header: 'Direccion', field: 'Direccion' },
    { header: 'Referencia', field: 'Referencia' },
  ];
 
  clienteContactosData: any[] = [];
  clienteContactosColumns = [
    { header: 'Principal', field: 'Principal', type: 'binario', trueValue: 'Principal', falseValue: 'No Principal' },
    { header: 'id', field: 'ID', show: false },
    // { header: 'Categoría Contacto', field: 'Categoria' },
    // { header: 'Tipo Contacto', field: 'Tipo_Contacto' },
    { header: 'Categoría Contacto', field: 'Categoria_Nombre' },
    { header: 'Tipo Contacto', field: 'Tipo_Contacto_Nombre' },
    { header: 'Telefono', field: 'Telefono' , noNumeric: true },
    { header: 'Whatsapp', field: 'Whatsapp' , noNumeric: true},
    { header: 'Correo', field: 'Correo' },
    { header: 'Comentario', field: 'Comentario' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];
 
  clienteCuentasData: any[] = [];
  clienteCuentasColumns = [
    { header: 'id', field: 'ID', show: false },
    { header: 'Principal', field: 'Principal', type: 'binario', trueValue: 'Principal', falseValue: 'No Principal' },
    // { header: 'Banco', field: 'Banco' },
    { header: 'Banco', field: 'Banco_Nombre' },
    { header: 'Cuenta', field: 'Nro_Cuenta' , noNumeric: true },
    { header: 'CCI', field: 'CCI' , noNumeric: true},
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  clienteRccsData: any[] = [];
  clienteRccsColumns = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Comentario', field: 'Comentario' },
    { header: 'Ruta', field: 'Ruta_Documento' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];
 
  clienteDocumentosData: any[] = [];
  clienteDocumentosColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Img', field: 'Ruta_Documento', type: 'img' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];
  
  clienteFamiliaresData: any[] = [];
  clienteFamiliaresColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Nombres', field: 'Nombres' , noNumeric: true },
    { header: 'Apellido Paterno', field: 'Apellido_Paterno' , noNumeric: true},
    { header: 'Apellido Materno', field: 'Apellido_Materno' , noNumeric: true},
    // { header: 'Tipo Documento', field: 'Tipo_Documento' },
    { header: 'Tipo Documento', field: 'Tipo_Documento_Nombre' },
    { header: 'Documento', field: 'Nro_Documento' , noNumeric: true },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  clienteEvaluacionesData: any[] = [];
  clienteEvaluacionesColumns = [
    { header: 'Fecha de Inicio', field: 'Fecha_Inicio' , noNumeric: true },
    { header: 'Fecha de Fin', field: 'Fecha_Fin' , noNumeric: true  },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  
  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    if (this.singleClienteId !== null) {
      this.clienteService.getClienteById(this.singleClienteId).subscribe(
        (data) => {
          this.singleClienteData = data;
          this.loadTablas();
        },
        (error) => console.error('Error al obtener el cliente:', error)
      );
    } else {
      console.error('singleClienteId es null o no se ha proporcionado.');
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['singleClienteIdSolicitud']) {
      this.singleClienteId = changes['singleClienteIdSolicitud'].currentValue;
      this.loadTablas();
    }
  }

  // Método general para manejar el rowClick según la tabla
  onRowClick(event: { id: number; tableName?: string }): void {
    console.log('Fila seleccionada:', event.id, 'Tabla:', event.tableName);
    switch (event.tableName) {
      case 'Domicilios':
        this.selectedDomicilioId = event.id;
        this.activeDomicilioView = 'single';
        break;
      case 'Negocios':
        this.selectedNegocioId = event.id;
        this.activeNegocioView = 'single';
        break;
      case 'Contactos':
        this.selectedContactoId = event.id;
        this.activeContactoView = 'single';
        break;
      case 'Cuentas':
        this.selectedCuentaId = event.id;
        this.activeCuentasView = 'single';
        break;
      case 'Rccs':
        this.selectedRccId = event.id;
        this.activeRccView = 'single';
        break;
      case 'Documentos':
        this.selectedDocumentoId = event.id;
        this.activeDocumentosView = 'single';
        break;
      case 'Familiares':
        this.selectedFamiliarId = event.id;
        this.activeFamiliaresView = 'single';
        break;
      case 'Evaluaciones':
        this.selectedEvaluacionId = event.id;
        this.activeEvaluacionesView = 'single';
        break;
      default:
        break;
    }
  }

  // Funciones para cambiar a la vista "new" de cada pestaña
  plusShowDomicilios(): void { this.activeDomicilioView = 'new'; }
  plusShowNegocios(): void { this.activeNegocioView = 'new'; }
  plusShowContactos(): void { this.activeContactoView = 'new'; }
  plusShowCuentas(): void { this.activeCuentasView = 'new'; }
  plusShowRccs(): void { this.activeRccView = 'new'; }
  plusShowDocumentos(): void { this.activeDocumentosView = 'new'; }
  plusShowFamiliares(): void { this.activeFamiliaresView = 'new'; }
  plusShowEvaluaciones(): void { this.activeEvaluacionesView = 'new'; }


  // Funciones para regresar a la vista "list" de cada pestaña
  goBackDomicilios(): void { this.activeDomicilioView = 'list'; }
  goBackNegocios(): void { this.activeNegocioView = 'list'; }
  goBackContactos(): void { this.activeContactoView = 'list'; }
  goBackCuentas(): void { this.activeCuentasView = 'list'; }
  goBackRccs(): void { this.activeRccView = 'list'; }
  goBackDocumentos(): void { this.activeDocumentosView = 'list'; }
  goBackFamiliares(): void { this.activeFamiliaresView = 'list'; }
  goBackEvaluaciones(): void { this.activeEvaluacionesView = 'list'; }


  // Método para cargar datos de cada tabla
  loadTablas(): void {
    if (this.singleClienteId) {
      this.clienteService.getDomiciliosByCliente(this.singleClienteId).subscribe(
        (data) => { this.clienteDomiciliosData = data; },
        (error) => console.error('Error al obtener domicilios:', error)
      );
      this.clienteService.getNegociosByCliente(this.singleClienteId).subscribe(
        (data) => { this.clienteNegociosData = data; },
        (error) => console.error('Error al obtener negocios:', error)
      );
      this.clienteService.getContactosByCliente(this.singleClienteId).subscribe(
        (data) => { this.clienteContactosData = data; },
        (error) => console.error('Error al obtener contactos:', error)
      );
      this.clienteService.getCuentasByCliente(this.singleClienteId).subscribe(
        (data) => { this.clienteCuentasData = data; },
        (error) => console.error('Error al obtener cuentas:', error)
      );
      this.clienteService.getRccsByCliente(this.singleClienteId).subscribe(
        (data) => { this.clienteRccsData = data; },
        (error) => console.error('Error al obtener rccs:', error)
      );
      this.clienteService.getDocumentosByCliente(this.singleClienteId).subscribe(
        (data) => {
          this.clienteDocumentosData = data.map((item: any) => {
            if (item.Ruta_Documento && !item.Ruta_Documento.startsWith(this.page_url)) {
              item.Ruta_Documento = this.page_url + item.Ruta_Documento;
            }
            return item;
          });
        },
        (error) => console.error('Error al obtener documentos:', error)
      );
      this.clienteService.getFamiliaresByCliente(this.singleClienteId).subscribe(
        (data) => { this.clienteFamiliaresData = data; },
        (error) => console.error('Error al obtener familiares:', error)
      );

      this.clienteService.getEvaluacionesByCliente(this.singleClienteId).subscribe(
        (data) => { this.clienteEvaluacionesData = data; },
        (error) => console.error('Error al obtener evaluaciones:', error)
      );
    }
  }



  onEvaluacionCreada(): void {
    window.location.reload();
  }
}
