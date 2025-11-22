import { Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, OnChanges, SimpleChanges  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, forkJoin, of, throwError } from 'rxjs';
import { mergeMap, map, single, startWith, catchError } from 'rxjs/operators';

import { ClienteService } from 'src/app/Services/clientes.service';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { CreditoService } from 'src/app/Services/creditos.service';
import { DocumentosCreditosService } from 'src/app/Services/documentos_creditos.service';
import { PdfGeneratorService } from 'src/app/Services/pdf-generator/pdf-generator.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/theme/shared/components/error-modal/error-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
    selector: 'app-simulacion-nuevo-credito',
    templateUrl: './simulacion-nuevo-credito.component.html',
    styleUrls: ['./simulacion-nuevo-credito.component.scss']
})
export class SimulacionNuevoCreditoComponent implements OnInit {
    @Input() singleClienteId!: number;
    @Input() solicitudValor!: string;
    @Input() creditoVigente!: string;
    @Input() deudaActiva!: number;
    @Input() estadoCredito!: string;
    @Input() idCreditoAnterior!: number;
    @Output() guardarClicked = new EventEmitter<void>();
    isProcessing = false;
    hasClickedBefore = false;

    cronogramaPrincipal: any[] = [];
    cronogramaSinTotales: any[] = [];
    asesores: any[] = [];

    deuda_activa: number = 0.00;
    estado: string = "NUEVO";

    destinoCreditoID: number = 6;
    periodicidadCreditoID: number = 7;
    destinoSeleccionado: any = null;
    prestamo: number = 0.00;
    periodicidadSeleccionado: any = null;
    nro_periodos: number;
    tipo_p_gracia: string;
    nro_periodo_gracia: number;
    fecha_desembolso: string = '';
    fecha_inicio: string = '';
    fecha_final: string = '';
    gasto_mensual: number;
    tea_oficial: number;
    tem_oficial: number = 2.50;
    avalCtrl = new FormControl('sin_aval');
    familiarCtrl = new FormControl('');
    clienteFamiliares = new BehaviorSubject<any[]>([]);
    filteredFamiliares!: Observable<any[]>;

    opcionesTipoSolicitud: { value: string, label: string }[] = [];
    tipoSolicitud: string;
    asesorSeleccionado: number = 0;

    deudaTotal: number;

    errores: any = {};

    currentUser: any ;

    periodicidades: { ID: number; Nombre: string }[] = [];


    constructor( public GrupoDeDatoService: GrupoDeDatoService, private cdr: ChangeDetectorRef, 
        private creditoService: CreditoService, public dialog: MatDialog, private clienteService: ClienteService,
        private usuarioService: UsuarioService, private router: Router, 
        private authService: AuthService ,
    ) {
    }

