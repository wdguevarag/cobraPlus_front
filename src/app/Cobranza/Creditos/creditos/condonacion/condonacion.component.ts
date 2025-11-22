import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditoService } from 'src/app/Services/creditos.service';
import { ClienteService } from 'src/app/Services/clientes.service';
import { CondonacionService } from 'src/app/Services/condonacion.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-condonacion',
  templateUrl: './condonacion.component.html',
  styleUrls: ['./condonacion.component.scss']
})
export class CondonacionComponent implements OnInit {

  currentUser: any;

  showConfirmPopup = false;               // Controla la visibilidad del popup
  actionId: number | null = null;         // Guarda el ID de la acción
  actionType: 'Anular' | 'Aprobar' | null = null;  // Guarda el tipo de acción

  form: FormGroup;                        // Formulario para el comentario

  condonacionTabs = [
    { title: 'CONDONACIONES PENDIENTES' },
    { title: 'CONDONACIONES' },
  ];

  condonacionesPendientesColumns = [
    { header: 'Cod. Cliente', field: 'ID', show: true },
    { header: 'Tipo Doc', field: 'Cliente_Tipo_Documento_Nombre' },
    { header: 'Doc', field: 'Cliente_Documento' , noNumeric: true },
    { header: 'Apellido Paterno', field: 'Cliente_Apellido_Paterno' },
    { header: 'Apellido Materno', field: 'Cliente_Apellido_Materno' },
    { header: 'Nombres', field: 'Cliente_Nombres' },
    { header: 'Usuario', field: 'Usuario_Nombre_Corto' },
    { header: 'Credito', field: 'Credito_ID' },
    { header: 'Anular', contentField: 'Anular', type: 'button', btnClass: 'btn-red' },
    { header: 'Aprobar', contentField: 'Aprobar', type: 'button' },
  ];

  condonacionesPendientesData: any[] = [];

  condonacionColumns = [
    { header: 'Cod. Cliente', field: 'ID', show: true },
    { header: 'Tipo Doc', field: 'Tipo_Documento_Nombre' },
    { header: 'Doc', field: 'Documento', noNumeric: true },
    { header: 'Apellido Paterno', field: 'Apellido_Paterno' },
    { header: 'Apellido Materno', field: 'Apellido_Materno' },
    { header: 'Nombres', field: 'Nombres' },
    { header: 'Credito_ID', field: 'Credito_ID' },
  ];
  condonacionData: any[] = [];

  constructor(
    private router: Router,
    private condonacionService: CondonacionService,
    private creditoService: CreditoService,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      Comentario: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.clienteService.getClientesConCredito()
      .subscribe(condonaciones => {
        this.condonacionData = condonaciones
          .filter(item => item.Credito_Estado_Credito === '1' && item.Credito_Estado_Deuda === '0');
      });

    this.condonacionService.getCondonacionesCredito()
      .subscribe(condonacionesPendientes => {
        this.condonacionesPendientesData = condonacionesPendientes
          .filter(item => item.Estado_Aprobado !== '1' && item.Estado_Anulado !== '1');
      });
  }

  onRowClick(event: { id: number; tableName?: string }): void {
    const base = `/creditos/credito/condonacion/single-condonacion`;
    if (event.tableName === 'condonacionesPendientes' || event.tableName === 'condonaciones') {
      this.router.navigate([base, event.id]);
    }
  }

  onButtonClick(event: { contentField: string; id: number }): void {
    this.actionId = event.id;
    this.actionType = event.contentField === 'Anular' ? 'Anular' : 'Aprobar';
    this.showConfirmPopup = true;

    if (this.actionType === 'Anular') {
      this.form.reset();  // Limpiamos el comentario previo
    }
  }


  confirmAction(): void {
    if (this.actionId === null || this.actionType === null) {
      return;
    }

    const formData = new FormData();
    formData.append('Usuario_ID', this.currentUser.ID);
    formData.append('Condonacion_ID', this.actionId.toString()); // <-- Línea añadida

    if (this.actionType === 'Anular') {
      const comentario = this.form.get('Comentario')!.value;
      formData.append('Comentario', comentario);

      this.condonacionService.anularCondonacion(formData)
        .subscribe(() => this.reloadData());

    } else {  // Aprobación
      formData.append('Comentario', '');
      this.condonacionService.aprobarCondonacion(formData)
        .subscribe(() => this.reloadData());
    }

    this.showConfirmPopup = false;
  }






  closePopup(): void {
    this.showConfirmPopup = false;
  }

  reloadData(): void {
    this.ngOnInit();
  }

  // Nota: Estos métodos ya no son usados por el popup, pero se mantienen por compatibilidad
  anularCondonacion(id: number): void {
    console.log(`Anular condonacion with ID: ${id}`);
    this.condonacionService.anularCondonacion(id)
      .subscribe(response => {
        console.log(response);
        this.ngOnInit();
      });
  }

  aprobarCondonacion(id: number): void {
    console.log(`Aprobar condonacion with ID: ${id}`);
    this.condonacionService.aprobarCondonacion(id)
      .subscribe(response => {
        console.log(response);
        this.ngOnInit();
      });
  }

}
