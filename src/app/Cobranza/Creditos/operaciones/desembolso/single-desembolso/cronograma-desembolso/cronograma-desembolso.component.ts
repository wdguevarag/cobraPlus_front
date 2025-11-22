import { Component, Input, OnInit } from '@angular/core';
import { CreditoService } from 'src/app/Services/creditos.service';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';

interface CronoItem {
  Nro_Cuota: number;
  F_Vencimiento: string;  // "dd-MM-yyyy" o "dd/MM/yyyy"
  Amortizado: number;
  Interes: number;
  IGV: number;
  Gastos_ADM: number;
  Cuota_Total: number;

  // nuestras nuevas propiedades de presentación:
  days?: number;
  daysAcum?: number;
  saldo?: number;
}

@Component({
  selector: 'app-cronograma-desembolso',
  templateUrl: './cronograma-desembolso.component.html',
  styleUrl: './cronograma-desembolso.component.scss'
})
export class CronogramaDesembolsoComponent implements OnInit {
  @Input() credito_id!: number;

  creditoData!: { Prestamo: number };
  cronogramaData: CronoItem[] = [];
  estadoCronograma = 0;

  constructor(
    private creditoService: CreditoService,
    private cuotasCronogramaService: CuotasCronogramaService,
  ) {}

  ngOnInit(): void {
    // 1) cargamos primero el monto del préstamo
    this.creditoService.getCreditoById(this.credito_id)
      .subscribe( credito => {
        this.creditoData = credito;
        // 2) una vez tenemos el préstamo, pedimos el cronograma
        this.obtenerDatosCuotas();
      }, err => console.error(err) );
  }

  private obtenerDatosCuotas(): void {
    this.cuotasCronogramaService
      .getCuotaCronogramaByCreditIdAndEstadoCronograma(this.credito_id, this.estadoCronograma)
      .subscribe(
        (data: CronoItem[]) => {
          this.cronogramaData = data;
          this.addCalculations();
        },
        (error) => console.error('Error al obtener cronograma', error)
      );
  }

  /** Calcula días, días acumulados y saldo restante */
  private addCalculations(): void {
    let acumuladoDias = 0;
    let runningSaldo = Number(this.creditoData.Prestamo) || 0;

    for (let i = 0; i < this.cronogramaData.length; i++) {
      const item = this.cronogramaData[i];

      // — parseo de fecha
      const sep = item.F_Vencimiento.includes('/') ? '/' : '-';
      const [dd, mm, yyyy] = item.F_Vencimiento
        .split(sep)
        .map(s => parseInt(s, 10));
      const fecha = new Date(yyyy, mm - 1, dd);

      // — cálculo de días desde la fila anterior
      let dias = 1;
      if (i > 0) {
        const prev = this.cronogramaData[i - 1];
        const [pd, pm, py] = prev.F_Vencimiento
          .split(sep)
          .map(s => parseInt(s, 10));
        const fechaPrev = new Date(py, pm - 1, pd);
        const diffMs = fecha.getTime() - fechaPrev.getTime();
        dias = Math.round(diffMs / (1000 * 60 * 60 * 24));
      }

      acumuladoDias += dias;
      item.days = dias;
      item.daysAcum = acumuladoDias;

      // — cálculo de saldo
      runningSaldo -= item.Amortizado;
      item.saldo = runningSaldo;
    }
  }

  /** Suma una columna numérica del cronograma */
  getTotal(field: keyof CronoItem): number {
    return this.cronogramaData
      .reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  }
}
