import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class IncentivosService {
  private apiUrl = SERVER_URL + 'ws_creditos/ws_Indicador.php';
  empresaID: string = localStorage.getItem('empresa_id') || '';

  constructor(private http: HttpClient) {}

  getIncentivoAnalista(Analista_ID: number | null, Fecha: string | null): Observable<any> {
    let params = new HttpParams()
      .set('codOpe', 'OIA')
      .set('Empresa_ID', this.empresaID);

    if (Analista_ID !== null) {
      params = params.set('Analista_ID', Analista_ID.toString());
    }

    if (Fecha && Fecha.trim() !== '') {
      params = params.set('Fecha', Fecha);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  /** ======================= LÓGICA DE INCENTIVOS ======================= */

  // Tabla de incentivos por variación de clientes nuevos
  private incentivoClientes: { [clientesAnterior: string]: { [variacion: string]: number } } = {
    "50": { "5": 60, "6": 69, "7": 78, "8": 89, "9": 99, "10": 109, "11": 119, "12": 129, "13": 139, "14": 149, "15": 159, "16": 169, "17": 169, "18": 179 },
    "51": { "5": 61, "6": 70, "7": 80, "8": 91, "9": 101, "10": 111, "11": 121, "12": 131, "13": 141, "14": 151, "15": 161, "16": 171, "17": 171, "18": 182 },
    "52": { "5": 62, "6": 71, "7": 81, "8": 93, "9": 103, "10": 113, "11": 123, "12": 133, "13": 143, "14": 153, "15": 163, "16": 173, "17": 173, "18": 184 },
    // ...
    "75": { "5": 85, "6": 94, "7": 104, "8": 116, "9": 126, "10": 136, "11": 146, "12": 156, "13": 166, "14": 176, "15": 186, "16": 196, "17": 196, "18": 207 },
    ">75": { "5": 90, "6": 100, "7": 110, "8": 122, "9": 132, "10": 142, "11": 152, "12": 162, "13": 172, "14": 182, "15": 192, "16": 202, "17": 202, "18": 213 }
  };

  // Tabla de incentivos por variación de mora > 8 días
  private incentivoMora: { [moraAnterior: string]: { [variacion: string]: number } } = {
    "0%-5%": {
      "-9%": 400, "-8%": 385, "-7%": 355, "-6%": 310, "-5%": 265, "-4%": 220,
      "-3%": 175, "-2%": 110, "-1%": 75, "0%": 50, "1%": 0, "2%": 0, ">=5%": 0
    },
    "5.01%-10%": {
      "-9%": 385, "-8%": 370, "-7%": 355, "-6%": 340, "-5%": 325, "-4%": 310,
      "-3%": 295, "-2%": 280, "-1%": 180, "0%": 150, "1%": 75, "2%": 30, ">=5%": 0
    },
    "10.01%-15%": {
      "-9%": 370, "-8%": 355, "-7%": 340, "-6%": 325, "-5%": 310, "-4%": 295,
      "-3%": 280, "-2%": 265, "-1%": 160, "0%": 130, "1%": 60, "2%": 0, ">=5%": 0
    },
    "15.01%-20%": {
      "-9%": 355, "-8%": 340, "-7%": 325, "-6%": 310, "-5%": 295, "-4%": 280,
      "-3%": 265, "-2%": 250, "-1%": 140, "0%": 110, "1%": 40, "2%": 0, ">=5%": 0
    },
    "20.01%-25%": {
      "-9%": 340, "-8%": 325, "-7%": 310, "-6%": 295, "-5%": 280, "-4%": 265,
      "-3%": 250, "-2%": 240, "-1%": 120, "0%": 90, "1%": 20, "2%": 0, ">=5%": 0
    },
    "25.01%-30%": {
      "-9%": 325, "-8%": 310, "-7%": 295, "-6%": 280, "-5%": 265, "-4%": 250,
      "-3%": 240, "-2%": 230, "-1%": 100, "0%": 70, "1%": 0, "2%": 0, ">=5%": 0
    },
    "30.01%-35%": {
      "-9%": 310, "-8%": 295, "-7%": 280, "-6%": 265, "-5%": 250, "-4%": 240,
      "-3%": 230, "-2%": 220, "-1%": 80, "0%": 50, "1%": 0, "2%": 0, ">=5%": 0
    },
    "35.01%-40%": {
      "-9%": 295, "-8%": 280, "-7%": 265, "-6%": 250, "-5%": 240, "-4%": 230,
      "-3%": 220, "-2%": 210, "-1%": 60, "0%": 30, "1%": 0, "2%": 0, ">=5%": 0
    },
    "40.01%-45%": {
      "-9%": 280, "-8%": 265, "-7%": 250, "-6%": 240, "-5%": 230, "-4%": 220,
      "-3%": 210, "-2%": 200, "-1%": 40, "0%": 10, "1%": 0, "2%": 0, ">=5%": 0
    },
    "45.01%-50%": {
      "-9%": 265, "-8%": 250, "-7%": 240, "-6%": 230, "-5%": 220, "-4%": 210,
      "-3%": 200, "-2%": 190, "-1%": 20, "0%": 0, "1%": 0, "2%": 0, ">=5%": 0
    },
    ">50%": {
      "-9%": 240, "-8%": 225, "-7%": 210, "-6%": 200, "-5%": 180, "-4%": 160,
      "-3%": 140, "-2%": 120, "-1%": 0, "0%": 0, "1%": 0, "2%": 0, ">=5%": 0
    }
  };

 
  calcularIncentivo(
    clientesActual: number,
    clientesAnterior: number,
    moraActual: number,
    moraAnterior: number,
    fechaActual: string,
    fechaAnterior: string
  ): {
    Incentivo_Clientes_Nuevos: number;
    Incentivo_Mora_8d: number;
    Rango_Fecha: string;
    Variacion_Clientes_Nuevos: number;
    Variacion_Mora_8d: string;
  } {
    // Variación de clientes nuevos
    const variacionClientesNum = clientesActual - clientesAnterior;
    const variacionClientesStr = String(variacionClientesNum);
    const keyClientes = clientesAnterior > 75 ? '>75' : String(clientesAnterior);
    const incentivoClientes = this.incentivoClientes[keyClientes]?.[variacionClientesStr] ?? 0;

    // Variación de mora
    const diferenciaMora = +(moraActual - moraAnterior).toFixed(1); // diferencia porcentual
    const variacionMora = this.obtenerRangoVariacionMora(diferenciaMora);
    const rangoMoraAnterior = this.obtenerRangoMora(moraAnterior);
    const incentivoMora = this.incentivoMora[rangoMoraAnterior]?.[variacionMora] ?? 0;

    // Resultado final
    return {
      Incentivo_Clientes_Nuevos: incentivoClientes,
      Incentivo_Mora_8d: incentivoMora,
      Rango_Fecha: `${fechaActual} - ${fechaAnterior}`,
      Variacion_Clientes_Nuevos: variacionClientesNum,
      Variacion_Mora_8d: variacionMora
    };
  }

  private obtenerRangoVariacionMora(valor: number): string {
    if (valor <= -9) return "-9%";
    if (valor <= -8) return "-8%";
    if (valor <= -7) return "-7%";
    if (valor <= -6) return "-6%";
    if (valor <= -5) return "-5%";
    if (valor <= -4) return "-4%";
    if (valor <= -3) return "-3%";
    if (valor <= -2) return "-2%";
    if (valor <= -1) return "-1%";
    if (valor === 0) return "0%";
    if (valor <= 1) return "1%";
    if (valor <= 2) return "2%";
    return ">=5%";
  }

  private obtenerRangoMora(valor: number): string {
    if (valor <= 5) return "0%-5%";
    if (valor <= 10) return "5.01%-10%";
    if (valor <= 15) return "10.01%-15%";
    if (valor <= 20) return "15.01%-20%";
    if (valor <= 25) return "20.01%-25%";
    if (valor <= 30) return "25.01%-30%";
    if (valor <= 35) return "30.01%-35%";
    if (valor <= 40) return "35.01%-40%";
    if (valor <= 45) return "40.01%-45%";
    if (valor <= 50) return "45.01%-50%";
    return ">50%";
  }

}
