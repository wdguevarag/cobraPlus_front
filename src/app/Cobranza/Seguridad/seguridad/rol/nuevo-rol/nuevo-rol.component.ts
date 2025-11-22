import { Component, OnInit } from '@angular/core';
import { RolService } from 'src/app/Services/rol.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/Services/Common/Auth.service';


@Component({
  selector: 'app-nueva-rol',
  templateUrl: './nuevo-rol.component.html',
  styleUrl: './nuevo-rol.component.scss',
})
export class NuevoRolComponent implements OnInit {

  constructor(
    private rolService: RolService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  rolForm!: FormGroup;
  currentUser: any;


  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      const defaultPerfil = user.Perfil_ID == 2 ? '3' : '2';
      
      this.rolForm = this.fb.group({
        Nombre: ['', Validators.required],
        Descripcion: ['', Validators.required],
        Estado: ['1', Validators.required],
        Accesos: ['[]'],
        Perfil_ID: [defaultPerfil, Validators.required],
        Empresa_ID: [user.Empresa_ID, Validators.required],
      });
    });
  }
  

  submitFn(data: any) {
    return this.rolService.createRol(data);
  }

}