import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudCreditoService } from '../../../../../Services/solicitud-creditos.service';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../../Services/clientes.service';

@Component({
  selector: 'app-single-solicitud-credito',
  templateUrl: './single-solicitud-credito.component.html',
  styleUrls: ['./single-solicitud-credito.component.scss']
})
export class SingleSolicitudCreditoComponent implements OnInit {

  constructor( 
    private router: Router, 
    private route: ActivatedRoute, 
    private solicitudesCredito: SolicitudCreditoService, 
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleSolicitudCreditoId = +params.get('id')!;
      if (this.singleSolicitudCreditoId) {
        this.singleSolicitudCreditoData = this.solicitudesCredito.getSolicitudCreditoById(this.singleSolicitudCreditoId);
        console.log('Datos del cliente:', this.singleSolicitudCreditoData);

        if (this.singleSolicitudCreditoData && this.singleSolicitudCreditoData.clienteId) {
          this.clienteId = this.singleSolicitudCreditoData.clienteId;
          this.clienteData = this.clienteService.getClienteById(+this.clienteId);
          
          this.clienteRccColumns[0].contentField = this.clienteId ? `${this.clienteId}` : 'ID no disponible';
        }
        if (this.clienteData) {
          this.clienteRccData = this.clienteData.rccs;
        }
      }
    });
  }

  singleSolicitudCreditoId: number | null = null;
  singleSolicitudCreditoData: any;
  singleSolicitudCreditoTabs = [
    { title: 'Solicitud' },
    { title: 'Cliente' },
    { title: 'Evaluación' },
    { title: 'RCC' },
    { title: 'FIC' },
  ];

  ficClientesTabs = [
    { title: 'Domicilio' },
    { title: 'Negocio' },
    { title: 'Contacto' },
    { title: 'Documentos' },
  ];

  ficClientesTabs2 = [
    { title: 'Créditos' },
  ];

  clienteId: number | null = null;
  clienteData: any;

  clienteRccColumns = [
    { header: 'Cliente Id', contentField: 'ID no disponible', show: true },
    { header: 'Comentario', field: 'comentario' },
    { header: 'Ruta', field: 'ruta' },
    { header: 'Estado', field: 'estado' },
  ];

  clienteRccData: any;
}
