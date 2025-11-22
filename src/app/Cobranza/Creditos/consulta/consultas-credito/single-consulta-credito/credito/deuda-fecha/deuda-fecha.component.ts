import { Component, Input } from '@angular/core';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deuda-fecha',
  templateUrl: './deuda-fecha.component.html',
  styleUrl: './deuda-fecha.component.scss'
})
export class DeudaFechaComponent {
  @Input() credito_id!: number;
  cronogramaData: any = {};
  estadoCronograma: number = 2;

  deudaProyectada: string;
  fechaPago: string = new Date().toISOString().split('T')[0];

  constructor(private cuotasCronogramaService : CuotasCronogramaService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.obtenerDatosCuotas();
    console.log(this.getTotalSecond())
  }

  obtenerDatosCuotas(): void {
    this.cuotasCronogramaService.getCreditoCronogramaByFecha(this.fechaPago, this.credito_id, 2).subscribe(
      (data) => {
        //this.cronogramaData = data;
        this.cronogramaData =  Array.isArray(data) 
                  ? data.sort((a, b) => Number(a.Nro_Cuota) - Number(b.Nro_Cuota))
                  : [];

        console.log(this.cronogramaData);
      },
      (error) => {
        console.error('Error al obtener los datos del cronograma', error);
      }
    );
  }

  getTotal(field: string): number {
    return this.cronogramaData.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  }

  getTotalSecond(): number {
    if (!this.cronogramaData || this.cronogramaData.length === 0) {
      return 0;
    }
  
    return this.cronogramaData.reduce((total, cuota) => {
      let valor = cuota.Atraso >= 0 ? cuota.Cuota_Total : cuota.Amortizado;
      return total + (valor ? parseFloat(valor) : 0);
    }, 0);
  } 

  getTotalInteres(): number {
    if (!this.cronogramaData || this.cronogramaData.length === 0) {
      return 0;
    }
  
    return this.cronogramaData.reduce((total, cuota) => {
      let valor = cuota.Atraso >= 0 ? cuota.Interes : '0.00';
      return total + (valor ? parseFloat(valor) : 0);
    }, 0);
  }

  getTotalIgv(): number {
    if (!this.cronogramaData || this.cronogramaData.length === 0) {
      return 0;
    }
  
    return this.cronogramaData.reduce((total, cuota) => {
      let valor = cuota.Atraso >= 0 ? cuota.IGV : '0.00';
      return total + (valor ? parseFloat(valor) : 0);
    }, 0);
  }

  getTotalGastosAdm(): number {
    if (!this.cronogramaData || this.cronogramaData.length === 0) {
      return 0;
    }
  
    return this.cronogramaData.reduce((total, cuota) => {
      let valor = cuota.Atraso >= 0 ? cuota.Gastos_ADM : '0.00';
      return total + (valor ? parseFloat(valor) : 0);
    }, 0);
  }

  getTotalMora(): number {
    if (!this.cronogramaData || this.cronogramaData.length === 0) {
      return 0;
    }
  
    return this.cronogramaData.reduce((total, cuota) => {
      let valor = cuota.Atraso >= 0 ? cuota.Mora : '0.00';
      return total + (valor ? parseFloat(valor) : 0);
    }, 0);
  }

  onFechaPagoChange() {
    if (this.fechaPago) {
      console.log('Fecha seleccionada:', this.fechaPago);
      console.log(this.getTotalSecond())
      this.cuotasCronogramaService.getCreditoCronogramaByFecha(this.fechaPago, this.credito_id, 1).subscribe(
        (data) => {
          //this.cronogramaData = data;
          this.cronogramaData =  Array.isArray(data) 
                    ? data.sort((a, b) => Number(a.Nro_Cuota) - Number(b.Nro_Cuota))
                    : [];


        },
        (error) => {
          console.error('Error al actualizar la fecha de pago', error);
        }
      );
    } else {
      alert('Por favor, seleccione una fecha de pago.');
    }
  }

}
