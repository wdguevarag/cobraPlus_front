import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { MenuUnfoldOutline, MenuFoldOutline, SearchOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-nav-left',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit {
  // public props
  @Input() navCollapsed!: boolean;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();
  windowWidth: number;
  modulo: string = 'creditos'; // Establecer el valor de modulo como 'seguridad' o 'creditos'

  // Arrays de botones
  seguridadButtons = [
    { name: 'Empresa', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Empresa presionado') },
    { name: 'Seguridad', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Seguridad presionado') }
  ];

  creditosButtons = [
    { name: 'Parámetros', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Parámetros presionado') },
    { name: 'Mantenimiento', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Mantenimiento presionado') },
    { name: 'Consulta', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Consulta presionado') },
    { name: 'Créditos', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Créditos presionado') },
    { name: 'Operaciones', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Operaciones presionado') },
    { name: 'Reportes', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Reportes presionado') },
    { name: 'Oficialía', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Oficialía presionado') },
    { name: 'Documentos', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Documentos presionado') },
    { name: 'Indicadores', class: 'btn btn-primary w-100 mb-2', action: () => console.log('Botón Indicadores presionado') }
  ];

  // Propiedad para almacenar el array de botones según el módulo
  buttons: { name: string, class: string, action: () => void }[] = [];

  // Constructor
  constructor(private iconService: IconService) {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(...[MenuUnfoldOutline, MenuFoldOutline, SearchOutline]);
  }

  // Asignar el array de botones según el módulo
  ngOnInit(): void {
    this.buttons = this.modulo === 'seguridad' ? this.seguridadButtons : this.creditosButtons;
  }

  // public method
  navCollapse() {
    this.NavCollapse.emit();
  }
}
