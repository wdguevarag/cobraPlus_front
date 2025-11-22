import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './Services/Common/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está logueado y tiene token válido
    const isLoggedIn = this.authService.isLoggedIn();
    const hasStoredSession = this.authService.hasStoredSession();

    if (isLoggedIn && hasStoredSession) {
      return true;
    }

    // Si no está logueado o no tiene sesión válida, limpiar y redirigir
    if (!hasStoredSession) {
      console.warn('No hay sesión válida. Redirigiendo al login...');
      this.authService.clearInvalidSession();
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
