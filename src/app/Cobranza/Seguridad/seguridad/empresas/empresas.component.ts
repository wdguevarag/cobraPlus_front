import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/Services/empresa.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
export class EmpresasComponent implements OnInit {
  currentUser: any;

  empresaColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Dirección', field: 'Direccion' },
    { header: 'RUC', field: 'RUC', noNumeric: true },
    { header: 'Razón Social', field: 'Razon_Social' , noNumeric: true},
    { header: 'Firma', field: 'Firma' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  empresaData: any[] = [];

  constructor(
    private router: Router,
    private empresaService: EmpresaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.empresaService.getEmpresas().subscribe(
      (response) => {
        this.empresaData = response;
      },
      (error) => {
        console.error('Error al obtener las Empresas', error);
      }
    );
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  onRowClick(event: { id: number; tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/seguridad/seguridad/empresa/single-empresa`, event.id]);
  }
}
