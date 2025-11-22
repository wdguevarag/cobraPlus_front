import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-general-plus-check-btn',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './general-plus-check-btn.component.html',
  styleUrls: ['./general-plus-check-btn.component.scss']
})
export class GeneralPlusCheckBtnComponent {
  constructor(private location: Location) {

  }


  @Input() tipo: 'cancel' | 'check' | 'plus-show' | 'plus' | 'toggle' | 'edit-single' | 'check-form' = 'plus';

  @Input() submitFn!: (data: FormData) => Observable<any>;
  @Input() formData: FormData | { [key: string]: any };
  @Input() formId?: string;
  @Input() popupMessage: string = 'Guardado correctamente';
  @Output() formSubmit = new EventEmitter<void>();
  isLoading: boolean = false;
  showPopup: boolean = false;


  @Input() currentValue!: number;
  @Input() onToggle!: (newValue: number) => void;
  @Input() valorTrue: string = 'activado';
  @Input() valorFalse: string = 'desactivado';


  @Input() contentBtn: string;
  @Input() routerLink: string | string[] = '';



  // --- Salidas ---
  @Output() onSuccess = new EventEmitter<void>();
  @Output() onError = new EventEmitter<void>();

  @Output() plusShowEvent = new EventEmitter<void>();


  @Output() editStateChanged = new EventEmitter<boolean>();
  isEditing: boolean = false;










  toggle() {
    const newValue = this.currentValue === 1 ? 0 : 1;
    if (this.onToggle) {
      this.onToggle(newValue);
    }
  }

  check() {
    this.popupMessage = 'Guardado correctamente';
    this.showPopup = true;
  }

  cancel() {
    console.log('Guardando en la base de datos...');
  }

  plusShow() {
    this.plusShowEvent.emit();
  }
  

  edit() {
    console.log('Guardando en la base de datos...');
  }

  toggleEditSingle() {
    this.isEditing = !this.isEditing;
    this.editStateChanged.emit(this.isEditing);
  }

  closePopup() {
    this.showPopup = false;
    this.location.back();
  }

  async handleSubmit() {
    console.log('handleSubmit ejecutado');
  
    if (this.isLoading) return;

    let dataToSubmit: FormData;
  
    if (this.formData instanceof FormData) {
      dataToSubmit = this.formData;
    } else {
      dataToSubmit = new FormData();
      for (const key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
          dataToSubmit.append(key, this.formData[key]);
        }
      }
      console.log('Fila Creada :' , this.formData );
    }
    
    dataToSubmit.forEach((value, key) => {
      console.log(key, value);
    });
    
    this.isLoading = true;
    try {
      await firstValueFrom(this.submitFn(dataToSubmit));
      this.showPopup = true;
    } catch (error) {
      console.error('Error al guardar:', error);
      this.onError.emit();
    } finally {
      this.isLoading = false;
    }
  }
  

  
 
}













