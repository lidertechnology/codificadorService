Informe: Uso de CodificadorService en Componentes para Trazabilidad Completa
Es un excelente caso de uso para tu CodificadorService. Al combinar los métodos de tu servicio, puedes crear una solución de trazabilidad de punta a punta, desde la materia prima hasta la entrega al cliente final.

El flujo de trabajo es el siguiente:

Registro de Ingredientes (Entrada): Cuando entra la harina a la fábrica, se le asigna un ID único con el TrazabilidadService.

Creación de Lote: La harina se une a otros ingredientes para crear un lote de sándwiches. A este lote se le asigna otro ID.

Registro del Producto Terminado: Cada sándwich final recibe su propio ID, vinculado al lote.

Registro de la Entrega (Salida): Al momento de la entrega, se registra la ubicación del cliente.

Toda esta información se codifica con tu CodificadorService y se guarda con el WriteService.

Aquí tienes un ejemplo de cómo implementarías esto en un componente para seguir el sándwich desde la entrada hasta la entrega.

Componente de Trazabilidad de Sándwiches
Este componente demuestra cómo orquestar los servicios TrazabilidadService, CodificadorService, WriteService y ReadService para una trazabilidad completa.

TypeScript

// src/app/componentes/trazabilidad-sandwich/trazabilidad-sandwich.component.ts
import { Component, signal, WritableSignal } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { TrazabilidadService } from '../../servicios/trazabilidad.service';
import { CodificadorService } from '../../servicios/codificador.service';
import { WriteService } from '../../servicios/write.service';
import { ReadService } from '../../servicios/read.service';
import { StatesEnum } from '../../enums/states.enum';

@Component({
  selector: 'app-trazabilidad-sandwich',
  standalone: true,
  template: `
    <div [ngSwitch]="states()">
      <div *ngSwitchCase="StatesEnum.LOADING">Procesando la trazabilidad...</div>
      <div *ngSwitchCase="StatesEnum.SUCCESS">Proceso completado.</div>
      <div *ngSwitchCase="StatesEnum.ERROR">Error en el proceso.</div>
    </div>
  `,
})
export class TrazabilidadSandwichComponent {
  public states: WritableSignal<StatesEnum> = signal(StatesEnum.DEFAULT);

  constructor(
    private trazabilidadService: TrazabilidadService,
    private codificadorService: CodificadorService,
    private writeService: WriteService,
    private readService: ReadService
  ) {}

  public async procesarTrazabilidadCompleta(): Promise<void> {
    this.states.set(StatesEnum.LOADING);
    try {
      // 1. Registro del producto (harina)
      const idHarina = this.trazabilidadService.generarIdProducto('harina');
      await this.writeService.crearDocumento('materias_primas', idHarina, {
        nombre: 'Harina de trigo',
        fechaIngreso: new Date(),
        codigoTrazabilidad: this.codificadorService.codificarParaQR(idHarina)
      });

      // 2. Creación del lote
      const idLote = this.trazabilidadService.generarIdLote('sandwich');
      await this.writeService.crearDocumento('lotes_produccion', idLote, {
        productoFinal: 'Sandwich',
        fechaProduccion: new Date(),
        ingredientes: [idHarina],
        codigoTrazabilidad: this.codificadorService.codificarParaQR(idLote)
      });

      // 3. Registro de un sándwich terminado
      const idSandwich = this.trazabilidadService.generarIdProductoTerminado('sandwich');
      await this.writeService.crearDocumento('productos_terminados', idSandwich, {
        idLote: idLote,
        nombre: 'Sandwich de pollo',
        fechaTerminado: new Date(),
        codigoTrazabilidad: this.codificadorService.codificarParaQR(idSandwich)
      });

      // 4. Registro de la venta y ubicación final del cliente
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const codigoGeo = this.codificadorService.geolocalizar(lat, lon);

      await this.writeService.crearDocumento('entregas', idSandwich, {
        idProducto: idSandwich,
        ubicacionFinal: codigoGeo,
        fechaEntrega: new Date()
      });

      this.states.set(StatesEnum.SUCCESS);
    } catch (error) {
      this.states.set(StatesEnum.ERROR);
    }
  }
}
