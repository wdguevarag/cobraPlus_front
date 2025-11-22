import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-single-asesor-nuevo-comentario',
  templateUrl: './single-asesor-nuevo-comentario.component.html',
  styleUrl: './single-asesor-nuevo-comentario.component.scss'
})
export class SingleAsesorNuevoComentarioComponent implements OnInit {

  @Input() singleAsesorId: number | null = null;
  @Output() back = new EventEmitter<void>();
      

  comentarioForm!: FormGroup;
  singleAsesorData: any;

  constructor(
    private fb: FormBuilder,
    public usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
      this.usuarioService.getUsuarioById(this.singleAsesorId).subscribe(
        (data) => {
          this.singleAsesorData = data;
        },
        (error) => {
          console.error('Error al obtener el cliente:', error);
        }
      );
      this.comentarioForm = this.fb.group({
        Usuario_ID: new FormControl(this.singleAsesorId),
        Comentario: new FormControl(''),
        Estado: new FormControl(1)
      });
  }

  submitFn(formData: any) { return this.usuarioService.createComentarioAsesor(formData); }

  goBack(): void { this.back.emit(); }
}
