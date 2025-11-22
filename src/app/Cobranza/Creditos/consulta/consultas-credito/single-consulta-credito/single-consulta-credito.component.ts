import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditoService } from 'src/app/Services/creditos.service';
import { DatosComponent } from './credito/datos/datos.component';


@Component({
  selector: 'app-single-consulta-credito',
  templateUrl: './single-consulta-credito.component.html',
  styleUrl: './single-consulta-credito.component.scss'
})

export class SingleConsultaCreditoComponent implements OnInit {

  creditoClientData: any;

  consultasCreditosTabs = [
    { title: 'CREDITO', value: 'Credito' },
    { title: 'CLIENTE', value: 'Cliente' }
  ];

  constructor( private route: ActivatedRoute , private creditoService: CreditoService) {}

  ngOnInit(): void {
    const creditoId = Number(this.route.snapshot.paramMap.get('id'));
    if (creditoId) {
      this.creditoService.getCreditosAndDataClientByIdCredito(creditoId).subscribe(credito => {
        if (Array.isArray(credito) && credito.length > 0) {
          this.creditoClientData = credito[0];
        } else {
          console.log('No se encontraron datos');
        }
      });
    }
  }

}