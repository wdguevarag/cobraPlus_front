// nueva-base-negativa.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseNegativeService } from 'src/app/Services/base-negativa.service';
import { ClienteService } from 'src/app/Services/clientes.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-nueva-base-negativa',
  templateUrl: './nueva-base-negativa.component.html',
  styleUrls: ['./nueva-base-negativa.component.scss']
})
export class NuevaBaseNegativaComponent implements OnInit {

  currentUser: any;
  clienteData: any[] = [];
  // Inicializar propiedades para evitar undefined
  selectedCliente: any = {
    Nombres: '',
    Apellido_Paterno: '',
    Apellido_Materno: '',
    Tipo_Documento: '',
    Documento: ''
  };

  bnForm!: FormGroup;

  constructor(
    private baseNegativaService: BaseNegativeService,
    private authService: AuthService,
    private clienteService: ClienteService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadClientes();
    });

    this.bnForm = this.fb.group({
      Cliente_ID: ['', Validators.required],
      Usuario_ID: [this.currentUser.ID.toString()],
      Estado: [1],
      Motivo: ['', Validators.required],
      Comentario: ['', Validators.required],
    });

    this.bnForm.get('Cliente_ID')?.valueChanges.subscribe(id => this.onClienteChange(id));
  }

  loadClientes() {
    this.clienteService.getClientes().subscribe(
      resp => {
        this.clienteData = resp.filter(
          item => item.Empresa_ID === this.currentUser.Empresa_ID
        );
      },
      err => console.error('Error al obtener clientes', err)
    );
  }

  onClienteChange(clienteId: string) {
    if (this.bnForm.get('Cliente_ID')?.value !== clienteId) {
      this.bnForm.patchValue({ Cliente_ID: clienteId });
    }

    const cliente = this.clienteData.find(c => c.ID.toString() === clienteId);
    this.selectedCliente = cliente || {
      Nombres: '',
      Apellido_Paterno: '',
      Apellido_Materno: '',
      Tipo_Documento: '',
      Documento: ''
    };
  }

  submitFn(data: any) {
    return this.baseNegativaService.createBaseNegativa(data);
  }
}

