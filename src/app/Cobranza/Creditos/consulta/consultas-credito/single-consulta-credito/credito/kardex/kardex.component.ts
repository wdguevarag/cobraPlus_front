import { Component, Input } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  isLoading: boolean = true;

  constructor(private cuotasCronogramaService : CuotasCronogramaService) {}

  ngOnInit(): void {
    this.obtenerKardexCronograma();
  }

  obtenerKardexCronograma(): void {
    forkJoin({
      cronograma: this.cuotasCronogramaService.getKardexCronogramaByCreditoId(this.credito_id).pipe(
        catchError((error) => {
          console.error('Error al obtener los datos del kardex', error);
          return of({});
        })
      ),
      desembolso: this.cuotasCronogramaService.getInfoDesembolsoCronograma(this.credito_id).pipe(
        catchError((error) => {
          console.error('Error al obtener los datos del Desembolso', error);
          return of({});
        })
      )
    }).subscribe(({ cronograma, desembolso }) => {
      this.cronogramaData = cronograma;
      this.desembolsoData = desembolso;
      this.isLoading = false;
    });
  }

  getTotal(field: string): number {
    return this.cronogramaData.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  }
}
