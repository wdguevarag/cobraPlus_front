import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { OficinaService } from 'src/app/Services/oficina.service';
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss']
})
export class NuevoUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  currentUser: any;

  rolesFiltrados: any[] = [];
  oficinasFiltradas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private oficinaService: OficinaService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      const nuevoPerfilID = user.Perfil_ID == 1 ? 2 : user.Perfil_ID == 2 ? 3 : null;

      this.usuarioForm = this.fb.group({
        Nombre: ['', Validators.required],
        Nombre_Corto: ['', Validators.required],
        Apellido: ['', Validators.required],
        Rol_ID: [null, Validators.required],           // <--- asegurarse de que inicie en null
        Empresa_ID: [user.Empresa_ID],
        Oficina_ID: [null],     
        Perfil_ID: [nuevoPerfilID],
        DNI: ['', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(8),
          Validators.maxLength(8)
        ]],
        Contrasena: ['', Validators.required],
        Estado: ['1', Validators.required],
        Direccion: ['', Validators.required],
        Telefono: ['', Validators.required],
        Email: ['', [Validators.required, Validators.email]],
        Fecha_Nacimiento: ['', Validators.required],
        Fecha_Ingreso: ['', Validators.required],
        Seguimiento: ['1', Validators.required],
        Editar_Token: ['1', Validators.required],
        Seguimiento_Ubicacion: ['1', Validators.required],
        Multiple_Sesion: ['1', Validators.required],
        Documento_Anverso: [null],
        Documento_Reverso: [null]
      });

      this.cargarOficinas();
      this.cargarRoles();
    });
  }

  cargarOficinas() {
    this.oficinaService.getOficinas().subscribe(oficinas => {
      this.oficinasFiltradas = oficinas.filter(this.oficinaIDFilter);
    });
  }

  cargarRoles() {
    this.rolService.getRoles().subscribe(roles => {
      this.rolesFiltrados = roles.filter(this.rolIDFilter);
    });
  }


  oficinaIDFilter = (oficina: any): boolean => {
    return oficina.Empresa_ID == this.currentUser?.Empresa_ID;
  };

  rolIDFilter = (rol: any): boolean => {
    return rol.ID !== '1' && rol.ID !== '2' &&
           rol.Perfil_ID == 3 &&
           rol.Empresa_ID == this.currentUser?.Empresa_ID;
  };

  onFileSelected(file: File, field: string) {
    this.usuarioForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.usuarioService.createUsuario(formData);
  }
}
