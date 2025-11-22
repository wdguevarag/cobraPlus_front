import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-btn-back',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-back.component.html',
  styleUrl: './btn-back.component.scss'
})
export class BtnBackComponent {
  constructor(private location: Location) {} // Inyectar Location en el constructor
  // @Input() tipo: 'cancel' | 'back' = 'back';

  goBack(): void {
    this.location.back(); // Navega a la ruta anterior en el historial
  }
}