    ngOnInit(): void {

        this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        const fechaSistema = localStorage.getItem('fechaSistemaStorage');
        if (fechaSistema) {
            this.fecha_desembolso = fechaSistema;
        } else {
            const hoy = new Date();
            hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
            this.fecha_desembolso = hoy.toISOString().split('T')[0];
        }
        });

        this.clienteService.getClienteFamiliaresById(this.singleClienteId).subscribe(familiares => {
            console.log("familiares: ", familiares);
            this.clienteFamiliares.next(familiares);
        });

        this.filteredFamiliares = this.familiarCtrl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || ''))
        );

        this.usuarioService.getUsuariosAsesores().subscribe(asesores => {
            this.asesores = asesores;
        });

        this.GrupoDeDatoService
        .getDetalleGrupoDatos(this.periodicidadCreditoID)
        .subscribe(lista => {
            this.periodicidades = lista;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['deudaActiva'] && changes['deudaActiva'].currentValue !== undefined) {
            this.prestamo = changes['deudaActiva'].currentValue;
        }

        if (changes['solicitudValor'] && changes['solicitudValor'].currentValue !== undefined) {
            this.actualizarOpciones(changes['solicitudValor'].currentValue);
        }
        
        if (changes['estadoCredito'] && changes['estadoCredito'].currentValue !== null) {
            this.estado = changes['estadoCredito'].currentValue;
        }
    }

    actualizarOpciones(solicitudValor) {
        console.log("solicitudValor:", solicitudValor);
        if (solicitudValor === "0") {
            this.opcionesTipoSolicitud = [
                { value: 'Refinanciacion', label: 'Refinanciación' },
                { value: 'Ampliacion', label: 'Ampliación' }
            ];
        } else {
            this.opcionesTipoSolicitud = [
                { value: 'Normal', label: 'Normal' }
            ];
        }
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.clienteFamiliares.value.filter(cliente =>
          cliente.Nombres.toLowerCase().includes(filterValue)
        );
    }

    displayFamiliar(familiar: any): string {
        return familiar ? `${familiar.Nombres} ${familiar.Apellido_Paterno} ${familiar.Apellido_Materno}` : '';
    }    

    validationsWithoutForm(): boolean{

        this.errores = {};
      
        if (this.nro_periodos <= this.nro_periodo_gracia) {
          this.dialog.open(ErrorDialogComponent, {
            data: { message: 'El número de períodos debe ser mayor que el de gracia.' }
          });
          return true;
        }
        if (!this.tipoSolicitud) this.errores.tipoSolicitud = true;
        if (!this.asesorSeleccionado) this.errores.asesorSeleccionado = true;
        if (!this.destinoSeleccionado) this.errores.destino = true;
        if (!this.prestamo || this.prestamo <= 0) this.errores.prestamo = true;
        if (!this.periodicidadSeleccionado) this.errores.periodicidad = true;
        if (!this.nro_periodos || this.nro_periodos <= 0) this.errores.nro_periodos = true;
        if (!this.tipo_p_gracia) this.errores.tipo_p_gracia = true;
        if (this.nro_periodo_gracia === undefined || this.nro_periodo_gracia === null) this.errores.nro_periodo_gracia = true;
        if (!this.fecha_desembolso) this.errores.fecha_desembolso = true;
        if (!this.gasto_mensual || this.gasto_mensual <= 0) this.errores.gasto_mensual = true;
    
        return Object.keys(this.errores).length === 0;
    }

    calcularContadorDias(periodicidad: string): number {
        switch (periodicidad) {
            case "DIARIO (L-V)":
            case "DIARIO (L-S)":
                return 1;
            case "SEMANAL":
                return 7;
            case "QUINCENAL":
                return 15;
            case "MENSUAL":
                return 30;
            default:
                return 1;
        }
    }  

    
