import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-nuevo-documento',
  templateUrl: './nuevo-documento.component.html',
  styleUrl: './nuevo-documento.component.scss'
})
export class NuevoDocumentoComponent implements OnInit {

  documentoForm!: FormGroup;
  currentUser: any ;

  constructor(
    private fb: FormBuilder, 
    private usuarioService: UsuarioService,
    private authService: AuthService,
  ) {}


  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.documentoForm = this.fb.group({
      Nombre: ['', Validators.required],
      Usuario_ID: ['17', Validators.required],
      Descripcion: ['', Validators.required],
      Documento: [null],
      Estado: ['1', Validators.required],
    });
  }

  onFileSelected(file: File, field: string) {
    this.documentoForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.usuarioService.createDocumento(formData);
  }

}















