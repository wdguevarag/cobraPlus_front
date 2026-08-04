import { Component, Input } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreditoService } from 'src/app/Services/creditos.service';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';

@Component({
  selector: 'app-estado-cuenta',
  templateUrl: './estado-cuenta.component.html',
  styleUrl: './estado-cuenta.component.scss'
})
export class EstadoCuentaComponent {
  @Input() credito_id!: number;
  cronogramaData: any = {};
  isLoading: boolean = true;

  creditoClientData : any ;

  constructor(
    private cuotasCronogramaService : CuotasCronogramaService,
    private creditoService : CreditoService,
  ) {}

  ngOnInit(): void {
    forkJoin({
      credito: this.creditoService.getCreditosAndDataClientByIdCredito(this.credito_id).pipe(
        catchError((error) => {
          console.error('Error al obtener el cliente del credito', error);
          return of(null);
        })
      ),
      cronograma: this.cuotasCronogramaService.getEstadoCuentaCronogramaByCreditoId(this.credito_id).pipe(
        catchError((error) => {
          console.error('Error al obtener los datos del kardex', error);
          return of({});
        })
      )
    }).subscribe(({ credito, cronograma }) => {
      if (Array.isArray(credito) && credito.length > 0) {
        this.creditoClientData = credito[0];
      } else {
        console.log('No se encontraron datos');
      }
      this.cronogramaData = cronograma;
      console.log(this.cronogramaData);
      this.isLoading = false;
    });
  }

  getTotal(field: string): number {
    return this.cronogramaData.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  }
}
