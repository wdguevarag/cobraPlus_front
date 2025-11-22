import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ClienteService } from 'src/app/Services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';

@Component({
  selector: 'app-single-cliente-domicilio',
  templateUrl: './single-cliente-domicilio.component.html',
  styleUrls: ['./single-cliente-domicilio.component.scss']
})
export class SingleClienteDomicilioComponent implements OnInit, OnChanges {

  @Input() singleClienteId: number | null = null;
  @Input() clienteDomicilioId: number | null = null;
  @Input() mode: 'view' | 'edit' = 'view';

  @Output() back = new EventEmitter<void>();

  isEditing: boolean = false;
  page_url = PAGE_URL;
  
  singleClienteData: any;
  clienteDomicilioData: any;
  clienteDomicilioForm!: FormGroup;

  // Variables para almacenar los nombres obtenidos
  nombreTipoZona: string = '';
  nombreTipoVia: string = '';

  // Variables para el mapa
  coordenadaY: string;
  coordenadaX: string;
  mapUrl!: SafeResourceUrl;
  
  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private grupoDeDatoService: GrupoDeDatoService
  ) {}

  ngOnInit(): void {
    if (this.singleClienteId) {
      forkJoin({
        cliente: this.clienteService.getClienteById(this.singleClienteId),
        domicilios: this.clienteService.getDomiciliosByCliente(this.singleClienteId)
      }).subscribe(
        ({ cliente, domicilios }) => {
          this.singleClienteData = cliente;
          this.clienteDomicilioData = domicilios.find(item => item.ID === this.clienteDomicilioId);

          if (this.clienteDomicilioData) {
            this.initForm();
            // Asignar coordenadas iniciales y actualizar el mapa
            this.coordenadaY = this.clienteDomicilioData.Coordenada_Y;
            this.coordenadaX = this.clienteDomicilioData.Coordenada_X;
            this.updateMapUrl();

            // Configurar suscripciones solo en modo edición
            if (this.mode === 'edit') {
              this.setupSubscriptions();
            }
            if (this.mode === 'view') {
              this.clienteDomicilioForm.disable();
            }
          }
        },
        error => console.error('Error:', error)
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] && this.clienteDomicilioForm) {
      if (this.mode === 'view') {
        this.clienteDomicilioForm.disable();
        this.isEditing = false;
      } else {
        this.clienteDomicilioForm.enable();
        this.setupSubscriptions();
      }
    }
  }

  // Inicializa el formulario con los datos existentes
  private initForm(): void {
    this.clienteDomicilioForm = this.fb.group({
      ID               : [this.clienteDomicilioData.ID],
      Principal        : [this.clienteDomicilioData.Principal],
      Cliente_ID       : [this.clienteDomicilioData.Cliente_ID],
      Tipo_Zona        : [this.clienteDomicilioData.Tipo_Zona , Validators.required],
      Zona             : [this.clienteDomicilioData.Zona, Validators.required],
      Tipo_Via         : [this.clienteDomicilioData.Tipo_Via , Validators.required],
      Via              : [this.clienteDomicilioData.Via , Validators.required],
      Ubicacion        : [this.clienteDomicilioData.Ubicacion  , Validators.required],
      Direccion        : [this.clienteDomicilioData.Direccion , Validators.required],
      Referencia       : [this.clienteDomicilioData.Referencia , Validators.required],
      Tipo_Vivienda    : [this.clienteDomicilioData.Tipo_Vivienda, Validators.required],
      Material         : [this.clienteDomicilioData.Material , Validators.required],
      Anios_Residencia : [this.clienteDomicilioData.Anios_Residencia , Validators.required],
      Nro              : [this.clienteDomicilioData.Nro],
      Dpto             : [this.clienteDomicilioData.Dpto],
      Interior         : [this.clienteDomicilioData.Interior],
      Parcela          : [this.clienteDomicilioData.Parcela],
      Mz               : [this.clienteDomicilioData.Mz],
      Lote             : [this.clienteDomicilioData.Lote],
      Etapa            : [this.clienteDomicilioData.Etapa],
      Agua             : [this.clienteDomicilioData.Agua],
      Luz              : [this.clienteDomicilioData.Luz],
      Desague          : [this.clienteDomicilioData.Desague],
      Telefono         : [this.clienteDomicilioData.Telefono],
      Cable            : [this.clienteDomicilioData.Cable],
      Foto_Domicilio   : [this.clienteDomicilioData.Foto_Domicilio, Validators.required ],
      Coordenada_Y     : [this.clienteDomicilioData.Coordenada_Y , Validators.required ],
      Coordenada_X     : [this.clienteDomicilioData.Coordenada_X, Validators.required ],
      Estado           : [this.clienteDomicilioData.Estado],
    });
  }

  // Configura las suscripciones para actualizar la dirección y el mapa
  private setupSubscriptions(): void {
    // Actualiza el nombre de Tipo_Zona y la dirección
    this.clienteDomicilioForm.get('Tipo_Zona')?.valueChanges.subscribe(id => {
      if (id) {
        this.grupoDeDatoService.getDetalleGrupoDatosById(id).subscribe(
          data => {
            this.nombreTipoZona = data.Nombre;
            this.updateDireccion();
          },
          error => console.error('Error al obtener detalle de Tipo_Zona:', error)
        );
      } else {
        this.nombreTipoZona = '';
        this.updateDireccion();
      }
    });

    // Actualiza el nombre de Tipo_Via y la dirección
    this.clienteDomicilioForm.get('Tipo_Via')?.valueChanges.subscribe(id => {
      if (id) {
        this.grupoDeDatoService.getDetalleGrupoDatosById(id).subscribe(
          data => {
            this.nombreTipoVia = data.Nombre;
            this.updateDireccion();
          },
          error => console.error('Error al obtener detalle de Tipo_Via:', error)
        );
      } else {
        this.nombreTipoVia = '';
        this.updateDireccion();
      }
    });

    // Actualiza el mapa al cambiar las coordenadas
    this.clienteDomicilioForm.get('Coordenada_Y')?.valueChanges.subscribe((value: string) => {
      this.coordenadaY = value;
      this.updateMapUrl();
    });
    this.clienteDomicilioForm.get('Coordenada_X')?.valueChanges.subscribe((value: string) => {
      this.coordenadaX = value;
      this.updateMapUrl();
    });

    // Actualiza la dirección cuando cambian otros campos del formulario
    this.clienteDomicilioForm.valueChanges.subscribe(() => {
      this.updateDireccion();
    });
  }

  /**
   * updateDireccion(): Construye la dirección en el formato:
   * "Tipo-Zona:<nombreTipoZona>/Zona:<Zona>/Tipo-Via:<nombreTipoVia>/Via:<Via>/Nro:<Nro>/..."
   */
  updateDireccion(): void {
    const val = this.clienteDomicilioForm.getRawValue();
    const partes: string[] = [];

    if (this.nombreTipoZona) { partes.push(`${this.nombreTipoZona}`); }
    if (val.Zona) { partes.push(`Zona:${val.Zona}`); }
    if (this.nombreTipoVia) { partes.push(`${this.nombreTipoVia}`); }
    if (val.Via) { partes.push(`Via:${val.Via}`); }
    if (val.Nro) { partes.push(`Nro:${val.Nro}`); }
    if (val.Dpto) { partes.push(`Dpto:${val.Dpto}`); }
    if (val.Interior) { partes.push(`Interior:${val.Interior}`); }
    if (val.Parcela) { partes.push(`Parcela:${val.Parcela}`); }
    if (val.Mz) { partes.push(`Mz:${val.Mz}`); }
    if (val.Lote) { partes.push(`Lote:${val.Lote}`); }
    if (val.Etapa) { partes.push(`Etapa:${val.Etapa}`); }

    const direccion = partes.join('/');
    // Actualizamos el control sin emitir eventos adicionales para evitar ciclos
    this.clienteDomicilioForm.get('Direccion')?.setValue(direccion, { emitEvent: false });
  }

  // Actualiza la URL del mapa basándose en las coordenadas actuales
  updateMapUrl(): void {
    const url = `https://maps.google.com/maps?q=${this.coordenadaY},${this.coordenadaX}&hl=es;z=14&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Métodos para actualizar campos individuales mediante botones toggle
  updatePrincipal = (newValue: number) => this.clienteDomicilioForm.patchValue({ Principal: newValue });
  updateEstado = (newValue: number) => this.clienteDomicilioForm.patchValue({ Estado: newValue });
  updateLuz = (newValue: number) => this.clienteDomicilioForm.patchValue({ Luz: newValue });
  updateAgua = (newValue: number) => this.clienteDomicilioForm.patchValue({ Agua: newValue });
  updateCable = (newValue: number) => this.clienteDomicilioForm.patchValue({ Cable: newValue });
  updateDesague = (newValue: number) => this.clienteDomicilioForm.patchValue({ Desague: newValue });
  updateTelefono = (newValue: number) => this.clienteDomicilioForm.patchValue({ Telefono: newValue });

  // Maneja la selección de archivos para la foto del domicilio
  onFileSelected(file: File, field: string): void {
    this.clienteDomicilioForm.patchValue({ [field]: file });
  }

  // Envía el formulario para editar el domicilio
  submitFn(formData: FormData) {
    return this.clienteService.editDomicilio(formData);
  }

  // Emite el evento para volver a la vista anterior
  goBack(): void {
    this.back.emit();
  }
}
