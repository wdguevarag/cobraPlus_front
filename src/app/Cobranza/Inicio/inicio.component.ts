// angular import
import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

  currentUser: any;
  usuarioNivel: string = '';

  aplicacionData: any[] = [];


  constructor(
    private authService: AuthService,
    private aplicacionService: AplicacionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        if (user.Rol_ID == 1) {
          this.usuarioNivel = "nivel1";
        } else if (user.Rol_ID == 2) {
          this.usuarioNivel = "nivel2";
        } else if (user.Rol_ID == 3 || user.Rol_ID == 4 ) {
          this.usuarioNivel = "nivel3";
        } else {
          this.usuarioNivel = "desconocido";
        }
      }
    });
  
    // Obtener todas las aplicaciones y luego filtrarlas según el nivel
    this.aplicacionService.getAplicaciones().subscribe(response => {
      this.aplicacionData = this.filtrarAplicacionesPorNivel(response).slice(0, 1);
      console.log('🎯 Aplicaciones filtradas para el nivel', this.usuarioNivel, ':', this.aplicacionData);
    }, error => {
      console.error('Error al obtener las Empresas', error);
    });
  }
  
  private filtrarAplicacionesPorNivel(aplicaciones: any[]): any[] {
    switch (this.usuarioNivel) {
      case "nivel1":
        return aplicaciones.filter(aplicacion => aplicacion.Nombre === "Seguridad");
      case "nivel2":
        return aplicaciones.filter(aplicacion => 
          aplicacion.Nombre === "Seguridad" || aplicacion.Nombre === "Créditos"
        );
      case "nivel3":
        return aplicaciones.filter(aplicacion => aplicacion.Nombre === "Créditos");
      default:
        return [];
    }
  }


}