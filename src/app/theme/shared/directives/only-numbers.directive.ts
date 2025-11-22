import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[onlyNumbers]',
  standalone: true
})

export class OnlyNumbersDirective {

  @HostListener('input', ['$event']) onInputChange(event: any): void {
    const initalValue = event.target.value;
    event.target.value = initalValue.replace(/[^0-9]/g, '');
    if (initalValue !== event.target.value) {
      event.stopPropagation();
    }
  }
}
