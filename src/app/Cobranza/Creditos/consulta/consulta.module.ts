import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaComponent } from './consulta.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuConsultaComponent } from './menu-consulta/menu-consulta.component';
import { SimuladorComponent } from './simulador/simulador.component';

import { ConsultasCreditoComponent } from './consultas-credito/consultas-credito.component';
import { SingleConsultaCreditoComponent } from './consultas-credito/single-consulta-credito/single-consulta-credito.component';
import { DatosComponent } from './consultas-credito/single-consulta-credito/credito/datos/datos.component';
import { CuotasCanceladasComponent } from './consultas-credito/single-consulta-credito/credito/cuotas-canceladas/cuotas-canceladas.component';
import { DeudaCalendarioComponent } from './consultas-credito/single-consulta-credito/credito/deuda-calendario/deuda-calendario.component';
import { DeudaFechaComponent } from './consultas-credito/single-consulta-credito/credito/deuda-fecha/deuda-fecha.component';
import { EstadoCuentaComponent } from './consultas-credito/single-consulta-credito/credito/estado-cuenta/estado-cuenta.component';
import { KardexComponent } from './consultas-credito/single-consulta-credito/credito/kardex/kardex.component';

import { ComprobanteCompraComponent } from './comprobante-compra/comprobante-compra.component';
import { SingleComprobanteCompraComponent } from './comprobante-compra/single-comprobante-compra/single-comprobante-compra.component';
import { NuevoComprobanteCompraComponent } from './comprobante-compra/nuevo-comprobante-compra/nuevo-comprobante-compra.component';

import { RutaDelGestorComponent } from './ruta-del-gestor/ruta-del-gestor.component';
import { CarteraDelClienteComponent } from './cartera-del-cliente/cartera-del-cliente.component';
import { FicComponent } from './fic/fic.component';
import { SingleFicComponent } from './fic/single-fic/single-fic.component';
import { SingleCreditoComponent } from './fic/single-fic/single-credito/single-credito.component';
import { MantenimientoModule } from '../mantenimiento/mantenimiento.module';

@NgModule({
  declarations: [
    ConsultaComponent,
    MenuConsultaComponent,
    SimuladorComponent,
    ConsultasCreditoComponent,
    SingleConsultaCreditoComponent,
    DatosComponent,
    CuotasCanceladasComponent,
    DeudaCalendarioComponent,
    DeudaFechaComponent,
    EstadoCuentaComponent,
    KardexComponent,
    ComprobanteCompraComponent,
    SingleComprobanteCompraComponent,
    NuevoComprobanteCompraComponent,
    RutaDelGestorComponent,
    CarteraDelClienteComponent,
    FicComponent,
    SingleFicComponent,
    SingleCreditoComponent
  ],
  imports: [CommonModule, ConsultaRoutingModule, SharedModule, MatTabsModule, MantenimientoModule],
  exports: [DeudaCalendarioComponent, SingleFicComponent]
})
export class ConsultaModule {}
