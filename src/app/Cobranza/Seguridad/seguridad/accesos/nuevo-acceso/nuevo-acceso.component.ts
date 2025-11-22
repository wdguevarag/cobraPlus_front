import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccesoService } from 'src/app/Services/acesso.service';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';
import { IconService } from 'src/app/Services/Common/icon.service';


@Component({
  selector: 'app-nuevo-acceso',
  templateUrl: './nuevo-acceso.component.html',
  styleUrls: ['./nuevo-acceso.component.scss']
})
export class NuevoAccesoComponent implements OnInit {

  accesoForm!: FormGroup;

  constructor(
    private accesoService: AccesoService , 
    public  moduloService: ModuloService , 
    public aplicacionService: AplicacionService ,
    public iconService: IconService ,

  ) {}
  
  ngOnInit() {
    this.accesoForm = new FormGroup({
      Nombre: new FormControl(''),
      Ruta: new FormControl(''),
      Descripcion: new FormControl(''),
      Icono: new FormControl(''),
      Aplicacion_ID: new FormControl(1),
      Modulo_ID: new FormControl(1),
      Estado: new FormControl(1)
    });
  }

  submitFn(data: any) {
    return this.accesoService.createAcceso(data);
  }

}