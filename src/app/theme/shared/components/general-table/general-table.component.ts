import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { TableExportService } from 'src/app/Services/table-report-export/table-export.service';


interface TableFilter {
  field: string;
  type: string;
  title: string;
  dateFormat?: string;
  dateDefault?: string;   // <-- nueva propiedad opcional

}


interface Column {
  header: string;
  field: string;
  show?: boolean;
  type?: string;
  trueValue?: string;
  falseValue?: string;
  sumable?: boolean;
  totalLabel?: string;
  contentField?: string | ((row: any) => any);
  btnClass?: string;
  fieldToggleId?: string;
  noNumeric?: boolean;
}



@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.scss'],


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
export class GeneralTableComponent implements OnInit, OnChanges {
  // Entradas básicas
  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  // Nuevo: Filtros a aplicar, ej:
  // [{ field: 'Estado_Civil', type: 'select', title: 'Estado Civil' }, { field: 'Nombres', type: 'select', title: 'Nombres' }]
  @Input() filters: any[] = [];

  @Input() tableName?: string;
  @Input() pageSize: number = 15;
  @Input() filterMode: 'normal' | 'select' = 'normal';
  @Input() loading: boolean = false;
  @Input() enableDateFilter: boolean = false;
  @Input() dateFilterField?: string;
  @Input() dateFilterLabel: string = 'Fecha';

  @Input() functionSort: boolean = true;

  // Eventos de salida
  @Output() rowClick = new EventEmitter<{ id: number, tableName?: string }>();
  @Output() deleteRow = new EventEmitter<{ id: number, row: any, event: MouseEvent }>();
  @Output() buttonClick = new EventEmitter<{ contentField: string, id: number, event: MouseEvent }>();
  @Output() toggleChange = new EventEmitter<{ field: string, id: number, value: number }>();

  // Variables internas
  public readonly trueValue: number = 1;
  public readonly falseValue: number = 0;
  public sortOrder: 'asc' | 'desc' = 'desc';
  public showSortOptions: boolean = false;
  public showExportMenu = false;
  public selectedDate: string | null = null;
  public maxDate: string = new Date().toISOString().split('T')[0];

  toggleIdField: string = 'ID';
  currentPage: number = 1;
  paginatedData: any[] = [];
  searchQuery: string = '';
  // Propiedad utilizada para la búsqueda en columna; se mantiene la lógica existente.
  filterProperty: string = 'ID';

  // Propiedades para el filtrado basado en "filters"
  selectedFilters: { [field: string]: any } = {};
  filterOptions: { [field: string]: any[] } = {};
  dateFilters: {
  [field: string]: { startStr?: string; endStr?: string; start?: Date; end?: Date }
} = {};



  totals: { [field: string]: number } = {};

  constructor(private exportService: TableExportService) {}




