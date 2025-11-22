import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-documentos-creditos-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos-creditos-tabs.component.html',
  styleUrl: './documentos-creditos-tabs.component.scss'
})
export class DocumentosCreditosTabsComponent implements OnInit, OnChanges {
  // Recibimos la lista de documentos y la URL base mediante inputs
  @Input() documentos: any[] = [];
  @Input() pageUrl: string = '';

  activeTabIndex: number = 0;
  documentosGrouped: { tipo: string; docs: any[] }[] = [];

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.groupDocuments();
  }

  // Si los inputs cambian, reagrupamos los documentos
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentos'] || changes['pageUrl']) {
      this.groupDocuments();
    }
  }
  
  private groupDocuments(): void {
    const groups: { [key: string]: any[] } = {};

    // Agrupamos por el campo Tipo_Documento y generamos la URL segura
    for (const doc of this.documentos) {
      doc.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pageUrl + doc.Documento);
      if (!groups[doc.Tipo_Documento]) {
        groups[doc.Tipo_Documento] = [];
      }
      groups[doc.Tipo_Documento].push(doc);
    }
    // Convertimos el objeto de grupos a un arreglo para facilitar la iteración en la vista
    this.documentosGrouped = Object.keys(groups).map(key => ({
      tipo: key,
      docs: groups[key]
    }));
  }
}
