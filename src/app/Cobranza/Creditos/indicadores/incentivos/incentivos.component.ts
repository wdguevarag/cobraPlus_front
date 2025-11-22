// src/app/Cobranza/Incentivos/incentivos.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncentivosService } from 'src/app/Services/incentivos.service';
import { ProductividadService } from 'src/app/Services/productividad.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-incentivos',
  templateUrl: './incentivos.component.html',
  styleUrl: './incentivos.component.scss'
})
export class IncentivosComponent implements OnInit {
  fechaSeleccionada = '';
  analistas: any[] = [];
  analistaSeleccionado: number | null = null;

  incentivoData: any[] = [];
  incentivoActualList: any[] = [];
  incentivoAnteriorList: any[] = [];

  // Incentivo calculado para resumen de analista seleccionado
  incentivoCalculadoActual: any = null;
  incentivoCalculadoAnterior: any = null;
  periodoActivo: 'actual' | 'anterior' = 'actual';

  bonoTotal = 0;
  mostrarImagen = false;

  // Totales para la tabla de todos los analistas
  totalBonoTotalActual = 0;
  totalAceleracionActual = 0;
  totalBonoFinalActual = 0;

  totalBonoTotalAnterior = 0;
  totalAceleracionAnterior = 0;
  totalBonoFinalAnterior = 0;

  constructor(
    private productividadService: ProductividadService,
    private incentivosService: IncentivosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productividadService.getAnalistas().subscribe(
      lista => {
        this.analistas = lista;
        this.onFilterChange();
      },
      () => this.analistas = []
    );
  }

  toggleMostrarImagen(): void {
    this.mostrarImagen = !this.mostrarImagen;
  }

