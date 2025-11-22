import { Component, OnInit } from '@angular/core';
import { GrupoDeDatoService } from '../../../../../../Services/grupo-de-datos.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nuevo-dato',
  templateUrl: './nuevo-dato.component.html',
  styleUrl: './nuevo-dato.component.scss'
})

export class NuevoDatoComponent implements OnInit {
  formData = {
    codOpe: 'CDGD',
    Grupo_Datos_ID: 0,
    Nombre: '',
    Descripcion: '',
    Valor: '',
    Estado: 1
  };

  submitFn = (data: any) => this.GrupoDeDatoService.createDetalleGrupoDatos(data);

  ngOnInit(): void {
    const grupoId = this.route.snapshot.paramMap.get('id');
    if (grupoId) {
      this.formData.Grupo_Datos_ID = Number(grupoId);
      console.log('Grupo_Datos_ID asignado:', this.formData.Grupo_Datos_ID);
    }
  }

  constructor(
    private GrupoDeDatoService: GrupoDeDatoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  handleSuccess() {
    this.router.navigate(['../detalle-grupo-de-dato']);
  }
}

