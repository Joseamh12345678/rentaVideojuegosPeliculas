import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData,
         doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { query } from '@angular/fire/firestore';
import { where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private clientesCollection;

  constructor(private firestore: Firestore) {
    this.clientesCollection = collection(this.firestore, 'clientes');
  }

  // Obtener todos los clientes, incluyendo el ID de cada documento
 getClientesPorUsuario(uid: string): Observable<Cliente[]> {
  const ref = collection(this.firestore, 'clientes');
  const q = query(ref, where('uid_firebase', '==', uid));
  return collectionData(q, { idField: 'id' }) as Observable<Cliente[]>;
}

  addCliente(cliente: Cliente): Promise<any> {
    return addDoc(this.clientesCollection, cliente);
  }

  updateCliente(id: string, cliente: Partial<Cliente>): Promise<void> {
    const clienteDoc = doc(this.firestore, `clientes/${id}`);
    return updateDoc(clienteDoc, cliente);
  }

  deleteCliente(id: string): Promise<void> {
    const clienteDoc = doc(this.firestore, `clientes/${id}`);
    return deleteDoc(clienteDoc);
  }

}