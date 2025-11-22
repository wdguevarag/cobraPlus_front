import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-general-vista-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-vista-documentos.component.html',
  styleUrls: ['./general-vista-documentos.component.scss']
})
export class GeneralVistaDocumentosComponent implements OnInit {

  @Input() data: any;

  documentos: any[] = [];
  selectedDocument: any = null;
  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.data) {
      this.documentos = this.data.documentos;
    }
  }

  onSelectDocument(doc: any): void {
    this.selectedDocument = doc;
    // Usamos el sanitizer para marcar la URL como segura para Angular:
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(doc.ruta);
  }
}
