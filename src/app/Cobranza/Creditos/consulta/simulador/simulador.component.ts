import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';

@Component({
  selector: 'app-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.scss']
})
export class SimuladorComponent implements OnInit {
  // Entradas del simulador
  prestamo: number = 0;
  periodicidadSeleccionado: string = '';
  nro_periodos!: number;
  tipo_p_gracia: string = '';
  nro_periodo_gracia!: number;
  fecha_desembolso: string = '';
  gasto_mensual!: number;

  // Salidas calculadas
  fecha_inicio: string = '';
  fecha_final: string = '';
  tea_oficial!: number;

  // Datos auxiliares
  tem_oficial: number = 2.50;
  periodicidades: { ID: number; Nombre: string }[] = [];
  cronogramaPrincipal: any[] = [];
  errores: any = {};

  constructor(
    private grupoDeDatoService: GrupoDeDatoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Fecha de desembolso por defecto: hoy
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    this.fecha_desembolso = hoy.toISOString().split('T')[0];

    // Cargar periodicidades (ID 7 según tu modelo)
    this.grupoDeDatoService
      .getDetalleGrupoDatos(7)
      .subscribe(lista => (this.periodicidades = lista));
  }

  validationsWithoutForm(): boolean {
    this.errores = {};
    if (!this.prestamo || this.prestamo <= 0) this.errores.prestamo = true;
    if (!this.periodicidadSeleccionado) this.errores.periodicidad = true;
    if (!this.nro_periodos || this.nro_periodos <= 0) this.errores.nro_periodos = true;
    if (!this.tipo_p_gracia) this.errores.tipo_p_gracia = true;
    if (this.nro_periodo_gracia === undefined || this.nro_periodo_gracia === null) this.errores.nro_periodo_gracia = true;
    if (!this.fecha_desembolso) this.errores.fecha_desembolso = true;
    if (!this.gasto_mensual || this.gasto_mensual <= 0) this.errores.gasto_mensual = true;
    if (this.nro_periodos <= this.nro_periodo_gracia) this.errores.graciaMayor = true;

    return Object.keys(this.errores).length === 0;
  }


