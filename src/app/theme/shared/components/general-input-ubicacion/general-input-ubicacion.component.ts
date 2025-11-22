import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, OnInit, Output , Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { Ubicacion, UbicacionService } from 'src/app/Services/ubicaciones/ubicacion.service';

interface UbicacionRuta {
  departamento: string;
  provincia: string;
  distrito: string;
}

@Component({
  selector: 'app-general-input-ubicacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './general-input-ubicacion.component.html',
  styleUrls: ['./general-input-ubicacion.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralInputUbicacionComponent),
      multi: true
    }
  ]
})
export class GeneralInputUbicacionComponent implements OnInit, ControlValueAccessor {

  @Output() ubicacionSeleccionada = new EventEmitter<string>();
  @Input() editable: boolean = true ;


  // Control interno del input
  searchControl = new FormControl('');

  // Observables para las sugerencias
  filteredRutas!: Observable<UbicacionRuta[]>;

  private allRutas: UbicacionRuta[] = [];
  showSuggestions: boolean = false;

  // Funciones de callback para notificar cambios y toques
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    // Obtener las ubicaciones y configurar el filtrado
    this.ubicacionService.getUbicacion().subscribe((data) => {
      this.allRutas = data.flatMap(depto =>
        depto.provincias.flatMap(prov =>
          prov.distritos.map(dist => ({
            departamento: depto.departamento,
            provincia: prov.provincia,
            distrito: dist
          }))
        )
      );
      this.setupFilter();
    });

    // Si el usuario cambia el valor, notificar el cambio al modelo
    this.searchControl.valueChanges.subscribe((value: string) => {
      this.onChange(value);
      // Si necesitas emitir también a través del Output:
      this.ubicacionSeleccionada.emit(value);
    });
  }

  setupFilter() {
    this.filteredRutas = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): UbicacionRuta[] {
    const filterValue = value.toLowerCase();
    return this.allRutas.filter(ruta =>
      `${ruta.departamento}/${ruta.provincia}/${ruta.distrito}`.toLowerCase().includes(filterValue)
    );
  }



  onBlur() {
    // Notificar que se ha tocado el control y ocultar sugerencias
    this.onTouched();
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }





  onFocus() {
    if (!this.editable) {
      return;
    }
    this.showSuggestions = true;
  }
  
  onSelect(ruta: UbicacionRuta) {
    if (!this.editable) {
      return;
    }
    const text = `${ruta.departamento}/${ruta.provincia}/${ruta.distrito}`;
    this.searchControl.setValue(text);
    this.onChange(text);
    this.ubicacionSeleccionada.emit(text);
    this.showSuggestions = false;
  }
  


  // Métodos de ControlValueAccessor

  writeValue(value: any): void {
    if (value) {
      this.searchControl.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }

  
}
