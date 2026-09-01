import { Injectable } from '@angular/core';

import { crearRolesIniciales } from '../../features/roles/data/roles.seed';
import { Rol } from '../../features/roles/models/rol.model';
import {
  CREDENCIALES_ADMIN_INICIAL,
  crearUsuariosIniciales
} from '../../features/usuarios/data/usuarios.seed';
import { Usuario } from '../../features/usuarios/models/usuario.model';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import { LocalStorageService } from './local-storage.service';
import { PasswordHashService } from './password-hash.service';

@Injectable({
  providedIn: 'root'
})
export class StorageInitializerService {
  private readonly versionActual = '1.0.0';

  constructor(
    private localStorageService: LocalStorageService,
    private passwordHashService: PasswordHashService
  ) {}

  async inicializar(): Promise<void> {
    this.inicializarVersion();
    this.inicializarRoles();
    await this.inicializarUsuarios();
  }

  private inicializarVersion(): void {
    const version =
      this.localStorageService.obtener<string>(
        STORAGE_KEYS.STORAGE_VERSION
      );

    if (version === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.STORAGE_VERSION,
        this.versionActual
      );
    }
  }

  private inicializarRoles(): void {
    const roles =
      this.localStorageService.obtener<Rol[]>(
        STORAGE_KEYS.ROLES
      );

    if (roles === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.ROLES,
        crearRolesIniciales()
      );
    }
  }

  private async inicializarUsuarios(): Promise<void> {
    const usuarios =
      this.localStorageService.obtener<Usuario[]>(
        STORAGE_KEYS.USUARIOS
      );

    if (usuarios !== null) {
      return;
    }

    const passwordHash =
      await this.passwordHashService.crearHash(
        CREDENCIALES_ADMIN_INICIAL.password
      );

    this.localStorageService.guardar(
      STORAGE_KEYS.USUARIOS,
      crearUsuariosIniciales(passwordHash)
    );
  }
}