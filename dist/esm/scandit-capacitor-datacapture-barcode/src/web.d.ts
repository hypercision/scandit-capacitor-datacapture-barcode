import { WebPlugin } from '@capacitor/core';
import { ScanditBarcodePluginInterface } from './definitions';
export declare class ScanditBarcodePlugin extends WebPlugin implements ScanditBarcodePluginInterface {
    constructor();
    initialize(): Promise<any>;
}
declare const scanditBarcode: ScanditBarcodePlugin;
export { scanditBarcode };
