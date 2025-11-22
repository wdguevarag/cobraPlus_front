import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ParametroService } from 'src/app/Services/parametros.service';

@Component({
  selector: 'app-nuevo-parametro',
  templateUrl: './nuevo-parametro.component.html',
  styleUrl: './nuevo-parametro.component.scss'
})
export class NuevoParametroComponent implements OnInit {

  parametroForm!: FormGroup;

  constructor(
    private parametroService: ParametroService,
  ) {}


  ngOnInit() {
    this.parametroForm = new FormGroup({
      Nombre: new FormControl(''),
      Descripcion: new FormControl(''),
      Valor1: new FormControl(''),
      Valor2: new FormControl(''),
      Valor3: new FormControl(''),
      Unidad_Medida: new FormControl(''),
      Estado: new FormControl(1)
    });
  }


  submitFn(data: any) {
    return this.parametroService.createParametro(data);
  }

}