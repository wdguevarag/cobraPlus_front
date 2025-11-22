import { Component, Input } from '@angular/core';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrl: './kardex.component.scss'
})
export class KardexComponent {
  @Input() credito_id!: number;
  cronogramaData: any = {};
  desembolsoData: any = {};
  
  constructor(private cuotasCronogramaService : CuotasCronogramaService) {}

  ngOnInit(): void {
    this.obtenerKardexCronograma();
  }

  obtenerKardexCronograma(): void {
    this.cuotasCronogramaService.getKardexCronogramaByCreditoId(this.credito_id).subscribe(
      (data) => {
        this.cronogramaData = data;
        console.log(this.cronogramaData);
      },
      (error) => {
        console.error('Error al obtener los datos del kardex', error);
      }
    );

    this.cuotasCronogramaService.getInfoDesembolsoCronograma(this.credito_id).subscribe(
      (data) => {
        this.desembolsoData = data;
        console.log(this.desembolsoData);
      },
      (error) => {
        console.error('Error al obtener los datos del Desembolso', error);
      }
    );
  }

  getTotal(field: string): number {
    return this.cronogramaData.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  }
}
