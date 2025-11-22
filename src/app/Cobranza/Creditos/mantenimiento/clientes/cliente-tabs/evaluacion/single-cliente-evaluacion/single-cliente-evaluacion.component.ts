import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ClienteService } from 'src/app/Services/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/theme/shared/components/error-modal/error-dialog.component';

@Component({
  selector: 'app-single-cliente-evaluacion',
  templateUrl: './single-cliente-evaluacion.component.html',
  styleUrls: ['./single-cliente-evaluacion.component.scss']
})
export class SingleClienteEvaluacionComponent implements OnInit {

  @Input() singleClienteId: number | null = null;
  @Input() clienteEvaluacionId: number | null = null;
  @Input() singleClienteIdSolicitud: number;
  @Input() singleEvaluacionIdSolicitud: number;
  @Output() back = new EventEmitter<void>();
  @Output() volverASolicitud = new EventEmitter<void>();

  @Input() mode: 'view' | 'edit' = 'view';

  @Input() use: 'normal' | 'fic' = 'normal';

  @Input() consultaValor: number | null = null;


  singleClienteData: any;
  evaluacionData: any;
  evaluacionForm!: FormGroup;
  isEditing: boolean = false;
  page_url = PAGE_URL;
  evaluacionSeleccionada: string = 'Anterior';
  clienteSeleccionadoID: number | null = null;

