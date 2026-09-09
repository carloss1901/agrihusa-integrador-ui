import { Injectable } from '@angular/core';
import { StorageKey } from '../constants/storage-keys.constant';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  guardar<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  obtener<T>(key: StorageKey): T | null {
    const value = localStorage.getItem(key);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      this.eliminar(key);
      return null;
    }
  }

  eliminar(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  existe(key: StorageKey): boolean {
    return localStorage.getItem(key) !== null;
  }
}