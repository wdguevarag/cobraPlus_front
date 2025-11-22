import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ErrorDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: { message: string }
    ) {}

    closePopup(confirm: boolean = false) {
        this.dialogRef.close(confirm); // Envía true si se confirma, false si se cierra con la "X"
    }    
}
