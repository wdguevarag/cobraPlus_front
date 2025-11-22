import { Component , OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { GrupoDeDatoService } from '../../../../../Services/grupo-de-datos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-grupo-de-dato',
  templateUrl: './single-grupo-de-dato.component.html',
  styleUrl: './single-grupo-de-dato.component.scss'
})
export class SingleGrupoDeDatoComponent implements OnInit {

  
  isEditing: boolean = false;

  DatosColumns: any[] = [
    { header: 'Codigo', field: 'ID', show: true },
    { header: 'Nombre', field: 'Nombre' },
    { header: 'Descripcion', field: 'Descripcion' },
    { header: 'Valor', field: 'Valor' },
    { header: 'Estado', field: 'Estado', type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' },
  ];
  DatosData: any[] = [];

  singleGrupoDeDatoId: number | null = null;
  singleGrupoDeDatoData: any;

  grupoDatoForm!: FormGroup;


  constructor(
    private router: Router ,
    private route: ActivatedRoute,
    private grupoDeDatoService: GrupoDeDatoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleGrupoDeDatoId = +params.get('id')!;
      if (this.singleGrupoDeDatoId) {

        this.grupoDeDatoService.getGrupoDatosById(this.singleGrupoDeDatoId).subscribe(
          (data) => {
            this.singleGrupoDeDatoData = data;
            this.initForm();
            this.grupoDeDatoService.getDetalleGrupoDatos(this.singleGrupoDeDatoId).subscribe(
              (data) => {
                this.DatosData = data;
                console.log('Datos asignados al grupo de datos obtenidos:', this.DatosData);
              },
              (error) => {
                console.error('Error al obtener los datos asignados al grupo de datos:', error);
              }
            )
          },
          (error) => {
            console.error('Error al obtener el grupo de datos:', error);
          }
        );
      }
    });
  }


  initForm() {
    this.grupoDatoForm = this.fb.group({
      ID: [this.singleGrupoDeDatoData.ID , Validators.required],
      Nombre: [this.singleGrupoDeDatoData.Nombre , Validators.required],
      Descripcion: [this.singleGrupoDeDatoData.Descripcion , Validators.required],
      Estado: [this.singleGrupoDeDatoData.Estado , Validators.required],
    });
  }

  updateEstado = (newValue: number) => {
    this.grupoDatoForm.patchValue({ Estado: newValue });
  };

  submitFn(formData: FormData) {
    return this.grupoDeDatoService.editGrupoDatos(formData);
  }

  onRowClick(event: { id: number, tableName?: string }): void {
    console.log('Fila seleccionada con id:', event.id);
    console.log('Fila seleccionada con id:', this.singleGrupoDeDatoId);
    this.router.navigate([`/creditos/parametro/grupo-de-dato/single-grupo-dato`, this.singleGrupoDeDatoId , `single-dato`, event.id]);
  }

}
