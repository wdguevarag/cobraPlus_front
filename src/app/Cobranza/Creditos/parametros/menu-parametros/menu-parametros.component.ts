import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-menu-parametros',
  templateUrl: './menu-parametros.component.html',
  styleUrls: ['./menu-parametros.component.scss']
})
export class MenuParametrosComponent implements OnInit {
  currentUser: any = null;
  allowedAccesses: string[] = []; // Nombres de accesos permitidos para el usuario

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      console.log("Usuario actual:", user); // Verifica que llegue el usuario
      this.currentUser = user;
      if (user && user.Rol_ID == '3') {
        this.usuarioService.getAccesosByUsuario(user.ID).subscribe(response => {
          console.log("Respuesta del servicio de accesos:", response);
          if (response.icodError === "0") {
            // Filtrar los accesos con Estado '1'
            const accesosActivos = response.ACCESOS;
            // Extraer el nombre y aplicar trim() para evitar espacios extra
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
   * - El usuario está cargado y es de nivel 3, y el accessName (después de trim) se encuentra en allowedAccesses.
   * - En caso contrario (por ejemplo, si no es nivel 3), se podría definir un comportamiento distinto.
   */
  isAccessAllowed(accessName: string): boolean {
    if (!this.currentUser) {
      return false;
    }
    // Si el usuario no es de nivel 3, podrías optar por mostrar todo o nada.
    if (this.currentUser.Rol_ID !== 3) {
      return true;
    }
    return this.allowedAccesses.includes(accessName.trim());
  }
}
