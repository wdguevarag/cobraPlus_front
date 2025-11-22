import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccesoService } from 'src/app/Services/acesso.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';
import { IconService } from 'src/app/Services/Common/icon.service';



@Component({
  selector: 'app-single-acceso',
  templateUrl: './single-acceso.component.html',
  styleUrl: './single-acceso.component.scss'
})

export class SingleAccesoComponent implements OnInit {

  isLoading: boolean = true; 
  isEditing: boolean = false;

  singleAccesoId: number | null = null;
  singleAccesoData: any;

  singleAccesoModulo: any ;
  singleAccesoAplicacion: any ;

  accesoForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,  
    private fb: FormBuilder,
    private accesoService: AccesoService , 
    public  moduloService: ModuloService , 
    public aplicacionService: AplicacionService  ,
    public iconService: IconService ,
    
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleAccesoId = +params.get('id')!;
      if (this.singleAccesoId) {

      this.accesoService.getAccesoById(this.singleAccesoId).subscribe (
        (data) => {
          this.singleAccesoData = data;
          this.initForm();

          this.moduloService.getModuloById(this.singleAccesoData.Modulo_ID).subscribe(
            (modulo) => {
              this.singleAccesoModulo = modulo;
            },
            (error) => {
              console.error('Error al obtener el Módulo:', error);
            }
          );
          
          this.aplicacionService.getAplicacionById(this.singleAccesoData.Aplicacion_ID).subscribe(
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
    this.accesoForm = this.fb.group({
      ID: [this.singleAccesoData.ID],
      Nombre: [this.singleAccesoData.Nombre],
      Ruta : [this.singleAccesoData.Ruta ] ,
      Descripcion: [this.singleAccesoData.Descripcion],
      Icono: [this.singleAccesoData.Icono],
      Aplicacion_ID : [this.singleAccesoData.Aplicacion_ID ] ,
      Modulo_ID : [this.singleAccesoData.Modulo_ID ] ,
      Estado: [this.singleAccesoData.Estado],

    });
  }

  submitFn(formData: FormData) {
    return this.accesoService.editAcceso(formData);
  }

  updateEstado = (newValue: number) => {
    this.accesoForm.patchValue({ Estado: newValue });
  };


}
