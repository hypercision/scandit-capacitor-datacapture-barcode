declare module '@capacitor/core' {
    interface PluginRegistry {
        ScanditBarcodePlugin: ScanditBarcodePluginInterface;
    }
}
export interface ScanditBarcodePluginInterface {
    initialize(): Promise<any>;
}
