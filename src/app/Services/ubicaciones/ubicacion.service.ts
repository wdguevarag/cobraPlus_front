import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define las interfaces para tipar la información
export interface Ubicacion {
  departamento: string;
  provincias: Provincia[];
}

export interface Provincia {
  provincia: string;
  distritos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  private ubicacionUrl = 'assets/data/ubicaciones.json';

  constructor(private http: HttpClient) { }

  getUbicacion(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.ubicacionUrl);
  }
}
