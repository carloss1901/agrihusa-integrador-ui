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
import { crearClientesIniciales } from '../../features/clientes/data/clientes.seed';
import { Cliente } from '../../features/clientes/models/cliente.model';
import { crearNavierasIniciales } from '../../features/navieras/data/navieras.seed';
import { Naviera } from '../../features/navieras/models/naviera.model';
import { crearDestinosIniciales } from '../../features/destinos/data/destinos.seed';
import { Destino } from '../../features/destinos/models/destino.model';
import { crearOperadoresLogisticosIniciales } from '../../features/operadores-logisticos/data/operadores-logisticos.seed';
import { OperadorLogistico } from '../../features/operadores-logisticos/models/operador-logistico.model';

@Injectable({
  providedIn: 'root'
})
export class StorageInitializerService {
  private readonly versionActual = '1.0.0';

  constructor(
    private localStorageService: LocalStorageService,
    private passwordHashService: PasswordHashService
  ) { }

  async inicializar(): Promise<void> {
    this.inicializarVersion();
    this.inicializarRoles();
    this.inicializarClientes();
    this.inicializarNavieras();
    this.inicializarDestinos();
    this.inicializarOperadoresLogisticos();
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

  private inicializarClientes(): void {
    const clientes =
      this.localStorageService.obtener<Cliente[]>(
        STORAGE_KEYS.CLIENTES
      );

    if (clientes === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.CLIENTES,
        crearClientesIniciales()
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

  private inicializarNavieras(): void {
    const navieras =
      this.localStorageService.obtener<Naviera[]>(
        STORAGE_KEYS.NAVIERAS
      );

    if (navieras === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.NAVIERAS,
        crearNavierasIniciales()
      );
    }
  }

  private inicializarDestinos(): void {
    const destinos =
      this.localStorageService.obtener<Destino[]>(
        STORAGE_KEYS.DESTINOS
      );

    if (destinos === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.DESTINOS,
        crearDestinosIniciales()
      );
    }
  }
  private inicializarOperadoresLogisticos(): void {
    const operadores =
      this.localStorageService.obtener<
        OperadorLogistico[]
      >(
        STORAGE_KEYS.OPERADORES_LOGISTICOS
      );

    if (operadores === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.OPERADORES_LOGISTICOS,
        crearOperadoresLogisticosIniciales()
      );
    }
  }
}