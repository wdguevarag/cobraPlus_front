import { Component } from '@angular/core';
import { TransferenciaAsesoresService } from 'src/app/Services/reportes-services/transferencia-asesores.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-transferencia-asesores',
  templateUrl: './transferencia-asesores.component.html',
})
export class TransferenciaAsesoresComponent {
  
  transferenciasColumns = [
    { header: 'Agencia', field: 'Agencia' },
    { header: 'Comentarios', field: 'Comentarios' },
    { header: 'Ejecutivo que Recibió el Efectivo', field: 'Ejecutivo_Recibio_Efectivo' },
    { header: 'Ejecutivo que entregó el efectivo', field: 'Ejecutivo_Entrego_Efectivo' },
    { header: 'Estado de Confirmación', field: 'Estado_Confirmacion' },
    { header: 'Efectivo', field: 'Efectivo' },
    { header: 'Fecha', field: 'Fecha' },
    { header: 'Foto de Transf.', field: 'Foto_Transferencia' },
    { header: 'Monto Entregado en Efectivo', field: 'Monto_Entregado_Efectivo' },
    { header: 'Monto Transferido', field: 'Monto_Transferido' },
    { header: 'Origen Transferencia', field: 'Origen_Transferencia' }
  ];


  transferenciasData: any[] = [];

  transferenciasFilters = [
    { field: 'Fecha_Sistema', type: 'date-start', title: 'Fecha Inicio' },
    { field: 'Fecha_Sistema', type: 'date-end', title: 'Fecha Fin' },
  ];

  constructor(
    private router: Router,
    private transferenciaAsesoresService: TransferenciaAsesoresService
  ) {}

  ngOnInit(): void {
    this.transferenciaAsesoresService.getTransferenciasAsesores().subscribe((data) => {
      this.transferenciasData = data;
    });
  }
}
