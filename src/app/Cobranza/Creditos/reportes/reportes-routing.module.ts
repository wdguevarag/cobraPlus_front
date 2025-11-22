import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesMorososComponent } from './clientes-morosos/clientes-morosos.component';
import { CanceladosRefinanciadosComponent } from './cancelados-refinanciados/cancelados-refinanciados.component';
import { CarteraComponent } from './cartera/cartera.component';
import { DesembolsoComponent } from './desembolso/desembolso.component';
import { IngresosFinancierosComponent } from './ingresos-financieros/ingresos-financieros.component';
import { ClientesActivosComponent } from './clientes-activos/clientes-activos.component';
import { PagosDiariosComponent } from './pagos-diarios/pagos-diarios.component';
import { SolicitudesIngresadasComponent } from './solicitudes-ingresadas/solicitudes-ingresadas.component';
import { ChequesEmitidosComponent } from './cheques-emitidos/cheques-emitidos.component';
import { CuadreDiarioComponent } from './cuadre-diario/cuadre-diario.component';
import { CobrosDiariosComponent } from './cobros-diarios/cobros-diarios.component';
import { CancelacionRenovacionComponent } from './cancelacion-renovacion/cancelacion-renovacion.component';
import { DepositosBancosComponent } from './depositos-bancos/depositos-bancos.component';
import { ExtornoComponent } from './extorno/extorno.component';
import { BaseNegativaComponent } from './base-negativa/base-negativa.component';
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

/*Reportes  Imports*/



const routes: Routes = [
  {
    path: 'cliente-moroso', 
    component: ClientesMorososComponent,
  },    
  {
    path: 'ingreso-financiero', 
    component: IngresosFinancierosComponent,
  },  
  {
    path: 'desembolso', 
    component: DesembolsoComponent,
  },  
  {
    path: 'cliente-activo', 
    component: ClientesActivosComponent,
  },  
  {
    path: 'pago-diario', 
    component: PagosDiariosComponent,
  },
  {
    path: 'solicitud-ingresada', 
    component: SolicitudesIngresadasComponent,
  },  {
    path: 'cheque-emitido', 
    component: ChequesEmitidosComponent,
  },
  {
    path: 'cancelado-refinanciado', 
    component: CanceladosRefinanciadosComponent,
  },  {
    path: 'cartera', 
    component: CarteraComponent,
  },  {
    path: 'cuadre-diario', 
    component: CuadreDiarioComponent,
  }, {
    path: 'cobro-diario', 
    component: CobrosDiariosComponent,
  }, {
    path: 'cancelacion-sin-renovacion', 
    component: CancelacionRenovacionComponent,
  }, {
    path: 'deposito-en-banco', 
    component: DepositosBancosComponent,
  }, {
    path: 'extorno', 
    component: ExtornoComponent,
  }, {
    path: 'base-negativa', 
    component: BaseNegativaComponent,
  }, {
    path: 'transferencia', 
    component: TransferenciaComponent,
  }, {
    path: 'sentinel', 
    component: SentinelComponent,
  }, {
    path: 'transferencia-entre-asesor', 
    component: TransferenciaAsesoresComponent,
  }, {
    path: 'desembolso-en-efectivo', 
    component: DesembolsoEfectivoComponent,
  }, {
    path: 'boleta-de-venta-electronica', 
    component: BoletasVentaElectronicaComponent,
  }, {
    path: 'factura-de-compra', 
    component: FacturasCompraComponent,
  }, {
    path: 'notificacion', 
    component: NotificacionComponent,
  }, {
    path: 'desembolso-vendedor', 
    component: DesembolsoVendedorComponent,
  }, {
    path: 'cliente-castigado', 
    component: ClientesCastigadosComponent,
  },{
    path: 'condonacion', 
    component: CondonacionComponent,
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class ReportesRoutingModule {}