  onFilterChange(): void {
    const analista = this.analistaSeleccionado;
    const fecha = this.fechaSeleccionada || null;

    this.incentivosService.getIncentivoAnalista(analista, fecha).subscribe(data => {
      this.incentivoData = data || [];

      // Separar listas bruto
      const listaActualRaw = this.incentivoData.filter((f: any) => f.Periodo === 'actual');
      const listaAnteriorRaw = this.incentivoData.filter((f: any) => f.Periodo === 'anterior');

      // Procesar listaAnterior primero
      this.incentivoAnteriorList = listaAnteriorRaw.map((fila: any) => {
        // Para mes anterior, previo = 0
        const prevClientes = 0;
        const prevPct8d = 0;
        const incentivoObj = this.incentivosService.calcularIncentivo(
          fila.Clientes_Nuevos,
          prevClientes,
          fila.Porcentaje_Mora_8d,
          prevPct8d,
          fila.Fecha,
          ''
        );
        const aceler = (incentivoObj.Incentivo_Clientes_Nuevos ?? 0) + (incentivoObj.Incentivo_Mora_8d ?? 0);
        return {
          ...fila,
          BonoTotal: 0,
          Aceleracion: aceler,
          BonoFinal: 0 + aceler,
          _incentivoObj: incentivoObj
        };
      });

      // Procesar listaActual emparejando con anterior por Nombre (o ID si tienes)
      this.incentivoActualList = listaActualRaw.map((fila: any) => {
        const anteriorFila = this.incentivoAnteriorList.find((a: any) => {
          // Cambia a a.ID === fila.ID si dispones de ID
          return a.Nombre === fila.Nombre;
        });
        const prevClientes = anteriorFila ? anteriorFila.Clientes_Nuevos : 0;
        const prevPct8d = anteriorFila ? anteriorFila.Porcentaje_Mora_8d : 0;
        const prevFecha = anteriorFila ? anteriorFila.Fecha : '';
        const incentivoObj = this.incentivosService.calcularIncentivo(
          fila.Clientes_Nuevos,
          prevClientes,
          fila.Porcentaje_Mora_8d,
          prevPct8d,
          fila.Fecha,
          prevFecha
        );
        const aceler = (incentivoObj.Incentivo_Clientes_Nuevos ?? 0) + (incentivoObj.Incentivo_Mora_8d ?? 0);
        return {
          ...fila,
          BonoTotal: 0,
          Aceleracion: aceler,
          BonoFinal: 0 + aceler,
          _incentivoObj: incentivoObj
        };
      });

      // Calcular totales mes actual
      this.totalBonoTotalActual = this.incentivoActualList.reduce((sum, row) => sum + (row.BonoTotal ?? 0), 0);
      this.totalAceleracionActual = this.incentivoActualList.reduce((sum, row) => sum + (row.Aceleracion ?? 0), 0);
      this.totalBonoFinalActual    = this.incentivoActualList.reduce((sum, row) => sum + (row.BonoFinal ?? 0), 0);

      // Calcular totales mes anterior
      this.totalBonoTotalAnterior = this.incentivoAnteriorList.reduce((sum, row) => sum + (row.BonoTotal ?? 0), 0);
      this.totalAceleracionAnterior = this.incentivoAnteriorList.reduce((sum, row) => sum + (row.Aceleracion ?? 0), 0);
      this.totalBonoFinalAnterior    = this.incentivoAnteriorList.reduce((sum, row) => sum + (row.BonoFinal ?? 0), 0);

      // Lógica existente de resumen para analista seleccionado
      const actualRaw = listaActualRaw.find((f: any) => f.Nombre === 'Todos') || listaActualRaw[0];
      const anteriorRaw = listaAnteriorRaw.find((f: any) => f.Nombre === 'Todos') || listaAnteriorRaw[0];
      if (actualRaw && anteriorRaw) {
        this.incentivoCalculadoActual = this.incentivosService.calcularIncentivo(
          actualRaw.Clientes_Nuevos,
          anteriorRaw.Clientes_Nuevos,
          actualRaw.Porcentaje_Mora_8d,
          anteriorRaw.Porcentaje_Mora_8d,
          actualRaw.Fecha,
          anteriorRaw.Fecha
        );
        this.incentivoCalculadoAnterior = this.incentivosService.calcularIncentivo(
          anteriorRaw.Clientes_Nuevos,
          0,
          anteriorRaw.Porcentaje_Mora_8d,
          0,
          anteriorRaw.Fecha,
          ''
        );
      } else {
        this.incentivoCalculadoActual = null;
        this.incentivoCalculadoAnterior = null;
      }
    }, () => {
      // En caso de error, limpiar todo
      this.incentivoData = [];
      this.incentivoActualList = [];
      this.incentivoAnteriorList = [];
      this.incentivoCalculadoActual = null;
      this.incentivoCalculadoAnterior = null;
      this.totalBonoTotalActual = this.totalAceleracionActual = this.totalBonoFinalActual = 0;
      this.totalBonoTotalAnterior = this.totalAceleracionAnterior = this.totalBonoFinalAnterior = 0;
    });
  }

  get selectedIncentivo(): any | null {
    return this.incentivoData.find(f => f.Periodo === this.periodoActivo) || null;
  }

  get incentivoActivo(): any {
    return this.periodoActivo === 'actual'
      ? this.incentivoCalculadoActual
      : this.incentivoCalculadoAnterior;
  }

  get aceleracion(): number {
    return this.incentivoActivo
      ? (this.incentivoActivo.Incentivo_Clientes_Nuevos ?? 0) + (this.incentivoActivo.Incentivo_Mora_8d ?? 0)
      : 0;
  }

  get bonoFinal(): number {
    return (this.bonoTotal ?? 0) + this.aceleracion;
  }

  get nombreSeleccionado(): string {
    if (this.analistaSeleccionado === null) return 'Todos';
    const a = this.analistas.find(x => x.ID === this.analistaSeleccionado);
    return a?.Nombre ?? '—';
  }


