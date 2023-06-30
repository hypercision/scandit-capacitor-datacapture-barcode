var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DefaultSerializeable, nameForSerialization, } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Capacitor } from './Capacitor/Capacitor';
export class BarcodeCountSettings extends DefaultSerializeable {
    constructor() {
        super();
        this.symbologies = {};
        this.properties = {};
        this._filterSettings = Capacitor.defaults.BarcodeCount.BarcodeCountSettings.barcodeFilterSettings;
        this._expectsOnlyUniqueBarcodes = Capacitor.defaults.BarcodeCount.BarcodeCountSettings.expectOnlyUniqueBarcodes;
    }
    get expectsOnlyUniqueBarcodes() {
        return this._expectsOnlyUniqueBarcodes;
    }
    get filterSettings() {
        return this._filterSettings;
    }
    get enabledSymbologies() {
        return Object.keys(this.symbologies)
            .filter(symbology => this.symbologies[symbology].isEnabled);
    }
    settingsForSymbology(symbology) {
        if (!this.symbologies[symbology]) {
            const symbologySettings = Capacitor.defaults.SymbologySettings[symbology];
            symbologySettings._symbology = symbology;
            this.symbologies[symbology] = symbologySettings;
        }
        return this.symbologies[symbology];
    }
    enableSymbologies(symbologies) {
        symbologies.forEach(symbology => this.enableSymbology(symbology, true));
    }
    enableSymbology(symbology, enabled) {
        this.settingsForSymbology(symbology).isEnabled = enabled;
    }
    setProperty(name, value) {
        this.properties[name] = value;
    }
    getProperty(name) {
        return this.properties[name];
    }
}
__decorate([
    nameForSerialization('filterSettings')
], BarcodeCountSettings.prototype, "_filterSettings", void 0);
__decorate([
    nameForSerialization('expectsOnlyUniqueBarcodes')
], BarcodeCountSettings.prototype, "_expectsOnlyUniqueBarcodes", void 0);
//# sourceMappingURL=BarcodeCountSettings.js.map