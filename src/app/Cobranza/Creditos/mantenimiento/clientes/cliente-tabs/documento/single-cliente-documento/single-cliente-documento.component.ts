import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/Services/clientes.service';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-single-cliente-documento',
  templateUrl: './single-cliente-documento.component.html',
  styleUrls: ['./single-cliente-documento.component.scss']
})
export class SingleClienteDocumentoComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Input() clienteDocumentoId: number | null = null;
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() back = new EventEmitter<void>();

  isEditing: boolean = false;

  page_url = PAGE_URL;  
  
  singleClienteData: any;
  clienteDocumentoData: any;

  clienteDocumentoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
      if (this.singleClienteId) {
      forkJoin({
        cliente: this.clienteService.getClienteById(this.singleClienteId),
        documentos: this.clienteService.getDocumentosByCliente(this.singleClienteId)
      }).subscribe(({ cliente, documentos }) => {
        this.singleClienteData = cliente;
        this.clienteDocumentoData = documentos.find(item => item.ID == this.clienteDocumentoId);
        
        if (this.clienteDocumentoData) {
          this.initForm();
          if (this.mode === 'view') {
            this.clienteDocumentoForm.disable();
          }
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }



  initForm(): void {
    this.clienteDocumentoForm = this.fb.group({
      ID: [this.clienteDocumentoData.ID],
      Cliente_ID: [this.clienteDocumentoData.Cliente_ID],
      Descripcion: [this.clienteDocumentoData.Descripcion, Validators.required],
      Ruta_Documento: [this.clienteDocumentoData.Ruta_Documento],
      Estado: [this.clienteDocumentoData.Estado]
    });
  }

  onFileSelected(file: File, field: string): void {
    this.clienteDocumentoForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData): any {
    return this.clienteService.editDocumento(formData);
  }

  updateEstado = (newValue: number) => {
    this.clienteDocumentoForm.patchValue({ Estado: newValue });
  };

  goBack(): void {
    this.back.emit();
  }

}
