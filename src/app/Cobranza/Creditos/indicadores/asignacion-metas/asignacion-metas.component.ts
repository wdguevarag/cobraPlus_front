import { Component, OnInit } from '@angular/core';
import { AsignacionMetasService } from 'src/app/Services/asignacion-metas.service';
import { ProductividadService } from 'src/app/Services/productividad.service';

@Component({
  selector: 'app-asignacion-metas',
  templateUrl: './asignacion-metas.component.html',
  styleUrl: './asignacion-metas.component.scss'
})
export class AsignacionMetasComponent implements OnInit {
  analistas: any[] = [];
  analistaSeleccionado: number | null = null;
  fechaSeleccionada: string = '';
  activeTab: 'mensual' | 'semanal' = 'mensual';
  mostrarFormularioMeta: boolean = false;

  // Raw data devuelta: array con dos objetos (Periodo 'actual' y 'anterior')
  metaData: any[] = [];
  actualMeta: any | null = null;
  prevMeta: any | null = null;

  // Filas para la tabla comparativa
  variationRows: Array<{
    label: string;
    key: string;
    actual: number;
    previous: number;
    variation: number | null; // porcentaje, null si N/A
  }> = [];

  // Mapeo clave → etiqueta para mostrar
  private metricLabels: { [key: string]: string } = {
    Clientes_7d: 'Clientes ≤ 7 días',
    Cartera_7d: 'Cartera ≤ 7 días',
    Cartera_8d: 'Cartera ≥ 8 días',
    Mora_8d: 'Mora 8 días',
    Credito_Promedio: 'Crédito Promedio',
    Desembolsos_Nuevos_Num: 'Nº Desembolsos Nuevos',
    Desembolsos_Nuevos_Monto: 'Monto Desembolsos Nuevos',
  };

  constructor(
    private asignacionMetasService: AsignacionMetasService,
    private productividadService: ProductividadService,
  ) {}

  ngOnInit(): void {
    this.productividadService.getAnalistas().subscribe(
      (data) => {
        this.analistas = data;
        this.loadMetas();
      },
      (error) => {
        console.error('Error cargando analistas', error);
        this.analistas = [];
        this.loadMetas();
      }
    );
  }

  // Getter para TipoMeta en literal si hace falta
  get tipoMetaLiteral(): 'MENSUAL' | 'SEMANAL' {
    return this.activeTab.toUpperCase() as 'MENSUAL' | 'SEMANAL';
  }

  // Getter para TipoMeta en char ('M'|'S') esperado por el servicio
  get tipoMetaChar(): 'M' | 'S' {
    return this.activeTab === 'mensual' ? 'M' : 'S';
  }

  private loadMetas(): void {
    const fechaParam = this.fechaSeleccionada && this.fechaSeleccionada.trim() !== ''
      ? this.fechaSeleccionada
      : null;

    // Invocar servicio: asume firma getMetaAnalista(analistaId, fecha, tipoMeta)
    this.asignacionMetasService.getMetaAnalista(
      this.analistaSeleccionado,
      fechaParam,
      this.tipoMetaChar
    ).subscribe(
      (data) => {
        this.metaData = Array.isArray(data) ? data : (data?.resultados || []);
        this.actualMeta = this.metaData.find(item => item.Periodo === 'actual') || null;
        this.prevMeta   = this.metaData.find(item => item.Periodo === 'anterior') || null;
        this.buildVariationRows();
      },
      (error) => {
        console.error('Error al obtener metas:', error);
        this.metaData = [];
        this.actualMeta = null;
        this.prevMeta = null;
        this.variationRows = [];
      }
    );
  }

  onFilterChange(): void {
    this.mostrarFormularioMeta = false;
    this.loadMetas();
  }

  setActiveTab(tab: 'mensual' | 'semanal'): void {
    if (this.activeTab === tab) {
      return;
    }
    this.activeTab = tab;
    this.fechaSeleccionada = '';
    this.mostrarFormularioMeta = false;
    this.loadMetas();
  }

  cerrarFormularioMeta() {
    this.mostrarFormularioMeta = false;
  }

  private buildVariationRows() {
    this.variationRows = [];
    if (!this.actualMeta || !this.prevMeta) {
      return;
    }
    for (const key of Object.keys(this.metricLabels)) {
      const actualRaw = this.actualMeta[key];
      const prevRaw   = this.prevMeta[key];
      const actual = actualRaw != null ? parseFloat(actualRaw) : 0;
      const previous = prevRaw != null ? parseFloat(prevRaw) : 0;
      let variation: number | null = null;
      if (previous === 0) {
        variation = (actual === 0) ? 0 : null;
      } else {
        variation = ((actual - previous) / previous) * 100;
      }
      this.variationRows.push({
        label: this.metricLabels[key],
        key,
        actual,
        previous,
        variation
      });
    }
  }
}
