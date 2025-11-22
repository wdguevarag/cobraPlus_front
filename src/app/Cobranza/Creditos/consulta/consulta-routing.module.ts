import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuConsultaComponent } from './menu-consulta/menu-consulta.component';

/*Simulador  Imports*/
import { SimuladorComponent } from './simulador/simulador.component';

/*Consulta Credito  Imports*/

import { ConsultasCreditoComponent } from './consultas-credito/consultas-credito.component';
import { SingleConsultaCreditoComponent } from './consultas-credito/single-consulta-credito/single-consulta-credito.component';

/*FIC  Imports*/
import { FicComponent } from './fic/fic.component';
import { SingleFicComponent } from './fic/single-fic/single-fic.component';

/*Comprobante Compra  Imports*/
import { ComprobanteCompraComponent } from './comprobante-compra/comprobante-compra.component';
import { SingleComprobanteCompraComponent } from './comprobante-compra/single-comprobante-compra/single-comprobante-compra.component';
import { NuevoComprobanteCompraComponent } from './comprobante-compra/nuevo-comprobante-compra/nuevo-comprobante-compra.component';

/*Ruta Del Gestor Compra  Imports*/
import { RutaDelGestorComponent } from './ruta-del-gestor/ruta-del-gestor.component';

/*Cartera Cliente Compra  Imports*/
import { CarteraDelClienteComponent } from './cartera-del-cliente/cartera-del-cliente.component';
import { SingleCreditoComponent } from './fic/single-fic/single-credito/single-credito.component';



const routes: Routes = [
  {
    path: '', 
    component: MenuConsultaComponent,
  },
  {path: 'simulador',
    component: SimuladorComponent,
   } ,
   {path: 'consulta-credito',
     component: ConsultasCreditoComponent,
   } ,
   {path: 'consulta-credito/single-consulta-credito/:id',
    component: SingleConsultaCreditoComponent,
  } ,

  {path: 'fic',
    component: FicComponent,
  },

  {path: 'fic/single-fic/:id',
    component: SingleFicComponent,
  },


  {path: 'fic/single-fic/:id/credito/:id2',
    component: SingleCreditoComponent,
  } ,
  

   {path: 'comprobante-compra',
     component: ComprobanteCompraComponent,
   } ,
   {path: 'comprobante-compra/single-comprobante-compra/:id',
    component: SingleComprobanteCompraComponent,
  } ,
  {path: 'comprobante-compra/nuevo-comprobante-compra',
    component: NuevoComprobanteCompraComponent
  } ,
  
   
   {path: 'ruta-del-gestor',
     component: RutaDelGestorComponent,
   } ,
   {path: 'cartera-del-cliente',
     component: CarteraDelClienteComponent,
   } ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class ConsultaRoutingModule {}

