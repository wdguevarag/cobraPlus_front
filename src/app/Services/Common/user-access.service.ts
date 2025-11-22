import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {
    
    UserAccess = [
        {
          "ID": "1",
          "Nombre": "Seguridad",
          "Descripcion": "Seguridad Descripcion",
          "Ruta": "/seguridad",
          "Estado": "1",
          "Icono": "bi-shield-lock",
          "Fecha_Registro": "2025-02-18 21:54:40",
          "Fecha_Actualizacion": "2025-02-18 21:54:40",
          "Modulos": [
            {
              "ID": "1",
              "Nombre": "Seguridad",
              "Aplicacion_ID": "1",
              "Descripcion": "Seguridad Modulo",
              "Icono": "bi-shield-lock", // Asumo el mismo ícono (no estaba en la data)
              "Ruta": "/seguridad",       // Asumo ruta base
              "Estado": "1",
              "Accesos": [

                  {
                    ID: "1",
                    Nombre: "Aplicaciones",
                    Ruta: "aplicacion",
                    Descripcion: "Aplicaciones Descripción",
                    Estado: "1",
                    Icono: "Aplicaciones Icono",
                    Aplicaion_ID: "1",
                    Modulo_ID: "1"
                  },
                  {
                    ID: "2",
                    Nombre: "Módulos",
                    Ruta: "modulo",
                    Descripcion: "Módulos Descripción",
                    Estado: "1",
                    Icono: "Módulos Icono",
                    Aplicaion_ID: "1",
                    Modulo_ID: "1"
                  },
                  {
                    ID: "3",
                    Nombre: "Accesos",
                    Ruta: "acceso",
                    Descripcion: "Accesos Descripción",
                    Estado: "1",
                    Icono: "Accesos Icono",
                    Aplicaion_ID: "1",
                    Modulo_ID: "1"
                  },
                  {
                    ID: "4",
                    Nombre: "Empresas",
                    Ruta: "empresa",
                    Descripcion: "Empresas Descripción",
                    Estado: "1",
                    Icono: "Empresas Icono",
                    Aplicaion_ID: "1",
                    Modulo_ID: "1"
                  },
                  {
                    ID: "5",
                    Nombre: "Oficinas",
                    Ruta: "oficina",
                    Descripcion: "Oficinas Descripción",
                    Estado: "1",
                    Icono: "Oficinas Icono",
                    Aplicaion_ID: "1",
                    Modulo_ID: "1"
                  },
                  {
                    ID: "6",
                    Nombre: "Roles",
                    Ruta: "rol",
                    Descripcion: "Roles Descripción",
                    Estado: "1",
                    Icono: "Roles Icono",
                    Aplicaion_ID: "1",
                    Modulo_ID: "1"
                  },
                  {
                    ID: "7",
                    Nombre: "Usuarios",
                    Ruta: "usuario",
                    Descripcion: "Usuarios Descripcion",
                    Estado: "1",
                    Icono: "Usuarios Icono",
                    Aplicaion_ID: "1",
                    Modulo_ID: "1"
                  }

              ] 
            },
            {
              "ID": "2",
              "Nombre": "Empresa",
              "Aplicacion_ID": "1",
              "Descripcion": "Empresa Modulo",
              "Icono": "bi-bank",
              "Ruta": "/empresa",         
              "Estado": "1",
              "Accesos": [
              ] 
            }
          ]
        },
        {
          "ID": "2",
          "Nombre": "Créditos",
          "Descripcion": "Créditos Descripción",
          "Ruta": "/creditos",
          "Estado": "1",
          "Icono": "bi-cash-stack",
          "Fecha_Registro": "2025-02-18 17:54:12",
          "Fecha_Actualizacion": "2025-02-18 17:54:12",
          "Modulos": [
            {
              "ID": "3",
              "Nombre": "Parametros",
              "Aplicacion_ID": "2",
              "Descripcion": "Parametros Modulo",
              "Icono": "bi-gear",         // Asumo ícono genérico
              "Ruta": "parametros",
              "Estado": "1",
              "Accesos": [
                  {
                    ID: "8",
                    Nombre: "Parámetros",
                    Ruta: "parametro",
                    Descripcion: "Parámetros Descripción",
                    Estado: "1",
                    Icono: "Parámetros Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "3"
                  },
                  {
                    ID: "9",
                    Nombre: "Grupo de Datos",
                    Ruta: "grupo-de-dato",
                    Descripcion: "Grupo de Datos Descripción",
                    Estado: "1",
                    Icono: "GrupoDatos Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "3"
                  }
              ]
            },
            {
              "ID": "4",
              "Nombre": "Mantenimiento",
              "Aplicacion_ID": "2",
              "Descripcion": "Mantenimiento Modulos",
              "Icono": "bi-wrench",       // Asumo ícono
              "Ruta": "mantenimiento",
              "Estado": "1",
              "Accesos": [
                 {
                    ID: "10",
                    Nombre: "Clientes",
                    Ruta: "cliente",
                    Descripcion: "Clientes Descripción",
                    Estado: "1",
                    Icono: "Clientes Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "4"
                  },
                  {
                    ID: "11",
                    Nombre: "Asesores",
                    Ruta: "asesor",
                    Descripcion: "Asesores Descripción",
                    Estado: "1",
                    Icono: "Asesores Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "4"
                  },
              ]
            },
            {
              "ID": "5",
              "Nombre": "Consulta",
              "Aplicacion_ID": "2",
              "Descripcion": "Consulta Modulo",
              "Icono": "bi-search",
              "Ruta": "consulta",
              "Estado": "1",
              "Accesos": [
                 {
                    ID: "12",
                    Nombre: "Simulador",
                    Ruta: "simulador",
                    Descripcion: "Simulador Descripción",
                    Estado: "1",
                    Icono: "Simulador Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "5"
                  },
                  {
                    ID: "13",
                    Nombre: "Consultas Crédito",
                    Ruta: "consulta-credito",
                    Descripcion: "Consultas Crédito Descripción",
                    Estado: "1",
                    Icono: "ConsultasCredito Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "5"
                  },
                  {
                    ID: "14",
                    Nombre: "Fic",
                    Ruta: "fic",
                    Descripcion: "Fic Descripción",
                    Estado: "1",
                    Icono: "Fic Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "5"
                  },
                  {
                    ID: "15",
                    Nombre: "Comprobante Compra",
                    Ruta: "comprobante-compra",
                    Descripcion: "Comprobante Compra Descripción",
                    Estado: "1",
                    Icono: "ComprobanteCompra Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "5"
                  },
                  {
                    ID: "16",
                    Nombre: "Cartera del Cliente",
                    Ruta: "cartera-del-cliente",
                    Descripcion: "Cartera del Cliente Descripción",
                    Estado: "1",
                    Icono: "CarteraCliente Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "5"
                  }

              ]
            },
            {
              "ID": "6",
              "Nombre": "Créditos",
              "Aplicacion_ID": "2",
              "Descripcion": "Créditos Modulo",
              "Icono": "bi-coin",         
              "Ruta": "creditos",
              "Estado": "1",
              "Accesos": [
                  {
                    ID: "17",
                    Nombre: "Solicitud Créditos",
                    Ruta: "solicitud-credito",
                    Descripcion: "Solicitud Créditos Descripción",
                    Estado: "1",
                    Icono: "SolicitudCreditos Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "6"
                  },
                  {
                    ID: "18",
                    Nombre: "Traslado Cartera",
                    Ruta: "traslado-cartera",
                    Descripcion: "Traslado Cartera Descripción",
                    Estado: "1",
                    Icono: "TrasladoCartera Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "6"
                  },
                  {
                    ID: "19",
                    Nombre: "Refinanciación",
                    Ruta: "refinanciacion",
                    Descripcion: "Refinanciación Descripción",
                    Estado: "1",
                    Icono: "Refinanciacion Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "6"
                  },
                  {
                    ID: "20",
                    Nombre: "Castigo Cartera",
                    Ruta: "castigo-cartera",
                    Descripcion: "Castigo Cartera Descripción",
                    Estado: "1",
                    Icono: "CastigoCartera Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "6"
                  },
                  {
                    ID: "21",
                    Nombre: "Condonación",
                    Ruta: "condonacion",
                    Descripcion: "Condonación Descripción",
                    Estado: "1",
                    Icono: "Condonacion Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "6"
                  }
              ]
            },
            {
              "ID": "7",
              "Nombre": "Operaciones",
              "Aplicacion_ID": "2",
              "Descripcion": "Operaciones Modulo",
              "Icono": "bi-calculator",   // Asumo ícono
              "Ruta": "operaciones",
              "Estado": "1",
              "Accesos": [

                {
                    ID: "22",
                    Nombre: "Pago",
                    Ruta: "pago",
                    Descripcion: "Pago Descripción",
                    Estado: "1",
                    Icono: "Pago Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  },
                  {
                    ID: "23",
                    Nombre: "Desembolso",
                    Ruta: "desembolso",
                    Descripcion: "Desembolso Descripción",
                    Estado: "1",
                    Icono: "Desembolso Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  },
                  {
                    ID: "24",
                    Nombre: "Depósitos Bancarios",
                    Ruta: "deposito-bancario",
                    Descripcion: "Depósitos Bancarios Descripción",
                    Estado: "1",
                    Icono: "DepositosBancarios Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  },
                  {
                    ID: "25",
                    Nombre: "Anular Operación",
                    Ruta: "extorno",
                    Descripcion: "Extorno Descripción",
                    Estado: "1",
                    Icono: "Extorno Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  },
                  {
                    ID: "26",
                    Nombre: "Pago Cancelación",
                    Ruta: "pago-cancelacion",
                    Descripcion: "Pago Cancelación Descripción",
                    Estado: "1",
                    Icono: "PagoCancelacion Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  },
                  {
                    ID: "27",
                    Nombre: "Proyección Desembolso",
                    Ruta: "proyeccion-desembolso",
                    Descripcion: "Proyección Desembolso Descripción",
                    Estado: "1",
                    Icono: "ProyeccionDesembolso Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  },
                  {
                    ID: "28",
                    Nombre: "Transferencias",
                    Ruta: "transferencia",
                    Descripcion: "Transferencias Descripción",
                    Estado: "1",
                    Icono: "Transferencias Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  },
                  {
                    ID: "29",
                    Nombre: "Campañas",
                    Ruta: "campaña",
                    Descripcion: "Campañas Descripción",
                    Estado: "1",
                    Icono: "Campañas Icono",
                    Aplicacion_ID: "2",
                    Modulo_ID: "7"
                  }

              ]
            },
            {
              "ID": "8",
              "Nombre": "Reportes ",
              "Aplicacion_ID": "2",
              "Descripcion": "Reportes Modulo",
              "Icono": "bi-file-earmark-text", // Asumo ícono
              "Ruta": "reportes",
              "Estado": "1",
              "Accesos": []
            },
            {
              "ID": "9",
              "Nombre": "Oficialía",
              "Aplicacion_ID": "2",
              "Descripcion": "Oficialía Modulo",
              "Icono": "bi-person-badge", // Asumo ícono
              "Ruta": "oficialia",
              "Estado": "1",
              "Accesos": []
            },
            {
              "ID": "10",
              "Nombre": "Documentos",
              "Aplicacion_ID": "2",
              "Descripcion": "Documentos Modulo",
              "Icono": "bi-folder",       // Asumo ícono
              "Ruta": "documentos",
              "Estado": "1",
              "Accesos": []
            },
            {
              "ID": "11",
              "Nombre": "Indicadores",
              "Aplicacion_ID": "2",
              "Descripcion": "Indicadores Modulo",
              "Icono": "bi-bar-chart",
              "Ruta": "indicador",
              "Estado": "1",
              "Accesos": []
            }
          ]
        }
    ]
  
}
