import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { EmpresaService } from 'src/app/Services/empresa.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-nueva-empresa',
  templateUrl: './nueva-empresa.component.html',
  styleUrls: ['./nueva-empresa.component.scss']
})
export class NuevaEmpresaComponent implements OnInit {
  currentUser: any;

  empresaForm!: FormGroup;

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.empresaForm = this.fb.group({
      Nombre: ['', Validators.required],
      Nombre_Corto: ['', Validators.required],
      Descripcion: ['', Validators.required],
      Direccion: ['', Validators.required],
      RUC: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[0-9]*$')]],
      Razon_Social: ['', Validators.required],
      Agente: ['', Validators.required],
      Firma: [null, Validators.required],
      Estado: [1]
    });
  }

  onFileSelected(file: File, field: string) {
    this.empresaForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    if (this.empresaForm.invalid) {
      Object.keys(this.empresaForm.controls).forEach((key) => {
        const control = this.empresaForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return Promise.reject('Form invalid');
    }
    return this.empresaService.createEmpresa(formData);
  }

  getFirmaError(): string {
    const control = this.empresaForm.get('Firma');
    if (control?.touched && !control.value) {
      return 'La firma es requerida';
    }
    return '';
  }

  getRUCError(): string {
    const control = this.empresaForm.get('RUC');
    if (control?.touched && control.errors) {
      if (control.errors['required']) {
        return 'El RUC es requerido';
      }
      if (control.errors['minlength']) {
        return 'El RUC debe tener al menos 8 dígitos';
      }
      if (control.errors['pattern']) {
        return 'El RUC solo debe contener números';
      }
    }
    return '';
  }
}
