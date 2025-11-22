import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OficialiaRoutingModule } from './oficialia-routing.module';
import { OficialiaComponent } from './oficialia.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuOficialiaComponent } from './menu-oficialia/menu-oficialia.component';
import { BaseNegativaComponent } from './base-negativa/base-negativa.component';
import { NuevaBaseNegativaComponent } from './base-negativa/nueva-base-negativa/nueva-base-negativa.component';
import { SingleBaseNegativaComponent } from './base-negativa/single-base-negativa/single-base-negativa.component';


@NgModule({
  declarations: [
    OficialiaComponent,
    MenuOficialiaComponent,
    BaseNegativaComponent,
    NuevaBaseNegativaComponent,
    SingleBaseNegativaComponent
  ],
  imports: [
    CommonModule,
    OficialiaRoutingModule,
    SharedModule
  ]
})
export class OficialiaModule { }
