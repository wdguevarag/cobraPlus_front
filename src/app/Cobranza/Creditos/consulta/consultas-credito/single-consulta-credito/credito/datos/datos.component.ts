import { Component, Input } from '@angular/core';
import { CreditoService } from 'src/app/Services/creditos.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss'
})
export class DatosComponent {

  @Input() credito_id!: number;
  creditoData: any = {};

  constructor(private creditoService: CreditoService) {}

  ngOnInit(): void {
    this.obtenerDatosCredito();
  }

  obtenerDatosCredito(): void {
    this.creditoService.getCreditosTransferenciaUsuarioOficina(this.credito_id).subscribe(
      (data) => {
        this.creditoData = data;
        console.log("creditoData", this.creditoData);
      },
      (error) => {
        console.error('Error al obtener los datos del cronograma', error);
      }
    );
  }
}
