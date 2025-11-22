import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGE_URL } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';


@Component({
  selector: 'app-single-asesor',
  templateUrl: './single-asesor.component.html',
  styleUrl: './single-asesor.component.scss'
})
export class SingleAsesorComponent implements OnInit {

  isEditing: boolean = false;
  asesorForm!: FormGroup;
  page_url = PAGE_URL;
  singleAsesorId: number | null = null;
  singleAsesorData: any;



  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleAsesorId = +params.get('id')!;
      if (this.singleAsesorId) {
        this.usuarioService.getUsuarioById(this.singleAsesorId).subscribe(
          (data) => {
            this.singleAsesorData = data;
            this.initForm();
          },
          (error) => {
            console.error('Error al obtener el cliente:', error);
          }
        );
      }
    });
  }

  initForm() {
    this.asesorForm = this.fb.group({
      ID: [this.singleAsesorData.ID],
      Oficina_ID: [this.singleAsesorData.Oficina_ID],
      Rol_ID: [this.singleAsesorData.Rol_ID],
      Perfil_ID: [this.singleAsesorData.Perfil_ID],
      Empresa_ID: [this.singleAsesorData.Empresa_ID],
      Nombre: [this.singleAsesorData.Nombre ,  Validators.required],
      Apellido: [this.singleAsesorData.Apellido ,  Validators.required],
      Nombre_Corto: [this.singleAsesorData.Nombre_Corto],
      Direccion: [this.singleAsesorData.Direccion ,  Validators.required],
      Email: [this.singleAsesorData.Email ,  Validators.required],
      Contrasena:  [this.singleAsesorData.Contrasena],
      DNI: [this.singleAsesorData.DNI ,  Validators.required],
      Telefono: [this.singleAsesorData.Telefono ,  Validators.required],
      Fecha_Nacimiento: [this.singleAsesorData.Fecha_Nacimiento],
      Fecha_Ingreso: [this.singleAsesorData.Fecha_Ingreso],
      Estado: [this.singleAsesorData.Estado],
      Seguimiento: [this.singleAsesorData.Seguimiento],
      Editar_Token: [this.singleAsesorData.Editar_Token],
      Multiple_Sesion: [this.singleAsesorData.Multiple_Sesion],
      Seguimiento_Ubicacion: [this.singleAsesorData.Seguimiento_Ubicacion],
      Documento_Anverso: [this.singleAsesorData.Documento_Anverso],
      Documento_Reverso: [this.singleAsesorData.Documento_Reverso]
    });
  }

  onFileSelected(file: File, field: string) {
    this.asesorForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.usuarioService.editUsuario(formData);
  }

  updateEstado = (newValue: number) => {
    this.asesorForm.patchValue({ Estado: newValue });
  };



}
