// src/app/time.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Usamos BehaviorSubject para que los cambios sean reactivos

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private currentTimeSubject = new BehaviorSubject<string>(this.getCurrentTime());
  currentTime$ = this.currentTimeSubject.asObservable(); // Exponemos la hora como un observable

  constructor() {
    // Actualiza la hora cada minuto
    // setInterval(() => {
    //   this.updateTime();
    // }, 60000); // Actualiza cada minuto


    setInterval(() => {
      this.updateTimeWithSeconds();
    }, 1000); // Si quieres segundero, puedes activar esto para actualizar cada segundo
    
  }

  private getCurrentTime(): string {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    // Retornar solo la hora y minutos
    return `${currentHour}:${currentMinute < 10 ? '0' + currentMinute : currentMinute}`;
  }

  // Si algún día decides usar el segundero, esta función lo gestionaría:
  private updateTimeWithSeconds(): void {
    const newTime = this.getCurrentTimeWithSeconds();
    this.currentTimeSubject.next(newTime);
  }

  private getCurrentTimeWithSeconds(): string {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    // Retorna hora, minuto y segundo
    return `${currentHour}:${currentMinute < 10 ? '0' + currentMinute : currentMinute}:${currentSecond < 10 ? '0' + currentSecond : currentSecond}`;
  }

  private updateTime(): void {
    const newTime = this.getCurrentTime();
    this.currentTimeSubject.next(newTime); // Emite el nuevo valor
  }
}
