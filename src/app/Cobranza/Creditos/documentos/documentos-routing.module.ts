import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuDocumentosComponent } from './menu-documentos/menu-documentos.component';
import { FirmaComponent } from './firma/firma.component';
import { SingleFirmaComponent } from './firma/single-firma/single-firma.component';
import { DocumentoComponent } from './documento/documento.component';
import { SingleDocumentoComponent } from './documento/single-documento/single-documento.component';


const routes: Routes = [
  {
    path: '', 
    component: MenuDocumentosComponent,
  },
  {
    path: 'documento', 
    component: DocumentoComponent,
  },
  {
    path: 'documento/single-documento/:clienteId/:creditoId', 
    component: SingleDocumentoComponent,
  },
  {
    path: 'firma', 
    component: FirmaComponent,
  },
  
  {
    path: 'firma/single-firma/:clienteId/:creditoId', 
    component: SingleFirmaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class DocumentosRoutingModule {}