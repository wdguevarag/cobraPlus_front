import {
  Directive, Input,
  ElementRef, OnInit, OnDestroy,
  Renderer2, HostListener,
  AfterViewInit
} from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[fechaLimiteValidator]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: FechaLimiteDirective, multi: true }
  ]
})
export class FechaLimiteDirective implements Validator, OnInit, AfterViewInit, OnDestroy {
  @Input() minFecha?: string;
  @Input() maxFecha?: string;

  private controlEl: HTMLInputElement;
  private errorSpan: HTMLElement | null = null;
  private fechaSistema: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.controlEl = this.el.nativeElement;
  }

  ngOnInit(): void {
    const fechaSistemaStorage = localStorage.getItem('fechaSistemaStorage');
    this.fechaSistema = fechaSistemaStorage || new Date().toISOString().split('T')[0];

    if (!fechaSistemaStorage) {
      localStorage.setItem('fechaSistemaStorage', this.fechaSistema);
    }

    if (this.minFecha === 'sistema') this.minFecha = this.fechaSistema;
    if (this.maxFecha === 'sistema') this.maxFecha = this.fechaSistema;
  }

  ngAfterViewInit(): void {
    if (this.minFecha) {
      this.renderer.setAttribute(this.controlEl, 'min', this.minFecha);
      if (!this.controlEl.value || this.controlEl.value < this.minFecha) {
        this.renderer.setProperty(this.controlEl, 'value', this.minFecha);
        this.controlEl.dispatchEvent(new Event('input'));
      }
    }

    if (this.maxFecha) {
      this.renderer.setAttribute(this.controlEl, 'max', this.maxFecha);
      if (!this.controlEl.value || this.controlEl.value > this.maxFecha) {
        this.renderer.setProperty(this.controlEl, 'value', this.maxFecha);
        this.controlEl.dispatchEvent(new Event('input'));
      }
    }
  }

  ngOnDestroy(): void {
    this.removeErrorMessage();
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    this.removeErrorMessage();
    const val: string = control.value;
    if (!val) return null;

    if (this.minFecha && val < this.minFecha) {
      return this.handleError(control, `La fecha debe ser ≥ ${this.minFecha}`, 'minFecha');
    }

    if (this.maxFecha && val > this.maxFecha) {
      return this.handleError(control, `La fecha debe ser ≤ ${this.maxFecha}`, 'maxFecha');
    }

    return null;
  }

  private handleError(control: AbstractControl, message: string, key: string) {
    const error = { [key]: { valid: false, message } };
    this.displayError(error);
    setTimeout(() => {
      this.renderer.setProperty(this.controlEl, 'value', '');
      this.controlEl.dispatchEvent(new Event('input'));
      control.markAsTouched();
      control.updateValueAndValidity();
      this.removeErrorMessage();
    }, 2000);
    return error;
  }

  private displayError(error: { [key: string]: any }): void {
    const key = Object.keys(error)[0];
    const message = error[key].message;

    if (!this.errorSpan) {
      this.errorSpan = this.renderer.createElement('span');
      this.renderer.setStyle(this.errorSpan, 'color', 'red');
      this.renderer.setStyle(this.errorSpan, 'display', 'block');
      this.renderer.setStyle(this.errorSpan, 'fontSize', '0.9em');
      const text = this.renderer.createText(message);
      this.renderer.appendChild(this.errorSpan, text);
      const parent = this.controlEl.parentElement;
      if (parent) this.renderer.appendChild(parent, this.errorSpan);
    } else {
      this.errorSpan.textContent = message;
    }
  }

  private removeErrorMessage(): void {
    if (this.errorSpan && this.controlEl.parentElement) {
      this.renderer.removeChild(this.controlEl.parentElement, this.errorSpan);
      this.errorSpan = null;
    }
  }
}
