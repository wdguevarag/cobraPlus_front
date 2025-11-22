import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { TableExportService } from 'src/app/Services/table-report-export/table-export.service';

interface Column {
  header: string;
  field: string;
  show?: boolean;
  type?: string;
  contentField?: string | ((row: any) => any);
  btnLabel?: string;
  imgDescripcion?: string;
  noNumeric?: boolean;
  viewPalabra?: string;
}

interface TableFilter {
  field: string;
  type?: string;
  title: string;
  dateFormat?: string;
  dateDefault?: string;
}

@Component({
  selector: 'app-general-table-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-table-report.component.html',
  styleUrls: ['./general-table-report.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class GeneralTableReportComponent implements OnInit, OnChanges {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() filters: TableFilter[] = [];
  @Input() enableDateFilter: boolean = false;
  @Input() dateFilterField?: string;
  @Input() dateFilterLabel: string = 'Fecha';
  @Input() functionSort: boolean = true;
  @Input() loading: boolean = false;
  @Input() tableName?: string;

  @Output() filterEvent = new EventEmitter<void>();
  @Output() exportEvent = new EventEmitter<'pdf' | 'excel' | 'word'>();

  filteredData: any[] = [];
  selectedDate: string | null = null;
  maxDate = new Date().toISOString().split('T')[0];
  searchQuery: string = '';
  filterProperty: string = '';
  selectedFilters: { [field: string]: any } = {};
  filterOptions: { [field: string]: any[] } = {};
  dateFilters: { [field: string]: { startStr?: string; endStr?: string } } = {};
  sortOrder: 'asc' | 'desc' = 'desc';

  showExportMenu = false;
  showImageModal = false;
  modalImageUrl = '';
  modalImageDescripcion = '';

  constructor(private exportService: TableExportService) {}

  ngOnInit(): void {
    this.filters.forEach(f => {
      if (f.type === 'date-start' || f.type === 'date-end') {
        if (!this.dateFilters[f.field]) this.dateFilters[f.field] = {};

        if (!this.dateFilters[f.field].startStr && f.type === 'date-start') {
          const fechaSistema = localStorage.getItem('fechaSistemaStorage') || new Date().toISOString().split('T')[0];
          this.dateFilters[f.field].startStr = fechaSistema;
          this.selectedFilters[f.field] = fechaSistema;
        }
      }
    });

    this.columns = this.columns.map(col => ({ ...col, show: col.show !== false }));
    if (this.columns.length > 0) {
      this.filterProperty = this.columns[0].field;
    }
    this.filters.forEach(f => {
      if (!this.selectedFilters[f.field]) this.selectedFilters[f.field] = '';
    });

    if (this.enableDateFilter && this.dateFilterField) {
      this.selectedDate = new Date().toISOString().split('T')[0];
    }

    this.setupFilterOptions();
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.setupFilterOptions();
      this.applyFilters();
    }
  }

  private setupFilterOptions(): void {
    this.filters.forEach(f => {
      if (f.type === 'select') {
        this.filterOptions[f.field] = Array.from(new Set(this.data.map(r => r[f.field]))).filter(v => v != null);
      }
    });
  }

  onFilterChanged(): void {
    this.applyFilters();
    this.filterEvent.emit();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.data];

    if (this.enableDateFilter && this.dateFilterField && this.selectedDate) {
      filtered = filtered.filter(item => {
        const val = item[this.dateFilterField!];
        if (!val) return false;
        const iso = this.parseDateToISO(val);
        return iso && iso.startsWith(this.selectedDate);
      });
    }

    for (const f of this.filters) {
      if (f.type === 'select') {
        const val = this.selectedFilters[f.field];
        if (val) {
          filtered = filtered.filter(item => item[f.field] == val);
        }
      } else if (f.type === 'date-start') {
        const start = this.dateFilters[f.field]?.startStr;
        if (start) {
          filtered = filtered.filter(item => {
            const iso = this.parseDateToISO(item[f.field]);
            return iso && iso >= start;
          });
        }
      } else if (f.type === 'date-end') {
        const end = this.dateFilters[f.field]?.endStr;
        if (end) {
          filtered = filtered.filter(item => {
            const iso = this.parseDateToISO(item[f.field]);
            return iso && iso <= end;
          });
        }
      }
    }

    if (this.searchQuery && this.filterProperty) {
      const sq = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const val = (item[this.filterProperty] || '').toString().toLowerCase();
        return val.includes(sq);
      });
    }

    if (this.filterProperty) {
      filtered.sort((a, b) => {
        const valA = a[this.filterProperty];
        const valB = b[this.filterProperty];
        if (valA == null) return 1;
        if (valB == null) return -1;
        if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredData = filtered;
  }

  exportToPDF(): void {
    this.exportService.exportToPDF(this.columns, this.filteredData, 'tabla.pdf', this.tableName);
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.columns, this.filteredData, 'tabla.xlsx', this.tableName);
  }

  exportToWord(): void {
    this.exportService.exportToWord(this.columns, this.filteredData, 'tabla.docx', this.tableName);
  }

  printTable(): void {
    const printContent = document.querySelector('table')?.outerHTML;
    if (!printContent) {
      alert('No hay tabla para imprimir.');
      return;
    }
    const newWindow = window.open('', '', 'width=900,height=600');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Tabla</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
    } else {
      alert('No se pudo abrir la ventana de impresión.');
    }
  }

  openImagePopup(url: string, descripcion: string): void {
    this.modalImageUrl = url;
    this.modalImageDescripcion = descripcion;
    this.showImageModal = true;
  }

  closeImagePopup(): void {
    this.showImageModal = false;
    this.modalImageUrl = '';
    this.modalImageDescripcion = '';
  }

  private parseDateToISO(fecha: string): string {
    if (!fecha) return '';
    const partes = fecha.split('-');
    if (partes.length === 3) {
      const [dia, mes, anio] = partes;
      return `${anio}-${mes}-${dia}`;
    }
    return '';
  }
}
