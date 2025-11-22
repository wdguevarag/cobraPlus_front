import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../../../Services/clientes.service';
import { PAGE_URL } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-single-cliente',
  templateUrl: './single-cliente.component.html',
  styleUrls: ['./single-cliente.component.scss']
})
export class SingleClienteComponent implements OnInit, OnChanges {

  @Input() type: 'normal' | 'fic' = 'normal';
  @Input() singleClienteIdInput?: number;
  @Input() singleClienteIdSolicitud?: number;

  isEditing: boolean = false;
  clienteForm!: FormGroup;
  page_url = PAGE_URL;
  singleClienteId: number | null = null;
  singleClienteData: any = {};

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Solo si es modo 'normal', leer el ID desde la URL
    if (this.type === 'normal') {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.singleClienteId = +idParam;
          this.loadClienteData();
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.type === 'fic' && changes['singleClienteIdInput'] && changes['singleClienteIdInput'].currentValue) {
      this.singleClienteId = changes['singleClienteIdInput'].currentValue;
      this.loadClienteData();
    }

    if (changes['singleClienteIdSolicitud'] && changes['singleClienteIdSolicitud'].currentValue) {
      this.singleClienteId = changes['singleClienteIdSolicitud'].currentValue;
      this.loadClienteData();
    }
  }

  loadClienteData() {
    if (!this.singleClienteId) return;

    this.clienteService.getClienteById(this.singleClienteId).subscribe(
      (data) => {
        this.singleClienteData = data;
        this.initForm();
      },
      (error) => {
        console.error('Error al obtener el cliente:', error);
      }
    );
  }

  initForm() {
    this.clienteForm = this.fb.group({
      ID: [this.singleClienteData.ID],
      Empresa_ID: [this.singleClienteData.Empresa_ID],
      Asesor_ID: [this.singleClienteData.Asesor_ID],
      Nombres: [this.singleClienteData.Nombres],
      Apellido_Paterno: [this.singleClienteData.Apellido_Paterno],
      Apellido_Materno: [this.singleClienteData.Apellido_Materno],
      Tipo_Documento: [this.singleClienteData.Tipo_Documento],
      Documento: [this.singleClienteData.Documento],
      Genero: [this.singleClienteData.Genero],
      Estado_Civil: [this.singleClienteData.Estado_Civil],
      Fecha_Nacimiento: [this.singleClienteData.Fecha_Nacimiento],
      Lugar_Nacimiento: [this.singleClienteData.Lugar_Nacimiento],
      Base_Negativa: [this.singleClienteData.Base_Negativa],
      Estado: [this.singleClienteData.Estado],
      Documento_Anverso: [this.singleClienteData.Documento_Anverso],
      Documento_Reverso: [this.singleClienteData.Documento_Reverso],
      Firma: [this.singleClienteData.Firma],
    });
  }

  onFileSelected(file: File, field: string) {
    this.clienteForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.clienteService.editCliente(formData);
  }

  updateEstado = (newValue: number) => {
    this.clienteForm.patchValue({ Estado: newValue });
  };

}
