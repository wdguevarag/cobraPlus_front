import { Component } from '@angular/core';

@Component({
  selector: 'app-nueva-campania',
  templateUrl: './nueva-campania.component.html',
  styleUrl: './nueva-campania.component.scss'
})
export class NuevaCampaniaComponent {
  tabs = [
    { title: 'OFERTA' },
    { title: 'FIC' },
    { title: 'CLIENTE' }
  ];
  tabs2 = [
    { title: 'DOMICILIO' },
    { title: 'NEGOCIO' },
    { title: 'CONTACTO' },
    { title: 'DOCUMENTOS' },
    { title: 'RCC' },
  ];
  tabs3 = [
    { title: 'CRÉDITOS' },
  ];
  tabs4 = [
    { title: 'DOMICILIO' },
    { title: 'NEGOCIO' },
    { title: 'CONTACTO' },
    { title: 'DOCUMENTO' },
    { title: 'FAMILIAR' },
    { title: 'CUENTAS' },
    { title: 'RCC' },

  ];
}
