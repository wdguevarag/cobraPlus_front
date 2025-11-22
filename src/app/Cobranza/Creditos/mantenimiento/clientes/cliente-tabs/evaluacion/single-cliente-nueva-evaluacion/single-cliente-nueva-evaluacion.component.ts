import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/Services/clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/theme/shared/components/error-modal/error-dialog.component';

@Component({
  selector: 'app-single-cliente-nueva-evaluacion',
  templateUrl: './single-cliente-nueva-evaluacion.component.html',
  styleUrls: ['./single-cliente-nueva-evaluacion.component.scss']
})
export class SingleClienteNuevaEvaluacionComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Input() valorBotonNew: number | null = null;
  @Input() consultaValor: number | null = null;
  @Input() singleClienteIdSolicitud!: number;

  @Output() evaluacionCreada = new EventEmitter<void>();
  @Output() volver = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() volverASolicitud = new EventEmitter<void>();

  evaluacionForm!: FormGroup;
  singleClienteData: any;
  fechaInicioInfo!: string;
  fechaFinInfo!: string;

  acumuladorIngresosEgresos = 0;
  erroresPromedios: string[] = [];
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    public clienteService: ClienteService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDatosCliente();
    this.initFechas();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['singleClienteIdSolicitud']) {
      this.singleClienteId = changes['singleClienteIdSolicitud'].currentValue;
      this.cargarDatosCliente();
    }
  }

  private initFechas(): void {
    const today = new Date();
    this.fechaInicioInfo = this.formatDate(today);
    const fin = new Date(today);
    fin.setMonth(fin.getMonth() + 3);
    this.fechaFinInfo = this.formatDate(fin);
  }

  private cargarDatosCliente(): void {
    if (this.singleClienteId == null) { return; }
    this.clienteService.getClienteById(this.singleClienteId).subscribe(
      data => this.singleClienteData = data,
      err  => console.error('Error al obtener el cliente:', err)
    );
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  }

  private initForm(): void {
    this.evaluacionForm = this.fb.group({
      Cliente_ID:       [this.singleClienteId, Validators.required],
      Estado:           [1, Validators.required],
      Ventas_Lunes:     [0], Ventas_Martes:    [0], Ventas_Miercoles: [0], Ventas_Jueves: [0], Ventas_Viernes: [0], Ventas_Sabado: [0], Ventas_Domingo: [0],
      Compras_Lunes:    [0], Compras_Martes:   [0], Compras_Miercoles:[0], Compras_Jueves:[0], Compras_Viernes:[0], Compras_Sabado:[0], Compras_Domingo:[0],
      Alquileres_Lunes: [0], Alquileres_Martes: [0], Alquileres_Miercoles:[0], Alquileres_Jueves:[0], Alquileres_Viernes:[0], Alquileres_Sabado:[0], Alquileres_Domingo:[0],
      Pasajes_Lunes:    [0], Pasajes_Martes:   [0], Pasajes_Miercoles:[0], Pasajes_Jueves:[0], Pasajes_Viernes:[0], Pasajes_Sabado:[0], Pasajes_Domingo:[0],
      Alimentacion_Lunes:[0], Alimentacion_Martes:[0], Alimentacion_Miercoles:[0], Alimentacion_Jueves:[0], Alimentacion_Viernes:[0], Alimentacion_Sabado:[0], Alimentacion_Domingo:[0],
      Otros_Lunes:      [0], Otros_Martes:     [0], Otros_Miercoles:[0], Otros_Jueves:[0], Otros_Viernes:[0], Otros_Sabado:[0], Otros_Domingo:[0]
    });
  }

  onSubmit(): void {
    if (this.isSubmitted) { return; }

    const datosOk = this.validarDatos();
    const promediosOk = this.validarPromedios();

    if (!datosOk || !promediosOk) {
      const msg = !datosOk ? 'Las Ventas y Compras deben ser mayores a 0.' : 'Corrige los promedios negativos.';
      this.dialog.open(ErrorDialogComponent, { data: { message: msg } });
      return;
    }

    const formData = new FormData();
    Object.entries(this.evaluacionForm.value).forEach(([k, v]) => formData.append(k, v == null ? '' : v as any));


    this.clienteService.createEvaluacion(formData).subscribe({
      next: response => {
        // 1) Abre el popup
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          data: { message: response.vdesError }
        });

        // 2) Sólo después de cerrar el popup marcamos enviado y notificamos al padre
        dialogRef.afterClosed().subscribe(() => {
          this.isSubmitted = true;
          this.evaluacionCreada.emit();

          if (response.icodError === '0' && this.consultaValor === 1) {
            this.volverASolicitud.emit();
          }
        });
      },
      error: err => console.error('Error al crear la evaluación:', err)
    });



  }

  volverAAnterior(): void {
    this.valorBotonNew === 1 ? this.back.emit() : this.volver.emit();
  }

  private getNumberControl(name: string): number {
    const val = this.evaluacionForm.get(name)?.value;
    return val != null ? parseFloat(val) : 0;
  }

  getTotalIngresos(dia: string): number {
    return this.getNumberControl(`Ventas_${dia}`);
  }

  getTotalEgresos(dia: string): number {
    return ['Compras','Alquileres','Pasajes','Alimentacion','Otros']
      .reduce((sum, cat) => sum + this.getNumberControl(`${cat}_${dia}`), 0);
  }

  getDiferencia(dia: string): number {
    return this.getTotalIngresos(dia) - this.getTotalEgresos(dia);
  }

  validarDatos(): boolean {
    const dias = ['Lunes','Martes','Miercoles','Jueves','Viernes'];
    for (const dia of dias) {
      const v = this.getNumberControl(`Ventas_${dia}`);
      const c = this.getNumberControl(`Compras_${dia}`);
      if (v <= 0 || c <= 0) { return false; }
    }
    return true;
  }

  calcularAcumulado(): number {
    return ['Lunes','Martes','Miercoles','Jueves','Viernes']
      .reduce((acc, d) => acc + this.getDiferencia(d), 0);
  }

  promedioSaldoDiario(total: number): number {
    return total / 5;
  }

  maxCuotaDiaria(total: number): string {
    return (total * 0.18).toFixed(2);
  }

  maxCuotaSemanal(total: number): string {
    return (total * 0.90).toFixed(2);
  }

  maxCuotaQuincenal(total: number): string {
    return (total * 1.80).toFixed(2);
  }

  maxCuotaMensual(total: number): string {
    return (total * 3.60).toFixed(2);
  }

  private validarPromedios(): boolean {
    this.erroresPromedios = [];
    const total = this.calcularAcumulado();
    const checks = [
      { val: this.promedioSaldoDiario(total), msg: 'Prom. Diario no puede ser negativo.' },
      { val: parseFloat(this.maxCuotaDiaria(total)), msg: 'Max Cuota Diario no puede ser negativo.' },
      { val: parseFloat(this.maxCuotaSemanal(total)), msg: 'Max Cuota Semanal no puede ser negativo.' },
      { val: parseFloat(this.maxCuotaQuincenal(total)), msg: 'Max Cuota Quincenal no puede ser negativo.' },
      { val: parseFloat(this.maxCuotaMensual(total)), msg: 'Max Cuota Mensual no puede ser negativo.' }
    ];
    checks.forEach(c => { if (c.val < 0) this.erroresPromedios.push(c.msg); });
    return this.erroresPromedios.length === 0;
  }
}