// CAMBIOS PARA CALCULAR FERIADOS



    // 1) Algoritmo para calcular Easter Sunday (algoritmo de Meeus/Jones) en TS
    private calcularFechaPascua(year: number): Date {
        // Algoritmo de Meeus/Jones para Pascua gregoriana
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
        const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Marzo, 4=Abril
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        // month-1 para Date
        return new Date(year, month - 1, day);
    }

    // 2) Obtener fechas de Jueves Santo y Viernes Santo dado el año
    private obtenerFeriadosMoviles(year: number): { dia: number; mes: number }[] {
        const easter = this.calcularFechaPascua(year);
        // Jueves Santo = Easter Sunday - 3 días
        const juevesSanto = new Date(easter.getTime());
        juevesSanto.setDate(easter.getDate() - 3);
        // Viernes Santo = Easter Sunday - 2 días
        const viernesSanto = new Date(easter.getTime());
        viernesSanto.setDate(easter.getDate() - 2);
        return [
        { dia: juevesSanto.getDate(), mes: juevesSanto.getMonth() + 1 },
        { dia: viernesSanto.getDate(), mes: viernesSanto.getMonth() + 1 }
        ];
    }

    // 3) Cacheo simple: almacena feriados móviles por año para no recalcular siempre
    private feriadosMovilesCache: { [year: number]: { dia: number; mes: number }[] } = {};

    private obtenerFeriadosMovilesParaAno(year: number): { dia: number; mes: number }[] {
        if (!this.feriadosMovilesCache[year]) {
            this.feriadosMovilesCache[year] = this.obtenerFeriadosMoviles(year);
        }
        return this.feriadosMovilesCache[year];
    }



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


    private esFeriado(fecha: Date): boolean {
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        // Primero feriados fijos
        if (this.feriados.some(f => f.dia === dia && f.mes === mes)) {
            return true;
        }
        // Luego feriados móviles (Jueves Santo y Viernes Santo) del mismo año
        const year = fecha.getFullYear();
        const moviles = this.obtenerFeriadosMovilesParaAno(year);
        if (moviles.some(f => f.dia === dia && f.mes === mes)) {
            return true;
        }
        return false;
    }

    // Mantén también tu esDiaHabil; se usa para validar fines de semana según periodicidad.
    esDiaHabil(fecha: Date, periodicidad: string): boolean {
        let diaSemana = fecha.getDay(); // 0=Dom, 1=Lun, ..., 6=Sáb
        if (periodicidad === 'DIARIO (L-S)') {
            return diaSemana >= 1 && diaSemana <= 6;
        } else {
            return diaSemana >= 1 && diaSemana <= 5;
        }
    }

    /*

        // 1) Función calcularFechaInicio con parche mínimo para feriados
        calcularFechaInicio(fechaBase: string, diasGracia: number, periodicidad: string, contadorDias: number): string {
            const partesFecha = fechaBase.split("-");
            let fecha = new Date(Number(partesFecha[0]), Number(partesFecha[1]) - 1, Number(partesFecha[2]));
            let diasContados = 0;

            if (diasGracia === 0) {
                diasContados = 0;
                diasGracia = 1;
            }
            // Avanzar días de gracia:
            while (diasContados < diasGracia) {
                fecha.setDate(fecha.getDate() + contadorDias);
                diasContados++;
            }

            // Bloque original de ajuste de fines de semana:
            if (fecha.getDay() === 0) {
                // Domingo -> Lunes
                fecha.setDate(fecha.getDate() + 1);
            } else if (periodicidad === "DIARIO (L-V)" && fecha.getDay() === 5) {
                // Viernes en L-V -> Lunes
                fecha.setDate(fecha.getDate() + 3);
            } else if (periodicidad === "DIARIO (L-S)" && fecha.getDay() === 5) {
                // Viernes en L-S -> Sábado
                fecha.setDate(fecha.getDate() + 1);
            } else if (periodicidad === "DIARIO (L-S)" && fecha.getDay() === 6) {
                // Sábado en L-S -> Lunes
                fecha.setDate(fecha.getDate() + 2);
            } else if (fecha.getDay() === 5) {
                // Viernes en otras periodicidades -> Lunes
                fecha.setDate(fecha.getDate() + 3);
            } else if (fecha.getDay() === 6) {
                // Sábado en otras periodicidades -> Lunes
                fecha.setDate(fecha.getDate() + 2);
            } // else: no cambia (setDate +0)

            // Parche mínimo: si la fecha cae en feriado o en fin de semana inválido, avanzar hasta próximo día hábil
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

    // 2) Función calcularFechaFinal con inclusión de feriados
    calcularFechaFinal(fechaInicio: Date, nroPeriodos: number, diasGracia: number, periodicidad: string, contadorDias: number): string {
        let periodosContados = 0;
        const nroCuotas = (nroPeriodos - diasGracia) - 1;
        // Clonamos la fecha para no mutar la que se pase externamente
        let fecha = new Date(fechaInicio.getTime());
        while (periodosContados < nroCuotas) {
            // Avanzar salto base
            fecha.setDate(fecha.getDate() + contadorDias);

            // Parche: si cae en feriado o fin de semana inválido, avanzar hasta fecha hábil
            while (!this.esDiaHabil(fecha, periodicidad) || this.esFeriado(fecha)) {
                fecha.setDate(fecha.getDate() + 1);
            }
            // Ahora, esta fecha es hábil y no feriado: contamos el periodo
            periodosContados++;
        }
        return this.formatDate(fecha);
    }




    actualizarPrestamoPorTipo(tipoSeleccionado: string) {
        this.tipoSolicitud = tipoSeleccionado;
        
        if (tipoSeleccionado === 'Refinanciacion') {
            this.prestamo = Number(this.deudaActiva) || 0;
        }
    }


    // 3) Función generarDatosCredito: solo modificamos dentro de cada bucle de pago para parchear feriados
    generarDatosCredito() {
        this.errores.prestamoMenor = false;

        
        // 2. Validación solo para ampliación
        if (this.tipoSolicitud === 'Ampliacion') {
            if (this.prestamo <= this.deudaActiva) {
                this.errores.prestamoMenor = true;
                return; // Detener ejecución
            }
        }

    
        console.log(this.prestamo) ;

        if (!this.validationsWithoutForm()) {
            return;
        }

        let contadorDias = this.calcularContadorDias(this.periodicidadSeleccionado);
        this.fecha_inicio = this.calcularFechaInicio(this.fecha_desembolso, this.nro_periodo_gracia, this.periodicidadSeleccionado, contadorDias);
        this.fecha_final = this.calcularFechaFinal(new Date(this.fecha_inicio + 'T00:00:00'), this.nro_periodos, this.nro_periodo_gracia, this.periodicidadSeleccionado, contadorDias);
        
        // General
        let cronograma: any[] = [];
        let constanteIgv = 0.152542373;
        let temOficial = this.tem_oficial;
        let teaOficial = Math.pow(1 + (temOficial / 100), 12) - 1;
        this.tea_oficial = parseFloat((teaOficial * 100).toFixed(2));
        let tesOficial = parseFloat((Math.pow(1 + (temOficial / 100), 1 / 7) - 1).toFixed(8));
        let teqOficial = parseFloat((Math.pow(1 + (temOficial / 100), 1 / 15) - 1).toFixed(8));
        let tedOficial = parseFloat((Math.pow(1 + (temOficial / 100), 1 / 30) - 1).toFixed(8));
        let periodosCuota = this.nro_periodos - this.nro_periodo_gracia;
        let valorCuota = 0;


        // Diarios
        let tedTotal = 0;
        let diariaIGV = 0;
        let diariaGA = 0;

        // Semanal
        let tesTotal = 0;
        let semanalIGV = 0;
        let semanalGA = 0;

        // Quincenal
        let teqTotal = 0;
        let quincenalIGV = 0;
        let quincenalGA = 0;
    
        // Mensual
        let temTotal = (this.gasto_mensual + temOficial) / 100;
        let mensualIGV = 0;
        let mensualGA = 0;

        if (this.periodicidadSeleccionado === 'SEMANAL') {
            let fechaInicio = new Date(this.fecha_inicio + 'T00:00:00');
            let prestamo = this.prestamo;
            tesTotal = parseFloat((Math.pow(1 + temTotal, 1 / 7) - 1).toFixed(8));
            semanalIGV = parseFloat((constanteIgv * tesTotal).toFixed(8));
            semanalGA = parseFloat((tesTotal - tesOficial - semanalIGV).toFixed(8));

            if (this.tipo_p_gracia === "total") {
                for (let i = 1; i <= this.nro_periodo_gracia; i++) {
                    let tempInteres = prestamo * tesOficial;
                    let tempIGV = prestamo * semanalIGV;
                    let temGA = prestamo * semanalGA;
                    prestamo = prestamo + tempInteres + tempIGV + temGA;
                }
            }

            valorCuota = parseFloat(((prestamo * tesTotal) / (1 - Math.pow(1 + tesTotal, -periodosCuota))).toFixed(8));
            let totalesCapital = 0;
            let totalesInteres = 0;
            let totalesIGV = 0;
            let totalesGA = 0;
            let totalesAmortizado = 0;
            let totalesCuota = 0;

            for (let i = 1; i <= periodosCuota; i++) {

                let interesOficial = Number((prestamo * tesOficial).toFixed(1));
                let totalIGV       = Number((prestamo * semanalIGV).toFixed(1));  
                let totalGA        = Number((prestamo * semanalGA).toFixed(1));    

                let amortizado     = Number((valorCuota - (totalGA + totalIGV + interesOficial)).toFixed(1));
                let capital        = Number((prestamo - amortizado).toFixed(1));


                // REDONDEO DE CUOTA TOTAL
                let cuota_total = Number(valorCuota.toFixed(1));


                cronograma.push({
                    nro_cuota: i,
                    fecha_pago: fechaInicio.toISOString().split("T")[0],
                    capital: Number(capital.toFixed(1)),
                    interes: Number(interesOficial.toFixed(1)),
                    igv: Number(totalIGV.toFixed(1)),
                    gastos_adm: Number(totalGA.toFixed(1)),
                    amortizado: Number(amortizado.toFixed(1)),
                    //cuota_total: Number(valorCuota.toFixed(1));
                    cuota_total: cuota_total
                });

                totalesAmortizado += amortizado;
                totalesInteres += interesOficial;
                totalesIGV += totalIGV;
                totalesGA += totalGA;
                //totalesCuota += valorCuota;
                totalesCuota += cuota_total;
                totalesCapital += 0;

                prestamo = capital;
                
                // Avanza fecha base:
                fechaInicio.setDate(fechaInicio.getDate() + contadorDias);
                // Ajuste original de fines de semana:
                if (fechaInicio.getDay() === 6) {
                    fechaInicio.setDate(fechaInicio.getDate() + 2); // Sábado -> Lunes
                } else if (fechaInicio.getDay() === 0) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1); // Domingo -> Lunes
                }
                // Parche mínimo: si cae en feriado o fin de semana inválido, avanza hasta próximo hábil
                while (!this.esDiaHabil(fechaInicio, this.periodicidadSeleccionado) || this.esFeriado(fechaInicio)) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
            }

            cronograma.push({
                nro_cuota: "TOTALES",
                fecha_pago: "",
                capital: Number(totalesCapital.toFixed(1)),
                interes: Number(totalesInteres.toFixed(1)),
                igv: Number(totalesIGV.toFixed(1)),
                gastos_adm: Number(totalesGA.toFixed(1)),
                amortizado: Number(totalesAmortizado.toFixed(1)),
                cuota_total: Number(totalesCuota.toFixed(1))
            });
            this.deudaTotal = totalesCuota;

        } else if (this.periodicidadSeleccionado === 'QUINCENAL') {
            let fechaInicio = new Date(this.fecha_inicio + 'T00:00:00');
            let prestamo = this.prestamo;
            teqTotal = parseFloat((Math.pow(1 + temTotal, 1 / 15) - 1).toFixed(8));
            quincenalIGV = parseFloat((constanteIgv * teqTotal).toFixed(8));
            quincenalGA = parseFloat((teqTotal - teqOficial - quincenalIGV).toFixed(8));

            if (this.tipo_p_gracia === "total") {
                for (let i = 1; i <= this.nro_periodo_gracia; i++) {
                    let tempInteres = prestamo * teqOficial;
                    let tempIGV = prestamo * quincenalIGV;
                    let temGA = prestamo * quincenalGA;
                    prestamo = prestamo + tempInteres + tempIGV + temGA;
                }
            }

            valorCuota = parseFloat(((prestamo * teqTotal) / (1 - Math.pow(1 + teqTotal, -periodosCuota))).toFixed(8));
            let totalesCapital = 0;
            let totalesInteres = 0;
            let totalesIGV = 0;
            let totalesGA = 0;
            let totalesAmortizado = 0;
            let totalesCuota = 0;

            for (let i = 1; i <= periodosCuota; i++) {

                let interesOficial = Number((prestamo * teqOficial).toFixed(1));
                let totalIGV       = Number((prestamo * quincenalIGV).toFixed(1));
                let totalGA        = Number((prestamo * quincenalGA).toFixed(1));
                let amortizado     = Number((valorCuota - (totalGA + totalIGV + interesOficial)).toFixed(1));
                let capital        = Number((prestamo - amortizado).toFixed(1));

                // 1) Redondeo mínimo de la cuota total
                let cuota_total = Number(valorCuota.toFixed(1));


                cronograma.push({
                    nro_cuota: i,
                    fecha_pago: fechaInicio.toISOString().split("T")[0],
                    capital: Number(capital.toFixed(1)),
                    interes: Number(interesOficial.toFixed(1)),
                    igv: Number(totalIGV.toFixed(1)),
                    gastos_adm: Number(totalGA.toFixed(1)),
                    amortizado: Number(amortizado.toFixed(1)),
                    //cuota_total: Number(valorCuota .toFixed(1)),
                    cuota_total: cuota_total
                });

                totalesAmortizado += amortizado;
                totalesInteres += interesOficial;
                totalesIGV += totalIGV;
                totalesGA += totalGA;
                //totalesCuota  += valorCuota;
                totalesCuota  += cuota_total;
                totalesCapital += 0;

                prestamo = capital;

                fechaInicio.setDate(fechaInicio.getDate() + contadorDias);
                if (fechaInicio.getDay() === 6) {
                    fechaInicio.setDate(fechaInicio.getDate() + 2);
                } else if (fechaInicio.getDay() === 0) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
                while (!this.esDiaHabil(fechaInicio, this.periodicidadSeleccionado) || this.esFeriado(fechaInicio)) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
            }

            cronograma.push({
                nro_cuota: "TOTALES",
                fecha_pago: "",
                capital: Number(totalesCapital.toFixed(1)),
                interes: Number(totalesInteres.toFixed(1)),
                igv: Number(totalesIGV.toFixed(1)),
                gastos_adm: Number(totalesGA.toFixed(1)),
                amortizado: Number(totalesAmortizado.toFixed(1)),
                cuota_total: Number(totalesCuota.toFixed(1))
            });
            this.deudaTotal = totalesCuota;

        } else if (this.periodicidadSeleccionado === 'MENSUAL') {
            let fechaInicio = new Date(this.fecha_inicio + 'T00:00:00');
            let prestamo = this.prestamo;
            mensualIGV = parseFloat((constanteIgv * temTotal).toFixed(8));
            mensualGA = parseFloat((temTotal - (temOficial / 100) - mensualIGV).toFixed(8));

            if (this.tipo_p_gracia === "total") {
                for (let i = 1; i <= this.nro_periodo_gracia; i++) {
                    let tempInteres = prestamo * (temOficial / 100);
                    let tempIGV = prestamo * mensualIGV;
                    let temGA = prestamo * mensualGA;
                    prestamo = prestamo + tempInteres + tempIGV + temGA;
                }
            }

            valorCuota = parseFloat(((prestamo * temTotal) / (1 - Math.pow(1 + temTotal, -periodosCuota))).toFixed(8));
            let totalesCapital = 0;
            let totalesInteres = 0;
            let totalesIGV = 0;
            let totalesGA = 0;
            let totalesAmortizado = 0;
            let totalesCuota = 0;
            
            for (let i = 1; i <= periodosCuota; i++) {
         
                let interesOficial = Number((prestamo * (temOficial / 100)).toFixed(1));
                let totalIGV       = Number((prestamo * mensualIGV)      .toFixed(1));
                let totalGA        = Number((prestamo * mensualGA)       .toFixed(1));
                let amortizado     = Number((valorCuota - (totalGA + totalIGV + interesOficial)).toFixed(1));
                let capital        = Number((prestamo - amortizado)      .toFixed(1));

                // 1) Redondeo mínimo de la cuota total
                let cuota_total = Number(valorCuota.toFixed(1));


                cronograma.push({
                    nro_cuota: i,
                    fecha_pago: fechaInicio.toISOString().split("T")[0],
                    capital: Number(capital.toFixed(1)),
                    interes: Number(interesOficial.toFixed(1)),
                    igv: Number(totalIGV.toFixed(1)),
                    gastos_adm: Number(totalGA.toFixed(1)),
                    amortizado: Number(amortizado.toFixed(1)),

                    //cuota_total: Number(valorCuota.toFixed(1))
                    cuota_total: cuota_total
                });

                totalesAmortizado += amortizado;
                totalesInteres += interesOficial;
                totalesIGV += totalIGV;
                totalesGA += totalGA;

                //  totalesCuota  += valorCuota;
                totalesCuota  += cuota_total;

                totalesCapital += 0;

                prestamo = capital;
                
                fechaInicio.setDate(fechaInicio.getDate() + contadorDias);
                if (fechaInicio.getDay() === 6) {
                    fechaInicio.setDate(fechaInicio.getDate() + 2);
                } else if (fechaInicio.getDay() === 0) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
                while (!this.esDiaHabil(fechaInicio, this.periodicidadSeleccionado) || this.esFeriado(fechaInicio)) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
            }

            cronograma.push({
                nro_cuota: "TOTALES",
                fecha_pago: "",
                capital: Number(totalesCapital.toFixed(1)),
                interes: Number(totalesInteres.toFixed(1)),
                igv: Number(totalesIGV.toFixed(1)),
                gastos_adm: Number(totalesGA.toFixed(1)),
                amortizado: Number(totalesAmortizado.toFixed(1)),
                cuota_total: Number(totalesCuota.toFixed(1))
            });
            this.deudaTotal = totalesCuota;

        } else {
            // Otro caso (diario u otro)
            let fechaInicio = new Date(this.fecha_inicio + 'T00:00:00');
            let prestamo = this.prestamo;
            tedTotal = parseFloat((Math.pow(1 + temTotal, 1 / 30) - 1).toFixed(8));
            diariaIGV = parseFloat((constanteIgv * tedTotal).toFixed(8));
            diariaGA = parseFloat((tedTotal - tedOficial - diariaIGV).toFixed(8));

            if (this.tipo_p_gracia === "total") {
                for (let i = 1; i <= this.nro_periodo_gracia; i++) {
                    let tempInteres = prestamo * tedOficial;
                    let tempIGV = prestamo * diariaIGV;
                    let temGA = prestamo * diariaGA;
                    prestamo = prestamo + tempInteres + tempIGV + temGA;
                }
            }

            valorCuota = parseFloat(((prestamo * tedTotal) / (1 - Math.pow(1 + tedTotal, -periodosCuota))).toFixed(8));
            let totalesCapital = 0;
            let totalesInteres = 0;
            let totalesIGV = 0;
            let totalesGA = 0;
            let totalesAmortizado = 0;
            let totalesCuota = 0;

            for (let i = 1; i <= periodosCuota; i++) {

                let interesOficial = Number((prestamo * tedOficial)         .toFixed(1));
                let totalIGV       = Number((prestamo * diariaIGV)         .toFixed(1));
                let totalGA        = Number((prestamo * diariaGA)          .toFixed(1));
                let amortizado     = Number((valorCuota - (totalGA + totalIGV + interesOficial)).toFixed(1));
                let capital        = Number((prestamo - amortizado)         .toFixed(1));

                // 1) Redondeo mínimo de la cuota total
                let cuota_total = Number(valorCuota.toFixed(1));


                cronograma.push({
                    nro_cuota: i,
                    fecha_pago: fechaInicio.toISOString().split("T")[0],
                    capital: Number(capital.toFixed(1)),
                    interes: Number(interesOficial.toFixed(1)),
                    igv: Number(totalIGV.toFixed(1)),
                    gastos_adm: Number(totalGA.toFixed(1)),
                    amortizado: Number(amortizado.toFixed(1)),

                    //cuota_total: Number(valorCuota   .toFixed(1))
                    cuota_total: cuota_total

                });

                totalesAmortizado += amortizado;
                totalesInteres += interesOficial;
                totalesIGV += totalIGV;
                totalesGA += totalGA;

                //totalesCuota     += valorCuota;
                totalesCuota     += cuota_total;
                totalesCapital += 0;

                prestamo = capital;
                
                fechaInicio.setDate(fechaInicio.getDate() + 1);
                const diasNoValidos = this.periodicidadSeleccionado === "DIARIO (L-V)" ? [0, 6] : [0];
                while (diasNoValidos.includes(fechaInicio.getDay())) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
                // Parche feriados:
                while (!this.esDiaHabil(fechaInicio, this.periodicidadSeleccionado) || this.esFeriado(fechaInicio)) {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
            }

            cronograma.push({
                nro_cuota: "TOTALES",
                fecha_pago: "",
                capital: Number(totalesCapital.toFixed(1)),
                interes: Number(totalesInteres.toFixed(1)),
                igv: Number(totalesIGV.toFixed(1)),
                gastos_adm: Number(totalesGA.toFixed(1)),
                amortizado: Number(totalesAmortizado.toFixed(1)),
                cuota_total: Number(totalesCuota.toFixed(1))
            });
            this.deudaTotal = totalesCuota;
        }

        this.cronogramaPrincipal = [...cronograma];
        this.cdr.detectChanges();
    }






    formatDate(date: Date): string {
        let tzOffset = date.getTimezoneOffset() * 60000;
        let localDate = new Date(date.getTime() - tzOffset);
        return localDate.toISOString().split('T')[0];
    }
    
    isConAvalSelected(): boolean {
        return this.avalCtrl.value === 'con_aval';
    }

    onGuardarClickSolicitudCredito(){
        console.log("creditoVigente::", this.creditoVigente);

        if (this.creditoVigente === "1") {
            this.dialog.open(ErrorDialogComponent, {
                data: { message: 'Hay un credito pendiente para este cliente.' }
            });
            return;
        }

        const selectedFamiliar: any = this.familiarCtrl.value;
        this.cronogramaSinTotales = this.cronogramaPrincipal.filter(item => item.nro_cuota !== "TOTALES");

        if (!this.validationsWithoutForm()) {
            return;
        }

        if (!this.cronogramaSinTotales || this.cronogramaSinTotales.length === 0) {
            this.dialog.open(ErrorDialogComponent, {
                data: { message: 'Debe generar el cronograma de cuotas antes de continuar.' }
            });
            return;
        }

        // Protección contra doble click
        if (this.isProcessing) return;

        // Activar protección y crear directamente
        this.isProcessing = true;
        this.crearSolicitudCredito(selectedFamiliar, this.cronogramaSinTotales);
    }

    crearSolicitudCredito(selectedFamiliar, cronogramaSinTotales) {
        if (this.avalCtrl.value === "con_aval" && (!selectedFamiliar || !selectedFamiliar.ID)){
            this.isProcessing = false; // Liberar el flag
            this.dialog.open(ErrorDialogComponent, {
                data: { message: 'Debes asignar un familiar como aval del credito solicitado.' }
            });
            return
        }

        let avalValor = 0;
        if (this.avalCtrl.value === "con_aval"){
            avalValor = 1;
        } else {
            selectedFamiliar = { ID: 0 };
        }

        this.creditoService.insertarCreditoConCronograma(this.singleClienteId, this.tipoSolicitud, 0, this.destinoSeleccionado, this.prestamo, this.deudaTotal, this.periodicidadSeleccionado, this.nro_periodos, this.tipo_p_gracia, this.nro_periodo_gracia, this.fecha_desembolso, this.fecha_inicio, this.fecha_final, this.gasto_mensual, this.tem_oficial, this.tea_oficial, cronogramaSinTotales, avalValor, selectedFamiliar.ID, this.asesorSeleccionado, this.idCreditoAnterior)
            .subscribe(response => {

                if (response) {
                    let mensaje = `Se ha creado con éxito la solicitud, Crédito ID: ${response}`;
                    let rutaRedireccion = '/creditos/credito/solicitud-credito';

                    if (this.tipoSolicitud === "Refinanciacion") {
                        mensaje = `Se ha refinanciado con éxito el crédito. Refinanciamiento ID: ${response.ID}`;
                        rutaRedireccion = '/creditos/credito/refinanciacion';
                    }

                    if (this.tipoSolicitud === "Ampliacion") {
                        mensaje = `Se ha ampliado con éxito el crédito. ${response.Mensaje}`;
                        rutaRedireccion = '/creditos/credito/solicitud-credito';
                    }

                    this.dialog.open(ErrorDialogComponent, {
                        data: { message: mensaje }
                    });

                    this.isProcessing = false;
                    this.router.navigate([rutaRedireccion]);
                } else {
                    this.dialog.open(ErrorDialogComponent, {
                        data: { message: "Hubo un problema al generar la solicitud de crédito o refinanciamiento. Intente nuevamente." }
                    });

                    this.isProcessing = false;
                }

            }, error => {
                console.error('Error al enviar datos:', error);
                this.dialog.open(ErrorDialogComponent, {
                    data: { message: "Ocurrió un error al enviar la solicitud. Verifique su conexión e intente de nuevo." }
                });

                this.isProcessing = false;
        });
    }

}


