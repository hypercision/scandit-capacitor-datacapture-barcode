var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NoneLocationSelection } from '../../../scandit-capacitor-datacapture-core/src/ts/LocationSelection';
import { DefaultSerializeable, serializationDefault } from '../../../scandit-capacitor-datacapture-core/src/ts/Serializeable';
import { Capacitor } from './Capacitor/Capacitor';
export class BarcodeCaptureSettings extends DefaultSerializeable {
    constructor() {
        super();
        this.codeDuplicateFilter = Capacitor.defaults.BarcodeCapture.BarcodeCaptureSettings.codeDuplicateFilter;
        this.locationSelection = null;
        this.enabledCompositeTypes = [];
        this.properties = {};
        this.symbologies = {};
    }
    get compositeTypeDescriptions() {
        return Capacitor.defaults.CompositeTypeDescriptions.reduce((descriptions, description) => {
            descriptions[description.types[0]] = description;
            return descriptions;
        }, {});
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
    setProperty(name, value) {
        this.properties[name] = value;
    }
    getProperty(name) {
        return this.properties[name];
    }
    enableSymbologies(symbologies) {
        symbologies.forEach(symbology => this.enableSymbology(symbology, true));
    }
    enableSymbology(symbology, enabled) {
        this.settingsForSymbology(symbology).isEnabled = enabled;
    }
    enableSymbologiesForCompositeTypes(compositeTypes) {
        compositeTypes.forEach(compositeType => {
            this.enableSymbologies(this.compositeTypeDescriptions[compositeType].symbologies);
        });
    }
}
__decorate([
    serializationDefault(NoneLocationSelection)
], BarcodeCaptureSettings.prototype, "locationSelection", void 0);
//# sourceMappingURL=BarcodeCaptureSettings.js.map