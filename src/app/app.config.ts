import { APP_INITIALIZER,  ApplicationConfig} from '@angular/core';
import { StorageInitializerService } from './core/services/storage-initializer.service';

export function inicializarStorageFactory(
  storageInitializerService: StorageInitializerService
): () => Promise<void> {
  return () => storageInitializerService.inicializar();
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: inicializarStorageFactory,
      deps: [StorageInitializerService],
      multi: true
    }
  ]
};