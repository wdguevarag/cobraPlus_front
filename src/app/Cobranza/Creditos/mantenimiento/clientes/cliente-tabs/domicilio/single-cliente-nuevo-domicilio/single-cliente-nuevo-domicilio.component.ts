import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-cliente-nuevo-domicilio',
  templateUrl: './single-cliente-nuevo-domicilio.component.html',
  styleUrls: ['./single-cliente-nuevo-domicilio.component.scss']
})
export class SingleClienteNuevoDomicilioComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Output() back = new EventEmitter<void>();

  singleClienteData: any;
  clienteDomicilioForm!: FormGroup;

  // Propiedades para los nombres de los select
  nombreTipoZona: string = '';
  nombreTipoVia: string = '';

  // Propiedades para el mapa
  mapUrl!: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public clienteService: ClienteService,
    private grupoDatoDetalleService: GrupoDeDatoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleClienteId = +params.get('id')!;

      // Obtener datos del cliente
      this.clienteService.getClienteById(this.singleClienteId).subscribe(
        data => { this.singleClienteData = data; },
        error => { console.error('Error al obtener el cliente:', error); }
      );

      // Inicializar el formulario
      this.initForm();
      // Configurar suscripciones para actualizar dirección y mapa
      this.setupSubscriptions();
      // Actualización inicial del mapa
      this.updateMapUrl();
    });
  }

  // Inicializa el formulario con validaciones
  private initForm(): void {
    this.clienteDomicilioForm = this.fb.group({
      Cliente_ID: [this.singleClienteId],
      Principal: [1],
      Tipo_Zona: ['', Validators.required],
      Zona: ['', Validators.required],
      Tipo_Via: ['', Validators.required],
      Via: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Direccion: [{ value: '', disabled: true }, Validators.required],
      Referencia: ['', Validators.required],
      Tipo_Vivienda: ['', Validators.required],
      Material: ['', Validators.required],
      Anios_Residencia: ['', Validators.required],
      Nro: [''],
      Dpto: [''],
      Interior: [''],
      Parcela: [''],
      Mz: [''],
      Lote: [''],
      Etapa: [''],
      Agua: [0, Validators.required],
      Luz: [0, Validators.required],
      Desague: [0, Validators.required],
      Telefono: [0, Validators.required],
      Cable: [0, Validators.required],
      Foto_Domicilio: [null, Validators.required],
      Coordenada_Y: ['', Validators.required],
      Coordenada_X: ['', Validators.required],
      Estado: [1, Validators.required]
    });
  }

  // Configura suscripciones para actualizar dirección y mapa
  private setupSubscriptions(): void {
    // Actualiza el nombre de Tipo_Zona y la dirección
    this.clienteDomicilioForm.get('Tipo_Zona')?.valueChanges.subscribe(id => {
      if (id) {
        this.grupoDatoDetalleService.getDetalleGrupoDatosById(id).subscribe(
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
        this.grupoDatoDetalleService.getDetalleGrupoDatosById(id).subscribe(
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

    // Actualiza la dirección cuando cambian los demás campos
    this.clienteDomicilioForm.valueChanges.subscribe(() => {
      this.updateDireccion();
    });

    // Suscribirse a los cambios de coordenadas para actualizar el mapa
    this.clienteDomicilioForm.get('Coordenada_Y')?.valueChanges.subscribe(() => {
      this.updateMapUrl();
    });
    this.clienteDomicilioForm.get('Coordenada_X')?.valueChanges.subscribe(() => {
      this.updateMapUrl();
    });
  }

  /**
   * updateDireccion(): Construye la dirección concatenando "Campo:Valor" en el orden deseado.
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
    this.clienteDomicilioForm.get('Direccion')?.setValue(direccion, { emitEvent: false });
  }

  // Actualiza la URL del mapa basándose en las coordenadas ingresadas
  updateMapUrl(): void {
    const coordY = this.clienteDomicilioForm.get('Coordenada_Y')?.value;
    const coordX = this.clienteDomicilioForm.get('Coordenada_X')?.value;
    const url = `https://maps.google.com/maps?q=${coordY},${coordX}&hl=es;z=14&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Maneja la selección de archivos para la foto del domicilio
  onFileSelected(file: File, field: string): void {
    this.clienteDomicilioForm.patchValue({ [field]: file });
  }

  // Actualiza el valor del campo Principal en el formulario
  updatePrincipal = (newValue: number) => {
    this.clienteDomicilioForm.patchValue({ Principal: newValue });
  };

  updateLuz = (newValue: number) => {
    this.clienteDomicilioForm.patchValue({ Luz: newValue });
  };

  updateAgua = (newValue: number) => {
    this.clienteDomicilioForm.patchValue({ Agua: newValue });
  };

  updateCable = (newValue: number) => {
    this.clienteDomicilioForm.patchValue({ Cable: newValue });
  };

  updateDesague = (newValue: number) => {
    this.clienteDomicilioForm.patchValue({ Desague: newValue });
  };

  updateTelefono = (newValue: number) => {
    this.clienteDomicilioForm.patchValue({ Telefono: newValue });
  };
  // Envía el formulario para crear el domicilio
  submitFn(formData: any) {
    return this.clienteService.createDomicilio(formData);
  }

  // Emite el evento para volver a la vista anterior
  goBack(): void {
    this.back.emit();
  }
}

