import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-single-asesor-nueva-cuenta',
  templateUrl: './single-asesor-nueva-cuenta.component.html',
  styleUrl: './single-asesor-nueva-cuenta.component.scss'
})
export class SingleAsesorNuevaCuentaComponent implements OnInit {

  @Input() singleAsesorId: number | null = null;
  @Output() back = new EventEmitter<void>();
      

  cuentaForm!: FormGroup;
  singleAsesorData: any;

  constructor(
    private fb: FormBuilder,
    public usuarioService: UsuarioService
  ) { }


  ngOnInit(): void {
    if (!this.singleAsesorId) return;

    this.usuarioService.getUsuarioById(this.singleAsesorId).subscribe(
      (data) => {
        this.singleAsesorData = data;

        // Recién aquí creas el formulario
        this.cuentaForm = this.fb.group({
          Usuario_ID: new FormControl(this.singleAsesorId),
          Principal: new FormControl(1),
          Banco: new FormControl('', Validators.required),
          Nro_Cuenta: new FormControl('', Validators.required),
          CCI: new FormControl('', Validators.required),
          Titular: new FormControl(`${this.singleAsesorData.Nombre} ${this.singleAsesorData.Apellido}`, Validators.required),
          Documento: new FormControl(9, Validators.required),
          Nro_Documento: new FormControl(this.singleAsesorData.DNI, Validators.required),
          Url_Foto_Cuenta: new FormControl(null, Validators.required),
          Estado: new FormControl(1)
        });
      },
      (error) => {
        console.error('Error al obtener el cliente:', error);
      }
    );
  }




  updatePrincipal = (newValue: number) => {
    this.cuentaForm.patchValue({ Principal: newValue });
  };

  onFileSelected(file: File, field: string) {
    this.cuentaForm.patchValue({ [field]: file });
  }

  submitFn(formData: any) { return this.usuarioService.createCuentaAsesor(formData); }

  goBack(): void { this.back.emit(); }
}


