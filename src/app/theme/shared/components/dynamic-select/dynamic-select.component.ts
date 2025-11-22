import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';

@Component({
  selector: 'app-dynamic-select',
  templateUrl: './dynamic-select.component.html',
  styleUrls: ['./dynamic-select.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicSelectComponent),
      multi: true
    }
  ]
})
export class DynamicSelectComponent implements OnInit, ControlValueAccessor {

  @Input() groupId!: number;
  @Input() valueField: string = 'ID';
  @Input() displayField: string = 'Nombre';
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() editable: boolean = true; // Nueva propiedad para controlar el modo

  options: any[] = [];
  selectedValue: any;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private grupoDeDatoService: GrupoDeDatoService) { }

  ngOnInit(): void {
    this.grupoDeDatoService.getDetalleGrupoDatos(this.groupId)
    .subscribe(data => {
      this.options = data;
      // Fuerza a que el <select> marque la opción actual
      this.writeValue(this.selectedValue);
    });
  }





  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementa la lógica para deshabilitar el componente si es necesario
  }

  onSelectChange(event: any): void {
    const value = event.target.value;
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }

  getDisplayValue(): string {
    if (!this.options || !this.selectedValue) return '';
    const found = this.options.find(option => option[this.valueField] == this.selectedValue);
    return found ? found[this.displayField] : '';
  }
}
