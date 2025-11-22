import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuloService } from 'src/app/Services/modulo.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { IconService } from 'src/app/Services/Common/icon.service';


@Component({
  selector: 'app-single-modulo',
  templateUrl: './single-modulo.component.html',
  styleUrl: './single-modulo.component.scss'
})

export class SingleModuloComponent implements OnInit  {
  isLoading: boolean = true; 
  isEditing: boolean = false;

  singleModuloId: number | null = null;
  singleModuloData: any;

  singleAccesoAplicacion: any ;

  moduloForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,  
    private moduloService: ModuloService , 
    public aplicacionService: AplicacionService,
    public iconService: IconService ,
    private fb: FormBuilder

  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleModuloId = +params.get('id')!;
      if (this.singleModuloId) {

      this.moduloService.getModuloById(this.singleModuloId).subscribe (
        (data) => {
          this.singleModuloData = data;
          this.initForm();
          this.aplicacionService.getAplicacionById(this.singleModuloData.Aplicacion_ID).subscribe(
            (aplicacion) => {
              this.singleAccesoAplicacion = aplicacion;
            },
            (error) => {
              console.error('Error al obtener la Aplicación:', error);
            }
          );

          this.isLoading = false; 

        },
        (error) => {
          console.error('Error al obtener el usuario:', error);
          this.isLoading = false; 
        }
      );



      }else {
        this.isLoading = false;
      }
    });
  }

  initForm() {
    this.moduloForm = this.fb.group({
      ID: [this.singleModuloData.ID],
      Nombre: [this.singleModuloData.Nombre],
      Aplicacion_ID: [this.singleModuloData.Aplicacion_ID],
      Descripcion: [this.singleModuloData.Descripcion],
      Icono: [this.singleModuloData.Icono],
      Ruta: [this.singleModuloData.Ruta],
      Estado: [this.singleModuloData.Estado],
    });
  }

  submitFn(formData: FormData) {
    return this.moduloService.editModulo(formData);
  }

  updateEstado = (newValue: number) => {
    this.moduloForm.patchValue({ Estado: newValue });
  };


}