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
import { crearPuertosLlegadaIniciales } from '../../features/puertos-llegada/data/puertos-llegada.seed';
import { PuertoLlegada } from '../../features/puertos-llegada/models/puerto-llegada.model';
import { crearProductosIniciales } from '../../features/productos/data/productos.seed';
import { Producto } from '../../features/productos/models/producto.model';
import { crearVariedadesIniciales } from '../../features/variedades/data/variedades.seed';
import { Variedad } from '../../features/variedades/models/variedad.model';
import { crearViasIniciales } from '../../features/vias/data/vias.seed';
import { Via } from '../../features/vias/models/via.model';
import { crearSituacionesIniciales } from '../../features/situaciones/data/situaciones.seed';
import { Situacion } from '../../features/situaciones/models/situacion.model';
import { crearDespachosIniciales } from '../../features/registro-despacho/data/despachos.seed';
import { Despacho } from '../../features/registro-despacho/models/despacho.model';


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
    this.inicializarPuertosLlegada();
    this.inicializarProductos();
    this.inicializarVariedades();
    this.inicializarVias();
    this.inicializarSituaciones();
    this.inicializarDespachos();
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

  private inicializarPuertosLlegada(): void {
    const puertosLlegada =
      this.localStorageService.obtener<PuertoLlegada[]>(
        STORAGE_KEYS.PUERTOS_LLEGADA
      );

    if (puertosLlegada === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.PUERTOS_LLEGADA,
        crearPuertosLlegadaIniciales()
      );
    }
  }

  private inicializarProductos(): void {
    const productos =
      this.localStorageService.obtener<Producto[]>(
        STORAGE_KEYS.PRODUCTOS
      );

    if (productos === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.PRODUCTOS,
        crearProductosIniciales()
      );
    }
  }

  private inicializarVariedades(): void {
    const variedades =
      this.localStorageService.obtener<Variedad[]>(
        STORAGE_KEYS.VARIEDADES
      );

    if (variedades === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.VARIEDADES,
        crearVariedadesIniciales()
      );
    }
  }

  private inicializarVias(): void {
    const vias =
      this.localStorageService.obtener<Via[]>(
        STORAGE_KEYS.VIAS
      );

    if (vias === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.VIAS,
        crearViasIniciales()
      );
    }
  }

  private inicializarSituaciones(): void {
  const situaciones =
    this.localStorageService.obtener<Situacion[]>(
      STORAGE_KEYS.SITUACIONES
    );

  if (situaciones === null) {
    this.localStorageService.guardar(
      STORAGE_KEYS.SITUACIONES,
      crearSituacionesIniciales()
    );
    }
  }

  private inicializarDespachos(): void {
    const despachos =
      this.localStorageService.obtener<Despacho[]>(
        STORAGE_KEYS.DESPACHOS
      );

    if (despachos === null) {
      this.localStorageService.guardar(
        STORAGE_KEYS.DESPACHOS,
        crearDespachosIniciales()
      );
    }
  }
} 