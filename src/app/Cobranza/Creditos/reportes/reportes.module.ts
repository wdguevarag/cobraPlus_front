import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ClientesMorososComponent } from './clientes-morosos/clientes-morosos.component';
import { IngresosFinancierosComponent } from './ingresos-financieros/ingresos-financieros.component';


import { ClientesActivosComponent } from './clientes-activos/clientes-activos.component';
import { PagosDiariosComponent } from './pagos-diarios/pagos-diarios.component';
import { DesembolsoComponent } from './desembolso/desembolso.component';
import { SolicitudesIngresadasComponent } from './solicitudes-ingresadas/solicitudes-ingresadas.component';
import { ChequesEmitidosComponent } from './cheques-emitidos/cheques-emitidos.component';
import { CanceladosRefinanciadosComponent } from './cancelados-refinanciados/cancelados-refinanciados.component';
import { CarteraComponent } from './cartera/cartera.component';
import { CuadreDiarioComponent } from './cuadre-diario/cuadre-diario.component';
import { CobrosDiariosComponent } from './cobros-diarios/cobros-diarios.component';
import { CancelacionRenovacionComponent } from './cancelacion-renovacion/cancelacion-renovacion.component';
import { DepositosBancosComponent } from './depositos-bancos/depositos-bancos.component';
import { ExtornoComponent } from './extorno/extorno.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';
import { SentinelComponent } from './sentinel/sentinel.component';
import { TransferenciaAsesoresComponent } from './transferencia-asesores/transferencia-asesores.component';
import { DesembolsoEfectivoComponent } from './desembolso-efectivo/desembolso-efectivo.component';
import { BoletasVentaElectronicaComponent } from './boletas-venta-electronica/boletas-venta-electronica.component';
import { FacturasCompraComponent } from './facturas-compra/facturas-compra.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { DesembolsoVendedorComponent } from './desembolso-vendedor/desembolso-vendedor.component';
import { ClientesCastigadosComponent } from './clientes-castigados/clientes-castigados.component';
import { CondonacionComponent } from './condonacion/condonacion.component';
import { BaseNegativaComponent } from './base-negativa/base-negativa.component';

@NgModule({
  declarations: [
    ReportesComponent,
    ClientesMorososComponent,
    IngresosFinancierosComponent,
    DesembolsoComponent,
    ClientesActivosComponent,
    PagosDiariosComponent,
    SolicitudesIngresadasComponent,
    ChequesEmitidosComponent,
    CanceladosRefinanciadosComponent,
    CarteraComponent,
    CuadreDiarioComponent,
    CobrosDiariosComponent,
    CancelacionRenovacionComponent,
    DepositosBancosComponent,
    ExtornoComponent,
    BaseNegativaComponent,
    TransferenciaComponent,
    SentinelComponent,
    TransferenciaAsesoresComponent,
    DesembolsoEfectivoComponent,
    BoletasVentaElectronicaComponent,
    FacturasCompraComponent,
    NotificacionComponent,
    DesembolsoVendedorComponent,
    ClientesCastigadosComponent,
    CondonacionComponent
    
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
  ]
})
export class reportesModule { }
