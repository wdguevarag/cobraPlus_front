import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appDateFormat]',
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateFormatDirective),
    multi: true
  }]
})
export class DateFormatDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const formatted = this.formatDate(value);
    this.writeValue(formatted);
    this.onChange(formatted);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    if (value) {
      this.el.nativeElement.value = this.parseToInputFormat(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  
  private formatDate(value: string): string {
    // Convertir de yyyy-mm-dd (input) a dd-mm-yyyy
    const [year, month, day] = value.split('-');
    return `${day}-${month}-${year}`; // <- Cambiar / por -
  }

  private parseToInputFormat(value: string): string {
    // Convertir de dd-mm-yyyy a yyyy-mm-dd (input)
    const [day, month, year] = value.split('-'); // <- Cambiar / por -
    return `${year}-${month}-${day}`;
  }
}


