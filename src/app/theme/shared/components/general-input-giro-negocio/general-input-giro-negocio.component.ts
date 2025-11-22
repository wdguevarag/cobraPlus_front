import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, OnInit, Output, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { GiroNegocioService } from 'src/app/Services/giro-negocio/giro-negocio.service';

export interface GiroNegocio {
  ID: string;
  Nombre: string;
}

@Component({
  selector: 'app-general-input-giro-negocio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-input-giro-negocio.component.html',
  styleUrls: ['./general-input-giro-negocio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralInputGiroNegocioComponent),
      multi: true
    }
  ]
})
export class GeneralInputGiroNegocioComponent implements OnInit, ControlValueAccessor {
  @Output() giroSeleccionado = new EventEmitter<GiroNegocio>();
  @Input() editable = true;

  searchControl = new FormControl('');
  filteredGiros!: Observable<GiroNegocio[]>;
  private allGiros: GiroNegocio[] = [];
  showSuggestions = false;
  private initialValue: string | null = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private giroService: GiroNegocioService) {}

  ngOnInit(): void {
    this.giroService.getGirosNegocio().subscribe(data => {
      this.allGiros = data;
      this.setupFilter();

      // Si había un valor inicial, aplicarlo al input
      if (this.initialValue) {
        const match = this.allGiros.find(g => g.ID === this.initialValue);
        if (match) {
          this.searchControl.setValue(match.Nombre, { emitEvent: false });
          this.giroSeleccionado.emit(match);
        }
      }
    });

    this.searchControl.valueChanges.subscribe((val: string) => {
      const match = this.allGiros.find(g => g.Nombre.toLowerCase() === val?.toLowerCase());
      if (match) {
        this.onChange(match.ID);
        this.giroSeleccionado.emit(match);
      } else {
        this.onChange(null);
      }
    });
  }

  private setupFilter() {
    this.filteredGiros = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val || ''))
    );
  }

  private _filter(val: string): GiroNegocio[] {
    const filterValue = val.toLowerCase();
    return this.allGiros.filter(g =>
      g.Nombre.toLowerCase().includes(filterValue)
    );
  }

  onFocus() {
    if (!this.editable) return;
    this.showSuggestions = true;
  }

  onBlur() {
    this.onTouched();
    setTimeout(() => (this.showSuggestions = false), 200);
  }

  onSelect(giro: GiroNegocio) {
    if (!this.editable) return;
    this.searchControl.setValue(giro.Nombre);
    this.onChange(giro.ID);
    this.giroSeleccionado.emit(giro);
    this.showSuggestions = false;
  }

  writeValue(value: string): void {
    this.initialValue = value;

    if (this.allGiros.length > 0) {
      const match = this.allGiros.find(g => g.ID === value);
      if (match) {
        this.searchControl.setValue(match.Nombre, { emitEvent: false });
        this.giroSeleccionado.emit(match);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }
}