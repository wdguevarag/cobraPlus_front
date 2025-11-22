import { Injectable } from '@angular/core';

// Librería para PDF
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Librerías para Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Librerías para Word
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  TextRun,
  TableLayoutType
} from 'docx';


@Injectable({
  providedIn: 'root'
})
export class TableExportService {

  exportToPDF(columns: any[], data: any[], fileName: string = 'tabla.pdf', tableName?: string): void {
    const doc = new jsPDF('p', 'pt');

    const marginSide = 10;
    const marginTop = tableName ? 30 : 30;

    if (tableName) {
      doc.setFontSize(8);
      doc.text(tableName, marginSide, 40);
    }

    const headers = columns.filter(col => col.show !== false).map(col => col.header);

    // Helper para capitalizar cada palabra: "cliente prueba" -> "Cliente Prueba"
    const toTitleCase = (str: string): string => {
      return str
        .toLowerCase()
        .split(/\s+/)
        .map(word => {
          if (word.length === 0) return '';
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    };

    const rows = data.map(row =>
      columns.filter(col => col.show).map(col => {
        const raw = row[col.field];
        if (raw == null) {
          return '';
        }
        const s = String(raw);
        // Si el valor es numérico o fecha u otro formato donde no se desee capitalizar,
        // puedes detectar con: if (/^\d/.test(s)) return s; o typeof raw==='number'
        // Aquí, si quieres capitalizar sólo textos, verifica si contiene letras:
        if (/[a-zA-Z]/.test(s)) {
          return toTitleCase(s);
        }
        return s;
      })
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - marginSide * 2;
    const colCount = headers.length || 1;
    const colWidth = usableWidth / colCount;

    (doc as any).autoTable({
      head: [headers],
      body: rows,
      margin: { top: marginTop, left: marginSide, right: marginSide },
      tableWidth: usableWidth,
      styles: {
        cellPadding: 4,
        overflow: 'linebreak',
        cellWidth: colWidth
      },
      bodyStyles: {
        fontSize: 5
      },
      headStyles: {
        fillColor: [22, 160, 133],
        fontSize: 4,
        textColor: 255,
        halign: 'center',
        cellPadding: 4,
        overflow: 'linebreak',
        cellWidth: colWidth
      },
      columnStyles: headers.reduce((acc, _, idx) => {
        acc[idx] = { cellWidth: colWidth, overflow: 'linebreak' };
        return acc;
      }, {} as Record<number, any>),
    });

    const finalFileName = tableName
      ? (tableName.toLowerCase().endsWith('.pdf') ? tableName : `${tableName}.pdf`)
      : fileName;
    doc.save(finalFileName);
  }

  exportToExcel(columns: any[], data: any[], fileName: string = 'tabla.xlsx', sheetName?: string): void {
  // Filtrar columnas visibles
  const visibleColumns = columns.filter(col => col.show !== false);

  // Capitalizar texto
  const toTitleCase = (str: string): string =>
    str.toLowerCase().split(/\s+/).map(word => word ? word[0].toUpperCase() + word.slice(1) : '').join(' ');

  // Encabezado
  const header = visibleColumns.map(col => col.header);

  // Filas de data
  const rows = data.map(row =>
    visibleColumns.map(col => {
      const raw = row[col.field];
      if (raw == null) return '';
      const str = String(raw);
      return /[a-zA-Z]/.test(str) ? toTitleCase(str) : str;
    })
  );

  const worksheetData = [header, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Estilo del thead (fila 1): color de fondo verde
  const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
  const headerRowNumber = range.s.r;

  for (let c = range.s.c; c <= range.e.c; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: headerRowNumber, c });
    if (!worksheet[cellRef]) continue;
    worksheet[cellRef].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "16A085" } },
      alignment: { horizontal: "center" }
    };
  }

  // Ajustar ancho de columnas según el encabezado (no la data)
  worksheet['!cols'] = header.map(h => ({ wch: h.length + 2 }));

  // Crear el libro y agregar hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Reporte');

  // Guardar archivo
  const finalFileName = sheetName
    ? (sheetName.toLowerCase().endsWith('.xlsx') ? sheetName : `${sheetName}.xlsx`)
    : fileName;

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, finalFileName);
  }

  exportToWord(columns: any[], data: any[], fileName: string = 'tabla.docx', tableName?: string): void {
    const sectionProperties = {
      page: {
        margin: {
          top: 360,
          bottom: 360,
          left: 360,
          right: 360,
        }
      }
    };

    // Capitaliza cada palabra
    const toTitleCase = (str: string): string => {
      return str
        .toLowerCase()
        .split(/\s+/)
        .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
        .join(' ');
    };



    const headerFontSize = 10; // 5pt
    const bodyFontSize = 8;    // 4pt

    const headerCells = columns
    .filter(col => col.show !== false)
    .map(col => new TableCell({
        margins: {
          top: 20,
          bottom: 20,
          left: 30,
          right: 30,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: String(col.header),
                size: headerFontSize,
                bold: true,
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          })
        ]
      }));

    const rows: TableRow[] = [];
    rows.push(new TableRow({ children: headerCells }));

    data.forEach(rawRow => {
      const cells = columns
        .filter(col => col.show)
        .map(col => {
          const raw = rawRow[col.field];
          let text = raw != null ? String(raw) : '';
          if (/[a-zA-Z]/.test(text)) {
            text = toTitleCase(text); // capitalizar si hay letras
          }

          return new TableCell({
            margins: {
              top: 20,
              bottom: 20,
              left: 30,
              right: 30,
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    size: bodyFontSize,
                  })
                ],
                spacing: { after: 50 }
              })
            ]
          });
        });
      rows.push(new TableRow({ children: cells }));
    });

    const table = new Table({
      rows,
      width: { size: 100, type: 'pct' },
      layout: TableLayoutType.FIXED,
    });

    const sectionChildren = [];

    if (tableName) {
      sectionChildren.push(new Paragraph({
        children: [
          new TextRun({
            text: String(tableName),
            size: headerFontSize,
            bold: true,
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }));
    }

    sectionChildren.push(table);

    const doc = new Document({
      sections: [{
        properties: sectionProperties,
        children: sectionChildren
      }]
    });

    Packer.toBlob(doc).then(blob => {
      const finalFileName = tableName
        ? (tableName.toLowerCase().endsWith('.docx') ? tableName : `${tableName}.docx`)
        : fileName;
      saveAs(blob, finalFileName);
    });
  }
  
}







