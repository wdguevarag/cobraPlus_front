// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { TimeService } from './appTime.service';  // Importar el servicio

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sistema Cobranza';
  currentTime: string = '';  
  constructor(private timeService: TimeService) {}  

  ngOnInit(): void {
    this.timeService.currentTime$.subscribe(time => {
      this.currentTime = time;  
      this.updateOpacityBasedOnTime(time);  
    });
  }

  updateOpacityBasedOnTime(time: string): void {
    const [currentHour, currentMinute] = time.split(':').map(Number);  

    let opacity = 1;

    if (currentHour >= 0 && currentHour < 6) {
      opacity = 1 - (currentHour + currentMinute / 60) / 6;
    } else if (currentHour >= 6 && currentHour < 12) {
      opacity = 0.5 - (currentHour - 6 + currentMinute / 60) * (0.2 / 6);
    } else if (currentHour >= 12 && currentHour < 18) {
      opacity = 0.7;
    } else {
      opacity = 0.9 + (currentHour - 18 + currentMinute / 60) * (0.7 / 6);
    }

    opacity = Math.max(0, Math.min(opacity, 1));

    document.documentElement.style.setProperty('--opacity-level', opacity.toString());
  }
}
