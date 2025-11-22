import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signature-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signature-input.component.html',
  styleUrls: ['./signature-input.component.scss'],
})
export class SignatureInputComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter<File>();

  // Bandera para indicar que se ha guardado la firma
  saved: boolean = false;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private lastX = 0;
  private lastY = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    // Si ya se guardó la firma, no se permite dibujar
    if (this.saved) return;

    this.drawing = true;
    const { x, y } = this.getXY(event);
    this.lastX = x;
    this.lastY = y;
  }

  draw(event: MouseEvent | TouchEvent): void {
    if (!this.drawing || this.saved) return;
    event.preventDefault();
    const { x, y } = this.getXY(event);
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing(): void {
    this.drawing = false;
    this.ctx.beginPath();
  }

  saveSignature(): void {
    const dataURL = this.canvasRef.nativeElement.toDataURL('image/png');
    // Convertir el dataURL a un objeto File
    const file = this.dataURLtoFile(dataURL, 'firma.png');
    this.signatureSaved.emit(file);

    // Indicar que la firma se guardó (bloquea el dibujo y muestra el watermark)
    this.saved = true;
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Método para reiniciar la firma: limpia el canvas y permite volver a firmar
  resetSignature(): void {
    this.clearCanvas();
    this.saved = false;
  }

  private getXY(event: MouseEvent | TouchEvent): { x: number, y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  // Función para convertir dataURL a File
  private dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }



  
}