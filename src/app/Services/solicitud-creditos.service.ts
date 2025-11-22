import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject , Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudCreditoService {
  private solicitudesCredito = new BehaviorSubject<any[]>([
    {
    id: 1,
    cliente: 'Rocio Pilar',
    clienteId:'1',
    capital: '100',
    modalidad: 'solicitud',
    usuario: 'JPeña',
    anulado: 'no' ,
    revision: 'no',
    fecha: '20/10/24' ,
    estado: "activo",
    },

    {
      id: 2,
      cliente: 'Jose Estevan',
      clienteId:'2',
      capital: '400',
      modalidad: 'solicitud',
      usuario: 'JoseA',
      anulado: 'no' ,
      revision: 'si',
      fecha: '11/07/24' ,
      estado: "activo",
    },

    {
      id: 3,
      cliente: 'Juan Delgado',
      clienteId:'3',
      capital: '600',
      modalidad: 'solicitud',
      usuario: 'MariaF',
      anulado: 'no' ,
      revision: 'no',
      fecha: '25/11/24' ,
      estado: "activo",
    },

  ]);

  getSolicitudesCredito() {
    return this.solicitudesCredito.asObservable();
  }

  getSolicitudCreditoById(id: number) {
    return this.solicitudesCredito.value.find(solicitudesCredito => solicitudesCredito.id === id);
  }


  /*

  getDomicilioById(clienteId: number, domicilioId: number) {
    const cliente = this.getClienteById(clienteId);
    if (cliente) {
      const domicilio = cliente.domicilios.find(d => d.id === domicilioId.toString());
      return domicilio || null; 
    }
    return null;
  }

  getNegocioById(clienteId: number, negocioId: number) {
    const cliente = this.getClienteById(clienteId);
    if (cliente) {
      const negocio = cliente.negocios.find(n => n.id === negocioId.toString());
      return negocio || null; 
    }
    return null;
  }

  getContactoById(clienteId: number, contactoId: number) {
    const cliente = this.getClienteById(clienteId);
    if (cliente) {
      const contacto = cliente.contactos.find(c => c.id === contactoId.toString());
      return contacto || null; 
    }
    return null;
  }

  getCuentaById(clienteId: number, cuentaId: number) {
    const cliente = this.getClienteById(clienteId);
    if (cliente) {
      const cuenta = cliente.cuentas.find(cu => cu.id === cuentaId.toString());
      return cuenta || null; 
    }
    return null;
  }

  getDocumentoById(clienteId: number, documentoId: number) {
    const cliente = this.getClienteById(clienteId);
    if (cliente) {
      const documento = cliente.documentos.find(doc => doc.id === documentoId.toString());
      return documento || null; 
    }
    return null;
  }

  getFamiliarById(clienteId: number, familiarId: number) {
    const cliente = this.getClienteById(clienteId);
    if (cliente) {
      const familiar = cliente.familiares.find(f => f.id === familiarId.toString());
      return familiar || null; 
    }
    return null;
  }
  
  */

  
  
}