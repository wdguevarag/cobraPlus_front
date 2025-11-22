import { Component, OnInit } from '@angular/core';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-nuevo-grupo-de-datos',
  templateUrl: './nuevo-grupo-de-datos.component.html',
  styleUrl: './nuevo-grupo-de-datos.component.scss'
})
export class NuevoGrupoDeDatosComponent implements OnInit{
    currentUser: any ;
  
    grupoDatosForm!: FormGroup;
  
    constructor(
      private grupoDatoService: GrupoDeDatoService,
      private authService: AuthService,
      private fb: FormBuilder,
  
    ) {}
  
    ngOnInit() {
  
        this.authService.currentUser$.subscribe(user => {
          this.currentUser = user;
        });
  
  
      this.grupoDatosForm = this.fb.group({
        Nombre: ['', Validators.required],
        Descripcion: ['', Validators.required],
        Estado: ['1', Validators.required],
      });
    }
  
    // Función de envío que se pasará al componente SubmitForm
    submitFn(data: any) {
      return this.grupoDatoService.createGrupoDatos(data);
    }

}
