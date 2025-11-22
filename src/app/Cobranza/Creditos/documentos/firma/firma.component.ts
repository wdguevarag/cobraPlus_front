import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/Services/clientes.service';
import { CreditoService } from 'src/app/Services/creditos.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { PAGE_URL } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/Services/Common/Auth.service';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.scss']
})
export class FirmaComponent implements OnInit, OnDestroy {

  page_url = PAGE_URL;
  intercalar: boolean = false; 

  @ViewChild('searchInput') searchInput!: ElementRef;
  clientesEncontrados: any[] = [];
  creditosCliente: any[] = [];
  clienteSeleccionado: any = null;

  currentUser: any ;

  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();

  isSearchFocused = false;


  constructor(
    private clienteService: ClienteService,
    private creditoService: CreditoService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
      // Solo después de tener currentUser:
      this.configurarBuscador();
      // this.cargarClientesIniciales();
      this.cargarCreditosIniciales();
    });
    
  }

  // Carga la lista de clientes que tienen crédito por firmar
  private cargarClientesIniciales(): void {
    this.clienteService.getClientesCreditoPorFirmar().subscribe(clientes => {
      this.clientesEncontrados = clientes.filter(item =>
        this.currentUser.Perfil_ID !== '3' ||  item.Asesor_ID == +this.currentUser.ID 
      );
    });
  }


  onBlurWithDelay() {
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200);
  }


  
  private cargarCreditosIniciales(): void {
    this.clienteService.getCreditosPorFirmarGeneral()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: creditos => {  
          this.creditosCliente = creditos
            .filter(item =>
              item.Estado_Credito == 1 &&
              item.Estado_Deuda   == 0 &&
              item.Documentos_Firmados == 0 &&
              item.Estado_Anulado == 0 &&
              (
                this.currentUser.Perfil_ID !== '3' ||  // si no es Rol 3, no filtra por usuario
                item.Usuario_ID == +this.currentUser.ID   // si es Rol 3, sí filtra por usuario
              )
              
            )
            .sort((a, b) => b.ID - a.ID);
        },
        error: err => console.error('Error al cargar los créditos generales:', err)
      });
  }





  // Configura el buscador con debounce y suscripción para filtrar clientes
  private configurarBuscador(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => this.filtrarClientes(term.trim().toLowerCase()));
  }

  // Filtro de clientes en base al input ingresado
  private filtrarClientes(term: string): void {
    if (!term) {
      this.clientesEncontrados = [];
      return;
    }
    this.clienteService.getClientes().subscribe(clientes => {
      this.clientesEncontrados = clientes.filter(cliente => 
        `${cliente.Nombres} ${cliente.Apellido_Paterno} ${cliente.Apellido_Materno} ${cliente.Documento}`
          .toLowerCase()
          .includes(term)
      )
      .filter(item =>
        this.currentUser.Perfil_ID !== '3' ||  item.Asesor_ID == +this.currentUser.ID 
      );


    });
  }

  // Captura el input del usuario
  buscarCliente(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerms.next(term);
  }

  // Al seleccionar un cliente, se limpia el input, se guarda el cliente seleccionado
  // y se cargan los créditos por firmar filtrados por el ID del cliente.
  seleccionarCliente(cliente: any): void {
    this.searchInput.nativeElement.value = `${cliente.Nombres} ${cliente.Apellido_Paterno} ${cliente.Apellido_Materno}`;
    this.clientesEncontrados = [];
    this.clienteSeleccionado = cliente;
    
    this.clienteService.getCreditosPorFirmarByClienteId(cliente.ID).subscribe({
      next: (creditos) => {
        // Se filtran solo aquellos créditos cuyo Estado_Credito sea 1 y Estado_Deuda 0
        this.creditosCliente = creditos.filter(item => 
          item.Estado_Credito == 1 && 
          item.Estado_Deuda == 0 && 
          item.Documentos_Firmados == 0 &&
          item.Estado_Anulado == 0 
              

        );
        // Puedes agregar aquí el filtro adicional para DESSEMBOLSO FIRMADO o REFINANCIADO FIRMADO.
      },
      error: (err) => console.error('Error obteniendo créditos para el cliente:', err)
    });
  }

  // Permite volver a la vista general de créditos por firmar
  restablecerBusqueda(): void {
    this.clienteSeleccionado = null;
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.value = '';
    }
    this.cargarCreditosIniciales();
  }

  // Alterna la imagen (entre anverso y reverso) de un crédito
  intercalarImg(creditoId: number): void {
    const credito = this.creditosCliente.find(c => c.ID === creditoId);
    if (credito) {
      credito.intercalar = !credito.intercalar;
    }
  }

  // Retorna URL segura para ser usada en [src] de las imágenes
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}