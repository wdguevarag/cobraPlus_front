import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OficinaService } from 'src/app/Services/oficina.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';


@Component({
  selector: 'app-nueva-oficina',
  templateUrl: './nueva-oficina.component.html',
  styleUrls: ['./nueva-oficina.component.scss']
})
export class NuevaOficinaComponent implements OnInit {

  currentUser: any ;

  oficinaForm!: FormGroup;

  constructor(
    private oficinaService: OficinaService,
    private authService: AuthService,
    private fb: FormBuilder,

  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.oficinaForm = this.fb.group({
      Nombre: ['', Validators.required],
      Empresa_ID: [ this.currentUser.Empresa_ID, Validators.required],
      Descripcion: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Coordenada_Y: ['', Validators.required],
      Coordenada_X: ['', Validators.required],
      Estado: ['1', Validators.required],
    });
  }

  submitFn(data: any) {
    return this.oficinaService.createOficina(data);
  }
}




