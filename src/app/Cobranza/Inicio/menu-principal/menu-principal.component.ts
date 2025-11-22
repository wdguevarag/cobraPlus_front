/* menu-principal.component.ts */
import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterModule, Router } from "@angular/router";
import { SharedModule } from "src/app/theme/shared/shared.module";
import { SeguridadModule } from "../../Seguridad/seguridad/seguridad.module";

import { AuthService } from 'src/app/Services/Common/Auth.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';
import { AccesoService } from 'src/app/Services/acesso.service';
import { RolService } from 'src/app/Services/rol.service';

import { forkJoin } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    SeguridadModule
  ],
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent implements OnInit {
  @Input() navCollapsed!: boolean;
  @Output() NavCollapse = new EventEmitter<void>();
  @Output() NavCollapsedMob = new EventEmitter<void>();
  @Output() moduloSeleccionado = new EventEmitter<number>();

  currentUser: any;
  rolData: any;

  aplicaciones: any[] = [];
  modulos: any[] = [];
  accesos: any[] = [];

  type: string = '';
  selectedModule: any = null;
  selectedModuleRoute: string = '';

  constructor(
    private authService: AuthService,
    private rolService: RolService,
    private aplicacionService: AplicacionService,
    private moduloService: ModuloService,
    private accesoService: AccesoService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.checkRoute();
    this.authService.currentUser$.pipe(
      filter(user => !!user?.Rol_ID),
      switchMap(user => this.rolService.getRolById(user.Rol_ID)),
      switchMap(rol => {
        this.rolData = rol;
        const accesosRol = rol.accesos || [];
        const appIDs = [...new Set(accesosRol.map((a: any) => +a.Aplicacion_ID))];
        const modIDs = [...new Set(accesosRol.map((a: any) => +a.Modulo_ID))];
        const accIDs = [...new Set(accesosRol.map((a: any) => +a.Acceso_ID))];

        return forkJoin({
          apps: this.aplicacionService.getAplicaciones(),
          mods: this.moduloService.getModulos(),
          accs: this.accesoService.getAccesos()
        }).pipe(
          switchMap(({ apps, mods, accs }) => {
            this.aplicaciones = apps.filter(a => appIDs.includes(+a.ID) && a.ID == 2);
            this.modulos = mods.filter(m => modIDs.includes(+m.ID));
            this.accesos = accs.filter(acc => accIDs.includes(+acc.ID));
            return [];
          })
        );
      })
    ).subscribe();
  }

  checkRoute(): void {
    const url = this.router.url;
    this.type = url.includes('seguridad/seguridad-menu')
      ? 'seguridad-menu'
      : url.includes('creditos/credito-menu')
        ? 'credito-menu'
        : '';
  }

  /**
   * Abre los accesos de un módulo, incluyendo su ruta de aplicación
   */
  selectModule(appRuta: string, modulo: any): void {
    this.selectedModule = modulo;
    this.selectedModuleRoute = `${appRuta}/${modulo.Ruta}`;
    this.moduloSeleccionado.emit(modulo.ID);
  }

  backToModules(): void {
    this.selectedModule = null;
    this.selectedModuleRoute = '';
  }

  getModulosByAplicacion(aplicacionId: number): any[] {
    return this.modulos.filter(m => +m.Aplicacion_ID === +aplicacionId);
  }

  getAccesosByModulo(moduloId: number): any[] {
    return this.accesos.filter(a => +a.Modulo_ID === +moduloId);
  }

  getRuta(baseRoute: string, nombre: string): string {
    const clean = nombre
      .trim()
      .toLowerCase()
      .normalize('NFC')
      .replace(/\s+/g, '-')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ç]/g, 'c');
    return `${baseRoute}/${clean}`;
  }

  onItemClick(route: string): void {
    this.router.navigate([route]);
  }
}
