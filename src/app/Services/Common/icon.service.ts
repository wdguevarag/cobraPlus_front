import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  getIconsModulo(): Observable<any[]> {
    const iconsModulos = [
        { ID: 'bi-shield-lock', Nombre: 'Seguridad', Contenido: '<i class="bi bi-shield-lock"></i>' },
        { ID: 'bi-building', Nombre: 'Oficina', Contenido: '<i class="bi bi-building"></i>' },
        { ID: 'bi-grid', Nombre: 'Aplicaciones', Contenido: '<i class="bi bi-grid"></i>' },
        { ID: 'bi-folder', Nombre: 'Modulos', Contenido: '<i class="bi bi-folder"></i>' },
        { ID: 'bi-key', Nombre: 'Accesos', Contenido: '<i class="bi bi-key"></i>' },
        { ID: 'bi-person-badge', Nombre: 'Roles', Contenido: '<i class="bi bi-person-badge"></i>' },
        { ID: 'bi-people', Nombre: 'Usuarios', Contenido: '<i class="bi bi-people"></i>' },
        { ID: 'bi-briefcase', Nombre: 'Empresas', Contenido: '<i class="bi bi-briefcase"></i>' },
        { ID: 'bi-bank', Nombre: 'Empresa', Contenido: '<i class="bi bi-bank"></i>' },
        { ID: 'bi-sliders', Nombre: 'Parámetros', Contenido: '<i class="bi bi-sliders"></i>' },
        { ID: 'bi bi-wrench', Nombre: 'Mantenimiento', Contenido: '<i class="bi bi bi-wrench"></i>' },
        { ID: 'bi-search', Nombre: 'Consulta', Contenido: '<i class="bi bi-search"></i>' },
        { ID: 'bi-cash-stack', Nombre: 'Créditos', Contenido: '<i class="bi bi-cash-stack"></i>' },
        { ID: 'bi-gear', Nombre: 'Operaciones', Contenido: '<i class="bi bi-gear"></i>' },
        { ID: 'bi-file-earmark-bar-graph', Nombre: 'Reportes', Contenido: '<i class="bi bi-file-earmark-bar-graph"></i>' },
        { ID: 'bi-person-badge-fill', Nombre: 'Oficialía', Contenido: '<i class="bi bi-person-badge-fill"></i>' },
        { ID: 'bi-bar-chart', Nombre: 'Indicadores', Contenido: '<i class="bi bi-bar-chart"></i>' },
        { ID: 'bi-folder-fill', Nombre: 'Documentos', Contenido: '<i class="bi bi-folder-fill"></i>' }
    ];
    return of(iconsModulos);
  }


  getIconsAcceso(): Observable<any[]> {
    const iconsAccesos = [
      { ID: 'bi-grid', Nombre: 'Aplicaciones', Contenido: '<i class="bi bi-grid"></i>' },
      { ID: 'bi-folder', Nombre: 'Módulos', Contenido: '<i class="bi bi-folder"></i>' },
      { ID: 'bi-key', Nombre: 'Accesos', Contenido: '<i class="bi bi-key"></i>' },
      { ID: 'bi-briefcase', Nombre: 'Empresas', Contenido: '<i class="bi bi-briefcase"></i>' },
      { ID: 'bi-building', Nombre: 'Oficinas', Contenido: '<i class="bi bi-building"></i>' },
      { ID: 'bi-person-badge', Nombre: 'Roles', Contenido: '<i class="bi bi-person-badge"></i>' },
      { ID: 'bi-people', Nombre: 'Usuarios', Contenido: '<i class="bi bi-people"></i>' },
      { ID: 'bi-gear', Nombre: 'Parámetros', Contenido: '<i class="bi bi-gear"></i>' },
      { ID: 'bi-collection', Nombre: 'Grupo de Datos', Contenido: '<i class="bi bi-collection"></i>' },
      { ID: 'bi-person-lines-fill', Nombre: 'Clientes', Contenido: '<i class="bi bi-person-lines-fill"></i>' },
      { ID: 'bi-person-workspace', Nombre: 'Asesores', Contenido: '<i class="bi bi-person-workspace"></i>' },
      { ID: 'bi-play-circle', Nombre: 'Simulador', Contenido: '<i class="bi bi-play-circle"></i>' },
      { ID: 'bi-cash-stack', Nombre: 'Consultas Crédito', Contenido: '<i class="bi bi-cash-stack"></i>' },
      { ID: 'bi-file-earmark', Nombre: 'Fic', Contenido: '<i class="bi bi-file-earmark"></i>' },
      { ID: 'bi-receipt-cutoff', Nombre: 'Comprobante Compra', Contenido: '<i class="bi bi-receipt-cutoff"></i>' },
      { ID: 'bi-wallet2', Nombre: 'Cartera del Cliente', Contenido: '<i class="bi bi-wallet2"></i>' },
      { ID: 'bi-file-earmark-text', Nombre: 'Solicitud Créditos', Contenido: '<i class="bi bi-file-earmark-text"></i>' },
      { ID: 'bi-arrow-right', Nombre: 'Traslado Cartera', Contenido: '<i class="bi bi-arrow-right"></i>' },
      { ID: 'bi-arrow-repeat', Nombre: 'Refinanciación', Contenido: '<i class="bi bi-arrow-repeat"></i>' },
      { ID: 'bi-x-circle', Nombre: 'Castigo Cartera', Contenido: '<i class="bi bi-x-circle"></i>' },
      { ID: 'bi-hand-thumbs-up', Nombre: 'Condonación', Contenido: '<i class="bi bi-hand-thumbs-up"></i>' },
      { ID: 'bi-currency-dollar', Nombre: 'Pago', Contenido: '<i class="bi bi-currency-dollar"></i>' },
      { ID: 'bi-box-arrow-in-down', Nombre: 'Desembolso', Contenido: '<i class="bi bi-box-arrow-in-down"></i>' },
      { ID: 'bi-bank', Nombre: 'Depósitos Bancarios', Contenido: '<i class="bi bi-bank"></i>' },
      { ID: 'bi-arrow-counterclockwise', Nombre: 'Extorno', Contenido: '<i class="bi bi-arrow-counterclockwise"></i>' },
      { ID: 'bi-x-octagon', Nombre: 'Pago Cancelación', Contenido: '<i class="bi bi-x-octagon"></i>' },
      { ID: 'bi-graph-up', Nombre: 'Proyección Desembolso', Contenido: '<i class="bi bi-graph-up"></i>' },
      { ID: 'bi-arrow-left', Nombre: 'Transferencias', Contenido: '<i class="bi bi-arrow-left"></i>' },
      { ID: 'bi-megaphone', Nombre: 'Campañas', Contenido: '<i class="bi bi-megaphone"></i>' },
      { ID: 'bi-exclamation-circle', Nombre: 'Clientes Morosos', Contenido: '<i class="bi bi-exclamation-circle"></i>' },
      { ID: 'bi-piggy-bank', Nombre: 'Ingresos Financieros', Contenido: '<i class="bi bi-piggy-bank"></i>' },
      { ID: 'bi-box-arrow-in-down', Nombre: 'Desembolsos', Contenido: '<i class="bi bi-box-arrow-in-down"></i>' },
      { ID: 'bi-people-fill', Nombre: 'Clientes Activos', Contenido: '<i class="bi bi-people-fill"></i>' },
      { ID: 'bi-calendar-check', Nombre: 'Pagos Diarios', Contenido: '<i class="bi bi-calendar-check"></i>' },
      { ID: 'bi-envelope-check', Nombre: 'Solicitudes Ingresadas', Contenido: '<i class="bi bi-envelope-check"></i>' },
      { ID: 'bi-card-checklist', Nombre: 'Cheques Emitidos', Contenido: '<i class="bi bi-card-checklist"></i>' },
      { ID: 'bi-x-circle-fill', Nombre: 'Cancelados Refinanciados', Contenido: '<i class="bi bi-x-circle-fill"></i>' },
      { ID: 'bi-wallet', Nombre: 'Cartera', Contenido: '<i class="bi bi-wallet"></i>' },
      { ID: 'bi-calendar3', Nombre: 'Cuadre Diario', Contenido: '<i class="bi bi-calendar3"></i>' },
      { ID: 'bi-cash-coin', Nombre: 'Cobros Diarios', Contenido: '<i class="bi bi-cash-coin"></i>' },
      { ID: 'bi-x-square', Nombre: 'Cancelación sin Renovación', Contenido: '<i class="bi bi-x-square"></i>' },
      { ID: 'bi-bank', Nombre: 'Depósitos en Bancos', Contenido: '<i class="bi bi-bank"></i>' },
      { ID: 'bi-arrow-counterclockwise', Nombre: 'Extorno', Contenido: '<i class="bi bi-arrow-counterclockwise"></i>' },
      { ID: 'bi-exclamation-triangle', Nombre: 'Base Negativa', Contenido: '<i class="bi bi-exclamation-triangle"></i>' },
      { ID: 'bi-arrow-left-right', Nombre: 'Transferencia', Contenido: '<i class="bi bi-arrow-left-right"></i>' },
      { ID: 'bi-shield', Nombre: 'Sentinel', Contenido: '<i class="bi bi-shield"></i>' },
      { ID: 'bi-arrows-angle-contract', Nombre: 'Transferencia entre Asesores', Contenido: '<i class="bi bi-arrows-angle-contract"></i>' },
      { ID: 'bi-cash', Nombre: 'Desembolso en Efectivo', Contenido: '<i class="bi bi-cash"></i>' },
      { ID: 'bi-printer', Nombre: 'Boletas de Venta Electrónica', Contenido: '<i class="bi bi-printer"></i>' },
      { ID: 'bi-receipt', Nombre: 'Facturas de Compra', Contenido: '<i class="bi bi-receipt"></i>' },
      { ID: 'bi-bell', Nombre: 'Notificación', Contenido: '<i class="bi bi-bell"></i>' },
      { ID: 'bi-arrow-down-circle', Nombre: 'Desembolso Vendedor', Contenido: '<i class="bi bi-arrow-down-circle"></i>' },
      { ID: 'bi-person-x', Nombre: 'Clientes Castigados', Contenido: '<i class="bi bi-person-x"></i>' },
      { ID: 'bi-hand-thumbs-up', Nombre: 'Condonación', Contenido: '<i class="bi bi-hand-thumbs-up"></i>' },
      { ID: 'bi-exclamation-triangle', Nombre: 'Base Negativa', Contenido: '<i class="bi bi-exclamation-triangle"></i>' },
      { ID: 'bi-folder2-open', Nombre: 'Documentos', Contenido: '<i class="bi bi-folder2-open"></i>' },
      { ID: 'bi-pen-fill', Nombre: 'Firma', Contenido: '<i class="bi bi-pen-fill"></i>' },
      { ID: 'bi-speedometer2', Nombre: 'Productividad', Contenido: '<i class="bi bi-speedometer2"></i>' },
      { ID: 'bi-gift', Nombre: 'Incentivos', Contenido: '<i class="bi bi-gift"></i>' },
      { ID: 'bi-bullseye', Nombre: 'Asignación de Metas', Contenido: '<i class="bi bi-bullseye"></i>' },
      { ID: 'bi-bar-chart-line', Nombre: 'Seguimiento de Avances', Contenido: '<i class="bi bi-bar-chart-line"></i>' },
      { ID: 'bi-file-earmark-bar-graph', Nombre: 'Reportes', Contenido: '<i class="bi bi-file-earmark-bar-graph"></i>' }
    ];
    return of(iconsAccesos);
  }
}
