import { StorageKey } from '../enums/storage-key.enum';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly storage = localStorage;

  get<T>(key: StorageKey): T | null {
    const data = this.storage.getItem(key);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  }

  set(key: StorageKey, value: unknown): boolean {
    if (!value) {
      return false;
    }

    try {
      const item = typeof value === 'object' ? JSON.stringify(value) : String(value);

      this.storage.setItem(key, item);

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  removeItem(key: StorageKey): void {
    this.storage.removeItem(key);
  }
}
