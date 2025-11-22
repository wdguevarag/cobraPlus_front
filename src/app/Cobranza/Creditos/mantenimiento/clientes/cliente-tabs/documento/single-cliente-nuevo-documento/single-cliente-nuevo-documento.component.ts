import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-single-cliente-nuevo-documento',
  templateUrl: './single-cliente-nuevo-documento.component.html',
  styleUrls: ['./single-cliente-nuevo-documento.component.scss']
})
export class SingleClienteNuevoDocumentoComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Output() back = new EventEmitter<void>();

  documentoForm!: FormGroup;
  singleClienteData: any;

  constructor(
    private fb: FormBuilder,
    public clienteService: ClienteService
  ) { }

  ngOnInit(): void {
      this.clienteService.getClienteById(this.singleClienteId).subscribe(
        (data) => {
          this.singleClienteData = data;
        },
        (error) => {
          console.error('Error al obtener el cliente:', error);
        }
      );
      this.documentoForm = this.fb.group({
        Cliente_ID: new FormControl(this.singleClienteId),
        Descripcion: new FormControl('', Validators.required),
        Ruta_Documento: new FormControl(null),
        Estado: new FormControl(1, Validators.required)
      });
  }

  onFileSelected(file: File, field: string) {this.documentoForm.patchValue({ [field]: file }); }

  submitFn(formData: any) {return this.clienteService.createDocumento(formData); }

  goBack(): void { this.back.emit(); }

}
