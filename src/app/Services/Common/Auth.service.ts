import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, switchMap, of } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
    
  constructor(private usuarioService: UsuarioService) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, contrasena: string): Observable<any> {
    return this.usuarioService.login(email, contrasena).pipe(
      switchMap((usuario) => {
        console.log("Test 1");
        // Verificar si hubo error de autenticación
        if (usuario && (usuario.icodError === '-1' || usuario.icodError === -1)) {
          console.error('Error de login:', usuario.vdesError);
          return of(null);
        }

        if (usuario && usuario.token) {
          localStorage.setItem('currentUser', JSON.stringify(usuario));
          localStorage.setItem('user_id', usuario.ID);
          localStorage.setItem('user_token', usuario.token);
          localStorage.setItem('empresa_id', usuario.Empresa_ID);
          localStorage.setItem('rol_id', usuario.Rol_ID);
          // Guardar Perfil_ID en el localStorage
          localStorage.setItem('perfil_id', usuario.Perfil_ID);
          this.currentUserSubject.next(usuario);
          console.log("Test 2");
          return this.usuarioService.getFechaCierre(usuario.Empresa_ID).pipe(
            tap((response) => {
              console.log("jalando data");
              if (response.length > 0 && response[0].FechaActual) {
                localStorage.setItem('fechaSistemaStorage', response[0].FechaActual);
              }
            }),
            map(() => usuario),
            catchError(err => {
              console.error('Error obteniendo fecha de cierre:', err);
              // Continuar con el login aunque falle la fecha de cierre
              return of(usuario);
            })
          );
        } else {
          return of(null);
        }
      }),
      catchError(err => {
        console.error('Error en login:', err);
        return of(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_token');
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('fechaSistemaStorage');
    localStorage.removeItem('rol_id');
    localStorage.removeItem('perfil_id');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const userId = localStorage.getItem('user_id');
    const userToken = localStorage.getItem('user_token');
    return !!this.currentUserSubject.value && !!userId && !!userToken;
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getUserToken(): string | null {
    return localStorage.getItem('user_token');
  }

  // Limpiar sesión cuando el token es inválido
  clearInvalidSession(): void {
    console.warn('Sesión inválida. Limpiando datos de autenticación...');
    this.logout();
  }

  // Verificar si hay datos de sesión almacenados
  hasStoredSession(): boolean {
    return !!localStorage.getItem('user_id') && !!localStorage.getItem('user_token');
  }
}
