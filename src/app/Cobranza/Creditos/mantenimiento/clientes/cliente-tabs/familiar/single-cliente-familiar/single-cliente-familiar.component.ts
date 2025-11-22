import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-cliente-familiar',
  templateUrl: './single-cliente-familiar.component.html',
  styleUrl: './single-cliente-familiar.component.scss'
})
export class SingleClienteFamiliarComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Input() clienteFamiliarId: number | null = null;

  singleClienteData: any;
  clienteFamiliarData: any;

  
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() back = new EventEmitter<void>();

  isEditing: boolean = false;
  
  page_url = PAGE_URL;  

  clienteFamiliarForm!: FormGroup;


  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
      if (this.singleClienteId) {
        forkJoin({
          cliente: this.clienteService.getClienteById(this.singleClienteId),
          negocios: this.clienteService.getFamiliaresByCliente(this.singleClienteId)
        }).subscribe(({ cliente, negocios }) => {
          this.singleClienteData = cliente;
          this.clienteFamiliarData = negocios.find(item => item.ID == this.clienteFamiliarId);
          
          if (this.clienteFamiliarData) {
            this.initForm();
            if (this.mode === 'view') {
              this.clienteFamiliarForm.disable();
            }
          }
        }, error => {
          console.error('Error:', error);
        });
      }
  }
    
    
  initForm() {
    this.clienteFamiliarForm = this.fb.group({
      ID               :[this.clienteFamiliarData.ID] ,
      Cliente_ID       :[this.clienteFamiliarData.Cliente_ID] ,
      Parentesco       :[this.clienteFamiliarData.Parentesco] ,
      Nombres          :[this.clienteFamiliarData.Nombres] ,
      Apellido_Paterno :[this.clienteFamiliarData.Apellido_Paterno] ,
      Apellido_Materno :[this.clienteFamiliarData.Apellido_Materno] ,
      Tipo_Documento   :[this.clienteFamiliarData.Tipo_Documento] ,
      Nro_Documento    :[this.clienteFamiliarData.Nro_Documento] ,
      Genero           :[this.clienteFamiliarData.Genero] ,
      Estado_Civil     :[this.clienteFamiliarData.Estado_Civil] ,
      Fecha_Nacimiento :[this.clienteFamiliarData.Fecha_Nacimiento] ,
      Lugar_Nacimiento :[this.clienteFamiliarData.Lugar_Nacimiento] ,
      Telefono         :[this.clienteFamiliarData.Telefono] ,
      Estado           :[this.clienteFamiliarData.Estado] ,
    });
  }

  submitFn(formData: FormData) { return this.clienteService.editFamiliar(formData); }


  updateEstado = (newValue: number) => { this.clienteFamiliarForm.patchValue({ Estado: newValue }); };

  goBack(): void { this.back.emit(); }


}