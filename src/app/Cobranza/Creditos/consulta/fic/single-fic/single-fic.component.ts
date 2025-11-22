import { Component, Input, OnInit } from '@angular/core';
import { PAGE_URL } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../../../Services/clientes.service';
import { CreditoService } from 'src/app/Services/creditos.service';

@Component({
  selector: 'app-single-fic',
  templateUrl: './single-fic.component.html',
  styleUrl: './single-fic.component.scss'
})
export class SingleFicComponent implements OnInit {
  page_url = PAGE_URL;
  singleClienteId: number | null = null;
  singleClienteData: any = {};

  @Input() type: 'normal' | 'fic' = 'normal';
  @Input() clienteIdFromInput: number | null = null;

  ficTabs = [{ title: 'HISTORIAL DE CRÉDITOS' }, { title: 'DATOS CLIENTE' }];

  singleClienteCreditosColumns = [
    { header: 'N° Prest', field: 'ID', show: true },
    { header: 'Tipo', field: 'Tipo_Solicitud' },

    { header: 'Fecha Desembolso', field: 'Fecha_Desembolso', noNumeric: true },
    { header: 'Monto Desembolso', field: 'Monto_Desembolso' },

    { header: 'Estado', field: 'Estado_Deuda', type: 'binario', trueValue: 'CANCELADO', falseValue: 'ACTIVO' },

    { header: 'Fecha Ult. Pago', field: 'Fecha_Final_Formateado', noNumeric: true },

    { header: 'TNM %', field: 'TNM' },

    { header: 'Plazo', field: 'Plazo_Credito' },
    { header: 'Cuota', field: 'Credito_Monto_Cuota' },
    { header: 'Saldo Capital', field: 'Prestamo' },
    { header: 'Deuda', field: 'Credito_Deuda_Cuotas' },

    { header: 'Asesor', contentField: 'Asesor_Nombre + " " + Asesor_Apellido' },

    { header: 'Dias Mora', field: 'Credito_Dias_Mora' },

    { header: 'Atraso Promedio', field: 'Mora_Promedio' },
    { header: 'Atraso Maximo', field: 'Mora_Maximo' }
  ];
  singleClienteCreditosData: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private creditoService: CreditoService
  ) {}

  ngOnInit(): void {
    if (this.type === 'normal') {
      this.route.paramMap.subscribe((params) => {
        const idFromRoute = +params.get('id')!;
        if (idFromRoute) {
          this.singleClienteId = idFromRoute;
          this.loadClienteData();
        }
      });
    } else if (this.type === 'fic' && this.clienteIdFromInput) {
      this.singleClienteId = this.clienteIdFromInput;
      this.loadClienteData();
    }
  }

  private loadClienteData(): void {
    if (!this.singleClienteId) return;

    this.clienteService.getClienteById(this.singleClienteId).subscribe(
      (data) => (this.singleClienteData = data),
      (error) => console.error('Error al obtener el cliente:', error)
    );

    this.creditoService.getCreditosByCliente(this.singleClienteId).subscribe(
      (data) => (this.singleClienteCreditosData = data),
      (error) => console.error('Error al obtener los creditos del cliente:', error)
    );
  }

  onCreditoRowClick(event: { id: number; tableName?: string }): void {
    this.router.navigate(['/creditos/consulta/consulta-credito/single-consulta-credito', event.id]);
  }
}
