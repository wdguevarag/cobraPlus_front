import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaniasService } from 'src/app/Services/campanias.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-single-campania',
  templateUrl: './single-campania.component.html',
  styleUrl: './single-campania.component.scss'
})
export class SingleCampaniaComponent {


  singleCampaniasTabs = [
    { title: 'OFERTA' },  
    { title: 'FIC' },    
  ];


  creditosClienteColumns: any[] = [
    { header: 'ID', field: 'ID' , show: true },
    { header: 'Estado', field: 'Estado',   type: 'binario', trueValue: 'ACTIVO', falseValue: 'INACTIVO' }
  ];

  // Definición de tabs
  creditosClienteData : any;




  singleCampaniaId: number | null = null;
  singleCampaniaData: any;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaniaService: CampaniasService,
    private authService: AuthService // Inyectar AuthService
  ) {
    this.currentUser = this.authService.currentUserValue; // Obtener usuario actual
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleCampaniaId = +params.get('id')!;
      if(this.singleCampaniaId) {
        this.campaniaService.getCampaniaById(this.singleCampaniaId).subscribe(
          (data) => {
            this.singleCampaniaData = data;
            console.log('Datos del parametro:', this.singleCampaniaData);
          },
          (error) => {
            console.error('Error al obtener el parametro:', error);
          }
        );
      }
    });
  }



  // Añadir nueva variable
  nuevoMonto: number;
  currentUser: any;



    
  // Añadir nuevas variables
  showPopup: boolean = false;
  popupMessage: string = '';

  // Modificar los métodos existentes
  validarCampania() {
    if (this.singleCampaniaId && this.nuevoMonto) {
      const fechaSistema = localStorage.getItem('fechaSistemaStorage') || new Date().toISOString().split('T')[0];
      const [year, month, day] = fechaSistema.split('-');
      const fechaFormateada = `${day}-${month}-${year}`;

      this.campaniaService.editarCampania(
        this.singleCampaniaId,
        this.nuevoMonto,
        this.currentUser.ID,
        fechaFormateada
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.singleCampaniaData.Monto = this.nuevoMonto;
            this.singleCampaniaData.Fecha_Oferta = fechaFormateada;
            this.singleCampaniaData.Asesor_Valido_Nombre = this.currentUser.Nombre;
            this.singleCampaniaData.Asesor_Valido_Apellido = this.currentUser.Apellido;
            
            // Mostrar popup de éxito
            this.popupMessage = 'Campaña Aprobada';
            this.showPopup = true;
          }
        },
        error: (err) => {
          this.popupMessage = 'Error al actualizar la campaña';
          this.showPopup = true;
        }
      });
    }
  }

  onAnularCampaniaClick(): void {
    this.campaniaService.anularCampania(this.singleCampaniaId).subscribe(
      response => {
        if (response.success) {
          this.popupMessage = 'Campaña Anulada';
          this.showPopup = true;
          this.singleCampaniaData.Estado_Anulado = 1;
        }
      },
      error => {
        this.popupMessage = 'Error al anular la campaña';
        this.showPopup = true;
      }
    );
  }

  // Nuevo método para cerrar popup
  closePopup(): void {
    this.showPopup = false;
    window.history.back();
  }


  onRevertirAnulacionClick(): void {
    this.campaniaService.revertirAnulacion(this.singleCampaniaId).subscribe(
      response => {
        if (response.success) {
          this.popupMessage = 'Anulación revertida';
          this.showPopup = true;
          this.singleCampaniaData.Estado_Anulado = 0;
          this.singleCampaniaData.Estado = 0;
        }
      },
      error => {
        this.popupMessage = 'Error al revertir anulación';
        this.showPopup = true;
      }
    );
  }

}

