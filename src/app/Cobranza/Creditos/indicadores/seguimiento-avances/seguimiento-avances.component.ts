import { Component, OnInit } from '@angular/core';
import { ProductividadService } from 'src/app/Services/productividad.service';
import { SeguimientoAvancesService } from 'src/app/Services/seguimiento-avances.service';

@Component({
  selector: 'app-seguimiento-avances',
  templateUrl: './seguimiento-avances.component.html',
  styleUrls: ['./seguimiento-avances.component.scss']
})
export class SeguimientoAvancesComponent implements OnInit {
  analistas: any[] = [];
  analistaSeleccionado: number | null = null;
  fechaSeleccionada: string = '';
  activeTab: 'mensual' | 'semanal' = 'mensual';

  metaData: any = null;
  avanceData: any = null;

  rows: Array<{
    label: string;
    key: string;
    meta: number;
    avance: number;
    cumplimiento: number | null; // porcentaje
  }> = [];

  // CAMBIADO A PUBLIC
  public metricLabels: { [key: string]: string } = {
    Clientes_7d: 'Clientes ≤ 7 días',
    Cartera_7d: 'Cartera ≤ 7 días',
    Cartera_8d: 'Cartera ≥ 8 días',
    Mora_8d: 'Mora 8 días %',
    Credito_Promedio: 'Crédito Promedio',
    Desembolsos_Nuevos_Num: 'Nº Desembolsos Nuevos',
    Desembolsos_Nuevos_Monto: 'Monto Desembolsos Nuevos',
  };

  isResumen: boolean = false;
  selectedMetricKey: string | null = null;

  constructor(
    private productividadService: ProductividadService,
    private seguimientoAvancesService: SeguimientoAvancesService
  ) {}

  ngOnInit(): void {
    this.productividadService.getAnalistas().subscribe(
      (data) => {
        this.analistas = data;
        this.onFilterChange();
      },
      (error) => {
        console.error('Error cargando analistas', error);
        this.analistas = [];
        this.onFilterChange();
      }
    );
  }

  get tipoMetaChar(): 'M' | 'S' {
    return this.activeTab === 'mensual' ? 'M' : 'S';
  }

  setActiveTab(tab: 'mensual' | 'semanal'): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.fechaSeleccionada = '';
      this.rows = [];
      this.metaData = null;
      this.avanceData = null;
      this.isResumen = false;
      this.selectedMetricKey = null;
      this.onFilterChange();
    }
  }

  onFilterChange(): void {
    const fechaParam = this.fechaSeleccionada?.trim() || null;

    this.seguimientoAvancesService.getMetaAvanceAnalista(
      this.analistaSeleccionado,
      fechaParam,
      this.tipoMetaChar
    ).subscribe(
      (data) => {
        if (!Array.isArray(data)) {
          console.error('Formato de datos inesperado');
          this.rows = [];
          this.metaData = null;
          this.avanceData = null;
          return;
        }

        this.metaData = data.find(d => d.Tipo_Data === 'Meta') || null;
        this.avanceData = data.find(d => d.Tipo_Data === 'Avance') || null;
        this.buildRows();

        if (this.isResumen && !this.selectedMetricKey) {
          const keys = this.metricKeys;
          if (keys.length) {
            this.selectedMetricKey = keys[0];
          }
        }
      },
      (error) => {
        console.error('Error obteniendo datos', error);
        this.rows = [];
        this.metaData = null;
        this.avanceData = null;
      }
    );
  }

  private buildRows(): void {
    this.rows = [];
    if (!this.metaData || !this.avanceData) return;

    for (const key of Object.keys(this.metricLabels)) {
      const metaRaw = this.metaData[key];
      const avanceRaw = this.avanceData[key];
      const meta = metaRaw != null ? parseFloat(metaRaw) : 0;
      const avance = avanceRaw != null ? parseFloat(avanceRaw) : 0;

      let cumplimiento: number | null = null;
      if (meta === 0) {
        cumplimiento = (avance === 0) ? 0 : null;
      } else {
        cumplimiento = (avance / meta) * 100;
      }

      this.rows.push({
        label: this.metricLabels[key],
        key,
        meta,
        avance,
        cumplimiento
      });
    }
  }

  get metricKeys(): string[] {
    return Object.keys(this.metricLabels);
  }

  getAnalistaNombre(): string {
    if (this.analistaSeleccionado == null) {
      return 'Todos';
    }
    const found = this.analistas.find(a => a.ID === this.analistaSeleccionado);
    return found ? found.Nombre : `ID ${this.analistaSeleccionado}`;
  }

  getRowValue(key: string, field: 'meta' | 'avance' | 'cumplimiento'): number | null {
    const row = this.rows.find(r => r.key === key);
    if (!row) {
      return field === 'cumplimiento' ? null : 0;
    }
    return row[field];
  }

  mostrarResumen(): void {
    this.isResumen = !this.isResumen;
    if (this.isResumen) {
      if (!this.rows.length) {
        this.onFilterChange();
      }
      if (!this.selectedMetricKey) {
        const keys = this.metricKeys;
        if (keys.length) {
          this.selectedMetricKey = keys[0];
        }
      }
    } else {
      this.selectedMetricKey = null;
    }
  }
}
