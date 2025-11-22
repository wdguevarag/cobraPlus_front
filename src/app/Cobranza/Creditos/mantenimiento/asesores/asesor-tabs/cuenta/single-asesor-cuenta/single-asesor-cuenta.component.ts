import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioService } from 'src/app/Services/usuario.service';


@Component({
  selector: 'app-single-asesor-cuenta',
  templateUrl: './single-asesor-cuenta.component.html',
  styleUrl: './single-asesor-cuenta.component.scss'
})
export class SingleAsesorCuentaComponent implements OnInit {


  @Input() singleAsesorId: number | null = null;
  @Input() asesorCuentaId: number | null = null;
  
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() back = new EventEmitter<void>();


  isEditing: boolean = false;
  
  page_url = PAGE_URL;  

  singleAsesorData: any;
  asesorCuentaData: any;

  asesorCuentaForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
      if (this.singleAsesorId) {
      forkJoin({
        cliente: this.usuarioService.getUsuarioById(this.singleAsesorId),
        cuentas: this.usuarioService.getCuentasAsesor(this.singleAsesorId)
      }).subscribe(({ cliente, cuentas }) => {
        this.singleAsesorData = cliente;
        this.asesorCuentaData = cuentas.find(item => item.ID == this.asesorCuentaId);


        
        if (this.asesorCuentaData) {
          this.initForm();
          if (this.mode === 'view') {
            this.asesorCuentaForm.disable();
          }
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }
    
    
  initForm() {
    this.asesorCuentaForm = this.fb.group({
      ID              : [this.asesorCuentaData.ID],              
      Usuario_ID              : [this.asesorCuentaData.Usuario_ID],              
      Principal              : [this.asesorCuentaData.Principal],              
      Banco           : [this.asesorCuentaData.Banco],           
      Nro_Cuenta          : [this.asesorCuentaData.Nro_Cuenta],          
      CCI             : [this.asesorCuentaData.CCI],             
      Titular  : [this.asesorCuentaData.Titular],  
      Documento  : [this.asesorCuentaData.Documento],  
      Nro_Documento: [this.asesorCuentaData.Nro_Documento],
      Url_Foto_Cuenta : [this.asesorCuentaData.Url_Foto_Cuenta],
      Estado          : [this.asesorCuentaData.Estado],          
     
    });
  }

  submitFn(formData: FormData) { return this.usuarioService.editCuentaAsesor(formData); }



  updatePrincipal = (newValue: number) => { 
    this.asesorCuentaForm.patchValue({ Principal: newValue });
  };

  onFileSelected(file: File, field: string) { 
    this.asesorCuentaForm.patchValue({ [field]: file }); 
  }
  updateEstado = (newValue: number) => { this.asesorCuentaForm.patchValue({ Estado: newValue });};
  
  goBack(): void { this.back.emit(); }

}

