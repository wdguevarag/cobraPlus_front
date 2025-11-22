import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { ModuloService } from 'src/app/Services/modulo.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IconService } from 'src/app/Services/Common/icon.service';


@Component({
  selector: 'app-nuevo-modulo',
  templateUrl: './nuevo-modulo.component.html',
  styleUrls: ['./nuevo-modulo.component.scss']
})
export class NuevoModuloComponent implements OnInit {

  moduloForm!: FormGroup;

  constructor( 
    private moduloService: ModuloService,  
    public aplicacionService: AplicacionService,
    public iconService: IconService ,

  ) {}
  
  ngOnInit() {
    this.moduloForm = new FormGroup({
      Nombre: new FormControl(''),
      Aplicacion_ID: new FormControl('1'),
      Descripcion: new FormControl(''),
      Icono: new FormControl(''),
      Ruta: new FormControl(''),
      Estado: new FormControl('1')
    });
  }
  
  submitFn(data: any) {
    return this.moduloService.createModulo(data);
  }

}
