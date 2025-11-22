import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OficinaService } from '../../../../../Services/oficina.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-oficina',
  templateUrl: './single-oficina.component.html',
  styleUrls: ['./single-oficina.component.scss'],
})
export class SingleOficinaComponent implements OnInit {

  isEditing: boolean = false;

  singleOficinaId: number | null = null;
  singleOficinaData: any;



  oficinaForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private oficinaService: OficinaService , 
    private fb: FormBuilder
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleOficinaId = +params.get('id')!;
      if (this.singleOficinaId) {
      this.oficinaService.getOficinaById(this.singleOficinaId).subscribe (
        (data) => {
          this.singleOficinaData = data;
          this.initForm();
        },
        (error) => {
          console.error('Error al obtener la oficina:', error);
        }
      );
      }
    });
  }

  initForm() {
    this.oficinaForm = this.fb.group({
      ID: [this.singleOficinaData.ID , Validators.required],
      Nombre: [this.singleOficinaData.Nombre , Validators.required],
      Descripcion: [this.singleOficinaData.Descripcion , Validators.required],
      Ubicacion: [this.singleOficinaData.Ubicacion , Validators.required],
      Coordenada_Y: [this.singleOficinaData.Coordenada_Y , Validators.required],
      Coordenada_X: [this.singleOficinaData.Coordenada_X , Validators.required],
      Estado: [this.singleOficinaData.Estado , Validators.required],
    });
  }

  updateEstado = (newValue: number) => {
    this.oficinaForm.patchValue({ Estado: newValue });
  };



  submitFn(formData: FormData) {
    return this.oficinaService.editOficina(formData);
  }


}
