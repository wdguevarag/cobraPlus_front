import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ClienteService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-single-cliente-nuevo-contacto',
  templateUrl: './single-cliente-nuevo-contacto.component.html',
  styleUrls: ['./single-cliente-nuevo-contacto.component.scss']
})
export class SingleClienteNuevoContactoComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Output() back = new EventEmitter<void>();
      

  contactoForm!: FormGroup;
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
      this.contactoForm = this.fb.group({
        Cliente_ID: [this.singleClienteId],
        Principal: [1],
        Categoria: ['', Validators.required],
        Tipo_Contacto: ['', Validators.required],
        Telefono: ['', Validators.required],
        Whatsapp: ['', Validators.required],
        Correo: [null],       // Aquí se envía null
        Comentario: [null], 
        Estado: [1],
      });
  }

  submitFn(formData: any) { return this.clienteService.createContacto(formData); }

  goBack(): void { this.back.emit(); }

  updatePrincipal = (newValue: number) => {
    this.contactoForm.patchValue({ Principal: newValue });
  };
}