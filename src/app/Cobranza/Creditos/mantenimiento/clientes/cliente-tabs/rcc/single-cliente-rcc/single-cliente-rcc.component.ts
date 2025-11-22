
import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-single-cliente-rcc',
  templateUrl: './single-cliente-rcc.component.html',
  styleUrl: './single-cliente-rcc.component.scss'
})
export class SingleClienteRccComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Input() clienteRccId: number | null = null;
  
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() back = new EventEmitter<void>();

  isEditing: boolean = false;
  
  page_url = PAGE_URL;  

  singleClienteData: any;
  clienteRccData: any;

  clienteRccForm!: FormGroup;


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
      rccs: this.clienteService.getRccsByCliente(this.singleClienteId)
    }).subscribe(({ cliente, rccs }) => {
      this.singleClienteData = cliente;
      this.clienteRccData = rccs.find(item => item.ID == this.clienteRccId);
      
      if (this.clienteRccData) {
        this.initForm();
        if (this.mode === 'view') {
          this.clienteRccForm.disable();
        }
      }
    }, error => {
      console.error('Error:', error);
    });
  }
}


    
initForm() {
  this.clienteRccForm = this.fb.group({
    ID            : [this.clienteRccData.ID],
    Cliente_ID    : [this.clienteRccData.Cliente_ID],
    Comentario    : [this.clienteRccData.Comentario],
    Ruta_Documento    : [this.clienteRccData.Ruta_Documento],
    Estado        : [this.clienteRccData.Estado],
  });
}

submitFn(formData: FormData) { return this.clienteService.editRcc(formData); }

  // Actualiza el control cuando se selecciona un archivo (pdf o imagen)
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type === 'application/pdf') {
      this.clienteRccForm.patchValue({ Ruta_Documento: file });
    } else {
      console.warn('Solo se permiten archivos PDF');
      this.clienteRccForm.patchValue({ Ruta_Documento: null });
    }
  }

updateEstado = (newValue: number) => { this.clienteRccForm.patchValue({ Estado: newValue });};

goBack(): void { this.back.emit(); }


}