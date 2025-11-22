import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-single-cliente-nuevo-rcc',
  templateUrl: './single-cliente-nuevo-rcc.component.html',
  styleUrls: ['./single-cliente-nuevo-rcc.component.scss']
})
export class SingleClienteNuevoRccComponent implements OnInit {
  @Input() singleClienteId: number | null = null;
  @Output() back = new EventEmitter<void>();

  rccForm!: FormGroup;
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
      this.rccForm = this.fb.group({
        Cliente_ID: new FormControl(this.singleClienteId),
        Comentario: new FormControl('', Validators.required),
        Ruta_Documento: new FormControl(null),
        Estado: new FormControl(1 , Validators.required)
      });
  }

  // Actualiza el control cuando se selecciona un archivo (pdf o imagen)
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type === 'application/pdf') {
      this.rccForm.patchValue({ Ruta_Documento: file });
    } else {
      console.warn('Solo se permiten archivos PDF');
      this.rccForm.patchValue({ Ruta_Documento: null });
    }
  }

  submitFn(formData: any) { return this.clienteService.createRcc(formData); }

  goBack(): void {
    this.back.emit();
  }
}