  ngOnInit(): void {
    // console.log('🟡 ngOnInit - filtros recibidos:', this.filters);

      this.columns = this.columns.map(col => ({ ...col, show: col.show !== false }));


    this.filters.forEach(f => {
        this.selectedFilters[f.field] = '';

        if (f.type.startsWith('date')) {
          if (!this.dateFilters[f.field]) {
            this.dateFilters[f.field] = {};
          }

          let defaultDate = f.dateDefault;

          // REGLA: Si es date-start, usa fecha sistema por defecto.
          //        Si es date-end, solo si el padre lo indica con 'SISTEMA'
          const debeUsarFechaSistema = 
            (f.type === 'date-start' && !defaultDate) || 
            (f.type === 'date-end' && defaultDate?.toUpperCase() === 'SISTEMA');

          if (debeUsarFechaSistema) {
            defaultDate = localStorage.getItem('fechaSistemaStorage') || undefined;
          }

          if (defaultDate) {
            const d   = this.parseDate(defaultDate)!;
            const iso = d.toISOString().split('T')[0];

            if (f.type === 'date-start') {
              this.dateFilters[f.field].start    = d;
              this.dateFilters[f.field].startStr = iso;
            } else if (f.type === 'date-end') {
              this.dateFilters[f.field].end      = d;
              this.dateFilters[f.field].endStr   = iso;
            }
          }
        } else {
          this.filterOptions[f.field] = [];
        }

    });

    //console.log('🔵 Final dateFilters:', JSON.stringify(this.dateFilters, null, 2));

    this.setupFilterOptions();

    if (this.enableDateFilter && this.dateFilterField) {
      this.selectedDate = new Date().toISOString().split('T')[0];
      console.log('📅 selectedDate (enableDateFilter):', this.selectedDate);
    }

    this.updatePaginatedData();
    this.setToggleIdField();

    // Requerimiento filtro por Cliente o Primera Columna
    const firstColumn = this.getFilteredCustomColumns()[0];
    this.filterProperty = firstColumn?.field || 'ID';

  }





  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns'] || changes['filters']) {
      this.currentPage = 1;
      this.setupFilterOptions();
      this.updatePaginatedData();
    }
    if (changes['columns']) {
      this.setToggleIdField();
    }
  }

  // Genera las opciones únicas para cada filtro según el campo en el arreglo filters.
  setupFilterOptions(): void {
    this.filters.forEach(filter => {
      if (filter.type === 'date-start' || filter.type === 'date-end') {
        this.selectedFilters[filter.field] = '';
        if (!this.dateFilters[filter.field]) {
          this.dateFilters[filter.field] = {};
        }
      } else {
        const values = Array.from(new Set(this.data.map(item => item[filter.field])))
                          .filter(val => val !== null && val !== undefined);
        this.filterOptions[filter.field] = values;
      }
    });
  }
  // Aplica la búsqueda general (por filterProperty y searchQuery) y los filtros select (con selectedFilters)


  updatePaginatedData(): void {
    const dataArray = Array.isArray(this.data) ? this.data : [];

    let filteredData = dataArray.filter(row =>
      row[this.filterProperty]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.functionSort) {
      filteredData.sort((a, b) => {
        const idA = Number(a[this.toggleIdField]) || 0;
        const idB = Number(b[this.toggleIdField]) || 0;
        return this.sortOrder === 'desc' ? idB - idA : idA - idB;
      });
    }

    if (this.enableDateFilter && this.dateFilterField && this.selectedDate) {
      const filtro = new Date(this.selectedDate);
      filteredData = filteredData.filter(row => {
        const fechaRow = new Date(row[this.dateFilterField!]);
        return fechaRow.toDateString() === filtro.toDateString();
      });
    }

    // Aplicación de filtros (select, fecha, etc.)
    if (this.filters && this.filters.length > 0) {
      this.filters.forEach(filter => {
        if (filter.type === 'select') {
          const selectedValue = this.selectedFilters[filter.field];
          if (selectedValue) {
            filteredData = filteredData.filter(row => row[filter.field] == selectedValue);
          }
        }
      });

      Object.keys(this.dateFilters).forEach(field => {
        const range = this.dateFilters[field];
        if (range.start || range.end) {
          filteredData = filteredData.filter(row => {
            const rowDate = this.parseDate(row[field]);
            if (!rowDate) return true;
            const isAfterStart = !range.start || rowDate >= range.start;
            const isBeforeEnd = !range.end || rowDate <= range.end;
            return isAfterStart && isBeforeEnd;
          });
        }
      });
    }

    // Ordenamos los datos y calculamos totales, etc.
    filteredData.sort((a, b) => {
      const idA = Number(a[this.toggleIdField]) || 0;
      const idB = Number(b[this.toggleIdField]) || 0;
      return this.sortOrder === 'desc' ? idB - idA : idA - idB;
    });
    this.calculateTotals(filteredData);

    // Paginación y asignación de "rowActive" a cada fila:
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const toggleCol = this.columns.find(col => col.type === 'btn-toggle');
    this.paginatedData = filteredData.slice(startIndex, endIndex).map(row => {
      // Procesamiento de columnas (contentField, etc.)
      this.columns.forEach((column, index) => {
        if (!column.field && column.contentField) {
          column.field = column.header.toLowerCase().replace(/\s/g, '_') + '_' + index;
        }
        if (column.contentField) {
          if (typeof column.contentField === 'function') {
            row[column.field] = column.contentField(row);
          } else if (typeof column.contentField === 'string' && column.contentField.includes('+')) {
            try {
              const fn = new Function(...Object.keys(row), 'return ' + column.contentField);
              row[column.field] = fn(...Object.values(row));
            } catch (e) {
              console.error('Error evaluando contentField:', column.contentField, e);
              row[column.field] = column.contentField;
            }
          } else {
            row[column.field] = row.hasOwnProperty(column.contentField)
              ? row[column.contentField]
              : column.contentField;
          }
        }
      });

      // Si existe una columna toggle, se inicializa rowActive según su valor
      if (toggleCol && toggleCol.field) {
        row.rowActive = row[toggleCol.field] == this.trueValue;
      }
      return row;
    });
  }

  // Calcula totales para columnas marcadas como "sumable"
  calculateTotals(filteredData: any[]): void {
    this.totals = {};
    this.columns.forEach(column => {
      if (column.sumable) {
        this.totals[column.field] = 0;
      }
    });
    filteredData.forEach(row => {
      this.columns.forEach(column => {
        if (column.sumable) {
          const value = Number(row[column.field]);
          if (!isNaN(value)) {
            this.totals[column.field] += value;
          }
        }
      });
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.getTotalPages() && newPage !== this.currentPage) {
      this.currentPage = newPage;
      this.updatePaginatedData();
    }
  }

  get showFooter(): boolean {
    return this.columns.some(column => column.sumable || column.totalLabel);
  }

  getTotalPages(): number {
    const dataArray = Array.isArray(this.data) ? this.data : [];
    let filteredData = dataArray.filter(row =>
      row[this.filterProperty]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    if (this.filters && this.filters.length > 0) {
      this.filters.forEach(filter => {
        const selectedValue = this.selectedFilters[filter.field];
        if (selectedValue !== undefined && selectedValue !== null && selectedValue !== '') {
          filteredData = filteredData.filter(row => row[filter.field] == selectedValue);
        }
      });
    }

    return Math.ceil(filteredData.length / this.pageSize);
  }

  // Métodos de interacción con la tabla
  onRowClick(id: number): void {
    this.rowClick.emit({ id, tableName: this.tableName });
  }

  onDeleteClick(row: any, event: MouseEvent, column: any): void {
    event.stopPropagation();
    const idField = column.deleteField || this.toggleIdField || 'ID';
    const id = row[idField] ?? row['ID'] ?? row['id'];
    this.deleteRow.emit({ id, row, event });
  }

  onButtonClick(contentField: string, id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.buttonClick.emit({ contentField, id, event });
  }

  private setToggleIdField(): void {
    const customIdCol = this.columns.find(col => col.fieldToggleId);
    if (customIdCol && customIdCol.field) {
      this.toggleIdField = customIdCol.field;
    } else {
      this.toggleIdField = 'ID';
    }
  }



  onToggleClick(field: string, id: number, event: MouseEvent): void {
    event.stopPropagation();
    console.log('onToggleClick disparado:', { field, id, event });
    const row = this.data.find(item => item[this.toggleIdField] === id);
    if (row) {
      row[field] = (row[field] == this.trueValue) ? this.falseValue : this.trueValue;
      row.rowActive = row[field] == this.trueValue;
      console.log('Emitiendo toggleChange:', { field, id, value: row[field] });
      this.toggleChange.emit({ field, id, value: row[field] });
    }
  }





  onFilterPropertyChange(property: string): void {
    this.filterProperty = property;
    this.updatePaginatedData();
  }

  // Método que se ejecuta cuando cambia el valor en algún filtro (nuevo enfoque)
  onFilterChange(filterField: string): void {
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  getFilteredCustomColumns() {
    if (this.filterMode === 'select' && this.filters && this.filters.length > 0) {
      // Si se definieron filtros desde el padre, se devuelven para el select de búsqueda adicional
      return this.filters;
    }
    return this.columns.filter(column => column.type !== 'button');
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.updatePaginatedData();
  }


  getSelectedWords(value: string, indices: string): string {
    if (!value || !indices) {
      return value;
    }
    const words = value.split(' ');
    const selectedIndices = indices.split(',').map(n => parseInt(n.trim(), 10) - 1);
    return selectedIndices.map(i => words[i]).filter(w => w).join(' ');
  }

  printTable(): void {
    window.print();
  }

  // Exportación (PDF, Excel, Word) a través del servicio de exportación
  toggleExportMenu(): void {
    this.showExportMenu = !this.showExportMenu;
  }

  exportToPDF(): void {
    this.exportService.exportToPDF(this.columns, this.paginatedData, 'tabla.pdf', this.tableName);
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.columns, this.paginatedData, 'tabla.xlsx', this.tableName);
  }


  exportToWord(): void {
    this.exportService.exportToWord(this.columns, this.paginatedData, 'tabla.docx', this.tableName);
  }


  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;

    let day: number, month: number, year: number;

    // si el primer segmento tiene 4 dígitos, asumo ISO yyyy-MM-dd
    if (parts[0].length === 4) {
      year  = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day   = parseInt(parts[2], 10);
    } 
    else { 
      // asumo dd-MM-yyyy
      day   = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year  = parseInt(parts[2], 10);
    }

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }







  onDateFilterChange(field: string, type: 'start'|'end', isoStr: string) {
    if (isoStr) {
      const [year, month, day] = isoStr.split('-').map(v => +v);
      const d = new Date(year, month - 1, day);
      this.dateFilters[field][type]    = d;
    } else {
      this.dateFilters[field][type]    = undefined;
    }
    this.currentPage = 1;
    this.updatePaginatedData();
  }




    // 1) Detecta si un valor es numérico
    public isNumericValue(val: any): boolean {
      if (val === null || val === undefined || val === '') return false;
      const cleaned = String(val).replace(/,/g, '');
      return !isNaN(parseFloat(cleaned));
    }
  
    // 2) Formatea (ya lo tenías; lo repito con el nombre)
    public formatValue(val: any): string {
      if (val === null || val === undefined || val === '') return '';
      const cleaned = String(val).replace(/,/g, '');
      const num = parseFloat(cleaned);
      if (isNaN(num)) return String(val);
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(num);
    }
}

