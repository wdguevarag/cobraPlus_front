import { Component, Input, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submit-form.component.html',
  styleUrls: ['./submit-form.component.scss']
})
export class SubmitFormComponent {
  @Input() form!: FormGroup;
  // La función de envío recibe un FormData y retorna un Observable
  @Input() submitFn!: (data: FormData) => Observable<any>;
  @Input() label: string = 'Enviar';
  @Input() loadingLabel: string = 'Enviando...';
  @Input() redirectRoute?: string | string[];

  @Input() reload: boolean = false;

  // Declaramos los nombres de los campos obligatorios
  @Input() requiredFields: string[] = [];

  loading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private el: ElementRef,       // Para acceder al DOM
    private renderer: Renderer2   // Para manipular el DOM de forma segura
  ) {}

  // Transforma el FormGroup en un FormData
  private createFormData(): FormData {
    const formData = new FormData();
    Object.keys(this.form.controls).forEach(key => {
      const value = this.form.get(key)?.value;
      if (value !== null && value !== undefined) {
        // Si el valor es un File o similar se agrega directamente; en otros casos, se convierte a string
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
    });
    return formData;
  }


  async handleSubmit() {
    // Obtenemos el formulario padre de forma dinámica
    const formElement = this.el.nativeElement.closest('form');
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
  
      // Recorremos los campos obligatorios para resaltar aquellos que sean inválidos
      this.requiredFields.forEach(field => {
        const control = this.form.get(field);
        if (control && control.invalid && formElement) {
          // Buscamos el input correspondiente usando formControlName o id
          const inputElement = formElement.querySelector(`[formControlName="${field}"], [id="${field}"]`);
          if (inputElement) {
            // Agregamos la clase CSS para resaltar el input
            this.renderer.addClass(inputElement, 'invalid-field');
            // Si no existe el mensaje de error, lo creamos
            if (!inputElement.parentElement.querySelector('.error-message')) {
              const errorSpan = this.renderer.createElement('span');
              this.renderer.addClass(errorSpan, 'error-message');
              const text = this.renderer.createText('Campo obligatorio');
              this.renderer.appendChild(errorSpan, text);
              // Insertamos el mensaje justo después del input
              this.renderer.appendChild(inputElement.parentElement, errorSpan);
            }
  
            // Suscribirse a los cambios del valor para remover el error cuando sea válido
            const subscription = control.valueChanges.subscribe(() => {
              if (control.valid) {
                this.renderer.removeClass(inputElement, 'invalid-field');
                const errorMsg = inputElement.parentElement.querySelector('.error-message');
                if (errorMsg) {
                  this.renderer.removeChild(inputElement.parentElement, errorMsg);
                }
                subscription.unsubscribe();
              }
            });
          }
        }
      });
  
      // Mostrar mensaje global en un popup
      this.popupMessage = 'Por favor, complete todos los campos obligatorios.';
      this.showPopup = true;
      return;
    }
  
    // Protección contra doble click
    if (this.loading) return;

    // Si el formulario es válido, se remueven los resaltados previos
    this.removeInvalidHighlights();

    this.loading = true;
    try {
      const dataToSubmit = this.createFormData();
      const response = await firstValueFrom(this.submitFn(dataToSubmit));
      // Lógica de respuesta...
      const errorMessage = response.vdesError || response.desError;
      const errorCode = Number(response.icodError);
      if (errorCode !== 0) {
        this.popupMessage = errorMessage || 'Error al enviar el formulario.';
        this.isSuccess = false;
      } else {
        this.popupMessage = errorMessage || 'Se envió el formulario correctamente.';
        this.isSuccess = true;
      }
      this.showPopup = true;
    } catch (err) {
      console.error('Error al ejecutar el servicio con el formulario:', err);
    } finally {
      this.loading = false;
    }
  }
  
  private removeInvalidHighlights() {
    const formElement = this.el.nativeElement.closest('form');
    this.requiredFields.forEach(field => {
      if (formElement) {
        const inputElement = formElement.querySelector(`[formControlName="${field}"], [id="${field}"]`);
        if (inputElement) {
          this.renderer.removeClass(inputElement, 'invalid-field');
          const errorMsg = inputElement.parentElement.querySelector('.error-message');
          if (errorMsg) {
            this.renderer.removeChild(inputElement.parentElement, errorMsg);
          }
        }
      }
    });
  }
  


  closePopup() {
    this.showPopup = false;
    if (this.isSuccess) {
      if (this.redirectRoute) {
        let route: string;
        if (Array.isArray(this.redirectRoute)) {
          route = this.redirectRoute.join('/');
        } else {
          route = this.redirectRoute;
        }
        this.router.navigateByUrl(route).then(() => {
          if (this.reload) {
            window.location.reload();
          }
        });
      } else {
        if (this.reload) {
          window.location.reload();
        } else {
          this.location.back();
        }
      }
    }
  }
  
  
}
