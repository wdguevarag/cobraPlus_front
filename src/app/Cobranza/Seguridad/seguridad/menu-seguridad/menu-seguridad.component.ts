import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-menu-seguridad',
  templateUrl: './menu-seguridad.component.html',
  styleUrl: './menu-seguridad.component.scss'
})
export class MenuSeguridadComponent implements OnInit {

  currentUser: any;
  usuarioNivel: string = '';

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        if (user.Rol_ID == 1) {
          this.usuarioNivel = "nivel1";
        } else if (user.Rol_ID == 2) {
          this.usuarioNivel = "nivel2";
        } else if (user.Rol_ID == 3 || user.Rol_ID == 4) {
          this.usuarioNivel = "nivel3";
        } else {
          this.usuarioNivel = "desconocido";
        }
      }
    });
  }
}






































