import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/Services/clientes.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Location } from '@angular/common'; 
import { Router } from '@angular/router';  // Importa Router
import { forkJoin } from 'rxjs';


interface Cliente {
  ID: number;
  Nombres: string;
  Credito_ID: string;
  Asesor_ID: number;
  Credito_Fecha_Desembolso: string;
  Credito_Prestamo: number;
  Credito_Prestamo_Actual: number;
  Credito_Saldo_Capital: number;
  Credito_Deuda_Actual: number;
}


@Component({
  selector: 'app-traslado-cartera',
  templateUrl: './traslado-cartera.component.html',
  styleUrls: ['./traslado-cartera.component.scss']
})
export class TrasladoCarteraComponent implements OnInit {

  showConfirmModal = false;
  showSuccessModal = false;

  asesores: any[] = [];
  asesoresTarget: any[] = [];

  sourceAdvisor: any = null;
  targetAdvisor: any = null;
  asesorId!: number;

  originalClients: Cliente[] = [];
  sourceClients: Cliente[] = [];
  targetClients: Cliente[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private location: Location,
    private router: Router  // Inyecta Router
  ) { }

  ngOnInit(): void {

    this.usuarioService.getUsuariosAsesores().subscribe(data => {
      this.asesores = data;
      this.asesoresTarget = [...data];
    });
    this.loadClients();
  }


  loadClients(): void {
    this.clienteService.getClientesDataTraslado().subscribe(data => {
      this.originalClients = data.map((c: any) => ({
        ID: +c.Cliente_ID,
        Nombres: c.Nombres,
        Credito_ID: c.Credito_ID,
        Asesor_ID: +c.Asesor_ID,

        Credito_Fecha_Desembolso: c.Credito_Fecha_Desembolso,
        Credito_Prestamo: parseFloat(c.Credito_Prestamo),
        Credito_Prestamo_Actual: parseFloat(c.Credito_Prestamo_Actual),
        Credito_Saldo_Capital: parseFloat(c.Credito_Saldo_Capital),
        Credito_Deuda_Actual: parseFloat(c.Credito_Deuda_Actual)
      }));
      this.sourceClients = [];
      this.targetClients = [];
    });
  }






  private refreshSourceClients(): void {
    this.sourceClients = this.originalClients
      .filter(c => c.Asesor_ID == this.asesorId)
      .filter(c => !this.targetClients.some(t => t.ID == c.ID));
  }

  onSourceAdvisorChange(): void {
    if (!this.sourceAdvisor) {
      this.asesorId = NaN;
      this.sourceClients = [];
      this.targetClients = [];
      this.asesoresTarget = [...this.asesores];
      return;
    }
    // Convertimos a número antes de comparar
    this.asesorId = Number(this.sourceAdvisor.ID);
    this.refreshSourceClients();
    this.asesoresTarget = this.asesores.filter(a => Number(a.ID) !== this.asesorId);
  }

  transferClient(client: Cliente): void {
    this.targetClients.push(client);
    this.refreshSourceClients();
  }

  transferAllClients(): void {
    this.targetClients = [...this.targetClients, ...this.sourceClients];
    this.refreshSourceClients();
  }

  revertClient(client: Cliente): void {
    this.targetClients = this.targetClients.filter(c => c.ID !== client.ID);
    this.refreshSourceClients();
  }

  revertAllClients(): void {
    this.targetClients = [];
    this.refreshSourceClients();
  }

  onTransferButtonClick(): void {
    if (!this.targetAdvisor) {
      alert('Debes seleccionar el asesor receptor');
      return;
    }
    if (this.targetClients.length === 0) {
      alert('Primero debes trasladar al menos un cliente');
      return;
    }

    this.showConfirmModal = true;
  }

  confirmTraslado(): void {
    this.showConfirmModal = false; // Cerrar el popup de confirmación
    this.executeTransfer();
  }

  hideConfirm(): void {
    this.showConfirmModal = false;
  }

  executeTransfer(): void {
    if (!this.targetAdvisor) {
      alert('Debes seleccionar el asesor receptor');
      return;
    }
    if (this.targetClients.length === 0) {
      alert('Primero debes trasladar al menos un cliente');
      return;
    }

    const total = this.targetClients.length;
    let successCount = 0;

    this.targetClients.forEach(client => {
      const data = {
        ID: client.ID,
        nuevoAsesorID: Number(this.targetAdvisor.ID)
      };


      this.clienteService.changeAsesorCliente(data).subscribe(
        resp => {
          if (resp.icodError === '0') {
            successCount++;
            if (successCount === total) {
              // Mostrar popup de éxito
              this.showSuccessModal = true;
              this.loadClients();
              this.sourceAdvisor = null;
              this.targetAdvisor = null;
            }
          }
        },
        err => console.error(`Error actualizando cliente ${client.ID}:`, err)
      );
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/creditos/credito/traslado-cartera']);  // Redirige a ruta personalizada
  }


}
