import { Component, OnInit , Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from 'src/app/Services/empresa.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { PAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-single-empresa',
  templateUrl: './single-empresa.component.html',
  styleUrl: './single-empresa.component.scss'
})
export class SingleEmpresaComponent  implements OnInit  {

  @Input() type: 'normal' | 'special' = 'normal';
  @Input() singleEmpresaIdInput?: number;

  page_url = PAGE_URL;
  

  isLoading: boolean = true; 
  isEditing: boolean = false;
  mostrarNuevoUsuarioEmpresa = false;

  usuarioColumns = [
    { header: 'Cod. Usuario', field: 'ID' },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Usuario', field: 'Email' },
    { header: 'DNI', field: 'DNI' , noNumeric: true },
    { header: 'Tel', field: 'Telefono' , noNumeric: true },
    { header: 'Documento Anverso', field: 'Documento_Anverso' },
    { header: 'Documento Reverso', field: 'Documento_Reverso' },

    {header: 'Estado', field: 'Estado',   type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO'}
  ];

  usuarioData: any[] = [];


  singleEmpresaId: number | null = null;
  singleEmpresaData: any;

  empresaForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,  
    private empresaService: EmpresaService , 
    private usuarioService: UsuarioService , 
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.type === 'special' && this.singleEmpresaIdInput) {
      this.singleEmpresaId = this.singleEmpresaIdInput;
      if (this.singleEmpresaId) {
    
        this.empresaService.getEmpresaById(this.singleEmpresaId).subscribe(
          (data) => {
            this.singleEmpresaData = data;
            this.initForm();
            this.isLoading = false;
          },
          (error) => {
            console.error('Error al obtener la empresa:', error);
            this.isLoading = false;
          }
        );
  
        // Obtener usuarios y filtrarlos por ID y Rol_ID
        this.usuarioService.getUsuarios().subscribe(
          response => {
            this.usuarioData = response.filter(usuario => 
              usuario.Empresa_ID == this.singleEmpresaId && usuario.Rol_ID == '2'
            );
          },
          error => {
            console.error('Error al obtener los usuarios', error);
          }
        );
      } else {
        this.isLoading = false;
      }
    }
    else {
      this.route.paramMap.subscribe(params => {
        this.singleEmpresaId = +params.get('id')!;
        if (this.singleEmpresaId) {
    
          this.empresaService.getEmpresaById(this.singleEmpresaId).subscribe(
            (data) => {
              this.singleEmpresaData = data;
              this.initForm();
              this.isLoading = false;
            },
            (error) => {
              console.error('Error al obtener la empresa:', error);
              this.isLoading = false;
            }
          );
    
          // Obtener usuarios y filtrarlos por ID y Rol_ID
          this.usuarioService.getUsuarios().subscribe(
            response => {
              this.usuarioData = response.filter(usuario => 
                usuario.Empresa_ID == this.singleEmpresaId && usuario.Rol_ID == '2'
              );
            },
            error => {
              console.error('Error al obtener los usuarios', error);
            }
          );
        } else {
          this.isLoading = false;
        }
      });
    }
  }


  
  initForm() {
    this.empresaForm = this.fb.group({
      ID: [this.singleEmpresaData.ID],
      Nombre: [this.singleEmpresaData.Nombre],
      RUC : [this.singleEmpresaData.RUC ] ,
      Razon_Social : [this.singleEmpresaData.Razon_Social ] ,
      Agente : [this.singleEmpresaData.Agente ] ,
      Nombre_Corto : [this.singleEmpresaData.Nombre_Corto ] ,
      Direccion : [this.singleEmpresaData.Direccion ] ,
      Descripcion : [this.singleEmpresaData.Descripcion ] ,
      Firma : [this.singleEmpresaData.Firma ] ,
      Estado: [this.singleEmpresaData.Estado],

    });
  }
  
  onFileSelected(file: File, field: string) {
    this.empresaForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.empresaService.editEmpresa(formData);
  }

  updateEstado = (newValue: number) => {
    this.empresaForm.patchValue({ Estado: newValue });
  };




  mostrarFormulario(): void {
    this.mostrarNuevoUsuarioEmpresa = true;
  }

  ocultarFormulario(): void {
    this.mostrarNuevoUsuarioEmpresa = false;
  }



  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate([`/seguridad/seguridad/usuario/single-usuario`, event.id]);
  }

}
