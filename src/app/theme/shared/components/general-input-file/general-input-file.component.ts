import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
  selector: 'app-general-input-file',
  templateUrl: './general-input-file.component.html',
  styleUrls: ['./general-input-file.component.scss']
})

export class GeneralInputFileComponent {
  @Input() type: 'new' | 'edit' = 'new';
  @Input() currentImage: string | null = null;
  // Nuevos inputs para definir tamaño desde el padre
  @Input() width: string = '300px';
  @Input() height: string = '300px';
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
    this.originalFile = file;
    this.imageChangedEvent = event;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.imageSaved = false;
      this.lastCroppedImage = '';
    };
    reader.readAsDataURL(file);
  }

  enableCrop() {
    this.isCropMode = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('Evento imageCropped disparado:', event);
    if (event.base64) {
      this.lastCroppedImage = event.base64;
    }
  }

  applyCrop() {
    if (this.lastCroppedImage && this.lastCroppedImage.trim().length > 0) {
      console.log('Aplicando recorte con la imagen:', this.lastCroppedImage);
      this.previewUrl = this.lastCroppedImage;
      this.isCropMode = false;
      this.imageSaved = true;
      const file = this.base64ToFile(this.lastCroppedImage, this.originalFile?.name || 'cropped_image.png');
      this.fileSelected.emit(file);
    } else {
      console.warn('No hay imagen recortada disponible.');
    }
  }

  saveImage() {
    if (this.previewUrl && !this.isCropMode) {
      let file: File;
      if (this.imageSaved) {
        file = this.base64ToFile(this.previewUrl as string, this.originalFile?.name || 'cropped_image.png');
      } else {
        file = this.originalFile!;
      }
      this.fileSelected.emit(file);
    }
  }

  cancelCrop(): void {
    this.isCropMode = false;
  }

  private base64ToFile(data: string, filename: string): File {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

}






