import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-table-dumb',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    AutoCompleteModule,
    FormsModule,
    PaginatorModule
  ],
  templateUrl: './table-dumb.component.html',
  styleUrl: './table-dumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDumbComponent {
  constructor(private cd: ChangeDetectorRef) {}

  @Input() value: any[] = [];
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Input() columns: any[] = [];
  @Input() lastEvent: TableLazyLoadEvent | null = null;
  @Input() searchInputs: Record<string, string> = {};

  @Output() onLazy        = new EventEmitter<TableLazyLoadEvent>();
  @Output() onSuggest     = new EventEmitter<{ field: string; query: string }>();
  @Output() onSearchApply = new EventEmitter<{ field: string; value: string }>();
  
  @Output() exportExcel   = new EventEmitter<void>();
  @Output() exportPdf     = new EventEmitter<void>();
  @Output() exportWord    = new EventEmitter<void>();
  @Output() exportPrint = new EventEmitter<void>();


  private _originalSuggestions: Record<string, string[]> = {};
  private _currentSuggestions: Record<string, string[]> = {};

  

  @Input() set suggestions(val: Record<string, string[]>) {
    console.log('💾 SUGGESTIONS INPUT:', val);

    this._originalSuggestions = {};
    this._currentSuggestions = {};

    for (const key of Object.keys(val)) {
      this._originalSuggestions[key] = [...val[key]];
      this._currentSuggestions[key] = [...val[key]];
    }

    this.cd.markForCheck();
  }

  get suggestions(): Record<string, string[]> {
    return this._currentSuggestions;
  }




  formatNumber(value: any): string {
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getColumnSum(field: string): number {
    return this.value.reduce((acc, row) => {
      const val = Number(row[field]);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }

  globalSearchColumn: string = '';
  globalSearchValue: string = '';

  applyGlobalSearch() {
    if (!this.globalSearchColumn) return;

    const value = this.globalSearchValue.trim();
    this.onSearchApply.emit({ field: this.globalSearchColumn, value });
    this.onLazy.emit(this.cloneAndUpdateEvent(this.globalSearchColumn, value));
  }





  filter(field: string, val: any) {
    console.log(`🔄 FILTRO CAMPO: ${field}, VALOR:`, val);
    const ev = this.cloneAndUpdateEvent(field, val);
    this.onLazy.emit(ev);
  }

  completeSearch(field: string, query: string) {
    console.log(`🔍 completeSearch → field: ${field}, query: ${query}`);
    const all = this._originalSuggestions[field] || [];
    console.log('📦 original values:', all);

    const filtered = all.filter(opt =>
      opt.toLowerCase().includes((query || '').toLowerCase())
    );

    this._currentSuggestions = {
      ...this._currentSuggestions,
      [field]: filtered
    };

    console.log('🎯 filtered:', filtered);

    this.cd.detectChanges();
  }

  applySearch(field: string, value: string) {
    const v = value?.trim() || null;
    console.log(`✅ applySearch → field: ${field}, value: ${v}`);
    this.onSearchApply.emit({ field, value: v });
    this.onLazy.emit(this.cloneAndUpdateEvent(field, v));
  }

  selectSearch(field: string, ev: AutoCompleteSelectEvent) {
    console.log(`🎯 selectSearch → field: ${field}, value: ${ev.value}`);
    this.onSearchApply.emit({ field, value: ev.value });
    this.onLazy.emit(this.cloneAndUpdateEvent(field, ev.value));
  }

  onExport(format: 'excel' | 'pdf' | 'word') {
    if (format === 'excel') this.exportExcel.emit();
    if (format === 'pdf')   this.exportPdf.emit();
    if (format === 'word')  this.exportWord.emit();
  }

  onPrintClick() {
    this.exportPrint.emit();
  }

  getSelectOptions(col: any): any[] {
    const opts = col.filterOptions || [];
    return [{ label: 'Seleccionar', value: '' }, ...opts];
  }

  trackByRow(_: number, item: any) { return item.ID; }
  trackByField(_: number, col: any) { return col.field; }

  private cloneAndUpdateEvent(field: string, value: any): TableLazyLoadEvent {
    const filters = { ...(this.lastEvent?.filters || {}) };
    if (value === null || value === '') {
      delete filters[field];
    } else {
      filters[field] = { value, matchMode: 'contains' };
    }

    const ev: TableLazyLoadEvent = { ...(this.lastEvent || {}), filters };
    console.log('📨 Emitting lazy event:', ev);
    return ev;
  }
}
