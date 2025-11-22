import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepositosBancosService } from 'src/app/Services/depositos-bancos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_URL } from 'src/environments/environment';
@Component({
  selector: 'app-single-deposito-banco',
  templateUrl: './single-deposito-banco.component.html',
  styleUrl: './single-deposito-banco.component.scss'
})
export class SingleDepositoBancoComponent implements OnInit {

  isLoading: boolean = true;
  isEditing: boolean = false;

  singleDepositoBancoId: number | null = null;
  singleDeposioBancoData: any;

  depositoForm!: FormGroup;

  page_url = PAGE_URL;

  constructor(
    private route: ActivatedRoute,
    private depositoService: DepositosBancosService ,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleDepositoBancoId = +params.get('id')!;
      if (this.singleDepositoBancoId) {
        this.depositoService.getDepositosBancosporId(this.singleDepositoBancoId).subscribe(
          (data) => {
            this.singleDeposioBancoData = data;
            this.initForm();
            this.isLoading = false;
          },
          (error) => {
            console.error('Error al obtener el Deposito a Banco:', error);
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  initForm() {
    this.depositoForm = this.fb.group({
      ID: [this.singleDeposioBancoData.ID],
      Banco: [this.singleDeposioBancoData.Banco],
      Fecha_Voucher: [this.singleDeposioBancoData.Fecha_Voucher],
      Monto: [this.singleDeposioBancoData.Monto],
      Nro_Operacion: [this.singleDeposioBancoData.Nro_Operacion],
      url_foto: [this.singleDeposioBancoData.url_foto],
      Estado: [this.singleDeposioBancoData.Estado],
    });
  }

  onFileSelected(file: File, field: string) {
    this.depositoForm.patchValue({ [field]: file });
  }
}
