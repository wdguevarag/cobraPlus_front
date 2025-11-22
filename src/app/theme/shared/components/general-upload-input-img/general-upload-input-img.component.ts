import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-general-upload-input-img',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
  templateUrl: './general-upload-input-img.component.html',
  styleUrls: ['./general-upload-input-img.component.scss']
})
export class GeneralUploadInputImgComponent {

  @Input() type: 'new' | 'edit' = 'new';
  @Input() currentImage: string | null = null;
  @Input() width: string = '300px';
  @Input() height: string = '300px';
  @Input() aspectRatio: number = 16 / 9; // Relación de aspecto predeterminada
  @Output() fileSelected = new EventEmitter<File>();

  previewUrl: string | ArrayBuffer | null = null;
  imageChangedEvent: any = '';
  lastCroppedImage: string = '';
  isCropMode: boolean = false;
  originalFile: File | null = null;
  imageSaved: boolean = false;

  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;

  onFileChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.prepareImage(file, event);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.prepareImage(file, { target: { files: [file] } });
      event.dataTransfer.clearData();
    }
  }

  private prepareImage(file: File, event: any) {
    if (!file.type.startsWith('image/')) {
      console.error('Invalid image type. Por favor seleccione un archivo de imagen válido.');
      return;
    }
    this.originalFile = file;
    this.imageChangedEvent = event;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.imageSaved = false;
      this.lastCroppedImage = '';
      // Al cargar la imagen se activa el modo recorte
      this.isCropMode = true;
    };
    reader.readAsDataURL(file);
  }

  async imageCropped(event: ImageCroppedEvent) {
    console.log('Evento imageCropped:', event);
    // Como recibimos un Blob, lo convertimos a base64
    if (event.blob) {
      try {
        const base64 = await this.convertBlobToBase64(event.blob);
        // console.log('Base64 recibido (convertido):', base64);
        if (base64 && base64.length > 0) {
          this.lastCroppedImage = base64;
        }
      } catch (err) {
        console.error('Error convirtiendo Blob a Base64:', err);
      }
    } else {
      console.warn('No se recibió un Blob en el evento imageCropped.');
    }
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  applyCrop() {
    console.log('lastCroppedImage antes de aplicar:', this.lastCroppedImage);
    if (this.lastCroppedImage && this.lastCroppedImage.length > 0) {
      // Se aplica el recorte: se asigna la imagen recortada a previewUrl,
      // se desactiva el modo recorte y se marca la imagen como guardada.
      this.previewUrl = this.lastCroppedImage;
      this.isCropMode = false;
      this.imageSaved = true;
      const file = this.base64ToFile(this.lastCroppedImage, this.originalFile?.name || 'cropped_image.png');
      this.fileSelected.emit(file);
      console.log('Imagen recortada aplicada.');
    } else {
      console.warn('No hay imagen recortada disponible.');
    }
  }

  cancelCrop(): void {
    // Se cancela el recorte y se limpia el input (dejándolo vacío)
    this.previewUrl = null;
    this.isCropMode = false;
    this.originalFile = null;
    this.lastCroppedImage = '';
    this.imageSaved = false;
    this.fileSelected.emit(null as any);
  }

  enableCrop() {
    // Permite volver a recortar si existe imagen previa y no se ha guardado
    if (this.previewUrl && !this.imageSaved) {
      this.isCropMode = true;
    }
  }

  private base64ToFile(data: string, filename: string): File {
    const arr = data.split(',');
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
