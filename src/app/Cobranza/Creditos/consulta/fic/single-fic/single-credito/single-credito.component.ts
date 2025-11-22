import { Component , OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { ClienteService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-single-credito',
  templateUrl: './single-credito.component.html',
  styleUrl: './single-credito.component.scss'
})
export class SingleCreditoComponent {

  creditosTabs = [
    { title: 'Datos' },
    { title: 'Cuotas Canceladas' },
    { title: 'Deuda Calendario' },
    { title: 'Deuda Fecha' },
    { title: 'Kardex' },
    { title: 'Estado de Cuenta' },
  ];

  isEditing: boolean = false ;
  clienteId : number | null = null;
  clienteData: any;

  clienteCreditoId : number | null = null;
  clienteCreditoData: any;

  constructor( private router: Router , private route: ActivatedRoute, private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clienteId = +params.get('id')!;
      this.clienteCreditoId = +params.get('id2')!;
      if (this.clienteId) {
        this.clienteData = this.clienteService.getClienteById(this.clienteId);
      }
      // if (this.clienteCreditoId && this.clienteId) {
      //   this.clienteCreditoData = this.clienteService.getCreditoById(this.clienteId , this.clienteCreditoId);
      //   console.log('Datos del dato:', this.clienteCreditoData);  
      // }
    });
  }

  toggleStatus(newStatus: string): void {
    if (this.clienteCreditoData) {
      this.clienteCreditoData.editable = newStatus;
    }
  }
}
