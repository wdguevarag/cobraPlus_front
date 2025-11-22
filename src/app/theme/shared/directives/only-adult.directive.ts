import { Directive, Input, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[adultValidator]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: OnlyAdultDirective, multi: true }
  ]
})
export class OnlyAdultDirective implements Validator, OnInit, OnDestroy {
  /**
   * Fecha de referencia para el cálculo de edad. Si no se provee,
   * se toma de localStorage: 'fechaSistemaStorage'. Formato ISO string: 'YYYY-MM-DD'.
   */
  @Input('adultValidator') fechaSistema?: string;
  private controlEl: HTMLInputElement;
  private errorSpan: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.controlEl = this.el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.fechaSistema) {
      this.fechaSistema = localStorage.getItem('fechaSistemaStorage') || '';
    }
    if (!this.fechaSistema) {
      console.warn('OnlyAdultDirective: no se encontró fechaSistema en localStorage ni como Input');
    }
  }

  ngOnDestroy(): void {
    this.removeErrorMessage();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.removeErrorMessage();

    const inputValue = control.value;
    if (!inputValue || !this.fechaSistema) {
      return null;
    }
    const birthDate = new Date(inputValue);
    const sysDate = new Date(this.fechaSistema);
    const age = this.calculateAge(birthDate, sysDate);

    if (age < 18) {
      const error = { adult: { valid: false, message: 'Solo se permiten Mayores de Edad' } };
      this.displayError(error);

      // Limpiar el input y quitar mensaje tras 2 segundos
      setTimeout(() => {
        // Limpiar valor del DOM
        this.controlEl.value = '';
        // Limpiar FormControl asociado
        control.setValue('', { emitEvent: true });
        control.markAsTouched();
        control.updateValueAndValidity();
        this.removeErrorMessage();
      }, 2000);

      return error;
    }
    return null;
  }

  private calculateAge(birth: Date, reference: Date): number {
    let age = reference.getFullYear() - birth.getFullYear();
    const m = reference.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && reference.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  private displayError(error: ValidationErrors): void {
    if (!this.errorSpan) {
      this.errorSpan = this.renderer.createElement('span');
      this.renderer.setStyle(this.errorSpan, 'color', 'red');
      this.renderer.setStyle(this.errorSpan, 'display', 'block');
      this.renderer.setStyle(this.errorSpan, 'fontSize', '0.9em');
      const text = this.renderer.createText(error['adult'].message);
      this.renderer.appendChild(this.errorSpan, text);
      const parent = this.controlEl.parentElement;
      if (parent) {
        this.renderer.appendChild(parent, this.errorSpan);
      }
    } else {
      this.errorSpan.textContent = error['adult'].message;
    }
  }

  private removeErrorMessage(): void {
    if (this.errorSpan && this.controlEl.parentElement) {
      this.renderer.removeChild(this.controlEl.parentElement, this.errorSpan);
      this.errorSpan = null;
    }
  }
}
