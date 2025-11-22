import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuMantenimientoComponent } from './menu-mantenimiento/menu-mantenimiento.component';

/*Clientes  Imports*/
import { ClientesComponent } from './clientes/clientes.component';
import { SingleClienteComponent } from './clientes/single-cliente/single-cliente.component';

/* Asesores Imports */
import { AsesoresComponent } from './asesores/asesores.component';
import { SingleAsesorComponent } from './asesores/single-asesor/single-asesor.component';
import { NuevoClienteComponent } from './clientes/nuevo-cliente/nuevo-cliente.component';



const routes: Routes = [
  {
    path: '', 
    component: MenuMantenimientoComponent,
  },
  {path: 'cliente',
    component: ClientesComponent,
  } ,
    {path: 'cliente/single-cliente/:id',
      component: SingleClienteComponent,
    } ,
    {path: 'cliente/nuevo-cliente',
      component: NuevoClienteComponent,
    } ,

    {path: 'asesor',
      component: AsesoresComponent,
    } ,
    {path: 'asesor/single-asesor/:id',
      component: SingleAsesorComponent,
    } ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class MantenimientoRoutingModule {}
