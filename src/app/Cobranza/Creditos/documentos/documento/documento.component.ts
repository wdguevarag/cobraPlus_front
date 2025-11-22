import { Component, OnInit } from '@angular/core';
import { CreditoService } from 'src/app/Services/creditos.service';
import { PAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent implements OnInit {

  page_url = PAGE_URL;
  busquedaCredito: string = '';
  creditosSugerencias: any[] = [];
  selectedCredito: any = null;

  constructor(
    private creditoService: CreditoService,
  ) { }

  ngOnInit(): void {
    // No se carga ningún crédito al inicio.
  }

  // Busca sugerencias filtrando por el ID del crédito.
  onSearch(): void {
    const termino = this.busquedaCredito.trim();
    if (termino !== '') {
      this.creditoService.getCreditosFirmas().subscribe(creditos => {
        this.creditosSugerencias = creditos.filter(item =>
          String(item.ID).toLowerCase().includes(termino.toLowerCase())
        );
      });
    } else {
      this.creditosSugerencias = [];
      this.selectedCredito = null;
    }
  }

  // Al seleccionar una sugerencia, se asigna el crédito seleccionado y se oculta la lista.
  selectCredito(credito: any): void {
    this.selectedCredito = credito;
    this.busquedaCredito = String(credito.ID);
    this.creditosSugerencias = [];
  }
}
