import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuEmpresaComponent } from './menu-empresa/menu-empresa.component';

/*Oficina  Imports*/
import { ReportesComponent } from './reportes/reportes.component';


const routes: Routes = [
  {
    path: '', 
    component: MenuEmpresaComponent,
  },
  {path: 'reporte',
    component: ReportesComponent,
  } ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class EmpresaRoutingModule {}
