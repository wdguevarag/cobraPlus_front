import { Component , OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { GrupoDeDatoService } from '../../../../../../Services/grupo-de-datos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-dato',
  templateUrl: './single-dato.component.html',
  styleUrl: './single-dato.component.scss'
})
export class SingleDatoComponent {

  isLoading: boolean = true;
  isEditing: boolean = false;

  singleDatoId : number | null = null;
  singleDatoData: any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private grupoDeDatoService: GrupoDeDatoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleDatoId = +params.get('id2')!;
      if (this.singleDatoId) {
        this.grupoDeDatoService.getDetalleGrupoDatosById(this.singleDatoId).subscribe(
          (data) => {
            this.singleDatoData = data;
          },
          (error) => {
            console.error('Error al obtener el dato:', error);
          }
        );
      }
    });
  }

  toggleStatus(newEstado: string): void {
    if (this.singleDatoData) {
      this.singleDatoData.estado = newEstado;
      console.log('Nuevo estado:', newEstado);
    }
  }

  submitFn = (data: any) => this.grupoDeDatoService.editDetalleGrupoDatos(data);

  updateEstado = (newValue: number) => {
    if (this.singleDatoData) {
      this.singleDatoData.Estado = newValue;
    }
  }
}
