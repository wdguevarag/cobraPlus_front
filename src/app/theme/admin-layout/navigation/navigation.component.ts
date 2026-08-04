import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';

import { AuthService } from 'src/app/Services/Common/Auth.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';
import { AccesoService } from 'src/app/Services/acesso.service';
import { RolService } from 'src/app/Services/rol.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() navCollapsed!: boolean;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();

  currentUser: any;
  rolData: any;

  aplicaciones: any[] = [];
  modulos: any[] = [];
  accesos: any[] = [];

  menuStates: { [key: string]: boolean } = {};

  // Restricción temporal: solo estas aplicaciones/módulos/accesos quedan habilitados en el menú
  private allowedAplicaciones = ['Créditos'];
  private allowedModulosPorAplicacion: { [aplicacion: string]: string[] } = {
    'Créditos': ['Mantenimiento', 'Consulta', 'Créditos']
  };
  private allowedAccesosPorModulo: { [modulo: string]: string[] } = {
    'Mantenimiento': ['Clientes'],
    'Consulta': ['Simulador', 'Fic', 'Consultas Crédito'],
    'Créditos': ['Solicitud Créditos']
  };

  constructor(
    private authService: AuthService,
    private rolService: RolService,
    private aplicacionService: AplicacionService,
    private moduloService: ModuloService,
    private accesoService: AccesoService,
    public router: Router
  ) {}


  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.Rol_ID) {
        this.rolService.getRolById(user.Rol_ID).subscribe(rol => {
          this.rolData = rol;
  
          const accesos = rol.accesos || [];
  
          const aplicacionIDs = [...new Set(accesos.map((a: any) => +a.Aplicacion_ID))];
          const moduloIDs = [...new Set(accesos.map((a: any) => +a.Modulo_ID))];
          const accesoIDs = [...new Set(accesos.map((a: any) => +a.Acceso_ID))];
  
          /*
          console.log('🎯 Accesos del rol:', accesos);
          console.log('✅ Aplicacion IDs:', aplicacionIDs);
          console.log('✅ Modulo IDs:', moduloIDs);
          console.log('✅ Acceso IDs:', accesoIDs);
          */
          this.aplicacionService.getAplicaciones().subscribe(apps => {
           // console.log('📦 Todas las aplicaciones:', apps);
  
            this.aplicaciones = apps;
           // console.log('✅ Aplicaciones filtradas:', this.aplicaciones);
  
            this.moduloService.getModulos().subscribe(mods => {
             // console.log('📦 Todos los módulos:', mods);
  
              this.modulos = mods;
             // console.log('✅ Módulos filtrados:', this.modulos);
  
              this.accesoService.getAccesos().subscribe(accs => {
               // console.log('📦 Todos los accesos:', accs);
  
                this.accesos = accs;
               // console.log('✅ Accesos filtrados:', this.accesos);
              });
            });
          });
        });
      }
    });
  }
  

   redirectHome(): void {
     this.router.navigate(['/']);
   }

  toggleMenu(event: Event, key: string) {
    event.stopPropagation();
    this.menuStates[key] = !this.menuStates[key];
  }

  get aplicacionesVisibles(): any[] {
    return this.aplicaciones.filter(a => this.allowedAplicaciones.includes(a.Nombre));
  }

  getModulosByAplicacion(aplicacionId: number): any[] {
    const aplicacion = this.aplicaciones.find(a => +a.ID === +aplicacionId);
    const modulos = this.modulos.filter(m => +m.Aplicacion_ID === +aplicacionId);
    const allowed = aplicacion ? this.allowedModulosPorAplicacion[aplicacion.Nombre] : null;
    return allowed ? modulos.filter(m => allowed.includes(m.Nombre)) : modulos;
  }

  getAccesosByModulo(moduloId: number): any[] {
    const modulo = this.modulos.find(m => +m.ID === +moduloId);
    const accesos = this.accesos.filter(a => +a.Modulo_ID === +moduloId);
    const allowed = modulo ? this.allowedAccesosPorModulo[modulo.Nombre] : null;
    return allowed ? accesos.filter(a => allowed.includes(a.Nombre)) : accesos;
  }

  getRuta(baseRoute: string, nombre: string): string {
    const clean = nombre.trim().toLowerCase()
      .normalize("NFC")
      .replace(/\s+/g, '-')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ç]/g, 'c');

    return `${baseRoute}/${clean}`;
  }

  onItemClick(route: string) {
    this.router.navigate([route]);
  }

  navCollapse() {
    this.NavCollapse.emit();
  }
}
