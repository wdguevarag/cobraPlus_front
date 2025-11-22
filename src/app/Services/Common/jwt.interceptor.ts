import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './Auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userId = this.authService.getUserId();
    const userToken = this.authService.getUserToken();

    // No agregar autenticación a la petición de LOGIN
    const isLoginRequest = request.url.includes('ws_Usuario.php') &&
                           (request.body?.codOpe === 'LOGIN' || request.params.get('codOpe') === 'LOGIN');

    if (userId && userToken && !isLoginRequest) {
      // Para peticiones GET, agregar user_id y user_token como params
      if (request.method === 'GET') {
        request = request.clone({
          setParams: {
            user_id: userId,
            user_token: userToken
          }
        });
      }
      // Para peticiones POST, agregar user_id y user_token al body
     

      if (request.method === 'POST') {
          if (request.body instanceof FormData) {
            // Caso FormData (ej: subir archivo)
            request.body.append('user_id', userId);
            request.body.append('user_token', userToken);

          } else if (request.body instanceof URLSearchParams) {
            // Caso x-www-form-urlencoded
            request.body.set('user_id', userId);
            request.body.set('user_token', userToken);

          } else if (typeof request.body === 'string') {
            // Caso raro: si el body es string plano (ej: codOpe=ERA&ID=4...)
            const params = new URLSearchParams(request.body);
            params.set('user_id', userId);
            params.set('user_token', userToken);
            request = request.clone({ body: params.toString() });

          } else {
            // Caso JSON normal
            const body = request.body || {};
            request = request.clone({
              body: {
                ...body,
                user_id: userId,
                user_token: userToken
              }
            });
          }
        }

      // También agregar el header Authorization (opcional, por compatibilidad)
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`
        }
      });
    }


    return next.handle(request).pipe(
      
      tap(event => {
        // Interceptar respuestas exitosas
        if (event instanceof HttpResponse) {
          const body = event.body;

          // Verificar si el backend retorna error de autenticación
          if (body && (body.icodError === '-401' || body.icodError === -401)) {
            console.warn('Token inválido o expirado. Redirigiendo al login...');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Manejar errores HTTP
        if (error.status === 401) {
          console.warn('Error 401: No autorizado. Redirigiendo al login...');
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
