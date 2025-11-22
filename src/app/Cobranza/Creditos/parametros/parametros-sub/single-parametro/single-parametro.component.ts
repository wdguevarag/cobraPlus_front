import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParametroService } from '../../../../../Services/parametros.service';

@Component({
  selector: 'app-single-parametro',
  templateUrl: './single-parametro.component.html',
  styleUrl: './single-parametro.component.scss'
})
export class SingleParametroComponent implements OnInit {

  isEditing = false;
  singleParametroId: number | null = null;
  singleParametroData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parametroService: ParametroService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleParametroId = +params.get('id')!;
      if(this.singleParametroId) {
        this.parametroService.getParametroById(this.singleParametroId).subscribe(
          (data) => {
            this.singleParametroData = data;
            console.log('Datos del parametro:', this.singleParametroData);
          },
          (error) => {
            console.error('Error al obtener el parametro:', error);
          }
        );
      }
    });
  }

  submitFn = (data: any) => this.parametroService.editParametro(data);

  updateEstado = (newValue: number) => {
    if (this.singleParametroData) {
      this.singleParametroData.Estado = newValue;
    }
  };
}
