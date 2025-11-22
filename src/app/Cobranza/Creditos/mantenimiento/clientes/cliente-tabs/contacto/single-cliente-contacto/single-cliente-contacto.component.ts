import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-cliente-contacto',
  templateUrl: './single-cliente-contacto.component.html',
  styleUrl: './single-cliente-contacto.component.scss'
})
export class SingleClienteContactoComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Input() clienteContactoId: number | null = null;
  
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() back = new EventEmitter<void>();

  isEditing: boolean = false;
  
  page_url = PAGE_URL;  

  singleClienteData: any;
  clienteContactoData: any;

  clienteContactoForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
      if (this.singleClienteId) {
      forkJoin({
        cliente: this.clienteService.getClienteById(this.singleClienteId),
        negocios: this.clienteService.getContactosByCliente(this.singleClienteId)
      }).subscribe(({ cliente, negocios }) => {
        this.singleClienteData = cliente;
        this.clienteContactoData = negocios.find(item => item.ID == this.clienteContactoId);
        
        if (this.clienteContactoData) {
          this.initForm();
          if (this.mode === 'view') {
            this.clienteContactoForm.disable();
          }
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }
    
    
  initForm() {
    this.clienteContactoForm = this.fb.group({
      ID            : [this.clienteContactoData.ID],
      Cliente_ID    : [this.clienteContactoData.Cliente_ID],
      Principal    : [this.clienteContactoData.Principal],
      Categoria     : [this.clienteContactoData.Categoria],
      Tipo_Contacto : [this.clienteContactoData.Tipo_Contacto],
      Telefono      : [this.clienteContactoData.Telefono],
      Whatsapp      : [this.clienteContactoData.Whatsapp],
      Correo        : [this.clienteContactoData.Correo],
      Comentario    : [this.clienteContactoData.Comentario],
      Estado        : [this.clienteContactoData.Estado],
    });
  }

  submitFn(formData: FormData) { return this.clienteService.editContacto(formData); }


  updateEstado = (newValue: number) => { this.clienteContactoForm.patchValue({ Estado: newValue });};

  updatePrincipal = (newValue: number) => { this.clienteContactoForm.patchValue({ Principal: newValue }); };
  
  goBack(): void { this.back.emit(); }

}

