import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuOperacionesComponent } from './menu-operaciones/menu-operaciones.component';

import { PagoComponent } from './pago/pago.component';
import { NuevoPagoComponent } from './pago/nuevo-pago/nuevo-pago.component';

import { DesembolsoComponent } from './desembolso/desembolso.component';
import { SingleDesembolsoComponent } from './desembolso/single-desembolso/single-desembolso.component';


import { ExtornoComponent } from './extorno/extorno.component';

import { PagoCancelacionComponent } from './pago-cancelacion/pago-cancelacion.component';
import { SinglePagoCancelacionComponent } from './pago-cancelacion/single-pago-cancelacion/single-pago-cancelacion.component';

import { ProyeccionDesembolsoComponent } from './proyeccion-desembolso/proyeccion-desembolso.component';
import { NuevaProyeccionDesembolsoComponent } from './proyeccion-desembolso/nueva-proyeccion-desembolso/nueva-proyeccion-desembolso.component';

import { TransferenciasComponent } from './transferencias/transferencias.component';


import { CampaniasComponent } from './campanias/campanias.component';
import { NuevaCampaniaComponent } from './campanias/nueva-campania/nueva-campania.component';
import { SingleCampaniaComponent } from './campanias/single-campania/single-campania.component';

import { DepositosBancosComponent } from './depositos-bancos/depositos-bancos.component';
import { NuevoDepositoBancoComponent } from './depositos-bancos/nuevo-deposito-banco/nuevo-deposito-banco.component';
import { SingleTransferenciaComponent } from './transferencias/single-transferencia/single-transferencia.component';
import { SingleDepositoBancoComponent } from './depositos-bancos/single-deposito-banco/single-deposito-banco.component';
import { SinglePagoComponent } from './pago/single-pago/single-pago.component';
import { SingleExtornoComponent } from './extorno/single-extorno/single-extorno.component';

const routes: Routes = [
  {
    path: '',
    component: MenuOperacionesComponent,
  },
  {
    path: 'pago',
    component: PagoComponent,
  },
  {
    path: 'pago/single-pago/:id',
    component: SinglePagoComponent,
  },
  {
    path: 'pago/nuevo-pago/:id',
    component: NuevoPagoComponent,
  },

  {
    path: 'desembolso',
    component: DesembolsoComponent,
  },
  {
    path: 'desembolso/single-desembolso/:id',
    component: SingleDesembolsoComponent,
  },
  {
    path: 'deposito-bancario',
    component: DepositosBancosComponent,
  },
  {
    path: 'deposito-bancario/single-deposito-banco/:id',
    component: SingleDepositoBancoComponent,
  },
  {
    path: 'deposito-bancario/nuevo-deposito-banco',
    component: NuevoDepositoBancoComponent,
  },
  {
    path: 'extorno',
    component: ExtornoComponent,
  },
  {
    path: 'extorno/single-extorno/:id',
    component: SingleExtornoComponent,
  },
  {
    path: 'pago-cancelacion',
    component: PagoCancelacionComponent,
  },
  {
    path: 'pago-cancelacion/single-pago-cancelacion/:id',
    component: SinglePagoCancelacionComponent,
  },
  {
    path: 'proyeccion-desembolso',
    component: ProyeccionDesembolsoComponent,
  },
  {
    path: 'proyeccion-desembolso/nueva-proyeccion-desembolso',
    component: NuevaProyeccionDesembolsoComponent,
  },


  {
    path: 'transferencia',
    component: TransferenciasComponent,
  },
  {
    path: 'transferencia/single-transferencia/:id',
    component: SingleTransferenciaComponent,
  },
  {
    path: 'campaña',
    component: CampaniasComponent,
  },
  {
    path: 'campaña/nueva-campaña',
    component: NuevaCampaniaComponent,
  },
  {
    path: 'campaña/single-campaña/:id',
    component: SingleCampaniaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesRoutingModule {}