  generarDatosCredito(): void {
    if (!this.validationsWithoutForm()) return;

    const contadorDias = this.calcularContadorDias(this.periodicidadSeleccionado);
    this.fecha_inicio = this.calcularFechaInicio(
      this.fecha_desembolso,
      this.nro_periodo_gracia,
      this.periodicidadSeleccionado,
      contadorDias
    );
    this.fecha_final = this.calcularFechaFinal(
      new Date(this.fecha_inicio + 'T00:00:00'),
      this.nro_periodos,
      this.nro_periodo_gracia,
      this.periodicidadSeleccionado,
      contadorDias
    );

    let cronograma: any[] = [];
    const constanteIgv = 0.152542373;
    const temOficial = this.tem_oficial;
    const teaOficial = Math.pow(1 + temOficial / 100, 12) - 1;
    this.tea_oficial = parseFloat((teaOficial * 100).toFixed(2));
    const tesOficial = parseFloat((Math.pow(1 + temOficial / 100, 1 / 7) - 1).toFixed(8));
    const teqOficial = parseFloat((Math.pow(1 + temOficial / 100, 1 / 15) - 1).toFixed(8));
    const tedOficial = parseFloat((Math.pow(1 + temOficial / 100, 1 / 30) - 1).toFixed(8));
    const periodosCuota = this.nro_periodos - this.nro_periodo_gracia;
    let valorCuota = 0;

    let tedTotal = 0, diariaIGV = 0, diariaGA = 0;
    let tesTotal = 0, semanalIGV = 0, semanalGA = 0;
    let teqTotal = 0, quincenalIGV = 0, quincenalGA = 0;
    const temTotal = (this.gasto_mensual + temOficial) / 100;
    let mensualIGV = 0, mensualGA = 0;

    if (this.periodicidadSeleccionado === 'SEMANAL') {
      let fecha = new Date(this.fecha_inicio + 'T00:00:00');
      let prest = this.prestamo;
      tesTotal = parseFloat((Math.pow(1 + temTotal, 1 / 7) - 1).toFixed(8));
      semanalIGV = parseFloat((constanteIgv * tesTotal).toFixed(8));
      semanalGA = parseFloat((tesTotal - tesOficial - semanalIGV).toFixed(8));

      if (this.tipo_p_gracia === 'total') {
        for (let i = 1; i <= this.nro_periodo_gracia; i++) {
          const int = prest * tesOficial;
          const igv = prest * semanalIGV;
          const ga = prest * semanalGA;
          prest += int + igv + ga;
        }
      }

      valorCuota = parseFloat(((prest * tesTotal) / (1 - Math.pow(1 + tesTotal, -periodosCuota))).toFixed(8));

      let totCap = 0, totInt = 0, totIgv = 0, totGa = 0, totAm = 0, totCu = 0;
      for (let i = 1; i <= periodosCuota; i++) {
        const intOf = prest * tesOficial;
        const igvOf = prest * semanalIGV;
        const gaOf = prest * semanalGA;
        const am = valorCuota - (gaOf + igvOf + intOf);
        const cap = prest - am;
        cronograma.push({
          nro_cuota: i,
          fecha_pago: fecha.toISOString().split('T')[0],
          capital: Number(cap.toFixed(1)),
          interes: Number(intOf.toFixed(1)),
          igv: Number(igvOf.toFixed(1)),
          gastos_adm: Number(gaOf.toFixed(1)),
          amortizado: Number(am.toFixed(1)),
          cuota_total: Number(valorCuota.toFixed(1))
        });
        totCap += 0;
        totInt += intOf; totIgv += igvOf; totGa += gaOf; totAm += am; totCu += valorCuota;
        prest = cap;

        // Avance de fecha y ajuste fines de semana
        fecha.setDate(fecha.getDate() + contadorDias);
        if (fecha.getDay() === 6) fecha.setDate(fecha.getDate() + 2);
        else if (fecha.getDay() === 0) fecha.setDate(fecha.getDate() + 1);
        // Parche feriados
        while (!this.esDiaHabil(fecha, this.periodicidadSeleccionado) || this.esFeriado(fecha)) {
          fecha.setDate(fecha.getDate() + 1);
        }
      }
      cronograma.push({
        nro_cuota: 'TOTALES',
        fecha_pago: '',
        capital: Number(totCap.toFixed(1)),
        interes: Number(totInt.toFixed(1)),
        igv: Number(totIgv.toFixed(1)),
        gastos_adm: Number(totGa.toFixed(1)),
        amortizado: Number(totAm.toFixed(1)),
        cuota_total: Number(totCu.toFixed(1))
      });

    } else if (this.periodicidadSeleccionado === 'QUINCENAL') {
      let fecha = new Date(this.fecha_inicio + 'T00:00:00');
      let prest = this.prestamo;
      teqTotal = parseFloat((Math.pow(1 + temTotal, 1 / 15) - 1).toFixed(8));
      quincenalIGV = parseFloat((constanteIgv * teqTotal).toFixed(8));
      quincenalGA = parseFloat((teqTotal - teqOficial - quincenalIGV).toFixed(8));

      if (this.tipo_p_gracia === 'total') {
        for (let i = 1; i <= this.nro_periodo_gracia; i++) {
          const int = prest * teqOficial;
          const igv = prest * quincenalIGV;
          const ga = prest * quincenalGA;
          prest += int + igv + ga;
        }
      }

      valorCuota = parseFloat(((prest * teqTotal) / (1 - Math.pow(1 + teqTotal, -periodosCuota))).toFixed(8));
      let totCap = 0, totInt = 0, totIgv = 0, totGa = 0, totAm = 0, totCu = 0;
      for (let i = 1; i <= periodosCuota; i++) {
        const intOf = prest * teqOficial;
        const igvOf = prest * quincenalIGV;
        const gaOf = prest * quincenalGA;
        const am = valorCuota - (gaOf + igvOf + intOf);
        const cap = prest - am;
        cronograma.push({
          nro_cuota: i,
          fecha_pago: fecha.toISOString().split('T')[0],
          capital: Number(cap.toFixed(1)),
          interes: Number(intOf.toFixed(1)),
          igv: Number(igvOf.toFixed(1)),
          gastos_adm: Number(gaOf.toFixed(1)),
          amortizado: Number(am.toFixed(1)),
          cuota_total: Number(valorCuota.toFixed(1))
        });
        totCap += 0;
        totInt += intOf; totIgv += igvOf; totGa += gaOf; totAm += am; totCu += valorCuota;
        prest = cap;

        fecha.setDate(fecha.getDate() + contadorDias);
        if (fecha.getDay() === 6) fecha.setDate(fecha.getDate() + 2);
        else if (fecha.getDay() === 0) fecha.setDate(fecha.getDate() + 1);
        while (!this.esDiaHabil(fecha, this.periodicidadSeleccionado) || this.esFeriado(fecha)) {
          fecha.setDate(fecha.getDate() + 1);
        }
      }
      cronograma.push({
        nro_cuota: 'TOTALES',
        fecha_pago: '',
        capital: Number(totCap.toFixed(1)),
        interes: Number(totInt.toFixed(1)),
        igv: Number(totIgv.toFixed(1)),
        gastos_adm: Number(totGa.toFixed(1)),
        amortizado: Number(totAm.toFixed(1)),
        cuota_total: Number(totCu.toFixed(1))
      });

    } else if (this.periodicidadSeleccionado === 'MENSUAL') {
      let fecha = new Date(this.fecha_inicio + 'T00:00:00');
      let prest = this.prestamo;
      mensualIGV = parseFloat((constanteIgv * temTotal).toFixed(8));
      mensualGA = parseFloat((temTotal - temOficial / 100 - mensualIGV).toFixed(8));

      if (this.tipo_p_gracia === 'total') {
        for (let i = 1; i <= this.nro_periodo_gracia; i++) {
          const int = prest * (temOficial / 100);
          const igv = prest * mensualIGV;
          const ga = prest * mensualGA;
          prest += int + igv + ga;
        }
      }

      valorCuota = parseFloat(((prest * temTotal) / (1 - Math.pow(1 + temTotal, -periodosCuota))).toFixed(8));
      let totCap = 0, totInt = 0, totIgv = 0, totGa = 0, totAm = 0, totCu = 0;
      for (let i = 1; i <= periodosCuota; i++) {
        const intOf = prest * (temOficial / 100);
        const igvOf = prest * mensualIGV;
        const gaOf = prest * mensualGA;
        const am = valorCuota - (gaOf + igvOf + intOf);
        const cap = prest - am;
        cronograma.push({
          nro_cuota: i,
          fecha_pago: fecha.toISOString().split('T')[0],
          capital: Number(cap.toFixed(1)),
          interes: Number(intOf.toFixed(1)),
          igv: Number(igvOf.toFixed(1)),
          gastos_adm: Number(gaOf.toFixed(1)),
          amortizado: Number(am.toFixed(1)),
          cuota_total: Number(valorCuota.toFixed(1))
        });
        totCap += 0;
        totInt += intOf; totIgv += igvOf; totGa += gaOf; totAm += am; totCu += valorCuota;
        prest = cap;

        fecha.setDate(fecha.getDate() + contadorDias);
        if (fecha.getDay() === 6) fecha.setDate(fecha.getDate() + 2);
        else if (fecha.getDay() === 0) fecha.setDate(fecha.getDate() + 1);
        while (!this.esDiaHabil(fecha, this.periodicidadSeleccionado) || this.esFeriado(fecha)) {
          fecha.setDate(fecha.getDate() + 1);
        }
      }
      cronograma.push({
        nro_cuota: 'TOTALES',
        fecha_pago: '',
        capital: Number(totCap.toFixed(1)),
        interes: Number(totInt.toFixed(1)),
        igv: Number(totIgv.toFixed(1)),
        gastos_adm: Number(totGa.toFixed(1)),
        amortizado: Number(totAm.toFixed(1)),
        cuota_total: Number(totCu.toFixed(1))
      });

    } else {
      // Diario L-V / L-S
      let fecha = new Date(this.fecha_inicio + 'T00:00:00');
      let prest = this.prestamo;
      tedTotal = parseFloat((Math.pow(1 + temTotal, 1 / 30) - 1).toFixed(8));
      diariaIGV = parseFloat((constanteIgv * tedTotal).toFixed(8));
      diariaGA = parseFloat((tedTotal - tedOficial - diariaIGV).toFixed(8));

      if (this.tipo_p_gracia === 'total') {
        for (let i = 1; i <= this.nro_periodo_gracia; i++) {
          const int = prest * tedOficial;
          const igv = prest * diariaIGV;
          const ga = prest * diariaGA;
          prest += int + igv + ga;
        }
      }

      valorCuota = parseFloat(((prest * tedTotal) / (1 - Math.pow(1 + tedTotal, -periodosCuota))).toFixed(8));
      let totCap = 0, totInt = 0, totIgv = 0, totGa = 0, totAm = 0, totCu = 0;
      for (let i = 1; i <= periodosCuota; i++) {
        const intOf = prest * tedOficial;
        const igvOf = prest * diariaIGV;
        const gaOf = prest * diariaGA;
        const am = valorCuota - (gaOf + igvOf + intOf);
        const cap = prest - am;
        cronograma.push({
          nro_cuota: i,
          fecha_pago: fecha.toISOString().split('T')[0],
          capital: Number(cap.toFixed(1)),
          interes: Number(intOf.toFixed(1)),
          igv: Number(igvOf.toFixed(1)),
          gastos_adm: Number(gaOf.toFixed(1)),
          amortizado: Number(am.toFixed(1)),
          cuota_total: Number(valorCuota.toFixed(1))
        });
        totCap += 0;
        totInt += intOf; totIgv += igvOf; totGa += gaOf; totAm += am; totCu += valorCuota;
        prest = cap;

        fecha.setDate(fecha.getDate() + 1);
        const diasNoValidos = this.periodicidadSeleccionado === 'DIARIO (L-V)' ? [0, 6] : [0];
        while (diasNoValidos.includes(fecha.getDay())) {
          fecha.setDate(fecha.getDate() + 1);
        }
        while (!this.esDiaHabil(fecha, this.periodicidadSeleccionado) || this.esFeriado(fecha)) {
          fecha.setDate(fecha.getDate() + 1);
        }
      }
      cronograma.push({
        nro_cuota: 'TOTALES',
        fecha_pago: '',
        capital: Number(totCap.toFixed(1)),
        interes: Number(totInt.toFixed(1)),
        igv: Number(totIgv.toFixed(1)),
        gastos_adm: Number(totGa.toFixed(1)),
        amortizado: Number(totAm.toFixed(1)),
        cuota_total: Number(totCu.toFixed(1))
      });
    }

    this.cronogramaPrincipal = [...cronograma];
    this.cdr.detectChanges();
  }

