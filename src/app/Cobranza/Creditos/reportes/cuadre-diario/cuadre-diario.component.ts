import { Component, OnInit } from '@angular/core';
import { CuadreDiarioService, CuadreUsuario } from 'src/app/Services/reportes-services/cuadre-diario.service';

@Component({
  selector: 'app-cuadre-diario',
  templateUrl: './cuadre-diario.component.html',
  styleUrl: './cuadre-diario.component.scss',

})
export class CuadreDiarioComponent implements OnInit {
  cuadre: CuadreUsuario[] = [];
  fechas: string[] = [];

  constructor(private cuadreDiarioService: CuadreDiarioService) {}

  ngOnInit(): void {
    this.cuadreDiarioService.getCuadreDiario().subscribe(data => {
      this.cuadre = data;

      if (data.length) {
        this.fechas = data[0].datos.map(d => d.fecha);
      }
    });
  }
}
