import { Component, Input } from '@angular/core';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';

@Component({
  selector: 'app-deuda-calendario',
  templateUrl: './deuda-calendario.component.html',
  styleUrl: './deuda-calendario.component.scss'
})
export class DeudaCalendarioComponent {
  @Input() credito_id!: number;
  cronogramaData: any = {};
  estadoCronograma: number = 0;
  isLoading: boolean = true;

  constructor(private cuotasCronogramaService : CuotasCronogramaService) {}

  ngOnInit(): void {
    this.obtenerDatosCuotas();
  }


obtenerDatosCuotas(): void {
  this.cuotasCronogramaService
    .getCuotaCronogramaByCreditIdAndEstadoCronograma(this.credito_id, this.estadoCronograma)
    .subscribe(
      (data) => {
        this.cronogramaData = Array.isArray(data)
          ? data.sort((a, b) => a.Nro_Cuota - b.Nro_Cuota) // Orden de 1 a 12
          : [];
        console.log(this.cronogramaData);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los datos del cronograma', error);
        this.isLoading = false;
      }
    );
}




  getTotal(field: string): number {
    return this.cronogramaData.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  }
}