  calcularContadorDias(periodicidad: string): number {
    switch (periodicidad) {
      case 'DIARIO (L-V)':
      case 'DIARIO (L-S)': return 1;
      case 'SEMANAL':      return 7;
      case 'QUINCENAL':    return 15;
      case 'MENSUAL':      return 30;
      default:             return 1;
    }
  }


// NO INCLUYENDO FERIADOS
/*
    calcularFechaInicio(fechaBase: string, diasGracia: number, periodicidad: string, contadorDias: number): string {
      const partes = fechaBase.split('-');
      const fecha = new Date(+partes[0], +partes[1] - 1, +partes[2]);
      let cont = 0;
      if (diasGracia === 0) diasGracia = 1;
      while (cont < diasGracia) {
        fecha.setDate(fecha.getDate() + contadorDias);
        cont++;
      }
      // Ajuste fines de semana (igual al tuyo):
      if (fecha.getDay() === 0) fecha.setDate(fecha.getDate() + 1);
      else if (periodicidad === 'DIARIO (L-V)' && fecha.getDay() === 5) fecha.setDate(fecha.getDate() + 3);
      else if (periodicidad === 'DIARIO (L-S)' && fecha.getDay() === 5) fecha.setDate(fecha.getDate() + 1);
      else if (periodicidad === 'DIARIO (L-S)' && fecha.getDay() === 6) fecha.setDate(fecha.getDate() + 2);
      else if (fecha.getDay() === 5) fecha.setDate(fecha.getDate() + 3);
      else if (fecha.getDay() === 6) fecha.setDate(fecha.getDate() + 2);
      // **Parche feriados**:
      while (!this.esDiaHabil(fecha, periodicidad) || this.esFeriado(fecha)) {
        fecha.setDate(fecha.getDate() + 1);
      }
      return this.formatDate(fecha);
    }
*/


