import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';

@Component({
  selector: 'app-single-cliente-negocio',
  templateUrl: './single-cliente-negocio.component.html',
  styleUrls: ['./single-cliente-negocio.component.scss']
})
export class SingleClienteNegocioComponent implements OnInit, OnChanges {

  @Input() singleClienteId: number | null = null;
  @Input() clienteNegocioId: number | null = null;
  @Input() mode: 'view' | 'edit' = 'view';

  @Output() back = new EventEmitter<void>();

  isEditing: boolean = false;
  page_url = PAGE_URL;

  singleClienteData: any;
  clienteNegocioData: any;
  clienteNegocioForm!: FormGroup;

  nombreTipoZona: string = '';
  nombreTipoVia: string = '';

  coordenadaY: string;
  coordenadaX: string;
  mapUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private grupoDeDatoService: GrupoDeDatoService
  ) {}

  ngOnInit(): void {
    if (this.singleClienteId) {
      forkJoin({
        cliente: this.clienteService.getClienteById(this.singleClienteId),
        negocios: this.clienteService.getNegociosByCliente(this.singleClienteId)
      }).subscribe(
        ({ cliente, negocios }) => {
          this.singleClienteData = cliente;
          this.clienteNegocioData = negocios.find(item => item.ID === this.clienteNegocioId);

          if (this.clienteNegocioData) {
            this.initForm();
            this.coordenadaY = this.clienteNegocioData.Coordenada_Y;
            this.coordenadaX = this.clienteNegocioData.Coordenada_X;
            this.updateMapUrl();

            if (this.mode === 'view') {
              this.clienteNegocioForm.disable();
            } else {
              this.setupSubscriptions();
            }
          }
        },
        error => console.error('Error:', error)
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] && this.clienteNegocioForm) {
      if (this.mode === 'view') {
        this.clienteNegocioForm.disable();
        this.isEditing = false;
      } else {
        this.clienteNegocioForm.enable();
        this.setupSubscriptions();
      }
    }
  }

  private initForm(): void {
    this.clienteNegocioForm = this.fb.group({
      ID: [this.clienteNegocioData.ID],
      Cliente_ID: [this.clienteNegocioData.Cliente_ID],
      Nombre: [this.clienteNegocioData.Nombre],
      Ruc: [this.clienteNegocioData.Ruc],
      CIIU: [this.clienteNegocioData.CIIU],
      Direccion: [this.clienteNegocioData.Direccion],
      Giro: [this.clienteNegocioData.Giro],
      Tipo_Zona: [this.clienteNegocioData.Tipo_Zona],
      Zona: [this.clienteNegocioData.Zona],
      Tipo_Via: [this.clienteNegocioData.Tipo_Via],
      Via: [this.clienteNegocioData.Via],
      Ubicacion: [this.clienteNegocioData.Ubicacion],
      Coordenada_Y: [this.clienteNegocioData.Coordenada_Y],
      Coordenada_X: [this.clienteNegocioData.Coordenada_X],
      Tipo_Local: [this.clienteNegocioData.Tipo_Local],
      Tipo_Material: [this.clienteNegocioData.Tipo_Material],
      Meses_Funcionamiento: [this.clienteNegocioData.Meses_Funcionamiento],
      Puesto: [this.clienteNegocioData.Puesto],
      Referencia: [this.clienteNegocioData.Referencia],
      Nro: [this.clienteNegocioData.Nro],
      Dpto: [this.clienteNegocioData.Dpto],
      Interior: [this.clienteNegocioData.Interior],
      Bloque: [this.clienteNegocioData.Bloque],
      MZ: [this.clienteNegocioData.MZ],
      Lote: [this.clienteNegocioData.Lote],
      Etapa: [this.clienteNegocioData.Etapa],
      Principal: [this.clienteNegocioData.Principal],
      Foto_Negocio: [this.clienteNegocioData.Foto_Negocio],
      Estado: [this.clienteNegocioData.Estado],
    });
  }

  private setupSubscriptions(): void {
    this.clienteNegocioForm.get('Tipo_Zona')?.valueChanges.subscribe(id => {
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
    this.clienteNegocioForm.get('Tipo_Via')?.valueChanges.subscribe(id => {
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
    this.clienteNegocioForm.get('Coordenada_Y')?.valueChanges.subscribe((value: string) => {
      this.coordenadaY = value;
      this.updateMapUrl();
    });
    this.clienteNegocioForm.get('Coordenada_X')?.valueChanges.subscribe((value: string) => {
      this.coordenadaX = value;
      this.updateMapUrl();
    });
    this.clienteNegocioForm.valueChanges.subscribe(() => {
      this.updateDireccion();
    });
  }
  
  updateDireccion(): void {
    const val = this.clienteNegocioForm.getRawValue();
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
    this.clienteNegocioForm.get('Direccion')?.setValue(direccion, { emitEvent: false });
  }

  updatePrincipal = (newValue: number) => {
    this.clienteNegocioForm.patchValue({ Principal: newValue });
  };
  updateEstado = (newValue: number) => {
    this.clienteNegocioForm.patchValue({ Estado: newValue });
  };

  onFileSelected(file: File, field: string): void {
    this.clienteNegocioForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.clienteService.editNegocio(formData);
  }

  updateMapUrl(): void {
    const url = `https://maps.google.com/maps?q=${this.coordenadaY},${this.coordenadaX}&hl=es;z=14&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack(): void {
    this.back.emit();
  }
}
