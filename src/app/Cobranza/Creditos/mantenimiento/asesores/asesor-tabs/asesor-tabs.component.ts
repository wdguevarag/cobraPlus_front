import { Component, Input, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../../Services/usuario.service';

@Component({
  selector: 'app-asesor-tabs',
  templateUrl: './asesor-tabs.component.html',
  styleUrl: './asesor-tabs.component.scss'
})
export class AsesorTabsComponent implements OnInit {

  @Input() tipo: 'view' | 'edit' = 'view';
  @Input() singleAsesorId: number | null = null;

  @Input() visibleTabIndices: number[] | null = null;

  singleAsesorData: any;

  // --- Cuentas ---
  activeCuentaView: 'list' | 'single' | 'new' = 'list';
  selectedCuentaId: number | null = null;

  // --- Comentarios Cobros ---
  activeComentarioCobroView: 'list' | 'single' | 'new' = 'list';
  selectedComentarioCobroId: number | null = null;


  // Definición de los encabezados de pestañas (0-indexado)
  asesoresTabs = [
    { title: 'CUENTAS' },  
    //{ title: 'COMENTARIOS COBROS' },    
  ];

  // Datos y columnas para cada tabla (ya definidos)
  asesorCuentasData: any[] = [];
  asesorCuentasColumns = [
    { header: 'ID', field: 'ID', show: true },
    { header: 'Principal', field: 'Principal' ,type: 'binario', trueValue: 'PRINCIPAL', falseValue: 'NO PRINCIPAL'},
    { header: 'Banco', field: 'Banco_Nombre' },
    { header: 'Cuenta', field: 'Nro_Cuenta' , noNumeric: true},
    { header: 'CCI', field: 'CCI' , noNumeric: true},
    { header: 'Estado', field: 'Estado' ,type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO'}
  ];
 
  asesorComentariosCobrosData: any[] = [];
  asesorComentariosCobrosColumns = [
    { header: 'ID', field: 'ID', show: true },
    { header: 'Comentario', field: 'Comentario' },
    { header: 'Estado', field: 'Estado',type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }

  ];
 

  constructor(private usuarioService: UsuarioService) {}



  onRowClick(event: { id: number; tableName?: string }): void {
    console.log('Fila seleccionada:', event.id, 'Tabla:', event.tableName);
    switch (event.tableName) {
      case 'Cuentas':
        this.selectedCuentaId = event.id;
        this.activeCuentaView = 'single';
        break;
      case 'Comentarios-Cobros':
        this.selectedComentarioCobroId = event.id;
        this.activeComentarioCobroView = 'single';
        break;
      default:
        break;
    }
  }

  // Funciones para cambiar a la vista "new" de cada pestaña
  plusShowCuentas(): void { this.activeCuentaView = 'new'; }
  plusShowComentariosCobros(): void { this.activeComentarioCobroView = 'new'; }

  // Funciones para regresar a la vista "list" de cada pestaña
  goBackCuentas(): void { this.activeCuentaView = 'list'; }
  goBackComentariosCobros(): void { this.activeComentarioCobroView = 'list'; }

  // Método para cargar datos de cada tabla
  loadTablas(): void {
    if (this.singleAsesorId) {
      this.usuarioService.getCuentasAsesor(this.singleAsesorId).subscribe(
        (response) => { 
          // Asumiendo que response es el objeto completo:
          this.asesorCuentasData = response; 
        },
        (error) => console.error('Error al obtener cuentas:', error)
      );
      
      this.usuarioService.getComentariosAsesor(this.singleAsesorId).subscribe(
        (response) => { 
          this.asesorComentariosCobrosData = response.COMENTARIOS; 
        },
        (error) => console.error('Error al obtener cuentas:', error)
      );

    }
  }



  ngOnInit(): void {
    if (this.singleAsesorId !== null) {
      this.usuarioService.getUsuarioById(this.singleAsesorId).subscribe(
        (data) => {
          this.singleAsesorData = data;
          this.loadTablas();
        },
        (error) => console.error('Error al obtener el asesor:', error)
      );
    } else {
      console.error('singleAsesorId es null o no se ha proporcionado.');
    }
  }



}
