import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuOficialiaComponent } from './menu-oficialia/menu-oficialia.component';
import { BaseNegativaComponent } from './base-negativa/base-negativa.component';
import { NuevaBaseNegativaComponent } from './base-negativa/nueva-base-negativa/nueva-base-negativa.component';
import { SingleBaseNegativaComponent } from './base-negativa/single-base-negativa/single-base-negativa.component';

/*Oficialia  Imports*/


const routes: Routes = [
  {
    path: '', 
    component: MenuOficialiaComponent,
  },
  {
    path: 'base-negativa', 
    component: BaseNegativaComponent,
  },
  {
    path: 'base-negativa/single-base-negativa/:id', 
    component: SingleBaseNegativaComponent,
  },
  {
    path: 'base-negativa/nueva-base-negativa', 
    component: NuevaBaseNegativaComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class OficialiaRoutingModule {}