    // 1) Función calcularFechaInicio con parche mínimo para feriados
    calcularFechaInicio(
        fechaBase: string,
        diasGracia: number,
        periodicidad: string,
        contadorDias: number
        ): string {
        const [yy, mm, dd] = fechaBase.split("-").map(Number);
        let fecha = new Date(yy, mm - 1, dd);

        // 1) 0 días de gracia → tratamos como 1
        if (diasGracia === 0) diasGracia = 1;

        // 2) Avanzar 'diasGracia' días
        for (let i = 0; i < diasGracia; i++) {
            fecha.setDate(fecha.getDate() + contadorDias);
        }

        const dow = fecha.getDay();

        if (periodicidad.startsWith("DIARIO")) {
            switch (dow) {
            case 0: // Domingo → Lunes
                fecha.setDate(fecha.getDate() + 1);
                break;

            case 6: // Sábado
                if (periodicidad === "DIARIO (L‑V)") {
                // en L‑V, sábado → lunes
                fecha.setDate(fecha.getDate() + 2);
                }
                // en L‑S dejamos sábado
                break;

            // **no manejamos el caso 5 (viernes)**: viernes se queda
            }
        } else {
            // SEMANAL / QUINCENAL / MENSUAL
            switch (dow) {
            case 5: // Viernes → Lunes
                fecha.setDate(fecha.getDate() + 3);
                break;
            case 6: // Sábado → Lunes
                fecha.setDate(fecha.getDate() + 2);
                break;
            case 0: // Domingo → Lunes
                fecha.setDate(fecha.getDate() + 1);
                break;
            }
        }

        // 3) Parche para feriados o días no hábiles según tu lógica
        while (!this.esDiaHabil(fecha, periodicidad) || this.esFeriado(fecha)) {
            fecha.setDate(fecha.getDate() + 1);
        }

        return this.formatDate(fecha);
    }




