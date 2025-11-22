import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../../../Services/clientes.service';
import { PAGE_URL } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-simple-cliente',
  templateUrl: './single-simple-cliente.component.html',
  styleUrls: ['./single-simple-cliente.component.scss']
})
export class SimpleClienteComponent implements OnInit {

  @Input() type: 'normal' | 'fic' = 'normal';
  @Input() singleClienteIdInput?: number;

  simpleClienteId: number | null = null;
  simpleClienteData: any = {};
  clienteForm!: FormGroup;
  page_url = PAGE_URL;
  isEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.type === 'fic' && this.singleClienteIdInput) {
      this.simpleClienteId = this.singleClienteIdInput;
      this.loadClienteData();
    } else {
      this.route.paramMap.subscribe(params => {
        this.simpleClienteId = +params.get('id')!;
        if (this.simpleClienteId) {
          this.loadClienteData();
        }
      });
    }
  }

  loadClienteData(): void {
    this.clienteService.getClienteById(this.simpleClienteId!).subscribe(
      (data) => {
        this.simpleClienteData = data;
        this.initForm();
      },
      (error) => {
        console.error('Error al obtener el cliente:', error);
      }
    );
  }

  initForm(): void {
    // Se inicializan solo los campos requeridos
    this.clienteForm = this.fb.group({
      ID: [this.simpleClienteData.ID],
      Nombres: [this.simpleClienteData.Nombres],
      Apellido_Paterno: [this.simpleClienteData.Apellido_Paterno],
      Apellido_Materno: [this.simpleClienteData.Apellido_Materno],
      Documento: [this.simpleClienteData.Documento],
      Estado: [this.simpleClienteData.Estado],
      Documento_Anverso: [this.simpleClienteData.Documento_Anverso],
      Documento_Reverso: [this.simpleClienteData.Documento_Reverso]
    });
  }

  onFileSelected(file: File, field: string): void {
    this.clienteForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData): any {
    return this.clienteService.editCliente(formData);
  }

  updateEstado(newValue: number): void {
    this.clienteForm.patchValue({ Estado: newValue });
  }
}

