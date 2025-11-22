import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AplicacionService } from 'src/app/Services/aplicaciones.service';
import { IconService } from 'src/app/Services/Common/icon.service';

@Component({
  selector: 'app-nueva-aplicacion',
  templateUrl: './nueva-aplicacion.component.html',
  styleUrls: ['./nueva-aplicacion.component.scss']
})
export class NuevaAplicacionComponent implements OnInit {
  aplicacionForm!: FormGroup;

  constructor(
    private aplicacionService: AplicacionService ,
    public iconService: IconService ,
    
  ) {}
  
  ngOnInit() {
    this.aplicacionForm = new FormGroup({
      Nombre: new FormControl(''),
      Ruta: new FormControl(''),
      Descripcion: new FormControl(''),
      Icono: new FormControl(''),
      Estado: new FormControl('1')
    });
  }

  submitFn(data: any) {
    return this.aplicacionService.createAplicacion(data);
  }
}




