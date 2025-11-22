import { Component, Input } from '@angular/core';
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

  creditoClientData : any ;

  constructor(
    private cuotasCronogramaService : CuotasCronogramaService,
    private creditoService : CreditoService,
  ) {}

  ngOnInit(): void {
  this.creditoService.getCreditosAndDataClientByIdCredito(this.credito_id).subscribe(credito => {
    if (Array.isArray(credito) && credito.length > 0) {
      this.creditoClientData = credito[0];
    } else {
      console.log('No se encontraron datos');
    }
  });

  
    this.obtenerKardexCronograma();
  }



  obtenerKardexCronograma(): void {
    this.cuotasCronogramaService.getEstadoCuentaCronogramaByCreditoId(this.credito_id).subscribe(
      (data) => {
        this.cronogramaData = data;
        console.log(this.cronogramaData);
      },
      (error) => {
        console.error('Error al obtener los datos del kardex', error);
      }
    );
  }

  getTotal(field: string): number {
    return this.cronogramaData.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  }
}
