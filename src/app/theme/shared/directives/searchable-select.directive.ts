// searchable-select.directive.ts
import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[searchMode]',
  standalone: true

})
export class SearchableSelectDirective implements OnInit, OnDestroy {
  private selectEl: HTMLSelectElement;
  private inputEl!: HTMLInputElement;
  private dropdownEl!: HTMLUListElement;
  private originalOptions: { text: string; value: string }[] = [];
  private listeners: (() => void)[] = [];
  private observer!: MutationObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.selectEl = this.el.nativeElement;
  }

  ngOnInit() {
    console.log('[searchMode] Directiva iniciada');
    const parent = this.renderer.parentNode(this.selectEl);
    // Aseguramos posicionamiento relativo para controlar el dropdown
    this.renderer.setStyle(parent, 'position', 'relative');

    // 1) Ocultar el select original (mantiene el formControl intacto)
    this.renderer.setStyle(this.selectEl, 'display', 'none');

    // 2) Crear input de búsqueda
    this.inputEl = this.renderer.createElement('input');
    this.renderer.setAttribute(this.inputEl, 'type', 'text');
    this.renderer.setAttribute(this.inputEl, 'placeholder', 'Buscar...');
    this.renderer.setStyle(this.inputEl, 'width', '100%');
    this.renderer.setStyle(this.inputEl, 'boxSizing', 'border-box');
    this.renderer.setStyle(this.inputEl, 'marginBottom', '4px');


    this.renderer.addClass(this.inputEl, 'form-control');


    // 3) Crear contenedor de dropdown
    this.dropdownEl = this.renderer.createElement('ul');
    this.renderer.setStyle(this.dropdownEl, 'listStyle', 'none');
    this.renderer.setStyle(this.dropdownEl, 'padding', '0');
    this.renderer.setStyle(this.dropdownEl, 'margin', '0');
    this.renderer.setStyle(this.dropdownEl, 'border', '1px solid #ccc');
    this.renderer.setStyle(this.dropdownEl, 'maxHeight', '150px');
    this.renderer.setStyle(this.dropdownEl, 'overflowY', 'auto');
    this.renderer.setStyle(this.dropdownEl, 'display', 'none');
    this.renderer.setStyle(this.dropdownEl, 'backgroundColor', '#fff');
    this.renderer.setStyle(this.dropdownEl, 'position', 'absolute');
    this.renderer.setStyle(this.dropdownEl, 'width', '100%');
    this.renderer.setStyle(this.dropdownEl, 'zIndex', '1000');

    // 4) Insertar input y dropdown antes del select
    this.renderer.insertBefore(parent, this.inputEl, this.selectEl);
    this.renderer.insertBefore(parent, this.dropdownEl, this.selectEl);

    // 5) Listener de input (filtrado)
    this.listeners.push(
      this.renderer.listen(this.inputEl, 'input', () => this.onSearch())
    );

    // 6) Listener de clic fuera (ocultar dropdown)
    this.listeners.push(
      this.renderer.listen('document', 'click', (event: Event) => {
        if (
          event.target !== this.inputEl &&
          !this.dropdownEl.contains(event.target as Node)
        ) {
          this.hideDropdown();
        }
      })
    );

    // 7) Observer para detectar cuando Angular termine de renderizar opciones
    this.observer = new MutationObserver(() => {
      if (this.selectEl.options.length > 1) {
        this.initOriginalOptions();
        this.observer.disconnect();
      }
    });
    this.observer.observe(this.selectEl, { childList: true });
  }

  /** Carga todas las opciones que llegarán vía *ngFor */
  private initOriginalOptions() {
    this.originalOptions = Array.from(this.selectEl.options)
      .filter(opt => !opt.disabled && opt.value !== '')
      .map(opt => ({ text: opt.text, value: opt.value }));
    console.log('[searchMode] Opciones cargadas:', this.originalOptions);
  }

  /** Filtra según input y reconstruye el dropdown */
  private onSearch() {
    const term = this.inputEl.value.trim().toLowerCase();
    console.log('[searchMode] Texto buscado:', term);

    // Limpiar dropdown actual
    this.dropdownEl.innerHTML = '';

    // Filtrar
    const matches = this.originalOptions.filter(opt =>
      opt.text.toLowerCase().includes(term)
    );

    if (matches.length === 0) {
      const li = this.renderer.createElement('li');
      this.renderer.setStyle(li, 'padding', '8px');
      this.renderer.setProperty(li, 'textContent', 'Sin coincidencias');
      this.renderer.appendChild(this.dropdownEl, li);
      console.log('[searchMode] Sin coincidencias');
    } else {
      matches.forEach(opt => {
        const li = this.renderer.createElement('li');
        this.renderer.setStyle(li, 'padding', '8px');
        this.renderer.setStyle(li, 'cursor', 'pointer');
        this.renderer.setProperty(li, 'textContent', opt.text);

        // Al hacer clic sobre la opción:
        const unbind = this.renderer.listen(li, 'click', () => {
          // 1) Actualizar input
          this.inputEl.value = opt.text;
          // 2) Actualizar select y disparar change
          this.selectEl.value = opt.value;
          this.selectEl.dispatchEvent(
            new Event('change', { bubbles: true })
          );
          // 3) Ocultar dropdown
          this.hideDropdown();
        });
        this.listeners.push(unbind);

        this.renderer.appendChild(this.dropdownEl, li);
      });
      console.log('[searchMode] Opciones visibles:', matches.map(m => m.text));
    }

    this.showDropdown();
  }

  private showDropdown() {
    this.renderer.setStyle(this.dropdownEl, 'display', 'block');
  }
  private hideDropdown() {
    this.renderer.setStyle(this.dropdownEl, 'display', 'none');
  }

  ngOnDestroy() {
    // Limpiar listeners y observer
    this.listeners.forEach(unbind => unbind());
    this.observer.disconnect();
    // Remover elementos creados
    const parent = this.renderer.parentNode(this.selectEl);
    this.renderer.removeChild(parent, this.inputEl);
    this.renderer.removeChild(parent, this.dropdownEl);
    // Mostrar de nuevo el select original
    this.renderer.removeStyle(this.selectEl, 'display');
    console.log('[searchMode] Directiva destruida');
  }
}
