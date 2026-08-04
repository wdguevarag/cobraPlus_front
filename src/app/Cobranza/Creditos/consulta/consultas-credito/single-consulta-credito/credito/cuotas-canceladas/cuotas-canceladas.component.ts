import { Component, Input } from '@angular/core';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';

@Component({
  selector: 'app-cuotas-canceladas',
  templateUrl: './cuotas-canceladas.component.html',
  styleUrl: './cuotas-canceladas.component.scss'
})
export class CuotasCanceladasComponent {
  @Input() credito_id!: number;
  cronogramaData: any = {};
  estadoCronograma: number = 1;
  isLoading: boolean = true;

  constructor(private cuotasCronogramaService : CuotasCronogramaService) {}

  ngOnInit(): void {
    this.obtenerDatosCuotas();
  }

  obtenerDatosCuotas(): void {
    this.cuotasCronogramaService.getCuotaCronogramaByCreditIdAndEstadoCronograma(this.credito_id, this.estadoCronograma).subscribe(
      (data) => {
        this.cronogramaData = data;
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
