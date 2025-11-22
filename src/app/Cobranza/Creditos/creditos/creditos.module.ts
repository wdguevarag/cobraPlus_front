import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditosRoutingModule } from './creditos-routing.module';
import { CreditosComponent } from './creditos.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuCreditosComponent } from './menu-creditos/menu-creditos.component';

import { SolicitudCreditosComponent } from './solicitud-creditos/solicitud-creditos.component';
import { SingleSolicitudCreditoComponent } from './solicitud-creditos/single-solicitud-credito/single-solicitud-credito.component';
import { NuevaSolicitudCreditoComponent } from './solicitud-creditos/nueva-solicitud-credito/nueva-solicitud-credito.component';

/* Traslado Cartera Imports */
import { TrasladoCarteraComponent } from './traslado-cartera/traslado-cartera.component';

/* Castigo Cartera Imports */
import { CastigoCarteraComponent } from './castigo-cartera/castigo-cartera.component';

/* Condonacion Imports */
import { CondonacionComponent } from './condonacion/condonacion.component';

/* Refinanciacion Imports */
import { RefinanciacionComponent } from './refinanciacion/refinanciacion.component';
import { SingleRefinanciacionComponent } from './refinanciacion/single-refinanciacion/single-refinanciacion.component';
import { SimulacionNuevoCreditoComponent } from '../creditos/solicitud-creditos/nueva-solicitud-credito/simulacion-nuevo-credito/simulacion-nuevo-credito.component';
import { MantenimientoModule } from '../mantenimiento/mantenimiento.module';
import { SingleSolicitudRefinanciacion } from './refinanciacion/single-refinanciacion/solicitud-referencia/solicitud-refinanciacion.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { SingleCondonacionComponent } from './condonacion/single-condonacion/single-condonacion.component';
import { ConsultaModule } from '../consulta/consulta.module';

@NgModule({
  declarations: [
    CreditosComponent,
    MenuCreditosComponent,
    SolicitudCreditosComponent,
    SingleSolicitudCreditoComponent,
    NuevaSolicitudCreditoComponent,
    TrasladoCarteraComponent,
    CastigoCarteraComponent,
    CondonacionComponent,
    SingleCondonacionComponent,
    RefinanciacionComponent,
    SingleRefinanciacionComponent,
    SimulacionNuevoCreditoComponent,
    SingleSolicitudRefinanciacion
  ],
  imports: [
    CommonModule,
    CreditosRoutingModule,
    SharedModule,
    MantenimientoModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    ConsultaModule
  ]
})
export class CreditosModule {}
