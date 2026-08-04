import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CreditoService } from 'src/app/Services/creditos.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss'
})
export class DatosComponent {

  @Input() credito_id!: number;
  @Output() loaded = new EventEmitter<void>();
  creditoData: any = {};
  isLoading: boolean = true;

  constructor(private creditoService: CreditoService) {}

  ngOnInit(): void {
    this.obtenerDatosCredito();
  }

  obtenerDatosCredito(): void {
    this.creditoService.getCreditosTransferenciaUsuarioOficina(this.credito_id).subscribe(
      (data) => {
        this.creditoData = data;
        console.log("creditoData", this.creditoData);
        this.isLoading = false;
        this.loaded.emit();
      },
      (error) => {
        console.error('Error al obtener los datos del cronograma', error);
        this.isLoading = false;
        this.loaded.emit();
      }
    );
  }
}
