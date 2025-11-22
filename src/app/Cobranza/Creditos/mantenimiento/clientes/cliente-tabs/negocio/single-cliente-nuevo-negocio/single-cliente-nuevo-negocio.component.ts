import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-cliente-nuevo-negocio',
  templateUrl: './single-cliente-nuevo-negocio.component.html',
  styleUrls: ['./single-cliente-nuevo-negocio.component.scss']
})
export class SingleClienteNuevoNegocioComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Output() back = new EventEmitter<void>();

  // Formulario reactivo y datos del cliente
  negocioForm!: FormGroup;
  singleClienteData: any;

  // Propiedades para almacenar los nombres de Tipo_Zona y Tipo_Via
  nombreTipoZona: string = '';
  nombreTipoVia: string = '';

  // URL segura para el iframe del mapa
  mapUrl!: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public clienteService: ClienteService,
    private grupoDeDatoService: GrupoDeDatoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Recuperamos el ID del cliente de la URL y obtenemos sus datos
    this.route.paramMap.subscribe(params => {
      this.singleClienteId = +params.get('id')!;

      this.clienteService.getClienteById(this.singleClienteId).subscribe(
        data => { this.singleClienteData = data; },
        error => { console.error('Error al obtener el cliente:', error); }
      );

      // Inicializar el formulario reactivo
      this.initForm();

      // Configurar suscripciones para actualizar la dirección y el mapa
      this.setupTipoZonaSubscription();
      this.setupTipoViaSubscription();
      this.setupDireccionSubscription();
      this.setupCoordenadasSubscription();

      // Establecer la URL del mapa inicialmente
      this.updateMapUrl();
    });
  }

  // Inicializa el formulario con sus controles y validadores
  private initForm(): void {
    this.negocioForm = this.fb.group({
      Cliente_ID: [this.singleClienteId],
      Principal: [1],
      Nombre: [''],
      Ruc: [''],
      Direccion: [{ value: '', disabled: true }, Validators.required],
      Giro: [''],
      Tipo_Zona: ['', Validators.required],
      Zona: ['', Validators.required],
      Tipo_Via: ['', Validators.required],
      Via: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Coordenada_Y: ['', Validators.required],
      Coordenada_X: ['', Validators.required],
      Tipo_Local: ['', Validators.required],
      Tipo_Material: ['', Validators.required],
      Meses_Funcionamiento: ['', Validators.required],
      CIIU: [''],
      Puesto: [''],
      Referencia: ['', Validators.required],
      Nro: [''],
      Dpto: [''],
      Interior: [''],
      Bloque: [''],
      MZ: [''],
      Lote: [''],
      Etapa: [''],
      Foto_Negocio: [null, Validators.required],
      Estado: [1]
    });
  }

  // Configura la suscripción a cambios en Tipo_Zona para obtener su nombre y actualizar la dirección
  private setupTipoZonaSubscription(): void {
    this.negocioForm.get('Tipo_Zona')?.valueChanges.subscribe(id => {
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
  }

  // Configura la suscripción a cambios en Tipo_Via para obtener su nombre y actualizar la dirección
  private setupTipoViaSubscription(): void {
    this.negocioForm.get('Tipo_Via')?.valueChanges.subscribe(id => {
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
  }

  // Suscribe a todos los cambios que afecten a la dirección
  private setupDireccionSubscription(): void {
    this.negocioForm.valueChanges.subscribe(() => {
      this.updateDireccion();
    });
  }

  // Suscribe a los cambios en las coordenadas para actualizar el mapa
  private setupCoordenadasSubscription(): void {
    this.negocioForm.get('Coordenada_Y')?.valueChanges.subscribe(() => {
      this.updateMapUrl();
    });
    this.negocioForm.get('Coordenada_X')?.valueChanges.subscribe(() => {
      this.updateMapUrl();
    });
  }

  // Construye la URL del mapa a partir de los valores de las coordenadas
  updateMapUrl(): void {
    const coordY = this.negocioForm.get('Coordenada_Y')?.value;
    const coordX = this.negocioForm.get('Coordenada_X')?.value;
    const url = `https://maps.google.com/maps?q=${coordY},${coordX}&hl=es;z=14&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Actualiza el campo de Dirección en función de los demás valores del formulario
  updateDireccion(): void {
    const val = this.negocioForm.getRawValue();
    const partes: string[] = [];

    if (this.nombreTipoZona) { partes.push(`${this.nombreTipoZona}`); }
    if (val.Zona) { partes.push(`Zona:${val.Zona}`); }
    if (this.nombreTipoVia) { partes.push(`${this.nombreTipoVia}`); }
    if (val.Via) { partes.push(`Via:${val.Via}`); }
    if (val.Nro) { partes.push(`Nro:${val.Nro}`); }
    if (val.Dpto) { partes.push(`Dpto:${val.Dpto}`); }
    if (val.Interior) { partes.push(`Interior:${val.Interior}`); }
    if (val.Bloque) { partes.push(`Bloque:${val.Bloque}`); }
    if (val.MZ) { partes.push(`MZ:${val.MZ}`); }
    if (val.Lote) { partes.push(`Lote:${val.Lote}`); }
    if (val.Etapa) { partes.push(`Etapa:${val.Etapa}`); }

    const direccion = partes.join('/');
    // Actualizamos el control sin emitir nuevos eventos para evitar loops
    this.negocioForm.get('Direccion')?.setValue(direccion, { emitEvent: false });
  }

  // Actualiza el campo Principal en el formulario
  updatePrincipal = (newValue: number) => {
    this.negocioForm.patchValue({ Principal: newValue });
  };

  // Maneja la selección de un archivo y actualiza el control correspondiente
  onFileSelected(file: File, field: string): void {
    this.negocioForm.patchValue({ [field]: file });
  }

  // Envía el formulario creando un nuevo negocio
  submitFn(formData: any) {
    return this.clienteService.createNegocio(formData);
  }

  // Emite el evento para volver a la vista anterior
  goBack(): void {
    this.back.emit();
  }
}
