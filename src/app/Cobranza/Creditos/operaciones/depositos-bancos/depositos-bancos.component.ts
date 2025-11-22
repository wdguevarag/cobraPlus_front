import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepositosBancosService } from 'src/app/Services/depositos-bancos.service';

interface TableFilter {
  field: string;
  type: string;
  title: string;
  dateDefault?: string;
}

@Component({
  selector: 'app-depositos-bancos',
  templateUrl: './depositos-bancos.component.html',
  styleUrls: ['./depositos-bancos.component.scss']
})
export class DepositosBancosComponent implements OnInit {

  // 1) propiedad para la fecha del sistema en formato ISO
  fechaSistema: string = '';

  showConfirmPopup = false;
  actionId: number | null = null;
  actionType: 'Extornar' | null = null;

  DepositosColumns = [
    { header: 'Id', field: 'ID', show: false },
    { header: 'Fecha de Registro', field: 'Fecha_Registro', noNumeric: true },
    { header: 'Fecha de Operación', field: 'Fecha_Operacion', noNumeric: true },
    { header: 'Fecha Voucher', field: 'Fecha_Voucher', noNumeric: true },
    { header: 'N° de Operación', field: 'Operacion' , noNumeric: true},
    { header: 'Banco', field: 'Banco' },
    { header: 'Monto', field: 'Monto' },
    { header: 'Usuario', field: 'Usuario' },
    { header: 'Oficina', field: 'Oficina' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' },
    { header: 'Extorno', contentField: 'Extornar', type: 'button', btnClass: 'btn-red' }
  ];


  
  DepositosFilters = [
    { field: 'Fecha_Registro', type: 'date-start', title: 'Fecha Inicial' },
    { field: 'Fecha_Registro', type: 'date-end', title: 'Fecha Final' },
    { field: 'Banco', type: 'select', title: 'Banco' }
  ];

  DepositosData: any[] = [];

  constructor(
    private router: Router,
    private depositosBancosService: DepositosBancosService
  ) {}

  ngOnInit(): void {

    // ----- Cargar los datos -----
    this.depositosBancosService.getDepositosBancos().subscribe(
      response => {
        this.DepositosData = response;
      },
      error => console.error('Error al obtener los depósitos', error)
    );
  }

  onRowClick(event: { id: number; tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    this.router.navigate(
      [`creditos/operacion/deposito-bancario/single-deposito-banco`, event.id]
    );
  }

  onButtonClick(event: { contentField: string; id: number }): void {
    console.log('Botón pulsado:', event);
    this.actionId = event.id;
    this.actionType = event.contentField === 'Extornar' ? 'Extornar' : null;
    this.showConfirmPopup = true;
  }

  confirmAction(): void {
    if (this.actionType === 'Extornar' && this.actionId !== null) {
      this.depositosBancosService.updateDepositoBancos(this.actionId).subscribe(() => {
        this.reloadData();
      });
    }
    this.showConfirmPopup = false;
  }

  closePopup(): void {
    this.showConfirmPopup = false;
  }

  reloadData(): void {
    this.ngOnInit();
  }
}
