import { ScanditBarcodeCountNativeInterface, ScanditBarcodePluginInterface } from './definitions';
export * from './definitions';
export declare class ScanditBarcodePluginImplementation implements ScanditBarcodePluginInterface {
    initialize(coreDefaults: any): Promise<any>;
}
export declare const ScanditBarcodePlugin: ScanditBarcodePluginImplementation;
export declare const ScanditBarcodeCountPluginNative: ScanditBarcodeCountNativeInterface;
