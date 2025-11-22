import { Directive, HostListener, Self, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[onlyMayus]',
  standalone: true
})
export class OnlyMayusDirective {
  constructor(@Optional() @Self() private ngControl: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: any): void {
    const initialValue: string = event.target.value;
    const upperValue = initialValue.toUpperCase();

    if (upperValue !== initialValue) {
      // Actualiza el input en el DOM
      event.target.value = upperValue;
      // Actualiza el FormControl asociado
      if (this.ngControl && this.ngControl.control) {
        this.ngControl.control.setValue(upperValue, {
          emitEvent: false  // Evita emitir múltiples eventos de cambio (opcional)
        });
      }
    }
  }
}
