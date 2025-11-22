import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-general-back-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-back-btn.component.html',
  styleUrls: ['./general-back-btn.component.scss'] // Nota: Cambié 'styleUrl' a 'styleUrls', que es lo correcto
})
export class GeneralBackBtnComponent {
  constructor(private location: Location) {} // Inyectar Location en el constructor
  @Input() tipo: 'cancel' | 'back' = 'back';

  goBack(): void {
    this.location.back(); // Navega a la ruta anterior en el historial
  }
}

