import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SERVER_URL } from 'src/environments/environment';
import { TableExportService } from '../table-report-export/table-export.service';

export interface TableQuery {
  page: number;
  pageSize: number;
  filters: Record<string, any>;
  search: Record<string, string>;
  sortField?: string;
  sortOrder?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class TableService<T> {
  private readonly API = SERVER_URL + 'ws_servicios/ws_Reportes.php';
  private get empresaID(): string {
   return localStorage.getItem('empresa_id') || '';
  }


  private filterOptionsCache = new Map<string, Record<string, any[]>>();

  // Propiedad para mantener columnas visibles
  public lastColumns: any[] = [];

  constructor(
    private http: HttpClient,
    private exportService: TableExportService
  ) {}

  /** Guardar columnas para exportación */
  setColumns(columns: any[]): void {
    this.lastColumns = columns;
  }

  
  /** Obtener datos paginados */
  fetch(entity: string, query: TableQuery): Observable<PaginatedResult<T>> {
    let params = new HttpParams()
      .set('codOpe', 'ORC')
      .set('entity', entity)
      .set('Empresa_ID', this.empresaID)
      .set('page', query.page.toString())
      .set('pageSize', query.pageSize.toString());

    // 🗓 Transformar fechas a DD-MM-YYYY antes de mandarlas
    const filtersFormatted: Record<string, any> = {};
    for (const key in query.filters) {
      if (!query.filters.hasOwnProperty(key)) continue;
      const value = query.filters[key];
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        // De "YYYY-MM-DD" a "DD-MM-YYYY"
        const [year, month, day] = value.split('-');
        filtersFormatted[key] = `${day}-${month}-${year}`;
      } else {
        filtersFormatted[key] = value;
      }
    }

    if (Object.keys(filtersFormatted).length > 0) {
      params = params.set('filters', JSON.stringify(filtersFormatted));
    }

    if (Object.keys(query.search).length > 0) {
      params = params.set('search', JSON.stringify(query.search));
    }

    if (query.sortField) params = params.set('sortField', query.sortField);
    if (query.sortOrder) params = params.set('sortOrder', query.sortOrder.toString());

    return this.http
      .get<PaginatedResult<T>>(this.API, { params })
      .pipe(catchError(err => throwError(() => err)));
  }



  /** Obtener opciones para filtros (ORF) */
  getFilterOptions(entity: string, fields: string[]): Observable<Record<string, any[]>> {
    const key = entity + '__' + JSON.stringify(fields.sort());

    if (this.filterOptionsCache.has(key)) {
      return of(this.filterOptionsCache.get(key)!);
    }

    if (!fields.length) return of({});

    const params = new HttpParams()
      .set('codOpe', 'ORF')
      .set('entity', entity)
      .set('Empresa_ID', this.empresaID)
      .set('filtersFor', key);

    return this.http.get<{ [field: string]: any[] }>(this.API, { params }).pipe(
      catchError(() => of({})),
      tap(resp => {
        console.log('📦 Respuesta ORF (filtros):', resp);
        this.filterOptionsCache.set(key, resp || {});
      })
    );
  }


// EXPORTACION E IMPRESION

  exportFile(entity: string, format: 'excel' | 'pdf' | 'word'): void {
    const url = `${this.API}?codOpe=ORT&entity=${entity}&Empresa_ID=${this.empresaID}`;
    console.log('🚀 Iniciando exportFile', { entity, format, url });

    this.http.get<{ items: any[] }>(url).pipe(
      map(resp => resp.items || []),
      catchError(err => {
        console.error('❌ Error al obtener datos para exportar:', err);
        return of([]);
      })
    ).subscribe(data => {
      console.log('📥 Datos recibidos para exportar:', data);
      if (!data.length) {
        console.warn('⚠️ No hay datos para exportar');
        return;
      }

      // 1) Normaliza las columnas recogidas para exportar,
      //    marcando explícitamente show=true en todas
      const columnsToExport = this.lastColumns
        .filter(col => col.field && col.header)
        .map(col => ({ ...col, show: true }));

      console.log('📤 Columnas configuradas para exportar (show=true):', columnsToExport);

      const fileNameBase = `${entity} ${entity}`;

      switch (format) {
        case 'excel':
          this.exportService.exportToExcel(
            columnsToExport,
            data,
            `${fileNameBase}.xlsx`,
            fileNameBase
          );
          break;
        case 'pdf':
          this.exportService.exportToPDF(
            columnsToExport,
            data,
            `${fileNameBase}.pdf`,
            fileNameBase
          );
          break;
        case 'word':
          this.exportService.exportToWord(
            columnsToExport,
            data,
            `${fileNameBase}.docx`,
            fileNameBase
          );
          break;
      }

      console.log('✅ Llamada al exportService completada');
    });
  }


  printAll(entity: string): void {
    const url = `${this.API}?codOpe=ORT&entity=${entity}&Empresa_ID=${this.empresaID}`;
    this.http.get<{ items: any[] }>(url).pipe(
      map(resp => resp.items || []),
      catchError(err => { console.error(err); return of([]); })
    ).subscribe(data => {
      if (!data.length) return console.warn('⚠️ No hay datos para imprimir');

      const cols = this.lastColumns.filter(c => c.field && c.header);
      const headers = cols.map(c => `<th>${c.header}</th>`).join('');
      const rows = data.map(row =>
        `<tr>${cols.map(c => `<td>${row[c.field] ?? ''}</td>`).join('')}</tr>`
      ).join('');

      const html = `
        <html>
          <head>
            <title>Imprimir ${entity}</title>
            <style>
              /* Forzar horizontal y márgenes finos */
              @page { size: landscape; margin: 10mm; }
              /* Tamaño de letra pequeño */
              body { font-size: 8px; }
              table { width: 100%; border-collapse: collapse; }
              th, td {
                border: 1px solid #444;
                padding: 2px 4px;
                font-size: 8px;
              }
              th { background: #eee; }
            </style>
          </head>
          <body>
            <h2 style="font-size:12px; text-align:center;">${entity}</h2>
            <table>
              <thead><tr>${headers}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </body>
        </html>`;

      const win = window.open('', '_blank');
      if (!win) return console.error('❌ No se pudo abrir ventana de impresión');
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 300);
    });
  }

}
