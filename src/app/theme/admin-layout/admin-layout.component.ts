// Angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FechaSistemaService } from 'src/app/Services/Common/fecha-sistema.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminComponent {
  navCollapsed = false;
  navCollapsedMob = false;

  mostrarPopupCierre = false;
  empresaCierre = '';

  constructor(
    private fechaSistemaService: FechaSistemaService,
    private authService: AuthService,
    private router: Router
  ) {
    setInterval(() => {
      this.checkEstadoCierre();
    }, 30000);
  }

  navMobClick() {
    const navEl = document.querySelector('app-navigation.pc-sidebar');
    if (this.navCollapsedMob && !navEl?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }

    if (navEl?.classList.contains('navbar-collapsed')) {
      navEl.classList.remove('navbar-collapsed');
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    document.querySelector('app-navigation.pc-sidebar')?.classList.remove('mob-open');
  }

  private checkEstadoCierre(): void {
    this.fechaSistemaService.verificarEstadoCierre().subscribe({
      next: (respuesta) => {
        if (respuesta.Cierre_Hecho) {
          const empresaId = localStorage.getItem('empresa_id') ?? 'Desconocida';
          this.empresaCierre = empresaId;
          this.mostrarPopupCierre = true;
        }
      },
      error: (error) => {
        console.error('Error al verificar el cierre:', error);
      }
    });
  }

  cerrarPopupYSalir(): void {
    this.mostrarPopupCierre = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
