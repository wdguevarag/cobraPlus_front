import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuParametrosComponent } from './menu-parametros/menu-parametros.component';



/*Parametros  Imports*/
import { ParametrosSubComponent } from './parametros-sub/parametros-sub.component';
import { SingleParametroComponent } from './parametros-sub/single-parametro/single-parametro.component';
import { NuevoParametroComponent } from './parametros-sub/nuevo-parametro/nuevo-parametro.component';

/*Grupo de Datos  Imports*/
import { GrupoDeDatosComponent } from './grupo-de-datos/grupo-de-datos.component';
import { SingleGrupoDeDatoComponent } from './grupo-de-datos/single-grupo-de-dato/single-grupo-de-dato.component';
import { NuevoGrupoDeDatosComponent } from './grupo-de-datos/nuevo-grupo-de-datos/nuevo-grupo-de-datos.component';
import { NuevoDatoComponent } from './grupo-de-datos/single-grupo-de-dato/nuevo-dato/nuevo-dato.component';
import { SingleDatoComponent } from './grupo-de-datos/single-grupo-de-dato/single-dato/single-dato.component';



const routes: Routes = [
  {
    path: '',
    component: MenuParametrosComponent,
  },
  {path: 'parametro',
    component: ParametrosSubComponent,
  } ,
    {path: 'parametro/single-parametro/:id',
      component: SingleParametroComponent,
    } ,
    {path: 'parametro/nuevo-parametro',
      component: NuevoParametroComponent,
    } ,
  {path: 'grupo-de-dato',
      component: GrupoDeDatosComponent,
  } ,
    {path: 'grupo-de-dato/single-grupo-dato/:id',
      component: SingleGrupoDeDatoComponent,
    } ,
    {path: 'grupo-de-dato/nuevo-grupo-datos',
      component: NuevoGrupoDeDatosComponent,
    } ,
    {path: 'grupo-de-dato/single-grupo-dato/:id/nuevo-dato',
      component: NuevoDatoComponent,
    } ,
    {path: 'grupo-de-dato/single-grupo-dato/:id/single-dato/:id2',
      component: SingleDatoComponent,
    } ,

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule {}
