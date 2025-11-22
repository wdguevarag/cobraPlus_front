import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductividadService } from 'src/app/Services/productividad.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-productividad',
  templateUrl: './productividad.component.html',
  styleUrls: ['./productividad.component.scss']
})
export class ProductividadComponent implements OnInit {
  activeTab: string = 'nuevos';
  fechaSeleccionada: string = '';
  modoResumen: boolean = false;
  modoGrafico: boolean = false;

  columns = [
    { header: 'Cliente', field: 'Cliente_Nombre' },
    { header: 'Fecha', field: 'Fecha_Credito' },
    { header: 'Monto', field: 'Monto' },
    { header: 'Tipo Solicitud', field: 'Tipo_Solicitud' },
    { header: 'Total Créditos', field: 'Total_Creditos' },

  ];

  clientesNuevosData: any[] = [];
  clientesRecurrentesData: any[] = [];
  displayedData: any[] = [];

  resumenNuevos: any[] = [];
  resumenRecurrentes: any[] = [];

  graficoData: any[] = [];
  chartClientes: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  chartCapital: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  totalClientes: number = 0;
  montoTotal: number = 0;
  promedioMonto: number = 0;
  isSortedDesc: boolean = true;

  analistas: any[] = [];
  analistaSeleccionado: number | null = null;

  constructor(
    private productividadService: ProductividadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productividadService.getAnalistas().subscribe(
      lista => {
        this.analistas = lista;
        this.loadData();
      },
      err => {
        console.error('Error cargando analistas', err);
        this.analistas = [];
        this.loadData();
      }
    );
  }

  onFilterChange(): void {
    this.loadData();
    if (this.modoResumen) this.loadResumen();
    if (this.modoGrafico) this.loadGrafico();
  }

  loadData(): void {
    const analista = this.analistaSeleccionado ? Number(this.analistaSeleccionado) : null;
    const fecha = this.fechaSeleccionada || null;
    const tipo = this.activeTab === 'nuevos' ? 'N' : 'R';

    this.productividadService.getProductividadAnalistaClientes(analista, fecha, 'N').subscribe(data => {
      this.clientesNuevosData = data;
      if (this.activeTab === 'nuevos' && !this.modoResumen) this.updateMetrics();
    });

    this.productividadService.getProductividadAnalistaClientes(analista, fecha, 'R').subscribe(data => {
      this.clientesRecurrentesData = data;
      if (this.activeTab === 'recurrentes' && !this.modoResumen) this.updateMetrics();
    });

    if (this.modoResumen) this.loadResumen();
    if (this.modoGrafico) this.loadGrafico();
  }

  loadResumen(): void {
    const analista = this.analistaSeleccionado ? Number(this.analistaSeleccionado) : null;
    const fecha = this.fechaSeleccionada || null;
    const tipo = this.activeTab === 'nuevos' ? 'N' : 'R';

    this.productividadService.getProductividadAnalistaData(analista, fecha, tipo)
      .subscribe(data => {
        if (this.activeTab === 'nuevos') {
          this.resumenNuevos = data;
        } else {
          this.resumenRecurrentes = data;
        }
        this.cdr.detectChanges();
      });
  }

  loadGrafico(): void {
    const analista = this.analistaSeleccionado ? Number(this.analistaSeleccionado) : null;
    const fecha = this.fechaSeleccionada || null;
    const tipo = this.activeTab === 'nuevos' ? 'N' : 'R';

    this.productividadService.getProductividadAnalistaGrafico(analista, fecha, tipo)
      .subscribe(response => {
        const data = Object.keys(response)
          .sort()
          .map(key => ({
            fecha: response[key].Fecha,
            numClientes: response[key].data[0]?.Num_Clientes || 0,
            saldoCapital: response[key].data[0]?.Saldo_Capital_Total || 0
          }));

        this.graficoData = data;
        const fechas = data.map(d => d.fecha);
        const clientes = data.map(d => d.numClientes);
        const capitales = data.map(d => d.saldoCapital);

        this.chartClientes = {
          labels: fechas,
          datasets: [
            { data: clientes, label: 'Clientes', backgroundColor: '#808080' }
          ]
        };

        this.chartCapital = {
          labels: fechas,
          datasets: [
            { data: capitales, label: 'Monto', backgroundColor: '#808080' }
          ]
        };

        this.cdr.detectChanges();
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.updateMetrics();
    if (this.modoResumen) this.loadResumen();
    if (this.modoGrafico) this.loadGrafico();
  }

  updateMetrics(): void {
    const data = this.activeTab === 'nuevos' ? this.clientesNuevosData : this.clientesRecurrentesData;
    this.displayedData = [...data];
    this.totalClientes = data.length;
    this.montoTotal = data.reduce((sum, cliente) => sum + parseFloat(cliente.Monto || '0'), 0);
    this.promedioMonto = this.totalClientes ? this.montoTotal / this.totalClientes : 0;
    this.cdr.detectChanges();
  }

  toggleSortOrder(): void {
    this.isSortedDesc = !this.isSortedDesc;
    this.displayedData.sort((a, b) => {
      const montoA = parseFloat(a.Monto) || 0;
      const montoB = parseFloat(b.Monto) || 0;
      return this.isSortedDesc ? montoB - montoA : montoA - montoB;
    });
    this.cdr.detectChanges();
  }

  mostrarResumen(): void {
    this.modoResumen = !this.modoResumen;
    if (this.modoResumen) {
      this.modoGrafico = false; // Desactiva gráfico si activo resumen
      this.loadResumen();
    }
  }

  mostrarGrafico(): void {
    this.modoGrafico = !this.modoGrafico;
    if (this.modoGrafico) {
      this.modoResumen = false; // Desactiva resumen si activo gráfico
      this.loadGrafico();
    }
  }
}
