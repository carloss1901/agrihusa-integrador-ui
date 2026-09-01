import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PasswordHashService {
    private readonly algoritmo = 'PBKDF2';
    private readonly iteraciones = 100_000;
    private readonly longitudHash = 256;

    async crearHash(password: string): Promise<string> {
        const salt = crypto.getRandomValues(
            new Uint8Array(16)
        );

        const hash = await this.derivarHash(
            password,
            salt,
            this.iteraciones
        );

        return [
            this.algoritmo.toLowerCase(),
            this.iteraciones,
            this.convertirBase64(salt),
            this.convertirBase64(hash)
        ].join('$');
    }

    async verificar(
        password: string,
        passwordHash: string
    ): Promise<boolean> {
        try {
            const partes = passwordHash.split('$');

            if (
                partes.length !== 4 ||
                partes[0] !== this.algoritmo.toLowerCase()
            ) {
                return false;
            }

            const iteraciones = Number(partes[1]);

            if (
                !Number.isInteger(iteraciones) ||
                iteraciones <= 0
            ) {
                return false;
            }

            const salt = this.convertirBytes(partes[2]);
            const hashGuardado =
                this.convertirBytes(partes[3]);

            const hashCalculado = await this.derivarHash(
                password,
                salt,
                iteraciones
            );

            return this.compararBytes(
                hashCalculado,
                hashGuardado
            );
        } catch {
            return false;
        }
    }

    private async derivarHash(
        password: string,
        salt: Uint8Array,
        iteraciones: number
    ): Promise<Uint8Array> {
        const passwordBytes =
            new TextEncoder().encode(password);

        const passwordBuffer =
            this.convertirArrayBuffer(passwordBytes);

        const saltBuffer =
            this.convertirArrayBuffer(salt);

        const clave = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            this.algoritmo,
            false,
            ['deriveBits']
        );

        const resultado = await crypto.subtle.deriveBits(
            {
                name: this.algoritmo,
                hash: 'SHA-256',
                salt: saltBuffer,
                iterations: iteraciones
            },
            clave,
            this.longitudHash
        );

        return new Uint8Array(resultado);
    }

    private convertirBase64(
        value: Uint8Array
    ): string {
        let contenido = '';

        value.forEach((byte) => {
            contenido += String.fromCharCode(byte);
        });

        return btoa(contenido);
    }

    private convertirBytes(
        value: string
    ): Uint8Array {
        const contenido = atob(value);
        const bytes = new Uint8Array(contenido.length);

        for (let index = 0; index < contenido.length; index++) {
            bytes[index] = contenido.charCodeAt(index);
        }

        return bytes;
    }

    private convertirArrayBuffer(
        value: Uint8Array
    ): ArrayBuffer {
        const buffer = new ArrayBuffer(value.byteLength);
        const view = new Uint8Array(buffer);

        view.set(value);

        return buffer;
    }

    private compararBytes(
        valueA: Uint8Array,
        valueB: Uint8Array
    ): boolean {
        if (valueA.length !== valueB.length) {
            return false;
        }

        let diferencia = 0;

        for (let index = 0; index < valueA.length; index++) {
            diferencia |= valueA[index] ^ valueB[index];
        }

        return diferencia === 0;
    }
}