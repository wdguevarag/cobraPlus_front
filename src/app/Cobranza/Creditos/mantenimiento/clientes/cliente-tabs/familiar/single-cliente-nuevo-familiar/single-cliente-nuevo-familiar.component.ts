import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ClienteService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-single-cliente-nuevo-familiar',
  templateUrl: './single-cliente-nuevo-familiar.component.html',
  styleUrls: ['./single-cliente-nuevo-familiar.component.scss']
})
export class SingleClienteNuevoFamiliarComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Output() back = new EventEmitter<void>();

  familiarForm!: FormGroup;
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

      this.familiarForm = this.fb.group({
        Cliente_ID: new FormControl(this.singleClienteId),
        Parentesco: new FormControl('', Validators.required),
        Nombres: new FormControl('', Validators.required),
        Apellido_Paterno: new FormControl('', Validators.required),
        Apellido_Materno: new FormControl('', Validators.required),
        Tipo_Documento: new FormControl('', Validators.required),
        Nro_Documento: new FormControl('', Validators.required),
        Genero: new FormControl(''),
        Estado_Civil: new FormControl(''),
        Fecha_Nacimiento: new FormControl(null),
        Lugar_Nacimiento: new FormControl(null),
        Telefono: new FormControl('', Validators.required),
        Estado: new FormControl(1)  
      });
  }

  submitFn(formData: any) {  return this.clienteService.createFamiliar(formData); }

  goBack(): void { this.back.emit(); }
}
