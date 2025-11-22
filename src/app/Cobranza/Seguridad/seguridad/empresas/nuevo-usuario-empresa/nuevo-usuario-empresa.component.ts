import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-nuevo-usuario-empresa',
  templateUrl: './nuevo-usuario-empresa.component.html',
  styleUrl: './nuevo-usuario-empresa.component.scss'
})


export class NuevoUsuarioEmpresaComponent implements OnInit {

  @Input() empresaId!: string; 


  usuarioForm!: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuarioForm = this.fb.group({
      Nombre: ['', Validators.required],
      Nombre_Corto: ['', Validators.required],
      Apellido: ['', Validators.required],
      Rol_ID: [2 , Validators.required],
      Perfil_ID: [2],
      Empresa_ID: [this.empresaId || '1'],
      DNI: ['', Validators.required ],
      Contrasena: ['', Validators.required],
      Estado: ['1'],
      Direccion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Email: ['', Validators.required],
      Fecha_Nacimiento: ['', Validators.required],
      Fecha_Ingreso: ['', Validators.required],
      Seguimiento: ['1'],
      Editar_Token: ['1'],
      Seguimiento_Ubicacion: ['1'],
      Multiple_Sesion: ['1'],
      Documento_Anverso: [null, Validators.required],
      Documento_Reverso: [null, Validators.required],
      Oficina_ID: ['ADMIN-EMPRESA'],
    });
  }

  onFileSelected(file: File, field: string) {
    this.usuarioForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.usuarioService.createUsuario(formData);
  }
}