  calcularFechaFinal(fechaInicio: Date, nroPeriodos: number, diasGracia: number, periodicidad: string, contadorDias: number): string {
    let cont = 0;
    const cuotas = (nroPeriodos - diasGracia) - 1;
    const fecha = new Date(fechaInicio.getTime());
    while (cont < cuotas) {
      fecha.setDate(fecha.getDate() + contadorDias);
      // **Parche feriados** + fines de semana inválidos
      while (!this.esDiaHabil(fecha, periodicidad) || this.esFeriado(fecha)) {
        fecha.setDate(fecha.getDate() + 1);
      }
      cont++;
    }
    return this.formatDate(fecha);
  }


  esDiaHabil(fecha: Date, periodicidad: string): boolean {
    const d = fecha.getDay();
    if (periodicidad === 'DIARIO (L-S)') return d >= 1 && d <= 6;
    return d >= 1 && d <= 5;
  }


  formatDate(date: Date): string {
    const tz = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tz).toISOString().split('T')[0];
  }


  // MODIFICACION PARA NO INCLUIR FERIADOS


  // Lista de feriados fijos
  private feriados: { dia: number; mes: number }[] = [
    { dia: 1, mes: 1 },   // Año Nuevo
    { dia: 1, mes: 5 },   // Día del Trabajo
    { dia: 7, mes: 5 },   // Batalla de Arica
    { dia: 29, mes: 6 },  // San Pedro y San Pablo
    { dia: 23, mes: 7 },  // Día de la Fuerza Aérea
    { dia: 28, mes: 7 },  // Fiestas Patrias
    { dia: 29, mes: 7 },  // Fiestas Patrias
    { dia: 6, mes: 8 },   // Batalla de Junín
    { dia: 30, mes: 8 },  // Santa Rosa de Lima
    { dia: 8, mes: 10 },  // Combate de Angamos
    { dia: 1, mes: 11 },  // Día de Todos los Santos
    { dia: 8, mes: 12 },  // Inmaculada Concepción
    { dia: 9, mes: 12 },  // Batalla de Ayacucho
    { dia: 25, mes: 12 }  // Navidad
  ];
  // Cache para feriados móviles por año
  private feriadosMovilesCache: { [year: number]: { dia: number; mes: number }[] } = {};

  // Método para calcular fecha de Pascua (Easter Sunday)
  private calcularFechaPascua(year: number): Date {
      const a = year % 19;
      const b = Math.floor(year / 100);
      const c = year % 100;
      const d = Math.floor(b / 4);
      const e = b % 4;
      const f = Math.floor((b + 8) / 25);
      const g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30;
      const i = Math.floor(c / 4);
      const k = c % 4;
      const l = (32 + 2 * e + 2 * i - h - k) % 7;
      const m = Math.floor((a + 11 * h + 22 * l) / 451);
      const month = Math.floor((h + l - 7 * m + 114) / 31);
      const day = ((h + l - 7 * m + 114) % 31) + 1;
      return new Date(year, month - 1, day);
  }

  // Obtener Jueves Santo y Viernes Santo para un año
  private obtenerFeriadosMoviles(year: number): { dia: number; mes: number }[] {
      const easter = this.calcularFechaPascua(year);
      const jueves = new Date(easter.getTime());
      jueves.setDate(easter.getDate() - 3);
      const viernes = new Date(easter.getTime());
      viernes.setDate(easter.getDate() - 2);
      return [
        { dia: jueves.getDate(), mes: jueves.getMonth() + 1 },
        { dia: viernes.getDate(), mes: viernes.getMonth() + 1 }
      ];
  }
  private obtenerFeriadosMovilesParaAno(year: number): { dia: number; mes: number }[] {
      if (!this.feriadosMovilesCache[year]) {
          this.feriadosMovilesCache[year] = this.obtenerFeriadosMoviles(year);
      }
      return this.feriadosMovilesCache[year];
  }

  // Método esFeriado que agrupa fijos y Jueves/Viernes Santo
  private esFeriado(fecha: Date): boolean {
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    // fijos:
    if (this.feriados.some(f => f.dia === dia && f.mes === mes)) {
      return true;
    }
    // móviles:
    const year = fecha.getFullYear();
    const mov = this.obtenerFeriadosMovilesParaAno(year);
    if (mov.some(f => f.dia === dia && f.mes === mes)) {
      return true;
    }
    return false;
  }

}