import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Symbology, SymbologySettings } from './Barcode';
export declare enum BarcodeTrackingScenario {
    A = "A",
    B = "B"
}
export declare class BarcodeTrackingSettings extends DefaultSerializeable {
    private scenario;
    private properties;
    private symbologies;
    get enabledSymbologies(): Symbology[];
    static forScenario(scenario: BarcodeTrackingScenario): BarcodeTrackingSettings;
    constructor();
    settingsForSymbology(symbology: Symbology): SymbologySettings;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
    enableSymbologies(symbologies: Symbology[]): void;
    enableSymbology(symbology: Symbology, enabled: boolean): void;
}
