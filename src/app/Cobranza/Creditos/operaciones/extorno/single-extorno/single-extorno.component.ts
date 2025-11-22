import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ExtornoService } from 'src/app/Services/extorno.service';
import { DesembolsoService } from 'src/app/Services/desembolso.service';
import { CuotasCronogramaService } from 'src/app/Services/cuotas-cronograma.service';
import { CondonacionService } from 'src/app/Services/condonacion.service';
import { PagoCancelacionService } from 'src/app/Services/pago-cancelacion.service';
import { PagoService } from 'src/app/Services/pago.service';
import { RefinanciacionService } from 'src/app/Services/refinanciacion.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-single-extorno',
  templateUrl: './single-extorno.component.html',
  styleUrls: ['./single-extorno.component.scss']
})
export class SingleExtornoComponent implements OnInit {
  id!: number;
  operation!: number;
  data: any;
  currentUser: any;
  showUnauthorizedPopup = false;

  extornoForm!: FormGroup;

  operationConfigs: { [key: number]: { title: string, buttonLabel: string, required: string[] } } = {
    1: { title: 'Desembolso Normal', buttonLabel: 'Anular Desembolso', required: ['Comentario'] },
    2: { title: 'Desembolso Ampliación', buttonLabel: 'Anular Desembolso', required: ['Comentario'] },
    3: { title: 'Refinanciación', buttonLabel: 'Anular Refinanciación', required: ['Comentario'] },
    4: { title: 'Extorno Pago Normal', buttonLabel: 'Anular Pago', required: [] },
    5: { title: 'Extorno Pago Cancelación', buttonLabel: 'Anular Pago', required: [] },
    6: { title: 'Extorno Solicitud', buttonLabel: 'Anular Solicitud', required: ['Comentario'] },
    9: { title: 'Extorno Condonación', buttonLabel: 'Anular Condonación', required: ['Comentario'] },
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private extornoService: ExtornoService,
    private desembolsoService: DesembolsoService,
    private refinanciacionService: RefinanciacionService,
    private cuotasCronogramaService: CuotasCronogramaService,
    private condonacionService: CondonacionService,
    private pagoService: PagoService,
    private pagoCancelacionService: PagoCancelacionService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (!u || u.Perfil_ID > 2) {
        this.showUnauthorizedPopup = true;
      }
    });

    this.route.paramMap.subscribe(pm => {
      this.id = +(pm.get('id') || 0);
      this.route.queryParamMap.subscribe(qm => {
        this.operation = +(qm.get('operation') || 0);
        this.initForm();
        this.loadData();
      });
    });
  }

  private initForm() {
    const cfg = this.operationConfigs[this.operation] || { required: [] } as any;
    this.extornoForm = this.fb.group({
      Operacion_ID: [this.id],
      Comentario: ['', cfg.required.includes('Comentario') ? Validators.required : []],
      Usuario_Extorno: [this.currentUser.ID],
    });
  }

  private loadData() {
    if (this.showUnauthorizedPopup) return;

    if ([1,2,6].includes(this.operation)) {
      this.desembolsoService.getDesembolsoClienteCreditoById(this.id).subscribe(d => this.data = d);
    } else if (this.operation === 3) {
      this.refinanciacionService.getRefinanciacionDataTable()
        .subscribe(list => this.data = list.find(i => +i.ID === this.id));
    } else if (this.operation === 4) {
      this.extornoService.getPagoNormalById(this.id).subscribe(d => this.data = d);
    } else if (this.operation === 5) {
      this.extornoService.getPagoCancelacionById(this.id).subscribe(d => this.data = d);
    } else if (this.operation === 9) {
      this.condonacionService.getCondonacionCreditoById(this.id).subscribe(d => this.data = d);
    }

    this.extornoForm.get('ID')!.setValue(this.id);
  }

  // Lógica de envío manual, evitando app-submit-form
  submit() {
    if (this.extornoForm.invalid) {
      this.extornoForm.markAllAsTouched();
      return;
    }
    const formValue = this.extornoForm.value;
    let request$;
    switch (this.operation) {
      case 1:
        request$ = this.extornoService.extornarDesembolso(formValue);
        break;
      case 2:
        request$ = this.extornoService.extornarDesembolsoAmpliacion(formValue);
        break;
      case 3:
        request$ = this.cuotasCronogramaService.anularCreditoRefinanciacion(
          this.data.Credito_ID_Anterior,
          this.data.Credito_ID,
          this.data.ID
        );
        break;
      case 4:
        request$ = this.extornoService.extornarPagoNormal(formValue);
        break;
      case 5:
        request$ = this.extornoService.extornarPagoCancelacion(formValue);
        break;
      case 6:
        request$ = this.extornoService.extornarDesembolso({ ...formValue, Tipo: 'EXTORNO SOLICITUD' });
        break;
      case 9:
        request$ = this.extornoService.extornarCondonacion(formValue);
        break;
      default:
        return;
    }

    request$.subscribe(
      () => {
        // Tras éxito, retrocede
        this.location.back();
      },
      err => {
        console.error('Error al enviar formulario', err);
        // aquí podrías mostrar un toast o diálogo
      }
    );
  }

  closePopup() {
    this.location.back();
  }
}