import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentosComponent } from './documentos.component';
import { DocumentosRoutingModule } from './documentos-routing.module';

import { MenuDocumentosComponent } from './menu-documentos/menu-documentos.component';

import { SharedModule } from 'src/app/theme/shared/shared.module';


import { FirmaComponent } from './firma/firma.component';
import { SingleFirmaComponent } from './firma/single-firma/single-firma.component';

import { DocumentoComponent } from './documento/documento.component';
import { SingleDocumentoComponent } from './documento/single-documento/single-documento.component';





@NgModule({
  declarations: [
    DocumentosComponent,
    MenuDocumentosComponent,
    FirmaComponent,
    SingleFirmaComponent,
    DocumentoComponent,
    SingleDocumentoComponent
  ],
  imports: [
    CommonModule,
    DocumentosRoutingModule,
    SharedModule,
  ],
  exports : [
    SingleDocumentoComponent
  ]
})
export class DocumentosModule { }