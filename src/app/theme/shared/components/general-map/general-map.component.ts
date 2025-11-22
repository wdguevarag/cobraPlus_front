import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordenadasService } from 'src/app/Services/coordenadas.service';
import { Observable } from 'rxjs';
import * as L from 'leaflet';
import { PAGE_URL } from 'src/environments/environment';


@Component({
  selector: 'app-general-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-map.component.html',
  styleUrl: './general-map.component.scss'
})
export class GeneralMapComponent implements AfterViewInit, OnChanges {
  private pageUrl = PAGE_URL;

  @Input() selectedUserId: number | null = null;
  @Input() tipoUbicacion: string = '';

  coordenadas$: Observable<any> | null = null;
  private map!: L.Map;
  private markersLayer = L.featureGroup();

  constructor(private coordenadasService: CoordenadasService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUserId']?.currentValue !== changes['selectedUserId']?.previousValue ||
        changes['tipoUbicacion']?.currentValue !== changes['tipoUbicacion']?.previousValue) {
      this.obtenerCoordenadas();
    }
  }
  

  obtenerCoordenadas(): void {
    if (this.selectedUserId !== null && this.tipoUbicacion?.trim()) {
      this.coordenadas$ = this.coordenadasService.getCoordenadasByClientIdAndTypeLocation(
        this.selectedUserId,
        this.tipoUbicacion
      );
  
      this.coordenadas$.subscribe(coordenadas => {
        this.updateMarkers(Array.isArray(coordenadas) ? coordenadas : []);
      });
    }
  }
  

  private initMap(): void {
    this.map = L.map('map').setView([-12.0805, -77.050789], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.addLayer(this.markersLayer);
  }

  private updateMarkers(coordenadas: any[]): void {
    if (!Array.isArray(coordenadas)) {
      coordenadas = [];
    }

    this.markersLayer.clearLayers();

    coordenadas.forEach(coord => {
      const iconUrl = this.getPinIcon(coord.Atraso);

      const customIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [42, 42],
        iconAnchor: [15, 45],
        popupAnchor: [0, -40]
      });

      L.marker([coord.latitud, coord.longitud], { icon: customIcon })
        .bindPopup(`Código Cliente: ${coord.Cliente_ID} <br> Nombre Cliente: ${coord.Cliente_Nombre + ' ' +  coord.Cliente_Apellido_Paterno} <br> Código Crédito: ${coord.id_credito} <br> Días de mora: ${coord.Atraso}`)
        .addTo(this.markersLayer);
    });

    if (this.markersLayer.getLayers().length > 0) {
      const bounds = this.markersLayer.getBounds();
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private getPinIcon(diasMora: number): string {
    if (diasMora <= 3) {
      return PAGE_URL + 'uploads/images/map-pins/icons8-pin-azull.png';
    } else if (diasMora >= 4 && diasMora <= 7) {
      return PAGE_URL + 'uploads/images/map-pins/icons8-pin-amarillo.png';
    } else {
      return PAGE_URL + 'uploads/images/map-pins/icons8-pin-rojo.png';
    }
  }
}
