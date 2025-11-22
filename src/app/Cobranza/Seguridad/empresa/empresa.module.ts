import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaComponent } from './empresa.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MenuEmpresaComponent } from './menu-empresa/menu-empresa.component';


@NgModule({
  declarations: [
    EmpresaComponent,
    MenuEmpresaComponent
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    SharedModule
  ]
})
export class EmpresaModule { }
