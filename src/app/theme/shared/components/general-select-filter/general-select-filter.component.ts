import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-general-select-filter',
  templateUrl: './general-select-filter.component.html',
  styleUrls: ['./general-select-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralSelectFilterComponent),
      multi: true
    }
  ]
})
export class GeneralSelectFilterComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() service: any;
  @Input() method: string = '';
  @Input() idGrupo?: number;
  @Input() fieldValue: string = 'ID';
  @Input() fieldContent: string = 'Nombre';
  @Input() name: string = '';
  @Input() autoSelectSingle: boolean = true;
  @Input() filterFn?: (option: any) => boolean;
  @Input() editable: boolean = true;

  options: any[] = [];
  value: any;

  onChange: (_: any) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.loadOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['idGrupo'] ||
      changes['method'] ||
      changes['service'] ||
      changes['filterFn']
    ) {
      this.loadOptions();
    }
  }

  private loadOptions(): void {
    if (!this.service || !this.method || typeof this.service[this.method] !== 'function') {
      console.error('Servicio o método inválido.');
      return;
    }

    const request =
      this.idGrupo !== undefined && this.idGrupo !== null
        ? this.service[this.method](this.idGrupo)
        : this.service[this.method]();

    request.subscribe(
      (data: any[]) => {
        const opcionesFiltradas = this.filterFn ? data.filter(this.filterFn) : data;
        this.options = opcionesFiltradas;

        console.log('[Select]', this.name, '→ opciones filtradas:', opcionesFiltradas);

        if (
          this.autoSelectSingle &&
          opcionesFiltradas.length === 1 &&
          (this.value === null || this.value === undefined)
        ) {
          const autoValue = opcionesFiltradas[0][this.fieldValue];
          console.log('[AutoSelect ACTIVADO]', this.name, '→ valor:', autoValue);
          this.writeValue(autoValue);
          this.onChange(autoValue);
        } else {
          console.log('[AutoSelect OMITIDO]', this.name, {
            autoSelectSingle: this.autoSelectSingle,
            cantidad: opcionesFiltradas.length,
            valorActual: this.value
          });
        }
      },
      (error: any) => {
        console.error('Error al obtener las opciones:', error);
      }
    );
  }

  writeValue(value: any): void {
    console.log('[writeValue]', this.name, '→', value);
    this.value = value;
  }

  registerOnChange(fn: any): void {
    console.log('[registerOnChange]', this.name);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('[registerOnTouched]', this.name);
    this.onTouched = fn;
  }

  updateValue(newValue: any): void {
    console.log('[updateValue]', this.name, '→', newValue);
    this.value = newValue;
    this.onChange(newValue);
  }

  onSelectChange(newValue: any): void {
    console.log('[onSelectChange]', this.name, '→', newValue);
    this.updateValue(newValue);
  }
}