// common.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = SERVER_URL + 'ws_common/ws_Common.php';

  constructor(private http: HttpClient) { }

/* Funciones comunes entre servicios  */ 

}
