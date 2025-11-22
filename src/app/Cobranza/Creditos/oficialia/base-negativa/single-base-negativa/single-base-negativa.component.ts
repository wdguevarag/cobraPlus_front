import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseNegativeService } from 'src/app/Services/base-negativa.service';

@Component({
  selector: 'app-single-base-negativa',
  templateUrl: './single-base-negativa.component.html',
  styleUrl: './single-base-negativa.component.scss'
})
export class SingleBaseNegativaComponent implements OnInit {

    singleBNId: number | null = null;
    singleBNData: any;
  
    constructor(
      private route: ActivatedRoute , 
      private baseNegativaService: BaseNegativeService , 
    ) {}
  
  
    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.singleBNId = +params.get('id')!;
        if (this.singleBNId) {
        this.baseNegativaService.getBaseNegativaById(this.singleBNId).subscribe (
          (data) => {
            this.singleBNData = data;
          },
          (error) => {
            console.error('Error al obtener la oficina:', error);
          }
        );
        }
      });
    }
  
}










