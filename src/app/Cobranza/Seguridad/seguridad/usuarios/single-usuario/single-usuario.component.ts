import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { PAGE_URL } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OficinaService } from 'src/app/Services/oficina.service';
import { RolService } from 'src/app/Services/rol.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-single-usuario',
  templateUrl: './single-usuario.component.html',
  styleUrls: ['./single-usuario.component.scss']
})
export class SingleUsuarioComponent implements OnInit {
  page_url = PAGE_URL;
  currentUser: any;
  isEditing: boolean = false;
  singleUsuarioId: number | null = null;
  singleUsuarioData: any;
  usuarioDocumentoData: any[] = [];

  usuarioForm!: FormGroup;

  rolesFiltrados: any[] = [];
  oficinasFiltradas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private authService: AuthService,
    public oficinaService: OficinaService,
    public rolService: RolService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      this.route.paramMap.subscribe(params => {
        this.singleUsuarioId = +params.get('id')!;
        if (this.singleUsuarioId) {
          this.usuarioService.getUsuarioById(this.singleUsuarioId).subscribe(data => {
            this.singleUsuarioData = data;

            this.cargarOficinas(() => {
              this.cargarRoles(() => {
                this.initForm(); // Ya con roles y oficinas cargados
              });
            });

            this.usuarioService.getDocumentosByUsuario(this.singleUsuarioId).subscribe(
              (resp) => {
                this.usuarioDocumentoData = resp.DOCUMENTOS;
              },
              (error) => {
                console.error('Error al obtener los documentos usuarios:', error);
              }
            );
          });
        }
      });
    });
  }


  cargarOficinas(callback?: () => void) {
    this.oficinaService.getOficinas().subscribe(oficinas => {
      this.oficinasFiltradas = oficinas
        .map(o => ({ ...o, ID: Number(o.ID) }))
        .filter(this.oficinaIDFilter);

      if (callback) callback();
    });
  }


  cargarRoles(callback?: () => void) {
    this.rolService.getRoles().subscribe(roles => {
      this.rolesFiltrados = roles
        .map(r => ({ ...r, ID: Number(r.ID) }))
        .filter(this.rolIDFilter);

      if (callback) callback();
    });
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      ID: [this.singleUsuarioData.ID],
      Empresa_ID: [this.singleUsuarioData.Empresa_ID],
      Perfil_ID: [this.singleUsuarioData.Perfil_ID],


      Rol_ID: [Number(this.singleUsuarioData.Rol_ID)],
      Oficina_ID: [Number(this.singleUsuarioData.Oficina_ID)],

      Nombre: [this.singleUsuarioData.Nombre, Validators.required],
      Apellido: [this.singleUsuarioData.Apellido, Validators.required],
      Nombre_Corto: [this.singleUsuarioData.Nombre_Corto, Validators.required],
      Direccion: [this.singleUsuarioData.Direccion, Validators.required],
      Email: [this.singleUsuarioData.Email, [Validators.required, Validators.email]],
      Contrasena: [this.singleUsuarioData.Contrasena, Validators.required],
      DNI: [this.singleUsuarioData.DNI, Validators.required],
      Telefono: [this.singleUsuarioData.Telefono, Validators.required],
      Fecha_Nacimiento: [this.singleUsuarioData.Fecha_Nacimiento, Validators.required],
      Fecha_Ingreso: [this.singleUsuarioData.Fecha_Ingreso, Validators.required],
      Estado: [this.singleUsuarioData.Estado],
      Seguimiento: [this.singleUsuarioData.Seguimiento],
      Editar_Token: [this.singleUsuarioData.Editar_Token],
      Multiple_Sesion: [this.singleUsuarioData.Multiple_Sesion],
      Seguimiento_Ubicacion: [this.singleUsuarioData.Seguimiento_Ubicacion],
      Documento_Anverso: [this.singleUsuarioData.Documento_Anverso],
      Documento_Reverso: [this.singleUsuarioData.Documento_Reverso]
    });
  }

  onFileSelected(file: File, field: string) {
    this.usuarioForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.usuarioService.editUsuario(formData);
  }

  updateEstado = (newValue: number) => {
    this.usuarioForm.patchValue({ Estado: newValue });
  };

  updateSeguimiento = (newValue: number) => {
    this.usuarioForm.patchValue({ Seguimiento: newValue });
  };

  updateEditarToken = (newValue: number) => {
    this.usuarioForm.patchValue({ Editar_Token: newValue });
  };

  updateMultipleSesion = (newValue: number) => {
    this.usuarioForm.patchValue({ Multiple_Sesion: newValue });
  };

  updateSeguimientoUbicacion = (newValue: number) => {
    this.usuarioForm.patchValue({ Seguimiento_Ubicacion: newValue });
  };

  oficinaIDFilter = (oficina: any): boolean => {
    return oficina.Empresa_ID == this.currentUser?.Empresa_ID;
  };

  rolIDFilter = (rol: any): boolean => {
    return rol.ID !== '1' && rol.ID !== '2' && rol.Perfil_ID == 3 && rol.Empresa_ID == this.currentUser?.Empresa_ID;
  };

  /*
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  */

  getRolNombre(): string {
    const rolId = this.usuarioForm.get('Rol_ID')?.value;
    const rol = this.rolesFiltrados.find(r => r.ID == rolId);
    return rol ? rol.Nombre : '';
  }

  /** Retorna el nombre de la oficina actualmente seleccionada */
  getOficinaNombre(): string {
    const oficinaId = this.usuarioForm.get('Oficina_ID')?.value;
    const oficina = this.oficinasFiltradas.find(o => o.ID == oficinaId);
    return oficina ? oficina.Nombre : '';
  }


  isEditingPassword = false;
  showPassword = false;

  enablePasswordEdit() {
    this.isEditingPassword = true;
    this.usuarioForm.patchValue({ Contrasena: '' });
  }

  confirmPasswordEdit() {
    this.isEditingPassword = false;
  }

  cancelPasswordEdit() {
    this.isEditingPassword = false;

    // Restaurar el valor original que vino del backend
    this.usuarioForm.patchValue({
      Contrasena: this.singleUsuarioData.Contrasena
    });
  }


}
