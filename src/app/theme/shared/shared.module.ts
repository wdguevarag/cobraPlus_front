// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CardComponent } from './components/card/card.component';
import { GeneralTableComponent } from './components/general-table/general-table.component';
import { GeneralSearchBoxComponent } from './components/general-search-box/general-search-box.component';
import { GeneralPlusCheckBtnComponent } from './components/general-plus-check-btn/general-plus-check-btn.component';
import { GeneralSelectFilterComponent } from './components/general-select-filter/general-select-filter.component';
import { GeneralTabContainerComponent } from './components/general-tab-container/general-tab-container.component';
import { GeneralMapComponent } from './components/general-map/general-map.component';
import { GeneralUploadInputImgComponent } from './components/general-upload-input-img/general-upload-input-img.component';
import { GeneralBackBtnComponent } from './components/general-back-btn/general-back-btn.component';
import { GeneralInputFileComponent } from './components/general-input-file/general-input-file.component';
import { GeneralVistaDocumentosComponent } from './components/general-vista-documentos/general-vista-documentos.component';





// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from '@ant-design/icons-angular';

// bootstrap import
import { NgbDropdownModule, NgbNavModule, NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SubmitFormComponent } from './components/submit-form/submit-form.component';
import { DocumentosCreditosTabsComponent } from './components/documentos-creditos-tabs/documentos-creditos-tabs.component';
import { SignatureInputComponent } from './components/signature-input/signature-input.component';
import { DynamicSelectComponent } from './components/dynamic-select/dynamic-select.component';
import { GeneralInputUbicacionComponent } from './components/general-input-ubicacion/general-input-ubicacion.component';

import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { DateFormatDirective } from './directives/date-format.directive';



import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { GeneralTableReportesComponent } from './components/general-table-reportes/general-table-reportes.component';
import { OnlyMayusDirective } from './directives/only-mayus.directive';
import { UniqueValueValidatorDirective } from './directives/unique-value.directive';
import { OnlyAdultDirective } from './directives/only-adult.directive';
import { FechaLimiteDirective } from './directives/date-limit-sistema.directive';


import { NgChartsModule } from 'ng2-charts';
import { GeneralTableReportComponent } from './components/table-components/general-table-report/general-table-report.component';
import { PaginatorComponent } from './components/table-components/paginator/paginator.component';
import { GeneralInputGiroNegocioComponent } from './components/general-input-giro-negocio/general-input-giro-negocio.component';
import { SearchableSelectDirective } from './directives/searchable-select.directive';
import { TableSmartComponent } from './components/table/table-smart/table-smart.component';
import { TableDumbComponent } from './components/table/table-dumb/table-dumb.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule,
    CardComponent,
    IconModule,
    GeneralTableComponent,
    GeneralSearchBoxComponent,
    GeneralPlusCheckBtnComponent,
    GeneralSelectFilterComponent,
    GeneralBackBtnComponent,
    GeneralTabContainerComponent,
    GeneralMapComponent,
    GeneralTableReportesComponent,


    GeneralTableReportComponent,
    PaginatorComponent,


    GeneralUploadInputImgComponent,
    GeneralVistaDocumentosComponent,
    GeneralInputFileComponent,
    SubmitFormComponent,
    DocumentosCreditosTabsComponent,
    SignatureInputComponent,
    DynamicSelectComponent,
    GeneralInputUbicacionComponent,

    GeneralInputGiroNegocioComponent,


    OnlyNumbersDirective,
    OnlyMayusDirective,
    DateFormatDirective,
    UniqueValueValidatorDirective,
    OnlyAdultDirective,
    FechaLimiteDirective,
    SearchableSelectDirective,


    MatTabsModule,
    MatButtonModule,


    NgChartsModule,


    TableSmartComponent,
    TableDumbComponent


    ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    SpinnerComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbCollapseModule,
    NgScrollbarModule,
    CardComponent,
    IconModule,
    GeneralTableComponent,
    GeneralSearchBoxComponent,
    GeneralPlusCheckBtnComponent,
    GeneralSelectFilterComponent,
    GeneralBackBtnComponent,
    GeneralTabContainerComponent,
    GeneralMapComponent,
    
    GeneralTableReportesComponent,

    GeneralTableReportComponent,
    PaginatorComponent,


    GeneralUploadInputImgComponent,
    GeneralVistaDocumentosComponent,
    GeneralInputFileComponent,
    SubmitFormComponent,
    DocumentosCreditosTabsComponent,
    SignatureInputComponent,
    DynamicSelectComponent,
    GeneralInputUbicacionComponent,
    GeneralInputGiroNegocioComponent,


    OnlyNumbersDirective,
    OnlyMayusDirective,
    DateFormatDirective,
    UniqueValueValidatorDirective,
    OnlyAdultDirective,
    FechaLimiteDirective,
    SearchableSelectDirective,

    TableSmartComponent,
    TableDumbComponent,




    MatTabsModule,
    MatButtonModule,

    NgChartsModule
  ],
  declarations: [SpinnerComponent]
})
export class SharedModule {}






