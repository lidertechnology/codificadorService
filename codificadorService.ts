// lidertechLibCentralModule/servicios/codificador.service.ts
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CodificadorService {
  /**
   * Codifica un string para ser usado en un código QR.
   * Usado en LiderEnterprice para trazabilidad de productos y LiderComerce para enlaces de pago.
   */
  public codificarParaQR(data: string): string {
    return `lidertech:qr:${data}`;
  }

  /**
   * Codifica un string para ser usado en un código de barras lineal.
   * Ideal para LiderEnterprice para inventario rápido y LiderAuto para identificación de partes.
   */
  public codificarParaBarcode(data: string): string {
    return data;
  }

  /**
   * Codifica un string para ser usado en un chip NFC.
   * Aplicable en LiderHome para activar dispositivos y en LiderAuto para sincronización rápida.
   */
  public codificarParaNFC(data: string): string {
    return `lidertech:nfc:${data}`;
  }

  /**
   * Codifica un string para un código Datamatrix.
   * Utilizado en LiderEnterprice y LiderMedicos para productos con poco espacio de etiquetado.
   */
  public codificarParaDatamatrix(data: string): string {
    return `lidertech:dm:${data}`;
  }

  /**
   * Genera un código de licencia alfanumérico.
   * Esencial en LiderGame para claves de producto y en LiderAcademy para accesos a cursos.
   */
  public generarCodigoLicencia(tipo: string): string {
    const id = uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
    return `${tipo.toUpperCase().replace(/\s/g, '_')}-${id}`;
  }

  /**
   * Genera un código promocional para marketing.
   * Utilizable en LiderMenu para descuentos y en LiderComerce para campañas.
   */
  public generarCodigoPromocional(campana: string): string {
    const id = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `${campana.toUpperCase().replace(/\s/g, '_')}-${id}`;
  }

  /**
   * Formatea coordenadas geográficas.
   * Usado en LiderAuto para rastreo de vehículos y en LiderEnterprice para logística.
   */
  public geolocalizar(latitud: number, longitud: number): string {
    return `lidertech:geo:${latitud},${longitud}`;
  }
}
