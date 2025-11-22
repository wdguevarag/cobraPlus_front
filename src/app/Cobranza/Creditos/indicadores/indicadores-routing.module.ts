import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuIndicadoresComponent } from './menu-indicadores/menu-indicadores.component';
import { ProductividadComponent } from './productividad/productividad.component';
import { IncentivosComponent } from './incentivos/incentivos.component';
import { AsignacionMetasComponent } from './asignacion-metas/asignacion-metas.component';
import { SeguimientoAvancesComponent } from './seguimiento-avances/seguimiento-avances.component';
import { NuevaMetaComponent } from './asignacion-metas/nueva-meta/nueva-meta.component';


const routes: Routes = [
  {
    path: '', 
    component: MenuIndicadoresComponent,
  },
  {
    path: 'productividad', 
    component: ProductividadComponent,
  },
  {
    path: 'incentivo', 
    component: IncentivosComponent,
  },
  {
    path: 'asignacion-de-meta', 
    component: AsignacionMetasComponent,
  },
  {
    path: 'asignacion-de-meta/nueva-meta', 
    component: NuevaMetaComponent,
  },
  {
    path: 'seguimiento-de-avance', 
    component: SeguimientoAvancesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class IndicadoresRoutingModule {}