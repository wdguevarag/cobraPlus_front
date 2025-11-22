import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { IconService } from 'src/app/Services/Common/icon.service';

@Component({
  selector: 'app-single-aplicacion',
  templateUrl: './single-aplicacion.component.html',
  styleUrl: './single-aplicacion.component.scss'
})
export class SingleAplicacionComponent implements OnInit{

  isLoading: boolean = true; 
  isEditing: boolean = false;

  rolesAsignadosColumns: any[] = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado', field: 'Aplicacion_Rol_Estado', type: 'binario', trueValue: 'Activo', falseValue: 'Inactivo' },

  ];

  rolesAsignadosData: any[] = [];

  singleAplicacionId: number | null = null;
  singleAplicacionData: any;

  aplicacionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private aplicacionService: AplicacionService , 
    public iconService: IconService ,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleAplicacionId = +params.get('id')!;
      if (this.singleAplicacionId) {

      this.aplicacionService.getAplicacionById(this.singleAplicacionId).subscribe (
        (data) => {
          this.singleAplicacionData = data;
          this.initForm();

          this.aplicacionService.getRolesByAplicacion(this.singleAplicacionId).subscribe(
            (data) => {
              this.rolesAsignadosData = data.filter(item => +item.Aplicacion_Rol_Estado === 1);
              console.log('Datos de roles asignados activos:', this.rolesAsignadosData);
            },
            (error) => {
              console.error('Error al obtener las roles asignados:', error);
            }
          )


          this.isLoading = false;
        },
        (error) => {
          console.error('Error al obtener el usuario:', error);
          this.isLoading = false;

        }
      );

      }
      else {
        this.isLoading = false;
      }
    });
  }


  initForm() {
    this.aplicacionForm = this.fb.group({
      ID: [this.singleAplicacionData.ID],
      Nombre: [this.singleAplicacionData.Nombre],
      Descripcion: [this.singleAplicacionData.Descripcion],
      Ruta: [this.singleAplicacionData.Ruta],
      Icono: [this.singleAplicacionData.Icono],
      Estado: [this.singleAplicacionData.Estado],

    });
  }

  submitFn(formData: FormData) {
    return this.aplicacionService.editAplicacion(formData);
  }

  updateEstado = (newValue: number) => {
    this.aplicacionForm.patchValue({ Estado: newValue });
  };

}