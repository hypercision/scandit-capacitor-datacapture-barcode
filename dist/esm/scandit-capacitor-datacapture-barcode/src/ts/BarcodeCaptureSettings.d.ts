import { LocationSelection } from '../../../scandit-capacitor-datacapture-core/src/ts/LocationSelection';
import { DefaultSerializeable } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { CompositeType, Symbology, SymbologySettings } from './Barcode';
export declare class BarcodeCaptureSettings extends DefaultSerializeable {
    codeDuplicateFilter: number;
    locationSelection: Optional<LocationSelection>;
    enabledCompositeTypes: CompositeType[];
    private properties;
    private symbologies;
    private get compositeTypeDescriptions();
    get enabledSymbologies(): Symbology[];
    constructor();
    settingsForSymbology(symbology: Symbology): SymbologySettings;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
    enableSymbologies(symbologies: Symbology[]): void;
    enableSymbology(symbology: Symbology, enabled: boolean): void;
    enableSymbologiesForCompositeTypes(compositeTypes: CompositeType[]): void;
}
