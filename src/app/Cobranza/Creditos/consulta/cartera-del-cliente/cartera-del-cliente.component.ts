import { Component, OnInit } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { UsuarioService  } from 'src/app/Services/usuario.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-cartera-del-cliente',
  templateUrl: './cartera-del-cliente.component.html',
  styleUrl: './cartera-del-cliente.component.scss'
})
export class CarteraDelClienteComponent implements OnInit {
  asesores$: Observable<any[]>;
  
  selectedUserId: number | null = null;
  tipoUbicacion: string | string = ' ';
  currentUser: any ;


  constructor(
    private usuarioService: UsuarioService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      switchMap(user => {
        this.currentUser = user;
        return this.usuarioService.getUsuariosAsesores().pipe(
          map(response => response.filter(item => item.Empresa_ID === user.Empresa_ID))
        );
      })
    ).subscribe(filteredAsesores => {
      this.asesores$ = of(filteredAsesores);
    });
  }
  
  onSelectionChange(): void {
    const asesoresSelect = document.getElementById('asesores') as HTMLSelectElement;
    const tipoUbicacionSelect = document.getElementById('tipoUbicacion') as HTMLSelectElement;
  
    this.selectedUserId = asesoresSelect?.value ? Number(asesoresSelect.value) : null;
    this.tipoUbicacion = tipoUbicacionSelect?.value || '';
  
    console.log('Valores actualizados:', this.selectedUserId, this.tipoUbicacion);
  }
  
}