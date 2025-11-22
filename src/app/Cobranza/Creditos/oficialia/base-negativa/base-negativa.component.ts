


/* Actualización del componente BaseNegativaComponent para mostrar un popup con formulario de comentario */

// base-negativa.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseNegativeService } from '../../../../Services/base-negativa.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-base-negativa',
  templateUrl: './base-negativa.component.html',
  styleUrls: ['./base-negativa.component.scss']
})
export class BaseNegativaComponent implements OnInit {
  basesNegativasColumns = [
    { header: 'Id', field: 'ID', show: true },
    { header: 'Cliente', contentField: 'Cliente_Nombre +  " " + Cliente_Apellido_Paterno + " " + Cliente_Apellido_Materno' },
    { header: 'Motivo', field: 'Motivo_Nombre' },
    // { header: 'Motivo', field: 'Motivo' },
    { header: 'Comentario', field: 'Comentario' },
    // { header: 'Fecha', field: 'Fecha_Base_Negativa', noNumeric: true },
    { header: 'Fecha', field: 'Fecha_Sistema_Base_Negativa', noNumeric: true },
    { header: 'Levantar', contentField: 'Levantar', type: 'button' }
  ];

  BasesNegativasData: any[] = [];
  showCommentModal = false;
  selectedId: number | null = null;
  currentUser: any;
  commentForm: FormGroup;

  constructor(
    private router: Router,
    private baseNegativaService: BaseNegativeService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Inicializar el formulario
    this.commentForm = this.fb.group({
      comentario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadBasesNegativas();
    });
  }

  private loadBasesNegativas(): void {
    this.baseNegativaService.getBaseNegativas().subscribe(
      resp => this.BasesNegativasData = resp.filter(
        item => item.Cliente_Empresa_ID === this.currentUser.Empresa_ID && item.Estado === '1'
      ),
      err => console.error('Error al obtener bases negativas', err)
    );
  }

  onButtonAction(event: { contentField: string; id: number }): void {
    if (event.contentField === 'Levantar') {
      this.selectedId = event.id;
      this.commentForm.reset(); // limpiar comentario previo
      this.showCommentModal = true;
    }
  }

  submitComment(): void {
    if (this.commentForm.invalid || this.selectedId === null) {
      return;
    }

    // Construir FormData
    const formData = new FormData();
    formData.append('ID', this.selectedId.toString());
    formData.append('Usuario_Levantamiento', this.currentUser.ID.toString());
    formData.append('Comentario_Levantamiento', this.commentForm.value.comentario);

    this.baseNegativaService.levantarBaseNegativa(formData).subscribe(
      res => {
        console.log('Base Negativa levantada con comentario:', res);
        this.loadBasesNegativas();
        this.closeModal();
      },
      err => {
        console.error('Error al levantar base negativa', err);
        this.closeModal();
      }
    );
  }

  closeModal(): void {
    this.showCommentModal = false;
    this.selectedId = null;
  }

  onRowClick(event: { id: number }): void {
    this.router.navigate([
      '/creditos/oficialia/base-negativa/single-base-negativa',
      event.id
    ]);
  }
}
