import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-single-cliente-nueva-cuenta',
  templateUrl: './single-cliente-nueva-cuenta.component.html',
  styleUrls: ['./single-cliente-nueva-cuenta.component.scss']
})
export class SingleClienteNuevaCuentaComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Output() back = new EventEmitter<void>();

  cuentaForm!: FormGroup;
  singleClienteData: any;
  familiares: any[] = []; 
  hideParentesco: boolean = true; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public clienteService: ClienteService,
  ) { }

  ngOnInit(): void {
    // Inicializamos el formulario. Los controles que se llenan automáticamente se definen como disabled.
    this.cuentaForm = this.fb.group({
      Cliente_ID: new FormControl(this.singleClienteId),
      Principal: new FormControl('1'),
      Banco: new FormControl('', Validators.required),
      Nro_Cuenta: new FormControl('', Validators.required),
      CCI: new FormControl('', Validators.required),

      // Titular es un control que usará valores primitivos:
      // "CLIENTE" o el ID numérico de un familiar.
      Titular: new FormControl(null, Validators.required),
      Documento: new FormControl({ value: '', disabled: true }, Validators.required),
      Nro_Documento: new FormControl({ value: '', disabled: true }, Validators.required),
      Parentesco: new FormControl({ value: '', disabled: true }, Validators.required),
      Url_Foto_Cuenta: new FormControl(null),
      Estado: new FormControl(1)
    });

    // Obtener datos del cliente
    this.clienteService.getClienteById(this.singleClienteId).subscribe(
      (data) => {
        this.singleClienteData = data;

        // Escuchar cambios en Titular
        this.cuentaForm.get('Titular')?.valueChanges.subscribe(selectedValue => {
          this.handleTitularChange(selectedValue);
        });

        // Cargar familiares
        this.clienteService.getFamiliaresByCliente(data.ID).subscribe(
          (familiaresData) => {
            this.familiares = familiaresData;
          },
          (error) => {
            console.error('Error al obtener los familiares:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener el cliente:', error);
      }
    );
  }

  handleTitularChange(selectedValue: any): void {
    if (selectedValue === 'CLIENTE') {
      this.cuentaForm.patchValue({
        Documento: this.singleClienteData.Tipo_Documento,
        Nro_Documento: this.singleClienteData.Documento,
        Parentesco: 0
      });
      this.hideParentesco = true;
    }  
      
    else if (selectedValue) {
      // Se asume que selectedValue es el ID de un familiar (número o string)
      const id = Number(selectedValue);
      const familiarData = this.familiares.find(fam => fam.ID == id);
      if (familiarData) {
        this.cuentaForm.patchValue({
          Documento: familiarData.Tipo_Documento,
          Nro_Documento: familiarData.Nro_Documento,
          Parentesco: familiarData.Parentesco
        });
        this.hideParentesco = false;
      } else {
        // En caso de no encontrarlo, limpiamos los campos
        this.cuentaForm.patchValue({
          Documento: '',
          Nro_Documento: '',
          Parentesco: ''
        });
      }
    }
  }

  updatePrincipal = (newValue: number) => {
    this.cuentaForm.patchValue({ Principal: newValue });
  };

  onFileSelected(file: File, field: string) {
    this.cuentaForm.patchValue({ [field]: file });
  }

  submitFn(): any {
    const rawValue = this.cuentaForm.getRawValue();
    const formData = new FormData();
  
    // Convertir titular si no es CLIENTE
    if (rawValue.Titular !== 'CLIENTE') {
      const idSeleccionado = Number(rawValue.Titular);
      const familiarData = this.familiares.find(fam => fam.ID == idSeleccionado);
      if (familiarData) {
        rawValue.Titular = familiarData.Nombres + ' ' + familiarData.Apellido_Paterno;
      }
    }
  
    // Agregar campos uno por uno
    for (const key in rawValue) {
      if (rawValue[key] !== null && rawValue[key] !== undefined) {
        // Si es el archivo, lo agregamos como tal
        if (key === 'Url_Foto_Cuenta' && rawValue[key] instanceof File) {
          formData.append(key, rawValue[key]);
        } else {
          formData.append(key, rawValue[key]);
        }
      }
    }
  
    return this.clienteService.createCuenta(formData);
  }
  

  goBack(): void {
    this.back.emit();
  }
}
