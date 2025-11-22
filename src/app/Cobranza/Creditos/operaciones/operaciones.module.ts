import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperacionesRoutingModule } from './operaciones-routing.module';
import { OperacionesComponent } from './operaciones.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuOperacionesComponent } from './menu-operaciones/menu-operaciones.component';

import { PagoComponent } from './pago/pago.component';
import { NuevoPagoComponent } from './pago/nuevo-pago/nuevo-pago.component';

import { DesembolsoComponent } from './desembolso/desembolso.component';
import { SingleDesembolsoComponent } from './desembolso/single-desembolso/single-desembolso.component';

import { ExtornoComponent } from './extorno/extorno.component';
import { SingleExtornoComponent } from './extorno/single-extorno/single-extorno.component';

import { PagoCancelacionComponent } from './pago-cancelacion/pago-cancelacion.component';
import { SinglePagoCancelacionComponent } from './pago-cancelacion/single-pago-cancelacion/single-pago-cancelacion.component';

import { ProyeccionDesembolsoComponent } from './proyeccion-desembolso/proyeccion-desembolso.component';
import { NuevaProyeccionDesembolsoComponent } from './proyeccion-desembolso/nueva-proyeccion-desembolso/nueva-proyeccion-desembolso.component';

import { TransferenciasComponent } from './transferencias/transferencias.component';
import { SingleTransferenciaComponent } from './transferencias/single-transferencia/single-transferencia.component';

import { CampaniasComponent } from './campanias/campanias.component';
import { NuevaCampaniaComponent } from './campanias/nueva-campania/nueva-campania.component';
import { SingleCampaniaComponent } from './campanias/single-campania/single-campania.component';

import { DepositosBancosComponent } from './depositos-bancos/depositos-bancos.component';
import { NuevoDepositoBancoComponent } from './depositos-bancos/nuevo-deposito-banco/nuevo-deposito-banco.component';
import { SingleDepositoBancoComponent } from './depositos-bancos/single-deposito-banco/single-deposito-banco.component';
import { SinglePagoComponent } from './pago/single-pago/single-pago.component';
import { MantenimientoModule } from '../mantenimiento/mantenimiento.module';
import { DocumentosModule } from '../documentos/documentos.module';
import { CronogramaDesembolsoComponent } from './desembolso/single-desembolso/cronograma-desembolso/cronograma-desembolso.component';
import { ConsultaModule } from '../consulta/consulta.module';

@NgModule({
  declarations: [
    OperacionesComponent,
    MenuOperacionesComponent,
    PagoComponent,
    NuevoPagoComponent,
    ExtornoComponent,
    TransferenciasComponent,
    CampaniasComponent,
    SingleCampaniaComponent,
    NuevaCampaniaComponent,
    ProyeccionDesembolsoComponent,
    PagoCancelacionComponent,
    DesembolsoComponent,
    DepositosBancosComponent,
    NuevoDepositoBancoComponent,
    NuevaProyeccionDesembolsoComponent,
    DesembolsoComponent,
    SingleDesembolsoComponent,
    SingleTransferenciaComponent,
    SinglePagoCancelacionComponent,
    SingleDepositoBancoComponent,
    SinglePagoComponent,
    SingleExtornoComponent,
    CronogramaDesembolsoComponent
  ],
  imports: [CommonModule, OperacionesRoutingModule, SharedModule, MantenimientoModule, DocumentosModule, ConsultaModule]
})
export class OperacionesModule {}
