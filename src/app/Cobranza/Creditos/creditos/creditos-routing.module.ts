import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuCreditosComponent } from './menu-creditos/menu-creditos.component';

/*Oficina  Imports*/

import { TrasladoCarteraComponent } from './traslado-cartera/traslado-cartera.component';

import { CastigoCarteraComponent } from './castigo-cartera/castigo-cartera.component';

import { SolicitudCreditosComponent } from './solicitud-creditos/solicitud-creditos.component';
import { SingleSolicitudCreditoComponent } from './solicitud-creditos/single-solicitud-credito/single-solicitud-credito.component';
import { NuevaSolicitudCreditoComponent } from './solicitud-creditos/nueva-solicitud-credito/nueva-solicitud-credito.component';

import { CondonacionComponent } from './condonacion/condonacion.component';

import { RefinanciacionComponent } from './refinanciacion/refinanciacion.component';
import { SingleRefinanciacionComponent } from './refinanciacion/single-refinanciacion/single-refinanciacion.component';
import { SingleCondonacionComponent } from './condonacion/single-condonacion/single-condonacion.component';


const routes: Routes = [
  {
    path: '', 
    component: MenuCreditosComponent,
  },
  {path: 'solicitud-credito',
    component: SolicitudCreditosComponent,
    } ,

    {path: 'solicitud-credito/single-solicitud-credito/:id',
      component: SingleSolicitudCreditoComponent,
    } ,

    {path: 'solicitud-credito/nueva-solicitud-credito',
      component: NuevaSolicitudCreditoComponent,
    } ,

     {path: 'traslado-cartera',
      component: TrasladoCarteraComponent,
    } ,
    {path: 'refinanciacion',
      component: RefinanciacionComponent,
    } ,
    {path: 'refinanciacion/single-refinanciacion/:id',
      component: SingleRefinanciacionComponent,
    } ,
    {path: 'castigo-cartera',
      component: CastigoCarteraComponent,
    } ,
    {path: 'condonacion',
      component: CondonacionComponent,
    } ,
    {path: 'condonacion/single-condonacion/:id',
      component: SingleCondonacionComponent,
    } ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class CreditosRoutingModule {}