  acumuladorIngresosEgresos: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['singleClienteId'] && changes['singleClienteId'].currentValue !== undefined) {
      this.clienteSeleccionadoID = changes['singleClienteId'].currentValue;
    }

    if (changes['singleClienteIdSolicitud'] || changes['singleEvaluacionIdSolicitud'] ) {
      console.log("Cambio anterior:");
      console.log("Cliente ID:", this.singleClienteId);
      console.log("Evaluación ID:", this.clienteEvaluacionId);
      this.singleClienteId = this.singleClienteIdSolicitud;
      this.clienteEvaluacionId = this.singleEvaluacionIdSolicitud;
      console.log("Cambio detectado:");
      console.log("Cliente ID:", this.singleClienteId);
      console.log("Evaluación ID:", this.clienteEvaluacionId);
      this.cargarDatosClienteYEvaluacion();
    }
  }

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarDatosClienteYEvaluacion();
  }

  private cargarDatosClienteYEvaluacion(): void {
    if (this.singleClienteId && this.clienteEvaluacionId) {
      forkJoin({
        cliente: this.clienteService.getClienteById(this.singleClienteId),
        evaluacion: this.clienteService.getEvaluacionById(this.singleClienteId, this.clienteEvaluacionId)
      }).subscribe({
        next: ({ cliente, evaluacion }) => {
          this.singleClienteData = cliente;
          this.evaluacionData = evaluacion;
          this.initForm();
        },
        error: error => {
          console.error('Error al obtener datos:', error);
        }
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  initForm(): void {
    // Inicializa el formulario usando la información actual de la evaluación
    this.evaluacionForm = this.fb.group({
      Cliente_ID: [this.evaluacionData.Cliente_ID],
      ID: [this.evaluacionData.ID],

      Estado: [this.evaluacionData.Estado, Validators.required],
      // Ingresos
      Ventas_Lunes: [this.evaluacionData.Ventas_Lunes],
      Ventas_Martes: [this.evaluacionData.Ventas_Martes],
      Ventas_Miercoles: [this.evaluacionData.Ventas_Miercoles],
      Ventas_Jueves: [this.evaluacionData.Ventas_Jueves],
      Ventas_Viernes: [this.evaluacionData.Ventas_Viernes],
      Ventas_Sabado: [this.evaluacionData.Ventas_Sabado],
      Ventas_Domingo: [this.evaluacionData.Ventas_Domingo],
      // Egresos - Compras
      Compras_Lunes: [this.evaluacionData.Compras_Lunes],
      Compras_Martes: [this.evaluacionData.Compras_Martes],
      Compras_Miercoles: [this.evaluacionData.Compras_Miercoles],
      Compras_Jueves: [this.evaluacionData.Compras_Jueves],
      Compras_Viernes: [this.evaluacionData.Compras_Viernes],
      Compras_Sabado: [this.evaluacionData.Compras_Sabado],
      Compras_Domingo: [this.evaluacionData.Compras_Domingo],
      // Egresos - Alquileres
      Alquileres_Lunes: [this.evaluacionData.Alquileres_Lunes],
      Alquileres_Martes: [this.evaluacionData.Alquileres_Martes],
      Alquileres_Miercoles: [this.evaluacionData.Alquileres_Miercoles],
      Alquileres_Jueves: [this.evaluacionData.Alquileres_Jueves],
      Alquileres_Viernes: [this.evaluacionData.Alquileres_Viernes],
      Alquileres_Sabado: [this.evaluacionData.Alquileres_Sabado],
      Alquileres_Domingo: [this.evaluacionData.Alquileres_Domingo],
      // Egresos - Pasajes
      Pasajes_Lunes: [this.evaluacionData.Pasajes_Lunes],
      Pasajes_Martes: [this.evaluacionData.Pasajes_Martes],
      Pasajes_Miercoles: [this.evaluacionData.Pasajes_Miercoles],
      Pasajes_Jueves: [this.evaluacionData.Pasajes_Jueves],
      Pasajes_Viernes: [this.evaluacionData.Pasajes_Viernes],
      Pasajes_Sabado: [this.evaluacionData.Pasajes_Sabado],
      Pasajes_Domingo: [this.evaluacionData.Pasajes_Domingo],
      // Egresos - Alimentación
      Alimentacion_Lunes: [this.evaluacionData.Alimentacion_Lunes],
      Alimentacion_Martes: [this.evaluacionData.Alimentacion_Martes],
      Alimentacion_Miercoles: [this.evaluacionData.Alimentacion_Miercoles],
      Alimentacion_Jueves: [this.evaluacionData.Alimentacion_Jueves],
      Alimentacion_Viernes: [this.evaluacionData.Alimentacion_Viernes],
      Alimentacion_Sabado: [this.evaluacionData.Alimentacion_Sabado],
      Alimentacion_Domingo: [this.evaluacionData.Alimentacion_Domingo],
      // Egresos - Otros
      Otros_Lunes: [this.evaluacionData.Otros_Lunes],
      Otros_Martes: [this.evaluacionData.Otros_Martes],
      Otros_Miercoles: [this.evaluacionData.Otros_Miercoles],
      Otros_Jueves: [this.evaluacionData.Otros_Jueves],
      Otros_Viernes: [this.evaluacionData.Otros_Viernes],
      Otros_Sabado: [this.evaluacionData.Otros_Sabado],
      Otros_Domingo: [this.evaluacionData.Otros_Domingo]
    });
  }

  cambiarATabSolicitud() {
    this.volverASolicitud.emit();
  }
  onSubmit(): void {
    if (this.validarDatos()) {
      const formData = new FormData();
  
      for (const key in this.evaluacionForm.value) {
        if (this.evaluacionForm.value.hasOwnProperty(key)) {
          const value = this.evaluacionForm.value[key];
          formData.append(key, value !== null ? value : '');
        }
      }
  
      this.clienteService.editEvaluacion(formData).subscribe({
        next: (response) => {
          this.dialog.open(ErrorDialogComponent, {
            data: { message: response.vdesError }
          });
          if(response.icodError === "0"){
            this.toggleEdit();
            if(this.consultaValor === 1){
              this.volverASolicitud.emit();
            }
          }
        },
        error: (error) => {
          console.error('Error al editar la evaluación:', error);
        }
      });
  
    } else {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: `Los campos de evaluación deben ser mayores a 0` }
      });
    }
  }

  goBack(): void {
    this.back.emit();
  }

  // Métodos auxiliares para cálculos de totales

  private getNumberControl(controlName: string): number {
    const val = this.evaluacionForm.get(controlName)?.value;
    return val ? parseFloat(val) : 0;
  }

  getTotalIngresos(dia: string): number {
    return this.getNumberControl(`Ventas_${dia}`);
  }

  getTotalEgresos(dia: string): number {
    return (
      this.getNumberControl(`Compras_${dia}`) +
      this.getNumberControl(`Alquileres_${dia}`) +
      this.getNumberControl(`Pasajes_${dia}`) +
      this.getNumberControl(`Alimentacion_${dia}`) +
      this.getNumberControl(`Otros_${dia}`)
    );
  }

  getDiferencia(dia: string): number {   
    return this.getTotalIngresos(dia) - this.getTotalEgresos(dia);
  }

  validarDatos(): boolean {
    const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    const campos = ["Ventas", "Compras", "Alquileres", "Pasajes", "Alimentacion", "Otros"];

    for (let dia of dias) {
      for (let campo of campos) {
        const controlName = `${campo}_${dia}`;
        const value = this.getNumberControl(controlName);
        if (value <= 0 || value == null) {
          return false;
        }
      }
    }
  
    return true;
  }

  calcularAcumulado(): number {
    const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    
    this.acumuladorIngresosEgresos = dias.reduce((acumulado, dia) => {
      return acumulado + this.getDiferencia(dia);
    }, 0);
    
    return this.acumuladorIngresosEgresos;
  }

  promedioSaldoDiario(acumaladorIngresosEgresos: number): number {
    const nro_dias = 5;
    return acumaladorIngresosEgresos / nro_dias;
  }

  maxCuotaDiaria(acumaladorIngresosEgresos: number): string {
    const porcentaje = 18;
    return (acumaladorIngresosEgresos * (porcentaje / 100)).toFixed(2);
  }

  maxCuotaSemanal(acumaladorIngresosEgresos: number): string {
    const porcentaje = 90;
    return (acumaladorIngresosEgresos * (porcentaje / 100)).toFixed(2);
  }

  maxCuotaQuincenal(acumaladorIngresosEgresos: number): string {
    const porcentaje = 180;
    return (acumaladorIngresosEgresos * (porcentaje / 100)).toFixed(2);
  }

  maxCuotaMensual(acumaladorIngresosEgresos: number): string {
    const porcentaje = 360;
    return (acumaladorIngresosEgresos * (porcentaje / 100)).toFixed(2);
  }
}
