import { openDB } from 'idb';
import { User } from '../types/index';

const DB_NAME = 'citasVetDB';
const DB_VERSION = 5;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('usuarios')) {
        db.createObjectStore('usuarios', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('mascotas')) {
        const store = db.createObjectStore('mascotas', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuarioId', 'usuarioId');
      }
      if (!db.objectStoreNames.contains('citas')) {
        const store = db.createObjectStore('citas', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuarioId', 'usuarioId');
        store.createIndex('mascotaId', 'mascotaId');
      }
    },
  });
}

export async function addUsuario(usuario: User) {
  const db = await initDB();
  await db.add('usuarios', usuario);
}

export async function getUsuarioByCorreo(correo: string) {
  const db = await initDB();
  const tx = db.transaction('usuarios');
  const store = tx.objectStore('usuarios');
  let match: User | undefined;

  for await (const cursor of store) {
    if (cursor.value.correo === correo) {
      match = cursor.value;
      break;
    }
  }

  return match;
}


// Funciones de Registrar Mascotas 
export async function addMascota(mascota: { nombre: string; especie: string; edad: number; estado?: string; usuarioId: number }) {
  const db = await initDB();
  await db.add('mascotas', mascota);
}

export async function getMascotasByUsuarioId(usuarioId: number) {
  const db = await initDB();
  return (await db.getAllFromIndex('mascotas', 'usuarioId', IDBKeyRange.only(usuarioId))) || [];
}




export async function addCita(cita: {
  usuarioId: number;
  mascotaId: number;
  fecha: string;
  hora: string;
}) {
  const db = await initDB();
  await db.add('citas', {
    ...cita,
    estado: 'pendiente'
  });
}

export async function getCitasByUsuarioId(usuarioId: number) {
  const db = await initDB();
  return await db.getAllFromIndex('citas', 'usuarioId', IDBKeyRange.only(usuarioId));
}

export async function updateCitaEstado(id: number, nuevoEstado: string , observacion:string) {
  const db = await initDB();
  const cita = await db.get('citas', id);
  if (cita) {
    cita.estado = nuevoEstado;
    cita.observacion = observacion;
    await db.put('citas', cita);
  }
}

export async function getTodasLasCitas() {
  const db = await initDB();
  return await db.getAll('citas');
}

export async function getHistorialPorMascota(mascotaId: number) {
  const db = await initDB();
  const todas = await db.getAll('citas');
  return todas.filter(cita => cita.mascotaId === mascotaId && cita.estado === 'atendida');
}