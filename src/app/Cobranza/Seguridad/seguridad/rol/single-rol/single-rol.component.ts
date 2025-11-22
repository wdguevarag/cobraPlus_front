import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { RolService } from '../../../../../Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-rol',
  templateUrl: './single-rol.component.html',
  styleUrls: ['./single-rol.component.scss'],
})
export class SingleRolComponent /*implements OnInit*/ {

  isEditing = false ;

  usuariosAsignadosColumns: any[] = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Codigo', field: 'Rol_Usuario_ID', show: false },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Rol', field: 'Rol_ID', show: true },
    { header: 'Usuario', field: 'Email' },
    { header: 'Contraseña', field: 'Contrasena' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Estado', field: 'Rol_Usuario_Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' },
  ];
  usuariosAsignadosData: any[] = [];


  accesosAsignadosColumns: any[] = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Codigo', field: 'Rol_Acceso_ID', show: false },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Ruta', field: 'Ruta' },
    { header: 'Icono', field: 'Icono' },
    { header: 'Estado', field: 'Rol_Acceso_Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' },
  ];
  accesosAsignadosData: any[] = [];


  singleRolId: number | null = null;
  singleRolData: any;
  currentUser: any ;

  rolForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,  
    private router: Router  , 
    private rolService: RolService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder

  ) {}


  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.route.paramMap.subscribe(params => {
      this.singleRolId = +params.get('id')!;
      if (this.singleRolId) {

        this.rolService.getRolById(this.singleRolId).subscribe(
          (data) => {
            this.singleRolData = data;  
            this.initForm();
            
          },
          (error) => {
            console.error('Error al obtener el Acceso:', error);
          }
        );

      }
    });
  }



  initForm() {
    this.rolForm = this.fb.group({
      ID: [this.singleRolData.ID],
      Nombre: [this.singleRolData.Nombre , Validators.required],
      Descripcion: [this.singleRolData.Descripcion , Validators.required],
      Estado: [this.singleRolData.Estado],
      Accesos: [this.singleRolData.Accesos],
      Perfil_ID: [this.singleRolData.Perfil_ID],
      Empresa_ID: [this.singleRolData.Empresa_ID],
    });
  }


  submitFn(formData: FormData) {
    return this.rolService.editRol(formData);
  }


}
