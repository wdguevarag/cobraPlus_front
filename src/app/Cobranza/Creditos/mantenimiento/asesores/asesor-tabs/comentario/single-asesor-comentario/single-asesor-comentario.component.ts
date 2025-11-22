import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioService } from 'src/app/Services/usuario.service';


@Component({
  selector: 'app-single-asesor-comentario',
  templateUrl: './single-asesor-comentario.component.html',
  styleUrl: './single-asesor-comentario.component.scss'
})
export class SingleAsesorComentarioComponent implements OnInit {


  @Input() singleAsesorId: number | null = null;
  @Input() asesorComentarioId: number | null = null;
  
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() back = new EventEmitter<void>();


  isEditing: boolean = false;
  
  page_url = PAGE_URL;  

  singleAsesorData: any;
  asesorComentarioData: any;

  asesorComentarioForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
      if (this.singleAsesorId) {
      forkJoin({
        cliente: this.usuarioService.getUsuarioById(this.singleAsesorId),
        comentarios: this.usuarioService.getComentarioAsesorById(this.asesorComentarioId)
      }).subscribe(({ cliente, comentarios }) => {
        this.singleAsesorData = cliente;
        this.asesorComentarioData = comentarios;
        
        if (this.asesorComentarioData) {
          this.initForm();
          if (this.mode === 'view') {
            this.asesorComentarioForm.disable();
          }
        }
      }, error => {
        console.error('Error:', error);
      });
    }
  }
    
    
  initForm() {
    this.asesorComentarioForm = this.fb.group({
     ID              : [this.asesorComentarioData.ID],                   
     Comentario          : [this.asesorComentarioData.Comentario],          
     Estado          : [this.asesorComentarioData.Estado],          
    });
  }

  submitFn(formData: FormData) { return this.usuarioService.editComentarioAsesor(formData); }


  updateEstado = (newValue: number) => { this.asesorComentarioForm.patchValue({ Estado: newValue });};
  
  goBack(): void { this.back.emit(); }

}

