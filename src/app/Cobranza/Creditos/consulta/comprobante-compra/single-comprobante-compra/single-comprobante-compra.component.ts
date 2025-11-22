import { Component , OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { ComprobanteCompraService } from '../../../../../Services/comprobante-compra.service';
import { GrupoDeDatoService } from 'src/app/Services/grupo-de-datos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-single-comprobante-compra',
  templateUrl: './single-comprobante-compra.component.html',
  styleUrl: './single-comprobante-compra.component.scss'
})
export class SingleComprobanteCompraComponent implements OnInit {

  isEditing = false ;
  comprobanteCompraId : number | null = null;
  comprobanteCompraData: any;

  metodoPagoId: number = 3;
  tipoComprobanteId: number = 1;

  comprobanteForm!: FormGroup;

  page_url = PAGE_URL;

  initForm() {
    this.comprobanteForm = this.fb.group({
      Imagen: [this.comprobanteCompraData.Imagen]
    });
  }

  constructor(
    private router: Router ,
    private route: ActivatedRoute,
    public comprobantesCompraService: ComprobanteCompraService,
    public GrupoDeDatoService: GrupoDeDatoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.comprobanteCompraId = +params.get('id')!;
      if (this.comprobanteCompraId) {

        this.comprobantesCompraService.getComprobanteById(this.comprobanteCompraId).subscribe(
          (data) => {
            this.comprobanteCompraData = data;
          }, (error) => {
            console.error('Error al obtener el comprobante de compra:', error);
          }
        );
      }
    });
  }

  submitFn = (data: any) => this.comprobantesCompraService.editComprobante(data);

  toggleStatus(newStatus: string): void {
    if (this.comprobanteCompraData) {
      this.comprobanteCompraData.Estado = newStatus;
    }
  }

  updateEstado = (newValue: number) => {
    if (this.comprobanteCompraData) {
      this.comprobanteCompraData.Estado = newValue;
    }
  }

  getOptionText(id: any, options: any[], fieldValue: string = 'ID', fieldContent: string = 'Nombre'): string {
    const found = options.find(opt => opt[fieldValue] == id);
    return found ? found[fieldContent] : id;
  }

  onFileSelected(file: File, field: string) {
    this.comprobanteForm.patchValue({ [field]: file });
  }
}

