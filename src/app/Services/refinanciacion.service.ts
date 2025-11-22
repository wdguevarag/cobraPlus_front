import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefinanciacionService {

  private apiUrl = SERVER_URL + 'ws_creditos/ws_General.php';
  fechaSistema: string = localStorage.getItem('fechaSistemaStorage') || '';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) { }

  // GET
  getRefinanciacionDataTable(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?codOpe=ORDTable&empresaID=${this.empresaID}`);
  }
}