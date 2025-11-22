import { Directive, Input, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, tap, switchMap } from 'rxjs/operators';

@Directive({
  selector: '[uniqueValueValidator]',
  standalone: true,
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: UniqueValueValidatorDirective, multi: true }
  ]
})
export class UniqueValueValidatorDirective implements AsyncValidator, OnInit, OnDestroy {
  @Input('uniqueValueValidator') property!: string;
  @Input() bancoFn!: () => Observable<any[]>;
  @Input() filterFn?: (item: any) => boolean;
  @Input() excludeId?: number;
  @Input() mensajeError: string = 'Valor ya en uso';

  private errorSpan: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (!this.bancoFn) {
      throw new Error('Se debe proporcionar una función para obtener el banco de objetos');
    }
    if (!this.property) {
      throw new Error('Se debe proporcionar la propiedad a validar');
    }
  }

  ngOnDestroy(): void {
    if (this.errorSpan && this.el.nativeElement.parentElement) {
      this.renderer.removeChild(this.el.nativeElement.parentElement, this.errorSpan);
    }
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(null).pipe(
      debounceTime(300),
      switchMap(() => this.bancoFn()),
      map((items: any[]) => {
        if (this.filterFn) {
          items = items.filter(this.filterFn);
        }
        if (this.excludeId !== undefined && this.excludeId !== null) {
          items = items.filter(item => item.ID !== this.excludeId);
        }
        const exists = items.some(item => item[this.property] == control.value);
        const error = exists ? { uniqueValue: { valid: false, message: this.mensajeError } } : null;
        this.displayErrorIfNeeded(error, control);
        return error;
      })
    );
  }

  private displayErrorIfNeeded(error: ValidationErrors | null, control: AbstractControl): void {
    if (error && error['uniqueValue']) {
      // Mostrar mensaje de error
      if (!this.errorSpan) {
        this.errorSpan = this.renderer.createElement('span');
        this.renderer.setStyle(this.errorSpan, 'color', 'red');
        this.renderer.setStyle(this.errorSpan, 'display', 'block');
        this.renderer.setStyle(this.errorSpan, 'fontSize', '0.9em');
        const text = this.renderer.createText(error['uniqueValue'].message);
        this.renderer.appendChild(this.errorSpan, text);
        const parent = this.el.nativeElement.parentElement;
        this.renderer.appendChild(parent, this.errorSpan);
      } else {
        this.errorSpan.textContent = error['uniqueValue'].message;
      }

      // Limpiar el input después de 2 segundos
      setTimeout(() => {
        control.setValue('');
        control.markAsTouched();
        control.updateValueAndValidity();
        if (this.errorSpan && this.el.nativeElement.parentElement) {
          this.renderer.removeChild(this.el.nativeElement.parentElement, this.errorSpan);
          this.errorSpan = null;
        }
      }, 2000);

    } else if (this.errorSpan && this.el.nativeElement.parentElement) {
      // Quitar mensaje si ya no hay error
      this.renderer.removeChild(this.el.nativeElement.parentElement, this.errorSpan);
      this.errorSpan = null;
    }
  }
}
