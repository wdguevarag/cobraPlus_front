import { Component, OnInit } from '@angular/core';
import { IngresosFinancierosService } from 'src/app/Services/reportes-services/ingresos-financieros.service';

@Component({
  selector: 'app-ingresos-financieros',
  templateUrl: './ingresos-financieros.component.html',
  styleUrl: './ingresos-financieros.component.scss',

})
export class IngresosFinancierosComponent implements OnInit {
  ingresosData: any[] = [];
  filteredIngresosData: any[] = [];
  offices: string[] = [];

  fechaInicio: string = '';
  fechaFin: string = '';
  selectedOffice: string = '';

  // Totales
  totalInteres: number = 0;
  totalGastoAdm: number = 0;
  totalIGV: number = 0;
  totalMora: number = 0;
  totalSumatoria: number = 0;

  // Estado de carga
  loading: boolean = false;

  constructor(private ingresosFinancierosService: IngresosFinancierosService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  
  onOfficeChange(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;

    const inicio = this.fechaInicio || undefined;
    const fin = this.fechaFin || undefined;
    const oficina = this.selectedOffice || undefined;

    this.ingresosFinancierosService
      .getIngresosFinancieros(inicio, fin, oficina)
      .subscribe({
        next: (data) => {
          this.ingresosData = data;
          this.filteredIngresosData = data;
          this.offices = Array.from(new Set(data.map(d => d.Oficina_Nombre)));

          // Recalcular totales
          this.totalInteres   = data.reduce((s, d) => s + parseFloat(d.Interes_Pagado || 0), 0);
          this.totalGastoAdm  = data.reduce((s, d) => s + parseFloat(d.Gastos_Admin_Pagado || 0), 0);
          this.totalIGV       = data.reduce((s, d) => s + parseFloat(d.IGV_Pagado || 0), 0);
          this.totalMora      = data.reduce((s, d) => s + parseFloat(d.Monto_Mora_Pagado || 0), 0);
          this.totalSumatoria = data.reduce((s, d) => s + parseFloat(d.Total_Sumatoria || 0), 0);

        },
        error: (err) => console.error(err),
        complete: () => this.loading = false
      });
  }



}