  descargarExcel(): void {
    // Preparar datos para “Mes Actual”
    const actualRows: any[] = this.incentivoActualList.map(fila => ({
      Analista: fila.Nombre,
      Mes: fila.Fecha,
      Periodo: fila.Periodo,
      'Clientes Nuevos': fila.Clientes_Nuevos,
      'Mora ≤7d': fila.Clientes_Mora_7d,
      'Mora ≥8d': fila.Clientes_Mora_8d,
      '% Mora ≤7d': fila.Porcentaje_Mora_7d != null
        ? `${(fila.Porcentaje_Mora_7d).toFixed(2)}%`
        : '',
      '% Mora ≥8d': fila.Porcentaje_Mora_8d != null
        ? `${(fila.Porcentaje_Mora_8d).toFixed(2)}%`
        : '',
      'Bono Total': fila.BonoTotal,
      Aceleración: fila.Aceleracion != null
        ? Number(fila.Aceleracion.toFixed(2))
        : 0,
      'Bono Final': fila.BonoFinal != null
        ? Number(fila.BonoFinal.toFixed(2))
        : 0
    }));
    // Si se muestra totales solo cuando analistaSeleccionado === null:
    if (this.analistaSeleccionado === null && actualRows.length) {
      actualRows.push({
        Analista: 'Totales',
        Mes: '',
        Periodo: '',
        'Clientes Nuevos': '',
        'Mora ≤7d': '',
        'Mora ≥8d': '',
        '% Mora ≤7d': '',
        '% Mora ≥8d': '',
        'Bono Total': this.totalBonoTotalActual,
        Aceleración: Number(this.totalAceleracionActual.toFixed(2)),
        'Bono Final': Number(this.totalBonoFinalActual.toFixed(2))
      });
    }

    // Preparar datos para “Mes Anterior”
  const anteriorRows: any[] = this.incentivoAnteriorList.map(fila => ({
      Analista: fila.Nombre,
      Mes: fila.Fecha,
      Periodo: fila.Periodo,
      'Clientes Nuevos': fila.Clientes_Nuevos,
      'Mora ≤7d': fila.Clientes_Mora_7d,
      'Mora ≥8d': fila.Clientes_Mora_8d,
      '% Mora ≤7d': fila.Porcentaje_Mora_7d != null
        ? `${(fila.Porcentaje_Mora_7d).toFixed(2)}%`
        : '',
      '% Mora ≥8d': fila.Porcentaje_Mora_8d != null
        ? `${(fila.Porcentaje_Mora_8d).toFixed(2)}%`
        : '',
      'Bono Total': fila.BonoTotal,
      Aceleración: fila.Aceleracion != null
        ? Number(fila.Aceleracion.toFixed(2))
        : 0,
      'Bono Final': fila.BonoFinal != null
        ? Number(fila.BonoFinal.toFixed(2))
        : 0
    }));
    if (this.analistaSeleccionado === null && anteriorRows.length) {
      anteriorRows.push({
        Analista: 'Totales',
        Mes: '',
        Periodo: '',
        'Clientes Nuevos': '',
        'Mora ≤7d': '',
        'Mora ≥8d': '',
        '% Mora ≤7d': '',
        '% Mora ≥8d': '',
        'Bono Total': this.totalBonoTotalAnterior,
        Aceleración: Number(this.totalAceleracionAnterior.toFixed(2)),
        'Bono Final': Number(this.totalBonoFinalAnterior.toFixed(2))
      });
    }

    // Crear workbook y hojas
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // Hoja Mes Actual
    if (actualRows.length) {
      const wsActual = XLSX.utils.json_to_sheet(actualRows);
      XLSX.utils.book_append_sheet(wb, wsActual, 'Mes Actual');
    }
    // Hoja Mes Anterior
    if (anteriorRows.length) {
      const wsAnterior = XLSX.utils.json_to_sheet(anteriorRows);
      XLSX.utils.book_append_sheet(wb, wsAnterior, 'Mes Anterior');
    }

    // Opcional: auto ancho de columnas
    // (SheetJS no lo hace automáticamente; se podría calcular anchos basados en contenido)
    // Simple: omitir o implementar cálculo si se desea.

    // Generar buffer
    const wbout: ArrayBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
    // Nombre de archivo: por ejemplo Incentivos_YYYY-MM.xlsx usando fechaSeleccionada o Date actual
    const fechaLabel = this.fechaSeleccionada
      ? this.fechaSeleccionada
      : new Date().toISOString().slice(0,7);
    const filename = `Incentivos_${fechaLabel}.xlsx`;
    // Disparar descarga
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }

}