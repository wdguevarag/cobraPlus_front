import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.scss']
})
export class NuevoClienteComponent implements OnInit {

  clienteForm!: FormGroup;
  currentUser: any;
  newClienteId!: number;
  signatureMode: 'upload' | 'draw' = 'upload';

  public miFechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';


  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Suscribirse para obtener el usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Configurar el formulario una vez que se tiene el usuario
      this.clienteForm = this.fb.group({
        Nombres: ['', Validators.required],
        Apellido_Paterno: ['', Validators.required],
        Apellido_Materno: ['', Validators.required],
        Tipo_Documento: ['', Validators.required],
        Documento: ['', Validators.required],
        Genero: ['', Validators.required],
        Estado_Civil: ['', Validators.required],
        Fecha_Nacimiento: ['', Validators.required],
        Lugar_Nacimiento: ['', Validators.required],
        Empresa_ID: [this.currentUser.Empresa_ID],
        Asesor_ID: [0],
        Base_Negativa: ['0'],
        Estado: ['1'],
        Documento_Anverso: ['', Validators.required],
        Documento_Reverso: ['', Validators.required],
        Firma: [null],
      });

      // Consultar todos los clientes y calcular el nuevo id
      this.clienteService.getClientes().subscribe(clientes => {
        if (clientes && clientes.length > 0) {
          // Asumiendo que cada cliente tiene una propiedad 'id'
          const maxId = Math.max(...clientes.map((cliente: any) => cliente.ID));
          this.newClienteId = maxId + 1;
        } else {
          // Si no hay clientes, el primer id será 1
          this.newClienteId = 1;
        }
      });
    });
  }

  onSignatureSaved(file: File): void {
    this.clienteForm.patchValue({ Firma: file });
  }

  onFileSelected(file: File, field: string) {
    this.clienteForm.patchValue({ [field]: file });
  }

  submitFn(formData: FormData) {
    return this.clienteService.createCliente(formData);
  }

  filterByEmpresa(item: any): boolean {
    return item.Empresa_ID == 1;
  }

  getClientes(): Observable<any[]> {
    return this.clienteService.getClientes();
  }

}


