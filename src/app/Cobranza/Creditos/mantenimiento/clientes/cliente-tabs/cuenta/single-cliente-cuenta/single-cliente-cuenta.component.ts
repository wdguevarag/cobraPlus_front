import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, from } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-single-cliente-cuenta',
  templateUrl: './single-cliente-cuenta.component.html',
  styleUrl: './single-cliente-cuenta.component.scss'
})


export class SingleClienteCuentaComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Input() clienteCuentaId: number | null = null;
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() back = new EventEmitter<void>();

  isEditing: boolean = false;
  
  page_url = PAGE_URL;  
  singleClienteData: any;
  clienteCuentaData: any;
  clienteCuentaForm!: FormGroup;
  familiares: any[] = []; 
  hideParentesco: boolean = false; 

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
        cuentas: this.clienteService.getCuentasByCliente(this.singleClienteId)
      }).subscribe(({ cliente, cuentas }) => {
        this.singleClienteData = cliente;
        this.clienteCuentaData = cuentas.find(item => item.ID == this.clienteCuentaId);
        
        if (this.clienteCuentaData) {
          this.clienteCuentaForm = this.fb.group({
            ID            : [this.clienteCuentaData.ID],
            Cliente_ID    : [this.clienteCuentaData.Cliente_ID],
            Principal     : [this.clienteCuentaData.Principal],
            Banco         : [this.clienteCuentaData.Banco],
            Nro_Cuenta    : [this.clienteCuentaData.Nro_Cuenta],
            CCI           : [this.clienteCuentaData.CCI],
            Titular       : [this.clienteCuentaData.Titular],
            Documento     : [this.clienteCuentaData.Documento],
            Nro_Documento : [this.clienteCuentaData.Nro_Documento],
            Parentesco    : [this.clienteCuentaData.Parentesco],
            Url_Foto_Cuenta : [this.clienteCuentaData.Url_Foto_Cuenta],
            Estado        : [this.clienteCuentaData.Estado],
          });

          // Si el modo es view se deshabilita el formulario
          if (this.mode === 'view') {
            this.clienteCuentaForm.disable();
          }

          // Suscribirse a cambios en Titular para actualizar los otros campos.
          this.clienteCuentaForm.get('Titular')?.valueChanges.subscribe(selectedTitular => {
            if (selectedTitular === 'CLIENTE') {
              this.clienteCuentaForm.patchValue({
                Documento: this.singleClienteData.Tipo_Documento,
                Nro_Documento: this.singleClienteData.Documento,
                Parentesco: 0
              });
              this.hideParentesco = true;
            } else if (selectedTitular && typeof selectedTitular === 'object' && selectedTitular.type === 'familiar') {
              const familiarData = selectedTitular.data;
              // NO reemplazamos el valor del control (Titular) para mantener el objeto
              this.clienteCuentaForm.patchValue({
                Documento: familiarData.Tipo_Documento,
                Nro_Documento: familiarData.Nro_Documento,
                Parentesco: familiarData.Parentesco
              });
              this.hideParentesco = false;
            } else {
              this.clienteCuentaForm.patchValue({
                Documento: '',
                Nro_Documento: '',
                Parentesco: ''
              });
            }
          });

          // Cargar familiares del cliente
          this.clienteService.getFamiliaresByCliente(cliente.ID).subscribe(
            (familiaresData) => {
              this.familiares = familiaresData;
            },
            (error) => {
              console.error('Error al obtener los familiares:', error);
            }
          );
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }

  // Método que se ejecuta cuando cambia el estado de edición.
  onEditStateChanged(isEditing: boolean) {
    this.isEditing = isEditing;
    // Cuando se pasa a modo edición, se revisa el valor de Titular.
    if (this.isEditing) {
      const currentTitular = this.clienteCuentaForm.get('Titular')?.value;
      if (currentTitular !== 'CLIENTE') {
        // Se asume que en la cuenta, el titular está almacenado como texto (nombre completo).
        // Se busca el familiar correspondiente en el arreglo.
        const foundFamiliar = this.familiares.find(fam => (fam.Nombres + ' ' + fam.Apellido_Paterno) == currentTitular);
        if (foundFamiliar) {
          // Se actualiza el control para que tenga el objeto con el que funciona el select.
          this.clienteCuentaForm.get('Titular')?.setValue({ type: 'familiar', data: foundFamiliar });
        }
      }
    }
  }




  compareFn(option, selected): boolean {
    if (option == selected) return true;
    if (typeof option == 'object' && typeof selected == 'object') {
      return option.type == selected.type &&
             option.data?.ID == selected.data?.ID;
    }
    return false;
  }
  


  submitFn(): any {
    const rawData = this.clienteCuentaForm.getRawValue();
  
    // Convertir titular si es objeto
    let titularValue = rawData.Titular;
    if (titularValue !== 'CLIENTE' && typeof titularValue === 'object' && titularValue.type === 'familiar') {
      titularValue = titularValue.data.Nombres + ' ' + titularValue.data.Apellido_Paterno;
    }
  
    const formData = new FormData();
  
    formData.append('ID', rawData.ID);
    formData.append('Cliente_ID', rawData.Cliente_ID);
    formData.append('Principal', rawData.Principal);
    formData.append('Banco', rawData.Banco);
    formData.append('Nro_Cuenta', rawData.Nro_Cuenta);
    formData.append('CCI', rawData.CCI);
    formData.append('Titular', titularValue);
    formData.append('Documento', rawData.Documento);
    formData.append('Nro_Documento', rawData.Nro_Documento);
    formData.append('Parentesco', rawData.Parentesco);
    formData.append('Estado', rawData.Estado);
  
    // Solo si es un archivo nuevo, lo agregamos
    if (rawData.Url_Foto_Cuenta instanceof File) {
      formData.append('Url_Foto_Cuenta', rawData.Url_Foto_Cuenta);
    } else {
      formData.append('Url_Foto_Cuenta', ''); // o lo que tu backend necesite si no se cambia la imagen
    }
  
    return this.clienteService.editCuenta(formData); // este método debería usar `HttpClient.post/put` con FormData
  }


  updateEstado = (newValue: number) => { 
    this.clienteCuentaForm.patchValue({ Estado: newValue });
  };

  updatePrincipal = (newValue: number) => { 
    this.clienteCuentaForm.patchValue({ Principal: newValue });
  };

  onFileSelected(file: File, field: string) { 
    this.clienteCuentaForm.patchValue({ [field]: file }); 
  }

  goBack(): void {
    this.back.emit();
  }
}

