import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-menu-indicadores',
  templateUrl: './menu-indicadores.component.html',
  styleUrls: ['./menu-indicadores.component.scss']
})
export class MenuIndicadoresComponent implements OnInit {
  currentUser: any = null;
  allowedAccesses: string[] = []; // Nombres de accesos permitidos para el usuario

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      console.log("Usuario actual:", user);
      this.currentUser = user;
      // Solo para usuarios de nivel 3
      if (user && user.Rol_ID == '3') {
        this.usuarioService.getAccesosByUsuario(user.ID).subscribe(response => {
          console.log("Respuesta del servicio de accesos:", response);
          if (response.icodError === "0") {
            // Filtramos los accesos con Estado igual a '1'
            const accesosActivos = response.ACCESOS;
            // Extraemos y "trim" el nombre para evitar problemas con espacios
            this.allowedAccesses = accesosActivos.map((acceso: any) => acceso.Nombre.trim());
            console.log("Accesos permitidos:", this.allowedAccesses);
          } else {
            console.error("Error en la respuesta:", response.vdesError);
          }
        }, error => {
          console.error("Error al obtener los accesos:", error);
        });
      }
    });
  }

  /**
   * Retorna true si:
   * - El usuario ya está cargado y es de nivel 3 y el nombre (tras aplicar trim) está en allowedAccesses.
   * - Si el usuario no es de nivel 3 (en este componente solo esperamos nivel 3) se puede retornar false.
   */
  isAccessAllowed(accessName: string): boolean {
    if (!this.currentUser) {
      return false;
    }
    // Si el usuario es de nivel 3, mostramos la tarjeta solo si allowedAccesses incluye el nombre.
    if (this.currentUser.Rol_ID == 3) {
      return this.allowedAccesses.includes(accessName.trim());
    }
    return false;
  }
}
