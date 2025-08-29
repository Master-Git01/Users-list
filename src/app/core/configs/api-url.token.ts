import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL', {
  factory: (): string => 'https://jsonplaceholder.typicode.com',
});
