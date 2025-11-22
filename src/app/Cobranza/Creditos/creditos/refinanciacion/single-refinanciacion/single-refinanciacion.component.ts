import { Component , OnInit, Input } from '@angular/core';
import { RefinanciacionService } from '../../../../../Services/refinanciacion.service';
import { CuotasCronogramaService } from '../../../../../Services/cuotas-cronograma.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-single-refinanciacion',
  templateUrl: './single-refinanciacion.component.html',
  styleUrl: './single-refinanciacion.component.scss'
})
export class SingleRefinanciacionComponent implements OnInit {
  refinanciacionData: any[] = [];
  isEditing: boolean = false;
  singleRefinanciacionId!: number;
  clienteId!: number;
  evaluacionId!: number;
  creditoId!: number;

  constructor(
    private cuotaCronogramaService: CuotasCronogramaService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.singleRefinanciacionId = +params['id'];
    });

    this.cuotaCronogramaService.getClienteSolicitudRefinanciacion(this.singleRefinanciacionId).subscribe(refinaciacion => {
      this.refinanciacionData = refinaciacion;
      
      if (this.refinanciacionData.length > 0) {
        this.clienteId = this.refinanciacionData[0].Cliente_ID;
        if (this.refinanciacionData[0].Evaluacion_ID !== null) {
          this.evaluacionId = this.refinanciacionData[0].Evaluacion_ID;
        } else {
          this.evaluacionId = 0;
        }        
        this.creditoId = this.refinanciacionData[0].ID;
      }
    });
  }
}
