import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, tap, map, shareReplay, takeUntil } from 'rxjs/operators';
import { TableLazyLoadEvent } from 'primeng/table';
import { TableQuery, TableService } from 'src/app/Services/table/table-service.service';
import { TableDumbComponent } from '../table-dumb/table-dumb.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-table-smart',
  standalone: true,
  imports: [TableDumbComponent, CommonModule],
  templateUrl: './table-smart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSmartComponent implements OnInit, OnDestroy {
  @Input() entity!: string;
  @Input() columns: any[] = [];

  @Output() exportExcel = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();
  @Output() exportWord = new EventEmitter<void>();
  @Output() exportPrint = new EventEmitter<void>();

  @Output() queryChange = new EventEmitter<TableQuery>();

  data$!: Observable<any[]>;
  total$!: Observable<number>;
  loading$ = new BehaviorSubject<boolean>(false);
  suggestions: Record<string, string[]> = {};
  searchInputs: Record<string, string> = {};

  private querySubject = new BehaviorSubject<TableQuery>({
    page: 1,
    pageSize: 10,
    filters: {},
    search: {}
  });

  public lastEvent: TableLazyLoadEvent = { first: 0, rows: 10, filters: {} };
  private destroy$ = new Subject<void>();

  constructor(
    private tableService: TableService<any>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const selectFields = this.columns.filter(c => c.type === 'select').map(c => c.field);
    const searchFields = this.columns.filter(c => c.type === 'search').map(c => c.field);
    const allFields = Array.from(new Set([...selectFields, ...searchFields]));

    this.tableService.getFilterOptions(this.entity, allFields)
      .pipe(takeUntil(this.destroy$))
      .subscribe(opts => {
        console.log('📦 Opciones recibidas:', opts);

        // Asignar filtros a columnas
        this.columns = this.columns.map(col => ({
          ...col,
          filterOptions: opts[col.field] || []
        }));

        this.tableService.setColumns(this.columns);


        // Asignar sugerencias recreando el objeto (clave para que funcione con OnPush)
        this.suggestions = searchFields.reduce((acc, field) => {
          acc[field] = opts[field] || [];
          console.log('✅ Sugerencias cargadas para', field, ':', acc[field]);
          return acc;
        }, {} as Record<string, string[]>);

        this.cd.markForCheck(); // Forzar detección manual si es necesario
              // Inicializar filtros con valor de localStorage
      this.initFechaSistemaFiltro();
        this.initDataStreams();
    });


 
  }

  private initDataStreams() {
    const qs$ = this.querySubject.asObservable();
    const fetch$ = qs$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(q => this.tableService.fetch(this.entity, q)),
      tap(() => this.loading$.next(false)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.data$ = fetch$.pipe(map(r => r.items));
    this.total$ = fetch$.pipe(map(r => r.total));

    qs$.pipe(takeUntil(this.destroy$)).subscribe(q => this.queryChange.emit(q));
  }


  initFechaSistemaFiltro() {
    const fechaCol = this.columns.find(c => c.type === 'date-range' && c.fInicial === 'fecha_sistema');
    if (!fechaCol) return;

    const filtroInicialKey = fechaCol.field + '_from';
    const fechaSistemaStorage = localStorage.getItem('fechaSistemaStorage');

    if (fechaSistemaStorage) {
      // Actualiza searchInputs con nueva referencia
      this.searchInputs = {
        ...this.searchInputs,
        [filtroInicialKey]: fechaSistemaStorage
      };
      this.cd.markForCheck(); // Marca para chequeo

      // Actualiza lastEvent.filters con filtro fecha
      this.lastEvent = {
        ...this.lastEvent,
        filters: {
          ...this.lastEvent.filters,
          [filtroInicialKey]: { value: fechaSistemaStorage, matchMode: 'contains' }
        }
      };

      // Dispara la carga inicial con filtro aplicado
      this.loadData(this.lastEvent);

      console.log('⚙️ initFechaSistemaFiltro: filtro inicial aplicado:', filtroInicialKey, fechaSistemaStorage);
    }
  }

  onSuggest(evt: { field: string; query: string }) {
    const { field, query } = evt;
    const base = this.columns.find(c => c.field === field)?.filterOptions || [];
    const filtered = base.filter(opt =>
      opt.toLowerCase().includes(query.toLowerCase())
    );
    console.log('🔍 Sugerencia buscada:', { field, query });
    console.log('🎯 Opciones sugeridas:', filtered);
    this.suggestions = {
      ...this.suggestions,
      [field]: filtered
    };
    this.cd.markForCheck();
  }

  onSearchApply(evt: { field: string; value: string }) {
    const { field, value } = evt;
    const cur = this.querySubject.value;
    this.querySubject.next({
      ...cur,
      page: 1,
      search: { ...cur.search, [field]: value }
    });
  }

  loadData(event: TableLazyLoadEvent) {
    this.lastEvent = event;
    const page = (event.first! / event.rows!) + 1;
    const pageSize = event.rows!;
    const filters = this.parseFilters(event.filters);
    const search = this.parseSearch(event.globalFilter);
    const sortField = typeof event.sortField === 'string' ? event.sortField : undefined;
    const sortOrder = (event.sortOrder === 1 || event.sortOrder === -1) ? event.sortOrder : undefined;

    console.log('📥 loadData:', { page, pageSize, filters, search });

    this.querySubject.next({ page, pageSize, filters, search, sortField, sortOrder });
  }

  private parseFilters(raw: any): Record<string, any> {
    const out: any = {};
    if (raw) Object.keys(raw).forEach(k => out[k] = raw[k].value);
    return out;
  }

  private parseSearch(global: any): Record<string, string> {
    return global ? { global } : {};
  }

  onExport(format: 'excel' | 'pdf' | 'word') {
    this.tableService.exportFile(this.entity, format);
  }

  onPrint() {
    this.tableService.printAll(this.entity);
    this.exportPrint.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
