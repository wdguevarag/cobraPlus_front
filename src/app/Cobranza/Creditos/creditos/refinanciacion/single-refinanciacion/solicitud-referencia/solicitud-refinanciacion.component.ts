import { Component, OnInit, Input } from '@angular/core';
import { CuotasCronogramaService } from '../../../../../../Services/cuotas-cronograma.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-single-solicitud-refinanciacion',
    templateUrl: './solicitud-refinanciacion.component.html',
    styleUrl: './solicitud-refinanciacion.component.scss'
})
export class SingleSolicitudRefinanciacion {
    refinanciacionData: any[] = [];
    cronogramaData: any[] = [];
    cronogramaId: number;
    @Input() refinanciamientoCreditoID!: number;
    @Input() refinanciamientoID!: number;

    constructor(
        private cuotaCronogramaService: CuotasCronogramaService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {  
        this.cuotaCronogramaService.getClienteSolicitudRefinanciacion(this.refinanciamientoID).subscribe(refinaciacion => {
            this.refinanciacionData = refinaciacion;
            this.cronogramaId = refinaciacion[0].Cronograma_ID;

            console.log(this.refinanciacionData);
            console.log(this.cronogramaId);

            this.cuotaCronogramaService.getClienteSolicitudCronograma(this.cronogramaId).subscribe(cronograma => {
                this.cronogramaData = cronograma;
                console.log("cronogramaData", this.cronogramaData);
            });
        });
    }

    getTotal(field: string): number {
        return this.cronogramaData.reduce((total, item) => total + parseFloat(item[field]), 0);
    }
}
